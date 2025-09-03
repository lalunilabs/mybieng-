import type { Metadata } from 'next';
import './globals.css';
import '../styles/colors.css';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import Container from '@/components/Container';
import Providers from '@/components/Providers';
import ScrollAnimations from '@/components/ScrollAnimations';
import EngagementProvider from '@/components/EngagementProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MyBeing by Dr N - Evidence-Based Self-Discovery Platform',
  description: 'Discover patterns in your thoughts, behaviors, and personal growth through scientifically-backed psychological assessments by Dr N. Take research-validated quizzes and unlock personalized insights.',
  keywords: 'psychology, self-discovery, personality assessment, cognitive patterns, behavioral analysis, Dr N, research-backed, evidence-based',
  authors: [{ name: 'Dr N', url: 'https://mybeing.com/about' }],
  creator: 'Dr N',
  publisher: 'MyBeing',
  openGraph: {
    title: 'MyBeing by Dr N - Evidence-Based Self-Discovery',
    description: 'Discover patterns in your thoughts, behaviors, and personal growth through scientifically-backed psychological assessments.',
    url: 'https://mybeing.com',
    siteName: 'MyBeing',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MyBeing - Self-Discovery Platform by Dr N',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyBeing by Dr N - Evidence-Based Self-Discovery',
    description: 'Discover patterns in your thoughts, behaviors, and personal growth through scientifically-backed psychological assessments.',
    images: ['/og-image.jpg'],
    creator: '@mybeing',
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
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <EngagementProvider>
            <ScrollAnimations />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </EngagementProvider>
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
