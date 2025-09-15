import { loadArticleBySlug } from '@/lib/content';
import { getArticlePriceForSubscriber, canAccessPremiumArticle, consumePremiumArticleCredit, isUserPremium } from '@/lib/subscription';

export interface ArticlePurchase {
  id: string;
  email: string;
  slug: string; // article slug
  pricePaid: number;
  purchasedAt: Date;
}

const articlePurchases: ArticlePurchase[] = [];
const articleUnlocks: { email: string; slug: string; unlockedAt: Date }[] = [];

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export function hasPurchasedArticle(email: string, slug: string): boolean {
  if (!email) return false;
  return articlePurchases.some(p => p.email === email && p.slug === slug);
}

export function recordArticlePurchase(email: string, slug: string, pricePaid: number): ArticlePurchase {
  const purchase: ArticlePurchase = {
    id: genId(),
    email,
    slug,
    pricePaid,
    purchasedAt: new Date()
  };
  articlePurchases.push(purchase);
  return purchase;
}

export function hasUnlockedArticle(email: string, slug: string): boolean {
  return articleUnlocks.some(u => u.email === email && u.slug === slug);
}

export function unlockArticleForSubscriber(email: string, slug: string): boolean {
  // Avoid double consumption
  if (hasUnlockedArticle(email, slug)) return true;
  const article = loadArticleBySlug(slug);
  if (!article) return false;
  // Only premium articles count toward allowance
  if (!article.isPremium) return true;
  if (!canAccessPremiumArticle(email)) return false;
  const ok = consumePremiumArticleCredit(email);
  if (ok) {
    articleUnlocks.push({ email, slug, unlockedAt: new Date() });
    return true;
  }
  return false;
}

export function getArticleAccess(email: string | null | undefined, slug: string) {
  const article = loadArticleBySlug(slug);
  if (!article) return { exists: false } as const;

  const basePrice = typeof article.price === 'number' ? article.price : 0;
  const isPaid = !!article.isPremium && basePrice > 0;

  // Free articles: always accessible
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
  const purchased = userEmail ? hasPurchasedArticle(userEmail, slug) : false;
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

  // Subscribers may have free access via allowance
  if (userEmail && isSubscriber) {
    // If already unlocked earlier this cycle, keep access free
    if (hasUnlockedArticle(userEmail, slug)) {
      return {
        exists: true,
        hasAccess: true,
        isPaid: true as const,
        basePrice,
        finalPrice: 0,
        isSubscriber,
        purchased: false,
      };
    }

    // Check price for subscriber (may be 0 if within allowance)
    const priceForSub = getArticlePriceForSubscriber(userEmail, basePrice);
    if (priceForSub === 0) {
      // Auto-unlock and consume allowance on access check
      unlockArticleForSubscriber(userEmail, slug);
      return {
        exists: true,
        hasAccess: true,
        isPaid: true as const,
        basePrice,
        finalPrice: 0,
        isSubscriber,
        purchased: false,
      };
    }

    // Discounted price after allowances
    if (priceForSub !== null) {
      return {
        exists: true,
        hasAccess: false,
        isPaid: true as const,
        basePrice,
        finalPrice: priceForSub,
        isSubscriber,
        purchased: false,
      };
    }
  }

  // Non-subscriber or no special pricing
  return {
    exists: true,
    hasAccess: false,
    isPaid: true as const,
    basePrice,
    finalPrice: basePrice,
    isSubscriber,
    purchased: false,
  };
}

export function purchaseArticle(email: string, slug: string) {
  const article = loadArticleBySlug(slug);
  if (!article) return { ok: false, error: 'Article not found' } as const;

  const basePrice = typeof article.price === 'number' ? article.price : 0;
  const isPaid = !!article.isPremium && basePrice > 0;

  if (hasPurchasedArticle(email, slug)) {
    return { ok: true, purchase: recordArticlePurchase(email, slug, 0) } as const;
  }

  // Subscriber pricing
  const subPrice = getArticlePriceForSubscriber(email, basePrice);
  let finalPrice = isPaid ? basePrice : 0;
  if (subPrice !== null) {
    finalPrice = subPrice;
  }

  // If price is 0 for subscriber due to allowance, unlock and record
  if (isPaid && finalPrice === 0) {
    unlockArticleForSubscriber(email, slug);
    const p = recordArticlePurchase(email, slug, 0);
    return { ok: true, purchase: p } as const;
  }

  if (!isPaid || finalPrice === 0) {
    const p = recordArticlePurchase(email, slug, 0);
    return { ok: true, purchase: p } as const;
  }

  // Mock payment and record purchase
  const purchase = recordArticlePurchase(email, slug, finalPrice);
  return { ok: true, purchase } as const;
}
