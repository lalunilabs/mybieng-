import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface MarkdownArticle {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  readTime: string;
  category: string;
  tags: string[];
  image?: string;
  slug: string;
  wordCount: number;
}

export function loadMarkdownArticle(slug: string): MarkdownArticle | null {
  const filePath = path.join(process.cwd(), 'content', 'articles', `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: body } = matter(content);
  
  return {
    title: data.title || 'Untitled',
    excerpt: data.excerpt || '',
    author: data.author || 'MyBeing Research',
    publishedAt: new Date(data.publishedAt || Date.now()),
    readTime: data.readTime || `${Math.ceil(body.trim().split(/\s+/).length / 200)} min read`,
    category: data.category || 'General',
    tags: data.tags || [],
    image: data.image,
    slug,
    content: body,
    wordCount: body.trim().split(/\s+/).length,
  };
}
