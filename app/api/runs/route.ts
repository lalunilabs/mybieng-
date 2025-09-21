import { NextRequest, NextResponse } from 'next/server';
import { prisma, safeDbOperation } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizSlug, answers, total, bandLabel } = body as {
      quizSlug: string;
      answers: Record<string, number>;
      total: number;
      bandLabel: string;
    };

    if (!quizSlug || !answers || typeof total !== 'number' || !bandLabel) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Ensure a session cookie exists (anonymous)
    const cookieStore = req.cookies;
    let sessionId = cookieStore.get('sessionId')?.value || randomUUID();

    const run = await safeDbOperation(
      () => prisma!.quizRun.create({
        data: {
          sessionId,
          quizSlug,
          total,
          bandLabel,
          answers: {
            create: Object.entries(answers).map(([question, value]) => ({ question, value })),
          },
        },
        select: { id: true, createdAt: true },
      }),
      null
    );

    if (!run) {
      return NextResponse.json({ ok: true, id: 'mock-id', createdAt: new Date() });
    }
    const res = NextResponse.json({ ok: true, id: run.id, createdAt: run.createdAt });
    // Set cookie if it was missing
    if (!cookieStore.get('sessionId')) {
      res.cookies.set('sessionId', sessionId, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    return res;
  } catch (e) {
    console.error('POST /api/runs error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = req.cookies;
    const sessionId = cookieStore.get('sessionId')?.value;
    if (!sessionId) return NextResponse.json([]);

    const runs = await safeDbOperation(
      () => prisma!.quizRun.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, quizSlug: true, total: true, bandLabel: true, createdAt: true },
      }),
      []
    );
    return NextResponse.json(runs);
  } catch (e) {
    console.error('GET /api/runs error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
