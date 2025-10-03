'use client';

import { useEffect, useState } from 'react';

interface FontSizeControlProps {
  className?: string;
  storageKey?: string; // localStorage key
  applyOnMount?: boolean; // apply saved scale when mounted
  resetOnUnmount?: boolean; // reset to default when unmounted
}

// Text-only font-size control for article pages.
export default function FontSizeControl({
  className = '',
  storageKey = 'article-font-scale',
  applyOnMount = true,
  resetOnUnmount = true,
}: FontSizeControlProps) {
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    if (!applyOnMount) return;
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      if (stored) {
        const s = parseFloat(stored);
        if (!Number.isNaN(s)) {
          setScale(s);
          document.documentElement.style.setProperty('--font-scale', String(s));
        }
      }
    } catch {}

    return () => {
      if (resetOnUnmount) {
        try {
          document.documentElement.style.removeProperty('--font-scale');
        } catch {}
      }
    };
  }, [applyOnMount, resetOnUnmount, storageKey]);

  const apply = (next: number) => {
    const clamped = Math.min(1.25, Math.max(0.9, Number(next.toFixed(2))));
    setScale(clamped);
    try {
      document.documentElement.style.setProperty('--font-scale', String(clamped));
      localStorage.setItem(storageKey, String(clamped));
    } catch {}
  };

  return (
    <div className={`flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-2 py-1 shadow-sm ${className}`} aria-label="Adjust font size">
      <button
        onClick={() => apply(scale - 0.05)}
        className="px-2 py-0.5 rounded-md hover:bg-gray-100 text-gray-800 text-xs font-semibold"
        aria-label="Decrease font size"
      >
        A-
      </button>
      <div className="px-1 text-xs font-medium text-gray-600 tabular-nums min-w-[36px] text-center">{Math.round(scale * 100)}%</div>
      <button
        onClick={() => apply(scale + 0.05)}
        className="px-2 py-0.5 rounded-md hover:bg-gray-100 text-gray-800 text-xs font-semibold"
        aria-label="Increase font size"
      >
        A+
      </button>
    </div>
  );
}
