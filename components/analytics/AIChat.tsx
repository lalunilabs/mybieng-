'use client';

import { useEffect } from 'react';
import { trackAIChatStart, trackAIChatMessage } from '@/lib/analytics/gtag';

interface AIChatAnalyticsProps {
  sessionId: string;
  context?: string;
  onMessageSent?: (type: 'user' | 'assistant') => void;
}

export function AIChatAnalytics({ sessionId, context, onMessageSent }: AIChatAnalyticsProps) {
  useEffect(() => {
    // Track AI chat session start
    trackAIChatStart(sessionId, context || 'general');
  }, [sessionId, context]);

  // This component is for tracking only, message tracking is handled by the hook

  return null; // This is a tracking component with no UI
}

// Hook for tracking AI chat interactions
export function useAIChatTracking(sessionId: string, context?: string) {
  useEffect(() => {
    trackAIChatStart(sessionId, context || 'general');
  }, [sessionId, context]);

  const trackMessage = (type: 'user' | 'assistant') => {
    trackAIChatMessage(sessionId, type);
  };

  return { trackMessage };
}
