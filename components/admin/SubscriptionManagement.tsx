'use client';

import { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Mail
} from 'lucide-react';

interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  plan: 'premium';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  amount: number;
  currency: 'usd';
  paymentMethod: {
    type: 'card';
    last4: string;
    brand: string;
  };
  createdAt: string;
  lastPayment?: {
    date: string;
    amount: number;
    status: 'succeeded' | 'failed';
  };
  nextPayment?: {
    date: string;
    amount: number;
  };
}

interface SubscriptionStats {
  totalSubscribers: number;
  activeSubscribers: number;
  cancelledSubscribers: number;
  trialingSubscribers: number;
  monthlyRevenue: number;
  churnRate: number;
  averageLifetimeValue: number;
}

export function SubscriptionManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with real API calls
  const stats: SubscriptionStats = {
    totalSubscribers: 247,
    activeSubscribers: 198,
    cancelledSubscribers: 31,
    trialingSubscribers: 18,
    monthlyRevenue: 7904,
    churnRate: 4.2,
    averageLifetimeValue: 384
  };

  const subscriptions: Subscription[] = [
    {
      id: 'sub_1',
      userId: 'user_1',
      userEmail: 'sarah.johnson@email.com',
      userName: 'Sarah Johnson',
      plan: 'premium',
      status: 'active',
      currentPeriodStart: '2024-01-15',
      currentPeriodEnd: '2024-02-15',
      cancelAtPeriodEnd: false,
      amount: 32,
      currency: 'usd',
      paymentMethod: {
        type: 'card',
        last4: '4242',
        brand: 'visa'
      },
      createdAt: '2023-11-15',
      lastPayment: {
        date: '2024-01-15',
        amount: 32,
        status: 'succeeded'
      },
      nextPayment: {
        date: '2024-02-15',
        amount: 32
      }
    },
    {
      id: 'sub_2',
      userId: 'user_2',
      userEmail: 'mike.chen@email.com',
      userName: 'Mike Chen',
      plan: 'premium',
      status: 'trialing',
      currentPeriodStart: '2024-01-20',
      currentPeriodEnd: '2024-01-27',
      cancelAtPeriodEnd: false,
      trialEnd: '2024-01-27',
      amount: 32,
      currency: 'usd',
      paymentMethod: {
        type: 'card',
        last4: '5555',
        brand: 'mastercard'
      },
      createdAt: '2024-01-20',
      nextPayment: {
        date: '2024-01-27',
        amount: 32
      }
    },
    {
      id: 'sub_3',
      userId: 'user_3',
      userEmail: 'emma.davis@email.com',
      userName: 'Emma Davis',
      plan: 'premium',
      status: 'past_due',
      currentPeriodStart: '2024-01-10',
      currentPeriodEnd: '2024-02-10',
      cancelAtPeriodEnd: false,
      amount: 32,
      currency: 'usd',
      paymentMethod: {
        type: 'card',
        last4: '1234',
        brand: 'visa'
      },
      createdAt: '2023-10-10',
      lastPayment: {
        date: '2024-01-10',
        amount: 32,
        status: 'failed'
      }
    },
    {
      id: 'sub_4',
      userId: 'user_4',
      userEmail: 'alex.wilson@email.com',
      userName: 'Alex Wilson',
      plan: 'premium',
      status: 'cancelled',
      currentPeriodStart: '2024-01-05',
      currentPeriodEnd: '2024-02-05',
      cancelAtPeriodEnd: true,
      amount: 32,
      currency: 'usd',
      paymentMethod: {
        type: 'card',
        last4: '9876',
        brand: 'amex'
      },
      createdAt: '2023-08-05',
      lastPayment: {
        date: '2024-01-05',
        amount: 32,
        status: 'succeeded'
      }
    }
  ];

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Subscription['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      past_due: 'bg-yellow-100 text-yellow-800',
      trialing: 'bg-blue-100 text-blue-800'
    };

    const icons = {
      active: <CheckCircle className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />,
      past_due: <AlertTriangle className="w-3 h-3" />,
      trialing: <Calendar className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exporting subscription data...');
  };

  const handleViewUser = (userId: string) => {
    console.log('Viewing user:', userId);
  };

  const handleSendEmail = (userEmail: string) => {
    console.log('Sending email to:', userEmail);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
          <p className="text-gray-600">Monitor and manage user subscriptions and billing</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSubscribers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSubscribers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Churn Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.churnRate}%</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or subscription ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trialing">Trialing</option>
              <option value="past_due">Past Due</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {subscription.userName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subscription.userEmail}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {subscription.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(subscription.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Premium - ${subscription.amount}/month
                    </div>
                    <div className="text-xs text-gray-500">
                      Since {new Date(subscription.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {subscription.paymentMethod.brand.toUpperCase()} ****{subscription.paymentMethod.last4}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subscription.nextPayment ? (
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(subscription.nextPayment.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${subscription.nextPayment.amount}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewUser(subscription.userId)}
                        className="text-brand-600 hover:text-brand-900"
                        title="View User"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSendEmail(subscription.userEmail)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No subscriptions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No subscriptions have been created yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
