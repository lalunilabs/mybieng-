'use client';

import { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'gradient' | 'striped' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  color?: 'brand' | 'success' | 'warning' | 'error';
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
}

const variants = {
  default: 'bg-gray-200',
  gradient: 'bg-gradient-to-r from-gray-200 to-gray-300',
  striped: 'bg-gray-200 bg-stripes',
  glow: 'bg-gray-200 shadow-inner'
};

const sizes = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
};

const colors = {
  brand: 'bg-brand-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500'
};

const gradientColors = {
  brand: 'bg-gradient-to-r from-brand-400 to-brand-600',
  success: 'bg-gradient-to-r from-green-400 to-green-600',
  warning: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
  error: 'bg-gradient-to-r from-red-400 to-red-600'
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ 
    className,
    value,
    max = 100,
    variant = 'default',
    size = 'md',
    color = 'brand',
    animated = true,
    showLabel = false,
    label,
    ...props 
  }, ref) => {
    const [displayValue, setDisplayValue] = useState(0);
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    useEffect(() => {
      if (animated) {
        const timer = setTimeout(() => {
          setDisplayValue(percentage);
        }, 100);
        return () => clearTimeout(timer);
      } else {
        setDisplayValue(percentage);
      }
    }, [percentage, animated]);

    return (
      <div className={cn('w-full', className)} {...props} ref={ref}>
        {showLabel && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {label || 'Progress'}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        
        <div className={cn(
          'w-full rounded-full overflow-hidden',
          variants[variant],
          sizes[size]
        )}>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out',
              variant === 'gradient' ? gradientColors[color] : colors[color],
              animated && 'transform-gpu',
              variant === 'striped' && 'bg-stripes animate-stripes',
              variant === 'glow' && 'shadow-glow'
            )}
            style={{ 
              width: `${displayValue}%`,
              boxShadow: variant === 'glow' ? `0 0 10px ${color === 'brand' ? '#8b5cf6' : color === 'success' ? '#10b981' : color === 'warning' ? '#f59e0b' : '#ef4444'}` : undefined
            }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
