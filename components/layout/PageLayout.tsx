'use client';

import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full' | 'none';
  paddingTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  background?: 'default' | 'white' | 'gray' | 'none';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
  none: '',
};

const paddingTopClasses = {
  none: 'pt-0',
  sm: 'pt-20',
  md: 'pt-24',
  lg: 'pt-28',
  xl: 'pt-32',
};

const backgroundClasses = {
  default: 'bg-gradient-to-br from-slate-50 via-white to-slate-50',
  white: 'bg-white',
  gray: 'bg-gray-50',
  none: '',
};

export function PageLayout({
  children,
  className = '',
  maxWidth = '7xl',
  paddingTop = 'none', // Changed default since navbar is handled by root layout
  fullScreen = false,
  background = 'default'
}: PageLayoutProps) {
  if (fullScreen) {
    return (
      <div className={`min-h-screen ${backgroundClasses[background]} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${backgroundClasses[background]}`}>
      <main className={`${paddingTopClasses[paddingTop]} ${className}`}>
        {maxWidth === 'none' ? (
          children
        ) : (
          <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8`}>
            {children}
          </div>
        )}
      </main>
    </div>
  );
}

// Magazine-style layout for articles with proper typography
export function MagazineLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <PageLayout 
      maxWidth="6xl"
      background="white"
      className={`py-12 ${className}`}
    >
      {children}
    </PageLayout>
  );
}

// Full-screen scrollable layout for quizzes (Medium-style)
export function FullScreenQuizLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <PageLayout 
      fullScreen
      maxWidth="none"
      background="none"
      className={`${className}`}
    >
      {children}
    </PageLayout>
  );
}

// Research dashboard layout
export function ResearchLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <PageLayout 
      maxWidth="7xl"
      className={`py-8 ${className}`}
    >
      {children}
    </PageLayout>
  );
}

// Home page layout
export function HomeLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <PageLayout 
      maxWidth="full"
      paddingTop="none"
      className={className}
    >
      {children}
    </PageLayout>
  );
}
