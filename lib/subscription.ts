// Subscription and premium content management
export interface Subscription {
  id: string;
  userId: string;
  email: string;
  plan: 'premium';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  price: number;
  premiumArticlesUsed: number;
  premiumArticlesLimit: number;
  // Entitlements and usage tracking
  freeQuizzesUsed: number;
  freeQuizzesLimit: number;
  freeQuizValueCap: number; // Max base price eligible for free quiz
  articleDiscountPercent: number; // discount after free quota
  quizFreeAccess: boolean; // subscribers get quizzes for free
  quizDiscountPercent: number; // discount for paid quizzes if free not applicable
  discountedQuizzesUsed: number;
  discountedQuizzesLimit: number;
  // Manual discounts applied by admin
  manualDiscounts: ManualDiscount[];
  // Cycle tracking to reset monthly usage
  lastCycleReset: Date;
}

export interface ManualDiscount {
  id: string;
  code: string;
  description: string;
  discountPercent: number;
  itemType: 'quiz' | 'article';
  itemId?: string; // Specific item ID or undefined for category-wide
  validFrom: Date;
  validUntil: Date;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  subscription?: Subscription;
  likedArticles: string[];
  // Manual discounts applied to this user
  userDiscounts: UserDiscount[];
}

export interface UserDiscount {
  discountId: string;
  appliedAt: Date;
  itemType: 'quiz' | 'article';
  itemId?: string;
  originalPrice: number;
  discountedPrice: number;
}

// In-memory storage (replace with database in production)
let subscriptions: Subscription[] = [];
let users: User[] = [];

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

export function createUser(email: string): User {
  const user: User = {
    id: generateId(),
    email,
    likedArticles: [],
    userDiscounts: []
  };
  users.push(user);
  return user;
}

export function getUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

export function createSubscription(email: string): Subscription {
  const user = getUserByEmail(email) || createUser(email);
  
  const subscription: Subscription = {
    id: generateId(),
    userId: user.id,
    email,
    plan: 'premium',
    status: 'active',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    price: PREMIUM_PLAN.price,
    premiumArticlesUsed: 0,
    premiumArticlesLimit: PREMIUM_PLAN.premiumArticlesLimit,
    freeQuizzesUsed: 0,
    freeQuizzesLimit: PREMIUM_PLAN.freeQuizzesLimit,
    freeQuizValueCap: PREMIUM_PLAN.freeQuizValueCap,
    articleDiscountPercent: PREMIUM_PLAN.articleDiscountPercent,
    quizFreeAccess: PREMIUM_PLAN.quizFreeAccess,
    quizDiscountPercent: PREMIUM_PLAN.quizDiscountPercent,
    discountedQuizzesUsed: 0,
    discountedQuizzesLimit: PREMIUM_PLAN.discountedQuizzesLimit,
    manualDiscounts: [],
    lastCycleReset: new Date()
  };

  subscriptions.push(subscription);
  user.subscription = subscription;
  
  return subscription;
}

export function getSubscriptionByEmail(email: string): Subscription | undefined {
  const sub = subscriptions.find(s => s.email === email && s.status === 'active');
  if (sub) ensureSubscriptionCycle(sub);
  return sub;
}

export function isUserPremium(email: string): boolean {
  const subscription = getSubscriptionByEmail(email);
  return subscription ? subscription.endDate > new Date() : false;
}

export function canAccessPremiumArticle(email: string): boolean {
  const subscription = getSubscriptionByEmail(email);
  if (!subscription) return false;
  
  return subscription.premiumArticlesUsed < subscription.premiumArticlesLimit;
}

export function consumePremiumArticleCredit(email: string): boolean {
  const subscription = getSubscriptionByEmail(email);
  if (!subscription || !canAccessPremiumArticle(email)) return false;
  
  subscription.premiumArticlesUsed += 1;
  return true;
}

// Calculate article price for a subscriber based on entitlements
export function getArticlePriceForSubscriber(email: string, basePrice: number): number | null {
  const subscription = getSubscriptionByEmail(email);
  if (!subscription) return null; // not a subscriber
  if (canAccessPremiumArticle(email)) return 0; // within free quota
  // Apply subscriber discount after free quota
  const discounted = basePrice * (1 - subscription.articleDiscountPercent / 100);
  return Math.round(discounted * 100) / 100;
}

// Quizzes: subscribers get access for free, plus a monthly discounted quota for paid quizzes if needed
export function canUseFreeQuiz(email: string, basePrice: number): boolean {
  const subscription = getSubscriptionByEmail(email);
  if (!subscription) return false;
  // Either global free access, or within monthly free quota and under value cap
  if (subscription.quizFreeAccess) return true;
  return (
    subscription.freeQuizzesUsed < subscription.freeQuizzesLimit &&
    basePrice <= subscription.freeQuizValueCap
  );
}

export function getQuizPriceForSubscriber(email: string, basePrice: number): number | null {
  const subscription = getSubscriptionByEmail(email);
  if (!subscription) return null;
  if (canUseFreeQuiz(email, basePrice)) return 0;
  if (subscription.discountedQuizzesUsed < subscription.discountedQuizzesLimit) {
    const discounted = basePrice * (1 - subscription.quizDiscountPercent / 100);
    return Math.round(discounted * 100) / 100;
  }
  return basePrice; // no discount left
}

export function markDiscountedQuizUsed(email: string): boolean {
  const subscription = getSubscriptionByEmail(email);
  if (!subscription) return false;
  if (subscription.discountedQuizzesUsed < subscription.discountedQuizzesLimit) {
    subscription.discountedQuizzesUsed += 1;
    return true;
  }
  return false;
}

export function markFreeQuizUsed(email: string): boolean {
  const subscription = getSubscriptionByEmail(email);
  if (!subscription) return false;
  if (subscription.quizFreeAccess) return true; // unlimited free
  if (subscription.freeQuizzesUsed < subscription.freeQuizzesLimit) {
    subscription.freeQuizzesUsed += 1;
    return true;
  }
  return false;
}

// Relationship registry between paid articles and related quizzes
const relatedQuizByArticle: Record<string, string> = {};

export function registerRelatedQuiz(articleId: string, quizId: string) {
  relatedQuizByArticle[articleId] = quizId;
}

export function getRelatedQuizForArticle(articleId: string): string | undefined {
  return relatedQuizByArticle[articleId];
}

// If a subscriber purchases an article, grant its related quiz for free
export function getBonusQuizForArticlePurchase(articleId: string, email: string): string | null {
  const subscription = getSubscriptionByEmail(email);
  if (!subscription) return null;
  const relatedQuiz = getRelatedQuizForArticle(articleId);
  return relatedQuiz || null;
}

export function likeArticle(email: string, articleId: string): boolean {
  const user = getUserByEmail(email) || createUser(email);
  
  if (!user.likedArticles.includes(articleId)) {
    user.likedArticles.push(articleId);
    return true;
  }
  return false;
}

export function unlikeArticle(email: string, articleId: string): boolean {
  const user = getUserByEmail(email);
  if (!user) return false;
  
  const index = user.likedArticles.indexOf(articleId);
  if (index > -1) {
    user.likedArticles.splice(index, 1);
    return true;
  }
  return false;
}

export function hasUserLikedArticle(email: string, articleId: string): boolean {
  const user = getUserByEmail(email);
  return user ? user.likedArticles.includes(articleId) : false;
}

export function getSubscriptionStats(email: string) {
  const subscription = getSubscriptionByEmail(email);
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
    daysRemaining: Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  };
}

export function cancelSubscription(email: string): boolean {
  const sub = subscriptions.find(s => s.email === email && s.status === 'active');
  if (!sub) return false;
  sub.status = 'cancelled';
  sub.endDate = new Date();
  return true;
}

export function resetEntitlements(email: string): boolean {
  const sub = getSubscriptionByEmail(email);
  if (!sub) return false;
  sub.premiumArticlesUsed = 0;
  sub.freeQuizzesUsed = 0;
  sub.discountedQuizzesUsed = 0;
  sub.lastCycleReset = new Date();
  return true;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Reset monthly usage when a new cycle starts
function ensureSubscriptionCycle(subscription: Subscription) {
  const now = new Date();
  const last = subscription.lastCycleReset;
  if (!isSameBillingMonth(now, last)) {
    subscription.premiumArticlesUsed = 0;
    subscription.freeQuizzesUsed = 0;
    subscription.discountedQuizzesUsed = 0;
    subscription.lastCycleReset = now;
    // Extend endDate by 30 days if active and past
    if (subscription.endDate < now) {
      subscription.endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
  }
}

function isSameBillingMonth(a: Date, b: Date): boolean {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth();
}

// Manual discount management functions
export function createManualDiscount(discountData: Omit<ManualDiscount, 'id' | 'currentUses'>): ManualDiscount {
  const discount: ManualDiscount = {
    id: generateId(),
    ...discountData,
    currentUses: 0
  };
  
  // In a real implementation, this would be stored in a database
  // For now, we'll store it in memory
  manualDiscounts.push(discount);
  return discount;
}

export function getActiveManualDiscounts(): ManualDiscount[] {
  const now = new Date();
  return manualDiscounts.filter(d => 
    d.isActive && 
    d.validFrom <= now && 
    d.validUntil >= now && 
    d.currentUses < d.maxUses
  );
}

export function applyManualDiscount(email: string, discountId: string, itemType: 'quiz' | 'article', itemId: string, originalPrice: number): UserDiscount | null {
  const user = getUserByEmail(email);
  if (!user) return null;
  
  const discount = manualDiscounts.find(d => d.id === discountId);
  if (!discount) return null;
  
  const now = new Date();
  if (!discount.isActive || discount.validFrom > now || discount.validUntil < now || discount.currentUses >= discount.maxUses) {
    return null;
  }
  
  // Check if discount applies to this item type and optionally specific item
  if (discount.itemType !== itemType) return null;
  if (discount.itemId && discount.itemId !== itemId) return null;
  
  // Apply discount
  const discountAmount = originalPrice * (discount.discountPercent / 100);
  const discountedPrice = Math.max(0, originalPrice - discountAmount);
  
  const userDiscount: UserDiscount = {
    discountId: discount.id,
    appliedAt: new Date(),
    itemType,
    itemId,
    originalPrice,
    discountedPrice
  };
  
  user.userDiscounts.push(userDiscount);
  discount.currentUses += 1;
  
  return userDiscount;
}

export function getItemPriceWithDiscounts(email: string, itemType: 'quiz' | 'article', itemId: string): number {
  const basePrice = ITEM_PRICING[itemType];
  
  // First check for subscription discounts
  const subscription = getSubscriptionByEmail(email);
  if (subscription) {
    // Check if this is a premium subscriber with free access
    if (itemType === 'quiz' && (subscription.quizFreeAccess || (subscription.freeQuizzesUsed < subscription.freeQuizzesLimit && basePrice <= subscription.freeQuizValueCap))) {
      return 0;
    }
    
    // Check if this is within the subscriber's discount quota
    if (itemType === 'quiz' && subscription.discountedQuizzesUsed < subscription.discountedQuizzesLimit) {
      const discounted = basePrice * (1 - subscription.quizDiscountPercent / 100);
      return Math.round(discounted * 100) / 100;
    }
    
    if (itemType === 'article' && canAccessPremiumArticle(email)) {
      return 0;
    }
    
    if (itemType === 'article') {
      const discounted = basePrice * (1 - subscription.articleDiscountPercent / 100);
      return Math.round(discounted * 100) / 100;
    }
  }
  
  // Check for manual discounts
  const user = getUserByEmail(email);
  if (user) {
    const activeDiscounts = user.userDiscounts.filter(d => 
      d.itemType === itemType && 
      (!d.itemId || d.itemId === itemId)
    );
    
    if (activeDiscounts.length > 0) {
      // Use the best discount (lowest price)
      const bestDiscount = activeDiscounts.reduce((min, d) => 
        d.discountedPrice < min.discountedPrice ? d : min
      );
      return bestDiscount.discountedPrice;
    }
  }
  
  return basePrice;
}

// In-memory storage for manual discounts
let manualDiscounts: ManualDiscount[] = [];
