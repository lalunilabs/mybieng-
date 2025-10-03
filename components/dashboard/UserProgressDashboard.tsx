'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  Brain, 
  Clock,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Heart,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import Link from 'next/link';

interface UserStats {
  quizzesCompleted: number;
  totalQuizzes: number;
  articlesRead: number;
  streakDays: number;
  insightsUnlocked: number;
  joinedDate: string;
  lastActive: string;
}

interface QuizProgress {
  id: string;
  title: string;
  completedAt: string;
  score?: number;
  category: string;
  insights: string[];
  nextRecommended?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserProgressDashboardProps {
  userId: string;
}

export function UserProgressDashboard({ userId }: UserProgressDashboardProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentQuizzes, setRecentQuizzes] = useState<QuizProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserProgress();
  }, [userId]);

  const loadUserProgress = async () => {
    try {
      const [statsRes, quizzesRes, achievementsRes] = await Promise.all([
        fetch(`/api/user/${userId}/stats`),
        fetch(`/api/user/${userId}/recent-quizzes`),
        fetch(`/api/user/${userId}/achievements`)
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (quizzesRes.ok) setRecentQuizzes(await quizzesRes.json());
      if (achievementsRes.ok) setAchievements(await achievementsRes.json());
    } catch (error) {
      console.error('Failed to load user progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="text-gray-500">Unable to load progress data</div>
      </div>
    );
  }

  const completionRate = (stats.quizzesCompleted / stats.totalQuizzes) * 100;
  const daysSinceJoined = Math.floor((Date.now() - new Date(stats.joinedDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-gray-900"
        >
          Your Self-Discovery Journey
        </motion.h1>
        <p className="text-lg text-gray-600">
          Track your progress and celebrate your insights
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Quizzes Completed</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {stats.quizzesCompleted}
                  </p>
                  <p className="text-xs text-purple-700">
                    {completionRate.toFixed(0)}% of available
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Current Streak</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.streakDays} days
                  </p>
                  <p className="text-xs text-blue-700">
                    Keep it going!
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Insights Unlocked</p>
                  <p className="text-2xl font-bold text-green-900">
                    {stats.insightsUnlocked}
                  </p>
                  <p className="text-xs text-green-700">
                    Personal discoveries
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Articles Read</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {stats.articlesRead}
                  </p>
                  <p className="text-xs text-orange-700">
                    Knowledge gained
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Your Journey Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Overall Completion
                  </span>
                  <span className="text-sm text-gray-500">
                    {stats.quizzesCompleted}/{stats.totalQuizzes} quizzes
                  </span>
                </div>
                <Progress value={completionRate} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{daysSinceJoined}</div>
                  <div className="text-sm text-gray-600">Days on MyBeing</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(stats.quizzesCompleted / Math.max(daysSinceJoined, 1) * 7)}
                  </div>
                  <div className="text-sm text-gray-600">Avg per week</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {achievements.length}
                  </div>
                  <div className="text-sm text-gray-600">Achievements</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Quizzes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Discoveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                        <Badge variant="secondary">{quiz.category}</Badge>
                        {quiz.score && (
                          <Badge variant="outline">Score: {quiz.score}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Completed {new Date(quiz.completedAt).toLocaleDateString()}
                      </p>
                      {quiz.insights.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {quiz.insights.slice(0, 2).map((insight, i) => (
                            <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {insight}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {quiz.nextRecommended && (
                      <Link href={`/quizzes/${quiz.nextRecommended}`}>
                        <Button variant="outline" size="sm">
                          Next Quiz
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No quizzes completed yet</p>
                  <Link href="/quizzes">
                    <Button className="mt-4">
                      Take Your First Quiz
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Achievements Unlocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.rarity === 'legendary' ? 'border-yellow-400 bg-yellow-50' :
                      achievement.rarity === 'epic' ? 'border-purple-400 bg-purple-50' :
                      achievement.rarity === 'rare' ? 'border-blue-400 bg-blue-50' :
                      'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`text-2xl ${
                        achievement.rarity === 'legendary' ? 'animate-pulse' : ''
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        <Badge 
                          variant={achievement.rarity === 'common' ? 'secondary' : 'default'}
                          className={
                            achievement.rarity === 'legendary' ? 'bg-yellow-500 text-white' :
                            achievement.rarity === 'epic' ? 'bg-purple-500 text-white' :
                            achievement.rarity === 'rare' ? 'bg-blue-500 text-white' :
                            ''
                          }
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <p className="text-xs text-gray-500">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Continue Your Journey
            </h3>
            <p className="text-gray-600 mb-6">
              Ready to discover more about yourself? Here are your next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quizzes">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Brain className="w-4 h-4 mr-2" />
                  Take Another Quiz
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Articles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
