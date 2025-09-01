import { NextResponse } from 'next/server';
import { getQuizInsights, getResearchAnalytics } from '@/lib/research';
import { getQuizBySlug } from '@/lib/quiz';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Get the quiz
    const quiz = getQuizBySlug(slug);
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Get analytics for this quiz
    const analytics = getResearchAnalytics(range);
    const quizAnalytics = analytics.quizBreakdown[slug] || 0;
    
    // Get detailed insights for this quiz
    const insights = await getQuizInsights(slug);

    // Calculate band distribution
    const totalResponses = analytics.totalResponses;
    const bandDistribution = Object.entries(insights.scoreDistribution).map(([band, count]) => ({
      band,
      count,
      percentage: totalResponses > 0 ? (count / totalResponses) * 100 : 0
    }));

    // Prepare response data
    const responseData = {
      quizTitle: quiz.title,
      quizSlug: slug,
      totalCompletions: quizAnalytics,
      averageScore: insights.averageScore,
      scoreDistribution: insights.scoreDistribution,
      bandDistribution,
      completionTrend: analytics.timeAnalytics.dailyCompletions,
      questionAnalytics: quiz.questions.map((question) => {
        const questionAnalytics = analytics.responsePatterns.find(
          (p) => p.questionId === question.id
        );
        
        return {
          questionId: question.id,
          questionText: question.text,
          questionType: question.type,
          averageResponse: questionAnalytics?.averageScore || 0,
          responseDistribution: questionAnalytics?.responseDistribution || {},
          commonPatterns: questionAnalytics?.commonPatterns || []
        };
      }),
      improvementSuggestions: insights.improvementSuggestions,
      commonPatterns: insights.commonResponsePatterns
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error(`Quiz analytics error for ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz analytics' },
      { status: 500 }
    );
  }
}
