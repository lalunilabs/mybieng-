'use client';

import { motion } from 'framer-motion';
import { Users, FileText, Brain, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function WorldClassDashboard() {
  const stats = [
    { title: 'Total Users', value: '2,847', change: '+12.5%', icon: Users, color: 'text-blue-600' },
    { title: 'Active Subscriptions', value: '1,203', change: '+8.3%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Total Articles', value: '24', change: '+2', icon: FileText, color: 'text-purple-600' },
    { title: 'Total Quizzes', value: '8', change: '+1', icon: Brain, color: 'text-orange-600' },
    { title: 'Monthly Revenue', value: '$38.5k', change: '+15.2%', icon: TrendingUp, color: 'text-emerald-600' },
    { title: 'AI Conversations', value: '8,924', change: '+23.7%', icon: Activity, color: 'text-indigo-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back, Creator</h1>
        <p className="text-purple-100">Your research platform is helping <span className="numeric-figures">2,847</span> people understand themselves better.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1 numeric-figures">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1 numeric-figures">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'New Article', href: '/admin/articles', icon: FileText, color: 'bg-blue-500' },
          { title: 'Create Quiz', href: '/admin/quizzes', icon: Brain, color: 'bg-purple-500' },
          { title: 'View Analytics', href: '/admin/analytics', icon: TrendingUp, color: 'bg-green-500' },
          { title: 'Research Data', href: '/admin/research', icon: Activity, color: 'bg-orange-500' }
        ].map((action, index) => (
          <motion.a
            key={action.title}
            href={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`${action.color} text-white p-6 rounded-xl hover:shadow-lg transition-all text-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <action.icon className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">{action.title}</p>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
