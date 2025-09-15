import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/adminAuth';
import { loadAllArticles, saveArticle, type SaveArticleInput, deleteArticle } from '@/lib/content';

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const articles = loadAllArticles().map(a => ({
    ...a,
    publishedAt: a.publishedAt.toISOString(),
  }));
  return NextResponse.json({ items: articles });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await req.json().catch(() => null)) as SaveArticleInput | null;
  if (!body || !body.slug || !body.title || !body.publishedAt) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  try {
    saveArticle(body);
    // Optional: Update Algolia index if configured
    try {
      const appId = process.env.ALGOLIA_APP_ID;
      const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
      const indexName = process.env.ALGOLIA_INDEX_NAME;
      if (appId && adminKey && indexName) {
        const endpoint = `https://${appId}.algolia.net/1/indexes/${encodeURIComponent(indexName)}/${encodeURIComponent('article:' + body.slug)}`;
        const record = {
          objectID: 'article:' + body.slug,
          docType: 'article',
          slug: body.slug,
          title: body.title,
          excerpt: (body as any).excerpt || (body as any).metaDescription || '',
          tags: (body as any).tags || [],
          imageUrl: (body as any).imageUrl || '',
          publishedAt: body.publishedAt,
        };
        await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Algolia-Application-Id': appId,
            'X-Algolia-API-Key': adminKey,
          },
          body: JSON.stringify(record),
        });
      }
    } catch {}
    // Revalidate relevant paths so updates show immediately
    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${body.slug}`);
      revalidatePath('/sitemap.xml');
      revalidatePath('/rss.xml');
    } catch {}
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to save' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  deleteArticle(slug);
  // Optional: remove from Algolia index
  try {
    const appId = process.env.ALGOLIA_APP_ID;
    const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
    const indexName = process.env.ALGOLIA_INDEX_NAME;
    if (appId && adminKey && indexName) {
      const endpoint = `https://${appId}.algolia.net/1/indexes/${encodeURIComponent(indexName)}/${encodeURIComponent('article:' + slug)}`;
      await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'X-Algolia-Application-Id': appId,
          'X-Algolia-API-Key': adminKey,
        },
      });
    }
  } catch {}
  try {
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/sitemap.xml');
    revalidatePath('/rss.xml');
  } catch {}
  return NextResponse.json({ ok: true });
}

export const dynamic = 'force-dynamic';
