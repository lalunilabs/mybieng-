import { NextRequest, NextResponse } from 'next/server';
import { getQuizAccess } from '@/lib/purchases';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const email = searchParams.get('email') || undefined;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const access = getQuizAccess(email, slug);
    if (!access.exists) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(access);
  } catch (error) {
    console.error('Quiz access API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
