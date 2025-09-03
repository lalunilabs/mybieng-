import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quizSlug = searchParams.get('quiz');
    
    // Get quiz analytics
    const responses = await DatabaseService.getQuizAnalytics(quizSlug || undefined);
    
    // Get all feedback
    const feedback = await DatabaseService.getAllFeedback();
    
    // Calculate basic analytics
    const analytics = {
      totalResponses: responses.length,
      averageRating: feedback.length > 0 
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length 
        : 0,
      responsesByQuiz: responses.reduce((acc, response) => {
        acc[response.quiz_slug] = (acc[response.quiz_slug] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      responsesByBand: responses.reduce((acc, response) => {
        acc[response.band] = (acc[response.band] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentActivity: responses
        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
        .slice(0, 10)
    };
    
    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quiz_slug, session_id, responses, score, band } = body;
    
    if (!quiz_slug || !session_id || !responses || score === undefined || !band) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const response = await DatabaseService.saveQuizResponse({
      quiz_slug,
      session_id,
      user_agent: request.headers.get('user-agent') || 'unknown',
      responses,
      score,
      band,
      completed_at: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error saving quiz response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save response' },
      { status: 500 }
    );
  }
}
