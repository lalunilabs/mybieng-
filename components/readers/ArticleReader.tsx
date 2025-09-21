'use client';

import { useState, useEffect, useRef } from 'react';
import { useLikes } from '@/hooks/useLikes';
import { motion, useScroll } from 'framer-motion';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { ShareButtons } from '@/components/social/ShareButtons';
import { ProfessionalArticleCard } from '@/components/cards/ProfessionalArticleCard';
import { getRelatedContent } from '@/lib/recommendations';
import { AdPlacement } from '@/components/ads/AdPlacement';
import Newsletter from '@/components/Newsletter';
import { Heart, Bookmark, Share2, Clock, User, Tag } from 'lucide-react';

interface ArticleReaderProps {
  slug: string;
  title: string;
  content: string; // Assuming HTML or Markdown content
  author: string;
  date: string;
  readTime: number;
  category: string;
  tags?: string[];
  relatedArticles?: any[];
}

export function ArticleReader({
  slug,
  title,
  content,
  author,
  date,
  readTime,
  category,
  tags = [],
}: ArticleReaderProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { isLiked, likeCount, toggleLike } = useLikes({ itemId: slug, itemType: 'article' });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [dynamicRelated, setDynamicRelated] = useState<any[]>([]);

  // For the sticky engagement bar
  const { scrollYProgress } = useScroll({ target: contentRef });

  useEffect(() => {
    const fetchRelated = async () => {
      const related = await getRelatedContent({ slug, tags }, 2);
      setDynamicRelated(related);
    };
    fetchRelated();
  }, [slug, category, tags]);

  return (
    <div className="bg-white font-serif">
      {/* Reading progress bar at the top */}
      <ReadingProgress content={content} />

      {/* Main Article Content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-3xl mx-auto px-6 py-24"
      >
        {/* Article Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm font-medium text-purple-600 uppercase tracking-wider mb-4"
          >
            {category}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
          >
            {title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center gap-6 text-sm text-gray-500"
          >
            <span className="flex items-center gap-2"><User className="w-4 h-4" /> {author}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {readTime} min read</span>
            <span>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </motion.div>
        </header>

        {/* Sticky Engagement Sidebar */}
        <div className="absolute left-full ml-8 hidden xl:block">
          <div className="sticky top-48 flex flex-col items-center gap-4">
            <motion.button
              onClick={toggleLike}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-full transition-colors duration-200 ${
                isLiked ? 'bg-red-100 text-red-500' : 'bg-gray-100 hover:bg-red-50 text-gray-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.button
              onClick={() => setIsBookmarked(!isBookmarked)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-full transition-colors duration-200 ${
                isBookmarked ? 'bg-purple-100 text-purple-500' : 'bg-gray-100 hover:bg-purple-50 text-gray-500'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </motion.button>
            <ShareButtons url={slug} title={title} variant="minimal" />
          </div>
        </div>

        {/* Article Body */}
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="prose prose-lg max-w-none prose-p:text-gray-700 prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-purple-600 prose-strong:font-bold prose-blockquote:border-l-purple-400 prose-blockquote:pl-4 prose-blockquote:text-gray-600"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Tag className="w-4 h-4 text-gray-400" />
            {tags.map(tag => (
              <span key={tag} className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </motion.article>

      {/* Post-Article Section */}
      <div className="bg-gray-50/70 py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Newsletter CTA */}
          <div className="mb-20">
            <Newsletter />
          </div>

          {/* Related Articles */}
          {dynamicRelated.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Continue Your Journey</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {dynamicRelated.map(article => (
                  <ProfessionalArticleCard key={article.slug} {...article} />
                ))}
              </div>
            </div>
          )}

          {/* Ad Placement - very subtle */}
          <div className="mt-20">
            <AdPlacement adId="article-footer-ad" position="between-content" />
          </div>
        </div>
      </div>
    </div>
  );
}
