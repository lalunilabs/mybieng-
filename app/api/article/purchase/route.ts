import { NextRequest, NextResponse } from 'next/server';
import { purchaseArticle } from '@/lib/articlePurchases';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body?.email as string | undefined;
    const slug = (body?.slug || body?.articleSlug) as string | undefined;
    if (!email || !slug) {
      return NextResponse.json({ error: 'Missing email or slug' }, { status: 400 });
    }

    const result = await purchaseArticle(email, slug);
    if (!result.ok) {
      return NextResponse.json({ error: result.error || 'Purchase failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, purchase: result.purchase });
  } catch (error) {
    console.error('Article purchase API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
