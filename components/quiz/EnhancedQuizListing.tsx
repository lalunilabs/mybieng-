'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  Users, 
  Star, 
  TrendingUp, 
  Filter, 
  Search, 
  Grid, 
  List,
  Play,
  Award,
  Sparkles,
  Target,
  Heart,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import Image from 'next/image';
import Link from 'next/link';

interface Quiz {
  slug: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: number;
  questionCount: number;
  featured?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  completions?: number;
  rating?: number;
  imageUrl?: string;
  tags: string[];
  premium?: boolean;
  price?: number;
  insights?: string[];
}

interface EnhancedQuizListingProps {
  quizzes: Quiz[];
  featuredQuizzes?: Quiz[];
  userProgress?: Record<string, { completed: boolean; score?: number }>;
}

export function EnhancedQuizListing({ 
  quizzes, 
  featuredQuizzes = [], 
  userProgress = {} 
}: EnhancedQuizListingProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState(quizzes);

  // Get unique categories and difficulties
  const categories = ['all', ...Array.from(new Set(quizzes.map(q => q.category).filter(Boolean)))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  // Filter quizzes
  useEffect(() => {
    let filtered = quizzes;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty);
    }

    if (searchQuery) {
      filtered = filtered.filter(quiz => 
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredQuizzes(filtered);
  }, [quizzes, selectedCategory, selectedDifficulty, searchQuery]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section - Inspired by Typeform/Kahoot */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1.2, 1, 1.2],
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="text-purple-700 font-semibold">Self-Discovery Assessments</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Hidden Patterns
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Research-backed assessments that reveal insights about your behavior, 
              decision-making, and personal growth opportunities.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Assessments Taken</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-600">Research-Backed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Find Valuable</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Anonymous</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Quizzes - Inspired by BuzzFeed/Medium */}
      {featuredQuizzes.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Assessments</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredQuizzes.slice(0, 2).map((quiz) => (
                <FeaturedQuizCard 
                  key={quiz.slug} 
                  quiz={quiz} 
                  userProgress={userProgress[quiz.slug]}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters & Search */}
      <section className="py-8 px-6 bg-white/50 backdrop-blur-sm border-y border-white/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-purple-500"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white shadow-sm' : 'hover:bg-gray-100'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' ? 'bg-purple-600 text-white shadow-sm' : 'hover:bg-gray-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quizzes Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${selectedCategory}-${selectedDifficulty}-${searchQuery}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredQuizzes.map((quiz, index) => (
                    <QuizCard 
                      key={quiz.slug} 
                      quiz={quiz} 
                      index={index}
                      userProgress={userProgress[quiz.slug]}
                    />
                  ))}
                </div>
              )}

              {viewMode === 'list' && (
                <div className="space-y-6">
                  {filteredQuizzes.map((quiz, index) => (
                    <QuizListItem 
                      key={quiz.slug} 
                      quiz={quiz} 
                      index={index}
                      userProgress={userProgress[quiz.slug]}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {filteredQuizzes.length === 0 && (
            <div className="text-center py-16">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No assessments found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Featured Quiz Card Component
function FeaturedQuizCard({ 
  quiz, 
  userProgress 
}: { 
  quiz: Quiz; 
  userProgress?: { completed: boolean; score?: number };
}) {
  return (
    <Link href={`/quizzes/${quiz.slug}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group cursor-pointer"
      >
        <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50">
          <div className="relative">
            {quiz.imageUrl && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={quiz.imageUrl}
                  alt={quiz.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
              {quiz.premium && (
                <Badge className="bg-purple-600 text-white">
                  <Lock className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            {userProgress?.completed && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">{quiz.category}</Badge>
              {quiz.difficulty && (
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty}
                </Badge>
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-3">
              {quiz.title}
            </h3>
            
            <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
              {quiz.description}
            </p>

            {quiz.insights && quiz.insights.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">You'll discover:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {quiz.insights.slice(0, 2).map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Target className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{quiz.estimatedTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="w-4 h-4" />
                  <span>{quiz.questionCount} questions</span>
                </div>
              </div>
              {quiz.completions && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{quiz.completions.toLocaleString()}</span>
                </div>
              )}
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl">
              <Play className="w-4 h-4 mr-2" />
              {userProgress?.completed ? 'Retake Assessment' : 'Start Assessment'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

// Regular Quiz Card Component
function QuizCard({ 
  quiz, 
  index, 
  userProgress 
}: { 
  quiz: Quiz; 
  index: number;
  userProgress?: { completed: boolean; score?: number };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/quizzes/${quiz.slug}`}>
        <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-white/70 backdrop-blur-sm">
          <div className="relative">
            {quiz.imageUrl && (
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={quiz.imageUrl}
                  alt={quiz.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-2">
              {quiz.premium && (
                <Badge className="bg-purple-600 text-white text-xs">
                  Premium
                </Badge>
              )}
              {userProgress?.completed && (
                <Badge className="bg-green-500 text-white text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Done
                </Badge>
              )}
            </div>
          </div>
          
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">{quiz.category}</Badge>
              {quiz.difficulty && (
                <Badge className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </Badge>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2">
              {quiz.title}
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
              {quiz.description}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{quiz.estimatedTime}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  <span>{quiz.questionCount}</span>
                </div>
              </div>
              {quiz.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>{quiz.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
            >
              <Play className="w-3 h-3 mr-2" />
              {userProgress?.completed ? 'Retake' : 'Start'}
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// List View Quiz Item
function QuizListItem({ 
  quiz, 
  index, 
  userProgress 
}: { 
  quiz: Quiz; 
  index: number;
  userProgress?: { completed: boolean; score?: number };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/quizzes/${quiz.slug}`}>
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {quiz.imageUrl && (
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={quiz.imageUrl}
                    alt={quiz.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{quiz.category}</Badge>
                    {quiz.difficulty && (
                      <Badge className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </Badge>
                    )}
                    {quiz.premium && (
                      <Badge className="bg-purple-600 text-white text-xs">Premium</Badge>
                    )}
                    {userProgress?.completed && (
                      <Badge className="bg-green-500 text-white text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Play className="w-3 h-3 mr-2" />
                    {userProgress?.completed ? 'Retake' : 'Start'}
                  </Button>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                  {quiz.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-3 line-clamp-2">
                  {quiz.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{quiz.estimatedTime} minutes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      <span>{quiz.questionCount} questions</span>
                    </div>
                    {quiz.completions && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{quiz.completions.toLocaleString()} taken</span>
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function getDifficultyColor(difficulty?: string) {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-700';
    case 'intermediate': return 'bg-yellow-100 text-yellow-700';
    case 'advanced': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
