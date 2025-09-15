'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminDashboardData, AdminAlert } from '@/types/admin';
import { DiscountManager } from './DiscountManager';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
}

function StatCard({ title, value, change, icon: Icon, trend = 'neutral' }: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change !== undefined && (
              <p className={`text-xs ${getTrendColor()} flex items-center mt-1`}>
                <TrendIcon className="w-3 h-3 mr-1" />
                {change > 0 ? '+' : ''}{change}%
              </p>
            )}
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Icon className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AlertCardProps {
  alerts: AdminAlert[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

function AlertCard({ alerts, onMarkAsRead, onMarkAllAsRead }: AlertCardProps) {
  const unreadAlerts = alerts.filter(alert => !alert.read);
  
  const getAlertIcon = (type: AdminAlert['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
        {unreadAlerts.length > 0 && (
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
            Mark All Read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-sm text-gray-500">No alerts</p>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border ${
                  alert.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                }`}
              >
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${alert.read ? 'text-gray-600' : 'text-gray-900'}`}>
                    {alert.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
                {!alert.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(alert.id)}
                    className="text-xs"
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            ))}
            {alerts.length > 5 && (
              <Button variant="outline" className="w-full">
                View All Alerts ({alerts.length})
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData: AdminDashboardData = {
      userAnalytics: {
        totalUsers: 1247,
        activeUsers: 892,
        newUsersToday: 23,
        newUsersThisWeek: 156,
        newUsersThisMonth: 634,
        subscribedUsers: 89,
        subscriptionRevenue: 2848,
        averageEngagementTime: 18.5,
        userRetentionRate: 76.3
      },
      contentAnalytics: {
        totalQuizzes: 12,
        totalBlogs: 4,
        quizCompletions: 3421,
        blogViews: 8934,
        averageQuizScore: 72.4,
        mostPopularQuiz: 'Cognitive Dissonance Assessment',
        mostPopularBlog: 'Understanding Cognitive Dissonance',
        contentEngagementRate: 68.2
      },
      aiAnalytics: {
        totalConversations: 2156,
        averageConversationLength: 8.3,
        userSatisfactionRating: 4.6,
        commonQuestions: [
          'What does my quiz result mean?',
          'How can I improve this pattern?',
          'What should I read next?'
        ],
        feedbackCount: 234,
        averageFeedbackRating: 4.4,
        responseTime: 1.2,
        errorRate: 0.8
      },
      systemHealth: {
        uptime: 99.97,
        responseTime: 245,
        errorRate: 0.12,
        memoryUsage: 68.4,
        cpuUsage: 23.7,
        databaseConnections: 45,
        apiRequestsPerMinute: 127,
        lastBackup: new Date('2025-09-04T06:00:00Z')
      },
      recentUsers: [],
      recentContent: [],
      alerts: [
        {
          id: '1',
          type: 'warning',
          title: 'High API Usage',
          message: 'API requests have increased by 45% in the last hour',
          timestamp: new Date('2025-09-04T11:30:00+05:30'),
          read: false,
          actionRequired: true
        },
        {
          id: '2',
          type: 'success',
          title: 'Backup Completed',
          message: 'Daily backup completed successfully',
          timestamp: new Date('2025-09-04T06:00:00+05:30'),
          read: false,
          actionRequired: false
        },
        {
          id: '3',
          type: 'info',
          title: 'New Subscriber',
          message: '5 new premium subscriptions today',
          timestamp: new Date('2025-09-04T10:15:00+05:30'),
          read: true,
          actionRequired: false
        }
      ]
    };

    setTimeout(() => {
      setDashboardData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMarkAlertAsRead = (id: string) => {
    if (!dashboardData) return;
    
    setDashboardData({
      ...dashboardData,
      alerts: dashboardData.alerts.map(alert =>
        alert.id === id ? { ...alert, read: true } : alert
      )
    });
  };

  const handleMarkAllAlertsAsRead = () => {
    if (!dashboardData) return;
    
    setDashboardData({
      ...dashboardData,
      alerts: dashboardData.alerts.map(alert => ({ ...alert, read: true }))
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={dashboardData.userAnalytics.totalUsers.toLocaleString()}
          change={12.5}
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Active Subscribers"
          value={dashboardData.userAnalytics.subscribedUsers}
          change={8.2}
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="AI Conversations"
          value={dashboardData.aiAnalytics.totalConversations.toLocaleString()}
          change={15.3}
          icon={MessageSquare}
          trend="up"
        />
        <StatCard
          title="Content Views"
          value={dashboardData.contentAnalytics.blogViews.toLocaleString()}
          change={-2.1}
          icon={FileText}
          trend="down"
        />
      </div>

      {/* Revenue and Engagement */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${dashboardData.userAnalytics.subscriptionRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              From {dashboardData.userAnalytics.subscribedUsers} subscribers
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Target: $5,000</span>
                <span>{Math.round((dashboardData.userAnalytics.subscriptionRevenue / 5000) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${Math.min((dashboardData.userAnalytics.subscriptionRevenue / 5000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Session Time</span>
                <span className="text-sm font-medium">{dashboardData.userAnalytics.averageEngagementTime} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Retention Rate</span>
                <span className="text-sm font-medium">{dashboardData.userAnalytics.userRetentionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">AI Satisfaction</span>
                <span className="text-sm font-medium">{dashboardData.aiAnalytics.userSatisfactionRating}/5.0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium text-green-600">{dashboardData.systemHealth.uptime}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-medium">{dashboardData.systemHealth.responseTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="text-sm font-medium text-green-600">{dashboardData.systemHealth.errorRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AlertCard
          alerts={dashboardData.alerts}
          onMarkAsRead={handleMarkAlertAsRead}
          onMarkAllAsRead={handleMarkAllAlertsAsRead}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start">
                <Users className="w-4 h-4 mr-2" />
                View Users
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Add Content
              </Button>
              <Button variant="outline" className="justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Chat Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discount Manager */}
      <DiscountManager
        onCreateDiscount={(discount) => console.log('Create discount:', discount)}
        onUpdateDiscount={(id, updates) => console.log('Update discount:', id, updates)}
      />
    </div>
  );
}
