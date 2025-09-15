import { NextRequest, NextResponse } from 'next/server';
import { loadAllArticles, loadAllQuizzes } from '@/lib/content';

function normalize(s: string) {
  return (s || '').toLowerCase();
}

function localSearch(q: string, limit: number, filterType?: 'article' | 'quiz') {
  const now = Date.now();
  const articles = loadAllArticles()
    .filter(a => a.published !== false && a.publishedAt.getTime() <= now)
    .map(a => ({
      id: `article:${a.slug}`,
      docType: 'article' as const,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt || a.metaDescription || '',
      tags: a.tags || [],
      imageUrl: a.imageUrl || '',
      publishedAt: a.publishedAt.toISOString()
    }));

  const quizzes = loadAllQuizzes()
    .filter(qz => qz.published !== false && (!qz.publishedAt || new Date(qz.publishedAt).getTime() <= now))
    .map(qz => ({
      id: `quiz:${qz.slug}`,
      docType: 'quiz' as const,
      slug: qz.slug,
      title: qz.title,
      excerpt: qz.description || '',
      tags: (qz as any).tags || [],
      imageUrl: (qz as any).imageUrl || '',
      publishedAt: (qz as any).publishedAt ? new Date((qz as any).publishedAt).toISOString() : ''
    }));

  const needle = normalize(q);
  let items = [...articles, ...quizzes];
  if (filterType) {
    items = items.filter(i => i.docType === filterType);
  }
  items = items.filter(x => {
    if (!needle) return true;
    return (
      normalize(x.title).includes(needle) ||
      normalize(x.excerpt).includes(needle) ||
      (x.tags || []).some((t: string) => normalize(t).includes(needle))
    );
  });

  // basic ranking: title hit > tags > excerpt > recency
  const scored = items.map(x => {
    let score = 0;
    if (normalize(x.title).includes(needle)) score += 3;
    if ((x.tags || []).some((t: string) => normalize(t).includes(needle))) score += 2;
    if (normalize(x.excerpt).includes(needle)) score += 1;
    const ts = x.publishedAt ? Date.parse(x.publishedAt) : 0;
    score += Math.min(2, (Date.now() - ts) < 90 * 24 * 3600 * 1000 ? 1 : 0); // small recency boost
    return { x, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.x);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const limit = Math.max(1, Math.min(parseInt(searchParams.get('limit') || '10', 10) || 10, 20));
  const typeParam = (searchParams.get('type') || '').trim();
  const filterType = typeParam === 'article' || typeParam === 'quiz' ? (typeParam as 'article' | 'quiz') : undefined;

  const appId = process.env.ALGOLIA_APP_ID;
  const searchKey = process.env.ALGOLIA_SEARCH_API_KEY;
  const indexName = process.env.ALGOLIA_INDEX_NAME;

  try {
    if (appId && searchKey && indexName) {
      // Use Algolia REST API for search
      const endpoint = `https://${appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(indexName)}/query`;
      const body: any = { query: q, hitsPerPage: limit };
      if (filterType) {
        body.filters = `docType:${filterType}`;
      }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Algolia-Application-Id': appId,
          'X-Algolia-API-Key': searchKey,
        },
        body: JSON.stringify(body),
        // Avoid caching dynamic search queries at the edge unintentionally
        cache: 'no-store',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Algolia error ${res.status}: ${text}`);
      }
      const json = await res.json();
      const items = (json.hits || []).map((hit: any) => ({
        id: hit.objectID || hit.id,
        docType: hit.docType || (hit.type || 'article'),
        slug: hit.slug,
        title: hit.title,
        excerpt: hit.excerpt || hit.description || '',
        tags: hit.tags || [],
        imageUrl: hit.imageUrl || '',
        publishedAt: hit.publishedAt || '',
      }));
      return NextResponse.json({ items });
    }
  } catch (e) {
    // Fall back to local search if Algolia fails
  }

  const items = localSearch(q, limit, filterType);
  return NextResponse.json({ items });
}
