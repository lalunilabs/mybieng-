'use client';

import { motion } from 'framer-motion';
import { Play, BookOpen, Clock, Users } from 'lucide-react';

interface PremiumQuizCardProps {
  title: string;
  subtitle: string;
  duration?: string;
  participants?: number;
  onTakeQuiz?: () => void;
  onLearnMore?: () => void;
  className?: string;
}

export function PremiumQuizCard({
  title,
  subtitle,
  duration = "5-10 min",
  participants = 0,
  onTakeQuiz,
  onLearnMore,
  className = ""
}: PremiumQuizCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className={`
        premium-quiz-card relative w-64 h-52 rounded-2xl overflow-hidden
        bg-gradient-to-br from-white to-gray-50
        border border-gray-200 shadow-md hover:shadow-lg
        ${className}
      `}
    >
      {/* Gradient Header */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-lilac-400 to-lilac-300" />

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col pt-6">
        <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{title}</h3>
        <p className="subtitle text-xs text-gray-600 flex-1 mb-4">
          {subtitle}
        </p>
        
        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </div>
          {participants > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {participants.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full rounded-b-2xl overflow-hidden border-t border-gray-200">
        <motion.button
          whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onTakeQuiz}
          className="w-1/2 h-10 bg-white hover:bg-purple-50 flex items-center justify-center transition-colors text-purple-600 font-medium text-sm"
        >
          <Play className="w-4 h-4 mr-1" />
          Start
        </motion.button>
        
        <motion.button
          whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onLearnMore}
          className="w-1/2 h-10 bg-white hover:bg-indigo-50 flex items-center justify-center transition-colors border-l border-gray-200 text-indigo-600 font-medium text-sm"
        >
          <BookOpen className="w-4 h-4 mr-1" />
          Learn
        </motion.button>
      </div>
    </motion.div>
  );
}

export default PremiumQuizCard;
