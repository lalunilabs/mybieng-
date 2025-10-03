// Middleware for enforcing subscription entitlements
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  isUserPremium, 
  canAccessPremiumArticle,
  getSubscriptionStats 
} from '@/lib/subscription';
import { canUserUseAI } from '@/lib/usageTracking';

export interface EntitlementCheckResult {
  allowed: boolean;
  reason?: string;
  remainingQuota?: number;
  upgradeRequired?: boolean;
}

// Check if user can access premium content
export async function checkPremiumAccess(request: NextRequest): Promise<EntitlementCheckResult> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return {
      allowed: false,
      reason: 'Authentication required',
      upgradeRequired: true,
    };
  }

  const userId = (session.user as any).id;
  const isPremium = await isUserPremium(userId);

  if (!isPremium) {
    return {
      allowed: false,
      reason: 'Premium subscription required',
      upgradeRequired: true,
    };
  }

  return { allowed: true };
}

// Check if user can access a premium article
export async function checkArticleAccess(request: NextRequest): Promise<EntitlementCheckResult> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return {
      allowed: false,
      reason: 'Authentication required',
      upgradeRequired: true,
    };
  }

  const userId = (session.user as any).id;
  const canAccess = await canAccessPremiumArticle(userId);

  if (!canAccess) {
    const stats = await getSubscriptionStats(userId);
    return {
      allowed: false,
      reason: 'Monthly article quota exceeded',
      remainingQuota: stats?.premiumArticlesRemaining || 0,
      upgradeRequired: false, // They're already premium, just hit limit
    };
  }

  const stats = await getSubscriptionStats(userId);
  return {
    allowed: true,
    remainingQuota: stats?.premiumArticlesRemaining || 0,
  };
}

// Check if user can use AI chat
export async function checkAIAccess(
  request: NextRequest,
  mode: 'general' | 'quiz-results' = 'general'
): Promise<EntitlementCheckResult> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    // Anonymous users can use quiz-results AI but not general chat
    if (mode === 'quiz-results') {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Authentication required for general AI chat',
      upgradeRequired: true,
    };
  }

  const userId = (session.user as any).id;
  const isGeneralMode = mode === 'general';
  const canUse = await canUserUseAI(userId, isGeneralMode);

  if (!canUse) {
    const isPremium = await isUserPremium(userId);
    
    if (!isPremium) {
      return {
        allowed: false,
        reason: 'Daily AI chat limit reached. Upgrade to Premium for unlimited access.',
        upgradeRequired: true,
      };
    }

    // Premium user shouldn't hit this, but just in case
    return {
      allowed: false,
      reason: 'AI service temporarily unavailable',
      upgradeRequired: false,
    };
  }

  return { allowed: true };
}

// Middleware wrapper for Next.js API routes
export function withEntitlement(
  handler: (req: NextRequest) => Promise<NextResponse>,
  check: (req: NextRequest) => Promise<EntitlementCheckResult>
) {
  return async (req: NextRequest) => {
    const result = await check(req);

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: result.reason || 'Access denied',
          upgradeRequired: result.upgradeRequired,
          remainingQuota: result.remainingQuota,
        },
        { status: result.upgradeRequired ? 402 : 403 }
      );
    }

    return handler(req);
  };
}

// Helper to get current user's entitlement status
export async function getUserEntitlements(userId: string) {
  const [isPremium, stats, canUseAI] = await Promise.all([
    isUserPremium(userId),
    getSubscriptionStats(userId),
    canUserUseAI(userId, false), // Check general AI access
  ]);

  return {
    isPremium,
    subscription: stats,
    aiAccess: {
      unlimited: isPremium,
      canUse: canUseAI,
    },
    features: {
      premiumArticles: isPremium,
      freeQuizzes: stats ? stats.freeQuizzesRemaining > 0 : false,
      discountedQuizzes: stats ? stats.discountedQuizzesRemaining > 0 : false,
      unlimitedAI: isPremium,
    },
  };
}
