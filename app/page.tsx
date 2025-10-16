import MagazineLanding from '@/components/landing/MagazineLanding';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MyBeing - Research-Backed Self-Discovery Platform | Psychology Quizzes & Behavioral Insights by Dr N',
  description:
    'Discover your behavioral patterns with MyBeing\'s scientifically-validated psychology quizzes and assessments. Created by Dr N, our research-backed platform helps you understand yourself through cognitive dissonance analysis, stress patterns, and motivation profiling. No right/wrong answers - just pure insight into your mind.',
  keywords: [
    'self-discovery platform',
    'psychology quizzes',
    'behavioral patterns',
    'cognitive dissonance test',
    'stress assessment',
    'motivation quiz',
    'research-backed psychology',
    'Dr N',
    'MyBeing',
    'personality assessment',
    'mental health insights',
    'behavioral psychology',
    'self-awareness tools',
    'psychological assessment online'
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'MyBeing - Research-Backed Self-Discovery Platform by Dr N',
    description:
      'Scientifically-validated psychology assessments and behavioral insights. Understand your patterns through research-backed quizzes. No judgment, just discovery.',
    url: '/',
    type: 'website',
    siteName: 'MyBeing',
    images: [
      {
        url: '/api/og?title=MyBeing&subtitle=Research-Backed%20Self-Discovery',
        width: 1200,
        height: 630,
        alt: 'MyBeing - Psychology Quizzes and Self-Discovery Platform'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyBeing - Research-Backed Self-Discovery by Dr N',
    description:
      'Scientifically-validated psychology assessments. Discover your behavioral patterns through research-backed quizzes.',
    images: [
      '/api/og?title=MyBeing&subtitle=Research-Backed%20Self-Discovery',
    ],
    creator: '@mybeing',
    site: '@mybeing'
  },
  robots: { 
    index: true, 
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
};

export default function HomePage() {
  return <MagazineLanding />;
}
