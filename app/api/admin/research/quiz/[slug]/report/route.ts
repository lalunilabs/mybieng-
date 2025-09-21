import { NextRequest, NextResponse } from 'next/server';
import { prisma, safeDbOperation } from '@/lib/db';
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
    const cutoff = getCutoffDate(timeRange);

    const slug = params.slug;
    const runWhere: any = { quizSlug: slug };
    if (cutoff) runWhere.createdAt = { gte: cutoff };

    const runs = await safeDbOperation(
      () => prisma!.quizRun.findMany({
        where: runWhere,
        select: { id: true, total: true, bandLabel: true, createdAt: true },
        orderBy: { createdAt: 'asc' }
      }),
      []
    );

    const lines: string[] = [];
    const quiz = loadQuizBySlug(slug);
    const title = (quiz as any)?.title || slug;
    lines.push(`# Research Report: ${title}`);
    lines.push('');
    lines.push(`Time Range: ${timeRange || 'all'}`);
    lines.push('');
    if ((quiz as any)?.imageUrl) {
      lines.push(`![Cover Image](${(quiz as any).imageUrl})`);
      lines.push('');
    }
    if ((quiz as any)?.attachments?.length) {
      lines.push('## Resources');
      (quiz as any).attachments.forEach((att: any) => {
        const label = att.label || att.url;
        lines.push(`- [${label}](${att.url})`);
      });
      lines.push('');
    }

    if (runs.length === 0) {
      lines.push('_No data available for this selection._');
      const md = lines.join('\n');
      return new NextResponse(md, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="${slug}-research-report-${Date.now()}.md"`
        }
      });
    }

    const totalCompletions = runs.length;
    const averageScore = runs.reduce((a, r) => a + (r.total || 0), 0) / runs.length;

    // Score distribution by band
    const scoreDistribution: Record<string, number> = {};
    runs.forEach(r => {
      const band = r.bandLabel || 'Unlabeled';
      scoreDistribution[band] = (scoreDistribution[band] || 0) + 1;
    });

    // Completion trend
    const dailyCompletions: Record<string, number> = {};
    runs.forEach(r => {
      const d = r.createdAt.toISOString().split('T')[0];
      dailyCompletions[d] = (dailyCompletions[d] || 0) + 1;
    });

    // Question insights
    const runIds = runs.map(r => r.id);
    const answers = await safeDbOperation(
      () => prisma!.quizAnswer.findMany({
        where: { runId: { in: runIds } },
        select: { question: true, value: true }
      }),
      []
    );

    const byQuestion: Record<string, number[]> = {};
    answers.forEach(a => {
      if (!byQuestion[a.question]) byQuestion[a.question] = [];
      byQuestion[a.question].push(a.value);
    });

    const questionEntries = Object.entries(byQuestion);

    // Summary
    lines.push('## Summary');
    lines.push(`- Total Completions: ${totalCompletions}`);
    lines.push(`- Average Score: ${averageScore.toFixed(2)}`);
    lines.push('');

    // Score Distribution
    lines.push('## Score Distribution');
    lines.push('Band | Count');
    lines.push('---|---:');
    Object.entries(scoreDistribution).forEach(([band, count]) => {
      lines.push(`${band} | ${count}`);
    });
    lines.push('');

    // Question Highlights
    lines.push('## Question Highlights');
    if (questionEntries.length === 0) {
      lines.push('_No question analytics available._');
    } else {
      const top = questionEntries.slice(0, 5);
      top.forEach(([question, values]) => {
        const avg = values.reduce((s, v) => s + v, 0) / values.length;
        lines.push(`- ${question}`);
        lines.push(`  - Avg Response: ${avg.toFixed(2)} (n=${values.length})`);
      });
    }
    lines.push('');

    // Question Resources (from quiz definition)
    if ((quiz as any)?.questions?.length) {
      const qWithMedia = (quiz as any).questions.filter((q: any) => q.imageUrl || (q.attachments || []).length);
      if (qWithMedia.length) {
        lines.push('## Question Resources');
        qWithMedia.forEach((q: any, idx: number) => {
          lines.push(`### Q${idx + 1}. ${q.text}`);
          if (q.imageUrl) {
            lines.push(`![Question Image](${q.imageUrl})`);
          }
          if ((q.attachments || []).length) {
            (q.attachments || []).forEach((att: any) => {
              const label = att.label || att.url;
              lines.push(`- [${label}](${att.url})`);
            });
          }
          lines.push('');
        });
      }
    }

    // Response Patterns
    const valuesAll = Object.values(byQuestion).flat();
    const uniqueCount = new Set(valuesAll).size;
    const patterns: string[] = [];
    if (uniqueCount === 1 && valuesAll.length > 0) patterns.push('All respondents answered the same way');

    if (patterns.length) {
      lines.push('## Response Patterns');
      patterns.forEach(p => lines.push(`- ${p}`));
      lines.push('');
    }

    // Completion Trend (table)
    lines.push('## Completion Trend (Daily)');
    lines.push('Date | Count');
    lines.push('---|---:');
    Object.entries(dailyCompletions)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .forEach(([date, count]) => lines.push(`${date} | ${count}`));
    lines.push('');

    lines.push('_Generated by MyBeing Research Tools_');

    const md = lines.join('\n');
    return new NextResponse(md, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${slug}-research-report-${Date.now()}.md"`
      }
    });
  } catch (error) {
    console.error('Admin research report error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
