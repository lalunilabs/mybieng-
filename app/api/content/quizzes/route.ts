import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(req: NextRequest) {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'quizzes');
    
    if (!fs.existsSync(contentDir)) {
      return NextResponse.json({ quizzes: [] });
    }

    const files = fs.readdirSync(contentDir)
      .filter(file => file.endsWith('.json') || file.endsWith('.md'));

    const quizzes = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        if (file.endsWith('.json')) {
          // JSON quiz data
          const quizData = JSON.parse(fileContent);
          return {
            slug: file.replace('.json', ''),
            type: 'json',
            ...quizData,
            questionCount: quizData.questions?.length || 0,
            estimatedTime: quizData.estimatedTime || Math.ceil((quizData.questions?.length || 10) * 0.5)
          };
        } else {
          // Markdown quiz description
          const { data: frontmatter, content } = matter(fileContent);
          return {
            slug: file.replace('.md', ''),
            type: 'markdown',
            ...frontmatter,
            description: content,
            questionCount: frontmatter.questionCount || 10,
            estimatedTime: frontmatter.estimatedTime || 10
          };
        }
      })
    );

    // Sort by featured, then by creation date
    quizzes.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json({ 
      quizzes,
      count: quizzes.length 
    });

  } catch (error) {
    console.error('Error loading quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to load quizzes' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
