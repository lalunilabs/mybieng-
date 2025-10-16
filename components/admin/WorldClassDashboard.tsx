'use client';

import { motion } from 'framer-motion';
// Removed lucide-react icons to use text-based interface
import { Card } from '@/components/ui/Card';

export function WorldClassDashboard() {
  const stats = [
    { title: 'Total Users', value: '2,847', change: '+12.5%', color: 'text-blue-600' },
    { title: 'Active Subscriptions', value: '1,203', change: '+8.3%', color: 'text-green-600' },
    { title: 'Total Articles', value: '24', change: '+2', color: 'text-purple-600' },
    { title: 'Total Quizzes', value: '8', change: '+1', color: 'text-orange-600' },
    { title: 'Monthly Revenue', value: '$38.5k', change: '+15.2%', color: 'text-emerald-600' },
    { title: 'AI Conversations', value: '8,924', change: '+23.7%', color: 'text-indigo-600' }
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
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value.includes('%') ? '%' : stat.value.includes('$') ? '$' : '#'}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'New Article', href: '/admin/articles', color: 'bg-blue-500', emoji: '📝' },
          { title: 'Create Quiz', href: '/admin/quizzes', color: 'bg-purple-500', emoji: '🧠' },
          { title: 'View Analytics', href: '/admin/analytics', color: 'bg-green-500', emoji: '📊' },
          { title: 'Research Data', href: '/admin/research', color: 'bg-orange-500', emoji: '🔬' }
        ].map((action, index) => (
          <motion.a
            key={action.title}
            href={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`${action.color} text-white p-6 rounded-xl hover:shadow-lg transition-all text-center block`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-2xl mb-2">{action.emoji}</div>
            <p className="font-medium">{action.title}</p>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
