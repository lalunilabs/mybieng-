import { NextRequest, NextResponse } from 'next/server';
import { getSubscriptionStats, isUserPremium, canAccessPremiumArticle } from '@/lib/subscription';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const isPremium = isUserPremium(email);
    const canAccessPremium = canAccessPremiumArticle(email);
    const stats = getSubscriptionStats(email);

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
