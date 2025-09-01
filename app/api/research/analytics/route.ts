import { NextResponse } from 'next/server';
import { getResearchAnalytics, getQuizInsights } from '@/lib/research';
import { getQuizBySlug } from '@/lib/quiz';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Get analytics for all quizzes
    const analytics = getResearchAnalytics(range);
    
    // Get insights for each quiz
    const quizzes = analytics.quizBreakdown;
    const quizInsights = await Promise.all(
      Object.keys(quizzes).map(async (slug) => {
        const quiz = getQuizBySlug(slug);
        if (!quiz) return null;
        
        const insights = await getQuizInsights(slug);
        return {
          slug,
          title: quiz.title,
          completions: quizzes[slug],
          averageScore: insights.averageScore,
          bandDistribution: insights.scoreDistribution,
        };
      })
    );

    // Filter out nulls and sort by completions
    const sortedQuizzes = quizInsights
      .filter((quiz) => quiz !== null)
      .sort((a, b) => b!.completions - a!.completions);

    return NextResponse.json({
      totalCompletions: analytics.totalResponses,
      averageScore: analytics.averageScore,
      quizzes: sortedQuizzes,
      completionTrend: analytics.timeAnalytics.dailyCompletions,
      questionAnalytics: analytics.responsePatterns,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
