import { NextRequest, NextResponse } from 'next/server';
import { updatePlanPrice } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const { planId, newPrice } = await request.json();

    if (!planId || newPrice === undefined) {
      return NextResponse.json({ error: 'Missing planId or newPrice' }, { status: 400 });
    }

    const success = updatePlanPrice(planId, newPrice);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Price update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
