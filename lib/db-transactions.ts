import { prisma } from './db';
import { Prisma } from '@prisma/client';

/**
 * Database transaction utilities for complex operations
 * Ensures atomicity and consistency
 */

/**
 * Execute operations within a transaction
 * Automatically rolls back if any operation fails
 */
export async function withTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(callback, {
    maxWait: 5000, // Max time to wait for transaction to start
    timeout: 10000 // Max time transaction can run
    // Note: SQLite only supports Serializable isolation level
  });
}

/**
 * Create quiz submission with answers atomically
 */
export async function createQuizSubmissionTransaction(data: {
  sessionId: string;
  userId?: string;
  quizSlug: string;
  total: number;
  bandLabel: string;
  metadata: string;
  answers: Array<{
    question: string;
    value: number;
  }>;
}) {
  return withTransaction(async (tx) => {
    // Create quiz run
    const quizRun = await tx.quizRun.create({
      data: {
        sessionId: data.sessionId,
        userId: data.userId || null,
        quizSlug: data.quizSlug,
        total: data.total,
        bandLabel: data.bandLabel,
        metadata: data.metadata,
        completed: true
      }
    });

    // Create all answers
    await tx.quizAnswer.createMany({
      data: data.answers.map(answer => ({
        runId: quizRun.id,
        question: answer.question,
        value: answer.value
      }))
    });

    // Log analytics
    await tx.analytics.create({
      data: {
        event: 'quiz_completed',
        sessionId: data.sessionId,
        userId: data.userId || null,
        data: JSON.stringify({
          quizSlug: data.quizSlug,
          total: data.total,
          bandLabel: data.bandLabel
        })
      }
    });

    return quizRun;
  });
}

/**
 * Create or update user subscription atomically
 */
export async function upsertSubscriptionTransaction(data: {
  userId: string;
  plan: string;
  status: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  endDate: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}) {
  return withTransaction(async (tx) => {
    // Upsert subscription
    const subscription = await tx.subscription.upsert({
      where: { userId: data.userId },
      create: {
        userId: data.userId,
        plan: data.plan,
        status: data.status,
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        stripePriceId: data.stripePriceId,
        endDate: data.endDate,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        lastCycleReset: new Date()
      },
      update: {
        status: data.status,
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        stripePriceId: data.stripePriceId,
        endDate: data.endDate,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd
      }
    });

    // Log subscription event
    await tx.analytics.create({
      data: {
        event: data.status === 'active' ? 'subscription_activated' : 'subscription_updated',
        userId: data.userId,
        data: JSON.stringify({
          plan: data.plan,
          status: data.status,
          subscriptionId: data.stripeSubscriptionId
        })
      }
    });

    return subscription;
  });
}

/**
 * Reset monthly subscription entitlements
 */
export async function resetSubscriptionEntitlements(userId: string) {
  return withTransaction(async (tx) => {
    const subscription = await tx.subscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Check if cycle reset is needed
    const now = new Date();
    const lastReset = new Date(subscription.lastCycleReset);
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceReset >= 30) {
      await tx.subscription.update({
        where: { userId },
        data: {
          premiumArticlesUsed: 0,
          freeQuizzesUsed: 0,
          discountedQuizzesUsed: 0,
          lastCycleReset: now
        }
      });

      await tx.analytics.create({
        data: {
          event: 'subscription_cycle_reset',
          userId,
          data: JSON.stringify({
            previousReset: lastReset,
            newReset: now
          })
        }
      });
    }
  });
}

/**
 * Track content purchase with entitlement updates
 */
export async function trackContentPurchase(data: {
  userId?: string;
  sessionId?: string;
  type: 'quiz' | 'article';
  itemId: string;
  itemTitle: string;
  basePrice: number;
  pricePaid: number;
  discountApplied: number;
  paymentMethod: string;
  stripePaymentId?: string;
  metadata?: string;
}) {
  return withTransaction(async (tx) => {
    // Create purchase record
    const purchase = await tx.purchase.create({
      data: {
        userId: data.userId || null,
        sessionId: data.sessionId || null,
        type: data.type,
        itemId: data.itemId,
        itemTitle: data.itemTitle,
        basePrice: data.basePrice,
        pricePaid: data.pricePaid,
        discountApplied: data.discountApplied,
        paymentMethod: data.paymentMethod,
        stripePaymentId: data.stripePaymentId,
        metadata: data.metadata
      }
    });

    // Update subscription entitlements if applicable
    if (data.userId && data.paymentMethod === 'subscription') {
      const subscription = await tx.subscription.findUnique({
        where: { userId: data.userId }
      });

      if (subscription) {
        if (data.type === 'article') {
          await tx.subscription.update({
            where: { userId: data.userId },
            data: {
              premiumArticlesUsed: subscription.premiumArticlesUsed + 1
            }
          });
        } else if (data.type === 'quiz' && data.pricePaid === 0) {
          await tx.subscription.update({
            where: { userId: data.userId },
            data: {
              freeQuizzesUsed: subscription.freeQuizzesUsed + 1
            }
          });
        } else if (data.type === 'quiz' && data.discountApplied > 0) {
          await tx.subscription.update({
            where: { userId: data.userId },
            data: {
              discountedQuizzesUsed: subscription.discountedQuizzesUsed + 1
            }
          });
        }
      }
    }

    // Log analytics
    await tx.analytics.create({
      data: {
        event: 'content_purchased',
        userId: data.userId || null,
        sessionId: data.sessionId || null,
        data: JSON.stringify({
          type: data.type,
          itemId: data.itemId,
          pricePaid: data.pricePaid,
          paymentMethod: data.paymentMethod
        })
      }
    });

    return purchase;
  });
}

/**
 * Create AI conversation with initial message
 */
export async function createAIConversationTransaction(data: {
  userId?: string;
  sessionId?: string;
  mode: string;
  contextType?: string;
  contextId?: string;
  initialMessage: {
    role: string;
    content: string;
    metadata?: string;
  };
}) {
  return withTransaction(async (tx) => {
    // Create conversation
    const conversation = await tx.aIConversation.create({
      data: {
        userId: data.userId || null,
        sessionId: data.sessionId || null,
        mode: data.mode,
        contextType: data.contextType,
        contextId: data.contextId
      }
    });

    // Create initial message
    await tx.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: data.initialMessage.role,
        content: data.initialMessage.content,
        metadata: data.initialMessage.metadata
      }
    });

    // Log analytics
    await tx.analytics.create({
      data: {
        event: 'ai_conversation_started',
        userId: data.userId || null,
        sessionId: data.sessionId || null,
        data: JSON.stringify({
          mode: data.mode,
          contextType: data.contextType,
          contextId: data.contextId
        })
      }
    });

    return conversation;
  });
}

/**
 * Batch operations helper
 */
export async function batchOperation<T, R>(
  items: T[],
  operation: (item: T, tx: Prisma.TransactionClient) => Promise<R>,
  batchSize: number = 100
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await withTransaction(async (tx) => {
      return Promise.all(batch.map(item => operation(item, tx)));
    });
    results.push(...batchResults);
  }
  
  return results;
}
