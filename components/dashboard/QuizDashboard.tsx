'use client';

import { motion } from 'framer-motion';
import { QuizResultCard } from '@/components/ui/QuizLandscapeCard';
import { Plus, Filter, Search, Calendar } from 'lucide-react';
import { useState } from 'react';

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
}

interface QuizDashboardProps {
  quizzes: QuizResult[];
  onQuizClick?: (quiz: QuizResult) => void;
  onTakeNewQuiz?: () => void;
  className?: string;
}

export function QuizDashboard({ 
  quizzes, 
  onQuizClick, 
  onTakeNewQuiz,
  className = "" 
}: QuizDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'title'>('date');

  const categories = [
    { value: 'all', label: 'All Quizzes' },
    { value: 'cognitive', label: 'Cognitive' },
    { value: 'emotional', label: 'Emotional' },
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'social', label: 'Social' }
  ];

  const filteredQuizzes = quizzes
    .filter(quiz => {
      const matchesSearch = quiz.quizTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        case 'score':
          return (b.score / b.maxScore) - (a.score / a.maxScore);
        case 'title':
          return a.quizTitle.localeCompare(b.quizTitle);
        default:
          return 0;
      }
    });

  return (
    <div className={`quiz-dashboard w-full ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground mb-2"
        >
          Your Quiz Journey
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Track your self-discovery progress through beautiful landscapes of insight
        </motion.p>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'title')}
            className="pl-10 pr-8 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
          >
            <option value="date">Latest First</option>
            <option value="score">Highest Score</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>

        {/* Take New Quiz Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTakeNewQuiz}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Quiz
        </motion.button>
      </motion.div>

      {/* Quiz Grid */}
      {filteredQuizzes.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"
        >
          {filteredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <QuizResultCard
                quiz={quiz}
                onClick={() => onQuizClick?.(quiz)}
                onChatClick={() => onQuizClick?.(quiz)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No quizzes found' : 'No quizzes yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start your self-discovery journey by taking your first quiz'
            }
          </p>
          {(!searchTerm && selectedCategory === 'all') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTakeNewQuiz}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Take Your First Quiz
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Stats Summary */}
      {quizzes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{quizzes.length}</div>
              <div className="text-sm text-muted-foreground">Quizzes Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(quizzes.reduce((acc, quiz) => acc + (quiz.score / quiz.maxScore), 0) / quizzes.length * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {new Set(quizzes.map(q => q.category)).size}
              </div>
              <div className="text-sm text-muted-foreground">Categories Explored</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.ceil((Date.now() - new Date(quizzes[quizzes.length - 1]?.completedAt).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-muted-foreground">Days Since First</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default QuizDashboard;
