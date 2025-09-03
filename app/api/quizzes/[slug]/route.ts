import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const quiz = await DatabaseService.getQuizBySlug(params.slug);
    
    return NextResponse.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { success: false, error: 'Quiz not found' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    
    // First get the quiz by slug to get the ID
    const existingQuiz = await DatabaseService.getQuizBySlug(params.slug);
    
    const updatedQuiz = await DatabaseService.updateQuiz(existingQuiz.id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedQuiz
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update quiz' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // First get the quiz by slug to get the ID
    const existingQuiz = await DatabaseService.getQuizBySlug(params.slug);
    
    await DatabaseService.deleteQuiz(existingQuiz.id);
    
    return NextResponse.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete quiz' },
      { status: 500 }
    );
  }
}
