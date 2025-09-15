import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isUserPremium, getSubscriptionStats } from '@/lib/subscription';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.toString() || null;

    if (!email) {
      return NextResponse.json({ isPremium: false });
    }

    const isPremium = isUserPremium(email);
    const stats = getSubscriptionStats(email);
    return NextResponse.json({ isPremium, stats });
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json({ isPremium: false });
  }
}
