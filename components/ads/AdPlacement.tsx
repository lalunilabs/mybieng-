'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdPlacementProps {
  position: 'article-sidebar' | 'quiz-result' | 'home-subtle';
  className?: string;
  adId: string;
}

// Strategic ad placement component that maintains aesthetics
export function AdPlacement({ position, className = '', adId }: AdPlacementProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // Track user engagement before showing ads
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasUserInteracted(true);
    }, position === 'home-subtle' ? 5000 : 3000); // Delay ads on homepage
    
    return () => clearTimeout(timer);
  }, [position]);

  if (!isVisible || !hasUserInteracted) return null;

  const getAdStyles = () => {
    switch (position) {
      case 'home-subtle':
        return 'max-w-xs mx-auto bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-100/50 shadow-sm';
      case 'article-sidebar':
        return 'sticky top-24 bg-white rounded-xl p-4 border border-gray-100 shadow-sm w-80 max-w-sm';
      case 'quiz-result':
        return 'mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100/50';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`relative ${getAdStyles()} ${className}`}
        >
          {/* Subtle close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Close ad"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
          
          {/* Ad label - very subtle */}
          <div className="absolute top-2 left-2 text-[10px] text-gray-400 font-medium">
            AD
          </div>
          
          {/* Ad content placeholder */}
          <div className="ad-container" data-ad-id={adId}>
            {/* Google AdSense or other ad network code would go here */}
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              <div className="text-center">
                <p className="font-medium mb-1">Support MyBeing</p>
                <p className="text-xs">Quality content, minimal ads</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Ad configuration for different pages - NO ADS ON HOMEPAGE, SIDEBAR ONLY
export const AD_PLACEMENTS = {
  home: {
    maxAds: 0, // NO ADS on homepage/landing
    positions: [] as const,
    showAfterScroll: 100, // Never show
  },
  article: {
    maxAds: 1, // Only sidebar ads
    positions: ['article-sidebar'] as const,
    showAfterRead: 30, // Show after 30% read to not annoy readers
  },
  quiz: {
    maxAds: 1,
    positions: ['quiz-result'] as const,
    showOnCompletion: true,
  },
  general: {
    maxAds: 0, // No general ads to avoid middle placement
    positions: [] as const,
    spacing: 'generous',
  },
};

// Helper hook for smart ad insertion
export function useSmartAds(pageType: keyof typeof AD_PLACEMENTS) {
  const [shouldShowAd, setShouldShowAd] = useState(false);
  const config = AD_PLACEMENTS[pageType];
  
  useEffect(() => {
    if (pageType === 'home' && 'showAfterScroll' in config) {
      const handleScroll = () => {
        const scrollPercentage = (window.scrollY / document.documentElement.scrollHeight) * 100;
        if (scrollPercentage > config.showAfterScroll) {
          setShouldShowAd(true);
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [pageType, config]);
  
  return { shouldShowAd, config };
}
