'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Brain, Heart, Zap, Target, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRewards } from '@/components/gamification/EngagementSystem';

interface Question {
  id: string;
  text: string;
  type: 'scale' | 'multiple-choice' | 'ranking';
  options?: string[];
  min?: number;
  max?: number;
  labels?: { [key: number]: string };
}

interface EnhancedQuizFlowProps {
  title: string;
  questions: Question[];
  onComplete: (answers: Record<string, any>) => void;
}

export function EnhancedQuizFlow({ title, questions, onComplete }: EnhancedQuizFlowProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const { rewardAction } = useRewards();

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  // Motivational messages based on progress
  useEffect(() => {
    const messages = [
      "Great start! 🚀",
      "You're doing amazing! 💪",
      "Keep going, you're on fire! 🔥",
      "Incredible insights! 🧠",
      "Almost there, champion! 🏆",
      "Final stretch! 🎯"
    ];
    const messageIndex = Math.floor((currentQuestion / questions.length) * messages.length);
    setMotivationalMessage(messages[messageIndex]);
  }, [currentQuestion, questions.length]);

  const handleAnswer = (value: any) => {
    setSelectedValue(value);
    setShowFeedback(true);
    
    // Reward points for answering
    rewardAction('quiz_answer', 5);
    
    // Auto-advance after feedback
    setTimeout(() => {
      setAnswers({ ...answers, [question.id]: value });
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedValue(null);
        setShowFeedback(false);
      } else {
        completeQuiz();
      }
    }, 1500);
  };

  const completeQuiz = () => {
    // Celebration animation
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6']
    });
    
    // Big reward for completion
    rewardAction('quiz_complete', 50);
    
    // Submit answers
    onComplete({ ...answers, [question.id]: selectedValue });
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">{question.labels?.[question.min!] || question.min}</span>
              <span className="text-sm text-gray-500">{question.labels?.[question.max!] || question.max}</span>
            </div>
            
            <div className="flex gap-2 justify-between">
              {Array.from({ length: (question.max! - question.min! + 1) }, (_, i) => i + question.min!).map((value) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(value)}
                  disabled={selectedValue !== null}
                  className={`
                    flex-1 aspect-square rounded-2xl font-bold text-lg transition-all
                    ${selectedValue === value 
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg scale-110' 
                      : 'bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-300'
                    }
                    ${selectedValue !== null && selectedValue !== value ? 'opacity-50' : ''}
                  `}
                >
                  {value}
                </motion.button>
              ))}
            </div>
          </div>
        );
        
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option)}
                disabled={selectedValue !== null}
                className={`
                  w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group
                  ${selectedValue === option 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-300'
                  }
                  ${selectedValue !== null && selectedValue !== option ? 'opacity-50' : ''}
                `}
              >
                <span className="font-medium">{option}</span>
                <ChevronRight className={`w-5 h-5 transition-transform ${selectedValue === option ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
              </motion.button>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm font-bold text-purple-600">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Quiz content */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          {/* Question header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                Self-Discovery
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {question.text}
            </h2>
            
            <p className="text-gray-600">
              Remember, there are no right or wrong answers. Choose what feels most authentic to you.
            </p>
          </div>

          {/* Question content */}
          {renderQuestion()}

          {/* Feedback message */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Great choice!</span>
                  <span className="text-green-600">{motivationalMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation hint */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Take your time to reflect on each question</p>
        </div>
      </div>
    </div>
  );
}
