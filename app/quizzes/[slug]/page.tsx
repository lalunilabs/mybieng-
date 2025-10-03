import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { FullScreenQuizLayout } from '@/components/layout/PageLayout';
import { CalmQuizExperience } from '@/components/quiz/CalmQuizExperience';
import { Suspense } from 'react';

export const revalidate = 300; // Revalidate every 5 minutes

interface QuizPageProps {
  params: {
    slug: string;
  };
}

// Load quiz data from our new API
async function getQuiz(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/content/quizzes/${slug}`, {
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading quiz:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/content/quizzes`);
    
    if (!response.ok) {
      return [];
    }
    
    const { quizzes } = await response.json();
    return quizzes.map((quiz: any) => ({
      slug: quiz.slug
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getQuiz(params.slug);
  
  if (!data?.quiz) {
    return {
      title: 'Quiz Not Found | MyBeing',
      description: 'The requested quiz could not be found.'
    };
  }

  const { quiz } = data;
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const url = quiz.canonicalUrl || `${base}/quizzes/${params.slug}`;
  const ogImage = quiz.ogImage || quiz.image || `${base}/api/og?title=${encodeURIComponent(quiz.title)}&subtitle=${encodeURIComponent(quiz.description || '')}`;

  return {
    title: `${quiz.title} | MyBeing`,
    description: quiz.description,
    keywords: quiz.tags,
    alternates: { 
      canonical: url,
      languages: { 
        'en-IN': url, 
        'en-US': url, 
        'x-default': url 
      } 
    },
    openGraph: {
      type: 'website',
      title: quiz.title,
      description: quiz.description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: quiz.title }],
      siteName: 'MyBeing',
    },
    twitter: {
      card: 'summary_large_image',
      title: quiz.title,
      description: quiz.description,
      images: [ogImage],
      creator: '@mybeing',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const data = await getQuiz(params.slug);
  
  if (!data?.quiz) {
    notFound();
  }

  const { quiz } = data;

  // Convert to our CalmQuizExperience format
  const formattedQuiz = {
    slug: quiz.slug,
    title: quiz.title,
    description: quiz.description,
    questions: quiz.questions?.map((q: any, index: number) => ({
      id: q.id || `q_${index}`,
      text: q.text,
      type: q.type === 'scale' ? 'likert' : q.type,
      options: q.options,
      scaleMin: q.scaleMin || 1,
      scaleMax: q.scaleMax || 5,
      scaleLabels: q.scaleLabels
    })) || [],
    bands: quiz.bands || [],
    resultType: 'adaptive',
    tags: quiz.tags || [],
    category: quiz.category,
    estimatedTime: quiz.estimatedTime || 10
  };

  // Generate session ID for this quiz attempt
  const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(quiz.structuredData) 
        }}
      />
      
      {/* Full Screen Quiz Experience */}
      <FullScreenQuizLayout>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your assessment...</p>
            </div>
          </div>
        }>
          <CalmQuizExperience 
            quiz={formattedQuiz}
            sessionId={sessionId}
          />
        </Suspense>
      </FullScreenQuizLayout>
    </>
  );
}
