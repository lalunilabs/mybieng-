'use client';

import { motion } from 'framer-motion';
import { Brain, Calendar, TrendingUp, Eye, MessageCircle, Star, Clock, BarChart3 } from 'lucide-react';
import Image from 'next/image';

interface QuizResult {
  id: string;
  quizSlug: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  bandLabel: string;
  completedAt: Date;
  insights?: string[];
  category?: 'cognitive' | 'emotional' | 'behavioral' | 'social';
  imageUrl?: string;
  chatMessages?: number;
  lastChatAt?: Date;
}

interface QuizResultCardProps {
  quiz: QuizResult;
  onClick?: () => void;
  onChatClick?: () => void;
  className?: string;
}

const categoryThemes = {
  cognitive: {
    color: 'from-lilac-400 to-lilac-300',
    icon: Brain,
    bgColor: 'bg-lilac-50'
  },
  emotional: {
    color: 'from-pink-500 to-rose-600',
    icon: MessageCircle,
    bgColor: 'bg-pink-50'
  },
  behavioral: {
    color: 'from-green-500 to-emerald-600',
    icon: TrendingUp,
    bgColor: 'bg-green-50'
  },
  social: {
    color: 'from-yellow-500 to-amber-600',
    icon: Eye,
    bgColor: 'bg-yellow-50'
  }
};

export function QuizResultCard({ quiz, onClick, onChatClick, className = "" }: QuizResultCardProps) {
  const theme = categoryThemes[quiz.category || 'cognitive'];
  const IconComponent = theme.icon;
  const scorePercentage = Math.round((quiz.score / quiz.maxScore) * 100);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        quiz-result-card relative w-80 bg-white dark:bg-slate-900 
        rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
        transition-all duration-300 cursor-pointer border border-slate-200 dark:border-slate-700
        ${className}
      `}
    >
      {/* Quiz Image */}
      <div className="relative h-48 overflow-hidden">
        {quiz.imageUrl ? (
          <Image
            src={quiz.imageUrl}
            alt={quiz.quizTitle}
            fill
            className="object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${theme.color} flex items-center justify-center`}>
            <IconComponent className="w-16 h-16 text-white/80" />
          </div>
        )}
        
        {/* Score Badge */}
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full bg-white text-sm font-bold ${getScoreColor(scorePercentage)} shadow-sm`}>
            {scorePercentage}%
          </div>
        </div>
        
        {/* Category Badge */}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
          {quiz.quizTitle}
        </h3>
        
        {/* Band Label */}
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-muted-foreground">
            {quiz.bandLabel}
          </span>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {/* Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Score</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {quiz.score}/{quiz.maxScore}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {formatDate(quiz.completedAt)}
            </span>
          </div>

          {/* Chat Messages */}
          {quiz.chatMessages !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Chat Messages</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {quiz.chatMessages}
              </span>
            </div>
          )}

          {/* Last Chat */}
          {quiz.lastChatAt && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Last Chat</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatDate(quiz.lastChatAt)}
              </span>
            </div>
          )}
        </div>;

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          {quiz.chatMessages !== undefined && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-lilac-400 to-lilac-300 text-lilac-900 rounded-lg text-sm font-medium hover:from-lilac-300 hover:to-lilac-200 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              View Results
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default QuizResultCard;
