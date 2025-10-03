'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Brain, 
  Award, 
  BarChart3,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Users,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';

interface QuizAttempt {
  id: string;
  quizSlug: string;
  quizTitle: string;
  completedAt: Date;
  score: number;
  band: string;
  keyInsights: string[];
  improvementAreas: string[];
}

interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  achievedAt?: Date;
  progress: number;
  type: 'quiz_completion' | 'streak' | 'insight' | 'growth';
  icon: string;
}

interface ProgressTrackingDashboardProps {
  userId?: string;
  timeRange?: '7d' | '30d' | '90d' | 'all';
}

export function ProgressTrackingDashboard({ userId, timeRange = '30d' }: ProgressTrackingDashboardProps) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [milestones, setMilestones] = useState<ProgressMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  // Mock data for demo - in real app, fetch from API
  useEffect(() => {
    const mockAttempts: QuizAttempt[] = [
      {
        id: '1',
        quizSlug: 'cognitive-dissonance',
        quizTitle: 'Cognitive Dissonance Assessment',
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        score: 72,
        band: 'Moderate Dissonance',
        keyInsights: ['Values-behavior alignment', 'Decision-making patterns'],
        improvementAreas: ['Consistency in actions', 'Values clarification']
      },
      {
        id: '2',
        quizSlug: 'motivation-language',
        quizTitle: 'Motivation Language Discovery',
        completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        score: 85,
        band: 'THE ARCHITECT (Progress-Driven)',
        keyInsights: ['Progress-driven motivation', 'Systematic approach'],
        improvementAreas: ['Flexibility in methods', 'Celebrating small wins']
      },
      {
        id: '3',
        quizSlug: 'stress-patterns',
        quizTitle: 'Stress Response Patterns',
        completedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        score: 68,
        band: 'Moderate Stress',
        keyInsights: ['Work-life balance', 'Coping mechanisms'],
        improvementAreas: ['Stress management', 'Recovery practices']
      }
    ];

    const mockMilestones: ProgressMilestone[] = [
      {
        id: '1',
        title: 'First Assessment Complete',
        description: 'Completed your first self-assessment',
        achievedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        progress: 100,
        type: 'quiz_completion',
        icon: '🎯'
      },
      {
        id: '2',
        title: 'Pattern Explorer',
        description: 'Completed 3 different assessment types',
        achievedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        progress: 100,
        type: 'insight',
        icon: '🧠'
      },
      {
        id: '3',
        title: 'Consistency Builder',
        description: 'Take assessments for 7 consecutive weeks',
        progress: 43,
        type: 'streak',
        icon: '🔥'
      },
      {
        id: '4',
        title: 'Growth Tracker',
        description: 'Show improvement in 2+ areas over time',
        progress: 67,
        type: 'growth',
        icon: '📈'
      },
      {
        id: '5',
        title: 'Self-Awareness Master',
        description: 'Complete all core assessment categories',
        progress: 60,
        type: 'quiz_completion',
        icon: '🌟'
      }
    ];

    setAttempts(mockAttempts);
    setMilestones(mockMilestones);
    setLoading(false);
  }, [selectedTimeRange]);

  const calculateGrowthTrend = () => {
    if (attempts.length < 2) return null;
    
    const sortedAttempts = [...attempts].sort((a, b) => 
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
    
    const firstScore = sortedAttempts[0].score;
    const lastScore = sortedAttempts[sortedAttempts.length - 1].score;
    const change = lastScore - firstScore;
    const percentChange = (change / firstScore) * 100;
    
    return {
      change,
      percentChange,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  };

  const getStreakCount = () => {
    // Calculate current assessment streak
    const now = new Date();
    let streak = 0;
    const sortedAttempts = [...attempts].sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    
    for (let i = 0; i < sortedAttempts.length; i++) {
      const daysDiff = Math.floor((now.getTime() - new Date(sortedAttempts[i].completedAt).getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 7 * (i + 1)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const growthTrend = calculateGrowthTrend();
  const currentStreak = getStreakCount();
  const completedMilestones = milestones.filter(m => m.progress === 100).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Progress Journey</h2>
          <p className="text-gray-600">Track your self-discovery patterns and growth over time</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <Button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              variant={selectedTimeRange === range ? 'default' : 'outline'}
              size="sm"
              className="rounded-lg"
            >
              {range === 'all' ? 'All Time' : range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                +{attempts.length} this month
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{attempts.length}</div>
            <div className="text-sm text-gray-600">Assessments Completed</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              {growthTrend && (
                <Badge 
                  variant="secondary" 
                  className={`${
                    growthTrend.trend === 'up' ? 'bg-green-100 text-green-700' : 
                    growthTrend.trend === 'down' ? 'bg-red-100 text-red-700' : 
                    'bg-gray-100 text-gray-700'
                  }`}
                >
                  {growthTrend.trend === 'up' ? '+' : ''}{growthTrend.percentChange.toFixed(1)}%
                </Badge>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {attempts.length > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) : 0}
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                🔥 {currentStreak} week{currentStreak !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{currentStreak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {completedMilestones}/{milestones.length}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{completedMilestones}</div>
            <div className="text-sm text-gray-600">Milestones Achieved</div>
          </Card>
        </motion.div>
      </div>

      {/* Progress Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <Target className="w-6 h-6 text-purple-600 mr-2" />
              Progress Milestones
            </h3>
            <Badge variant="secondary">
              {completedMilestones}/{milestones.length} Complete
            </Badge>
          </div>

          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  milestone.progress === 100 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      milestone.progress === 100 ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {milestone.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {milestone.achievedAt && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Clock className="w-3 h-3 mr-1" />
                      {milestone.achievedAt.toLocaleDateString()}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Progress 
                    value={milestone.progress} 
                    className="flex-1 mr-4"
                    variant={milestone.progress === 100 ? 'gradient' : 'default'}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {milestone.progress}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
              Recent Assessments
            </h3>
            <Button variant="outline" size="sm" className="rounded-lg">
              <BookOpen className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {attempts.slice(0, 3).map((attempt, index) => (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{attempt.quizTitle}</h4>
                    <p className="text-sm text-gray-600">
                      {attempt.completedAt.toLocaleDateString()} • Score: {attempt.score}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-purple-100 text-purple-700"
                  >
                    {attempt.band}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h5>
                    <div className="space-y-1">
                      {attempt.keyInsights.map((insight, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Sparkles className="w-3 h-3 text-purple-500" />
                          <span className="text-xs text-gray-600">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Growth Areas</h5>
                    <div className="space-y-1">
                      {attempt.improvementAreas.map((area, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-600">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Continue Your Growth Journey</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Regular self-assessment helps you track patterns, identify growth areas, and build self-awareness over time.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-xl">
                <Brain className="w-5 h-5 mr-2" />
                Take Next Assessment
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3 rounded-xl">
                <Users className="w-5 h-5 mr-2" />
                Compare with Others
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
