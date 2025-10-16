'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  Brain, 
  Mail, 
  TrendingUp, 
  Clock, 
  Target,
  BarChart3,
  Download,
  Filter,
  Search,
  Calendar,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/shadcn/input';
import { Progress } from '@/components/ui/Progress';

interface DashboardStats {
  totalUsers: number;
  activeSubscribers: number;
  totalQuizzes: number;
  totalArticles: number;
  quizCompletions: number;
  articleViews: number;
  avgEngagementTime: number;
  conversionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'quiz_completion' | 'article_view' | 'newsletter_signup' | 'user_registration';
  title: string;
  user?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export function EnhancedAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1247,
    activeSubscribers: 892,
    totalQuizzes: 12,
    totalArticles: 28,
    quizCompletions: 3456,
    articleViews: 15678,
    avgEngagementTime: 8.5,
    conversionRate: 12.4
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'quiz_completion',
      title: 'Cognitive Dissonance Assessment',
      user: 'user_123',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      metadata: { score: 78, timeSpent: 420 }
    },
    {
      id: '2',
      type: 'newsletter_signup',
      title: 'Newsletter Subscription',
      user: 'user_456',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      type: 'article_view',
      title: 'Understanding Behavioral Patterns',
      user: 'user_789',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      metadata: { readTime: 340, engagement: 85 }
    }
  ]);

  const [timeRange, setTimeRange] = useState('7d');

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'quiz_completion': return <Brain className="w-4 h-4 text-purple-600" />;
      case 'article_view': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'newsletter_signup': return <Mail className="w-4 h-4 text-green-600" />;
      case 'user_registration': return <Users className="w-4 h-4 text-orange-600" />;
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'quiz_completion': return 'bg-purple-50 border-purple-200';
      case 'article_view': return 'bg-blue-50 border-blue-200';
      case 'newsletter_signup': return 'bg-green-50 border-green-200';
      case 'user_registration': return 'bg-orange-50 border-orange-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Research Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor user engagement and behavioral patterns</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
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
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quiz Completions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.quizCompletions.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-600" />
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
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Newsletter Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeSubscribers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-600" />
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
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgEngagementTime}m</p>
                  <p className="text-xs text-green-600 mt-1">+3% from last month</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Content Performance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Content Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Quiz Completion Rate</span>
                  <span className="text-sm text-gray-500">78%</span>
                </div>
                <Progress value={78} variant="gradient" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Article Engagement</span>
                  <span className="text-sm text-gray-500">65%</span>
                </div>
                <Progress value={65} variant="gradient" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Newsletter Open Rate</span>
                  <span className="text-sm text-gray-500">42%</span>
                </div>
                <Progress value={42} variant="gradient" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">User Retention (30d)</span>
                  <span className="text-sm text-gray-500">56%</span>
                </div>
                <Progress value={56} variant="gradient" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    {activity.user && (
                      <p className="text-xs text-gray-500">by {activity.user}</p>
                    )}
                    {activity.metadata && (
                      <div className="text-xs text-gray-600 mt-1">
                        {activity.type === 'quiz_completion' && (
                          <span>Score: {activity.metadata.score}% • Time: {Math.floor(activity.metadata.timeSpent / 60)}m</span>
                        )}
                        {activity.type === 'article_view' && (
                          <span>Read time: {Math.floor(activity.metadata.readTime / 60)}m • Engagement: {activity.metadata.engagement}%</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full text-sm">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Research Insights */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Research Insights & Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Most Common Pattern</h4>
              <p className="text-2xl font-bold text-blue-600 mb-1">Analytical Thinker</p>
              <p className="text-sm text-blue-700">42% of users exhibit this primary pattern</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Highest Engagement</h4>
              <p className="text-2xl font-bold text-green-600 mb-1">Self-Reflection</p>
              <p className="text-sm text-green-700">Articles on introspection get 78% more engagement</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Growth Opportunity</h4>
              <p className="text-2xl font-bold text-purple-600 mb-1">Emotional Intelligence</p>
              <p className="text-sm text-purple-700">Users request more EQ-focused content</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Research Notes</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Based on anonymized user data, we're seeing strong patterns in self-discovery preferences. 
              Users who complete multiple assessments show 34% higher engagement with follow-up content. 
              The integration of behavioral psychology principles with practical applications resonates 
              particularly well with the 25-45 age demographic.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
