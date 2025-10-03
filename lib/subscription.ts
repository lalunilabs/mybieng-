// Subscription and premium content management with database persistence
import { prisma } from '@/lib/db';
import type { Subscription as PrismaSubscription } from '@prisma/client';

export const PREMIUM_PLAN = {
  price: 32,
  name: 'Premium Monthly',
  features: [
    'Listen to all articles with audio narration',
    'No ads across the product',
    '3 premium articles per month included',
    '2 free quizzes per month (<= $50 value each)',
    'Discounts on additional products (extra premium articles and quizzes)',
    'Priority AI chat support',
    'Advanced analytics dashboard'
  ],
  premiumArticlesLimit: 3,
  freeQuizzesLimit: 2,
  freeQuizValueCap: 50,
  articleDiscountPercent: 30,
  quizFreeAccess: false,
  quizDiscountPercent: 20,
  discountedQuizzesLimit: 3
};

// Individual item pricing
export const ITEM_PRICING = {
  quiz: 50,
  article: 50
};

// Helper to check if subscription needs cycle reset
function shouldResetCycle(subscription: PrismaSubscription): boolean {
  const now = new Date();
  const lastReset = subscription.lastCycleReset;
  return !isSameBillingMonth(now, lastReset);
}

function isSameBillingMonth(a: Date, b: Date): boolean {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth();
}

export async function createSubscription(
  userId: string,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
  stripePriceId?: string
): Promise<PrismaSubscription> {
  const now = new Date();
  const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  const subscription = await prisma!.subscription.create({
    data: {
      userId,
      plan: 'premium',
      status: 'active',
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      startDate: now,
      endDate,
      currentPeriodStart: now,
      currentPeriodEnd: endDate,
      premiumArticlesUsed: 0,
      premiumArticlesLimit: PREMIUM_PLAN.premiumArticlesLimit,
      freeQuizzesUsed: 0,
      freeQuizzesLimit: PREMIUM_PLAN.freeQuizzesLimit,
      freeQuizValueCap: PREMIUM_PLAN.freeQuizValueCap,
      discountedQuizzesUsed: 0,
      discountedQuizzesLimit: PREMIUM_PLAN.discountedQuizzesLimit,
      lastCycleReset: now
    }
  });
  
  return subscription;
}

export async function getSubscriptionByUserId(userId: string): Promise<PrismaSubscription | null> {
  const subscription = await prisma!.subscription.findUnique({
    where: { userId },
  });
  
  if (!subscription || subscription.status !== 'active') {
    return null;
  }
  
  // Check if cycle needs reset
  if (shouldResetCycle(subscription)) {
    return await resetSubscriptionCycle(subscription.id);
  }
  
  return subscription;
}

export async function getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<PrismaSubscription | null> {
  return await prisma!.subscription.findUnique({
    where: { stripeSubscriptionId },
  });
}

export async function isUserPremium(userId: string): Promise<boolean> {
  const subscription = await getSubscriptionByUserId(userId);
  return subscription ? subscription.endDate > new Date() && subscription.status === 'active' : false;
}

export async function canAccessPremiumArticle(userId: string): Promise<boolean> {
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) return false;
  
  return subscription.premiumArticlesUsed < subscription.premiumArticlesLimit;
}

export async function consumePremiumArticleCredit(userId: string): Promise<boolean> {
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) return false;
  
  const canAccess = await canAccessPremiumArticle(userId);
  if (!canAccess) return false;
  
  await prisma!.subscription.update({
    where: { id: subscription.id },
    data: { premiumArticlesUsed: { increment: 1 } }
  });
  
  return true;
}

// Calculate article price for a subscriber based on entitlements
export async function getArticlePriceForSubscriber(userId: string, basePrice: number): Promise<number | null> {
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) return null; // not a subscriber
  
  const canAccess = await canAccessPremiumArticle(userId);
  if (canAccess) return 0; // within free quota
  
  // Apply subscriber discount (30% off after free quota)
  const discounted = basePrice * (1 - PREMIUM_PLAN.articleDiscountPercent / 100);
  return Math.round(discounted * 100) / 100;
}

// Quizzes: subscribers get 2 free quizzes per month (<= $50 value each)
export async function canUseFreeQuiz(userId: string, basePrice: number): Promise<boolean> {
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) return false;
  
  return (
    subscription.freeQuizzesUsed < subscription.freeQuizzesLimit &&
    basePrice <= subscription.freeQuizValueCap
  );
}

export async function getQuizPriceForSubscriber(userId: string, basePrice: number): Promise<number | null> {
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) return null;
  
  const isFree = await canUseFreeQuiz(userId, basePrice);
  if (isFree) return 0;
  
  // Apply 20% discount on additional quizzes (up to 3 discounted quizzes)
  if (subscription.discountedQuizzesUsed < subscription.discountedQuizzesLimit) {
    const discounted = basePrice * (1 - PREMIUM_PLAN.quizDiscountPercent / 100);
    return Math.round(discounted * 100) / 100;
  }
  
  return basePrice; // no discount left
}

export async function markDiscountedQuizUsed(userId: string): Promise<boolean> {
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) return false;
  
  if (subscription.discountedQuizzesUsed < subscription.discountedQuizzesLimit) {
    await prisma!.subscription.update({
      where: { id: subscription.id },
      data: { discountedQuizzesUsed: { increment: 1 } }
    });
    return true;
  }
  return false;
}

export async function markFreeQuizUsed(userId: string): Promise<boolean> {
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) return false;
  
  if (subscription.freeQuizzesUsed < subscription.freeQuizzesLimit) {
    await prisma!.subscription.update({
      where: { id: subscription.id },
      data: { freeQuizzesUsed: { increment: 1 } }
    });
    return true;
  }
  return false;
}

// Relationship registry between paid articles and related quizzes (in-memory for now)
const relatedQuizByArticle: Record<string, string> = {};

export function registerRelatedQuiz(articleId: string, quizId: string) {
  relatedQuizByArticle[articleId] = quizId;
}

export function getRelatedQuizForArticle(articleId: string): string | undefined {
  return relatedQuizByArticle[articleId];
}

export async function getSubscriptionStats(userId: string) {
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) return null;
  
  return {
    plan: subscription.plan,
    status: subscription.status,
    premiumArticlesUsed: subscription.premiumArticlesUsed,
    premiumArticlesRemaining: subscription.premiumArticlesLimit - subscription.premiumArticlesUsed,
    freeQuizzesUsed: subscription.freeQuizzesUsed,
    freeQuizzesRemaining: subscription.freeQuizzesLimit - subscription.freeQuizzesUsed,
    freeQuizValueCap: subscription.freeQuizValueCap,
    discountedQuizzesUsed: subscription.discountedQuizzesUsed,
    discountedQuizzesRemaining: subscription.discountedQuizzesLimit - subscription.discountedQuizzesUsed,
    endDate: subscription.endDate,
    currentPeriodEnd: subscription.currentPeriodEnd,
    daysRemaining: Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
  };
}

export async function cancelSubscription(userId: string, cancelAtPeriodEnd: boolean = true): Promise<boolean> {
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) return false;
  
  await prisma!.subscription.update({
    where: { id: subscription.id },
    data: {
      cancelAtPeriodEnd,
      canceledAt: new Date(),
      ...(cancelAtPeriodEnd ? {} : { status: 'cancelled', endDate: new Date() })
    }
  });
  
  return true;
}

async function resetSubscriptionCycle(subscriptionId: string): Promise<PrismaSubscription> {
  const now = new Date();
  const newPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  return await prisma!.subscription.update({
    where: { id: subscriptionId },
    data: {
      premiumArticlesUsed: 0,
      freeQuizzesUsed: 0,
      discountedQuizzesUsed: 0,
      lastCycleReset: now,
      currentPeriodStart: now,
      currentPeriodEnd: newPeriodEnd
    }
  });
}

export async function updateSubscriptionFromStripe(
  stripeSubscriptionId: string,
  data: {
    status?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  }
): Promise<PrismaSubscription | null> {
  const subscription = await getSubscriptionByStripeId(stripeSubscriptionId);
  if (!subscription) return null;
  
  return await prisma!.subscription.update({
    where: { id: subscription.id },
    data
  });
}

// Manual discount management
export async function createManualDiscount(discountData: {
  code: string;
  description: string;
  discountPercent: number;
  itemType: 'quiz' | 'article';
  itemId?: string;
  validFrom: Date;
  validUntil: Date;
  maxUses: number;
  createdBy?: string;
}) {
  return await prisma!.manualDiscount.create({
    data: {
      ...discountData,
      isActive: true
    }
  });
}

export async function getDiscountByCode(code: string) {
  const now = new Date();
  const discount = await prisma!.manualDiscount.findFirst({
    where: {
      code,
      isActive: true,
      validFrom: { lte: now },
      validUntil: { gte: now }
    }
  });
  
  // Check if usage limit reached
  if (discount && discount.currentUses >= discount.maxUses) {
    return null;
  }
  
  return discount;
}

export async function applyDiscount(discountCode: string): Promise<{ discountPercent: number; code: string } | null> {
  const discount = await getDiscountByCode(discountCode);
  if (!discount) return null;
  
  // Increment usage
  await prisma!.manualDiscount.update({
    where: { id: discount.id },
    data: { currentUses: { increment: 1 } }
  });
  
  return {
    discountPercent: discount.discountPercent,
    code: discount.code
  };
}
