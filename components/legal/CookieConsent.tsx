'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    // Check if Termly is loaded (external cookie consent solution)
    const termlyExists = document.querySelector('[src*="termly.io"]');
    
    // If Termly is present, don't show our custom banner
    if (termlyExists) {
      return;
    }
    
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }));

    // Set cookies based on preferences
    if (prefs.analytics) {
      // Enable analytics cookies
      document.cookie = 'analytics_enabled=true; path=/; max-age=31536000; SameSite=Lax';
    }
    
    if (prefs.marketing) {
      // Enable marketing cookies
      document.cookie = 'marketing_enabled=true; path=/; max-age=31536000; SameSite=Lax';
    }
    
    if (prefs.personalization) {
      // Enable personalization cookies
      document.cookie = 'personalization_enabled=true; path=/; max-age=31536000; SameSite=Lax';
    }

    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    savePreferences(allAccepted);
  };

  const acceptEssential = () => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
    });
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <Card className="mx-auto max-w-4xl border-0 shadow-2xl bg-white">
          <CardContent className="p-6">
            {!showSettings ? (
              // Main Banner
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    We value your privacy
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    We use cookies to enhance your browsing experience, analyze site usage, and assist in our research efforts. 
                    By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or learn more in our{' '}
                    <Link href="/cookie-policy" className="text-purple-600 hover:text-purple-700 underline">
                      Cookie Policy
                    </Link>.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={acceptAll}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Accept All Cookies
                    </Button>
                    
                    <Button
                      onClick={acceptEssential}
                      variant="outline"
                    >
                      Essential Only
                    </Button>
                    
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Customize
                    </Button>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowBanner(false)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              // Settings Panel
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cookie Preferences
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Essential Cookies */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Essential Cookies</h4>
                      <p className="text-sm text-gray-600">
                        Required for the website to function properly. These cannot be disabled.
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-6 bg-purple-600 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Analytics Cookies</h4>
                      <p className="text-sm text-gray-600">
                        Help us understand how visitors interact with our website by collecting anonymous information.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handlePreferenceChange('analytics', !preferences.analytics)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          preferences.analytics ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.analytics ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Marketing Cookies */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Marketing Cookies</h4>
                      <p className="text-sm text-gray-600">
                        Used to track visitors across websites to display relevant advertisements.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handlePreferenceChange('marketing', !preferences.marketing)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          preferences.marketing ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.marketing ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Personalization Cookies */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Personalization Cookies</h4>
                      <p className="text-sm text-gray-600">
                        Remember your preferences and settings to provide a personalized experience.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handlePreferenceChange('personalization', !preferences.personalization)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          preferences.personalization ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.personalization ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Link 
                    href="/cookie-policy" 
                    className="text-sm text-purple-600 hover:text-purple-700 underline"
                  >
                    Learn more about cookies
                  </Link>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => savePreferences(preferences)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
