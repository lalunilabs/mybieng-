'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Users, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Circle,
  RotateCcw,
  Share2,
  Bookmark,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface EnhancedQuizViewerProps {
  quiz: {
    title: string;
    description: string;
    questions: any[];
    estimatedTime: string;
    difficulty: string;
    category: string;
  };
  onComplete: (results: any) => void;
  onBack?: () => void;
}

export function EnhancedQuizViewer({ quiz, onComplete, onBack }: EnhancedQuizViewerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  const handleAnswer = (questionIndex: number, answer: any) => {
    setIsAnimating(true);
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResults(true);
        onComplete({ answers, quiz });
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-6"
      >
        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-gray-600 mb-6">
            You've completed the {quiz.title} assessment.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button onClick={resetQuiz} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
            <Button variant="premium">
              View Results
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Quiz Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.description}</p>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{quiz.estimatedTime}</span>
            </div>
            <Badge variant="secondary">{quiz.difficulty}</Badge>
          </div>
        </div>

        <Progress value={progress} className="mb-4" />
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </motion.div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{currentQ.question}</h2>
            
            <div className="space-y-3">
              {currentQ.options?.map((option: string, index: number) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(currentQuestion, option)}
                  disabled={isAnimating}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === option
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {answers[currentQuestion] === option ? (
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handleBack}
          disabled={currentQuestion === 0 || isAnimating}
          variant="ghost"
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
