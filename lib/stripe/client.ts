// Stripe client configuration and helpers
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export const STRIPE_CONFIG = {
  priceId: process.env.STRIPE_PRICE_ID || '', // Monthly subscription price ID
  successUrl: process.env.NEXT_PUBLIC_URL + '/subscribe/success',
  cancelUrl: process.env.NEXT_PUBLIC_URL + '/subscribe',
  currency: 'usd',
  billingInterval: 'month' as const,
};

// Create a Stripe checkout session for subscription
export async function createCheckoutSession({
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  userEmail: string;
  successUrl?: string;
  cancelUrl?: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: STRIPE_CONFIG.priceId,
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      userId,
    },
    success_url: successUrl || STRIPE_CONFIG.successUrl,
    cancel_url: cancelUrl || STRIPE_CONFIG.cancelUrl,
    subscription_data: {
      metadata: {
        userId,
      },
    },
    allow_promotion_codes: true,
  });

  return session;
}

// Create a billing portal session for subscription management
export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Cancel a subscription
export async function cancelStripeSubscription(subscriptionId: string, cancelAtPeriodEnd = true) {
  if (cancelAtPeriodEnd) {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } else {
    return await stripe.subscriptions.cancel(subscriptionId);
  }
}

// Reactivate a cancelled subscription
export async function reactivateSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

// Get subscription details
export async function getStripeSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

// Create a one-time payment session for quiz/article purchase
export async function createOneTimePaymentSession({
  userId,
  userEmail,
  itemType,
  itemId,
  itemTitle,
  amount,
  successUrl,
  cancelUrl,
}: {
  userId?: string;
  userEmail: string;
  itemType: 'quiz' | 'article';
  itemId: string;
  itemTitle: string;
  amount: number; // in dollars
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: itemTitle,
            description: `${itemType === 'quiz' ? 'Quiz' : 'Article'}: ${itemTitle}`,
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      userId: userId || '',
      itemType,
      itemId,
      itemTitle,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}
