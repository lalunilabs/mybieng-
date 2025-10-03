import MagazineLanding from '@/components/landing/MagazineLanding';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research‑Backed Self‑Discovery | MyBeing',
  description:
    'Understand your patterns with research‑backed quizzes and an AI companion that knows your results. No right/wrong answers. Start your journey at MyBeing.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'MyBeing — Research‑Backed Self‑Discovery',
    description:
      'Assessments, insights, and an AI companion for steady personal growth. No right/wrong answers.',
    url: '/',
    type: 'website',
    images: [
      '/api/og?title=MyBeing&subtitle=Research%E2%80%91Backed%20Self%E2%80%91Discovery',
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyBeing — Research‑Backed Self‑Discovery',
    description:
      'Assessments, insights, and an AI companion for steady personal growth. No right/wrong answers.',
    images: [
      '/api/og?title=MyBeing&subtitle=Research%E2%80%91Backed%20Self%E2%80%91Discovery',
    ],
  },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return <MagazineLanding />;
}
