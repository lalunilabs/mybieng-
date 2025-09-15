import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createSubscription, getSubscriptionStats } from '@/lib/subscription';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json().catch(() => ({}));
    const email = (body?.email || session?.user?.email)?.toString();
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const sub = createSubscription(email);
    const stats = getSubscriptionStats(email);
    return NextResponse.json({ success: true, subscription: sub, stats });
  } catch (error) {
    console.error('Dev subscribe API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
