'use client';

import { useState, useEffect } from 'react';
import { StatsCard } from './StatsCard';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { useStaggeredAnimation } from '@/lib/animations';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Activity,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';

interface DashboardData {
  stats: {
    totalUsers: number;
    activeSubscriptions: number;
    totalQuizzes: number;
    aiConversations: number;
    monthlyRevenue: number;
    systemUptime: number;
  };
  changes: {
    users: number;
    subscriptions: number;
    quizzes: number;
    conversations: number;
    revenue: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'user_signup' | 'subscription' | 'quiz_completion' | 'ai_chat';
    description: string;
    timestamp: string;
    user?: string;
  }>;
  systemHealth: {
    cpu: number;
    memory: number;
    storage: number;
    responseTime: number;
  };
}

const mockData: DashboardData = {
  stats: {
    totalUsers: 2847,
    activeSubscriptions: 1203,
    totalQuizzes: 156,
    aiConversations: 8924,
    monthlyRevenue: 38496,
    systemUptime: 99.8
  },
  changes: {
    users: 12.5,
    subscriptions: 8.3,
    quizzes: -2.1,
    conversations: 23.7,
    revenue: 15.2
  },
  recentActivity: [
    {
      id: '1',
      type: 'user_signup',
      description: 'New user registered',
      timestamp: '2 minutes ago',
      user: 'sarah.johnson@email.com'
    },
    {
      id: '2',
      type: 'subscription',
      description: 'Premium subscription activated',
      timestamp: '5 minutes ago',
      user: 'mike.chen@email.com'
    },
    {
      id: '3',
      type: 'quiz_completion',
      description: 'Cognitive Dissonance Assessment completed',
      timestamp: '8 minutes ago',
      user: 'alex.rivera@email.com'
    },
    {
      id: '4',
      type: 'ai_chat',
      description: 'AI conversation started',
      timestamp: '12 minutes ago',
      user: 'emma.watson@email.com'
    }
  ],
  systemHealth: {
    cpu: 45,
    memory: 62,
    storage: 78,
    responseTime: 120
  }
};

export function EnhancedDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const statsRef = useStaggeredAnimation(100);
  const cardsRef = useStaggeredAnimation(150);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup': return <Users className="w-4 h-4 text-blue-600" />;
      case 'subscription': return <CreditCard className="w-4 h-4 text-green-600" />;
      case 'quiz_completion': return <FileText className="w-4 h-4 text-purple-600" />;
      case 'ai_chat': return <MessageSquare className="w-4 h-4 text-orange-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" variant="gradient" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with MyBeing.</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatedButton
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            loading={refreshing}
            icon={<RefreshCw className="w-4 h-4" />}
            animation="scale"
          >
            Refresh
          </AnimatedButton>
          <AnimatedButton
            variant="primary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            animation="scale"
          >
            Export Report
          </AnimatedButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div ref={statsRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatsCard
          title="Total Users"
          value={data.stats.totalUsers.toLocaleString()}
          change={{ value: data.changes.users, period: 'last month' }}
          icon={<Users className="w-6 h-6" />}
          variant="default"
          className="opacity-0"
        />
        <StatsCard
          title="Active Subscriptions"
          value={data.stats.activeSubscriptions.toLocaleString()}
          change={{ value: data.changes.subscriptions, period: 'last month' }}
          icon={<CreditCard className="w-6 h-6" />}
          variant="success"
          className="opacity-0"
        />
        <StatsCard
          title="Total Quizzes"
          value={data.stats.totalQuizzes}
          change={{ value: data.changes.quizzes, period: 'last month' }}
          icon={<FileText className="w-6 h-6" />}
          variant="default"
          className="opacity-0"
        />
        <StatsCard
          title="AI Conversations"
          value={data.stats.aiConversations.toLocaleString()}
          change={{ value: data.changes.conversations, period: 'last month' }}
          icon={<MessageSquare className="w-6 h-6" />}
          variant="warning"
          className="opacity-0"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${data.stats.monthlyRevenue.toLocaleString()}`}
          change={{ value: data.changes.revenue, period: 'last month' }}
          icon={<TrendingUp className="w-6 h-6" />}
          variant="gradient"
          className="opacity-0"
        />
        <StatsCard
          title="System Uptime"
          value={`${data.stats.systemUptime}%`}
          icon={<CheckCircle className="w-6 h-6" />}
          variant="success"
          className="opacity-0"
        />
      </div>

      {/* Main Content Grid */}
      <div ref={cardsRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* System Health */}
        <InteractiveCard
          title="System Health"
          description="Real-time system performance metrics"
          variant="glass"
          hover="lift"
          className="opacity-0"
          badge={{ text: 'Live', color: 'success' }}
          actions={
            <AnimatedButton variant="ghost" size="xs" animation="scale">
              <Eye className="w-4 h-4" />
            </AnimatedButton>
          }
        >
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>CPU Usage</span>
                <span className="font-medium">{data.systemHealth.cpu}%</span>
              </div>
              <ProgressBar 
                value={data.systemHealth.cpu} 
                color={data.systemHealth.cpu > 80 ? 'error' : data.systemHealth.cpu > 60 ? 'warning' : 'success'}
                size="sm"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Memory Usage</span>
                <span className="font-medium">{data.systemHealth.memory}%</span>
              </div>
              <ProgressBar 
                value={data.systemHealth.memory} 
                color={data.systemHealth.memory > 80 ? 'error' : data.systemHealth.memory > 60 ? 'warning' : 'success'}
                size="sm"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Storage Usage</span>
                <span className="font-medium">{data.systemHealth.storage}%</span>
              </div>
              <ProgressBar 
                value={data.systemHealth.storage} 
                color={data.systemHealth.storage > 80 ? 'error' : data.systemHealth.storage > 60 ? 'warning' : 'success'}
                size="sm"
              />
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-medium">{data.systemHealth.responseTime}ms</span>
              </div>
            </div>
          </div>
        </InteractiveCard>

        {/* Recent Activity */}
        <InteractiveCard
          title="Recent Activity"
          description="Latest platform activity and user actions"
          variant="default"
          hover="lift"
          expandable
          defaultExpanded
          className="opacity-0"
          badge={{ text: `${data.recentActivity.length} items`, color: 'brand' }}
        >
          <div className="space-y-3">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  {activity.user && (
                    <p className="text-xs text-gray-600 truncate">{activity.user}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </InteractiveCard>

        {/* Quick Actions */}
        <InteractiveCard
          title="Quick Actions"
          description="Common administrative tasks"
          variant="elevated"
          hover="scale"
          className="opacity-0"
        >
          <div className="grid grid-cols-2 gap-3">
            <AnimatedButton
              variant="outline"
              size="sm"
              className="h-20 flex-col"
              animation="bounce"
            >
              <Users className="w-5 h-5 mb-1" />
              <span className="text-xs">Manage Users</span>
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              size="sm"
              className="h-20 flex-col"
              animation="bounce"
            >
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-xs">Create Quiz</span>
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              size="sm"
              className="h-20 flex-col"
              animation="bounce"
            >
              <MessageSquare className="w-5 h-5 mb-1" />
              <span className="text-xs">AI Settings</span>
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              size="sm"
              className="h-20 flex-col"
              animation="bounce"
            >
              <Download className="w-5 h-5 mb-1" />
              <span className="text-xs">Export Data</span>
            </AnimatedButton>
          </div>
        </InteractiveCard>
      </div>

      {/* Alerts Section */}
      <InteractiveCard
        title="System Alerts"
        description="Important notifications and warnings"
        variant="default"
        hover="glow"
        expandable
        className="opacity-0"
        badge={{ text: '2 active', color: 'warning' }}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-800">High Memory Usage</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Memory usage is at {data.systemHealth.memory}%. Consider optimizing or scaling resources.
              </p>
            </div>
            <AnimatedButton variant="ghost" size="xs" className="text-yellow-600">
              Resolve
            </AnimatedButton>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-800">Scheduled Maintenance</h4>
              <p className="text-sm text-blue-700 mt-1">
                System maintenance scheduled for tonight at 2:00 AM UTC. Expected downtime: 30 minutes.
              </p>
            </div>
            <AnimatedButton variant="ghost" size="xs" className="text-blue-600">
              Details
            </AnimatedButton>
          </div>
        </div>
      </InteractiveCard>
    </div>
  );
}
