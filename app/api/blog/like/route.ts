import { NextRequest, NextResponse } from 'next/server';
import { likeArticle, unlikeArticle } from '@/lib/subscription';
import { blogs } from '@/data/blogs';

export async function POST(request: NextRequest) {
  try {
    const { email, articleId, action } = await request.json();

    if (!email || !articleId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let success = false;
    if (action === 'like') {
      success = likeArticle(email, articleId);
    } else if (action === 'unlike') {
      success = unlikeArticle(email, articleId);
    }

    if (success) {
      // Update blog likes count in memory (in production, this would be in database)
      const blog = blogs.find(b => b.id === articleId);
      if (blog) {
        if (action === 'like') {
          blog.likes = (blog.likes || 0) + 1;
        } else {
          blog.likes = Math.max(0, (blog.likes || 0) - 1);
        }
      }
    }

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Blog like API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
