'use client';

import { Suspense } from 'react';
import { OptimizedNavbar } from './OptimizedNavbar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

function NavbarFallback() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-white/95 supports-[backdrop-filter]:backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
            MyBeing
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <span className="text-slate-900 font-medium text-sm">Loading...</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function NavbarWrapper() {
  return (
    <ErrorBoundary fallback={NavbarFallback}>
      <Suspense fallback={<NavbarFallback />}>
        <OptimizedNavbar />
      </Suspense>
    </ErrorBoundary>
  );
}
