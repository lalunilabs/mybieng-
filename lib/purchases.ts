// Database-backed purchases for quiz and article access
import { getQuizPriceForSubscriber, isUserPremium, markDiscountedQuizUsed, canUseFreeQuiz, markFreeQuizUsed } from '@/lib/subscription';
import { loadQuizBySlug } from '@/lib/content';
import { prisma } from '@/lib/db';

export async function hasPurchasedQuiz(userId: string | null, slug: string): Promise<boolean> {
  if (!userId) return false;
  
  const purchase = await prisma!.purchase.findFirst({
    where: {
      userId,
      type: 'quiz',
      itemId: slug
    }
  });
  
  return !!purchase;
}

export async function recordPurchase({
  userId,
  sessionId,
  type,
  itemId,
  itemTitle,
  basePrice,
  pricePaid,
  discountApplied = 0,
  paymentMethod,
  stripePaymentId,
  metadata
}: {
  userId?: string;
  sessionId?: string;
  type: 'quiz' | 'article';
  itemId: string;
  itemTitle: string;
  basePrice: number;
  pricePaid: number;
  discountApplied?: number;
  paymentMethod?: string;
  stripePaymentId?: string;
  metadata?: any;
}) {
  return await prisma!.purchase.create({
    data: {
      userId,
      sessionId,
      type,
      itemId,
      itemTitle,
      basePrice,
      pricePaid,
      discountApplied,
      paymentMethod,
      stripePaymentId,
      metadata: metadata ? JSON.stringify(metadata) : null
    }
  });
}

export async function getQuizAccess(userId: string | null | undefined, slug: string) {
  const quiz = loadQuizBySlug(slug);
  if (!quiz) return { exists: false } as const;

  const basePrice = typeof quiz.price === 'number' ? quiz.price : 0;
  const isPaid = !!quiz.isPaid && basePrice > 0;

  // Free quizzes: always accessible
  if (!isPaid) {
    return {
      exists: true,
      hasAccess: true,
      isPaid: false as const,
      basePrice: 0,
      finalPrice: 0,
      isSubscriber: false,
      purchased: false,
    };
  }

  const purchased = userId ? await hasPurchasedQuiz(userId, slug) : false;
  const isSubscriber = userId ? await isUserPremium(userId) : false;

  if (purchased) {
    return {
      exists: true,
      hasAccess: true,
      isPaid: true as const,
      basePrice,
      finalPrice: 0,
      isSubscriber,
      purchased: true,
    };
  }

  let finalPrice = basePrice;
  if (userId && isSubscriber) {
    const subscriberPrice = await getQuizPriceForSubscriber(userId, basePrice);
    if (subscriberPrice !== null) {
      finalPrice = subscriberPrice;
    }
  }

  return {
    exists: true,
    hasAccess: false,
    isPaid: true as const,
    basePrice,
    finalPrice,
    isSubscriber,
    purchased: false,
  };
}

export async function purchaseQuiz(userId: string, slug: string, sessionId?: string) {
  const quiz = loadQuizBySlug(slug);
  if (!quiz) return { ok: false, error: 'Quiz not found' } as const;

  const basePrice = typeof quiz.price === 'number' ? quiz.price : 0;
  const isPaid = !!quiz.isPaid && basePrice > 0;

  // Already purchased
  if (await hasPurchasedQuiz(userId, slug)) {
    const existingPurchase = await prisma!.purchase.findFirst({
      where: { userId, type: 'quiz', itemId: slug }
    });
    return { ok: true, purchase: existingPurchase } as const;
  }

  // Compute price considering subscription
  let finalPrice = basePrice;
  let paymentMethod = 'free';
  const subscriberPrice = await getQuizPriceForSubscriber(userId, basePrice);
  
  if (subscriberPrice !== null) {
    finalPrice = subscriberPrice;
    
    // Track discounted quota usage only when a discounted (non-free) purchase happens
    if (subscriberPrice > 0 && subscriberPrice < basePrice) {
      await markDiscountedQuizUsed(userId);
      paymentMethod = 'subscription';
    }
    
    // Track free quiz allowance usage when a paid quiz becomes free for a subscriber
    if (isPaid && finalPrice === 0 && await canUseFreeQuiz(userId, basePrice)) {
      await markFreeQuizUsed(userId);
      paymentMethod = 'subscription';
    }
  }

  // Record purchase
  const purchase = await recordPurchase({
    userId,
    sessionId,
    type: 'quiz',
    itemId: slug,
    itemTitle: quiz.title,
    basePrice,
    pricePaid: finalPrice,
    discountApplied: basePrice - finalPrice,
    paymentMethod,
    metadata: { quizSlug: slug }
  });
  
  return { ok: true, purchase } as const;
}
