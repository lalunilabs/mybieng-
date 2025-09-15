'use client';

import { useState } from 'react';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/ui/Button';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  surface?: string;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Subscription failed');
      try { localStorage.setItem('newsletter-subscribed', 'true'); } catch {}
      setStatus('success');
      setMessage(data?.message || "You're in! We'll be in your inbox every 14 days.");
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-black/10 bg-white shadow-2xl">
        <button
          onClick={() => { onClose(); try { localStorage.setItem('newsletter-modal-dismissed', 'true'); } catch {} }}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full border border-gray-200 bg-white px-2 py-1 text-sm text-gray-600 hover:bg-gray-50"
        >
          ✕
        </button>
        <div className="p-6">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700">✉️</div>
          <h3 className="text-xl font-bold text-gray-900">Get research-backed insights</h3>
          <p className="mt-1 text-sm text-gray-600">Every 14 days. No spam. Unsubscribe anytime.</p>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 h-11"
            />
            <Button type="submit" disabled={status === 'loading' || !email} className="h-11 px-5">
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          {message && (
            <p className={`mt-2 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
