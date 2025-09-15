'use client';

import { motion } from 'framer-motion';
import { PremiumCard, MYBEING_FEATURES } from '@/components/ui/PremiumCard';
import { Brain, BarChart3, MessageCircle, Calendar, Sparkles, Users, Lock, Zap, TrendingUp, BookOpen, Target } from 'lucide-react';

const pricingPlans = [
  {
    title: "Explorer",
    tag: "Free",
    description: "Perfect for individuals starting their self-discovery journey. Take basic quizzes and get foundational insights into your patterns.",
    features: [
      { icon: MYBEING_FEATURES.quizzes, text: "3 Basic Quizzes" },
      { icon: MYBEING_FEATURES.insights, text: "Basic Insights" },
      { icon: <Users className="w-4 h-4" />, text: "Community Access" },
      { icon: MYBEING_FEATURES.support, text: "Email Support" }
    ],
    price: {
      amount: 0,
      currency: "$",
      period: "forever"
    },
    isPopular: false
  },
  {
    title: "Premium",
    tag: "Best Value",
    description: "Comprehensive plan with everything you need for deep self-discovery and personal growth. Includes 2 free quizzes, premium articles, AI conversations, and more.",
    features: [
      { icon: <Brain className="w-4 h-4" />, text: "2 Free Premium Quizzes" },
      { icon: <BookOpen className="w-4 h-4" />, text: "3 Premium Articles" },
      { icon: <MessageCircle className="w-4 h-4" />, text: "Unlimited AI Conversations" },
      { icon: <TrendingUp className="w-4 h-4" />, text: "Personalized Content Curation" },
      { icon: <Target className="w-4 h-4" />, text: "Custom Learning Plans" },
      { icon: <Calendar className="w-4 h-4" />, text: "Progress Tracking" },
      { icon: <BarChart3 className="w-4 h-4" />, text: "Advanced Analytics" }
    ],
    price: {
      amount: 32,
      currency: "$",
      period: "per month"
    },
    isPopular: true
  }
];

export function PricingSection() {
  const handleGetStarted = (planTitle: string) => {
    // Handle plan selection logic
    console.log(`Selected plan: ${planTitle}`);
    // Navigate to signup/checkout
  };

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-lilac-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-lilac-100 to-lilac-50 text-lilac-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Simple & Transparent Pricing
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Invest in Your
            <br />
            <span className="bg-gradient-to-r from-lilac-400 to-lilac-300 bg-clip-text text-transparent">
              Self-Discovery
            </span>
          </h2>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            One comprehensive plan designed to help you understand yourself better. 
            No hidden fees or complicated tiers.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`${plan.isPopular ? 'lg:scale-105' : ''}`}
            >
              <PremiumCard
                title={plan.title}
                tag={plan.tag}
                description={plan.description}
                features={plan.features}
                price={plan.price}
                isPopular={plan.isPopular}
                onGetStarted={() => handleGetStarted(plan.title)}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-white to-lilac-50 rounded-2xl p-8 shadow-lg border border-lilac-100 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-lilac-400 to-lilac-300 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <Brain className="w-8 h-8 text-lilac-900" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-700 mb-6">
              Begin with our free Explorer plan and upgrade to Premium when you're ready for deeper insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-lilac-400 to-lilac-300 text-lilac-900 rounded-xl font-semibold hover:from-lilac-300 hover:to-lilac-200 shadow-md hover:shadow-lg transition-all duration-300">
                Take Free Assessment
              </button>
              <button className="px-6 py-3 border-2 border-lilac-400 text-lilac-700 rounded-xl font-semibold hover:bg-lilac-50 transition-all duration-300">
                View Premium Features
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingSection;
