'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import type { Quiz } from '@/data/quizzes';
import { QuizReportVisualization } from '@/components/ui/QuizReportVisualization';
import { getBandForScore } from '@/data/quizzes';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';
import { trackQuizStart, trackQuizProgress, trackQuizComplete } from '@/lib/analytics/gtag';
import { QuizCompletion } from '@/components/QuizCompletion';

const likert = [
  { label: 'Strongly disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Neutral', value: 3 },
  { label: 'Agree', value: 4 },
  { label: 'Strongly agree', value: 5 },
];

const yesNo = [
  { label: 'Yes', value: 1 },
  { label: 'No', value: 0 },
];

export default function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const total = useMemo(() => {
    return Object.values(answers).reduce((sum: number, answer) => {
      const numValue = typeof answer === 'number' ? answer : 0;
      return sum + numValue;
    }, 0);
  }, [answers]);

  const band = useMemo(() => {
    return quiz.bands.find((b) => total >= b.min && total <= b.max) ?? null;
  }, [quiz.bands, total]);

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);
  const progress = (Object.keys(answers).length / quiz.questions.length) * 100;

  useEffect(() => {
    // Track quiz start when component mounts and set start time
    (window as any).quizStartTime = Date.now();
    trackQuizStart(quiz.slug, quiz.title);
  }, [quiz.slug, quiz.title]);

  function handleChange(id: string, value: number | string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    if (!allAnswered) return;
    
    // Track quiz completion
    const timeSpent = Date.now() - (window as any).quizStartTime || 0;
    trackQuizComplete(quiz.slug, total, Math.floor(timeSpent / 1000));
    
    setSubmitted(true);
  }

  function handleNext() {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Track quiz progress
      trackQuizProgress(quiz.slug, currentQuestionIndex + 2, quiz.questions.length);
    }
  }

  function handlePrevious() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  function renderQuestion(q: any, idx: number) {
    const questionNumber = `${idx + 1}. `;
    
    switch (q.type) {
      case 'likert':
        return (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
          >
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">{idx + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{q.text}</h3>
            </div>
            
            <div className="space-y-3">
              {likert.map((opt) => (
                <motion.label 
                  key={opt.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    answers[q.id] === opt.value 
                      ? 'border-purple-500 bg-purple-50 shadow-sm' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[q.id] === opt.value 
                      ? 'border-purple-500 bg-purple-500' 
                      : 'border-gray-300'
                  }`}>
                    {answers[q.id] === opt.value && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-gray-800">{opt.label}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>
        );

      case 'yes_no':
        return (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
          >
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">{idx + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{q.text}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {yesNo.map((opt) => (
                <motion.label 
                  key={opt.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    answers[q.id] === opt.value 
                      ? 'border-purple-500 bg-purple-50 shadow-sm' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[q.id] === opt.value 
                      ? 'border-purple-500 bg-purple-500' 
                      : 'border-gray-300'
                  }`}>
                    {answers[q.id] === opt.value && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-gray-800 text-lg font-medium">{opt.label}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>
        );

      case 'multiple_choice':
        return (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
          >
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">{idx + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{q.text}</h3>
            </div>
            
            <div className="space-y-3">
              {q.options?.map((option: string, optIdx: number) => (
                <motion.label 
                  key={optIdx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    answers[q.id] === option 
                      ? 'border-purple-500 bg-purple-50 shadow-sm' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[q.id] === option 
                      ? 'border-purple-500 bg-purple-500' 
                      : 'border-gray-300'
                  }`}>
                    {answers[q.id] === option && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-gray-800">{option}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>
        );

      case 'text_input':
        return (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
          >
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">{idx + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{q.text}</h3>
            </div>
            
            <div className="mt-4">
              <textarea
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                placeholder={q.placeholder || 'Type your answer here...'}
                value={answers[q.id] as string || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                rows={4}
              />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  }

  // Single question view
  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  return (
    <div className="mt-6 max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{Object.keys(answers).length} / {quiz.questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
      </div>

      {/* Question counter */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </span>
      </div>

      {/* Current question */}
      <div className="mb-8">
        {renderQuestion(currentQuestion, currentQuestionIndex)}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-6 py-3 rounded-xl font-medium flex items-center ${
            currentQuestionIndex === 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          ← Previous
        </button>
        
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className={`px-6 py-3 rounded-xl font-medium flex items-center ${
              answers[currentQuestion.id] === undefined
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`px-6 py-3 rounded-xl font-medium flex items-center ${
              allAnswered
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            See Results
          </button>
        )}
      </div>

      {submitted && (
        <QuizCompletion
          sessionId={`quiz-${quiz.slug}-${Date.now()}`}
          quizId={quiz.slug}
          quizTitle={quiz.title}
          quizSlug={quiz.slug}
          responses={Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
            questionText: quiz.questions.find(q => q.id === questionId)?.text || '',
            questionType: 'scale'
          }))}
          score={total}
          maxScore={quiz.questions.length * 5}
          onComplete={() => {
            // Handle completion if needed
          }}
        />
      )}
    </div>
  );
}
