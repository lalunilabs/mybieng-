'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Quiz } from '@/data/quizzes';
import QuizRunner from '@/components/QuizRunner';
import { Button } from '@/components/ui/Button';

interface AccessResponse {
  exists?: boolean;
  hasAccess: boolean;
  isPaid: boolean;
  basePrice: number;
  finalPrice: number;
  isSubscriber: boolean;
  purchased: boolean;
  error?: string;
}

export default function QuizAccess({ quiz }: { quiz: Quiz }) {
  const [email, setEmail] = useState<string>('');
  const [access, setAccess] = useState<AccessResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  // load cached email
  useEffect(() => {
    const cached = localStorage.getItem('mybeing_email');
    if (cached) setEmail(cached);
  }, []);

  const isPaidQuiz = !!quiz.isPaid && typeof quiz.price === 'number' && quiz.price > 0;

  const fetchAccess = useCallback(async (targetEmail?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ slug: quiz.slug });
      if (targetEmail) params.set('email', targetEmail);
      const res = await fetch(`/api/quiz/access?${params.toString()}`);
      const j: AccessResponse = await res.json();
      setAccess(j);
    } catch (e) {
      setAccess({ hasAccess: false, isPaid: isPaidQuiz, basePrice: quiz.price || 0, finalPrice: quiz.price || 0, isSubscriber: false, purchased: false });
    } finally {
      setLoading(false);
    }
  }, [quiz.slug, quiz.price, isPaidQuiz]);

  useEffect(() => {
    // initial access check (without email for free quizzes)
    fetchAccess(email || undefined);
  }, [fetchAccess, email]);

  const canRun = useMemo(() => {
    if (!isPaidQuiz) return true;
    return access?.hasAccess;
  }, [isPaidQuiz, access?.hasAccess]);

  async function handleSaveEmail() {
    localStorage.setItem('mybeing_email', email);
    await fetchAccess(email);
  }

  async function handlePurchase() {
    if (!email) {
      alert('Please enter your email to purchase.');
      return;
    }
    try {
      setPurchasing(true);
      const res = await fetch('/api/quiz/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slug: quiz.slug })
      });
      const j = await res.json();
      if (!res.ok) {
        alert(j?.error || 'Purchase failed');
      } else {
        await fetchAccess(email);
      }
    } catch (e) {
      console.error('Purchase error', e);
    } finally {
      setPurchasing(false);
    }
  }

  function handleSubscribe() {
    window.location.href = '/subscribe';
  }

  if (!isPaidQuiz || canRun) {
    return <QuizRunner quiz={quiz} />;
  }

  return (
    <div className="mt-6">
      <div className="rounded-md border-2 border-brand-200 bg-brand-50 p-6">
        <h3 className="text-xl font-semibold">🔒 This quiz requires access</h3>
        <p className="text-gray-600 mt-1">Buy once for lifetime access, or subscribe for member pricing.</p>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {/* Buy Quiz */}
          <div className="bg-white rounded-lg p-5 border shadow-sm">
            <div className="text-center">
              <h4 className="font-bold text-lg">Single Quiz Access</h4>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                ${access?.finalPrice ?? quiz.price}
              </div>
              <p className="text-xs text-gray-500 mt-1">Base ${quiz.price}{access?.isSubscriber ? ` • Member price applied` : ''}</p>
              <div className="mt-4">
                <label className="text-sm text-gray-700 mr-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleSaveEmail}
                  placeholder="you@example.com"
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>
              <Button onClick={handlePurchase} className="w-full mt-4" size="lg" disabled={purchasing || loading}>
                {purchasing ? 'Processing...' : 'Buy Quiz'}
              </Button>
            </div>
          </div>

          {/* Subscribe */}
          <div className="bg-white rounded-lg p-5 border shadow-sm">
            <div className="text-center">
              <h4 className="font-bold text-lg">Premium Monthly</h4>
              <div className="text-3xl font-bold text-gray-900 mt-2">$32<span className="text-sm text-gray-500">/month</span></div>
              <ul className="text-sm text-gray-600 mt-4 space-y-2 text-left inline-block">
                <li>✅ 2 premium articles/month included</li>
                <li>✅ Related quizzes free for those articles</li>
                <li>✅ Member discounts on select quizzes</li>
                <li>✅ Audio narration for all articles</li>
              </ul>
              <Button onClick={handleSubscribe} variant="outline" className="w-full mt-4" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-3">
          {loading ? 'Checking access...' : access?.purchased ? 'You already own this quiz.' : 'Secure checkout • Cancel anytime'}
        </div>
      </div>
    </div>
  );
}
