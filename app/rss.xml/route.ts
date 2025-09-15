import { NextResponse } from 'next/server';
import { loadAllArticles } from '@/lib/content';

function escape(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.com';
    const now = Date.now();

    const articles = loadAllArticles()
      .filter(a => a.published !== false && a.publishedAt.getTime() <= now)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, 50);

    const rssItems = articles.map(a => {
      const link = `${base}/blog/${a.slug}`;
      const pubDate = a.publishedAt.toUTCString();
      const title = escape(a.title);
      const description = escape(a.metaDescription || a.excerpt || '');
      const categories = (a.tags || []).map(t => `<category>${escape(t)}</category>`).join('');
      const guid = link;
      return `  <item>
    <title>${title}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${guid}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${description}</description>
    ${categories}
  </item>`;
    }).join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>MyBeing Articles</title>
    <link>${base}/blog</link>
    <description>Research-backed articles on psychology, behavior, and personal growth.</description>
    <language>en-us</language>
${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rss, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400' } });
  } catch (e) {
    return new NextResponse('RSS generation failed', { status: 500 });
  }
}
