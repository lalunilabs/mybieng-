import { loadAllArticles } from '@/lib/content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Container from '@/components/Container';
import { PageLoader } from '@/components/ui/PageLoader';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ArrowRight, BookOpen, Clock, User } from 'lucide-react';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function BlogContent() {
  const articles = loadAllArticles()
    .filter(article => article.published !== false)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  const featuredPost = articles[0];
  const recentPosts = articles.slice(1, 7);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12">
        <Container>
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
                  <span>📚</span>
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
                        <span className="text-6xl text-white">📚</span>
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
                        <Button variant="gradient" size="lg" className="group">
                          <span className="mr-2">Read Article</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  <aside className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Latest Articles</h3>
                      <span className="text-sm text-muted-foreground">{articles.length} total</span>
                    </div>
                    <div className="space-y-3">
                      {recentPosts.map(post => (
                        <Card key={post.slug} className="p-4 hover:shadow-soft transition-shadow duration-200">
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">{post.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime || '5 min'}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </aside>
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">📝</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Articles Coming Soon
                  </h3>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    We're crafting research-backed articles to complement your quiz insights. 
                    Check back soon for deep dives into psychology and self-awareness.
                  </p>
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <span className="mr-2">🔬</span>
                      Peer-reviewed sources
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🧠</span>
                      Practical insights
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📊</span>
                      Data-driven
                    </div>
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
                    <a 
                      href="/quizzes" 
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-300"
                    >
                      <span className="mr-2">Explore Quizzes</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
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
    </Suspense>
  );
}
