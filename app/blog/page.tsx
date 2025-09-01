import FeaturedPost from '@/components/blog/FeaturedPost';
import PostCard from '@/components/blog/PostCard';
import PostListItem from '@/components/blog/PostListItem';
import CategoryPill from '@/components/blog/CategoryPill';
import { loadAllArticles } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default function BlogIndexPage({ searchParams }: { searchParams: { tag?: string } }) {
  const allArticles = loadAllArticles()
    .filter(a => a.published !== false)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  const tag = searchParams?.tag;
  const filtered = tag ? allArticles.filter(a => a.tags?.includes(tag)) : allArticles;
  const featured = filtered[0] || allArticles[0];
  const recent = (filtered.filter(a => a.slug !== featured?.slug));
  const sidebar = allArticles.filter(a => a.slug !== featured?.slug).slice(0, 6);
  const tags = Array.from(new Set(allArticles.flatMap(a => a.tags || []))).sort();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-paper to-primary/5 relative overflow-hidden">
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

          {/* Category Pills */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <CategoryPill label="All" href="/blog" selected={!tag} />
              {tags.map(t => (
                <CategoryPill key={t} label={t} href={`/blog?tag=${encodeURIComponent(t)}`} selected={tag === t} />
              ))}
            </div>
          )}

          {/* Featured + Sidebar */}
          {featured ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <FeaturedPost post={featured} />
              </div>
              <aside className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Latest</h3>
                  <span className="text-sm text-muted-foreground">{allArticles.length} articles</span>
                </div>
                <div className="space-y-3">
                  {sidebar.map(post => (
                    <PostListItem key={post.slug} post={post} />
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

          {/* Tag filter empty state */}
          {tag && filtered.length === 0 && (
            <div className="mt-6 p-6 rounded-xl border border-border bg-white text-sm text-muted-foreground">
              No posts found for “{tag}”. Try a different category.
            </div>
          )}

          {/* Recent Grid */}
          {recent.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-semibold mb-4">Recent {tag ? `in ${tag}` : 'Articles'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recent.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          {allArticles.length > 0 && (
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
          )}
        </div>
      </section>
    </div>
  );
}
