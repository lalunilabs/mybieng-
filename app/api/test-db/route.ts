import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { sampleBlogs, sampleQuizzes } from '@/lib/sampleData';

export async function GET() {
  try {
    // Test database connection by trying to fetch data
    const blogs = await DatabaseService.getAllBlogs();
    const quizzes = await DatabaseService.getAllQuizzes();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        blogs: blogs.length,
        quizzes: quizzes.length
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Insert sample data for testing
    const createdBlogs = [];
    const createdQuizzes = [];
    
    // Insert sample blogs
    for (const blog of sampleBlogs) {
      try {
        const { id, ...blogData } = blog;
        const created = await DatabaseService.createBlog(blogData);
        createdBlogs.push(created);
      } catch (error) {
        console.log(`Blog ${blog.slug} might already exist, skipping...`);
      }
    }
    
    // Insert sample quizzes
    for (const quiz of sampleQuizzes) {
      try {
        const { id, responses, ...quizData } = quiz;
        const created = await DatabaseService.createQuiz(quizData);
        createdQuizzes.push(created);
      } catch (error) {
        console.log(`Quiz ${quiz.slug} might already exist, skipping...`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Sample data inserted successfully',
      data: {
        blogs: createdBlogs.length,
        quizzes: createdQuizzes.length
      }
    });
  } catch (error) {
    console.error('Error inserting sample data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to insert sample data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
