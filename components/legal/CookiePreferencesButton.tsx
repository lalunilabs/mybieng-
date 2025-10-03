'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings } from 'lucide-react';

export function CookiePreferencesButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Check if Termly is loaded and user has interacted with cookies
    const checkTermlyStatus = () => {
      const termlyExists = document.querySelector('[src*="termly.io"]');
      const hasConsent = localStorage.getItem('cookie-consent') || 
                        localStorage.getItem('termly-uuid') ||
                        document.cookie.includes('termly');
      
      // Show button if Termly exists and user has previously given consent
      if (termlyExists && hasConsent) {
        setShowButton(true);
      }
    };

    // Check immediately and after a delay to ensure Termly has loaded
    checkTermlyStatus();
    const timer = setTimeout(checkTermlyStatus, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showButton) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-4 left-4 z-40"
      >
        <a
          href="#"
          className="termly-display-preferences flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium text-gray-700 hover:text-purple-600 hover:border-purple-300"
          title="Manage Cookie Preferences"
        >
          <Cookie className="w-4 h-4" />
          <span className="hidden sm:inline">Cookie Preferences</span>
          <Settings className="w-3 h-3 opacity-60" />
        </a>
      </motion.div>
    </AnimatePresence>
  );
}
