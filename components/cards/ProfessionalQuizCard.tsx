'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLikes } from '@/hooks/useLikes';
import { Eye, Heart, Clock, ArrowUpRight, BarChart3 } from 'lucide-react';

interface ProfessionalQuizCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  duration: number;
  questionCount: number;
  viewCount?: number;
  isPremium?: boolean;
}

export function ProfessionalQuizCard({
  slug,
  title,
  excerpt,
  category,
  duration,
  questionCount,
  viewCount = 2456,
  isPremium = false,
}: ProfessionalQuizCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isLiked, likeCount, toggleLike } = useLikes({ itemId: slug, itemType: 'quiz' });

  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl"
    >
      <Link href={`/quizzes/${slug}`} className="block p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            {category}
          </div>
          {isPremium && (
            <div className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full text-xs font-medium text-white shadow-lg">
              Premium
            </div>
          )}
        </div>

        {/* Title and Excerpt */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-6">
          {excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {duration} min</span>
          <span className="flex items-center gap-1.5"><BarChart3 className="w-3 h-3" /> {questionCount} Questions</span>
        </div>

        {/* Footer with Stats and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-medium">{formatCount(viewCount)}</span>
            </div>
            <motion.button
              onClick={(e) => { e.preventDefault(); toggleLike(); }}
              whileHover={{ scale: 1.1 }}
              className={`flex items-center gap-1.5 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">{formatCount(likeCount)}</span>
            </motion.button>
          </div>
          <motion.div animate={{ x: isHovered ? 3 : 0 }} className="text-purple-500">
            <ArrowUpRight className="w-4 h-4" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
