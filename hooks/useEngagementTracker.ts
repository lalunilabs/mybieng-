'use client';

import { useState, useEffect, useCallback } from 'react';

// Newsletter prompt config
const PROMPT_DELAY_MS = 600000; // 10 minutes
const SNOOZE_DAYS = 14; // Biweekly
const MS_IN_DAY = 24 * 60 * 60 * 1000;
const LAST_PROMPT_KEY = 'newsletter-last-prompt-at';
const LEGACY_SHOWN_KEY = 'newsletter-modal-shown';
const SUBSCRIBED_KEY = 'newsletter-subscribed';

interface EngagementData {
  startTime: number;
  pageViews: number;
  timeOnSite: number;
  hasScrolled: boolean;
  hasInteracted: boolean;
}

export function useEngagementTracker() {
  const [engagement, setEngagement] = useState<EngagementData>({
    startTime: Date.now(),
    pageViews: 1,
    timeOnSite: 0,
    hasScrolled: false,
    hasInteracted: false,
  });

  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  // Track time on site
  useEffect(() => {
    const interval = setInterval(() => {
      setEngagement(prev => ({
        ...prev,
        timeOnSite: Date.now() - prev.startTime,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setEngagement(prev => ({ ...prev, hasScrolled: true }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track interactions
  useEffect(() => {
    const handleInteraction = () => {
      setEngagement(prev => ({ ...prev, hasInteracted: true }));
    };

    const events = ['click', 'keydown', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  // Newsletter modal trigger (10 minutes = 600,000ms)
  useEffect(() => {
    try {
      // Respect subscription state
      const hasSubscribed = localStorage.getItem(SUBSCRIBED_KEY) === 'true';
      if (hasSubscribed) return;

      // Migrate legacy one-time flag to timestamp-based system
      const legacyShown = localStorage.getItem(LEGACY_SHOWN_KEY);
      const existingLastPrompt = localStorage.getItem(LAST_PROMPT_KEY);
      if (legacyShown && !existingLastPrompt) {
        localStorage.setItem(LAST_PROMPT_KEY, String(Date.now()));
        localStorage.removeItem(LEGACY_SHOWN_KEY);
      }

      const lastPromptAt = parseInt(localStorage.getItem(LAST_PROMPT_KEY) || '0', 10);
      const now = Date.now();
      const eligible = !lastPromptAt || (now - lastPromptAt) >= (SNOOZE_DAYS * MS_IN_DAY);
      if (!eligible) return;

      if (!(engagement.hasScrolled && engagement.hasInteracted)) return;

      const timer = setTimeout(() => {
        setShowNewsletterModal(true);
        try {
          localStorage.setItem(LAST_PROMPT_KEY, String(Date.now()));
        } catch {}
      }, PROMPT_DELAY_MS);

      return () => clearTimeout(timer);
    } catch {
      // If localStorage is unavailable, fail silently
    }
  }, [engagement.hasScrolled, engagement.hasInteracted]);

  const closeNewsletterModal = useCallback(() => {
    try {
      // Snooze reminders for 14 days from dismissal
      localStorage.setItem(LAST_PROMPT_KEY, String(Date.now()));
    } catch {}
    setShowNewsletterModal(false);
  }, []);

  const markSubscribed = useCallback(() => {
    localStorage.setItem(SUBSCRIBED_KEY, 'true');
    setShowNewsletterModal(false);
  }, []);

  return {
    engagement,
    showNewsletterModal,
    closeNewsletterModal,
    markSubscribed,
  };
}
