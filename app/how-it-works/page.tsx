import HowItWorks from '@/components/landing/HowItWorks';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'How It Works | MyBeing',
  description:
    'Assessments reveal patterns, not right/wrong answers. Discuss results with an AI companion and make steady progress with weekly and monthly modules.',
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    title: 'How MyBeing Works',
    description:
      'Research-backed assessments and an AI companion for insight and action — with weekly and monthly pacing.',
    url: '/how-it-works',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <HowItWorks />
    </div>
  );
}
