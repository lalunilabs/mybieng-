'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Brain, 
  TrendingUp, 
  Download,
  Filter,
  Calendar,
  MessageSquare,
  Target,
  Sparkles,
  Eye,
  RefreshCw,
  FileText,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';

interface QuizAnalytics {
  quizSlug: string;
  quizTitle: string;
  totalResponses: number;
  completionRate: number;
  averageScore: number;
  responsePatterns: Record<string, number>;
  commonInsights: string[];
  improvementAreas: string[];
  aiChatEngagement: number;
  contentRecommendationClicks: number;
}

interface UserPattern {
  pattern: string;
  frequency: number;
  associatedQuizzes: string[];
  demographicTrends: Record<string, number>;
  improvementCorrelations: string[];
}

interface ResearchInsight {
  id: string;
  title: string;
  description: string;
  dataPoints: number;
  significance: 'high' | 'medium' | 'low';
  category: 'behavioral' | 'cognitive' | 'motivational' | 'stress';
  createdAt: Date;
}

export default function ResearchAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedQuiz, setSelectedQuiz] = useState<string>('all');
  const [analytics, setAnalytics] = useState<QuizAnalytics[]>([]);
  const [patterns, setPatterns] = useState<UserPattern[]>([]);
  const [insights, setInsights] = useState<ResearchInsight[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockAnalytics: QuizAnalytics[] = [
      {
        quizSlug: 'cognitive-dissonance',
        quizTitle: 'Cognitive Dissonance Assessment',
        totalResponses: 1247,
        completionRate: 89.3,
        averageScore: 72.4,
        responsePatterns: {
          'High values-behavior alignment': 34,
          'Moderate dissonance in work': 28,
          'Strong identity protection': 22,
          'Flexible value system': 16
        },
        commonInsights: [
          'Work-life value conflicts most common',
          'Identity protection increases with age',
          'Higher education correlates with awareness'
        ],
        improvementAreas: [
          'Values clarification exercises',
          'Behavioral consistency tracking',
          'Decision-making frameworks'
        ],
        aiChatEngagement: 73.2,
        contentRecommendationClicks: 45.8
      },
      {
        quizSlug: 'motivation-language',
        quizTitle: 'Motivation Language Discovery',
        totalResponses: 892,
        completionRate: 94.1,
        averageScore: 0, // Categorical, no numeric score
        responsePatterns: {
          'THE ARCHITECT (Progress-Driven)': 28,
          'THE ACHIEVER (Rewards-Driven)': 24,
          'THE ENCOURAGER (Affirmation-Driven)': 22,
          'THE CONNECTOR (Accountability-Driven)': 15,
          'THE VISIONARY (Inspiration-Driven)': 11
        },
        commonInsights: [
          'Progress-driven most common in tech workers',
          'Achiever profile peaks in sales roles',
          'Encourager pattern higher in helping professions'
        ],
        improvementAreas: [
          'Cross-motivation flexibility',
          'Environmental design',
          'Team motivation matching'
        ],
        aiChatEngagement: 81.7,
        contentRecommendationClicks: 62.3
      },
      {
        quizSlug: 'stress-patterns',
        quizTitle: 'Stress Response Patterns',
        totalResponses: 634,
        completionRate: 87.6,
        averageScore: 68.9,
        responsePatterns: {
          'Work-related stress dominant': 42,
          'Relationship stress patterns': 31,
          'Financial anxiety markers': 18,
          'Health-related concerns': 9
        },
        commonInsights: [
          'Remote work changed stress patterns',
          'Younger users show higher social stress',
          'Recovery practices vary by stress type'
        ],
        improvementAreas: [
          'Stress management techniques',
          'Recovery protocol development',
          'Environmental stress reduction'
        ],
        aiChatEngagement: 69.4,
        contentRecommendationClicks: 41.2
      }
    ];

    const mockPatterns: UserPattern[] = [
      {
        pattern: 'High Self-Awareness + Low Action',
        frequency: 23.4,
        associatedQuizzes: ['cognitive-dissonance', 'motivation-language'],
        demographicTrends: { '25-34': 45, '35-44': 32, '45-54': 23 },
        improvementCorrelations: ['Implementation strategies', 'Accountability systems']
      },
      {
        pattern: 'Stress-Motivation Correlation',
        frequency: 18.7,
        associatedQuizzes: ['stress-patterns', 'motivation-language'],
        demographicTrends: { 'High-stress jobs': 67, 'Remote workers': 43 },
        improvementCorrelations: ['Stress-aware goal setting', 'Recovery-based motivation']
      },
      {
        pattern: 'Values-Behavior Gap',
        frequency: 31.2,
        associatedQuizzes: ['cognitive-dissonance'],
        demographicTrends: { 'Career transitions': 58, 'New parents': 41 },
        improvementCorrelations: ['Values clarification', 'Behavioral experiments']
      }
    ];

    const mockInsights: ResearchInsight[] = [
      {
        id: '1',
        title: 'AI Chat Increases Result Retention by 73%',
        description: 'Users who engage with AI chat about their results show significantly higher retention of insights and implementation of recommendations.',
        dataPoints: 2847,
        significance: 'high',
        category: 'behavioral',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: 'Progress-Driven Users Prefer Numeric Feedback',
        description: 'Architect-type motivation profiles engage 2.3x more with numeric progress indicators than categorical results.',
        dataPoints: 1892,
        significance: 'high',
        category: 'motivational',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        title: 'Content Recommendations Drive 45% More Reading',
        description: 'Personalized article suggestions based on quiz results increase content engagement significantly.',
        dataPoints: 1634,
        significance: 'medium',
        category: 'cognitive',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    setAnalytics(mockAnalytics);
    setPatterns(mockPatterns);
    setInsights(mockInsights);
    setLoading(false);
  }, [timeRange, selectedQuiz]);

  const totalResponses = analytics.reduce((sum, quiz) => sum + quiz.totalResponses, 0);
  const averageCompletion = analytics.reduce((sum, quiz) => sum + quiz.completionRate, 0) / analytics.length;
  const averageAIEngagement = analytics.reduce((sum, quiz) => sum + quiz.aiChatEngagement, 0) / analytics.length;

  const exportData = async (type: 'responses' | 'patterns' | 'insights') => {
    // In real implementation, this would generate and download CSV/JSON
    const data = type === 'responses' ? analytics : type === 'patterns' ? patterns : insights;
    console.log(`Exporting ${type}:`, data);
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully!`);
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Analytics Dashboard</h1>
          <p className="text-gray-600">Analyze user response patterns and research insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="all">All Quizzes</option>
            {analytics.map(quiz => (
              <option key={quiz.quizSlug} value={quiz.quizSlug}>{quiz.quizTitle}</option>
            ))}
          </select>
          
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                className="px-3 py-1"
              >
                {range === 'all' ? 'All' : range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                +12% this month
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{totalResponses.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Responses</div>
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
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                +5.2% avg
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{averageCompletion.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                +28% with AI
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{averageAIEngagement.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">AI Chat Engagement</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {patterns.length} active
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{insights.length}</div>
            <div className="text-sm text-gray-600">Research Insights</div>
          </Card>
        </motion.div>
      </div>

      {/* Quiz Performance Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
              Quiz Performance Analysis
            </h3>
            <Button
              onClick={() => exportData('responses')}
              variant="outline"
              size="sm"
              className="rounded-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="space-y-6">
            {analytics.map((quiz, index) => (
              <motion.div
                key={quiz.quizSlug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 border border-gray-200 rounded-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{quiz.quizTitle}</h4>
                    <p className="text-sm text-gray-600">
                      {quiz.totalResponses.toLocaleString()} responses • {quiz.completionRate}% completion
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700">AI Chat</div>
                      <div className="text-lg font-bold text-purple-600">{quiz.aiChatEngagement}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700">Content Clicks</div>
                      <div className="text-lg font-bold text-green-600">{quiz.contentRecommendationClicks}%</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-3">Response Patterns</h5>
                    <div className="space-y-2">
                      {Object.entries(quiz.responsePatterns).map(([pattern, percentage]) => (
                        <div key={pattern} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{pattern}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={percentage} className="w-20 h-2" />
                            <span className="text-xs font-medium text-gray-700 w-8">{percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-3">Common Insights</h5>
                    <div className="space-y-2">
                      {quiz.commonInsights.map((insight, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{insight}</span>
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

      {/* User Patterns Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <Target className="w-6 h-6 text-green-600 mr-2" />
              Cross-Quiz Pattern Analysis
            </h3>
            <Button
              onClick={() => exportData('patterns')}
              variant="outline"
              size="sm"
              className="rounded-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Patterns
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patterns.map((pattern, index) => (
              <motion.div
                key={pattern.pattern}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 border border-gray-200 rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm">{pattern.pattern}</h4>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {pattern.frequency}%
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-1">Associated Quizzes</h5>
                    <div className="flex flex-wrap gap-1">
                      {pattern.associatedQuizzes.map(quiz => (
                        <Badge key={quiz} variant="outline" className="text-xs">
                          {quiz.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-1">Improvement Areas</h5>
                    <div className="space-y-1">
                      {pattern.improvementCorrelations.slice(0, 2).map((area, i) => (
                        <div key={i} className="text-xs text-gray-500">• {area}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Research Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <FileText className="w-6 h-6 text-purple-600 mr-2" />
              Latest Research Insights
            </h3>
            <Button
              onClick={() => exportData('insights')}
              variant="outline"
              size="sm"
              className="rounded-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Insights
            </Button>
          </div>

          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`${
                          insight.significance === 'high' ? 'bg-red-100 text-red-700' :
                          insight.significance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {insight.significance} significance
                      </Badge>
                      <Badge variant="outline">
                        {insight.category}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{insight.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{insight.dataPoints.toLocaleString()} data points</span>
                      <span>{insight.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Export & Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Research Data Management</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Export anonymized data for research purposes or configure analytics settings.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-xl">
                <Download className="w-5 h-5 mr-2" />
                Export All Data
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3 rounded-xl">
                <Settings className="w-5 h-5 mr-2" />
                Analytics Settings
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
