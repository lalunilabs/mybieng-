import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import { PageLoader } from '@/components/ui/PageLoader';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Clock, Users } from 'lucide-react';
import { Suspense } from 'react';
import QuizAccess from '@/components/QuizAccess';
import type { Metadata } from 'next';
import { loadQuizBySlug, loadAllQuizzes } from '@/lib/content';
import { RotateCcw, Shield } from 'lucide-react';
import BookmarkButton from '@/components/BookmarkButton';
import Image from 'next/image';

export const revalidate = 600; // ISR: rebuild every 10 minutes

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const quiz = loadQuizBySlug(params.slug);
  if (!quiz) return {};
  const title = quiz.metaTitle || quiz.title;
  const description = quiz.metaDescription || quiz.description;
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const url = quiz.canonicalUrl || `${base}/quizzes/${quiz.slug}`;
  const images = quiz.ogImage
    ? [quiz.ogImage]
    : quiz.imageUrl
    ? [quiz.imageUrl]
    : [`/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description || '')}`];
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

export async function generateStaticParams() {
  const now = Date.now();
  const quizzes = loadAllQuizzes()
    .filter(q => q.published !== false && (!q.publishedAt || new Date(q.publishedAt).getTime() <= now));
  return quizzes.map(q => ({ slug: q.slug }));
}

function QuizDetailContent({ params }: { params: { slug: string } }) {
  const quiz = loadQuizBySlug(params.slug);
  
  const now = Date.now();
  const scheduledTime = quiz?.publishedAt ? new Date(quiz.publishedAt).getTime() : undefined;
  if (!quiz || quiz.published === false || (scheduledTime && scheduledTime > now)) {
    return notFound();
  }

  const title = quiz.metaTitle || quiz.title;
  const description = quiz.metaDescription || quiz.description;
  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const url = quiz.canonicalUrl || `${base}/quizzes/${quiz.slug}`;
  const image = quiz.ogImage || quiz.imageUrl || `${base}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description || '')}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description,
    url,
    image,
    datePublished: quiz.publishedAt || new Date().toISOString(),
    about: (quiz.tags || []).map(t => ({ '@type': 'Thing', name: t })),
    creator: { '@type': 'Organization', name: 'MyBeing' },
  };
  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Quizzes', item: `${base}/quizzes` },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
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

              {/* Optional cover image */}
              {(quiz as any).imageUrl ? (
                <div className="mt-2 mb-6 relative w-full max-w-3xl mx-auto h-56">
                  <Image
                    src={(quiz as any).imageUrl}
                    alt={`${quiz.title} cover`}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="rounded-2xl border object-cover"
                    priority={false}
                  />
                </div>
              ) : null}

              {/* Optional resources */}
              {(quiz as any).attachments?.length ? (
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-2">Resources</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-purple-700">
                    {(quiz as any).attachments.map((att: any, idx: number) => (
                      <li key={idx}>
                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {att.label || att.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="flex justify-center mb-6">
                <BookmarkButton 
                  type="quiz" 
                  itemId={quiz.slug} 
                  title={quiz.title} 
                  className="bg-white/80 backdrop-blur-sm"
                />
              </div>

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
