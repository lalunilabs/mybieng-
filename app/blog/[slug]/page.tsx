import { BlogReader } from '@/components/BlogReader';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadArticleBySlug, loadAllArticles } from '@/lib/content';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    email?: string;
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = loadArticleBySlug(params.slug);
  if (!blog) return {};
  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.excerpt;
  const url = blog.canonicalUrl || `https://mybeing.app/blog/${blog.slug}`;
  const images = blog.ogImage ? [blog.ogImage] : blog.imageUrl ? [blog.imageUrl] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: blog.robots,
    keywords: blog.keywords,
    openGraph: {
      title,
      description,
      url,
      images
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images
    }
  };
}

export default function BlogPage({ params, searchParams }: BlogPageProps) {
  const blog = loadArticleBySlug(params.slug);
  if (!blog || blog.published === false) {
    notFound();
  }
  const all = loadAllArticles()
    .filter(a => a.published !== false)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  const idx = all.findIndex(a => a.slug === blog.slug);
  const next = idx > 0 ? all[idx - 1] : undefined; // newer
  const prev = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined; // older
  return <BlogReader blog={blog} userEmail={searchParams.email} prev={prev} next={next} />;
}
