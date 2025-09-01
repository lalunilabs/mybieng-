'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { PREMIUM_PLAN } from '@/lib/subscription';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      // In production, integrate with Stripe/PayPal
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setShowSuccess(true);
      } else {
        alert('Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <CardTitle className="text-2xl text-green-700">Welcome to Premium!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Your subscription is now active. You can now:
            </p>
            <ul className="text-left space-y-2 text-sm">
              <li>🎧 Listen to all articles with audio narration</li>
              <li>🚫 No ads across the product</li>
              <li>⭐ Read 2 premium articles per month (included)</li>
              <li>🧩 Related quizzes are free for those included premium articles</li>
              <li>🛍️ Discounts on products (extra articles and select quizzes)</li>
              <li>🤖 Get priority AI chat support</li>
            </ul>
            <Button asChild className="w-full mt-6">
              <a href="/blog">Start Exploring</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Your Full Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get audio narration, member-only research, and self-discovery tools — includes 2 premium articles/month, no ads, and product discounts.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-brand-200 shadow-lg">
            <CardHeader className="text-center bg-gradient-to-r from-brand-50 to-blue-50">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-700 mb-2">
                🎯 Most Popular
              </div>
              <CardTitle className="text-2xl text-brand-600">Premium Monthly</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mt-2">
                ${PREMIUM_PLAN.price}
                <span className="text-lg text-gray-500 font-normal">/month</span>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <ul className="space-y-3 mb-6">
                {PREMIUM_PLAN.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-green-500 mt-0.5">✅</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Subscribe for $${PREMIUM_PLAN.price}/month`}
                </Button>
              </form>

              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>🔒 Secure payment • Cancel anytime • 30-day money-back guarantee</p>
                <p className="mt-1">By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-xl">🎧</span>
            </div>
            <h3 className="font-semibold text-gray-900">Audio Articles</h3>
            <p className="text-sm text-gray-600 mt-1">Listen to all research articles with professional narration</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-900">Related Quizzes Free</h3>
            <p className="text-sm text-gray-600 mt-1">Free access to quizzes linked to your included premium articles</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-xl">⭐</span>
            </div>
            <h3 className="font-semibold text-gray-900">Premium Content</h3>
            <p className="text-sm text-gray-600 mt-1">2 premium articles every month (included)</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 text-xl">🤖</span>
            </div>
            <h3 className="font-semibold text-gray-900">Priority Support</h3>
            <p className="text-sm text-gray-600 mt-1">Get faster responses from our AI chat assistant</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens to my premium articles if I cancel?</h3>
              <p className="text-gray-600">Any premium articles you've accessed during your subscription will remain available to you even after cancellation.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund within 30 days.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do monthly limits and discounts work?</h3>
              <p className="text-gray-600">You get 2 premium articles included per month. This resets on your billing date. Unused items don't roll over. Related quizzes are free for included premium articles. You also get discounts on additional products (extra articles and select quizzes).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
