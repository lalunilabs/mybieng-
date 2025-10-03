import { loadAllQuizzes } from '@/lib/content';
import AdSlot from '@/components/ads/AdSlot';
import type { Metadata } from 'next';
import QuizzesListClient from '@/components/quizzes/QuizzesListClient';

export const revalidate = 600; // Rebuild every 10 minutes

export const metadata: Metadata = {
  title: 'Quizzes | MyBeing',
  description: 'Research-backed self-discovery assessments. No right/wrong answers — designed for pattern recognition and personal insight.',
  alternates: { canonical: '/quizzes', languages: { 'en-IN': '/quizzes', 'en-US': '/quizzes', 'x-default': '/quizzes' } },
  openGraph: { 
    title: 'MyBeing Quizzes', 
    description: 'Assessments for insight, not judgment.', 
    url: '/quizzes', 
    type: 'website',
    images: ['/api/og?title=MyBeing%20Quizzes&subtitle=Assessments%20for%20insight%2C%20not%20judgment.']
  },
  twitter: { 
    card: 'summary_large_image', 
    title: 'MyBeing Quizzes', 
    description: 'Assessments for insight, not judgment.',
    images: ['/api/og?title=MyBeing%20Quizzes&subtitle=Assessments%20for%20insight%2C%20not%20judgment.']
  },
  robots: { index: true, follow: true },
};

export default function QuizzesPage() {
  const now = Date.now();
  const quizzes = loadAllQuizzes()
    .filter(q => q.published !== false && (!q.publishedAt || new Date(q.publishedAt).getTime() <= now))
    .sort((a, b) => a.title.localeCompare(b.title));

  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Quizzes', item: `${base}/quizzes` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
      <QuizzesListClient quizzes={quizzes} />
      {/* No ads on quiz listing - keeping experience clean */}
    </>
  );
}
