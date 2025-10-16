import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MagazineLayout } from '@/components/layout/PageLayout';
import { ConsistentMagazineArticle, type SidebarArticleCard, type SidebarQuizCard } from '@/components/articles/ConsistentMagazineArticle';
import { SecondaryNav } from '@/components/layout/SecondaryNav';
import { loadAllArticles } from '@/lib/content';
import AdSlot from '@/components/ads/AdSlot';

export const revalidate = 300; // Revalidate every 5 minutes

interface BlogPageProps {
  params: {
    slug: string;
  };
}

// Load article data from our new API
async function getArticle(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://mybeing.in');
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
    // Use filesystem/seed directly for robust pre-rendering
    const articles = loadAllArticles();
    return articles.map((article) => ({ slug: article.slug }));
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
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://mybeing.in');

  const relatedQuizSlugs = Array.isArray(article.relatedQuizzes) ? article.relatedQuizzes : [];
  let relatedQuizzes: SidebarQuizCard[] = [];

  if (relatedQuizSlugs.length) {
    const quizResponses = await Promise.all(
      relatedQuizSlugs.slice(0, 4).map(async (quizSlug: string) => {
        try {
          const quizRes = await fetch(`${baseUrl}/api/content/quizzes/${quizSlug}`, {
            next: { revalidate: 300 }
          });

          if (!quizRes.ok) {
            return null;
          }

          const quizData = await quizRes.json();
          if (!quizData?.quiz) {
            return null;
          }

          const quiz = quizData.quiz;

          const quizCard: SidebarQuizCard = {
            slug: quizSlug,
            title: quiz.title,
            description: quiz.description || quiz.longDescription || quiz.excerpt,
            estimatedTime: quiz.estimatedTime,
            category: quiz.category,
            image: quiz.image || quiz.ogImage
          };

          return quizCard;
        } catch (error) {
          console.error('Quiz recommendation fetch failed:', quizSlug, error);
          return null;
        }
      })
    );

    relatedQuizzes = quizResponses.filter(Boolean) as SidebarQuizCard[];
  }

  let recommendedArticles: SidebarArticleCard[] = [];
  const primaryQuizSlug = relatedQuizSlugs[0] || article.primaryQuizSlug || article.primaryQuiz;

  if (primaryQuizSlug) {
    try {
      const recommendationsRes = await fetch(
        `${baseUrl}/api/content/recommendations?quiz=${encodeURIComponent(primaryQuizSlug)}&limit=4`,
        { next: { revalidate: 300 } }
      );

      if (recommendationsRes.ok) {
        const recommendationsData = await recommendationsRes.json();
        if (Array.isArray(recommendationsData?.articles)) {
          const uniqueRecommendations = new Map<string, SidebarArticleCard>();

          recommendationsData.articles.forEach((item: any) => {
            const card: SidebarArticleCard = {
              slug: item.slug,
              title: item.title,
              excerpt: item.excerpt,
              image: item.image || item.imageUrl,
              imageUrl: item.imageUrl,
              readTime: item.readTime,
              publishedAt: item.publishedAt,
              category: item.category,
              tags: item.tags,
              author: item.author,
              isPremium: item.isPremium
            };

            uniqueRecommendations.set(card.slug, card);
          });

          recommendedArticles = Array.from(uniqueRecommendations.values());
        }
      }
    } catch (error) {
      console.error('Article recommendation fetch failed:', primaryQuizSlug, error);
    }
  }

  const relatedArticleCards: SidebarArticleCard[] = Array.isArray(relatedArticles)
    ? (relatedArticles as any[]).map((item) => ({
        slug: item.slug || item.id,
        title: item.title,
        excerpt: item.excerpt,
        image: item.image || item.imageUrl,
        imageUrl: item.imageUrl,
        readTime: item.readTime,
        publishedAt: item.publishedAt,
        category: item.category,
        tags: item.tags,
        author: item.author,
        isPremium: item.isPremium
      }))
    : [];

  if (!recommendedArticles.length) {
    recommendedArticles = relatedArticleCards.slice(0, 4);
  }

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
    category: article.category,
    tldr: Array.isArray(article.tldr) ? article.tldr : (article.tldr ? [article.tldr] : []),
    keyIdeas: Array.isArray(article.keyIdeas) ? article.keyIdeas : (article.keyIdeas ? [article.keyIdeas] : []),
    frameworks: Array.isArray(article.frameworks) ? article.frameworks : (article.frameworks ? [article.frameworks] : []),
    prompts: Array.isArray(article.prompts) ? article.prompts : (article.prompts ? [article.prompts] : []),
    citations: Array.isArray(article.citations) ? article.citations : (article.citations ? [article.citations] : []),
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
      {/* Ad: Top inline placement (hidden for premium users or when ads disabled) */}
      <AdSlot id="article_top_inline" label="Advertisement" reserve={{ mobile: { w: 300, h: 250 }, desktop: { w: 728, h: 90 } }} />
      
      {/* Magazine Article Display */}
      <MagazineLayout>
        <ConsistentMagazineArticle 
          article={magazineArticle}
          relatedArticles={relatedArticleCards}
          recommendedArticles={recommendedArticles}
          relatedQuizzes={relatedQuizzes}
        />
      </MagazineLayout>

      {/* Ad: Bottom inline placement */}
      <AdSlot id="article_bottom_inline" label="Advertisement" reserve={{ mobile: { w: 300, h: 250 }, desktop: { w: 728, h: 90 } }} />
    </>
  );
}
