'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/shadcn/input';
import { trackEvent } from '@/lib/analytics';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Analytics: modal impression when opened
  useEffect(() => {
    if (isOpen) {
      try { trackEvent('newsletter_impression', { surface: 'modal' }); } catch {}
    }
  }, [isOpen]);

  const handleClose = (origin: 'button' | 'backdrop' | 'auto') => {
    try { trackEvent('newsletter_modal_close', { origin }); } catch {}
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(null);
    try { trackEvent('newsletter_submit_attempt', { surface: 'modal' }); } catch {}

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || 'Subscription failed. Please try again.');
      }

      if (data?.confirmed) {
        try { localStorage.setItem('newsletter-subscribed', 'true'); } catch {}
      }

      setSuccessMessage(data?.message || 'Check your email for a confirmation link. Your first insights arrive in 14 days.');
      setIsSuccess(true);
      setIsSubmitting(false);
      try { trackEvent('newsletter_submit_success', { surface: 'modal', confirmed: !!data?.confirmed }); } catch {}

      // Close modal after success
      setTimeout(() => {
        handleClose('auto');
        setIsSuccess(false);
        setSuccessMessage('');
        setEmail('');
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Subscription failed. Please try again.');
      setIsSubmitting(false);
      try { trackEvent('newsletter_submit_error', { surface: 'modal' }); } catch {}
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => handleClose('backdrop')}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => handleClose('button')}
            aria-label="Close newsletter modal"
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {!isSuccess ? (
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">DID YOUR RESEARCH</h2>
                <p className="text-gray-600">
                  Every 14 days: research-backed insights and new quizzes. No spam.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative space-y-1">
                  <Label htmlFor="newsletter-modal-email">Email address</Label>
                  <Mail className="absolute left-3 top-[38px] text-gray-400 w-5 h-5 pointer-events-none" />
                  <Input
                    id="newsletter-modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="pl-10 h-12 rounded-xl focus-visible:ring-brand-500"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                  loading={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe to DID YOUR RESEARCH'}
                </Button>

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}
              </form>

              {/* Benefits */}
              <div className="mt-6 space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  Delivered every 14 days
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  New quiz notifications
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  Unsubscribe anytime
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome aboard!
              </h2>
              <p className="text-gray-600">{successMessage || 'You are subscribed.'}</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

