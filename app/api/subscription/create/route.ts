import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createCheckoutSession } from '@/lib/stripe/client';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email;

    // Create Stripe checkout session
    const checkoutSession = await createCheckoutSession({
      userId,
      userEmail,
    });

    return NextResponse.json({ 
      success: true,
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
