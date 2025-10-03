import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { blogs as seedBlogs } from '@/data/blogs';

export interface MarkdownArticle {
  title: string;
  seoTitle?: string;
  excerpt: string;
  metaDescription?: string;
  content: string;
  author: string;
  publishedAt: Date;
  updatedAt?: Date;
  readTime: string;
  category: string;
  tags: string[];
  keywords: string[];
  image?: string;
  ogImage?: string;
  canonicalUrl?: string;
  schemaType?: string;
  slug: string;
  wordCount: number;
}

export function loadMarkdownArticle(slug: string): MarkdownArticle | null {
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  const articlesDir = path.join(process.cwd(), 'content', 'articles');
  const candidates = [
    path.join(blogDir, `${slug}.md`),
    path.join(articlesDir, `${slug}.md`),
  ];

  const filePath = candidates.find((p) => fs.existsSync(p));
  
  // If no markdown file found, check seed blogs data
  if (!filePath) {
    const seedBlog = seedBlogs.find(blog => blog.slug === slug);
    if (seedBlog) {
      const wordCount = seedBlog.content ? seedBlog.content.split(/\s+/).length : 0;
      const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
      
      return {
        title: seedBlog.title,
        seoTitle: seedBlog.title,
        excerpt: seedBlog.excerpt,
        metaDescription: seedBlog.excerpt,
        content: seedBlog.content || '',
        author: seedBlog.author,
        publishedAt: seedBlog.publishedAt,
        updatedAt: undefined,
        readTime,
        category: seedBlog.tags?.[0] || 'General',
        tags: seedBlog.tags || [],
        keywords: seedBlog.tags || [],
        image: undefined,
        ogImage: undefined,
        canonicalUrl: `/blog/${slug}`,
        schemaType: 'BlogPosting',
        slug,
        wordCount,
      };
    }
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content: body } = matter(raw);

  const trimmed = body.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const defaultRead = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
  const readTime = data.readingTime || data.readTime || defaultRead;

  const toArray = (v: any): string[] => (Array.isArray(v) ? v.map(String) : v ? [String(v)] : []);

  return {
    title: data.title || 'Untitled',
    seoTitle: data.seoTitle || data.seo_title,
    excerpt: data.excerpt || '',
    metaDescription: data.metaDescription || data.description,
    author: data.author || 'MyBeing Research',
    publishedAt: new Date(data.publishedAt || Date.now()),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    readTime,
    category: data.category || 'General',
    tags: toArray(data.tags),
    keywords: toArray(data.keywords),
    image: data.image,
    ogImage: data.ogImage || data.og_image,
    canonicalUrl: data.canonicalUrl || data.canonical_url,
    schemaType: data.schemaType || data.schema_type || 'BlogPosting',
    slug,
    content: body,
    wordCount,
  };
}
