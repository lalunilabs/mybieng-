'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Award, CheckCircle, Circle, Brain, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function WorldClassQuizFlow({ quiz, onComplete }: any) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [streak] = useState(12);

  const question = quiz.questions[current];

  const handleAnswer = (answer: any) => {
    setAnswers({ ...answers, [question.id]: answer });
    
    setTimeout(() => {
      if (current === quiz.questions.length - 1) {
        setShowResults(true);
      } else {
        setCurrent(current + 1);
      }
    }, 600);
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">MB</span>
              </div>
              <span className="font-semibold text-gray-700">mybeing</span>
            </div>
            <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
              <span className="text-2xl">😊</span>
              <span className="font-bold text-yellow-700 numeric-figures">{streak} streak</span>
            </div>
          </div>

          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-purple-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600 mb-8 text-lg">{quiz.description}</p>
          
          <Button 
            onClick={() => setShowIntro(false)} 
            size="lg" 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-2xl"
          >
            Begin Self-Discovery
          </Button>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl max-w-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-yellow-600" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Assessment Complete!</h2>
          <p className="text-gray-600 mb-6">Your insights are being prepared.</p>
          
          <div className="bg-yellow-100 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-700">Self-awareness badge unlocked!</span>
            </div>
          </div>
          
          <Button 
            onClick={() => onComplete({ answers, patterns: ['High awareness'] })}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl"
          >
            View Results
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">MB</span>
            </div>
            <span className="font-semibold">mybeing</span>
          </div>
          <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
            <span className="text-xl">😊</span>
            <span className="font-bold text-yellow-700 numeric-figures">{streak} streak</span>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {Array.from({ length: quiz.questions.length }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= current ? 'bg-purple-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">{question.question}</h2>
            </div>

            <div className="space-y-4">
              {question.options?.map((option: string, index: number) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-6 text-left rounded-2xl border-2 transition-all text-lg font-medium ${
                    answers[question.id] === option
                      ? 'border-yellow-400 bg-yellow-100'
                      : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 bg-white'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
