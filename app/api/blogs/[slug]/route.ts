import { NextResponse } from 'next/server';
import { getBlogBySlug } from '@/data/blogs';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const post = getBlogBySlug(params.slug);
  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}
