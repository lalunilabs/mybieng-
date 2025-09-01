// Flexible pricing and promotional system
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // For showing discounts
  interval: 'monthly' | 'yearly';
  features: string[];
  premiumArticlesLimit: number;
  isPopular?: boolean;
  discount?: {
    percentage: number;
    code: string;
    validUntil: Date;
    description: string;
  };
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  validUntil: Date;
  maxUses: number;
  currentUses: number;
  description: string;
  isActive: boolean;
}

// Admin-configurable pricing (replace with database in production)
let pricingPlans: PricingPlan[] = [
  {
    id: 'basic-monthly',
    name: 'Basic Monthly',
    price: 19,
    originalPrice: 29,
    interval: 'monthly',
    features: [
      'Listen to all articles with audio narration',
      'Access to all quizzes under $25 for free',
      '1 premium article per month',
      'Basic AI chat support'
    ],
    premiumArticlesLimit: 1,
    discount: {
      percentage: 34,
      code: 'LAUNCH34',
      validUntil: new Date('2025-12-31'),
      description: 'Launch Special - 34% Off!'
    }
  },
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    price: 32,
    originalPrice: 42,
    interval: 'monthly',
    features: [
      'Listen to all articles with audio narration',
      'No ads across the product',
      '2 premium articles per month',
      'Related quizzes free for included premium articles',
      'Discounts on additional products (extra articles and select quizzes)',
      'Priority AI chat support',
      'Advanced analytics dashboard',
      'Early access to new content'
    ],
    premiumArticlesLimit: 2,
    isPopular: true,
    discount: {
      percentage: 31,
      code: 'LAUNCH31',
      validUntil: new Date('2025-12-31'),
      description: 'Launch Special - 31% Off!'
    }
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    price: 199,
    originalPrice: 348,
    interval: 'yearly',
    features: [
      'All Premium Monthly features',
      'Save $149 per year',
      '5 premium articles per month',
      '1-on-1 monthly consultation call',
      'Custom quiz creation requests'
    ],
    premiumArticlesLimit: 5,
    discount: {
      percentage: 43,
      code: 'YEARLY43',
      validUntil: new Date('2025-12-31'),
      description: 'Best Value - 43% Off Annual!'
    }
  }
];

let promoCodes: PromoCode[] = [
  {
    code: 'FIRST50',
    discountPercentage: 50,
    validUntil: new Date('2025-12-31'),
    maxUses: 100,
    currentUses: 0,
    description: 'First 100 users get 50% off first month',
    isActive: true
  },
  {
    code: 'STUDENT30',
    discountPercentage: 30,
    validUntil: new Date('2025-12-31'),
    maxUses: 500,
    currentUses: 0,
    description: 'Student discount - 30% off',
    isActive: true
  },
  {
    code: 'REDDIT25',
    discountPercentage: 25,
    validUntil: new Date('2025-12-31'),
    maxUses: 200,
    currentUses: 0,
    description: 'Reddit community special - 25% off',
    isActive: true
  }
];

// Admin functions to manage pricing
export function updatePlanPrice(planId: string, newPrice: number): boolean {
  const plan = pricingPlans.find(p => p.id === planId);
  if (plan) {
    plan.price = newPrice;
    return true;
  }
  return false;
}

export function createPromoCode(promoData: Omit<PromoCode, 'currentUses'>): PromoCode {
  const promo: PromoCode = {
    ...promoData,
    currentUses: 0
  };
  promoCodes.push(promo);
  return promo;
}

export function validatePromoCode(code: string): PromoCode | null {
  const promo = promoCodes.find(p => 
    p.code === code && 
    p.isActive && 
    p.currentUses < p.maxUses && 
    p.validUntil > new Date()
  );
  return promo || null;
}

export function usePromoCode(code: string): boolean {
  const promo = validatePromoCode(code);
  if (promo) {
    promo.currentUses += 1;
    return true;
  }
  return false;
}

export function calculateDiscountedPrice(planId: string, promoCode?: string): {
  originalPrice: number;
  finalPrice: number;
  discount: number;
  promoApplied?: string;
} {
  const plan = pricingPlans.find(p => p.id === planId);
  if (!plan) throw new Error('Plan not found');

  let finalPrice = plan.price;
  let discount = 0;
  let promoApplied;

  // Apply promo code if provided
  if (promoCode) {
    const promo = validatePromoCode(promoCode);
    if (promo) {
      discount = (finalPrice * promo.discountPercentage) / 100;
      finalPrice = finalPrice - discount;
      promoApplied = promo.description;
    }
  }

  return {
    originalPrice: plan.originalPrice || plan.price,
    finalPrice: Math.round(finalPrice * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    promoApplied
  };
}

export function getPricingPlans(): PricingPlan[] {
  return pricingPlans;
}

export function getActivePlans(): PricingPlan[] {
  return pricingPlans.filter(plan => plan.price > 0);
}

export function getPromoCodes(): PromoCode[] {
  return promoCodes;
}

// Market research insights
export const PRICING_INSIGHTS = {
  competitorAnalysis: {
    headspace: { monthly: 12.99, yearly: 69.99 },
    calm: { monthly: 14.99, yearly: 69.99 },
    betterhelp: { monthly: 65, yearly: 520 },
    mindfulness: { monthly: 9.99, yearly: 59.99 }
  },
  recommendations: {
    sweetSpot: '15-25 USD for monthly subscriptions',
    userFeedback: 'Users complain about $40+ pricing on Reddit',
    strategy: 'Start low, build value, then increase prices',
    promoStrategy: 'Heavy discounts for first 6 months to build user base'
  }
};
