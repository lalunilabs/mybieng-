import { NextRequest, NextResponse } from 'next/server';
import { purchaseQuiz } from '@/lib/purchases';

export async function POST(request: NextRequest) {
  try {
    const { email, slug } = await request.json();
    if (!email || !slug) {
      return NextResponse.json({ error: 'Missing email or slug' }, { status: 400 });
    }

    const result = purchaseQuiz(email, slug);
    if (!result.ok) {
      return NextResponse.json({ error: result.error || 'Purchase failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, purchase: result.purchase });
  } catch (error) {
    console.error('Quiz purchase API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
