'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'brand' | 'outline' | 'premium';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animated?: boolean;
  pulse?: boolean;
}

const variants = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  secondary: 'bg-gray-600 text-white border-gray-600',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  brand: 'bg-lilac-100 text-lilac-800 border-lilac-200',
  outline: 'bg-transparent text-gray-600 border-gray-300',
  premium: 'bg-gradient-to-r from-lilac-100 to-lilac-50 text-lilac-800 border-lilac-200'
};

const sizes = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-sm'
};

const roundings = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full'
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className,
    variant = 'default',
    size = 'sm',
    rounded = 'md',
    animated = false,
    pulse = false,
    children,
    ...props 
  }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium border transition-all duration-200',
          variants[variant],
          sizes[size],
          roundings[rounded],
          animated && 'hover:scale-105 hover:shadow-sm',
          pulse && 'animate-pulse',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
