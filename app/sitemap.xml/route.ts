import { NextResponse } from 'next/server';
import { loadAllArticles, loadAllQuizzes } from '@/lib/content';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
    const now = Date.now();
    const currentDate = new Date().toISOString();

    const blogs = loadAllArticles()
      .filter(b => b.published !== false && b.publishedAt.getTime() <= now)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    const quizzes = loadAllQuizzes()
      .filter(q => q.published !== false && (!q.publishedAt || new Date(q.publishedAt).getTime() <= now))
      .sort((a, b) => (a.slug < b.slug ? -1 : 1));

    const urls: string[] = [];
    const add = (loc: string, lastmod?: string, changefreq = 'monthly', priority = '0.8') => {
      urls.push(`  <url>\n    <loc>${loc}</loc>\n    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`);
    };

    // Core pages
    add(`${baseUrl}`, currentDate, 'weekly', '1.0');
    add(`${baseUrl}/about`, currentDate, 'monthly', '0.8');
    add(`${baseUrl}/research`, currentDate, 'monthly', '0.8');
    add(`${baseUrl}/blog`, currentDate, 'weekly', '0.9');
    add(`${baseUrl}/quizzes`, currentDate, 'weekly', '0.9');
    add(`${baseUrl}/how-it-works`, currentDate, 'monthly', '0.8');
    add(`${baseUrl}/check-ins`, currentDate, 'daily', '0.7');

    // Blog posts
    blogs.forEach(blog => {
      add(`${baseUrl}/blog/${blog.slug}`, blog.publishedAt.toISOString(), 'monthly', '0.7');
    });

    // Quizzes
    quizzes.forEach(quiz => {
      const lastmod = quiz.publishedAt ? new Date(quiz.publishedAt).toISOString() : currentDate;
      add(`${baseUrl}/quizzes/${quiz.slug}`, lastmod, 'monthly', '0.8');
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
    return new NextResponse(sitemap, { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
