import { NextRequest, NextResponse } from 'next/server';
import { createSubscription } from '@/lib/subscription';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // In production, integrate with Stripe/PayPal here
    // For now, create a mock subscription
    const subscription = createSubscription(email);

    // TODO: Send welcome email with subscription details
    // TODO: Set up recurring billing with payment provider

    return NextResponse.json({ 
      success: true,
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        endDate: subscription.endDate
      }
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
