import { BlogReader } from '@/components/BlogReader';
import EditorialBlogReader from '@/components/EditorialBlogReader';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadArticleBySlug, loadAllArticles } from '@/lib/content';

export const revalidate = 600; // Rebuild every 10 minutes

interface BlogPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    email?: string;
  };
}

export async function generateStaticParams() {
  const now = Date.now();
  const all = loadAllArticles()
    .filter(a => a.published !== false && a.publishedAt.getTime() <= now);
  return all.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = loadArticleBySlug(params.slug);
  if (!blog) return {};
  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.excerpt;
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const url = blog.canonicalUrl || `${base}/blog/${blog.slug}`;
  const fallbackOg = `${base}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description || '')}`;
  const images = blog.ogImage 
    ? [blog.ogImage] 
    : blog.imageUrl 
    ? [blog.imageUrl] 
    : [fallbackOg];
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
  const now = Date.now();
  if (!blog || blog.published === false || blog.publishedAt.getTime() > now) {
    notFound();
  }
  const all = loadAllArticles()
    .filter(a => a.published !== false && a.publishedAt.getTime() <= now)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  const idx = all.findIndex(a => a.slug === blog.slug);
  const next = idx > 0 ? all[idx - 1] : undefined; // newer
  const prev = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined; // older
  // Use editorial magazine-style layout for non-premium articles
  if (!blog.isPremium) {
    const title = blog.metaTitle || blog.title;
    const description = blog.metaDescription || blog.excerpt;
    const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
    const url = blog.canonicalUrl || `${base}/blog/${blog.slug}`;
    const image = blog.ogImage || blog.imageUrl || `${base}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description || '')}`;
    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: `${base}/blog` },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    };
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      image,
      datePublished: blog.publishedAt.toISOString(),
      dateModified: blog.publishedAt.toISOString(),
      author: { '@type': 'Person', name: blog.author || 'MyBeing' },
      publisher: { '@type': 'Organization', name: 'MyBeing' },
      mainEntityOfPage: url,
    };
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <EditorialBlogReader blog={blog} />
      </>
    );
  }
  // Keep premium articles in BlogReader to preserve paywall & subscription controls
  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.excerpt;
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const url = blog.canonicalUrl || `${base}/blog/${blog.slug}`;
  const image = blog.ogImage || blog.imageUrl || `${base}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description || '')}`;
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${base}/blog` },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    datePublished: blog.publishedAt.toISOString(),
    dateModified: blog.publishedAt.toISOString(),
    author: { '@type': 'Person', name: blog.author || 'MyBeing' },
    publisher: { '@type': 'Organization', name: 'MyBeing' },
    mainEntityOfPage: url,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogReader blog={blog} userEmail={searchParams.email} prev={prev} next={next} />
    </>
  );
}
