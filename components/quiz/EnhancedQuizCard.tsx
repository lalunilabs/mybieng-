'use client';

import { motion } from 'framer-motion';
import { Clock, Users, Star, ArrowRight, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface EnhancedQuizCardProps {
  slug: string;
  title: string;
  description: string;
  isPaid?: boolean;
  estimatedTime?: number;
  completions?: number;
  rating?: number;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  featured?: boolean;
}

export function EnhancedQuizCard({
  slug,
  title,
  description,
  isPaid = false,
  estimatedTime = 10,
  completions = 0,
  rating = 4.8,
  tags = [],
  difficulty = 'intermediate',
  featured = false
}: EnhancedQuizCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    advanced: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group relative overflow-hidden rounded-3xl border-2 transition-all duration-500 ${
        featured 
          ? 'border-purple-200 bg-gradient-to-br from-purple-50 via-white to-indigo-50 shadow-xl' 
          : 'border-gray-100 bg-white shadow-soft hover:shadow-large hover:border-purple-200'
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium rounded-full">
            <Sparkles className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* Premium Badge */}
      {isPaid && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-full">
            <Lock className="w-3 h-3" />
            Premium
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${difficultyColors[difficulty]}`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating}</span>
            </div>
          </div>

          <h3 className="text-2xl font-display font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
            {title}
          </h3>

          <p className="text-gray-600 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-purple-100 hover:text-purple-700 transition-colors"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-6 mb-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{estimatedTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{completions.toLocaleString()} completed</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={`/quizzes/${slug}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              featured
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-900 text-white hover:bg-purple-600 shadow-soft hover:shadow-medium'
            }`}
          >
            <span>Start Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Decorative Elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
    </motion.div>
  );
}
