'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * World-Class Scrolling Enhancement Component
 * Provides premium scrolling experience with invisible scrollbars
 */
export function WorldClassScroll() {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Enhanced smooth scrolling for anchor links
    const handleAnchorClick = (e: Event) => {
      const el = e.target as HTMLElement | null;
      const anchor = el?.closest && (el.closest('a') as HTMLAnchorElement | null);
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        const element = document.querySelector(anchor.hash);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({
            behavior: shouldReduceMotion ? 'auto' : 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }
    };

    // Premium scroll restoration
    const handleBeforeUnload = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    const handleLoad = () => {
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedPosition),
            behavior: shouldReduceMotion ? 'auto' : 'smooth'
          });
        }, 100);
      }
    };

    // Enhanced keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      }
      if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ 
          top: document.documentElement.scrollHeight, 
          behavior: shouldReduceMotion ? 'auto' : 'smooth' 
        });
      }
    };

    // Smooth scroll for page up/down
    const handlePageScroll = (e: KeyboardEvent) => {
      if (e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        const direction = e.key === 'PageUp' ? -1 : 1;
        const scrollAmount = window.innerHeight * 0.8 * direction;
        window.scrollBy({
          top: scrollAmount,
          behavior: shouldReduceMotion ? 'auto' : 'smooth'
        });
      }
    };

    // Add event listeners
    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handlePageScroll);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handlePageScroll);
    };
  }, [shouldReduceMotion]);

  return null; // This component only provides behavior
}

/**
 * Premium Scroll Container Component
 * Wraps content with optimized scrolling behavior
 */
interface ScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  enableSnap?: boolean;
}

export function ScrollContainer({ 
  children, 
  className = '', 
  enableSnap = false 
}: ScrollContainerProps) {
  const scrollClasses = [
    'scroll-container',
    enableSnap ? 'scroll-section' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={scrollClasses}>
      {children}
    </div>
  );
}

/**
 * Smooth Scroll Hook for programmatic scrolling
 */
export function useSmoothScroll() {
  const scrollTo = (target: string | number, offset = 0) => {
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
    } else {
      window.scrollTo({
        top: target - offset,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ 
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth' 
    });
  };

  return { scrollTo, scrollToTop, scrollToBottom };
}

/**
 * Scroll Progress Hook
 * Returns scroll progress as percentage (0-100)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, p)));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}

