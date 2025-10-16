'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Clock,
  Users,
  Target,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Quiz, QuizQuestion } from '@/data/quizzes';
import { AdaptiveQuizResultsSystem, AdaptiveQuizResult } from '@/components/quiz/AdaptiveQuizResultsSystem';
import { QuizResultsAIChat } from '@/components/chat/QuizResultsAIChat';
import { AnimatedSection, TextReveal, FloatingElement } from '@/components/animations/PremiumAnimations';

interface QuizAnswer {
  questionId: string;
  value: number | string;
  category?: string;
}

interface EnhancedQuizPageProps {
  quiz: Quiz;
  sessionId: string;
  userId?: string;
}

type QuizState = 'intro' | 'taking' | 'submitting' | 'results';

export function EnhancedQuizPage({ quiz, sessionId, userId }: EnhancedQuizPageProps) {
  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [result, setResult] = useState<AdaptiveQuizResult | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleStartQuiz = () => {
    setState('taking');
    setStartTime(Date.now());
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
    setIsSubmitting(true);

    try {
      const submission = {
        quizSlug: quiz.slug,
        answers,
        startTime,
        endTime: Date.now(),
        sessionId,
        userId,
        generateAI: true // Request AI analysis
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
      // Handle error - could show error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakeQuiz = () => {
    setState('intro');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setIsChatOpen(false);
  };

  const handleGenerateAIAnalysis = async () => {
    if (!result) return null;

    try {
      const response = await fetch('/api/quiz/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runId: result.id,
          sessionId,
          userId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI analysis');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('AI analysis error:', error);
      throw error;
    }
  };

  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === currentQuestion.id);
  };

  const isAnswered = () => {
    return getCurrentAnswer() !== undefined;
  };

  // Intro State
  if (state === 'intro') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {quiz.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {quiz.description}
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>~{Math.ceil(quiz.questions.length * 0.5)} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>{quiz.questions.length} questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10,000+ completed</span>
            </div>
          </div>

          {quiz.benefits && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">What You'll Discover</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {quiz.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <Button 
              onClick={handleStartQuiz}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4"
            >
              Start Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-sm text-gray-500">
              No right or wrong answers • Completely anonymous • Research-backed
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Taking Quiz State
  if (state === 'taking') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </div>
            <div className="text-sm text-gray-600">
              {Math.round(progress)}% complete
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                  {currentQuestion.text}
                </h2>

                <QuestionInput
                  question={currentQuestion}
                  currentAnswer={getCurrentAnswer()}
                  onAnswer={handleAnswer}
                />
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isAnswered()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLastQuestion ? 'Complete Assessment' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Submitting State
  if (state === 'submitting') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Analyzing Your Results
            </h2>
            <p className="text-gray-600">
              We're processing your responses and generating personalized insights...
            </p>
          </motion.div>
          
          <div className="max-w-md mx-auto">
            <Progress value={85} className="h-2" />
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
          </div>
        </div>
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
          onGenerateAIAnalysis={handleGenerateAIAnalysis}
        />
        
        <QuizResultsAIChat
          result={result}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onMinimize={() => setIsChatMinimized(!isChatMinimized)}
          isMinimized={isChatMinimized}
        />
      </>
    );
  }

  return null;
}

// Question Input Component
interface QuestionInputProps {
  question: QuizQuestion;
  currentAnswer?: QuizAnswer;
  onAnswer: (value: number | string, category?: string) => void;
}

function QuestionInput({ question, currentAnswer, onAnswer }: QuestionInputProps) {
  if (question.type === 'likert') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span>Strongly Disagree</span>
          <span>Strongly Agree</span>
        </div>
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => onAnswer(value)}
              className={`w-12 h-12 rounded-full border-2 transition-all ${
                currentAnswer?.value === value
                  ? 'border-purple-600 bg-purple-600 text-white'
                  : 'border-gray-300 hover:border-purple-400 text-gray-700'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    );
  }

  if (question.type === 'yes_no') {
    return (
      <div className="flex items-center justify-center gap-6">
        {['Yes', 'No'].map((option, index) => (
          <button
            key={option}
            onClick={() => onAnswer(index)}
            className={`px-8 py-4 rounded-lg border-2 transition-all ${
              currentAnswer?.value === index
                ? 'border-purple-600 bg-purple-600 text-white'
                : 'border-gray-300 hover:border-purple-400 text-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === 'multiple_choice' && question.options) {
    return (
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index, question.optionCategories?.[index])}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              currentAnswer?.value === index
                ? 'border-purple-600 bg-purple-50 text-purple-900'
                : 'border-gray-200 hover:border-purple-300 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                currentAnswer?.value === index
                  ? 'border-purple-600 bg-purple-600'
                  : 'border-gray-300'
              }`}>
                {currentAnswer?.value === index && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                )}
              </div>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (question.type === 'text_input') {
    return (
      <div>
        <textarea
          value={currentAnswer?.value as string || ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder={question.placeholder || 'Share your thoughts...'}
          className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
          rows={4}
        />
      </div>
    );
  }

  return null;
}
