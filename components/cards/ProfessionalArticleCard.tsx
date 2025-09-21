'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLikes } from '@/hooks/useLikes';
import { motion } from 'framer-motion';
import { Eye, Heart, Clock, ArrowUpRight, Bookmark } from 'lucide-react';

interface ProfessionalArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  author?: string;
  date: string;
  readTime: number;
  category: string;
  image?: string;
  viewCount?: number;
  likeCount?: number;
  isPremium?: boolean;
  tags?: string[];
}

export function ProfessionalArticleCard({
  slug,
  title,
  excerpt,
  author = 'MyBeing Team',
  date,
  readTime,
  category,
  image,
  viewCount = 1234,
  isPremium = false,
  tags = []
}: ProfessionalArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isLiked, likeCount, toggleLike } = useLikes({ itemId: slug, itemType: 'article', initialLikeCount: 0 });
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl"
    >
      <Link href={`/blog/${slug}`} className="block">
        {/* Image Section with Overlay */}
        {image && (
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100">
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0"
            >
              {/* Image placeholder - replace with actual image */}
              <div className="w-full h-full bg-gradient-to-br from-purple-400/20 to-indigo-400/20" />
            </motion.div>
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-medium text-gray-700"
              >
                {category}
              </motion.div>
            </div>

            {/* Premium Badge */}
            {isPremium && (
              <div className="absolute top-4 right-4">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full text-xs font-medium text-white shadow-lg"
                >
                  Premium
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="p-6">
          {/* Title with hover effect */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{author}</span>
              <span>·</span>
              <span>{formatDate(date)}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime} min
              </span>
            </div>
          </div>

          {/* Engagement Stats - Subtle */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              {/* Views */}
              <motion.div 
                className="flex items-center gap-1.5 text-gray-400"
                whileHover={{ scale: 1.05 }}
              >
                <Eye className="w-4 h-4" />
                <span className="text-xs font-medium">{formatCount(viewCount)}</span>
              </motion.div>

              {/* Likes */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  toggleLike();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">{formatCount(likeCount)}</span>
              </motion.button>

              {/* Bookmark */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  setIsBookmarked(!isBookmarked);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`transition-colors ${
                  isBookmarked ? 'text-purple-500' : 'text-gray-400 hover:text-purple-400'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </motion.button>
            </div>

            {/* Read More Arrow */}
            <motion.div
              animate={{ x: isHovered ? 3 : 0 }}
              className="text-purple-500"
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Tags - Very Subtle */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
