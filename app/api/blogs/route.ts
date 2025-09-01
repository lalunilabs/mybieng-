import { NextResponse } from 'next/server';
import { blogs } from '@/data/blogs';

export async function GET() {
  return NextResponse.json(blogs.map(({ content, ...rest }) => rest));
}
