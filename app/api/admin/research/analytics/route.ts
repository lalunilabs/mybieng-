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

export async function GET(request: NextRequest) {
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

    const runWhere: any = cutoff ? { createdAt: { gte: cutoff } } : {};

    const runs = await prisma.quizRun.findMany({
      where: runWhere,
      select: { id: true, quizSlug: true, total: true, bandLabel: true, createdAt: true },
    });

    const totalResponses = runs.length;

    // Quiz breakdown
    const quizBreakdown: Record<string, number> = {};
    runs.forEach(r => {
      quizBreakdown[r.quizSlug] = (quizBreakdown[r.quizSlug] || 0) + 1;
    });

    // Average score
    const averageScore = runs.length > 0 ? runs.reduce((a, r) => a + (r.total || 0), 0) / runs.length : 0;

    // Time analytics
    const hourCounts: Record<number, number> = {};
    const dailyCounts: Record<string, number> = {};
    runs.forEach(r => {
      const dt = r.createdAt;
      const hour = dt.getHours();
      const day = dt.toISOString().split('T')[0];
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });
    const peakUsageHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([h]) => parseInt(h));

    // Response patterns (top questions across all quizzes)
    const runIds = runs.map(r => r.id);
    let responsePatterns: Array<{
      questionId: string;
      questionText: string;
      averageScore?: number;
      responseDistribution: Record<string | number, number>;
      commonPatterns: string[];
    }> = [];

    if (runIds.length > 0) {
      const answers = await prisma.quizAnswer.findMany({
        where: { runId: { in: runIds } },
        select: { question: true, value: true },
      });

      const byQuestion: Record<string, number[]> = {};
      answers.forEach(a => {
        if (!byQuestion[a.question]) byQuestion[a.question] = [];
        byQuestion[a.question].push(a.value);
      });

      responsePatterns = Object.entries(byQuestion).slice(0, 20).map(([question, values]) => {
        const distribution: Record<number, number> = {};
        values.forEach(v => { distribution[v] = (distribution[v] || 0) + 1; });
        const avg = values.reduce((s, v) => s + v, 0) / values.length;
        const uniqueCount = new Set(values).size;
        const commonPatterns: string[] = [];
        if (uniqueCount === 1) commonPatterns.push('All respondents answered the same way');
        return {
          questionId: question,
          questionText: question,
          averageScore: avg,
          responseDistribution: distribution,
          commonPatterns,
        };
      });
    }

    return NextResponse.json({
      totalResponses,
      quizBreakdown,
      timeAnalytics: { peakUsageHours, dailyCompletions: dailyCounts, averageCompletionTime: 0 },
      responsePatterns,
      averageScore: parseFloat(averageScore.toFixed(2)),
    });
  } catch (error) {
    console.error('Admin research analytics error:', error);
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
