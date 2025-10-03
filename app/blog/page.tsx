import { loadAllArticles } from '@/lib/content';
import { fallbackBlogs } from '@/lib/fallbackData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import Container from '@/components/Container';
import { PageLoader } from '@/components/ui/PageLoader';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ArrowRight, BookOpen, Clock, User, FileText, CheckCircle, Brain, BarChart3 } from 'lucide-react';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import FileBlogCard from '@/components/ui/FileBlogCard';
import AdSlot from '@/components/ads/AdSlot';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Articles | MyBeing',
  description: 'Research-backed articles on psychology, behavior, and personal growth. Designed to pair with your quiz insights.',
  alternates: { canonical: '/blog', languages: { 'en-IN': '/blog', 'en-US': '/blog', 'x-default': '/blog' } },
  openGraph: {
    title: 'MyBeing Articles',
    description: 'Evidence-based explainers and guides across psychology and behavior.',
    url: '/blog',
    type: 'website',
    images: ['/api/og?title=MyBeing%20Articles&subtitle=Evidence-based%20explainers%20and%20guides%20across%20psychology%20and%20behavior.']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyBeing Articles',
    description: 'Evidence-based explainers and guides across psychology and behavior.',
    images: ['/api/og?title=MyBeing%20Articles&subtitle=Evidence-based%20explainers%20and%20guides%20across%20psychology%20and%20behavior.']
  },
  robots: { index: true, follow: true },
};

function BlogContent() {
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${base}/blog` },
    ],
  };
  const now = Date.now();
  const articles = loadAllArticles()
    .filter(article => article.published !== false && article.publishedAt.getTime() <= now)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  const featuredPost = fallbackBlogs[0];
  const recentPosts = fallbackBlogs.slice(1);

  // Compute category (from primary tag) counts across all articles
  const primaryTag = (tags?: string[]) => (tags && tags.length > 0 ? tags[0] : 'General');
  const tagCounts = fallbackBlogs.reduce<Record<string, number>>((acc, a) => {
    const tag = primaryTag((a as any).tags);
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12">
        <Container>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
          />
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <section className="relative px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              {/* Header */}
              <div className="mb-10 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white shadow-brutal text-sm font-semibold">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-foreground">Research-backed insights</span>
                </div>
                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  <span className="block">Deepen Your Understanding</span>
                </h1>
                <p className="mt-4 max-w-3xl text-lg sm:text-xl text-muted-foreground">
                  Evidence-based articles on psychology, behavior, and patterns. Designed for personal growth and clear action.
                </p>
              </div>

              {/* Content */}
              {featuredPost ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  <div className="lg:col-span-2">
                    <Card variant="elevated" className="overflow-hidden shadow-brutal">
                      <div className="aspect-[16/9] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white" />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-2xl">{featuredPost.title}</CardTitle>
                        <CardDescription className="text-lg">{featuredPost.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{featuredPost.readTime || '5 min read'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{featuredPost.author || 'MyBeing Team'}</span>
                          </div>
                        </div>
                        <PrimaryCTA
                          href={`/blog/${featuredPost.slug}`}
                          size="lg"
                          surface="blog_page"
                          eventName="read_featured_article"
                          variant="uiverse"
                          className="group"
                        >
                          <span className="mr-2">Read Article</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </PrimaryCTA>
                      </CardContent>
                    </Card>
                  </div>
                  <aside className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Latest Articles</h3>
                      <span className="text-sm text-muted-foreground">{fallbackBlogs.length} total</span>
                    </div>
                    <div className="space-y-3">
                      {recentPosts.map(post => {
                        const cat = primaryTag(post.tags as any);
                        const count = tagCounts[cat] || 0;
                        return (
                          <FileBlogCard
                            key={post.slug}
                            title={post.title}
                            slug={post.slug}
                            excerpt={post.excerpt}
                            category={cat}
                            categoryCount={count}
                          />
                        );
                      })}
                    </div>
                  </aside>
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-indigo-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Articles Coming Soon
                  </h3>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    We're crafting research-backed articles to complement your quiz insights. 
                    Check back soon for deep dives into psychology and self-awareness.
                  </p>
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Peer-reviewed sources</div>
                    <div className="flex items-center gap-2"><Brain className="w-4 h-4" /> Practical insights</div>
                    <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Data-driven</div>
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl p-12 border border-indigo-500/10">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Ready to Apply What You've Learned?
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Combine research insights with personal assessment. Take a quiz to see how these concepts apply to your unique patterns.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <PrimaryCTA href="/quizzes" surface="blog_page_cta" eventName="explore_quizzes" variant="uiverse" className="px-8 py-4 font-semibold rounded-2xl">
                      <span className="mr-2">Explore Quizzes</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </PrimaryCTA>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </ErrorBoundary>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading blog posts..." />}>
      <BlogContent />
      {/* No ads on blog listing - keeping experience clean */}
    </Suspense>
  );
}
