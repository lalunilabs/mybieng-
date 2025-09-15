'use client';

import { motion } from 'framer-motion';
import { Check, Star, Sparkles, Brain, BarChart3, MessageCircle, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PremiumCardProps {
  title: string;
  tag?: string;
  description: string;
  features: Array<{
    icon: React.ReactNode;
    text: string;
  }>;
  price: {
    amount: number;
    currency?: string;
    period: string;
  };
  isPopular?: boolean;
  onGetStarted?: () => void;
  className?: string;
}

export function PremiumCard({
  title,
  tag = "Premium",
  description,
  features,
  price,
  isPopular = false,
  onGetStarted,
  className = ""
}: PremiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`premium-card relative overflow-hidden ${className}`}
    >
      {/* Enhanced Background Pattern */}
      <div className="card-pattern-grid absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(216, 180, 254, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(216, 180, 254, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Main Card Content */}
      <div className="relative z-10 p-8 h-full bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        
        {/* Header with Enhanced Styling */}
        <div className="card-title-area flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <span className={`card-tag px-3 py-1 rounded-full text-xs font-semibold ${
            isPopular 
              ? 'bg-gradient-to-r from-lilac-400 to-lilac-300 text-lilac-900 shadow-sm' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isPopular && <Star className="w-3 h-3 inline mr-1" />}
            {tag}
          </span>
        </div>

        {/* Enhanced Description */}
        <div className="card-description text-gray-700 mb-8 leading-relaxed text-sm">
          {description}
        </div>

        {/* Features List with Enhanced Styling */}
        <div className="feature-list space-y-3 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="feature-item flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="feature-icon w-6 h-6 flex items-center justify-center rounded-lg bg-gradient-to-r from-lilac-400 to-lilac-300 text-lilac-900 flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <span className="feature-text text-sm font-medium text-gray-800">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Pricing and CTA with Enhanced Styling */}
        <div className="card-actions flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="price flex items-baseline gap-1">
            <span className="price-currency text-xl font-bold text-gray-500">
              {price.currency || '$'}
            </span>
            <span className="text-4xl font-bold text-gray-900">
              {price.amount}
            </span>
            <span className="price-period text-gray-600 text-sm ml-1">
              /{price.period}
            </span>
          </div>

          <Button
            onClick={onGetStarted}
            className={`card-button rounded-xl px-6 py-2.5 font-medium ${
              isPopular 
                ? 'bg-gradient-to-r from-lilac-400 to-lilac-300 hover:from-lilac-300 hover:to-lilac-200 text-lilac-900 shadow-md hover:shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-900 text-white'
            }`}
            size="lg"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="accent-shape absolute top-0 right-0 w-24 h-24 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-lilac-400 to-lilac-300 rounded-bl-full" />
      </div>

      {/* Popular Badge */}
      {isPopular && (
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -12 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="stamp absolute -top-3 -left-3 bg-gradient-to-r from-lilac-400 to-lilac-300 text-lilac-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          <span className="stamp-text">Best Value</span>
        </motion.div>
      )}
    </motion.div>
  );
}

// Predefined feature icons for MyBeing platform
export const MYBEING_FEATURES = {
  quizzes: <Brain className="w-4 h-4" />,
  analytics: <BarChart3 className="w-4 h-4" />,
  chat: <MessageCircle className="w-4 h-4" />,
  tracking: <Calendar className="w-4 h-4" />,
  insights: <Sparkles className="w-4 h-4" />,
  support: <Check className="w-4 h-4" />
};

export default PremiumCard;
