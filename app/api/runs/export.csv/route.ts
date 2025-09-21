import { NextRequest, NextResponse } from 'next/server';
import { prisma, safeDbOperation } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get('sessionId')?.value;
    if (!sessionId) {
      return new NextResponse('', {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="mybeing-runs-empty.csv"',
        },
      });
    }

    const runs = await safeDbOperation(
      () => prisma!.quizRun.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'desc' },
        include: { answers: true },
        take: 100,
      }),
      []
    );

    const header = ['id', 'quizSlug', 'createdAt', 'total', 'bandLabel', 'answers'].join(',');
    const lines = runs.map((r: { id: string; quizSlug: string; createdAt: Date; total: number; bandLabel: string; answers: { question: string; value: number }[] }) => {
      const ans = r.answers
        .map((a: { question: string; value: number }) => `${a.question}:${a.value}`)
        .join(';')
        .replace(/"/g, '""');
      const created = r.createdAt.toISOString();
      return [r.id, r.quizSlug, created, String(r.total), r.bandLabel.replace(/"/g, '""'), `"${ans}"`]
        .map((v) => (/,|\n|\r|\"/.test(v) ? `"${v.replace(/"/g, '""')}"` : v))
        .join(',');
    });
    const csv = [header, ...lines].join('\n');

    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="mybeing-runs-${ts}.csv"`,
      },
    });
  } catch (e) {
    console.error('GET /api/runs/export.csv error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
