'use client';

import { PRICING } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

interface SubscriptionOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionOfferModal({ isOpen, onClose }: SubscriptionOfferModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-black/10 bg-white shadow-2xl">
        <button
          onClick={() => { onClose(); try { localStorage.setItem('subscription-offer-dismissed', 'true'); } catch {} }}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full border border-gray-200 bg-white px-2 py-1 text-sm text-gray-600 hover:bg-gray-50"
        >
          ✕
        </button>
        <div className="p-6">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">⭐</div>
          <h3 className="text-xl font-bold text-gray-900">Unlock the full experience</h3>
          <p className="mt-1 text-sm text-gray-600">Unlimited AI conversations, 3 premium articles/month with audio, and 2 free quizzes (≤ $50 value each).</p>
          <div className="mt-4 flex gap-2">
            <a href="/subscribe" className="flex-1">
              <Button className="w-full h-11">Subscribe • ${PRICING.MONTHLY_USD}/mo</Button>
            </a>
            <Button variant="outline" className="h-11" onClick={() => { onClose(); try { localStorage.setItem('subscription-offer-dismissed', 'true'); } catch {} }}>Maybe later</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
