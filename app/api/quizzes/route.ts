import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    const quizzes = await DatabaseService.getAllQuizzes(includeUnpublished);

    return new NextResponse(
      JSON.stringify({ success: true, data: quizzes, count: quizzes.length }),
      { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

export async function POST(_request: NextRequest) {
  // Public creation of quizzes is not allowed. Use admin API instead.
  return NextResponse.json(
    { error: 'Method not allowed. Use /api/admin/quizzes for content management.' },
    { status: 405 }
  );
}
