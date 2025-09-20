'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Brain, 
  TrendingUp, 
  Award, 
  Share2, 
  Download,
  Sparkles,
  Heart,
  Target,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface QuizResultsProps {
  results: {
    answers: Record<string, any>;
    patterns: string[];
    insights: string[];
    recommendations: string[];
    mindfulnessScore?: number;
  };
  quiz: {
    title: string;
    category: string;
  };
  onStartAIChat: () => void;
}

export function QuizResultsWithAI({ results, quiz, onStartAIChat }: QuizResultsProps) {
  const [showDetailedInsights, setShowDetailedInsights] = useState(false);

  const patternCards = [
    {
      title: "Cognitive Patterns",
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      insights: results.patterns.slice(0, 2)
    },
    {
      title: "Behavioral Insights", 
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      insights: results.insights.slice(0, 2)
    },
    {
      title: "Growth Areas",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500", 
      insights: results.recommendations.slice(0, 2)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-yellow-600" />
          </div>
          
          <h1 className="text-4xl font-bold mb-2">Your {quiz.title} Results</h1>
          <p className="text-gray-600 text-lg">Discover your unique patterns and insights</p>
          
          {results.mindfulnessScore && (
            <div className="mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Mindfulness Score: {results.mindfulnessScore}%
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Pattern Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {patternCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                
                <div className="space-y-2">
                  {card.insights.map((insight, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Chat Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="p-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Chat with Your Inner Guide</h3>
                  <p className="text-purple-100">
                    Ask questions about your results, explore patterns deeper, and get personalized guidance
                  </p>
                </div>
              </div>
              <Button 
                onClick={onStartAIChat}
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-2xl"
              >
                Start Chat
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Detailed Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Detailed Analysis</h3>
              <Button
                onClick={() => setShowDetailedInsights(!showDetailedInsights)}
                variant="outline"
                className="rounded-2xl"
              >
                {showDetailedInsights ? 'Hide' : 'Show'} Details
              </Button>
            </div>

            {showDetailedInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-600" />
                    All Patterns Detected
                  </h4>
                  <div className="grid gap-2">
                    {results.patterns.map((pattern, i) => (
                      <div key={i} className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-gray-800">{pattern}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Behavioral Insights
                  </h4>
                  <div className="grid gap-2">
                    {results.insights.map((insight, i) => (
                      <div key={i} className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-gray-800">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                    Recommendations
                  </h4>
                  <div className="grid gap-2">
                    {results.recommendations.map((rec, i) => (
                      <div key={i} className="bg-green-50 p-3 rounded-lg">
                        <p className="text-gray-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center mt-8 mb-8"
        >
          <Button 
            onClick={onStartAIChat}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl px-6 py-3"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat About Results
          </Button>
          
          <Button variant="outline" className="rounded-2xl px-6 py-3">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          
          <Button variant="outline" className="rounded-2xl px-6 py-3">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          
          <Button variant="outline" className="rounded-2xl px-6 py-3">
            <BookOpen className="w-4 h-4 mr-2" />
            Related Articles
          </Button>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-0">
            <Heart className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Continue Your Journey</h3>
            <p className="text-gray-600 mb-4">
              Take weekly check-ins to track your progress and discover new patterns
            </p>
            <Button className="bg-purple-600 text-white rounded-2xl">
              Schedule Check-ins
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
