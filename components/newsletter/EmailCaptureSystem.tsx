'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Gift, 
  CheckCircle, 
  X, 
  Sparkles,
  ArrowRight,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface EmailCaptureProps {
  variant?: 'popup' | 'inline' | 'sidebar' | 'exit-intent';
  trigger?: 'immediate' | 'scroll' | 'time' | 'exit';
  leadMagnet?: {
    title: string;
    description: string;
    value: string;
  };
  onCapture?: (email: string, preferences: any) => void;
}

export function EmailCaptureSystem({ 
  variant = 'inline',
  trigger = 'immediate',
  leadMagnet,
  onCapture 
}: EmailCaptureProps) {
  const [isVisible, setIsVisible] = useState(variant === 'inline');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [preferences, setPreferences] = useState({
    weeklyInsights: true,
    newQuizzes: true,
    researchUpdates: false
  });

  const defaultLeadMagnet = {
    title: "Free Personality Insights Guide",
    description: "Discover the 5 hidden patterns that shape your decisions",
    value: "$47 value"
  };

  const currentLeadMagnet = leadMagnet || defaultLeadMagnet;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          preferences,
          source: variant,
          leadMagnet: currentLeadMagnet.title
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        onCapture?.(email, preferences);
        
        // Auto-hide after success
        setTimeout(() => {
          if (variant === 'popup' || variant === 'exit-intent') {
            setIsVisible(false);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  const content = (
    <Card className={`${
      variant === 'popup' || variant === 'exit-intent' 
        ? 'max-w-lg w-full' 
        : 'w-full'
    } border-0 shadow-2xl bg-gradient-to-br from-white to-purple-50`}>
      <CardContent className="p-8">
        {/* Close button for popups */}
        {(variant === 'popup' || variant === 'exit-intent') && (
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Lead Magnet */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                
                <Badge className="bg-green-100 text-green-700 mb-3">
                  {currentLeadMagnet.value} • Free
                </Badge>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentLeadMagnet.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {currentLeadMagnet.description}
                </p>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>

                {/* Preferences */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">What would you like to receive?</p>
                  
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={preferences.weeklyInsights}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        weeklyInsights: e.target.checked
                      })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-700">Weekly behavioral insights</span>
                  </label>
                  
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={preferences.newQuizzes}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        newQuizzes: e.target.checked
                      })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-700">New quiz releases</span>
                  </label>
                  
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={preferences.researchUpdates}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        researchUpdates: e.target.checked
                      })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-700">Research updates from Dr. N</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={!email || isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Subscribing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Get My Free Guide
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Privacy protected</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Instant delivery</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900">
                Check Your Email!
              </h3>
              
              <p className="text-gray-600">
                We've sent your free guide to <strong>{email}</strong>. 
                Check your inbox (and spam folder) in the next few minutes.
              </p>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <strong>Next step:</strong> Take your first assessment to get personalized insights 
                  based on your unique behavioral patterns.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );

  // Render based on variant
  if (variant === 'popup' || variant === 'exit-intent') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
        onClick={() => setIsVisible(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={variant === 'sidebar' ? 'sticky top-24' : ''}
    >
      {content}
    </motion.div>
  );
}

// Exit Intent Hook
export function useExitIntent(onExitIntent: () => void) {
  useState(() => {
    let hasTriggered = false;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        hasTriggered = true;
        onExitIntent();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  });
}

// Scroll Trigger Hook
export function useScrollTrigger(threshold: number, onTrigger: () => void) {
  useState(() => {
    let hasTriggered = false;
    
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent >= threshold && !hasTriggered) {
        hasTriggered = true;
        onTrigger();
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
}
