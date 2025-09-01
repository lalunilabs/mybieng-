import { NextResponse } from 'next/server';
import { getQuizBySlug } from '@/data/quizzes';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const quiz = getQuizBySlug(params.slug);
  if (!quiz) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(quiz);
}
