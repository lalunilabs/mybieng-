import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isUserPremium, getSubscriptionStats } from '@/lib/subscription';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;

    if (!userId) {
      return NextResponse.json({ isPremium: false, stats: null });
    }

    const isPremium = await isUserPremium(userId);
    const stats = await getSubscriptionStats(userId);
    return NextResponse.json({ isPremium, stats });
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json({ isPremium: false, stats: null });
  }
}
