'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles,
  Save,
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Quiz, QuizQuestion } from '@/data/quizzes';
import { LinearProgress } from '@/components/ui/ProgressIndicator';
import { useToast } from '@/components/ui/Toast';
import { FadeIn, SlideIn } from '@/components/ui/MicroInteractions';
import { useQuizKeyboardShortcuts, ShortcutsHelp } from '@/components/ui/KeyboardShortcuts';
import { cn } from '@/lib/utils';

/**
 * Enhanced Quiz Experience
 * World-class quiz-taking with smooth animations, auto-save, keyboard shortcuts
 * Follows research-backed UX patterns for assessment tools
 */

interface QuizAnswer {
  questionId: string;
  value: number | string;
  category?: string;
}

interface EnhancedQuizExperienceProps {
  quiz: Quiz;
  sessionId: string;
  userId?: string;
  onComplete?: (result: any) => void;
}

type QuizState = 'intro' | 'taking' | 'submitting' | 'complete';

export function EnhancedQuizExperience({ 
  quiz, 
  sessionId, 
  userId,
  onComplete 
}: EnhancedQuizExperienceProps) {
  const [state, setState] = useState<QuizState>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const toast = useToast();

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);
  const isAnswered = Boolean(currentAnswer);

  // Keyboard shortcuts
  const { showHelper, setShowHelper, shortcuts } = useQuizKeyboardShortcuts({
    onNext: () => isAnswered && handleNext(),
    onPrevious: () => currentIndex > 0 && handlePrevious(),
    onSubmit: () => isLastQuestion && isAnswered && handleSubmit(),
    canGoNext: isAnswered,
    canGoPrevious: currentIndex > 0,
    enabled: state === 'taking'
  });

  const saveProgress = useCallback(async () => {
    try {
      await localStorage.setItem(`quiz_${quiz.slug}_${sessionId}`, JSON.stringify({
        answers,
        currentIndex,
        startTime,
        lastSaved: new Date().toISOString()
      }));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [answers, currentIndex, startTime, quiz.slug, sessionId]);

  // Auto-save progress
  useEffect(() => {
    if (state === 'taking' && answers.length > 0) {
      const timer = setTimeout(() => {
        saveProgress();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [answers, state, saveProgress]);

  const loadProgress = () => {
    try {
      const saved = localStorage.getItem(`quiz_${quiz.slug}_${sessionId}`);
      if (saved) {
        const data = JSON.parse(saved);
        setAnswers(data.answers || []);
        setCurrentIndex(data.currentIndex || 0);
        setStartTime(data.startTime || Date.now());
        setLastSaved(new Date(data.lastSaved));
        return true;
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
    return false;
  };

  const handleStartQuiz = () => {
    const hasProgress = loadProgress();
    if (hasProgress) {
      toast.info('Progress Restored', 'Continuing from where you left off');
    }
    setState('taking');
    if (!startTime) setStartTime(Date.now());
  };

  const handleAnswer = (value: number | string, category?: string) => {
    if (!currentQuestion) return;

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      value,
      category
    };

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });

    // Auto-advance after selection (with slight delay for feedback)
    if (quiz.autoAdvance !== false) {
      setTimeout(() => {
        if (!isLastQuestion) {
          handleNext();
        }
      }, 400);
    }
  };

  const handleNext = () => {
    if (!isAnswered) {
      toast.warning('Please select an answer', 'Choose an option to continue');
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isAnswered) {
      toast.warning('Complete your answer', 'Please answer the current question');
      return;
    }

    setState('submitting');

    try {
      const submission = {
        quizSlug: quiz.slug,
        answers,
        startTime,
        endTime: Date.now(),
        sessionId,
        userId,
        generateAI: true
      };

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const data = await response.json();
      setResult(data.data.result);
      setState('complete');
      
      // Clear saved progress
      localStorage.removeItem(`quiz_${quiz.slug}_${sessionId}`);
      
      toast.success('Quiz Complete!', 'Your results are ready');
      onComplete?.(data.data.result);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Submission Failed', 'Please try again or contact support');
      setState('taking');
    }
  };

  const handleRetake = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setResult(null);
    setStartTime(0);
    setState('intro');
    localStorage.removeItem(`quiz_${quiz.slug}_${sessionId}`);
  };

  // Intro Screen
  if (state === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <FadeIn className="max-w-2xl w-full">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl"
            >
              <Sparkles className="w-10 h-10" />
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {quiz.title}
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                {quiz.description}
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{totalQuestions} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>Auto-saved</span>
              </div>
              {quiz.estimatedTime && (
                <div className="flex items-center gap-2">
                  <span>~{quiz.estimatedTime} min</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 max-w-md mx-auto">
              <p className="font-medium mb-2">💡 Remember:</p>
              <p>There are no right or wrong answers. This is about understanding your patterns and tendencies.</p>
            </div>

            <Button
              onClick={handleStartQuiz}
              size="lg"
              className="group"
            >
              Begin Assessment
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-xs text-gray-400 mt-4">
              Press <kbd className="px-2 py-1 bg-white border rounded text-gray-600">?</kbd> anytime for keyboard shortcuts
            </p>
          </div>
        </FadeIn>
      </div>
    );
  }

  // Taking Quiz
  if (state === 'taking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Progress Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <LinearProgress current={currentIndex + 1} total={totalQuestions} />
            {lastSaved && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-400 mt-2 flex items-center gap-1"
              >
                <Save className="w-3 h-3" />
                Auto-saved {new Date(lastSaved).toLocaleTimeString()}
              </motion.p>
            )}
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Question */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  <span>Question {currentIndex + 1}</span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                  {currentQuestion.text}
                </h2>

                {currentQuestion.description && (
                  <p className="text-gray-600">
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options?.map((option, idx) => {
                  const optionValue = option;
                  const optionCategory = currentQuestion.optionCategories?.[idx];
                  const isSelected = currentAnswer?.value === optionValue;
                  
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleAnswer(optionValue, optionCategory)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={cn(
                        "w-full text-left p-5 rounded-xl border-2 transition-all duration-200",
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          isSelected
                            ? "border-indigo-500 bg-indigo-500"
                            : "border-gray-300"
                        )}>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              <CheckCircle className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className={cn(
                            "font-medium",
                            isSelected ? "text-indigo-900" : "text-gray-900"
                          )}>
                            {optionValue}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="group"
            >
              {isLastQuestion ? 'Complete' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <ShortcutsHelp
          shortcuts={shortcuts}
          isOpen={showHelper}
          onClose={() => setShowHelper(false)}
        />
      </div>
    );
  }

  // Submitting State
  if (state === 'submitting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <FadeIn className="text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
          >
            <Sparkles className="w-10 h-10" />
          </motion.div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Analyzing Your Responses
            </h2>
            <p className="text-gray-600">
              Creating your personalized insights...
            </p>
          </div>
        </FadeIn>
      </div>
    );
  }

  // Complete State (handled by parent component usually)
  return null;
}
