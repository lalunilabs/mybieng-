'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Brain, ArrowRight, CheckCircle, Clock, Users, Sparkles, Play, Pause, RotateCcw } from 'lucide-react';
import PrimaryCTA from '@/components/ui/PrimaryCTA';

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    text: "When you realize your actions contradict your stated values, what's your first instinct?",
    options: [
      "Immediately justify why this situation is different",
      "Feel uncomfortable but continue the behavior",
      "Pause and reflect on the contradiction",
      "Change your behavior to match your values"
    ]
  },
  {
    id: 2,
    text: "How do you typically respond when presented with information that challenges your beliefs?",
    options: [
      "Look for flaws in the information",
      "Consider it but stick to original beliefs",
      "Feel curious about different perspectives",
      "Actively seek to understand the new viewpoint"
    ]
  },
  {
    id: 3,
    text: "When making important decisions, you tend to:",
    options: [
      "Go with your gut feeling",
      "Analyze all available data",
      "Seek advice from others",
      "Consider long-term consequences"
    ]
  }
];

const ASSESSMENT_FEATURES = [
  {
    icon: Brain,
    title: "No Right or Wrong Answers",
    description: "Focus on patterns and self-discovery, not judgment"
  },
  {
    icon: Clock,
    title: "10-Minute Assessment",
    description: "Quick yet comprehensive insights into your patterns"
  },
  {
    icon: Sparkles,
    title: "Instant Results",
    description: "Get your personalized report immediately"
  },
  {
    icon: Users,
    title: "AI Chat Integration",
    description: "Discuss your results with our AI for deeper insights"
  }
];

function QuestionPreview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    
    // Auto-advance after selection
    setTimeout(() => {
      if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 800);
  };

  const resetDemo = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Assessment Preview</h3>
            <p className="text-sm text-gray-500">Try a sample question</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={resetDemo}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {SAMPLE_QUESTIONS.length}</span>
          <span>{Math.round((currentQuestion + 1) / SAMPLE_QUESTIONS.length * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h4 className="text-lg font-medium text-gray-900 mb-4 leading-relaxed">
            {SAMPLE_QUESTIONS[currentQuestion].text}
          </h4>
          
          <div className="space-y-3">
            {SAMPLE_QUESTIONS[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswers[SAMPLE_QUESTIONS[currentQuestion].id] === index;
              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(SAMPLE_QUESTIONS[currentQuestion].id, index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 text-purple-900'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{option}</span>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-2">
          {SAMPLE_QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentQuestion ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={() => setCurrentQuestion(Math.min(SAMPLE_QUESTIONS.length - 1, currentQuestion + 1))}
          disabled={currentQuestion === SAMPLE_QUESTIONS.length - 1}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function InteractiveAssessmentPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              <span>Interactive Assessment</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Discover Your
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hidden Patterns
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Take our signature cognitive dissonance assessment to uncover the contradictions between your values and actions. No judgment, just insights.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {ASSESSMENT_FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <PrimaryCTA 
                href="/quizzes/cognitive-dissonance" 
                variant="uiverse" 
                size="lg"
                className="px-8 py-4 text-base font-semibold group"
                eventName="assessment_preview_start"
                surface="assessment_preview"
              >
                <Brain className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Full Assessment
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </PrimaryCTA>
              
              <Link 
                href="/quizzes"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                <span>View all assessments</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 flex items-center gap-6 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span><strong>1,247+</strong> completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span><strong>10 min</strong> average</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span><strong>4.9/5</strong> rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Interactive Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <QuestionPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
