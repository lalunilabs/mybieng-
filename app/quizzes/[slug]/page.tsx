import { notFound } from 'next/navigation';
import QuizAccess from '@/components/QuizAccess';
import type { Metadata } from 'next';
import { loadQuizBySlug } from '@/lib/content';

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

export default function QuizDetailPage({ params }: { params: { slug: string } }) {
  const quiz = loadQuizBySlug(params.slug);
  if (!quiz || quiz.published === false) return notFound();

  return (
    <section className="py-10">
      <h1 className="text-3xl font-semibold">{quiz.title}</h1>
      <p className="mt-2 text-gray-600 max-w-3xl">{quiz.description}</p>
      <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
        <span className="mr-1">✅</span>
        Subscribers: Related quizzes are free when you unlock their premium article as part of your included monthly quota.
      </div>
      <QuizAccess quiz={quiz} />
    </section>
  );
}
