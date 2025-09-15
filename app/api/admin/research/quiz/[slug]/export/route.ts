import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth/admin';
import { loadQuizBySlug } from '@/lib/content';

function getCutoffDate(timeRange: string | null): Date | null {
  const now = new Date();
  switch (timeRange) {
    case '24h': {
      const d = new Date(now);
      d.setDate(now.getDate() - 1);
      return d;
    }
    case '7d': {
      const d = new Date(now);
      d.setDate(now.getDate() - 7);
      return d;
    }
    case '30d': {
      const d = new Date(now);
      d.setDate(now.getDate() - 30);
      return d;
    }
    case '90d': {
      const d = new Date(now);
      d.setDate(now.getDate() - 90);
      return d;
    }
    case 'all':
    default:
      return null;
  }
}

function toCSV(rows: Array<Record<string, any>>): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    const line = headers
      .map((h) => {
        const v = row[h];
        const s = v === undefined || v === null ? '' : String(v);
        return '"' + s.replace(/"/g, '""') + '"';
      })
      .join(',');
    lines.push(line);
  }
  return lines.join('\n');
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Admin-only guard
    const token = request.cookies.get('admin_token')?.value;
    const user = token ? await verifyAdminToken(token) : null;
    if (!user || user.email !== process.env.OWNER_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange');
    const format = (searchParams.get('format') || 'json').toLowerCase();
    const cutoff = getCutoffDate(timeRange);

    const slug = params.slug;
    const runWhere: any = { quizSlug: slug };
    if (cutoff) runWhere.createdAt = { gte: cutoff };

    const runs = await prisma.quizRun.findMany({
      where: runWhere,
      select: { id: true, quizSlug: true, total: true, bandLabel: true, createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    if (format === 'json') {
      // Attach answers
      const runIds = runs.map(r => r.id);
      const answers = await prisma.quizAnswer.findMany({ where: { runId: { in: runIds } }, select: { runId: true, question: true, value: true } });
      const byRun: Record<string, Array<{ question: string; value: number }>> = {};
      answers.forEach(a => {
        if (!byRun[a.runId]) byRun[a.runId] = [];
        byRun[a.runId].push({ question: a.question, value: a.value });
      });

      // Include quiz metadata and questions with media
      const quiz = loadQuizBySlug(slug);
      const payload = {
        quiz: quiz ? {
          slug: quiz.slug,
          title: quiz.title,
          description: quiz.description,
          imageUrl: (quiz as any).imageUrl || '',
          attachments: (quiz as any).attachments || [],
          tags: quiz.tags || [],
          published: quiz.published !== false,
          publishedAt: quiz.publishedAt || null,
          questions: (quiz.questions || []).map((q: any) => ({
            id: q.id,
            text: q.text,
            type: q.type,
            options: q.options || [],
            imageUrl: q.imageUrl || '',
            attachments: q.attachments || [],
          })),
          bands: quiz.bands || [],
        } : { slug, title: slug, description: '', imageUrl: '', attachments: [], tags: [], published: true, publishedAt: null, questions: [], bands: [] },
        responses: runs.map(r => ({
          response_id: r.id,
          quiz_slug: r.quizSlug,
          completed_at: r.createdAt,
          total_score: r.total,
          band_result: r.bandLabel,
          answers: byRun[r.id] || []
        }))
      };

      return new NextResponse(JSON.stringify(payload, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${slug}-research-${Date.now()}.json"`
        }
      });
    } else {
      // CSV
      const runIds = runs.map(r => r.id);
      const answers = await prisma.quizAnswer.findMany({ where: { runId: { in: runIds } }, select: { runId: true, question: true, value: true } });

      // Determine columns
      const questionSet = new Set<string>();
      answers.forEach(a => questionSet.add(a.question));
      const questionCols = Array.from(questionSet).map(q => `q_${q}`);
      const quiz = loadQuizBySlug(slug);
      const quizAttachments = ((quiz as any)?.attachments || [])
        .map((a: any) => `${(a.label || '').replaceAll('"','\"')}|${(a.url || '').replaceAll('"','\"')}`)
        .join(';');

      const rows = runs.map(r => {
        const row: Record<string, any> = {
          quiz_title: (quiz as any)?.title || slug,
          quiz_attachments: quizAttachments,
          response_id: r.id,
          quiz_slug: r.quizSlug,
          completed_at: r.createdAt.toISOString(),
          total_score: r.total,
          band_result: r.bandLabel,
        };
        questionCols.forEach(qc => (row[qc] = ''));
        return row;
      });

      const index: Record<string, number> = {};
      runs.forEach((r, i) => (index[r.id] = i));

      answers.forEach(a => {
        const i = index[a.runId];
        if (i !== undefined) {
          const key = `q_${a.question}`;
          rows[i][key] = a.value;
        }
      });

      const csv = toCSV(rows);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${slug}-research-${Date.now()}.csv"`
        }
      });
    }
  } catch (error) {
    console.error('Admin research export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
