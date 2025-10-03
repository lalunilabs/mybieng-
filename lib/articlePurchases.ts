import { loadArticleBySlug } from '@/lib/content';
import { getArticlePriceForSubscriber, canAccessPremiumArticle, consumePremiumArticleCredit, isUserPremium } from '@/lib/subscription';
import { prisma } from '@/lib/db';
import { recordPurchase } from '@/lib/purchases';

export async function hasPurchasedArticle(userId: string | null, slug: string): Promise<boolean> {
  if (!userId) return false;
  
  const purchase = await prisma!.purchase.findFirst({
    where: {
      userId,
      type: 'article',
      itemId: slug
    }
  });
  
  return !!purchase;
}

export async function unlockArticleForSubscriber(userId: string, slug: string): Promise<boolean> {
  // Check if already unlocked (purchased)
  if (await hasPurchasedArticle(userId, slug)) return true;
  
  const article = loadArticleBySlug(slug);
  if (!article) return false;
  
  // Only premium articles count toward allowance
  if (!article.isPremium) return true;
  
  if (!await canAccessPremiumArticle(userId)) return false;
  
  const ok = await consumePremiumArticleCredit(userId);
  if (ok) {
    // Record as a free purchase (using subscription allowance)
    await recordPurchase({
      userId,
      type: 'article',
      itemId: slug,
      itemTitle: article.title,
      basePrice: typeof article.price === 'number' ? article.price : 0,
      pricePaid: 0,
      paymentMethod: 'subscription',
      metadata: { unlockedViaSubscription: true }
    });
    return true;
  }
  
  return false;
}

export async function getArticleAccess(userId: string | null | undefined, slug: string) {
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

  const purchased = userId ? await hasPurchasedArticle(userId, slug) : false;
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

  // Subscribers may have free access via allowance
  if (userId && isSubscriber) {
    // Check price for subscriber (may be 0 if within allowance)
    const priceForSub = await getArticlePriceForSubscriber(userId, basePrice);
    if (priceForSub === 0) {
      // Auto-unlock and consume allowance on access check
      await unlockArticleForSubscriber(userId, slug);
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

export async function purchaseArticle(userId: string, slug: string, sessionId?: string) {
  const article = loadArticleBySlug(slug);
  if (!article) return { ok: false, error: 'Article not found' } as const;

  const basePrice = typeof article.price === 'number' ? article.price : 0;
  const isPaid = !!article.isPremium && basePrice > 0;

  // Check if already purchased
  if (await hasPurchasedArticle(userId, slug)) {
    const existingPurchase = await prisma!.purchase.findFirst({
      where: { userId, type: 'article', itemId: slug }
    });
    return { ok: true, purchase: existingPurchase } as const;
  }

  // Subscriber pricing
  const subPrice = await getArticlePriceForSubscriber(userId, basePrice);
  let finalPrice = isPaid ? basePrice : 0;
  if (subPrice !== null) {
    finalPrice = subPrice;
  }

  // If price is 0 for subscriber due to allowance, unlock and record
  if (isPaid && finalPrice === 0) {
    await unlockArticleForSubscriber(userId, slug);
    const p = await prisma!.purchase.findFirst({
      where: { userId, type: 'article', itemId: slug }
    });
    return { ok: true, purchase: p } as const;
  }

  if (!isPaid || finalPrice === 0) {
    const p = await recordPurchase({
      userId,
      sessionId,
      type: 'article',
      itemId: slug,
      itemTitle: article.title,
      basePrice,
      pricePaid: 0,
      paymentMethod: 'free',
      metadata: { articleSlug: slug }
    });
    return { ok: true, purchase: p } as const;
  }

  // Record purchase (payment happens via Stripe in real flow)
  const purchase = await recordPurchase({
    userId,
    sessionId,
    type: 'article',
    itemId: slug,
    itemTitle: article.title,
    basePrice,
    pricePaid: finalPrice,
    discountApplied: basePrice - finalPrice,
    paymentMethod: 'subscription',
    metadata: { articleSlug: slug }
  });
  
  return { ok: true, purchase } as const;
}
