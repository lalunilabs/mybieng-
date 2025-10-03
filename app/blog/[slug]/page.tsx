import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MagazineLayout } from '@/components/layout/PageLayout';
import { MagazineArticle } from '@/components/articles/MagazineArticle';
import { SecondaryNav } from '@/components/layout/SecondaryNav';

export const revalidate = 300; // Revalidate every 5 minutes

interface BlogPageProps {
  params: {
    slug: string;
  };
}

// Load article data from our new API
async function getArticle(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/content/articles/${slug}`, {
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading article:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/content/articles`);
    
    if (!response.ok) {
      return [];
    }
    
    const { articles } = await response.json();
    return articles.map((article: any) => ({
      slug: article.slug
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getArticle(params.slug);
  
  if (!data?.article) {
    return {
      title: 'Article Not Found | MyBeing',
      description: 'The requested article could not be found.'
    };
  }

  const { article } = data;
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const url = article.canonicalUrl || `${base}/blog/${params.slug}`;
  const ogImage = article.ogImage || article.socialImage || article.image || `${base}/api/og?title=${encodeURIComponent(article.title)}&subtitle=${encodeURIComponent(article.excerpt || '')}`;

  return {
    title: article.metaTitle || `${article.title} | MyBeing`,
    description: article.metaDescription || article.excerpt,
    keywords: article.keywords,
    alternates: { 
      canonical: url,
      languages: { 
        'en-IN': url, 
        'en-US': url, 
        'x-default': url 
      } 
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.metaDescription || article.excerpt,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
      authors: article.author ? [article.author] : undefined,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      section: article.category,
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription || article.excerpt,
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

export default async function BlogPage({ params }: BlogPageProps) {
  const data = await getArticle(params.slug);
  
  if (!data?.article) {
    notFound();
  }

  const { article, relatedArticles } = data;

  // Convert to our MagazineArticle format
  const magazineArticle = {
    id: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    author: article.author || 'Dr. N',
    publishedAt: article.publishedAt,
    readTime: article.readTime || Math.ceil(article.wordCount / 200),
    tags: article.tags || [],
    imageUrl: article.image,
    category: article.category
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(article.structuredData) 
        }}
      />
      
      {/* Secondary Navigation */}
      <SecondaryNav />
      
      {/* Magazine Article Display */}
      <MagazineLayout>
        <MagazineArticle 
          article={magazineArticle}
          relatedArticles={relatedArticles || []}
        />
      </MagazineLayout>
    </>
  );
}
