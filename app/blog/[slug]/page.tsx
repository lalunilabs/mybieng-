import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadMarkdownArticle, type MarkdownArticle } from '@/lib/markdown-loader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const revalidate = 600;

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const fs = require('fs');
  const path = require('path');
  const articlesDir = path.join(process.cwd(), 'content', 'articles');
  
  if (!fs.existsSync(articlesDir)) return [];
  
  const files = fs.readdirSync(articlesDir).filter((f: string) => f.endsWith('.md'));
  return files.map((f: string) => ({ slug: f.replace('.md', '') }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = loadMarkdownArticle(params.slug);
  if (!article) return {};
  
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${base}/blog/${params.slug}`,
      images: [article.image || `${base}/api/og?title=${encodeURIComponent(article.title)}`]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    }
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  const article = loadMarkdownArticle(params.slug);
  
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <nav className="flex items-center text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-purple-600">Home</a>
              <span className="mx-2">/</span>
              <a href="/blog" className="hover:text-purple-600">Articles</a>
              <span className="mx-2">/</span>
              <span className="text-gray-700">{article.category}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <span>By {article.author}</span>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              <span>{article.readTime}</span>
            </div>

            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag: string) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
              p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-purple-500 pl-4 italic my-4 text-gray-600">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
