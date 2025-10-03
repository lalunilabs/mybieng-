import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getQuizAccess } from '@/lib/purchases';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    const schema = z.string().regex(/^[a-z0-9-]{1,100}$/);
    const parsed = schema.safeParse(slug);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid slug parameter' },
        { status: 400 }
      );
    }

    const access = await getQuizAccess(userId, parsed.data);
    if (!access.exists) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return new NextResponse(JSON.stringify(access), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Quiz access API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
