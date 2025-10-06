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

    const quizData = await request.json();
    
    // Validate required fields
    if (!quizData.title || !quizData.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = quizData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create quiz object
    const quiz = {
      id: Date.now().toString(),
      slug,
      title: quizData.title,
      description: quizData.description,
      category: quizData.category || 'Psychology',
      author: quizData.author || 'Dr. N',
      estimatedTime: quizData.estimatedTime || 15,
      featured: quizData.featured || false,
      published: true,
      researchBased: quizData.researchBased || true,
      createdAt: quizData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions: quizData.questions || [],
      totalQuestions: (quizData.questions || []).length,
      completions: 0,
      averageScore: 0,
      tags: quizData.tags || [],
      resultTypes: {
        scoring: 'numeric', // numeric, categorical, or narrative
        bands: [
          { min: 0, max: 30, label: 'Low', description: 'Lower range results' },
          { min: 31, max: 70, label: 'Moderate', description: 'Moderate range results' },
          { min: 71, max: 100, label: 'High', description: 'Higher range results' }
        ]
      },
      metadata: {
        version: '1.0',
        lastModified: new Date().toISOString(),
        status: 'draft'
      }
    };

    // Ensure content directory exists
    const contentDir = join(process.cwd(), 'content', 'quizzes');
    if (!existsSync(contentDir)) {
      await mkdir(contentDir, { recursive: true });
    }

    // Save quiz as JSON file
    const filePath = join(contentDir, `${slug}.json`);
    await writeFile(filePath, JSON.stringify(quiz, null, 2));

    console.log(`Quiz created: ${quiz.title} (${slug})`);

    return NextResponse.json({
      success: true,
      quiz,
      message: 'Quiz structure created successfully'
    });

  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
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

    // Return list of quizzes for admin management
    // This would typically fetch from database
    return NextResponse.json({
      success: true,
      quizzes: [],
      message: 'Quiz management endpoint ready'
    });

  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}
