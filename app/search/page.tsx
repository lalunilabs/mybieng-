import type { Metadata } from 'next';
import Link from 'next/link';
import { loadAllArticles, loadAllQuizzes } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  const q = (searchParams?.q || '').trim();
  const title = q ? `Search: ${q} | MyBeing` : 'Search | MyBeing';
  const description = q ? `Results for “${q}” across MyBeing articles and quizzes.` : 'Search MyBeing articles and quizzes.';
  return {
    title,
    description,
    alternates: { canonical: `/search${q ? `?q=${encodeURIComponent(q)}` : ''}` },
    openGraph: {
      title,
      description,
      url: `/search${q ? `?q=${encodeURIComponent(q)}` : ''}`,
      type: 'website',
      images: [`/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}`]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}`]
    },
    robots: { index: true, follow: true },
  };
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams?.q || '').trim().toLowerCase();
  const now = Date.now();
  const articles = loadAllArticles()
    .filter(a => a.published !== false && a.publishedAt.getTime() <= now)
    .filter(a => !q || a.title.toLowerCase().includes(q) || (a.excerpt || '').toLowerCase().includes(q));
  const quizzes = loadAllQuizzes()
    .filter(qz => qz.published !== false && (!qz.publishedAt || new Date(qz.publishedAt).getTime() <= now))
    .filter(qz => !q || qz.title.toLowerCase().includes(q) || (qz.description || '').toLowerCase().includes(q));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold tracking-tight mb-6">Search</h1>
        <form action="/search" method="get" className="mb-8 flex gap-3">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search articles and quizzes..."
            className="flex-1 border rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button className="px-5 py-3 rounded-lg bg-primary text-white font-semibold shadow hover:opacity-95" type="submit">
            Search
          </button>
        </form>

        {!q && (
          <p className="text-muted-foreground mb-10">Type a keyword to find relevant research-backed articles and self-discovery quizzes.</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">Articles</h2>
            {articles.length === 0 ? (
              <p className="text-sm text-muted-foreground">{q ? 'No matching articles.' : 'Start by entering a search term.'}</p>
            ) : (
              <ul className="space-y-3">
                {articles.map(a => (
                  <li key={a.slug} className="p-4 rounded-xl border bg-white shadow-sm hover:shadow transition">
                    <Link href={`/blog/${a.slug}`} className="block">
                      <div className="font-medium text-lg">{a.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">{a.excerpt}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Quizzes</h2>
            {quizzes.length === 0 ? (
              <p className="text-sm text-muted-foreground">{q ? 'No matching quizzes.' : 'Start by entering a search term.'}</p>
            ) : (
              <ul className="space-y-3">
                {quizzes.map(qz => (
                  <li key={qz.slug} className="p-4 rounded-xl border bg-white shadow-sm hover:shadow transition">
                    <Link href={`/quizzes/${qz.slug}`} className="block">
                      <div className="font-medium text-lg">{qz.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">{qz.description}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
