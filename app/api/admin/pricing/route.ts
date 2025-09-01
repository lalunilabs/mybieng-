import { NextRequest, NextResponse } from 'next/server';
import { getPricingPlans, getPromoCodes } from '@/lib/pricing';

export async function GET(request: NextRequest) {
  try {
    const plans = getPricingPlans();
    const promoCodes = getPromoCodes();

    return NextResponse.json({
      plans,
      promoCodes
    });
  } catch (error) {
    console.error('Pricing API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
