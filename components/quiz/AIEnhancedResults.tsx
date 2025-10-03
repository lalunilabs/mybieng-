'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, MessageCircle, TrendingUp, Target, Lightbulb, Calendar, Share2, Download, Sparkles } from 'lucide-react';

interface QuizResult {
  primaryPattern: string;
  patternScore: number;
  secondaryPatterns: string[];
  insights: string[];
  recommendations: string[];
  triggers: string[];
  nextSteps: string[];
}

interface AIEnhancedResultsProps {
  quizId: string;
  userId: string;
  results: QuizResult;
  onStartAIChat: () => void;
  onScheduleCheckIn: () => void;
  onShareResults: () => void;
}

export function AIEnhancedResults({
  quizId,
  userId,
  results,
  onStartAIChat,
  onScheduleCheckIn,
  onShareResults
}: AIEnhancedResultsProps) {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => setAiAnalyzing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const patternColors = {
    'instant_justification': 'from-red-500 to-pink-500',
    'gradual_belief_shift': 'from-blue-500 to-indigo-500',
    'selective_evidence': 'from-green-500 to-teal-500',
    'identity_protection': 'from-purple-500 to-violet-500',
    'social_reality_distortion': 'from-orange-500 to-amber-500'
  };

  const getPatternColor = (pattern: string) => {
    const key = pattern.toLowerCase().replace(/\s+/g, '_');
    return patternColors[key as keyof typeof patternColors] || 'from-gray-500 to-slate-500';
  };

  if (aiAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <Brain className="w-full h-full text-indigo-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Analyzing Your Patterns</h2>
          <p className="text-gray-600">Generating personalized insights based on your responses...</p>
          <motion.div
            className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden"
            initial={{ width: 0 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
              AI-Powered Analysis Complete
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Mental Tug of War Pattern
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on your responses, our AI has identified your primary cognitive dissonance pattern 
            and created a personalized action plan for alignment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Primary Pattern */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getPatternColor(results.primaryPattern)} flex items-center justify-center`}>
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {results.primaryPattern.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h2>
                  <p className="text-gray-600">Your Primary Pattern</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Pattern Strength</span>
                  <span className="text-sm font-bold text-gray-900">{results.patternScore}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getPatternColor(results.primaryPattern)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${results.patternScore}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Key Insights
                  </h3>
                  <ul className="space-y-2">
                    {results.insights.slice(0, 3).map((insight, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Common Triggers
                  </h3>
                  <ul className="space-y-2">
                    {results.triggers.slice(0, 3).map((trigger, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        {trigger}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Brain className="w-7 h-7 text-indigo-600" />
                AI-Personalized Action Plan
              </h2>

              <div className="space-y-6">
                {results.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl"
                  >
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium mb-2">
                        {recommendation.split(':')[0]}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {recommendation.split(':').slice(1).join(':')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Secondary Patterns */}
            {results.secondaryPatterns.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Secondary Patterns</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.secondaryPatterns.map((pattern, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl"
                    >
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPatternColor(pattern)}`} />
                      <span className="text-gray-700 font-medium">
                        {pattern.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* AI Chat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 text-white"
            >
              <MessageCircle className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">Chat with AI</h3>
              <p className="text-indigo-100 mb-4 text-sm">
                Ask questions about your results, get deeper insights, and receive personalized guidance.
              </p>
              <button
                onClick={onStartAIChat}
                className="w-full bg-white text-indigo-600 font-semibold py-3 px-4 rounded-2xl hover:bg-indigo-50 transition-colors"
              >
                Start Conversation
              </button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={onScheduleCheckIn}
                  className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-2xl hover:bg-green-100 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Daily Check-ins
                </button>
                
                <button
                  onClick={onShareResults}
                  className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share Insights
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-2xl hover:bg-purple-100 transition-colors">
                  <Download className="w-5 h-5" />
                  Download Report
                </button>
              </div>
            </motion.div>

            {/* Progress Tracking */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Track Your Progress</h3>
              <p className="text-gray-600 text-sm mb-4">
                Set up daily micro check-ins to track your pattern evolution over time.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Daily Check-ins</span>
                  <span className="text-sm font-medium text-gray-900">Not started</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Weekly Reviews</span>
                  <span className="text-sm font-medium text-gray-900">Available</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monthly Analysis</span>
                  <span className="text-sm font-medium text-gray-900">Premium</span>
                </div>
              </div>
            </motion.div>

            {/* Related Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Reading</h3>
              <div className="space-y-3">
                <a href="/blog/mental-tug-of-war-complete-guide" className="block p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Understanding Your Pattern
                  </h4>
                  <p className="text-xs text-gray-600">
                    Deep dive into {results.primaryPattern.replace(/_/g, ' ')} patterns
                  </p>
                </a>
                
                <a href="/blog/personal-health-environment-guide" className="block p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Building Your PHE
                  </h4>
                  <p className="text-xs text-gray-600">
                    Create your Personal Health Environment
                  </p>
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Your Journey Starts Now</h2>
          <p className="text-indigo-100 mb-6 text-lg">
            Understanding your pattern is just the beginning. Take the next step in your Personal Health Environment journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Start Daily Check-ins</h3>
              <p className="text-sm text-indigo-100">Track your patterns with 2-minute daily assessments</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Chat with AI</h3>
              <p className="text-sm text-indigo-100">Get personalized guidance and deeper insights</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Build Your PHE</h3>
              <p className="text-sm text-indigo-100">Create your complete Personal Health Environment</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
