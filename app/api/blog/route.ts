import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';
    
    const blogs = await DatabaseService.getAllBlogs(includeUnpublished);
    
    return NextResponse.json({
      success: true,
      data: blogs,
      count: blogs.length
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { title, slug, excerpt, content, author_id } = body;
    if (!title || !slug || !excerpt || !content || !author_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const blog = await DatabaseService.createBlog({
      title,
      slug,
      excerpt,
      content,
      image_url: body.image_url,
      tags: body.tags || [],
      published: body.published || false,
      published_at: body.published ? new Date().toISOString() : undefined,
      author_id
    });
    
    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
