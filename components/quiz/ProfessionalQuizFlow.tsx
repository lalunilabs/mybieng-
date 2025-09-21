'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRewards } from '@/components/gamification/EngagementSystem';
import { ArrowRight, Check, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: string;
  text: string;
  type: 'scale' | 'multiple-choice';
  options?: string[];
  min?: number;
  max?: number;
}

interface ProfessionalQuizFlowProps {
  title: string;
  questions: Question[];
  onComplete: (answers: Record<string, any>) => void;
}

export function ProfessionalQuizFlow({ title, questions, onComplete }: ProfessionalQuizFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const { rewardAction } = useRewards();

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;
  const question = questions[currentStep - 1];

  const handleNext = () => {
    if (currentStep > 0) { // If it's a question step
      if (selectedValue === null) return; // Require an answer
      setAnswers({ ...answers, [question.id]: selectedValue });
      rewardAction('quiz_answer', 5);
    }
    
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
      setSelectedValue(null);
    } else {
      // Final submission
      rewardAction('quiz_complete', 50);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      onComplete({ ...answers, [question.id]: selectedValue });
    }
  };

  const renderIntroScreen = () => (
    <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
        <Brain className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
        This quiz is designed to help you uncover personal insights. Answer honestly—there are no right or wrong answers.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNext}
        className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-full flex items-center gap-2 mx-auto"
      >
        Start Quiz <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );

  const renderQuestionScreen = () => (
    <motion.div key={currentStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">{question.text}</h2>
      {question.type === 'scale' && (
        <div className="flex justify-center gap-3">
          {Array.from({ length: (question.max! - question.min! + 1) }, (_, i) => i + question.min!).map(value => (
            <motion.button
              key={value}
              onClick={() => setSelectedValue(value)}
              whileHover={{ scale: 1.1 }}
              className={`w-12 h-12 rounded-full font-bold text-lg transition-all duration-200 flex items-center justify-center ${
                selectedValue === value
                  ? 'bg-gray-900 text-white scale-110 shadow-lg'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-900'
              }`}
            >
              {value}
            </motion.button>
          ))}
        </div>
      )}
      {question.type === 'multiple-choice' && (
        <div className="space-y-3 max-w-md mx-auto">
          {question.options?.map(option => (
            <motion.button
              key={option}
              onClick={() => setSelectedValue(option)}
              whileHover={{ scale: 1.02 }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                selectedValue === option
                  ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                  : 'bg-white border-gray-200 text-gray-800 hover:border-gray-400'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                selectedValue === option ? 'border-white bg-gray-900' : 'border-gray-300'
              }`}>
                {selectedValue === option && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="font-medium">{option}</span>
            </motion.button>
          ))}
        </div>
      )}
      <div className="text-center mt-12">
        <motion.button
          onClick={handleNext}
          disabled={selectedValue === null}
          whileHover={{ scale: 1.05 }}
          className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {currentStep === questions.length ? 'Finish' : 'Next'}
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full w-full">
            <motion.div
              className="h-full bg-gray-900 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 0 ? renderIntroScreen() : renderQuestionScreen()}
        </AnimatePresence>
      </div>
    </div>
  );
}
