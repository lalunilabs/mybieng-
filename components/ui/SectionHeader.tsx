import * as React from 'react';
import { cn } from '@/lib/utils';

export type SectionHeaderProps = {
  overline?: React.ReactNode;
  title: string;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center';
  gradientClass?: string; // e.g. 'from-purple-500 to-indigo-500'
  className?: string;
  tone?: 'dark' | 'light';
};

export default function SectionHeader({
  overline,
  title,
  highlight,
  description,
  align = 'center',
  gradientClass = 'from-purple-500 to-indigo-500',
  className,
  tone = 'dark',
}: SectionHeaderProps) {
  const titleColor = tone === 'light' ? 'text-white' : 'text-gray-900';
  const descColor = tone === 'light' ? 'text-white/80' : 'text-gray-700';
  const overlineClasses =
    tone === 'light'
      ? 'inline-flex items-center px-4 py-2 rounded-full border border-white/30 bg-white/10 text-white shadow-sm'
      : 'inline-flex items-center px-4 py-2 rounded-full border border-purple-200 bg-white/80 text-purple-700 shadow-sm';
  return (
    <div
      className={cn(
        'mb-16',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      {overline && (
        <div className={cn(
          'text-sm font-medium',
          overlineClasses
        )}>
          {overline}
        </div>
      )}
      <h2 className={cn('mt-6 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight', titleColor)}>
        {title}
        {highlight && (
          <span className={cn('block bg-clip-text text-transparent bg-gradient-to-r', gradientClass)}>
            {highlight}
          </span>
        )}
      </h2>
      {description && (
        <p className={cn('mt-4 text-lg md:text-xl leading-relaxed', descColor, align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-3xl')}>
          {description}
        </p>
      )}
    </div>
  );
}
