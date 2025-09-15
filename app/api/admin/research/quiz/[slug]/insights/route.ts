import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth/admin';

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

    const runs = await prisma.quizRun.findMany({
      where: runWhere,
      select: { id: true, total: true, bandLabel: true, createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    if (runs.length === 0) {
      return NextResponse.json({
        totalCompletions: 0,
        averageScore: 0,
        scoreDistribution: {},
        scoreDistributionDetailed: {},
        commonResponsePatterns: [],
        improvementSuggestions: [],
        questionStats: {},
        completionTrend: [],
        completionRate: 0,
        averageCompletionTime: 0,
        timeRange: {
          start: cutoff ? cutoff.toISOString() : new Date(0).toISOString(),
          end: new Date().toISOString(),
          label: timeRange || 'all'
        }
      });
    }

    const totalCompletions = runs.length;
    const averageScore = runs.reduce((a, r) => a + (r.total || 0), 0) / runs.length;

    // Score distribution by band
    const scoreDistribution: Record<string, number> = {};
    const scoreDistributionDetailed: Record<string, { count: number; percentage: number }> = {};
    runs.forEach(r => {
      const band = r.bandLabel || 'Unlabeled';
      scoreDistribution[band] = (scoreDistribution[band] || 0) + 1;
      if (!scoreDistributionDetailed[band]) scoreDistributionDetailed[band] = { count: 0, percentage: 0 };
      scoreDistributionDetailed[band].count++;
    });
    Object.keys(scoreDistributionDetailed).forEach(b => {
      scoreDistributionDetailed[b].percentage = (scoreDistributionDetailed[b].count / totalCompletions) * 100;
    });

    // Question stats
    const runIds = runs.map(r => r.id);
    const answers = await prisma.quizAnswer.findMany({
      where: { runId: { in: runIds } },
      select: { question: true, value: true }
    });

    const questionStats: Record<string, { 
      questionText: string;
      type: string;
      averageResponse: number;
      responseDistribution: Record<string | number, number>;
      skipped: number;
    }> = {};

    const byQuestion: Record<string, number[]> = {};
    answers.forEach(a => {
      if (!byQuestion[a.question]) byQuestion[a.question] = [];
      byQuestion[a.question].push(a.value);
    });

    Object.entries(byQuestion).forEach(([question, values]) => {
      const dist: Record<number, number> = {};
      values.forEach(v => { dist[v] = (dist[v] || 0) + 1; });
      const avg = values.reduce((s, v) => s + v, 0) / values.length;
      questionStats[question] = {
        questionText: question,
        type: 'scale',
        averageResponse: avg,
        responseDistribution: dist,
        skipped: 0,
      };
    });

    // Completion trend
    const dailyCompletions: Record<string, number> = {};
    runs.forEach(r => {
      const d = r.createdAt.toISOString().split('T')[0];
      dailyCompletions[d] = (dailyCompletions[d] || 0) + 1;
    });
    const completionTrend = Object.entries(dailyCompletions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    // Simple patterns
    const valuesAll = Object.values(byQuestion).flat();
    const uniqueCount = new Set(valuesAll).size;
    const commonResponsePatterns: string[] = [];
    if (uniqueCount === 1 && valuesAll.length > 0) commonResponsePatterns.push('All respondents answered the same way');
    const improvementSuggestions = commonResponsePatterns.length === 0
      ? ['No major issues detected. Continue monitoring for patterns.']
      : ['Review question clarity; low variance detected'];

    return NextResponse.json({
      totalCompletions,
      averageScore: parseFloat(averageScore.toFixed(2)),
      scoreDistribution,
      scoreDistributionDetailed,
      commonResponsePatterns,
      improvementSuggestions,
      questionStats,
      completionTrend,
      completionRate: totalCompletions > 0 ? 100 : 0,
      averageCompletionTime: 0,
      timeRange: {
        start: cutoff ? cutoff.toISOString() : new Date(0).toISOString(),
        end: new Date().toISOString(),
        label: timeRange || 'all'
      }
    });
  } catch (error) {
    console.error('Admin research insights error:', error);
    return NextResponse.json({ error: 'Failed to compute insights' }, { status: 500 });
  }
}
