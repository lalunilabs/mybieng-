"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/ui/Button';

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Analytics: footer newsletter impression
  useEffect(() => {
    try { trackEvent('newsletter_impression', { surface: 'footer' }); } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try { trackEvent('newsletter_submit_attempt', { surface: 'footer' }); } catch {}

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

      setStatus('success');
      setMessage(data?.message || "You're in! The Weekly Reflection arrives every week.");
      setEmail('');
      try { trackEvent('newsletter_submit_success', { surface: 'footer', confirmed: !!data?.confirmed }); } catch {}
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Subscription failed. Please try again.');
      try { trackEvent('newsletter_submit_error', { surface: 'footer' }); } catch {}
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-yellow-400 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-slate-900">MB</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">MyBeing</h3>
                <p className="text-purple-200 text-sm">by Dr. Niharika, MBBS</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
              Evidence-based self-discovery platform combining medical expertise with psychological research to help you understand yourself and your environment through scientifically-backed assessments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.063 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">Home</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">Articles</Link></li>
              <li><Link href="/quizzes" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">Quizzes</Link></li>
              <li><Link href="/research" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">Research</Link></li>
              <li><Link href="/how-it-works" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">How it works</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">Start for Free</Link></li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">About</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">About Dr N</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">Careers</Link></li>
              <li><Link href="/press" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">Help Center</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="text-gray-300 hover:text-purple-300 text-sm transition-colors">Cookie Policy</Link></li>
              <li><a href="#" className="termly-display-preferences text-gray-300 hover:text-purple-300 text-sm transition-colors">Consent Preferences</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-white/10 pt-12 mb-12">
          <div className="max-w-md">
            <h4 className="font-semibold text-white mb-4 text-lg">The Weekly Reflection</h4>
            <p className="text-gray-300 text-sm mb-4">Weekly insights: research-backed content and self-discovery tools. No spam.</p>
            <form onSubmit={handleSubmit} className="flex">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 h-11 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-l-lg rounded-r-none focus-visible:ring-brand-500"
                required
                aria-label="Email address"
              />
              <Button
                type="submit"
                disabled={status === 'loading' || !email}
                className="h-11 px-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-r-lg rounded-l-none font-medium disabled:opacity-60"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            {message && (
              <p className={`mt-2 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-300'}`}>{message}</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-gray-400 text-sm">
              © {year} MyBeing. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Developed by Dr. Niharika, MBBS - Medical Doctor & Behavioral Research Specialist
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-xs">Powered by</span>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-yellow-400 rounded"></div>
              <span className="text-gray-300 text-sm font-medium">Evidence-Based Research</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

