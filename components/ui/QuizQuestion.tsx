'use client';

import Image from 'next/image';
import { QuizQuestion as Question } from '@/data/quizzes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  value: any;
  onChange: (value: any) => void;
}

export function QuizQuestion({ question, questionNumber, totalQuestions, value, onChange }: QuizQuestionProps) {
  const renderQuestionInput = () => {
    switch (question.type) {
      case 'likert':
        return (
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-6 px-2">
              <span className="font-medium">Strongly Disagree</span>
              <span className="font-medium">Strongly Agree</span>
            </div>
            <div className="flex justify-between items-center space-x-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => onChange(rating)}
                  className={`group relative w-16 h-16 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center font-bold text-lg hover:scale-110 ${
                    value === rating
                      ? 'border-primary bg-primary text-white shadow-glow scale-110'
                      : 'border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-soft'
                  }`}
                >
                  {rating}
                  {value === rating && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-2">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
        );

      case 'yes_no':
        return (
          <div className="flex space-x-4">
            <Button
              variant={value === true ? 'gradient' : 'outline'}
              size="lg"
              onClick={() => onChange(true)}
              className="flex-1 group"
            >
              <span className="mr-2 text-lg group-hover:scale-110 transition-transform duration-200">✓</span>
              Yes
            </Button>
            <Button
              variant={value === false ? 'gradient' : 'outline'}
              size="lg"
              onClick={() => onChange(false)}
              className="flex-1 group"
            >
              <span className="mr-2 text-lg group-hover:scale-110 transition-transform duration-200">✗</span>
              No
            </Button>
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => onChange(option)}
                className={`group w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                  value === option
                    ? 'border-primary bg-primary/10 text-primary shadow-soft'
                    : 'border-border hover:border-primary/30 hover:bg-primary/5 hover:shadow-soft'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-base leading-relaxed">{option}</span>
                  <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    value === option 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground/30 group-hover:border-primary/50'
                  }`}>
                    {value === option && (
                      <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 'text_input':
        return (
          <div className="space-y-3">
            <textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Share your thoughts here..."
              className="w-full p-6 border-2 border-border rounded-2xl focus:border-primary focus:ring-0 resize-none transition-all duration-200 text-base leading-relaxed placeholder:text-muted-foreground/60 hover:border-primary/30 focus:shadow-soft"
              rows={6}
            />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Take your time to reflect</span>
              <span>{(value || '').length} characters</span>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-muted-foreground">Unsupported question type</div>;
    }
  };

  return (
    <Card variant="elevated" className="animate-scale-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            <span className="mr-1">📝</span>
            Question {questionNumber} of {totalQuestions}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {Math.round((questionNumber / totalQuestions) * 100)}% complete
          </div>
        </div>
        <CardTitle className="text-2xl leading-relaxed text-foreground">
          {question.text}
        </CardTitle>
        {question.imageUrl && (
          <div className="mt-3 relative w-full h-64">
            <Image
              src={question.imageUrl}
              alt="Question illustration"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="rounded-xl border object-cover"
              priority={false}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        {renderQuestionInput()}
        {(question as any).attachments?.length ? (
          <div className="mt-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">Resources</div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {(question as any).attachments.map((att: any, idx: number) => (
                <li key={idx}>
                  <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {att.label || att.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
