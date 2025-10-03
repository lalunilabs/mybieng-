"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogIn } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Articles' },
  { href: '/quizzes', label: 'Quizzes' },
  { href: '/research', label: 'Research' },
  { href: '/magazine-demo', label: 'Magazine' },
  { href: '/about', label: 'About' },
];

// Secondary navigation for specific sections
const secondaryNavItems = [
  { href: '/blog', label: 'Articles', parent: '/blog' },
  { href: '/quizzes', label: 'Assessments', parent: '/quizzes' },
  { href: '/research', label: 'Research', parent: '/research' },
];

interface OptimizedNavbarProps {
  showSecondaryNav?: boolean;
  currentSection?: string;
}

export function OptimizedNavbar({ showSecondaryNav = false, currentSection }: OptimizedNavbarProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Only show secondary nav when explicitly requested (not auto-detect)
  const shouldShowSecondaryNav = showSecondaryNav;

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const navLinkBase =
    'relative inline-flex items-center text-sm font-medium tracking-tight transition-all duration-200 group';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 supports-[backdrop-filter]:backdrop-blur-xl border-b border-slate-200/70 shadow-sm shadow-slate-900/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center md:grid md:grid-cols-[auto,1fr,auto] md:gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="MyBeing home">
            <div className="w-9 h-9 bg-gradient-to-tr from-purple-600 via-violet-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm shadow-purple-500/30 transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-semibold text-sm leading-none">MB</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-lg text-slate-900 group-hover:text-purple-600 transition-colors">
                MyBeing
              </span>
              <span className="hidden text-xs font-medium text-slate-500 md:block">
                Evidence-based self-discovery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center gap-10">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${navLinkBase} ${
                  isActive(item.href)
                    ? 'text-purple-600'
                    : 'text-slate-600 hover:text-purple-600 focus-visible:text-purple-600'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-purple-500 via-purple-500 to-pink-500"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="pointer-events-none absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-purple-200 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center justify-end gap-4">
            {session ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-purple-600 focus-visible:ring-2 focus-visible:ring-purple-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-purple-300"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-purple-600 focus-visible:ring-2 focus-visible:ring-purple-300"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/quizzes">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/40 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-purple-300"
                  >
                    Start Journey
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-purple-600 focus-visible:ring-2 focus-visible:ring-purple-300"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="md:hidden border-t border-slate-200 bg-white/95 supports-[backdrop-filter]:backdrop-blur-xl overflow-hidden"
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          <div className="py-4">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-base font-medium rounded-lg transition-all ${
                    isActive(item.href)
                      ? 'text-purple-600 bg-purple-50 border border-purple-100'
                      : 'text-slate-600 hover:text-purple-600 hover:bg-slate-100/70'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-3 mt-3">
                {session ? (
                  <div className="flex flex-col space-y-2">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-600 hover:text-purple-600 focus-visible:ring-2 focus-visible:ring-purple-300"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="w-full justify-start border-slate-200 text-slate-700 hover:bg-slate-100/70 focus-visible:ring-2 focus-visible:ring-purple-300"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-600 hover:text-purple-600 focus-visible:ring-2 focus-visible:ring-purple-300"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/quizzes" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/40 focus-visible:ring-2 focus-visible:ring-purple-300">
                        Start Journey
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Secondary Navigation Bar - Only show when explicitly requested */}
      {shouldShowSecondaryNav && (
        <div className="bg-white/95 supports-[backdrop-filter]:backdrop-blur-xl border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-12 gap-8">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative inline-flex items-center text-sm font-medium tracking-tight transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'text-purple-600'
                      : 'text-slate-600 hover:text-purple-600 focus-visible:text-purple-600'
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="secondary-navbar-indicator"
                      className="absolute -bottom-3 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-purple-500 via-purple-500 to-pink-500"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className="pointer-events-none absolute -bottom-3 left-0 right-0 h-0.5 rounded-full bg-purple-200 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
