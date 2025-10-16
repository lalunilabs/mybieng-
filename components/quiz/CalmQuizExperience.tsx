'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Clock,
  Heart,
  Sparkles,
  Pause,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Quiz, QuizQuestion } from '@/data/quizzes';
import { AdaptiveQuizResultsSystem, AdaptiveQuizResult } from '@/components/quiz/AdaptiveQuizResultsSystem';
import { QuizResultsAIChat } from '@/components/chat/QuizResultsAIChat';
import { designSystem } from '@/lib/design-system';

interface QuizAnswer {
  questionId: string;
  value: number | string;
  category?: string;
}

interface CalmQuizExperienceProps {
  quiz: Quiz;
  sessionId: string;
  userId?: string;
}

type QuizState = 'intro' | 'taking' | 'pause' | 'submitting' | 'results';

export function CalmQuizExperience({ quiz, sessionId, userId }: CalmQuizExperienceProps) {
  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [pauseTime, setPauseTime] = useState<number>(0);
  const [totalPauseTime, setTotalPauseTime] = useState<number>(0);
  const [result, setResult] = useState<AdaptiveQuizResult | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleStartQuiz = () => {
    setState('taking');
    setStartTime(Date.now());
  };

  const handlePause = () => {
    if (state === 'taking') {
      setState('pause');
      setPauseTime(Date.now());
    } else if (state === 'pause') {
      setState('taking');
      setTotalPauseTime(prev => prev + (Date.now() - pauseTime));
    }
  };

  const handleAnswer = (value: number | string, category?: string) => {
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      value,
      category
    };

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setState('submitting');

    try {
      const actualEndTime = state === 'pause' ? pauseTime : Date.now();
      const submission = {
        quizSlug: quiz.slug,
        answers,
        startTime,
        endTime: actualEndTime,
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
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      setResult(data.data.result);
      setState('results');
    } catch (error) {
      console.error('Quiz submission error:', error);
      // Handle error gracefully
    }
  };

  const handleRetakeQuiz = () => {
    setState('intro');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setTotalPauseTime(0);
    setIsChatOpen(false);
  };

  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === currentQuestion.id);
  };

  const isAnswered = () => {
    return getCurrentAnswer() !== undefined;
  };

  // Intro State - Calm and inviting
  if (state === 'intro') {
    return (
      <div className={`min-h-screen ${designSystem.gradients.page} flex items-center justify-center p-6`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-center space-y-8"
        >
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {quiz.title}
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
              {quiz.description}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Duration</div>
                <div className="font-semibold text-gray-900">~{Math.ceil(quiz.questions.length * 0.5)} minutes</div>
              </div>
              <div>
                <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Questions</div>
                <div className="font-semibold text-gray-900">{quiz.questions.length} thoughtful</div>
              </div>
              <div>
                <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Approach</div>
                <div className="font-semibold text-gray-900">Self-discovery</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Take your time. There are no right or wrong answers—only insights waiting to be discovered.
            </p>
            
            <Button 
              onClick={handleStartQuiz}
              size="lg"
              className={`${designSystem.components.button.base} bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Pause State
  if (state === 'pause') {
    return (
      <div className={`min-h-screen ${designSystem.gradients.page} flex items-center justify-center p-6`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center space-y-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Pause className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Take a Moment</h2>
            <p className="text-gray-600">
              You're on question {currentQuestionIndex + 1} of {quiz.questions.length}. 
              Ready to continue when you are.
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <Button 
            onClick={handlePause}
            size="lg"
            className={`${designSystem.components.button.base} bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full`}
          >
            <Play className="w-5 h-5 mr-2" />
            Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  // Taking Quiz State - One question at a time, calm design
  if (state === 'taking') {
    return (
      <div className={`min-h-screen ${designSystem.gradients.page} flex items-center justify-center p-6`}>
        <div className="w-full max-w-3xl">
          {/* Progress and Controls */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePause}
                className="text-gray-600 hover:text-purple-600"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/20 rounded-3xl overflow-hidden">
                <CardContent className="p-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 leading-relaxed text-center">
                    {currentQuestion.text}
                  </h2>

                  <CalmQuestionInput
                    question={currentQuestion}
                    currentAnswer={getCurrentAnswer()}
                    onAnswer={handleAnswer}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="text-gray-600 hover:text-purple-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isAnswered()}
              className={`${designSystem.components.button.base} bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLastQuestion ? 'Complete Journey' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Submitting State
  if (state === 'submitting') {
    return (
      <div className={`min-h-screen ${designSystem.gradients.page} flex items-center justify-center p-6`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Discovering Your Patterns
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              We're analyzing your responses and creating personalized insights just for you...
            </p>
          </div>
          
          <div className="w-64 mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Results State
  if (state === 'results' && result) {
    return (
      <>
        <AdaptiveQuizResultsSystem
          result={result}
          onRetake={handleRetakeQuiz}
          onStartChat={() => setIsChatOpen(true)}
        />
        
        <QuizResultsAIChat
          result={result}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </>
    );
  }

  return null;
}

// Calm Question Input Component
interface CalmQuestionInputProps {
  question: QuizQuestion;
  currentAnswer?: QuizAnswer;
  onAnswer: (value: number | string, category?: string) => void;
}

function CalmQuestionInput({ question, currentAnswer, onAnswer }: CalmQuestionInputProps) {
  if (question.type === 'likert') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
          <span className="font-medium">Strongly Disagree</span>
          <span className="font-medium">Strongly Agree</span>
        </div>
        
        <div className="flex items-center justify-center gap-6">
          {[1, 2, 3, 4, 5].map((value) => (
            <motion.button
              key={value}
              onClick={() => onAnswer(value)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`w-16 h-16 rounded-full border-2 transition-all duration-200 font-semibold ${
                currentAnswer?.value === value
                  ? 'border-purple-600 bg-purple-600 text-white shadow-lg'
                  : 'border-gray-300 hover:border-purple-400 text-gray-700 hover:bg-purple-50'
              }`}
            >
              {value}
            </motion.button>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    );
  }

  if (question.type === 'multiple_choice' && question.options) {
    return (
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => onAnswer(index, question.optionCategories?.[index])}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
              currentAnswer?.value === index
                ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-lg'
                : 'border-gray-200 hover:border-purple-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                currentAnswer?.value === index
                  ? 'border-purple-600 bg-purple-600'
                  : 'border-gray-300'
              }`}>
                {currentAnswer?.value === index && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="text-lg">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>
    );
  }

  if (question.type === 'yes_no') {
    return (
      <div className="flex items-center justify-center gap-8">
        {['Yes', 'No'].map((option, index) => (
          <motion.button
            key={option}
            onClick={() => onAnswer(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-12 py-6 rounded-2xl border-2 transition-all duration-200 text-lg font-semibold ${
              currentAnswer?.value === index
                ? 'border-purple-600 bg-purple-600 text-white shadow-lg'
                : 'border-gray-300 hover:border-purple-400 text-gray-700 hover:bg-purple-50'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    );
  }

  return null;
}
