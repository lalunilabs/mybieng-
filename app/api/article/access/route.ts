import { NextRequest, NextResponse } from 'next/server';
import { getArticleAccess } from '@/lib/articlePurchases';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const email = searchParams.get('email') || undefined;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const access = getArticleAccess(email, slug);
    if (!access.exists) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(access);
  } catch (error) {
    console.error('Article access API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
