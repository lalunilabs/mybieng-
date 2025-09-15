'use client';

import { useState } from 'react';
import { Quiz } from '@/data/quizzes';
import { QuizQuestion } from '@/components/ui/QuizQuestion';
import { QuizResults } from '@/components/ui/QuizResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { collectAnonymousResponse } from '@/lib/research';
import { saveProgress, getUserId } from '@/lib/longitudinal';

interface QuizFlowProps {
  quiz: Quiz;
  onComplete?: (score: number, answers: Record<string, any>) => void;
}

export function QuizFlow({ quiz, onComplete }: QuizFlowProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
      const score = calculateScore(answers);
      
      // Get result band
      const band = getResultBand(score);
      
      // Collect research data (in-memory)
      collectResearchData(score, answers);

      // Persist minimal run to DB for admin research
      try {
        const sessionId = getUserId();
        const mapped = quiz.questions.map(q => ({
          questionId: q.id,
          questionText: q.text,
          answer: Number(answers[q.id] ?? 0),
          questionType: q.type === 'likert' ? 'scale' : 'text',
        }));
        fetch('/api/quiz/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            quizId: quiz.slug,
            responses: mapped,
            score,
          }),
        }).catch(() => {});
      } catch {}
      
      // Save longitudinal progress
      saveProgress(
        quiz.slug,
        score,
        quiz.questions.length * (quiz.questions[0]?.type === 'likert' ? 5 : 1),
        band?.label || 'Unknown',
        answers
      );
      
      if (onComplete) {
        onComplete(score, answers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  const calculateScore = (answers: Record<string, any>): number => {
    let totalScore = 0;
    
    Object.entries(answers).forEach(([questionId, value]) => {
      const question = quiz.questions.find(q => q.id === questionId);
      if (!question) return;

      switch (question.type) {
        case 'likert':
          totalScore += Number(value) || 0;
          break;
        case 'yes_no':
          totalScore += value === true ? 1 : 0;
          break;
        case 'multiple_choice':
          totalScore += 1; // Simple scoring for now
          break;
        case 'text_input':
          totalScore += value && value.trim().length > 0 ? 1 : 0;
          break;
      }
    });

    return totalScore;
  };

  const collectResearchData = (score: number, answers: Record<string, any>) => {
    // Create anonymous session ID
    const sessionId = Math.random().toString(36).substring(2, 15);
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
    
    // Map answers to research format
    const responses = quiz.questions.map(question => {
      const answer = answers[question.id];
      let questionType: 'multiple-choice' | 'scale' | 'text' = 'text';
      
      switch (question.type) {
        case 'likert':
          questionType = 'scale';
          break;
        case 'multiple_choice':
          questionType = 'multiple-choice';
          break;
        case 'yes_no':
          questionType = 'multiple-choice';
          break;
        case 'text_input':
          questionType = 'text';
          break;
      }
      
      return {
        questionId: question.id,
        questionText: question.text,
        answer: String(answer),
        questionType
      };
    });
    
    // Get band result
    const band = getResultBand(score);
    
    // Collect anonymous research data
    collectAnonymousResponse(
      quiz.slug,
      responses,
      sessionId,
      userAgent,
      score,
      band?.label
    );
  };

  const getResultBand = (score: number): any => {
    return quiz.bands.find(band => score >= band.min && score <= band.max) || quiz.bands[0];
  };

  if (showResults) {
    const score = calculateScore(answers);
    const band = getResultBand(score);
    const maxScore = quiz.questions.length * (quiz.questions[0]?.type === 'likert' ? 5 : 1);

    return (
      <QuizResults
        score={score}
        maxScore={maxScore}
        band={band}
        quizTitle={quiz.title}
        quizSlug={quiz.slug}
        answers={answers}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Enhanced Progress Header */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {quiz.title}
              </h2>
              <p className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {Math.round(progress)}%
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress 
            value={progress} 
            variant="gradient" 
            size="lg" 
            className="shadow-soft"
          />
        </div>
      </Card>

      {/* Enhanced Current Question */}
      <div className="animate-slide-in">
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
          value={answers[currentQuestion.id]}
          onChange={handleAnswer}
        />
      </div>

      {/* Enhanced Navigation */}
      <Card variant="glass" className="p-6">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="group"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {Array.from({ length: quiz.questions.length }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i < currentQuestionIndex 
                    ? 'bg-primary shadow-glow' 
                    : i === currentQuestionIndex 
                    ? 'bg-primary/50 scale-125' 
                    : 'bg-secondary'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant={currentQuestionIndex === quiz.questions.length - 1 ? "gradient" : "default"}
            size="lg"
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className="group shadow-soft hover:shadow-medium"
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <>
                <span className="mr-2">🎉</span>
                Complete Quiz
              </>
            ) : (
              <>
                Next
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
