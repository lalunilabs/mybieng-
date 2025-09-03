import { fallbackQuizzes } from '@/lib/fallbackData';
import QuizCard from '@/components/QuizCard';
import Container from '@/components/Container';
import { PageLoader } from '@/components/ui/PageLoader';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { motion } from 'framer-motion';
import { Brain, Users, TrendingUp } from 'lucide-react';
import { Suspense } from 'react';

function QuizzesContent() {
  const publishedQuizzes = fallbackQuizzes.filter(q => q.published !== false);
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-12 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <section className="relative px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-6 py-3 text-sm font-medium text-primary ring-1 ring-primary/20 shadow-soft">
                <span className="mr-2 text-lg">🧠</span>
                <span className="font-semibold">Research-backed assessments</span>
              </div>
              
              <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-8">
                <span className="block">Discover Your</span>
                <span className="block text-gradient bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Inner Patterns
                </span>
              </h1>
              
              <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground sm:text-2xl">
                Self-insight assessments built on <span className="text-primary font-semibold">research-backed constructs</span>. 
                Understand your cognitive patterns, stress responses, and behavioral tendencies.
              </p>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center group">
                  <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-200">{publishedQuizzes.length}</div>
                  <div className="text-sm text-muted-foreground font-medium">Available Quizzes</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-200">5-15</div>
                  <div className="text-sm text-muted-foreground font-medium">Minutes Each</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-200">∞</div>
                  <div className="text-sm text-muted-foreground font-medium">Retakes Available</div>
                </div>
              </div>
            </div>

            {/* Quiz Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fallbackQuizzes.map((quiz, index) => (
                <div 
                  key={quiz.slug} 
                  className="animate-scale-in" 
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <QuizCard 
                    slug={quiz.slug} 
                    title={quiz.title} 
                    description={quiz.description} 
                  />
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-3xl p-12 border border-primary/10">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Each quiz takes just a few minutes and provides personalized insights to help you understand yourself better.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-2">✓</span>
                    No right or wrong answers
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-2">✓</span>
                    Scientifically validated
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-2">✓</span>
                    Completely private
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
}

export default function QuizzesPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading quizzes..." />}>
      <QuizzesContent />
    </Suspense>
  );
}
