// Stripe webhook event handlers
import Stripe from 'stripe';
import { stripe } from './client';
import { 
  createSubscription, 
  updateSubscriptionFromStripe,
  getSubscriptionByStripeId 
} from '@/lib/subscription';
import { recordPurchase } from '@/lib/purchases';
import { prisma } from '@/lib/db';
import { sendEmail, EmailType } from '@/lib/email/service';

export async function handleStripeWebhook(event: Stripe.Event) {
  try {
    // Skip if already processed
    const existing = await prisma!.webhookEvent.findUnique({ where: { eventId: event.id } });
    if (existing?.processed) {
      console.log(`Skipping already processed webhook ${event.id}`);
      return;
    }

    // Log or update webhook event record idempotently
    await upsertWebhookEvent(event);
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark webhook as processed
    await markWebhookProcessed(event.id);
  } catch (error) {
    console.error(`Error processing webhook ${event.id}:`, error);
    await markWebhookError(event.id, error);
    throw error;
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId || session.client_reference_id;
  if (!userId) {
    console.error('No userId in checkout session metadata');
    return;
  }

  // Get user
  const user = await prisma!.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.error(`User not found: ${userId}`);
    return;
  }

  // Handle subscription checkout
  if (session.mode === 'subscription' && session.subscription) {
    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await createSubscription(
      userId,
      subscription.customer as string,
      subscription.id,
      subscription.items.data[0]?.price.id
    );

    // Send welcome email
    await sendEmail({
      to: user.email,
      type: EmailType.SUBSCRIPTION_WELCOME,
      data: {
        name: user.name || user.email,
        subscriptionId: subscription.id,
      },
    });
  }

  // Handle one-time payment for quiz/article
  if (session.mode === 'payment' && session.metadata) {
    const { itemType, itemId, itemTitle } = session.metadata;
    const amount = session.amount_total ? session.amount_total / 100 : 0;

    if (itemType && itemId) {
      await recordPurchase({
        userId,
        type: itemType as 'quiz' | 'article',
        itemId,
        itemTitle: itemTitle || itemId,
        basePrice: amount,
        pricePaid: amount,
        paymentMethod: 'stripe',
        stripePaymentId: session.payment_intent as string,
        metadata: { checkoutSessionId: session.id },
      });

      // Send receipt email
      await sendEmail({
        to: user.email,
        type: EmailType.PURCHASE_RECEIPT,
        data: {
          name: user.name || user.email,
          itemType,
          itemTitle: itemTitle || itemId,
          amount,
        },
      });
    }
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log(`Subscription created: ${subscription.id}`);
  // Most handling done in checkout.session.completed
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await updateSubscriptionFromStripe(subscription.id, {
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });

  // If subscription was reactivated
  if (!subscription.cancel_at_period_end && subscription.status === 'active') {
    const dbSub = await getSubscriptionByStripeId(subscription.id);
    if (dbSub) {
      const user = await prisma!.user.findUnique({ where: { id: dbSub.userId } });
      if (user) {
        await sendEmail({
          to: user.email,
          type: EmailType.SUBSCRIPTION_REACTIVATED,
          data: { name: user.name || user.email },
        });
      }
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await updateSubscriptionFromStripe(subscription.id, {
    status: 'cancelled',
  });

  const dbSub = await getSubscriptionByStripeId(subscription.id);
  if (dbSub) {
    const user = await prisma!.user.findUnique({ where: { id: dbSub.userId } });
    if (user) {
      await sendEmail({
        to: user.email,
        type: EmailType.SUBSCRIPTION_CANCELLED,
        data: { name: user.name || user.email },
      });
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Send receipt for successful payment
  const subscription = invoice.subscription as string;
  if (subscription) {
    const dbSub = await getSubscriptionByStripeId(subscription);
    if (dbSub) {
      const user = await prisma!.user.findUnique({ where: { id: dbSub.userId } });
      if (user) {
        await sendEmail({
          to: user.email,
          type: EmailType.PAYMENT_SUCCESS,
          data: {
            name: user.name || user.email,
            amount: invoice.amount_paid / 100,
            invoiceUrl: invoice.hosted_invoice_url,
          },
        });
      }
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // Notify user of failed payment
  const subscription = invoice.subscription as string;
  if (subscription) {
    const dbSub = await getSubscriptionByStripeId(subscription);
    if (dbSub) {
      const user = await prisma!.user.findUnique({ where: { id: dbSub.userId } });
      if (user) {
        await sendEmail({
          to: user.email,
          type: EmailType.PAYMENT_FAILED,
          data: {
            name: user.name || user.email,
            amount: invoice.amount_due / 100,
          },
        });
      }

      // Update subscription status
      await updateSubscriptionFromStripe(subscription, {
        status: 'past_due',
      });
    }
  }
}

// Helper functions for webhook logging (idempotent)
async function upsertWebhookEvent(event: Stripe.Event) {
  await prisma!.webhookEvent.upsert({
    where: { eventId: event.id },
    update: {
      payload: JSON.stringify(event),
      retryCount: { increment: 1 },
    },
    create: {
      provider: 'stripe',
      eventType: event.type,
      eventId: event.id,
      payload: JSON.stringify(event),
      processed: false,
    },
  });
}

async function markWebhookProcessed(eventId: string) {
  await prisma!.webhookEvent.updateMany({
    where: { eventId },
    data: {
      processed: true,
      processedAt: new Date(),
    },
  });
}

async function markWebhookError(eventId: string, error: any) {
  await prisma!.webhookEvent.updateMany({
    where: { eventId },
    data: {
      errorMessage: error.message || String(error),
      retryCount: { increment: 1 },
    },
  });
}

// Verify Stripe webhook signature
export function verifyStripeWebhook(payload: string | Buffer, signature: string): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET not configured');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}
