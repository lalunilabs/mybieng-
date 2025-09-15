'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  Mail,
  Ban,
  UserCheck,
  DollarSign,
  Calendar,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserManagement as UserData } from '@/types/admin';

interface UserTableProps {
  users: UserData[];
  onUserAction: (userId: string, action: string) => void;
}

function UserTable({ users, onUserAction }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'cancelled' | 'expired'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'joinDate' | 'revenue'>('joinDate');

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || user.subscription.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'revenue':
          return b.subscription.revenue - a.subscription.revenue;
        default:
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      }
    });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return styles[status as keyof typeof styles] || styles.expired;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle>User Management</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
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
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  <button
                    onClick={() => setSortBy('name')}
                    className="flex items-center hover:text-purple-600"
                  >
                    User
                    {sortBy === 'name' && <span className="ml-1">↓</span>}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Subscription</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  <button
                    onClick={() => setSortBy('revenue')}
                    className="flex items-center hover:text-purple-600"
                  >
                    Revenue
                    {sortBy === 'revenue' && <span className="ml-1">↓</span>}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Activity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  <button
                    onClick={() => setSortBy('joinDate')}
                    className="flex items-center hover:text-purple-600"
                  >
                    Join Date
                    {sortBy === 'joinDate' && <span className="ml-1">↓</span>}
                  </button>
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.subscription.status)}`}>
                        {user.subscription.status}
                      </span>
                      <span className="text-sm text-gray-600">{user.subscription.plan}</span>
                    </div>
                    {user.subscription.status === 'active' && (
                      <div className="text-xs text-gray-500 mt-1">
                        Next billing: {user.subscription.nextBilling.toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">
                      ${user.subscription.revenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">
                      {user.quizzesTaken} quizzes • {user.blogsRead} articles
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.aiConversations} AI chats • {Math.round(user.totalEngagementTime)} min
                    </div>
                    <div className="text-xs text-gray-500">
                      Last active: {user.lastActive.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">
                      {user.joinDate.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUserAction(user.id, 'email')}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUserAction(user.id, 'view')}
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUserAction(user.id, 'more')}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalRevenue: 0,
    avgEngagement: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockUsers: UserData[] = [
      {
        id: '1',
        email: 'sarah.johnson@email.com',
        name: 'Sarah Johnson',
        joinDate: new Date('2025-08-15'),
        lastActive: new Date('2025-09-04'),
        subscription: {
          plan: 'Premium',
          status: 'active',
          nextBilling: new Date('2025-09-15'),
          revenue: 96
        },
        quizzesTaken: 8,
        blogsRead: 12,
        aiConversations: 23,
        totalEngagementTime: 145.5
      },
      {
        id: '2',
        email: 'mike.chen@email.com',
        name: 'Mike Chen',
        joinDate: new Date('2025-07-22'),
        lastActive: new Date('2025-09-03'),
        subscription: {
          plan: 'Premium',
          status: 'active',
          nextBilling: new Date('2025-09-22'),
          revenue: 128
        },
        quizzesTaken: 12,
        blogsRead: 8,
        aiConversations: 31,
        totalEngagementTime: 203.2
      },
      {
        id: '3',
        email: 'emma.davis@email.com',
        name: 'Emma Davis',
        joinDate: new Date('2025-06-10'),
        lastActive: new Date('2025-08-28'),
        subscription: {
          plan: 'Free',
          status: 'cancelled',
          nextBilling: new Date('2025-09-10'),
          revenue: 64
        },
        quizzesTaken: 3,
        blogsRead: 5,
        aiConversations: 7,
        totalEngagementTime: 42.1
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setStats({
        totalUsers: mockUsers.length,
        activeSubscribers: mockUsers.filter(u => u.subscription.status === 'active').length,
        totalRevenue: mockUsers.reduce((sum, u) => sum + u.subscription.revenue, 0),
        avgEngagement: mockUsers.reduce((sum, u) => sum + u.totalEngagementTime, 0) / mockUsers.length
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action ${action} for user ${userId}`);
    // Implement user actions here
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
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSubscribers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(stats.avgEngagement)}m</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <UserTable users={users} onUserAction={handleUserAction} />
    </div>
  );
}
