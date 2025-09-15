'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CategorySelector from '@/components/CategorySelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Crown, Zap } from 'lucide-react';
import { PRICING } from '@/lib/constants';
import PrimaryCTA from '@/components/ui/PrimaryCTA';

export default function StartPage() {
  const [step, setStep] = useState<'categories' | 'pricing'>('categories');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const router = useRouter();

  const handleCategorySelect = (categories: string[]) => {
    setSelectedCategories(categories);
    setStep('pricing');
  };

  const handlePricingSelect = (tier: 'free' | 'premium') => {
    // Store user preferences in localStorage for now
    localStorage.setItem('userPreferences', JSON.stringify({
      categories: selectedCategories,
      tier: tier,
      startedAt: new Date().toISOString()
    }));

    // Redirect to appropriate content
    if (selectedCategories.includes('both') || selectedCategories.length > 1) {
      router.push('/dashboard');
    } else if (selectedCategories.includes('understanding-yourself')) {
      router.push('/quizzes');
    } else if (selectedCategories.includes('understanding-surroundings')) {
      router.push('/blog');
    } else {
      router.push('/');
    }
  };

  if (step === 'categories') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-purple-50 py-12">
        <CategorySelector onCategorySelect={handleCategorySelect} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-4">Choose Your Access Level</h2>
          <p className="text-lg text-black">
            Select the plan that best fits your self-discovery journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Free Tier */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-yellow-100 to-purple-100">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <Zap className="w-12 h-12 text-purple-500" />
              </div>
              <CardTitle className="text-black text-2xl">Free Explorer</CardTitle>
              <CardDescription className="text-black text-lg font-semibold">
                $0/month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-black">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Access to 3 basic quizzes
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Weekly research articles
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic progress tracking
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Community access
                </li>
                <li className="flex items-center">
                  <span className="text-gray-400 mr-2">✗</span>
                  <span className="text-gray-500">Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <span className="text-gray-400 mr-2">✗</span>
                  <span className="text-gray-500">Personalized AI insights</span>
                </li>
              </ul>
              <PrimaryCTA
                surface="start_pricing"
                eventName="start_free"
                className="w-full"
                variant="uiverse"
                onClick={() => handlePricingSelect('free')}
              >
                Start Free Journey
              </PrimaryCTA>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="border-2 border-purple-400 bg-gradient-to-br from-purple-100 to-yellow-100 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <Crown className="w-12 h-12 text-purple-600" />
              </div>
              <CardTitle className="text-black text-2xl">Premium Researcher</CardTitle>
              <CardDescription className="text-black text-lg font-semibold">
                ${PRICING.MONTHLY_USD}/month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-black">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Unlimited access to all quizzes
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Daily research insights
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Advanced progress analytics
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  AI-powered personalized insights
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Priority support from Dr N
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Exclusive research previews
                </li>
              </ul>
              <PrimaryCTA
                surface="start_pricing"
                eventName="start_premium"
                className="w-full"
                variant="uiverse"
                onClick={() => handlePricingSelect('premium')}
              >
                Start Premium Journey
              </PrimaryCTA>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={() => setStep('categories')}
            variant="outline"
          >
            ← Back to Categories
          </Button>
        </div>
      </div>
    </div>
  );
}
