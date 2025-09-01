'use client';

import { notFound } from 'next/navigation';
import { quizzes, getQuizBySlug } from '@/data/quizzes';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { QuizFlow } from '@/components/ui/QuizFlow';

interface QuizPageProps {
  params: { slug: string };
}


export default function QuizPage({ params }: QuizPageProps) {
  const quiz = getQuizBySlug(params.slug);

  if (!quiz) {
    notFound();
  }

  return (
    <Layout
      title={quiz.title}
      description={quiz.description}
      showBack
    >
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                {quiz.questions.length} questions
              </span>
              <span className="text-sm text-gray-500">
                Estimated time: {quiz.questions.length * 0.75} min
              </span>
            </div>
            <CardTitle className="text-2xl mb-2">{quiz.title}</CardTitle>
            <CardDescription className="text-lg">
              {quiz.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <QuizFlow 
              quiz={quiz}
              onComplete={(score: number, answers: Record<string, any>) => {
                // Here you would typically save to database
                console.log('Quiz completed:', { score, answers });
              }}
            />
          </CardContent>
        </Card>

        {/* Assessment bands preview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>What You'll Learn</CardTitle>
            <CardDescription>
              Your results will place you in one of these categories with personalized guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quiz.bands.map((band, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">{band.label}</h4>
                  <p className="text-sm text-gray-600">{band.advice}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
