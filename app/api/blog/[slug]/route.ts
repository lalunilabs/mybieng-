import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const blog = await DatabaseService.getBlogBySlug(params.slug);
    
    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Blog not found' },
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
    
    // First get the blog by slug to get the ID
    const existingBlog = await DatabaseService.getBlogBySlug(params.slug);
    
    const updatedBlog = await DatabaseService.updateBlog(existingBlog.id, {
      ...body,
      published_at: body.published ? new Date().toISOString() : null
    });
    
    return NextResponse.json({
      success: true,
      data: updatedBlog
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // First get the blog by slug to get the ID
    const existingBlog = await DatabaseService.getBlogBySlug(params.slug);
    
    await DatabaseService.deleteBlog(existingBlog.id);
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
