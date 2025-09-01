import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get('sessionId')?.value;
    if (!sessionId) {
      return NextResponse.json([]);
    }

    const runs = await prisma.quizRun.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      include: { answers: true },
      take: 100,
    });

    const payload = runs.map((r: {
      id: string;
      quizSlug: string;
      createdAt: Date;
      total: number;
      bandLabel: string;
      answers: { question: string; value: number }[];
    }) => ({
      id: r.id,
      quizSlug: r.quizSlug,
      createdAt: r.createdAt,
      total: r.total,
      bandLabel: r.bandLabel,
      answers: Object.fromEntries(r.answers.map((a: { question: string; value: number }) => [a.question, a.value])),
    }));

    const res = NextResponse.json(payload);
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    res.headers.set('Content-Disposition', `attachment; filename="mybeing-runs-${ts}.json"`);
    return res;
  } catch (e) {
    console.error('GET /api/runs/export error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
