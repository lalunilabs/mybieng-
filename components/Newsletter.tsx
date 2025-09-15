'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/shadcn/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Mail } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Analytics: homepage newsletter impression
  useEffect(() => {
    try { trackEvent('newsletter_impression', { surface: 'homepage' }); } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try { trackEvent('newsletter_submit_attempt', { surface: 'homepage' }); } catch {}
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus('success');
        setMessage(data?.message || "You're in! The Weekly Letter arrives every week.");
        if (data?.confirmed) {
          try { localStorage.setItem('newsletter-subscribed', 'true'); } catch {}
        }
        setEmail('');
        try { trackEvent('newsletter_submit_success', { surface: 'homepage', confirmed: !!data?.confirmed }); } catch {}
      } else {
        setStatus('error');
        setMessage(data?.error || 'Something went wrong. Please try again.');
        try { trackEvent('newsletter_submit_error', { surface: 'homepage' }); } catch {}
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
      try { trackEvent('newsletter_submit_error', { surface: 'homepage' }); } catch {}
    }
  };

  return (
    <motion.div
      id="newsletter"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Card className="relative overflow-hidden border-purple-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        {/* Decorative gradient */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-400/20 blur-3xl" />
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg">
              <Mail className="w-6 h-6" />
            </span>
          </div>
          <CardTitle className="text-black text-2xl">Weekly Letter</CardTitle>
          <CardDescription className="text-black">
            Research-backed insights, new quizzes, and small steps.
            <span className="block text-gray-700/80">No spam. Unsubscribe anytime.</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
            <div className="space-y-1">
              <Label htmlFor="newsletter-email">Email address</Label>
              <Input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="bg-white text-black focus-visible:ring-brand-500"
                required
                aria-required="true"
                aria-label="Email address"
              />
            </div>
            <Button 
              type="submit" 
              disabled={status === 'loading'}
              className="h-11 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </Button>
          </form>
          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`mt-3 text-sm text-center ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}
            >
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

