"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

export type PrimaryCTAProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'gradient' | 'premium' | 'uiverse';
  surface?: string; // e.g., 'navbar_desktop', 'hero', 'start_pricing'
  eventName?: string; // defaults to 'start_journey'
  analytics?: Record<string, any>;
  onClick?: (e: React.MouseEvent) => void;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
};

export function PrimaryCTA({
  href,
  children,
  className,
  size = 'md',
  variant = 'gradient',
  surface,
  eventName = 'start_journey',
  analytics,
  onClick,
  target,
  rel,
}: PrimaryCTAProps) {
  const handleClick = (e: React.MouseEvent) => {
    try {
      trackEvent(eventName, {
        surface,
        ...analytics,
      });
    } catch {}
    onClick?.(e);
  };

  if (href) {
    return (
      <Button variant={variant} size={size} className={className} asChild>
        <Link href={href} onClick={handleClick} target={target} rel={rel}>
          {children}
        </Link>
      </Button>
    );
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleClick}>
      {children}
    </Button>
  );
}

export default PrimaryCTA;
