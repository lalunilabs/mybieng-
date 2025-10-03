'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  quiz?: {
    name: string;
    description: string;
    timeRequired?: string;
    difficulty?: string;
  };
}

export function EnhancedSEO({ 
  title, 
  description, 
  keywords = [], 
  image, 
  article, 
  quiz 
}: SEOProps) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const fullUrl = `${baseUrl}${pathname}`;
  
  const defaultTitle = 'MyBeing - Your Personal Health Environment';
  const defaultDescription = 'Transform your self-understanding with research-backed quizzes, behavioral pattern analysis, and AI-powered insights for authentic personal growth.';
  const defaultImage = `${baseUrl}/og-image.jpg`;
  
  const seoTitle = title ? `${title} | MyBeing` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoKeywords = [...keywords, 'MyBeing', 'self-discovery', 'psychology', 'behavioral patterns', 'personal growth'].join(', ');

  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seoTitle,
      description: seoDescription,
      url: fullUrl,
      image: seoImage,
      publisher: {
        '@type': 'Organization',
        name: 'MyBeing by Meum Labs',
        logo: `${baseUrl}/logo.png`,
        url: baseUrl
      }
    };

    if (article) {
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: seoDescription,
        image: seoImage,
        author: {
          '@type': 'Person',
          name: article.author || 'Dr N'
        },
        publisher: {
          '@type': 'Organization',
          name: 'MyBeing by Meum Labs',
          logo: `${baseUrl}/logo.png`
        },
        datePublished: article.publishedTime,
        dateModified: article.modifiedTime || article.publishedTime,
        mainEntityOfPage: fullUrl,
        articleSection: article.section,
        keywords: article.tags?.join(', ')
      };
    }

    if (quiz) {
      return {
        '@context': 'https://schema.org',
        '@type': 'Quiz',
        name: quiz.name,
        description: quiz.description,
        url: fullUrl,
        timeRequired: quiz.timeRequired,
        educationalLevel: 'Adult',
        assesses: 'Behavioral Patterns',
        publisher: {
          '@type': 'Organization',
          name: 'MyBeing by Meum Labs',
          logo: `${baseUrl}/logo.png`
        }
      };
    }

    return baseData;
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="MyBeing" />
      
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.section} />
          {article.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:site" content="@mybeing" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content="Dr N, MyBeing Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Language" content="en" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData())
        }}
      />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
    </Head>
  );
}
