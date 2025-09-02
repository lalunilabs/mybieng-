import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/PageLoader';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Clock, Users, BarChart3, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { Suspense } from 'react';
import QuizAccess from '@/components/QuizAccess';
import type { Metadata } from 'next';
import { loadQuizBySlug } from '@/lib/content';
import { RotateCcw, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const quiz = loadQuizBySlug(params.slug);
  if (!quiz) return {};
  const title = quiz.metaTitle || quiz.title;
  const description = quiz.metaDescription || quiz.description;
  const url = quiz.canonicalUrl || `https://mybeing.app/quizzes/${quiz.slug}`;
  const images = quiz.ogImage ? [quiz.ogImage] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: quiz.robots,
    keywords: quiz.keywords,
    openGraph: { title, description, url, images },
    twitter: { card: 'summary_large_image', title, description, images }
  };
}

function QuizDetailContent({ params }: { params: { slug: string } }) {
  const quiz = loadQuizBySlug(params.slug);
  
  if (!quiz || quiz.published === false) {
    return notFound();
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <Container>
          <section className="relative py-16">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-purple-50 text-sm font-semibold mb-6">
                <span className="text-lg">🧠</span>
                <span className="text-purple-700">Self-Discovery Assessment</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
                {quiz.title}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
                {quiz.description}
              </p>

              {/* Quiz Stats */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span>5-15 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-500" />
                  <span>Retakeable anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>1000+ completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span>Completely private</span>
                </div>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200/50 shadow-soft mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    What You'll Discover
                  </h3>
                  <p className="text-green-800 leading-relaxed">
                    Gain personalized insights into your cognitive patterns, behavioral tendencies, and growth opportunities. 
                    Each assessment is research-backed and designed to provide actionable self-awareness.
                  </p>
                </div>
              </div>
            </div>

            {/* Quiz Access Component */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <QuizAccess quiz={quiz} />
            </div>

            {/* Additional Info */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-center p-6 bg-white rounded-2xl shadow-soft border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Right Answers</h3>
                <p className="text-sm text-gray-600">Focus on honest self-reflection rather than "correct" responses.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-soft border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">🔬</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Research-Backed</h3>
                <p className="text-sm text-gray-600">Based on validated psychological constructs and frameworks.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-soft border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Detailed Results</h3>
                <p className="text-sm text-gray-600">Receive personalized insights and actionable recommendations.</p>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </ErrorBoundary>
  );
}

export default function QuizDetailPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<PageLoader message="Loading quiz details..." />}>
      <QuizDetailContent params={params} />
    </Suspense>
  );
}
