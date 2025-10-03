'use client';

import { getQuizBySlug } from '@/data/quizzes';
import { EnhancedQuizTaker } from '@/components/quiz/EnhancedQuizTaker';
import { notFound } from 'next/navigation';

export default function ClassicCognitiveDissonnancePage() {
  const quiz = getQuizBySlug('cognitive-dissonance');
  
  if (!quiz) {
    notFound();
  }

  const handleQuizComplete = async (score: number, answers: Record<string, any>) => {
    // Save quiz results
    try {
      await fetch('/api/quiz-runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizSlug: quiz.slug,
          score,
          answers,
        }),
      });
    } catch (error) {
      console.error('Failed to save quiz results:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-serif text-gray-900 mb-4 leading-tight">
              {quiz.title}
            </h1>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              {quiz.description}
            </p>
            <div className="mt-6 text-sm text-gray-500">
              {quiz.questions.length} questions • 5-7 minutes
            </div>
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="py-12">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cognitive Dissonance Quiz</h3>
          <p className="text-gray-600">Quiz functionality coming soon.</p>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-gray-500 font-light">
            This assessment is designed for self-reflection and personal growth. 
            Results are private and stored securely.
          </p>
        </div>
      </footer>
    </div>
  );
}
