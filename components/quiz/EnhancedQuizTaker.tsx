'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Brain, Clock, CheckCircle, Circle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';

interface QuizQuestion {
  id: string;
  text: string;
  type: 'scale' | 'multiple-choice' | 'ranking';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  insight?: string; // Research-backed insight for pattern recognition
}

interface QuizTakerProps {
  quiz: {
    id: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
    estimatedTime: number;
  };
  onComplete: (responses: Record<string, any>) => void;
  onSave?: (responses: Record<string, any>) => void;
}

export function EnhancedQuizTaker({ quiz, onComplete, onSave }: QuizTakerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [showInsight, setShowInsight] = useState(false);

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const currentQ = quiz.questions[currentQuestion];
  const hasResponse = responses[currentQ.id] !== undefined;

  // Auto-save responses periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(responses).length > 0 && onSave) {
        onSave(responses);
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [responses, onSave]);

  // Track time spent on each question
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);

  const handleResponse = useCallback((value: any) => {
    const timeOnQuestion = Date.now() - questionStartTime;
    
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: value
    }));

    setTimeSpent(prev => ({
      ...prev,
      [currentQ.id]: timeOnQuestion
    }));

    // Show insight after response for pattern recognition
    if (currentQ.insight && !showInsight) {
      setShowInsight(true);
      setTimeout(() => setShowInsight(false), 4000);
    }
  }, [currentQ.id, currentQ.insight, questionStartTime, showInsight]);

  const handleNext = () => {
    if (isLastQuestion) {
      const totalTime = Date.now() - startTime;
      onComplete({
        responses,
        metadata: {
          totalTime,
          timeSpent,
          completedAt: new Date().toISOString(),
          quizId: quiz.id
        }
      });
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'scale':
        return (
          <ScaleQuestion
            question={currentQ}
            value={responses[currentQ.id]}
            onChange={handleResponse}
          />
        );
      case 'multiple-choice':
        return (
          <MultipleChoiceQuestion
            question={currentQ}
            value={responses[currentQ.id]}
            onChange={handleResponse}
          />
        );
      case 'ranking':
        return (
          <RankingQuestion
            question={currentQ}
            value={responses[currentQ.id]}
            onChange={handleResponse}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>~{Math.ceil((quiz.estimatedTime * (1 - progress/100)))} min left</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 leading-relaxed">
                {currentQ.text}
              </h2>
              
              {renderQuestion()}

              {/* Pattern Recognition Insight */}
              <AnimatePresence>
                {showInsight && currentQ.insight && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Pattern Insight</h4>
                        <p className="text-sm text-blue-800">{currentQ.insight}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {quiz.questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index < currentQuestion
                  ? 'bg-green-500'
                  : index === currentQuestion
                  ? 'bg-purple-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!hasResponse}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
          {isLastQuestion ? 'Complete Assessment' : 'Next'}
          {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}

// Scale Question Component
function ScaleQuestion({ question, value, onChange }: {
  question: QuizQuestion;
  value: number;
  onChange: (value: number) => void;
}) {
  const min = question.scaleMin || 1;
  const max = question.scaleMax || 7;
  const range = max - min + 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span>{question.scaleLabels?.min || `${min} - Strongly Disagree`}</span>
        <span>{question.scaleLabels?.max || `${max} - Strongly Agree`}</span>
      </div>
      
      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: range }, (_, i) => {
          const scaleValue = min + i;
          const isSelected = value === scaleValue;
          
          return (
            <button
              key={scaleValue}
              onClick={() => onChange(scaleValue)}
              className={`w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center font-semibold ${
                isSelected
                  ? 'border-purple-500 bg-purple-500 text-white scale-110'
                  : 'border-gray-300 hover:border-purple-300 hover:scale-105'
              }`}
            >
              {scaleValue}
            </button>
          );
        })}
      </div>
      
      {value && (
        <div className="text-center text-sm text-gray-600">
          Selected: {value}
        </div>
      )}
    </div>
  );
}

// Multiple Choice Question Component
function MultipleChoiceQuestion({ question, value, onChange }: {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      {question.options?.map((option, index) => {
        const isSelected = value === option;
        
        return (
          <button
            key={index}
            onClick={() => onChange(option)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
              isSelected
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSelected ? (
                <CheckCircle className="w-5 h-5 text-purple-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
              <span className={isSelected ? 'text-purple-900 font-medium' : 'text-gray-700'}>
                {option}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Ranking Question Component (simplified for now)
function RankingQuestion({ question, value, onChange }: {
  question: QuizQuestion;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [rankings, setRankings] = useState<string[]>(value || []);

  const handleRank = (option: string, rank: number) => {
    const newRankings = [...rankings];
    newRankings[rank] = option;
    setRankings(newRankings);
    onChange(newRankings);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Rank these options from most important (1) to least important ({question.options?.length}):
      </p>
      
      {question.options?.map((option, index) => (
        <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
          <select
            value={rankings.indexOf(option) >= 0 ? rankings.indexOf(option) + 1 : ''}
            onChange={(e) => handleRank(option, parseInt(e.target.value) - 1)}
            className="w-16 p-2 border rounded"
          >
            <option value="">-</option>
            {Array.from({ length: question.options?.length || 0 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <span className="flex-1">{option}</span>
        </div>
      ))}
    </div>
  );
}
