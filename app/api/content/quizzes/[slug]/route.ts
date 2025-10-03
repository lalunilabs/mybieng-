import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const contentDir = path.join(process.cwd(), 'content', 'quizzes');
    
    // Try both .json and .md extensions
    const jsonPath = path.join(contentDir, `${slug}.json`);
    const mdPath = path.join(contentDir, `${slug}.md`);
    
    let quiz = null;
    let description = null;
    
    // Load quiz data (JSON)
    if (fs.existsSync(jsonPath)) {
      const fileContent = fs.readFileSync(jsonPath, 'utf8');
      const quizData = JSON.parse(fileContent);
      
      quiz = {
        slug,
        ...quizData,
        questionCount: quizData.questions?.length || 0,
        estimatedTime: quizData.estimatedTime || Math.ceil((quizData.questions?.length || 10) * 0.5),
        // Convert to our new quiz format
        questions: quizData.questions?.map((q: any, index: number) => ({
          id: q.id || `q_${index}`,
          text: q.text,
          type: q.type === 'scale' ? 'likert' : q.type,
          options: q.type === 'multiple_choice' ? q.options : undefined,
          scaleMin: q.scaleMin,
          scaleMax: q.scaleMax,
          scaleLabels: q.scaleLabels
        })),
        // Generate bands from existing structure
        bands: quizData.bands?.map((band: any) => ({
          min: band.min,
          max: band.max,
          label: band.label,
          advice: band.description || band.advice,
          color: band.color
        })),
        // SEO enhancements
        canonicalUrl: `/quizzes/${slug}`,
        ogImage: quizData.image || `/images/quizzes/${slug}-og.jpg`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Quiz',
          name: quizData.title,
          description: quizData.description,
          image: quizData.image,
          author: {
            '@type': 'Person',
            name: quizData.author || 'Dr. N'
          },
          publisher: {
            '@type': 'Organization',
            name: 'MyBeing',
            logo: '/logo.png'
          },
          datePublished: quizData.createdAt,
          timeRequired: `PT${quizData.estimatedTime || 10}M`,
          educationalLevel: 'Adult',
          assesses: quizData.category || 'Behavioral Patterns',
          mainEntityOfPage: `${process.env.NEXT_PUBLIC_DOMAIN}/quizzes/${slug}`
        }
      };
    }
    
    // Load quiz description (Markdown)
    if (fs.existsSync(mdPath)) {
      const fileContent = fs.readFileSync(mdPath, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);
      
      description = {
        ...frontmatter,
        content
      };
      
      // Merge with quiz data if available
      if (quiz) {
        quiz = {
          ...quiz,
          ...frontmatter,
          longDescription: content
        };
      }
    }
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Load related quizzes
    const allFiles = fs.readdirSync(contentDir)
      .filter(file => file.endsWith('.json') && !file.startsWith(slug));
    
    const relatedQuizzes = allFiles.slice(0, 3).map(file => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const quizData = JSON.parse(fileContent);
      
      return {
        slug: file.replace('.json', ''),
        title: quizData.title,
        description: quizData.description,
        image: quizData.image,
        estimatedTime: quizData.estimatedTime || 10,
        category: quizData.category,
        featured: quizData.featured
      };
    });

    return NextResponse.json({
      quiz,
      relatedQuizzes
    });

  } catch (error) {
    console.error('Error loading quiz:', error);
    return NextResponse.json(
      { error: 'Failed to load quiz' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
