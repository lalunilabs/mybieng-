import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import '../styles/colors.css';
import Providers from '@/components/Providers';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
// import { EngagementProvider } from '@/components/providers/EngagementProvider';
// import ScrollAnimations from '@/components/ui/ScrollAnimations';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import Footer from '@/components/Footer';
import { PageTransitionWrapper } from '@/components/layout/PageTransitionWrapper';
import { Toaster } from 'sonner';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';
import { AdvancedStructuredData } from '@/components/seo/AdvancedStructuredData';
import { CookieConsent } from '@/components/legal/CookieConsent';
import { CookiePreferencesButton } from '@/components/legal/CookiePreferencesButton';
import { WorldClassScroll } from '@/components/ui/WorldClassScroll';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
const GOOGLE_FONTS_STYLESHEET =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Unbounded:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?:;()[]{}"\'-–—…';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_DOMAIN),
  applicationName: 'MyBeing - Personal Health Environment Platform',
  category: 'Self-Discovery & Psychology',
  title: {
    default: 'MyBeing - #1 Personal Health Environment Platform | Self-Discovery Quizzes & AI Insights',
    template: '%s | MyBeing - World-Class Personal Health Environment',
  },
  description:
    'MyBeing - The world\'s leading Personal Health Environment platform. Discover your true self through scientifically-validated quizzes, advanced behavioral pattern analysis, and cutting-edge AI-powered insights. Join thousands transforming their lives with MyBeing\'s research-backed assessment tools, personalized growth strategies, and expert-guided self-discovery journey.',
  keywords: [
    'MyBeing',
    'MyBeing official',
    'MyBeing platform',
    'MyBeing website',
    'MyBeing app',
    'MyBeing personal health environment',
    'MyBeing self discovery',
    'MyBeing quizzes',
    'MyBeing assessment',
    'MyBeing behavioral patterns',
    'MyBeing cognitive analysis',
    'MyBeing psychology',
    'MyBeing insights',
    'MyBeing growth',
    'MyBeing wellness',
    'MyBeing mental health',
    'MyBeing Dr N',
    'MyBeing Meum Labs',
    'Personal Health Environment',
    'self-discovery platform',
    'behavioral assessment tools',
    'psychology quizzes online',
    'cognitive pattern analysis',
    'personal growth platform',
    'self-awareness assessment',
    'research-backed psychology',
    'mental health tracking',
    'behavioral insights',
    'wellbeing platform',
    'longitudinal health tracking',
  ],
  authors: [{ name: 'Dr N', url: `${BASE_DOMAIN}/about` }],
  publisher: 'Meum Labs',
  alternates: {
    canonical: BASE_DOMAIN,
    languages: {
      'en-IN': `${BASE_DOMAIN}/`,
      'en-US': `${BASE_DOMAIN}/`,
      'x-default': `${BASE_DOMAIN}/`,
    },
  },
  openGraph: {
    title: 'MyBeing - #1 Personal Health Environment Platform | Transform Your Life',
    description: 'MyBeing - The world\'s leading Personal Health Environment platform. Join thousands discovering their true selves through scientifically-validated quizzes, AI-powered insights, and expert-guided growth. Start your transformation today.',
    url: BASE_DOMAIN,
    siteName: 'MyBeing - World-Class Personal Health Environment',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MyBeing - Official Personal Health Environment Platform',
      },
    ],
    locale: 'en_IN',
    alternateLocale: ['en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyBeing - #1 Personal Health Environment Platform',
    description: 'MyBeing - Transform your life with scientifically-validated quizzes, AI-powered insights, and expert-guided growth. Join thousands discovering their true potential.',
    images: ['/og-image.jpg'],
    creator: '@mybeing',
    site: '@mybeing',
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
    google: process.env.GOOGLE_SITE_VERIFICATION || 'mybeing-site-verification',
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
    name: 'Meum Labs',
    alternateName: ['MyBeing', 'MyBeing by Meum Labs'],
    url: base,
    logo: `${base}/apple-touch-icon.png`,
    description: 'Meum Labs creates MyBeing, a Personal Health Environment platform for self-discovery and behavioral pattern analysis.',
    founder: {
      '@type': 'Person',
      name: 'Dr N',
      jobTitle: 'Founder & Research Director'
    },
    knowsAbout: [
      'Personal Health Environment',
      'Behavioral Psychology', 
      'Cognitive Dissonance',
      'Self-Discovery',
      'Mental Health Assessment'
    ]
  };
  const knowledgeGraphJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Dr N',
    url: `${base}/about`,
    jobTitle: 'Founder & Research Director, Meum Labs',
    sameAs: [
      'https://www.linkedin.com/in/mybeing',
      'https://www.instagram.com/mybeing',
      `${base}/research`,
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Meum Labs',
      alternateName: 'MyBeing by Meum Labs',
      url: base,
    },
  };
  return (
    <html lang="en" className="font-sans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={GOOGLE_FONTS_STYLESHEET} />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        {/* Canonical domain: mybeing.in (set NEXT_PUBLIC_DOMAIN to override in prod) */}
        {/* Google AdSense Auto Ads */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1282817991856264"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(knowledgeGraphJsonLd) }}
        />
        
        <AdvancedStructuredData />
        
        {/* Termly Cookie Consent & Resource Blocker */}
        <script 
          src="https://app.termly.io/resource-blocker/036d8f5a-3210-4d73-b5ef-f78efbae5c0b?autoBlock=on"
          async
        />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <Providers>
            <PageTransitionWrapper>
              <div className="min-h-screen flex flex-col">
                {/* Skip to content link for accessibility */}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[1000] focus:bg-primary focus:text-white focus:px-3 focus:py-2 focus:rounded"
                >
                  Skip to content
                </a>
                <NavbarWrapper />
                <main id="main-content" className="flex-1 pt-16" role="main">
                  {children}
                </main>
                <Footer />
              </div>
            </PageTransitionWrapper>
            <Toaster position="top-right" />
            <CookieConsent />
            <CookiePreferencesButton />
            <WorldClassScroll />
            <Suspense fallback={null}>
              <GoogleAnalytics />
            </Suspense>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
