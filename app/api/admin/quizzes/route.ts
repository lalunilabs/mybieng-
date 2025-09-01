import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { loadAllQuizzes, saveQuiz, deleteQuiz, type Quiz } from '@/lib/content';

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = loadAllQuizzes();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await req.json().catch(() => null)) as Quiz | null;
  if (!body || !body.slug || !body.title || !Array.isArray(body.questions) || !Array.isArray(body.bands)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  try {
    saveQuiz(body);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to save' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  deleteQuiz(slug);
  return NextResponse.json({ ok: true });
}

export const dynamic = 'force-dynamic';
