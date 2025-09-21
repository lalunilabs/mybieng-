import { useEffect } from 'react';

// Simple event tracking function
export function trackEvent(event: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // In production, this would integrate with Google Analytics, Mixpanel, etc.
    console.log('📊 Event tracked:', event, data);
    
    // Example: Google Analytics 4
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', event, data);
    }
    
    // Example: Custom analytics endpoint
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data, timestamp: Date.now() })
      }).catch(() => {}); // Silent fail for analytics
    }
  }
}

// Conversion events for tracking user journey
export const CONVERSION_EVENTS = {
  // Hero section conversions
  HERO_ASSESSMENT_CLICK: 'hero_assessment_click',
  HERO_ARTICLES_CLICK: 'hero_articles_click',

  // Featured content conversions
  FEATURED_QUIZ_CLICK: 'featured_quiz_click',
  FEATURED_ARTICLE_CLICK: 'featured_article_click',

  // Category conversions
  CATEGORY_QUIZ_CLICK: 'category_quiz_click',
  CATEGORY_ARTICLE_CLICK: 'category_article_click',

  // Fresh content conversions
  FRESH_QUIZ_CLICK: 'fresh_quiz_click',
  FRESH_ARTICLE_CLICK: 'fresh_article_click',

  // Toggle section conversions
  TOGGLE_QUIZ_CLICK: 'toggle_quiz_click',
  TOGGLE_ARTICLE_CLICK: 'toggle_article_click',

  // Newsletter conversions
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  NEWSLETTER_ERROR: 'newsletter_error',

  // Quiz conversions
  QUIZ_START: 'quiz_start',
  QUIZ_COMPLETE: 'quiz_complete',
  QUIZ_ABANDON: 'quiz_abandon',
  QUIZ_STEP_COMPLETE: 'quiz_step_complete',

  // Purchase conversions
  PREMIUM_CLICK: 'premium_click',
  PREMIUM_PURCHASE: 'premium_purchase',

  // Testimonial interactions
  TESTIMONIAL_CLICK: 'testimonial_click',

  // Social proof interactions
  SOCIAL_PROOF_CLICK: 'social_proof_click',

  // Urgency banner interactions
  URGENCY_BANNER_CLICK: 'urgency_banner_click'
} as const;

// Enhanced conversion tracking with specific data
export function trackConversion(event: string, data?: {
  cta_location?: string;
  cta_text?: string;
  quiz_name?: string;
  article_title?: string;
  user_id?: string;
  session_id?: string;
  conversion_value?: number;
  [key: string]: any;
}) {
  trackEvent(event, {
    event_type: 'conversion',
    conversion_funnel: 'homepage_to_conversion',
    ...data,
    timestamp: new Date().toISOString(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  });
}

// Hook for tracking page views
export function usePageTracking(pageName: string) {
  useEffect(() => {
    trackConversion('page_view', { page: pageName });
  }, [pageName]);
}

// Hook for tracking CTA clicks
export function useCTATracking(ctaName: string) {
  return {
    onClick: (location?: string) =>
      trackConversion('cta_click', { cta: ctaName, cta_location: location })
  };
}

// Hook for tracking quiz starts
export function useQuizTracking(quizName: string) {
  return {
    onStart: () => trackConversion(CONVERSION_EVENTS.QUIZ_START, { quiz: quizName }),
    onComplete: () => trackConversion(CONVERSION_EVENTS.QUIZ_COMPLETE, { quiz: quizName }),
    onAbandon: () => trackConversion(CONVERSION_EVENTS.QUIZ_ABANDON, { quiz: quizName })
  };
}

// Hook for tracking newsletter signups
export function useNewsletterTracking() {
  return {
    onSignup: () => trackConversion(CONVERSION_EVENTS.NEWSLETTER_SIGNUP),
    onError: (error: string) => trackConversion(CONVERSION_EVENTS.NEWSLETTER_ERROR, { error })
  };
}

// Conversion rate calculator
export function calculateConversionRate(events: Array<{ event: string; ts: string }>) {
  const totalVisitors = events.filter(e => e.event === 'page_view').length;
  const totalConversions = events.filter(e => e.event === CONVERSION_EVENTS.QUIZ_START).length;

  return totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;
}

// Funnel analysis
export function analyzeConversionFunnel(events: Array<{ event: string; ts: string }>) {
  const funnel = {
    homepage_views: events.filter(e => e.event === 'page_view').length,
    hero_clicks: events.filter(e => e.event === CONVERSION_EVENTS.HERO_ASSESSMENT_CLICK).length,
    quiz_starts: events.filter(e => e.event === CONVERSION_EVENTS.QUIZ_START).length,
    quiz_completions: events.filter(e => e.event === CONVERSION_EVENTS.QUIZ_COMPLETE).length,
    premium_clicks: events.filter(e => e.event === CONVERSION_EVENTS.PREMIUM_CLICK).length
  };

  return {
    ...funnel,
    hero_to_quiz_rate: funnel.homepage_views > 0 ? (funnel.hero_clicks / funnel.homepage_views) * 100 : 0,
    quiz_completion_rate: funnel.quiz_starts > 0 ? (funnel.quiz_completions / funnel.quiz_starts) * 100 : 0,
    overall_conversion_rate: funnel.homepage_views > 0 ? (funnel.premium_clicks / funnel.homepage_views) * 100 : 0
  };
}
