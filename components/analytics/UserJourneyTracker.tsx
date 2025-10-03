'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface TrackingEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  page: string;
}

interface UserJourneyTrackerProps {
  userId?: string;
  sessionId: string;
}

export function UserJourneyTracker({ userId, sessionId }: UserJourneyTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startTime = useRef(Date.now());
  const lastActivity = useRef(Date.now());

  // Track page views
  useEffect(() => {
    trackEvent('page_view', {
      path: pathname,
      search: searchParams?.toString(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });

    startTime.current = Date.now();
  }, [pathname, searchParams]);

  // Track time on page when leaving
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - startTime.current;
      trackEvent('page_exit', {
        path: pathname,
        timeOnPage,
        scrollDepth: getScrollDepth()
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const timeOnPage = Date.now() - startTime.current;
        trackEvent('page_blur', {
          path: pathname,
          timeOnPage,
          scrollDepth: getScrollDepth()
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname]);

  // Track scroll depth
  useEffect(() => {
    let maxScrollDepth = 0;
    
    const handleScroll = () => {
      const scrollDepth = getScrollDepth();
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track milestone scroll depths
        if (scrollDepth >= 25 && maxScrollDepth < 25) {
          trackEvent('scroll_depth', { depth: 25, path: pathname });
        } else if (scrollDepth >= 50 && maxScrollDepth < 50) {
          trackEvent('scroll_depth', { depth: 50, path: pathname });
        } else if (scrollDepth >= 75 && maxScrollDepth < 75) {
          trackEvent('scroll_depth', { depth: 75, path: pathname });
        } else if (scrollDepth >= 90 && maxScrollDepth < 90) {
          trackEvent('scroll_depth', { depth: 90, path: pathname });
        }
      }
      
      lastActivity.current = Date.now();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Track user interactions
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const className = target.className;
      const id = target.id;
      const text = target.textContent?.slice(0, 100);

      // Track button clicks
      if (tagName === 'button' || target.closest('button')) {
        const button = tagName === 'button' ? target : target.closest('button');
        trackEvent('button_click', {
          buttonText: button?.textContent?.slice(0, 50),
          buttonId: button?.id,
          buttonClass: button?.className,
          path: pathname
        });
      }

      // Track link clicks
      if (tagName === 'a' || target.closest('a')) {
        const link = tagName === 'a' ? target as HTMLAnchorElement : target.closest('a');
        trackEvent('link_click', {
          href: link?.href,
          linkText: link?.textContent?.slice(0, 50),
          isExternal: link?.hostname !== window.location.hostname,
          path: pathname
        });
      }

      // Track form interactions
      if (['input', 'textarea', 'select'].includes(tagName)) {
        trackEvent('form_interaction', {
          fieldType: tagName,
          fieldName: (target as HTMLInputElement).name,
          fieldId: id,
          path: pathname
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  const trackEvent = async (event: string, properties: Record<string, any> = {}) => {
    const trackingData: TrackingEvent = {
      event,
      properties,
      timestamp: Date.now(),
      sessionId,
      userId,
      page: pathname
    };

    try {
      // Send to analytics API
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingData)
      });
    } catch (error) {
      // Fallback to localStorage for offline tracking
      const stored = localStorage.getItem('pending_analytics') || '[]';
      const pending = JSON.parse(stored);
      pending.push(trackingData);
      localStorage.setItem('pending_analytics', JSON.stringify(pending));
    }
  };

  const getScrollDepth = (): number => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  };

  return null; // This is a tracking component, no UI
}

// Hook for manual event tracking
export function useAnalytics(sessionId: string, userId?: string) {
  const pathname = usePathname();

  const track = async (event: string, properties: Record<string, any> = {}) => {
    const trackingData: TrackingEvent = {
      event,
      properties,
      timestamp: Date.now(),
      sessionId,
      userId,
      page: pathname
    };

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingData)
      });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  };

  // Common tracking functions
  const trackQuizStart = (quizSlug: string) => {
    track('quiz_start', { quizSlug });
  };

  const trackQuizComplete = (quizSlug: string, timeSpent: number, score?: number) => {
    track('quiz_complete', { quizSlug, timeSpent, score });
  };

  const trackArticleRead = (articleSlug: string, readTime: number, scrollDepth: number) => {
    track('article_read', { articleSlug, readTime, scrollDepth });
  };

  const trackSignup = (method: string) => {
    track('user_signup', { method });
  };

  const trackLogin = (method: string) => {
    track('user_login', { method });
  };

  return {
    track,
    trackQuizStart,
    trackQuizComplete,
    trackArticleRead,
    trackSignup,
    trackLogin
  };
}
