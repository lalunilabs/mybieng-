'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Bookmark, Share2, Clock, User, Tag, ArrowLeft, Coffee, Eye } from 'lucide-react';
import { ShareButtons } from '@/components/social/ShareButtons';
import { AdPlacement } from '@/components/ads/AdPlacement';
import Link from 'next/link';

interface EnhancedBlogReaderProps {
  slug: string;
  title: string;
  content: string;
  author: string;
  date: string;
  readTime: number;
  tags?: string[];
  excerpt?: string;
}

export function EnhancedBlogReader({
  slug,
  title,
  content,
  author,
  date,
  readTime,
  tags = [],
  excerpt
}: EnhancedBlogReaderProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(readTime);

  const { scrollYProgress } = useScroll({ target: contentRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Calculate reading progress
  useEffect(() => {
    const updateReadingProgress = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const windowHeight = scrollHeight - clientHeight;
        const progress = (scrollTop / windowHeight) * 100;
        setReadingProgress(Math.min(progress, 100));
      }
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  // Enhanced content formatting
  const formatContent = (text: string) => {
    return text
      .split('\n\n')
      .map((paragraph, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="mb-6 text-lg leading-relaxed text-gray-700 font-serif tracking-wide"
        >
          {paragraph}
        </motion.p>
      ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-purple-50/20">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Back Navigation */}
      <div className="fixed top-20 left-6 z-40 hidden lg:block">
        <Link
          href="/blog"
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft hover:shadow-medium transition-all duration-300 text-gray-600 hover:text-purple-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Blog</span>
        </Link>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex gap-12">
          {/* Main Article */}
          <article className="flex-1 max-w-4xl">
            {/* Article Header */}
            <motion.header
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full text-purple-700 font-medium text-sm mb-6"
              >
                <Coffee className="w-4 h-4" />
                Personal Health Environment
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl md:text-6xl font-display font-bold text-gray-900 leading-tight mb-8 tracking-tight"
              >
                {title}
              </motion.h1>

              {/* Excerpt */}
              {excerpt && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8 font-serif italic"
                >
                  {excerpt}
                </motion.p>
              )}

              {/* Meta Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center justify-center gap-8 text-gray-500 text-sm"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{new Date(date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </motion.div>
            </motion.header>

            {/* Article Content */}
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="prose prose-xl max-w-none"
              style={{ y }}
            >
              <div className="bg-white rounded-3xl p-12 shadow-soft border border-gray-100/50">
                {formatContent(content)}
              </div>
            </motion.div>

            {/* Tags */}
            {tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-12 flex flex-wrap items-center gap-3"
              >
                <Tag className="w-5 h-5 text-gray-400" />
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full text-sm font-medium hover:from-purple-100 hover:to-indigo-100 hover:text-purple-700 transition-all duration-300 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Engagement Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 flex items-center justify-between p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100/50"
            >
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => setIsLiked(!isLiked)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    isLiked 
                      ? 'bg-red-100 text-red-600 shadow-soft' 
                      : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 shadow-soft'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">Like</span>
                </motion.button>

                <motion.button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    isBookmarked 
                      ? 'bg-purple-100 text-purple-600 shadow-soft' 
                      : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600 shadow-soft'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span className="font-medium">Save</span>
                </motion.button>
              </div>

              <ShareButtons url={slug} title={title} variant="inline" />
            </motion.div>
          </article>

          {/* Sidebar */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Ad Placement */}
              <AdPlacement adId="blog-sidebar-ad" position="article-sidebar" />
              
              {/* About MyBeing */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-8 shadow-soft border border-purple-100/50"
              >
                <h3 className="font-display font-bold text-xl text-gray-900 mb-4">
                  About MyBeing
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Your Personal Health Environment for self-discovery and growth through research-backed content and personalized assessments.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors"
                >
                  Learn more
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </motion.div>

              {/* Reading Progress */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100/50"
              >
                <h4 className="font-semibold text-gray-900 mb-3">Reading Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {Math.round(readingProgress)}% complete
                </p>
              </motion.div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
