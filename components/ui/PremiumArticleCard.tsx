'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, Eye, Star } from 'lucide-react';

interface PremiumArticleCardProps {
  title: string;
  category: string;
  readTime?: string;
  views?: number;
  isPremium?: boolean;
  onRead?: () => void;
  className?: string;
}

export function PremiumArticleCard({
  title,
  category,
  readTime = "3 min read",
  views = 0,
  isPremium = false,
  onRead,
  className = ""
}: PremiumArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`
        premium-article-card w-full max-w-sm mx-auto
        bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300
        ${className}
      `}
    >
      {/* Gradient Header */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lilac-400 to-lilac-300 rounded-t-2xl" />

      {/* Hero Section */}
      <div className="card__hero bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 pt-8 text-sm">
        {/* Header */}
        <div className="card__hero-header flex justify-between items-center mb-6">
          <span className="text-xs font-semibold text-lilac-700 bg-lilac-100 px-2.5 py-1 rounded-full">
            {category}
          </span>
          {isPremium && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-xs font-medium">Premium</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="card__job-title text-lg font-bold leading-tight text-gray-900 mb-4">
          {title}
        </h3>
      </div>

      {/* Footer */}
      <div className="card__footer flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-3 border-t border-gray-200">
        {/* Stats */}
        <div className="card__job-summary flex items-center gap-3 text-gray-500 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{readTime}</span>
          </div>
          {views > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{views.toLocaleString()} views</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRead}
          className="card__btn w-full sm:w-auto font-medium border-none cursor-pointer text-center px-4 py-2 rounded-lg bg-gradient-to-r from-lilac-400 to-lilac-300 text-lilac-900 text-xs hover:from-lilac-300 hover:to-lilac-200 transition-all duration-200 flex items-center justify-center gap-1 shadow-sm hover:shadow-md"
        >
          Read
          <ArrowRight className="w-3 h-3" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default PremiumArticleCard;
