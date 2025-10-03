import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { purchaseQuiz } from '@/lib/purchases';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const sessionId = request.headers.get('x-session-id') || undefined;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const schema = z.object({
      slug: z.string().regex(/^[a-z0-9-]{1,100}$/).or(z.undefined()),
      quizSlug: z.string().regex(/^[a-z0-9-]{1,100}$/).or(z.undefined()),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const slug = (parsed.data.slug || parsed.data.quizSlug)!;
    const result = await purchaseQuiz(userId, slug, sessionId);
    
    if (!result.ok) {
      return NextResponse.json({ error: result.error || 'Purchase failed' }, { status: 400 });
    }

    return new NextResponse(
      JSON.stringify({ success: true, purchase: result.purchase }),
      { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Quiz purchase API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
