'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import { Menu, X, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-purple-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold text-black group-hover:text-purple-700 transition-colors">
              MyBeing
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-black hover:text-purple-600 transition-colors font-medium text-sm relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="text-black hover:text-purple-600 transition-colors font-medium text-sm relative group">
              About Dr N
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/quizzes" className="text-black hover:text-purple-600 transition-colors font-medium text-sm relative group">
              Quizzes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/blog" className="text-black hover:text-purple-600 transition-colors font-medium text-sm relative group">
              Articles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/research" className="text-black hover:text-purple-600 transition-colors font-medium text-sm relative group">
              Research
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/reports" className="text-black hover:text-purple-600 transition-colors font-medium text-sm relative group">
              Reports
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            {/* User Menu or CTA Button */}
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/bookmarks" className="text-black hover:text-purple-600 transition-colors font-medium text-sm relative group">
                  Bookmarks
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link href="/dashboard" className="flex items-center text-black hover:text-purple-600 transition-colors">
                  <User className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
              </div>
            ) : (
              <PrimaryCTA
                href="/blog"
                size="sm"
                surface="navbar_desktop"
                variant="uiverse"
                className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Start for Free
              </PrimaryCTA>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black hover:text-purple-600 transition-colors p-2"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
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
                className="text-black hover:text-purple-600 transition-colors font-medium px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-black hover:text-purple-600 transition-colors font-medium px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                About Dr N
              </Link>
              <Link 
                href="/quizzes" 
                className="text-black hover:text-purple-600 transition-colors font-medium px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Quizzes
              </Link>
              <Link 
                href="/blog" 
                className="text-black hover:text-purple-600 transition-colors font-medium px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Articles
              </Link>
              <Link 
                href="/research" 
                className="text-black hover:text-purple-600 transition-colors font-medium px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Research
              </Link>
              <Link 
                href="/reports" 
                className="text-black hover:text-purple-600 transition-colors font-medium px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Reports
              </Link>
              
              {session ? (
                <>
                  <Link 
                    href="/bookmarks" 
                    className="text-black hover:text-purple-600 transition-colors font-medium px-4 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Bookmarks
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center text-black hover:text-purple-600 transition-colors font-medium px-4 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Dashboard
                  </Link>
                </>
              ) : (
                <div className="px-4 pt-2">
                  <PrimaryCTA
                    href="/blog"
                    surface="navbar_mobile"
                    variant="uiverse"
                    className="w-full shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Start for Free
                  </PrimaryCTA>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
