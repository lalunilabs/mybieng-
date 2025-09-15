import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import '../styles/colors.css';
import { Inter, Playfair_Display } from 'next/font/google';
import Providers from '@/components/Providers';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
// import { EngagementProvider } from '@/components/providers/EngagementProvider';
// import ScrollAnimations from '@/components/ui/ScrollAnimations';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap' 
});

const BASE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';

export const metadata: Metadata = {
  title: {
    default: 'MyBeing — Understand Your Patterns, Improve Your Being',
    template: '%s | MyBeing',
  },
  description: 'Discover yourself through scientifically-backed quizzes and personalized insights. Track your growth, explore patterns, and unlock your potential with AI-powered guidance.',
  keywords: ['psychology', 'self-discovery', 'personality assessment', 'cognitive patterns', 'behavioral analysis', 'Dr N', 'research-backed', 'evidence-based'],
  authors: [{ name: 'Dr N', url: `${BASE_DOMAIN}/about` }],
  creator: 'Dr N',
  publisher: 'MyBeing',
  metadataBase: new URL(BASE_DOMAIN),
  openGraph: {
    title: 'MyBeing by Dr N - Evidence-Based Self-Discovery',
    description: 'Discover patterns in your thoughts, behaviors, and personal growth through scientifically-backed psychological assessments.',
    url: BASE_DOMAIN,
    siteName: 'MyBeing',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MyBeing - Self-Discovery Platform by Dr N',
      },
    ],
    locale: 'en_IN',
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
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const base = BASE_DOMAIN;
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MyBeing',
    url: base,
    publisher: { '@type': 'Organization', name: 'MyBeing' },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${base}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
  };
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MyBeing',
    url: base,
    logo: `${base}/apple-touch-icon.png`,
  };
  return (
    <html lang="en" className={`${inter.className} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        {/* Canonical domain: mybeing.in (set NEXT_PUBLIC_DOMAIN to override in prod) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <Providers>
            <div className="min-h-screen flex flex-col">
              {/* Skip to content link for accessibility */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[1000] focus:bg-primary focus:text-white focus:px-3 focus:py-2 focus:rounded"
              >
                Skip to content
              </a>
              <Navbar />
              <main id="main-content" className="flex-1 pt-16" role="main">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </ErrorBoundary>
        <Toaster richColors position="top-right" />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
