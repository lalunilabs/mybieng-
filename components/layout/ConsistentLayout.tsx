'use client';

import { ReactNode } from 'react';
import { NavbarWrapper } from './NavbarWrapper';
import Footer from '@/components/Footer';
import { CookieConsent } from '@/components/legal/CookieConsent';
import { CookiePreferencesButton } from '@/components/legal/CookiePreferencesButton';

interface ConsistentLayoutProps {
  children: ReactNode;
  className?: string;
  showFooter?: boolean;
  fullWidth?: boolean;
}

export function ConsistentLayout({ 
  children, 
  className = '', 
  showFooter = true,
  fullWidth = false 
}: ConsistentLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Always present navbar */}
      <NavbarWrapper />
      
      {/* Main content with consistent padding */}
      <main 
        className={`flex-1 pt-16 ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} ${className}`}
        role="main"
      >
        {children}
      </main>
      
      {/* Footer (optional) */}
      {showFooter && <Footer />}
      
      {/* Legal compliance components */}
      <CookieConsent />
      <CookiePreferencesButton />
    </div>
  );
}
