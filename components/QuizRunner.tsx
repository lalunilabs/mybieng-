'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Quiz, QuizQuestion } from '@/data/quizzes';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from '@/components/ui/Toast';
import { formatTimeRemaining, isValidAnswer, calculateScore } from '@/lib/quizUtils';

type Answer = {
  questionId: string;
  value: string | number | string[];
};

type QuizState = 'loading' | 'ready' | 'submitting' | 'error';

export default function QuizRunner({ quiz: initialQuiz }: { quiz: Quiz }) {
  const router = useRouter();
  const [state, setState] = useState<QuizState>('loading');
  const [quiz, setQuiz] = useState<Quiz>(initialQuiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  
  // Initialize quiz with randomization if needed
  useEffect(() => {
    if (quiz.randomizeQuestions) {
      const randomizedQuestions = [...quiz.questions];
      if (quiz.keepFirstNQuestions) {
        const firstN = randomizedQuestions.splice(0, quiz.keepFirstNQuestions);
        // Shuffle the rest
        for (let i = randomizedQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [randomizedQuestions[i], randomizedQuestions[j]] = 
            [randomizedQuestions[j], randomizedQuestions[i]];
        }
        setQuiz(prev => ({
          ...prev,
          questions: [...firstN, ...randomizedQuestions]
        }));
      } else {
        // Shuffle all questions
        for (let i = randomizedQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [randomizedQuestions[i], randomizedQuestions[j]] = 
            [randomizedQuestions[j], randomizedQuestions[i]];
        }
        setQuiz(prev => ({
          ...prev,
          questions: randomizedQuestions
        }));
      }
    }
    setState('ready');
  }, [quiz.randomizeQuestions, quiz.keepFirstNQuestions]);
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);
  
  // Time limit handling
  useEffect(() => {
    if (!quiz.timeLimitMinutes || !sessionId) return;
    
    const timeLimitMs = quiz.timeLimitMinutes * 60 * 1000;
    const startTime = Date.now();
    const endTime = startTime + timeLimitMs;
    
    // Load saved time if any
    const savedTime = localStorage.getItem(`quiz_${quiz.slug}_time`);
    const savedEndTime = savedTime ? parseInt(savedTime, 10) : endTime;
    const now = Date.now();
    
    // If time's up, submit automatically
    if (savedEndTime <= now) {
      handleTimeUp();
      return;
    }
    
    // Set up timer
    const updateTimeLeft = () => {
      const remaining = Math.ceil((savedEndTime - Date.now()) / 1000);
      if (remaining <= 0) {
        handleTimeUp();
      } else {
        setTimeLeft(remaining);
      }
    };
    
    // Initial update
    updateTimeLeft();
    
    // Update every second
    const timer = setInterval(updateTimeLeft, 1000);
    
    // Save end time
    localStorage.setItem(`quiz_${quiz.slug}_time`, savedEndTime.toString());
    
    return () => {
      clearInterval(timer);
      localStorage.removeItem(`quiz_${quiz.slug}_time`);
    };
  }, [quiz.timeLimitMinutes, quiz.slug, sessionId]);
  
  const handleTimeUp = useCallback(() => {
    toast({
      title: 'Time\'s up!',
      description: 'Your time for this quiz has ended. Submitting your answers...',
      variant: 'warning',
    });
    handleSubmit();
  }, [handleSubmit]);
  
  const toggleFlag = useCallback(() => {
    if (!currentQuestion) return;
    
    setFlaggedQuestions(prev => {
      const newFlags = new Set(prev);
      if (newFlags.has(currentQuestion.id)) {
        newFlags.delete(currentQuestion.id);
      } else {
        newFlags.add(currentQuestion.id);
      }
      return newFlags;
    });
  }, [currentQuestion]);
  
  const isFlagged = currentQuestion ? flaggedQuestions.has(currentQuestion.id) : false;

  // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await fetch('/api/quiz/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizSlug: quiz.slug }),
        });
        
        if (!response.ok) throw new Error('Failed to initialize quiz session');
        
        const { sessionId: newSessionId } = await response.json();
        setSessionId(newSessionId);
        
        // Load saved progress if any
        const savedProgress = localStorage.getItem(`quiz_${quiz.slug}_progress`);
        if (savedProgress) {
          const { currentIndex, answers: savedAnswers } = JSON.parse(savedProgress);
          setCurrentQuestionIndex(parseInt(currentIndex));
          setAnswers(savedAnswers);
        }
      } catch (error) {
        console.error('Error initializing quiz:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize quiz. Please refresh the page.',
          variant: 'destructive',
        });
      }
    };

    initializeSession();
    
    return () => {
      // Cleanup if needed
    };
  }, [quiz.slug]);

  // Save progress to localStorage
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(
        `quiz_${quiz.slug}_progress`,
        JSON.stringify({
          currentIndex: currentQuestionIndex,
          answers,
          timestamp: new Date().toISOString(),
        })
      );
    }
  }, [currentQuestionIndex, answers, quiz.slug, sessionId]);

  const handleAnswer = (value: string | number | string[]) => {
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    setAnswers([...newAnswers, { questionId: currentQuestion.id, value }]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!sessionId) {
      toast({
        title: 'Error',
        description: 'Quiz session not initialized. Please refresh the page.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          quizSlug: quiz.slug,
          answers,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit quiz');
      
      // Clear saved progress
      localStorage.removeItem(`quiz_${quiz.slug}_progress`);
      
      // Redirect to results page
      router.push(`/quizzes/${quiz.slug}/results`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit quiz. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'likert':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
            {currentQuestion.description && (
              <p className="text-sm text-gray-500">{currentQuestion.description}</p>
            )}
            <div className="pt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Strongly Disagree</span>
                <span>Neutral</span>
                <span>Strongly Agree</span>
              </div>
              <div className="flex justify-between space-x-2">
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                  <Button
                    key={value}
                    variant={currentAnswer?.value === value ? 'default' : 'outline'}
                    className="flex-1 h-12"
                    onClick={() => handleAnswer(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
            {currentQuestion.description && (
              <p className="text-sm text-gray-500">{currentQuestion.description}</p>
            )}
            <RadioGroup
              value={currentAnswer?.value as string || ''}
              onValueChange={handleAnswer}
              className="space-y-2 pt-2"
            >
              {currentQuestion.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} />
                  <Label htmlFor={`${currentQuestion.id}-${option}`} className="text-base">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'text_input':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
            {currentQuestion.description && (
              <p className="text-sm text-gray-500">{currentQuestion.description}</p>
            )}
            <Textarea
              value={(currentAnswer?.value as string) || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentQuestion.placeholder || 'Type your answer here...'}
              className="min-h-[120px]"
            />
          </div>
        );

      case 'yes_no':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
            {currentQuestion.description && (
              <p className="text-sm text-gray-500">{currentQuestion.description}</p>
            )}
            <div className="flex space-x-4 pt-2">
              <Button
                variant={currentAnswer?.value === 'yes' ? 'default' : 'outline'}
                onClick={() => handleAnswer('yes')}
                className="flex-1"
              >
                Yes
              </Button>
              <Button
                variant={currentAnswer?.value === 'no' ? 'default' : 'outline'}
                onClick={() => handleAnswer('no')}
                className="flex-1"
              >
                No
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>
        
        <CardContent className="py-6">
          {renderQuestion()}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || isSubmitting}
          >
            Previous
          </Button>
          
          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!currentAnswer || isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!currentAnswer || isSubmitting}
            >
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Your progress is saved automatically. You can come back later to continue.
      </div>
    </div>
  );
}
