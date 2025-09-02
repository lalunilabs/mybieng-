'use client';

import Link from 'next/link';
import { Button } from './ui/Button';

export default function NavBar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Text-only brand */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-purple-600">Mybeing</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-12">
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Home</Link>
              <Link href="/quizzes" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Quizzes</Link>
              <Link href="/blog" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Blog</Link>
              <Link href="/research" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Research</Link>
            </div>

            {/* Start Free */}
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium"
              asChild
            >
              <Link href="/quizzes">Start Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
