import { NextRequest, NextResponse } from 'next/server';
import { getResearchAnalytics, getQuizInsights, exportResearchData } from '@/lib/research';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const quizSlug = searchParams.get('quiz');
    const format = searchParams.get('format') as 'json' | 'csv' | null;

    switch (action) {
      case 'analytics':
        const analytics = getResearchAnalytics();
        return NextResponse.json(analytics);

      case 'quiz-insights':
        if (!quizSlug) {
          return NextResponse.json({ error: 'Quiz slug required' }, { status: 400 });
        }
        const insights = getQuizInsights(quizSlug);
        return NextResponse.json(insights);

      case 'export':
        const exportFormat = format || 'json';
        const data = exportResearchData(exportFormat);
        
        const headers = new Headers();
        headers.set('Content-Type', exportFormat === 'json' ? 'application/json' : 'text/csv');
        headers.set('Content-Disposition', `attachment; filename="research-data-${new Date().toISOString().split('T')[0]}.${exportFormat}"`);
        
        return new NextResponse(data, { headers });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
