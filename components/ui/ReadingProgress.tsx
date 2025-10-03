'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Coffee, BookOpen } from 'lucide-react';

interface ReadingProgressProps {
  content: string;
  showTimeEstimate?: boolean;
}

export function ReadingProgress({ content, showTimeEstimate = true }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    // Calculate reading time (average 250 words per minute)
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 250);
    setReadingTime(minutes);

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      
      const scrollPercentage = (scrollTop / scrollableHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercentage)));
      
      // Make progress bar sticky after scrolling 100px
      setIsSticky(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [content]);

  const getReadingIcon = () => {
    if (readingTime <= 3) return <Coffee className="w-4 h-4" />;
    if (readingTime <= 10) return <BookOpen className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const getMotivationalMessage = () => {
    if (progress < 25) return "Just getting started";
    if (progress < 50) return "Good momentum—keep going";
    if (progress < 75) return "You're past the halfway point";
    if (progress < 95) return "Final section coming up";
    return "Well done";
  };

  return (
    <>
      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isSticky ? 1 : 0, y: isSticky ? 0 : -20 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="relative h-1 bg-gray-100">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 to-purple-500"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
        
        {showTimeEstimate && (
          <div className="px-4 py-2 flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              {getReadingIcon()}
              <span>{readingTime} min read</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium">{Math.round(progress)}% complete</span>
            </div>
            <div className="text-sm text-purple-600 font-medium">
              {getMotivationalMessage()}
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Spacer to prevent content jump when sticky */}
      {isSticky && showTimeEstimate && <div className="h-12" />}
    </>
  );
}

// Hook for tracking engagement
export function useEngagement() {
  const [engagementData, setEngagementData] = useState({
    timeOnPage: 0,
    scrollDepth: 0,
    clicks: 0,
    highlights: 0,
  });

  useEffect(() => {
    const startTime = Date.now();
    let maxScroll = 0;
    let clickCount = 0;

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / document.documentElement.scrollHeight) * 100;
      maxScroll = Math.max(maxScroll, scrollPercentage);
      setEngagementData(prev => ({ ...prev, scrollDepth: maxScroll }));
    };

    const handleClick = () => {
      clickCount++;
      setEngagementData(prev => ({ ...prev, clicks: clickCount }));
    };

    const handleBeforeUnload = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      setEngagementData(prev => ({ ...prev, timeOnPage: timeSpent }));
      
      // Track engagement analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'engagement', {
          time_on_page: timeSpent,
          scroll_depth: maxScroll,
          clicks: clickCount,
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Update time every second
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      setEngagementData(prev => ({ ...prev, timeOnPage: timeSpent }));
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(interval);
    };
  }, []);

  return engagementData;
}
