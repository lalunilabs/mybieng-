'use client';

import { useEffect, useRef, useState } from 'react';

type SubscriptionState = 'loading' | 'standard' | 'premium';

type AdSlotProps = {
  id: string;
  className?: string;
  reserve?: {
    mobile?: { w: number; h: number };
    desktop?: { w: number; h: number };
  };
  adsenseSlotId?: string;
  label?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

function LoadingAdPlaceholder({ height, label }: { height: number; label: string }) {
  return (
    <div
      className="w-full h-full border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm flex items-center justify-center"
      style={{ minHeight: height }}
      role="status"
      aria-label={`${label} loading`}
    >
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <span className="inline-flex h-2 w-2 rounded-full bg-purple-300 animate-pulse" />
        <span>Loading sponsored placement…</span>
      </div>
    </div>
  );
}

function HouseAd({ placeholderHeight, label }: { placeholderHeight: number; label: string }) {
  return (
    <div
      className="w-full h-full border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm flex items-center justify-between px-4"
      style={{ minHeight: placeholderHeight }}
      role="region"
      aria-label={label}
    >
      <div className="text-sm text-gray-600">
        <div className="font-semibold text-gray-900">Sponsored placement</div>
        <div>Ads are disabled in this environment.</div>
        <div className="text-xs text-gray-500 mt-1">Set NEXT_PUBLIC_ENABLE_ADS=true and configure AdSense to enable.</div>
      </div>
      <a
        href="/subscribe"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
      >
        Get Premium
      </a>
    </div>
  );
}

export default function AdSlot({
  id,
  className,
  reserve = { mobile: { w: 300, h: 250 }, desktop: { w: 728, h: 90 } },
  adsenseSlotId,
  label = 'Advertisement',
}: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>('loading');

  const enableAds = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
  const slot = adsenseSlotId || process.env.NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT || '';

  useEffect(() => {
    let cancelled = false;

    if (!enableAds) {
      setSubscriptionState('standard');
      return () => {
        cancelled = true;
      };
    }

    const fetchSubscription = async () => {
      try {
        const res = await fetch('/api/user/subscription', { cache: 'no-store' });
        if (!res.ok) throw new Error('subscription check failed');
        const data = await res.json();
        if (!cancelled) {
          setSubscriptionState(data?.isPremium ? 'premium' : 'standard');
        }
      } catch {
        if (!cancelled) setSubscriptionState('standard');
      }
    };

    fetchSubscription();

    return () => {
      cancelled = true;
    };
  }, [enableAds]);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setInView(entry.isIntersecting));
      },
      { rootMargin: '200px' }
    );

    const current = ref.current;
    observer.observe(current);
    return () => observer.unobserve(current);
  }, []);

  useEffect(() => {
    if (!enableAds || !client || !slot) return;
    if (subscriptionState !== 'standard') return;
    if (!inView || initialized) return;

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    );

    const pushAd = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setInitialized(true);
      } catch {
        // ignore errors
      }
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        client
      )}`;
      script.crossOrigin = 'anonymous';
      script.onload = pushAd;
      document.head.appendChild(script);
    } else {
      pushAd();
    }
  }, [enableAds, client, slot, inView, initialized, subscriptionState]);

  const mobileHeight = reserve.mobile?.h ?? 250;
  const desktopHeight = reserve.desktop?.h ?? 90;

  if (!enableAds) {
    return <HouseAd placeholderHeight={mobileHeight} label={label} />;
  }

  if (subscriptionState === 'premium') {
    return null;
  }

  const showLoading = subscriptionState === 'loading';
  const canDisplayNetworkAd = enableAds && client && slot;

  return (
    <div
      ref={ref}
      className={`my-8 mx-auto w-full max-w-[980px] px-4${className ? ` ${className}` : ''}`}
      aria-label={label}
      data-ad-slot-id={id}
    >
      <div className="relative w-full">
        <div className="block sm:hidden w-full" style={{ minHeight: mobileHeight }}>
          {showLoading ? (
            <LoadingAdPlaceholder height={mobileHeight} label={label} />
          ) : canDisplayNetworkAd ? (
            <ins
              className="adsbygoogle block w-full"
              style={{ display: 'block', minHeight: mobileHeight }}
              data-ad-client={client}
              data-ad-slot={slot}
              data-ad-format="rectangle,vertical,auto"
              data-full-width-responsive="true"
            />
          ) : (
            <HouseAd placeholderHeight={mobileHeight} label={label} />
          )}
        </div>

        <div className="hidden sm:block w-full" style={{ minHeight: desktopHeight }}>
          {showLoading ? (
            <LoadingAdPlaceholder height={desktopHeight} label={label} />
          ) : canDisplayNetworkAd ? (
            <ins
              className="adsbygoogle block w-full"
              style={{ display: 'block', minHeight: desktopHeight }}
              data-ad-client={client}
              data-ad-slot={slot}
              data-ad-format="horizontal,auto"
              data-full-width-responsive="true"
            />
          ) : (
            <HouseAd placeholderHeight={desktopHeight} label={label} />
          )}
        </div>
      </div>
    </div>
  );
}
