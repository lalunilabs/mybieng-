'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Star,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart3,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ConversationLog {
  id: string;
  userId: string;
  userName: string;
  mode: 'quiz-results' | 'subscription' | 'general';
  messageCount: number;
  duration: number;
  satisfaction?: number;
  feedback?: string;
  timestamp: Date;
  status: 'completed' | 'ongoing' | 'error';
}

interface AIMetrics {
  totalConversations: number;
  averageLength: number;
  satisfactionScore: number;
  responseTime: number;
  errorRate: number;
  topQuestions: Array<{ question: string; count: number }>;
  modeDistribution: Record<string, number>;
  hourlyActivity: Array<{ hour: number; count: number }>;
}

function MetricsCard({ title, value, subtitle, icon: Icon, trend }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className={`text-xs mt-1 ${getTrendColor()}`}>
                {subtitle}
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

function ConversationTable({ conversations }: { conversations: ConversationLog[] }) {
  const [filter, setFilter] = useState<'all' | 'quiz-results' | 'subscription' | 'general'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'ongoing' | 'error'>('all');

  const filteredConversations = conversations.filter(conv => {
    const matchesMode = filter === 'all' || conv.mode === filter;
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    return matchesMode && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      ongoing: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || styles.completed;
  };

  const getModeBadge = (mode: string) => {
    const styles = {
      'quiz-results': 'bg-purple-100 text-purple-800',
      'subscription': 'bg-yellow-100 text-yellow-800',
      'general': 'bg-gray-100 text-gray-800'
    };
    return styles[mode as keyof typeof styles] || styles.general;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle>Recent AI Conversations</CardTitle>
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Modes</option>
              <option value="quiz-results">Quiz Results</option>
              <option value="subscription">Subscription</option>
              <option value="general">General</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
              <option value="error">Error</option>
            </select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Mode</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Messages</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Satisfaction</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversations.map((conv) => (
                <tr key={conv.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{conv.userName}</div>
                    <div className="text-sm text-gray-500">{conv.userId.slice(0, 8)}...</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getModeBadge(conv.mode)}`}>
                      {conv.mode.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{conv.messageCount} messages</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{Math.round(conv.duration)}m</div>
                  </td>
                  <td className="py-4 px-4">
                    {conv.satisfaction ? (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-900">{conv.satisfaction}/5</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No rating</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(conv.status)}`}>
                      {conv.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">
                      {conv.timestamp.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function AIMonitoring() {
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [conversations, setConversations] = useState<ConversationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockMetrics: AIMetrics = {
      totalConversations: 2156,
      averageLength: 8.3,
      satisfactionScore: 4.6,
      responseTime: 1.2,
      errorRate: 0.8,
      topQuestions: [
        { question: "What does my quiz result mean?", count: 342 },
        { question: "How can I improve this pattern?", count: 298 },
        { question: "What should I read next?", count: 267 },
        { question: "Can you recommend related quizzes?", count: 234 },
        { question: "What's my subscription status?", count: 189 }
      ],
      modeDistribution: {
        'quiz-results': 45,
        'subscription': 25,
        'general': 30
      },
      hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: Math.floor(Math.random() * 100) + 20
      }))
    };

    const mockConversations: ConversationLog[] = [
      {
        id: '1',
        userId: 'user_123456',
        userName: 'Sarah Johnson',
        mode: 'quiz-results',
        messageCount: 12,
        duration: 15.5,
        satisfaction: 5,
        feedback: 'Very helpful insights!',
        timestamp: new Date('2025-09-04T11:30:00+05:30'),
        status: 'completed'
      },
      {
        id: '2',
        userId: 'user_789012',
        userName: 'Mike Chen',
        mode: 'subscription',
        messageCount: 6,
        duration: 8.2,
        satisfaction: 4,
        timestamp: new Date('2025-09-04T11:15:00+05:30'),
        status: 'completed'
      },
      {
        id: '3',
        userId: 'user_345678',
        userName: 'Emma Davis',
        mode: 'general',
        messageCount: 3,
        duration: 4.1,
        timestamp: new Date('2025-09-04T11:00:00+05:30'),
        status: 'ongoing'
      },
      {
        id: '4',
        userId: 'user_901234',
        userName: 'Alex Wilson',
        mode: 'quiz-results',
        messageCount: 8,
        duration: 12.3,
        satisfaction: 3,
        feedback: 'Could be more specific',
        timestamp: new Date('2025-09-04T10:45:00+05:30'),
        status: 'completed'
      },
      {
        id: '5',
        userId: 'user_567890',
        userName: 'Lisa Brown',
        mode: 'subscription',
        messageCount: 2,
        duration: 1.5,
        timestamp: new Date('2025-09-04T10:30:00+05:30'),
        status: 'error'
      }
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setConversations(mockConversations);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Conversations"
          value={metrics.totalConversations.toLocaleString()}
          subtitle="+15.3% this week"
          icon={MessageSquare}
          trend="up"
        />
        <MetricsCard
          title="Avg Response Time"
          value={`${metrics.responseTime}s`}
          subtitle="-0.2s improvement"
          icon={Clock}
          trend="up"
        />
        <MetricsCard
          title="Satisfaction Score"
          value={`${metrics.satisfactionScore}/5`}
          subtitle="+0.1 this month"
          icon={Star}
          trend="up"
        />
        <MetricsCard
          title="Error Rate"
          value={`${metrics.errorRate}%`}
          subtitle="-0.3% this week"
          icon={CheckCircle}
          trend="up"
        />
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Mode Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(metrics.modeDistribution).map(([mode, percentage]) => (
                <div key={mode} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {mode.replace('-', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topQuestions.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {item.question}
                    </p>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-900">High Satisfaction</p>
                  <p className="text-xs text-green-700">Quiz results mode performing well</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Monitor Errors</p>
                  <p className="text-xs text-yellow-700">5 errors in subscription mode today</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Usage Growth</p>
                  <p className="text-xs text-blue-700">15% increase in conversations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversation Logs */}
      <ConversationTable conversations={conversations} />
    </div>
  );
}
