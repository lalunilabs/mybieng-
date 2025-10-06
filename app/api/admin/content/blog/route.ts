import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { verifyAdminToken } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const blogData = await request.json();
    
    // Validate required fields
    if (!blogData.title || !blogData.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create blog post object
    const blogPost = {
      id: Date.now().toString(),
      slug,
      title: blogData.title,
      excerpt: blogData.excerpt || '',
      content: blogData.content,
      author: blogData.author || 'Dr. N',
      tags: Array.isArray(blogData.tags) ? blogData.tags : [],
      featured: blogData.featured || false,
      published: true,
      publishedAt: blogData.publishedAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: Math.ceil(blogData.content.split(' ').length / 200), // Estimate reading time
      likes: 0,
      views: 0
    };

    // Ensure content directory exists
    const contentDir = join(process.cwd(), 'content', 'blog');
    if (!existsSync(contentDir)) {
      await mkdir(contentDir, { recursive: true });
    }

    // Save blog post as JSON file
    const filePath = join(contentDir, `${slug}.json`);
    await writeFile(filePath, JSON.stringify(blogPost, null, 2));

    console.log(`Blog post created: ${blogPost.title} (${slug})`);

    return NextResponse.json({
      success: true,
      blog: blogPost,
      message: 'Blog post created successfully'
    });

  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return list of blog posts for admin management
    // This would typically fetch from database
    return NextResponse.json({
      success: true,
      blogs: [],
      message: 'Blog management endpoint ready'
    });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
