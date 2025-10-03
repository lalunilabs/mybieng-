import { prisma } from '@/lib/db';
import { getSubscriptionByUserId } from '@/lib/subscription';

export interface UsageStats {
  // Quiz entitlements
  freeQuizzesUsed: number;
  freeQuizzesRemaining: number;
  discountedQuizzesUsed: number;
  discountedQuizzesRemaining: number;
  
  // Article entitlements
  premiumArticlesUsed: number;
  premiumArticlesRemaining: number;
  
  // Subscription info
  isSubscriber: boolean;
  cycleStart: Date;
  cycleEnd: Date;
}

export async function getUserUsageStats(userId: string): Promise<UsageStats> {
  const subscription = await getSubscriptionByUserId(userId);
  
  if (!subscription) {
    return {
      freeQuizzesUsed: 0,
      freeQuizzesRemaining: 0,
      discountedQuizzesUsed: 0,
      discountedQuizzesRemaining: 0,
      premiumArticlesUsed: 0,
      premiumArticlesRemaining: 0,
      isSubscriber: false,
      cycleStart: new Date(),
      cycleEnd: new Date(),
    };
  }

  return {
    freeQuizzesUsed: subscription.freeQuizzesUsed,
    freeQuizzesRemaining: subscription.freeQuizzesLimit - subscription.freeQuizzesUsed,
    discountedQuizzesUsed: subscription.discountedQuizzesUsed,
    discountedQuizzesRemaining: subscription.discountedQuizzesLimit - subscription.discountedQuizzesUsed,
    premiumArticlesUsed: subscription.premiumArticlesUsed,
    premiumArticlesRemaining: subscription.premiumArticlesLimit - subscription.premiumArticlesUsed,
    isSubscriber: true,
    cycleStart: subscription.currentPeriodStart,
    cycleEnd: subscription.currentPeriodEnd,
  };
}

// Check AI usage (unlimited for premium subscribers)
export async function canUserUseAI(userId: string, isGeneralMode: boolean = false): Promise<boolean> {
  const subscription = await getSubscriptionByUserId(userId);
  
  // Premium subscribers have unlimited AI conversations
  if (subscription) {
    return true;
  }
  
  // Non-subscribers can use AI for quiz results but have limits on general chat
  if (isGeneralMode) {
    // Implement rate limiting for non-subscribers
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const chatCount = await prisma!.aIConversation.count({
      where: {
        userId,
        mode: 'general',
        createdAt: { gte: today }
      }
    });
    
    return chatCount < 5; // 5 general chats per day for non-subscribers
  }
  
  return true; // Quiz-related AI is always available
}
