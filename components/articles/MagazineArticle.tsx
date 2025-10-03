'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  User, 
  Calendar, 
  Share2, 
  Bookmark, 
  Heart,
  ArrowLeft,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  imageUrl?: string;
  category?: string;
}

interface MagazineArticleProps {
  article: Article;
  relatedArticles?: Article[];
}

export function MagazineArticle({ article, relatedArticles = [] }: MagazineArticleProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Back Navigation */}
      <div className="fixed top-20 left-4 z-40">
        <Link href="/blog">
          <Button variant="outline" size="sm" className="shadow-lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>

      {/* Article Actions */}
      <div className="fixed top-20 right-4 z-40 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`shadow-lg ${isBookmarked ? 'bg-purple-50 text-purple-600' : ''}`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsLiked(!isLiked)}
          className={`shadow-lg ${isLiked ? 'bg-red-50 text-red-600' : ''}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} className="shadow-lg">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-24">
        {/* Article Header */}
        <header className="mb-12">
          {article.category && (
            <div className="mb-4">
              <Badge variant="secondary" className="text-purple-600 bg-purple-50">
                {article.category}
              </Badge>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 font-light">
            {article.excerpt}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-700">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} min read</span>
            </div>
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg prose-slate max-w-none">
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: formatArticleContent(article.content) }}
          />
        </div>

        {/* Article Tags */}
        {article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className="mt-16 p-8 bg-gray-50 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {article.author.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.author}</h3>
              <p className="text-gray-600 leading-relaxed">
                Research-focused writer exploring the intersection of psychology, technology, and human behavior. 
                Passionate about making complex behavioral science accessible and actionable.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedArticles.slice(0, 4).map((relatedArticle) => (
                <Link key={relatedArticle.id} href={`/blog/${relatedArticle.id}`}>
                  <div className="group cursor-pointer">
                    {relatedArticle.imageUrl && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={relatedArticle.imageUrl}
                          alt={relatedArticle.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {relatedArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{relatedArticle.readTime} min read</span>
                      <span>{formatDate(relatedArticle.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

// Helper function to format article content with proper headings
function formatArticleContent(content: string): string {
  // Convert markdown-style headings to proper HTML with magazine styling
  let formattedContent = content
    // H1 headings (main sections)
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl md:text-4xl font-bold text-gray-900 mt-16 mb-8 leading-tight">$1</h1>')
    // H2 headings (subsections)
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl md:text-3xl font-semibold text-gray-800 mt-12 mb-6 leading-tight">$1</h2>')
    // H3 headings (sub-subsections)
    .replace(/^### (.+)$/gm, '<h3 class="text-xl md:text-2xl font-semibold text-gray-800 mt-10 mb-4 leading-tight">$1</h3>')
    // H4 headings
    .replace(/^#### (.+)$/gm, '<h4 class="text-lg md:text-xl font-semibold text-gray-700 mt-8 mb-3 leading-tight">$1</h4>')
    // Bold text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    // Italic text
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    // Paragraphs
    .replace(/^(?!<[h1-6]|<strong|<em)(.+)$/gm, '<p class="text-lg leading-relaxed text-gray-700 mb-6">$1</p>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-purple-500 pl-6 py-4 my-8 bg-purple-50 text-lg italic text-gray-700">$1</blockquote>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="text-lg text-gray-700 mb-2">$1</li>')
    .replace(/(<li.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-2 mb-6 ml-4">$1</ul>');

  return formattedContent;
}
