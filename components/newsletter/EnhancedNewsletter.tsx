'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, Loader2, Sparkles, Brain, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/shadcn/input';
import { Card, CardContent } from '@/components/ui/Card';

interface NewsletterProps {
  variant?: 'default' | 'minimal' | 'featured';
  showBenefits?: boolean;
  className?: string;
}

export function EnhancedNewsletter({ 
  variant = 'default', 
  showBenefits = true,
  className = '' 
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  if (variant === 'minimal') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={status === 'loading'}
          />
          <Button 
            type="submit" 
            disabled={status === 'loading' || !email}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>
        
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-2 text-sm flex items-center gap-2 ${
                status === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className={`border-0 shadow-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white ${className}`}>
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Join the Self-Discovery Journey</h3>
            <p className="text-purple-100 leading-relaxed">
              Get weekly insights, new assessments, and research-backed content delivered to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                disabled={status === 'loading'}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={status === 'loading' || !email}
              className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Subscribing...
                </>
              ) : (
                'Start Your Journey'
              )}
            </Button>
          </form>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 text-sm flex items-center gap-2 ${
                  status === 'success' ? 'text-green-200' : 'text-red-200'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 text-xs text-purple-200 text-center">
            No spam, ever. Unsubscribe anytime with one click.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={`border border-gray-200 shadow-lg ${className}`}>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Stay Updated with MyBeing
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Get the latest insights on behavioral psychology, new assessments, and personal growth strategies.
          </p>
        </div>

        {showBenefits && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Brain className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">New Quizzes</div>
              <div className="text-xs text-gray-600">Weekly releases</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Research Insights</div>
              <div className="text-xs text-gray-600">Evidence-based</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Growth Tips</div>
              <div className="text-xs text-gray-600">Actionable advice</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 focus:ring-purple-500 focus:border-purple-500"
              disabled={status === 'loading'}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={status === 'loading' || !email}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Subscribing...
              </>
            ) : (
              'Subscribe to Newsletter'
            )}
          </Button>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 text-sm flex items-center gap-2 ${
                status === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Join 1,000+ readers exploring behavioral psychology and personal growth.
          <br />
          No spam, unsubscribe anytime.
        </div>
      </CardContent>
    </Card>
  );
}
