import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createSubscription, getSubscriptionStats } from '@/lib/subscription';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email!;

    // Create test subscription (dev only - no Stripe)
    const sub = await createSubscription(userId);
    const stats = await getSubscriptionStats(userId);
    
    return NextResponse.json({ success: true, subscription: sub, stats });
  } catch (error) {
    console.error('Dev subscribe API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
