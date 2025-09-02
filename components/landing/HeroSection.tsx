'use client';

import { motion } from 'framer-motion';
import { Search, Lightbulb, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-purple-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 lg:pr-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-yellow-100 text-black rounded-full text-sm font-medium"
              >
                ✨ Research-backed self-discovery
              </motion.div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight">
                Understand your
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  patterns
                </span>
              </h1>
              
              <p className="text-xl text-black leading-relaxed max-w-lg">
                Discover yourself through scientifically-backed quizzes and personalized insights. Track your growth and unlock your potential.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/quizzes" className="flex items-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-purple-600 text-black hover:bg-yellow-50 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/blog">
                  Explore Insights
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Realistic iPad Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative flex justify-center items-center perspective-1000"
          >
            {/* iPad Pro Mockup */}
            <div className="relative transform-gpu">
              {/* iPad Shadow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-[3rem] blur-2xl opacity-30"></div>
              
              {/* iPad Body */}
              <div className="relative w-80 h-[500px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                {/* Screen Bezel */}
                <div className="w-full h-full bg-black rounded-[2rem] p-3">
                  {/* Screen */}
                  <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden relative shadow-inner">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">mybeing.com</div>
                      <div className="text-xs text-gray-400">100%</div>
                    </div>
                    
                    {/* App Content */}
                    <div className="p-4 h-full bg-gradient-to-br from-purple-50 to-pink-50">
                      {/* Header */}
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                          <span className="text-white text-lg">🧠</span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800">Cognitive Patterns</h3>
                        <p className="text-xs text-gray-600">Quiz Results</p>
                      </div>
                      
                      {/* Progress Cards */}
                      <div className="space-y-3">
                        <motion.div 
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                          className="bg-white rounded-xl p-3 shadow-sm border border-purple-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Search className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-gray-800">Pattern Recognition</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div className="bg-purple-500 h-1.5 rounded-full" style={{width: '75%'}}></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="bg-white rounded-xl p-3 shadow-sm border border-blue-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Lightbulb className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-gray-800">Insight Discovery</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '60%'}}></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          className="bg-white rounded-xl p-3 shadow-sm border border-green-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-gray-800">Growth Tracking</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{width: '85%'}}></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Bottom CTA */}
                      <div className="mt-6 text-center">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium py-2 px-4 rounded-lg">
                          Continue Journey →
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-xl"
              >
                <span className="text-white text-lg">✨</span>
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, 12, 0],
                  rotate: [0, -8, 0]
                }}
                transition={{ 
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -top-2 -right-8 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-xl"
              >
                <span className="text-white text-sm">🧠</span>
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  x: [0, 8, 0]
                }}
                transition={{ 
                  duration: 3.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="absolute -bottom-4 -right-6 w-14 h-14 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-xl"
              >
                <span className="text-white text-lg">📊</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

