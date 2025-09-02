"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-200/50 shadow-lg">
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
            <Link href="/blog" className="text-black hover:text-purple-600 transition-colors font-medium text-sm relative group">
              Articles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/quizzes" className="text-black hover:text-purple-600 transition-colors font-medium text-sm relative group">
              Quizzes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/research" className="text-black hover:text-purple-600 transition-colors font-medium text-sm relative group">
              Research
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="text-black hover:text-purple-600 transition-colors font-medium text-sm relative group">
              About Dr N
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            {/* CTA Button */}
            <Button 
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/quizzes">Start for Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
