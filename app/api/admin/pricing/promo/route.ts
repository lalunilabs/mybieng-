import { NextRequest, NextResponse } from 'next/server';
import { createPromoCode } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const promoData = await request.json();

    if (!promoData.code || !promoData.discountPercentage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const promo = createPromoCode(promoData);
    return NextResponse.json({ success: true, promo });
  } catch (error) {
    console.error('Promo creation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
