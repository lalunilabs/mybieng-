'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Quiz, QuizQuestion } from '@/data/quizzes';
import { QuizCompletion } from '@/components/QuizCompletion';

interface ClassicQuizFlowProps {
  quiz: Quiz;
  onComplete: (score: number, answers: Record<string, any>) => void;
}

export function ClassicQuizFlow({ quiz, onComplete }: ClassicQuizFlowProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswer = (questionId: string, answer: any) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score and show results
      const calculatedScore = calculateScore(newAnswers);
      setScore(calculatedScore);
      setShowResults(true);
      onComplete(calculatedScore, newAnswers);
    }
  };

  const calculateScore = (answers: Record<string, any>) => {
    return Object.values(answers).reduce((sum, answer) => {
      if (typeof answer === 'number') return sum + answer;
      if (answer === 'yes') return sum + 2;
      if (answer === 'no') return sum + 1;
      return sum + 1;
    }, 0);
  };

  if (showResults) {
    return (
      <QuizCompletion 
        sessionId="temp-session" 
        quizId={quiz.slug} 
        quizTitle={quiz.title} 
        quizSlug={quiz.slug} 
        score={score} 
        maxScore={quiz.questions.length * 5} 
        responses={answers} 
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600 tracking-wide">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gray-900 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow transition-shadow duration-200">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-serif font-normal text-gray-900 mb-8 leading-relaxed tracking-tight">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.type === 'likert' && (
              <LikertScale 
                questionId={currentQuestion.id}
                onAnswer={handleAnswer}
              />
            )}

            {currentQuestion.type === 'yes_no' && (
              <YesNoButtons 
                questionId={currentQuestion.id}
                onAnswer={handleAnswer}
              />
            )}

            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <MultipleChoice 
                questionId={currentQuestion.id}
                options={currentQuestion.options}
                onAnswer={handleAnswer}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LikertScale({ questionId, onAnswer }: { questionId: string; onAnswer: (id: string, answer: number) => void }) {
  const options = [
    { value: 1, label: 'Never' },
    { value: 2, label: 'Rarely' },
    { value: 3, label: 'Sometimes' },
    { value: 4, label: 'Often' },
    { value: 5, label: 'Always' }
  ];

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onAnswer(questionId, option.value)}
          className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
          aria-label={`Select ${option.label}`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 text-base">{option.label}</span>
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full group-hover:border-gray-400 transition-colors" />
          </div>
        </button>
      ))}
    </div>
  );
}

function YesNoButtons({ questionId, onAnswer }: { questionId: string; onAnswer: (id: string, answer: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        onClick={() => onAnswer(questionId, 'yes')}
        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-center group"
        aria-label="Answer Yes"
      >
        <span className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">Yes</span>
      </button>
      <button
        onClick={() => onAnswer(questionId, 'no')}
        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-center group"
        aria-label="Answer No"
      >
        <span className="font-medium text-gray-900 group-hover:text-red-700 transition-colors">No</span>
      </button>
    </div>
  );
}

function MultipleChoice({ questionId, options, onAnswer }: { 
  questionId: string; 
  options: string[]; 
  onAnswer: (id: string, answer: string) => void 
}) {
  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onAnswer(questionId, option)}
          className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 group"
          aria-label={`Select option: ${option}`}
        >
          <span className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
            {option}
          </span>
        </button>
      ))}
    </div>
  );
}
