'use client';

import { useState, useEffect, useCallback } from 'react';

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
    const hasShownModal = localStorage.getItem('newsletter-modal-shown');
    const hasSubscribed = localStorage.getItem('newsletter-subscribed');
    
    if (hasShownModal || hasSubscribed) return;

    const timer = setTimeout(() => {
      if (engagement.hasScrolled && engagement.hasInteracted) {
        setShowNewsletterModal(true);
        localStorage.setItem('newsletter-modal-shown', 'true');
      }
    }, 600000); // 10 minutes

    return () => clearTimeout(timer);
  }, [engagement.hasScrolled, engagement.hasInteracted]);

  const closeNewsletterModal = useCallback(() => {
    setShowNewsletterModal(false);
  }, []);

  const markSubscribed = useCallback(() => {
    localStorage.setItem('newsletter-subscribed', 'true');
    setShowNewsletterModal(false);
  }, []);

  return {
    engagement,
    showNewsletterModal,
    closeNewsletterModal,
    markSubscribed,
  };
}
