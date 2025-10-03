'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Check, 
  Sparkles, 
  Brain, 
  MessageCircle, 
  BookOpen,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Star,
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface PremiumFeature {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  value: string;
}

interface PremiumSubscriptionProps {
  currentPlan?: 'free' | 'premium';
  onUpgrade?: () => void;
}

const premiumFeatures: PremiumFeature[] = [
  {
    icon: Brain,
    title: '2 Premium Quizzes Monthly',
    description: 'Access to advanced assessments worth $50+ each, with deeper insights and personalized analysis',
    value: '$100+ value'
  },
  {
    icon: BookOpen,
    title: '3 Premium Research Articles',
    description: 'In-depth articles with advanced research, case studies, and actionable frameworks',
    value: '$75+ value'
  },
  {
    icon: MessageCircle,
    title: 'Unlimited AI Conversations',
    description: 'Chat with AI about your results, get deeper explanations, and explore patterns without limits',
    value: '$50+ value'
  },
  {
    icon: Target,
    title: 'Personalized Content Curation',
    description: 'AI-powered recommendations based on your quiz results and reading preferences',
    value: '$30+ value'
  },
  {
    icon: TrendingUp,
    title: 'Custom Learning Plans',
    description: 'Structured development paths tailored to your goals and behavioral patterns',
    value: '$40+ value'
  },
  {
    icon: Zap,
    title: 'Subscriber Discounts',
    description: '25% off additional premium content and future course releases',
    value: 'Ongoing savings'
  },
  {
    icon: Star,
    title: 'Advanced Progress Tracking',
    description: 'Detailed analytics, pattern recognition, and longitudinal insights over time',
    value: '$25+ value'
  }
];

export function PremiumSubscription({ currentPlan = 'free', onUpgrade }: PremiumSubscriptionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const monthlyPrice = 32;
  const annualPrice = monthlyPrice * 10; // 2 months free
  const totalValue = 320; // Sum of all feature values

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: billingCycle === 'monthly' ? 'price_monthly' : 'price_annual',
          billingCycle
        })
      });

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentPlan === 'premium') {
    return <PremiumDashboard />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6"
        >
          <Crown className="w-5 h-5 text-purple-600" />
          <span className="text-purple-700 font-semibold">Premium Membership</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Unlock Your Full Potential
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Get unlimited access to premium assessments, AI conversations, and personalized insights 
          designed for strategic pacing, not consumption overload.
        </motion.p>
      </div>

      {/* Pricing Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <Card className="border-2 border-purple-200 shadow-2xl bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            
            <CardTitle className="text-2xl font-bold text-gray-900">
              MyBeing Premium
            </CardTitle>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                  billingCycle === 'annual'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Annual
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                  Save 17%
                </Badge>
              </button>
            </div>
          </CardHeader>

          <CardContent className="text-center">
            <div className="mb-6">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-900">
                  ${billingCycle === 'monthly' ? monthlyPrice : Math.round(annualPrice / 12)}
                </span>
                <span className="text-lg text-gray-600">/month</span>
              </div>
              
              {billingCycle === 'annual' && (
                <div className="text-sm text-gray-600">
                  <span className="line-through">${monthlyPrice * 12}</span>
                  <span className="text-green-600 font-semibold ml-2">
                    Save ${(monthlyPrice * 12) - annualPrice}
                  </span>
                </div>
              )}
              
              <div className="text-sm text-purple-600 font-medium mt-2">
                ${totalValue}+ value • Smart monthly allowances
              </div>
            </div>

            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Upgrade to Premium
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            <p className="text-xs text-gray-500 mt-4">
              Cancel anytime • 7-day money-back guarantee • Secure payment
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {premiumFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {feature.value}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Strategic Pacing Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Designed for Deep Growth, Not Overwhelm
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our premium plan uses smart monthly allowances to encourage thoughtful reflection 
                and sustainable personal development, not mindless consumption.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Quality Over Quantity</h4>
                <p className="text-sm text-gray-600">
                  Carefully curated content that provides lasting value
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Strategic Pacing</h4>
                <p className="text-sm text-gray-600">
                  Monthly allowances encourage reflection between assessments
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Sustainable Growth</h4>
                <p className="text-sm text-gray-600">
                  Build lasting insights without information overload
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Premium Dashboard Component
function PremiumDashboard() {
  const [usage, setUsage] = useState({
    quizzesUsed: 1,
    quizzesLimit: 2,
    articlesUsed: 2,
    articlesLimit: 3,
    aiConversations: 15,
    resetDate: '2024-11-03'
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-4">
          <Crown className="w-5 h-5 text-purple-600" />
          <span className="text-purple-700 font-semibold">Premium Member</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Premium Dashboard
        </h1>
        
        <p className="text-gray-600">
          Track your monthly allowances and premium benefits
        </p>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Premium Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This month</span>
                <span className="text-sm font-medium">
                  {usage.quizzesUsed}/{usage.quizzesLimit} used
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(usage.quizzesUsed / usage.quizzesLimit) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Resets on {new Date(usage.resetDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Premium Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This month</span>
                <span className="text-sm font-medium">
                  {usage.articlesUsed}/{usage.articlesLimit} used
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(usage.articlesUsed / usage.articlesLimit) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Resets on {new Date(usage.resetDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unlimited Features */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Unlimited AI Conversations</h3>
              <p className="text-sm text-gray-600">
                {usage.aiConversations} conversations this month • No limits
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">∞</div>
              <div className="text-xs text-gray-600">AI Chats</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">✓</div>
              <div className="text-xs text-gray-600">Progress Tracking</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">25%</div>
              <div className="text-xs text-gray-600">Discounts</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">✓</div>
              <div className="text-xs text-gray-600">Custom Plans</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
