import { NextRequest, NextResponse } from 'next/server';
import { getQuizAccess } from '@/lib/purchases';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = {
      slug: searchParams.get('slug'),
      email: searchParams.get('email'),
    };

    const schema = z.object({
      slug: z.string().regex(/^[a-z0-9-]{1,100}$/),
      email: z.string().email().optional().or(z.literal('').transform(() => undefined)),
    });

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const slug = parsed.data.slug;
    const email = parsed.data.email ? parsed.data.email.trim().toLowerCase() : undefined;

    const access = getQuizAccess(email, slug);
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
