'use client';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/ui/Toast';
import { MotionConfig, LazyMotion, domAnimation } from 'framer-motion';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation} strict>
          <ToastProvider>
            {children}
          </ToastProvider>
        </LazyMotion>
      </MotionConfig>
    </SessionProvider>
  );
}
