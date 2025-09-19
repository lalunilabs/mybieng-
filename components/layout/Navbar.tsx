"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  // Keep navbar minimal and consistent across pages

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 supports-[backdrop-filter]:backdrop-blur border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group" aria-label="MyBeing Home">
            <span className="font-serif-brand text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
              MyBeing
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" aria-current={isActive('/') ? 'page' : undefined} className={`text-slate-900 hover:text-primary transition-colors font-medium text-sm relative group ${isActive('/') ? 'text-primary' : ''}`}>
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/blog" aria-current={isActive('/blog') ? 'page' : undefined} className={`text-slate-900 hover:text-primary transition-colors font-medium text-sm relative group ${isActive('/blog') ? 'text-primary' : ''}`}>
              Articles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/quizzes" aria-current={isActive('/quizzes') ? 'page' : undefined} className={`text-slate-900 hover:text-primary transition-colors font-medium text-sm relative group ${isActive('/quizzes') ? 'text-primary' : ''}`}>
              Quizzes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/research" aria-current={isActive('/research') ? 'page' : undefined} className={`text-slate-900 hover:text-primary transition-colors font-medium text-sm relative group ${isActive('/research') ? 'text-primary' : ''}`}>
              Research
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" aria-current={isActive('/about') ? 'page' : undefined} className={`text-slate-900 hover:text-primary transition-colors font-medium text-sm relative group ${isActive('/about') ? 'text-primary' : ''}`}>
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {/* CTA Button */}
            <PrimaryCTA
              href="/blog"
              size="sm"
              surface="navbar_desktop"
              variant="uiverse"
              className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Read Articles
            </PrimaryCTA>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-900 hover:text-primary transition-colors p-2 rounded-lg border border-gray-200 bg-white/70"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-purple-200/50 py-4"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                aria-current={isActive('/') ? 'page' : undefined}
                className={`text-gray-900 hover:text-primary transition-colors font-medium px-4 py-2 ${isActive('/') ? 'text-primary' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/blog" 
                aria-current={isActive('/blog') ? 'page' : undefined}
                className={`text-gray-900 hover:text-primary transition-colors font-medium px-4 py-2 ${isActive('/blog') ? 'text-primary' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Articles
              </Link>
              <Link 
                href="/quizzes" 
                aria-current={isActive('/quizzes') ? 'page' : undefined}
                className={`text-gray-900 hover:text-primary transition-colors font-medium px-4 py-2 ${isActive('/quizzes') ? 'text-primary' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Quizzes
              </Link>
              <Link 
                href="/research" 
                aria-current={isActive('/research') ? 'page' : undefined}
                className={`text-gray-900 hover:text-primary transition-colors font-medium px-4 py-2 ${isActive('/research') ? 'text-primary' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Research
              </Link>
              <Link 
                href="/about" 
                aria-current={isActive('/about') ? 'page' : undefined}
                className={`text-gray-900 hover:text-primary transition-colors font-medium px-4 py-2 ${isActive('/about') ? 'text-primary' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <div className="px-4 pt-2">
                <PrimaryCTA
                  href="/blog"
                  surface="navbar_mobile"
                  variant="uiverse"
                  className="w-full shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Read Articles
                </PrimaryCTA>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
