import { NextRequest, NextResponse } from 'next/server';
import { hasUserLikedArticle } from '@/lib/subscription';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const articleId = searchParams.get('articleId');

    if (!email || !articleId) {
      return NextResponse.json({ error: 'Missing email or articleId' }, { status: 400 });
    }

    const isLiked = await hasUserLikedArticle(email, articleId);
    return NextResponse.json({ isLiked });
  } catch (error) {
    console.error('Like status API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
