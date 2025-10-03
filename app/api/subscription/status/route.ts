import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSubscriptionStats, isUserPremium, canAccessPremiumArticle } from '@/lib/subscription';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({
        isPremium: false,
        canAccess: false,
        stats: null
      });
    }

    const userId = (session.user as any).id;
    const isPremium = await isUserPremium(userId);
    const canAccessPremium = await canAccessPremiumArticle(userId);
    const stats = await getSubscriptionStats(userId);

    return NextResponse.json({
      isPremium,
      canAccess: isPremium && canAccessPremium,
      stats
    });
  } catch (error) {
    console.error('Subscription status API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
