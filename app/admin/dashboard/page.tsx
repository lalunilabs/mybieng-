'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Brain, 
  BookOpen, 
  MessageSquare,
  TrendingUp,
  Settings,
  Download,
  Calendar,
  Target,
  Sparkles,
  Award,
  Clock,
  RefreshCw,
  Plus,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import ResearchAnalyticsDashboard from '@/components/admin/ResearchAnalyticsDashboard';
import { EnhancedAdminDashboard } from '@/components/admin/EnhancedAdminDashboard';
import { ContentCreator } from '@/components/admin/ContentCreator';

type DashboardView = 'overview' | 'analytics' | 'quizzes' | 'articles' | 'create-quiz' | 'create-article' | 'users' | 'settings';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock overview data
  const overviewStats = {
    totalUsers: 2847,
    activeUsers: 1234,
    totalQuizzes: 8,
    publishedQuizzes: 6,
    totalArticles: 23,
    publishedArticles: 18,
    totalResponses: 4567,
    aiChatSessions: 1892,
    avgEngagement: 73.4,
    revenueThisMonth: 2340
  };

  const recentActivity = [
    {
      type: 'quiz_completion',
      message: 'User completed "Cognitive Dissonance Assessment"',
      time: '2 minutes ago',
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      type: 'ai_chat',
      message: 'AI chat session started for quiz results',
      time: '5 minutes ago',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      type: 'article_view',
      message: 'Article "Understanding Cognitive Dissonance" viewed',
      time: '8 minutes ago',
      icon: BookOpen,
      color: 'text-green-600'
    },
    {
      type: 'user_signup',
      message: 'New user registered',
      time: '12 minutes ago',
      icon: Users,
      color: 'text-orange-600'
    },
    {
      type: 'quiz_completion',
      message: 'User completed "Motivation Language Discovery"',
      time: '15 minutes ago',
      icon: Brain,
      color: 'text-purple-600'
    }
  ];

  const topPerformingContent = [
    {
      title: 'Cognitive Dissonance Assessment',
      type: 'quiz',
      responses: 1247,
      engagement: 89.3,
      trend: '+12%'
    },
    {
      title: 'Understanding Cognitive Dissonance',
      type: 'article',
      views: 3247,
      engagement: 73.4,
      trend: '+8%'
    },
    {
      title: 'Motivation Language Discovery',
      type: 'quiz',
      responses: 892,
      engagement: 94.1,
      trend: '+15%'
    },
    {
      title: 'Five Motivation Languages Guide',
      type: 'article',
      views: 1892,
      engagement: 81.2,
      trend: '+23%'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Dashboard</h1>
          <p className="text-gray-600">Monitor your self-discovery platform and research insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                className="px-3 py-1"
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" className="rounded-lg">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
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
            <div className="text-2xl font-bold text-gray-900 mb-1">{overviewStats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-xs text-gray-500 mt-1">{overviewStats.activeUsers.toLocaleString()} active</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {overviewStats.publishedQuizzes}/{overviewStats.totalQuizzes} live
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{overviewStats.totalResponses.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Quiz Responses</div>
            <div className="text-xs text-gray-500 mt-1">Across {overviewStats.publishedQuizzes} quizzes</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {overviewStats.publishedArticles}/{overviewStats.totalArticles} published
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{overviewStats.totalArticles}</div>
            <div className="text-sm text-gray-600">Articles</div>
            <div className="text-xs text-gray-500 mt-1">{overviewStats.publishedArticles} published</div>
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
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {overviewStats.avgEngagement}% avg
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{overviewStats.aiChatSessions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">AI Chat Sessions</div>
            <div className="text-xs text-gray-500 mt-1">High engagement rate</div>
          </Card>
        </motion.div>
      </div>

      {/* Content Performance & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Performing Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                Top Performing Content
              </h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {topPerformingContent.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      item.type === 'quiz' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      {item.type === 'quiz' ? (
                        <Brain className={`w-4 h-4 ${item.type === 'quiz' ? 'text-purple-600' : 'text-green-600'}`} />
                      ) : (
                        <BookOpen className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500">
                        {item.type === 'quiz' ? `${item.responses} responses` : `${item.views} views`} • {item.engagement}% engagement
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {item.trend}
                  </Badge>
                </div>
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
                <Clock className="w-6 h-6 text-blue-600 mr-2" />
                Recent Activity
              </h3>
              <Button variant="ghost" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Research Platform Management</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Manage your self-discovery platform with comprehensive analytics, quiz management, and content creation tools.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => setCurrentView('quizzes')}
                className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-xl"
              >
                <Brain className="w-5 h-5 mr-2" />
                Manage Quizzes
              </Button>
              <Button 
                onClick={() => setCurrentView('articles')}
                className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-xl"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Manage Articles
              </Button>
              <Button 
                onClick={() => setCurrentView('analytics')}
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-6 py-3 rounded-xl"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Research Analytics', icon: Target },
    { id: 'quizzes', label: 'Quiz Management', icon: Brain },
    { id: 'create-quiz', label: 'Create Quiz', icon: Plus },
    { id: 'articles', label: 'Article Management', icon: BookOpen },
    { id: 'create-article', label: 'Write Article', icon: Edit },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-8 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">Admin Dashboard</span>
            </div>
            
            <nav className="flex space-x-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as DashboardView)}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  className="px-4 py-2 rounded-lg"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'overview' && renderOverview()}
        {currentView === 'analytics' && <ResearchAnalyticsDashboard />}
        {currentView === 'quizzes' && <EnhancedAdminDashboard />}
        {currentView === 'create-quiz' && <ContentCreator />}
        {currentView === 'articles' && <ContentCreator />}
        {currentView === 'create-article' && <ContentCreator />}
        {currentView === 'users' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600">User management features coming soon.</p>
          </div>
        )}
        {currentView === 'settings' && (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Settings</h3>
            <p className="text-gray-600">Settings and configuration options coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
