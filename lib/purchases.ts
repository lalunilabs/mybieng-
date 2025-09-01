// In-memory purchases store and helpers for quiz access
import { getQuizPriceForSubscriber, isUserPremium, markDiscountedQuizUsed } from '@/lib/subscription';
import { loadQuizBySlug } from '@/lib/content';

export interface QuizPurchase {
  id: string;
  email: string;
  slug: string;
  pricePaid: number;
  purchasedAt: Date;
}

const quizPurchases: QuizPurchase[] = [];

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export function hasPurchasedQuiz(email: string, slug: string): boolean {
  if (!email) return false;
  return quizPurchases.some(p => p.email === email && p.slug === slug);
}

export function recordQuizPurchase(email: string, slug: string, pricePaid: number): QuizPurchase {
  const purchase: QuizPurchase = {
    id: genId(),
    email,
    slug,
    pricePaid,
    purchasedAt: new Date()
  };
  quizPurchases.push(purchase);
  return purchase;
}

export function getQuizAccess(email: string | null | undefined, slug: string) {
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

  const userEmail = email || undefined;
  const purchased = userEmail ? hasPurchasedQuiz(userEmail, slug) : false;
  const isSubscriber = userEmail ? isUserPremium(userEmail) : false;

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
  if (userEmail && isSubscriber) {
    const subscriberPrice = getQuizPriceForSubscriber(userEmail, basePrice);
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

export function purchaseQuiz(email: string, slug: string) {
  const quiz = loadQuizBySlug(slug);
  if (!quiz) return { ok: false, error: 'Quiz not found' } as const;

  const basePrice = typeof quiz.price === 'number' ? quiz.price : 0;
  const isPaid = !!quiz.isPaid && basePrice > 0;

  // Already purchased
  if (hasPurchasedQuiz(email, slug)) {
    return { ok: true, purchase: recordQuizPurchase(email, slug, 0) } as const;
  }

  // Compute price considering subscription
  let finalPrice = basePrice;
  const subscriberPrice = getQuizPriceForSubscriber(email, basePrice);
  if (subscriberPrice !== null) {
    finalPrice = subscriberPrice;
  }

  // Track discounted quota usage only when a discounted (non-free) purchase happens
  if (subscriberPrice !== null && subscriberPrice > 0 && subscriberPrice < basePrice) {
    markDiscountedQuizUsed(email);
  }

  // Free (shouldn't happen for paid quizzes unless plan grants free access), but support it
  if (!isPaid || finalPrice === 0) {
    const p = recordQuizPurchase(email, slug, 0);
    return { ok: true, purchase: p } as const;
  }

  // Mock payment success and record purchase
  const purchase = recordQuizPurchase(email, slug, finalPrice);
  return { ok: true, purchase } as const;
}
