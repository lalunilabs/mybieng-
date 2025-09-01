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
  articleDiscountPercent: number; // discount after free quota
  quizFreeAccess: boolean; // subscribers get quizzes for free
  quizDiscountPercent: number; // discount for paid quizzes if free not applicable
  discountedQuizzesUsed: number;
  discountedQuizzesLimit: number;
  // Cycle tracking to reset monthly usage
  lastCycleReset: Date;
}

export interface User {
  id: string;
  email: string;
  subscription?: Subscription;
  likedArticles: string[];
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
    '2 premium articles per month included',
    'Related quizzes free for included premium articles',
    'Discounts on additional products (extra premium articles and select quizzes)',
    'Priority AI chat support',
    'Advanced analytics dashboard'
  ],
  premiumArticlesLimit: 2,
  articleDiscountPercent: 30,
  quizFreeAccess: false,
  quizDiscountPercent: 20,
  discountedQuizzesLimit: 3
};

export function createUser(email: string): User {
  const user: User = {
    id: generateId(),
    email,
    likedArticles: []
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
    articleDiscountPercent: PREMIUM_PLAN.articleDiscountPercent,
    quizFreeAccess: PREMIUM_PLAN.quizFreeAccess,
    quizDiscountPercent: PREMIUM_PLAN.quizDiscountPercent,
    discountedQuizzesUsed: 0,
    discountedQuizzesLimit: PREMIUM_PLAN.discountedQuizzesLimit,
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

export function usePremiumArticle(email: string): boolean {
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
export function getQuizPriceForSubscriber(email: string, basePrice: number): number | null {
  const subscription = getSubscriptionByEmail(email);
  if (!subscription) return null;
  if (subscription.quizFreeAccess) return 0;
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
    discountedQuizzesUsed: subscription.discountedQuizzesUsed,
    discountedQuizzesRemaining: subscription.discountedQuizzesLimit - subscription.discountedQuizzesUsed,
    endDate: subscription.endDate,
    daysRemaining: Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  };
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
