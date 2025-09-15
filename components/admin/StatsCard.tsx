'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/lib/animations';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  default: 'bg-white border border-gray-200 text-gray-900',
  success: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 text-green-900',
  warning: 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 text-yellow-900',
  error: 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 text-red-900',
  gradient: 'bg-gradient-to-br from-brand-500 via-purple-600 to-pink-600 text-white border-0'
};

const sizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  ({ 
    className,
    title,
    value,
    change,
    icon,
    variant = 'default',
    size = 'md',
    ...props 
  }, ref) => {
    const animationRef = useScrollAnimation('animate-fade-in-up');
    
    const getTrendIcon = (changeValue: number) => {
      if (changeValue > 0) return <TrendingUp className="w-4 h-4" />;
      if (changeValue < 0) return <TrendingDown className="w-4 h-4" />;
      return <Minus className="w-4 h-4" />;
    };

    const getTrendColor = (changeValue: number) => {
      if (changeValue > 0) return 'text-green-600 bg-green-100';
      if (changeValue < 0) return 'text-red-600 bg-red-100';
      return 'text-gray-600 bg-gray-100';
    };

    return (
      <div
        ref={animationRef as React.RefObject<HTMLDivElement>}
        className={cn(
          'opacity-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={cn(
              'text-sm font-medium',
              variant === 'gradient' ? 'text-white/80' : 'text-gray-600'
            )}>
              {title}
            </p>
            <p className={cn(
              'text-2xl font-bold mt-1',
              variant === 'gradient' ? 'text-white' : 'text-gray-900'
            )}>
              {value}
            </p>
          </div>
          
          {icon && (
            <div className={cn(
              'p-3 rounded-lg',
              variant === 'gradient' 
                ? 'bg-white/20' 
                : variant === 'success' 
                ? 'bg-green-100 text-green-600'
                : variant === 'warning'
                ? 'bg-yellow-100 text-yellow-600'
                : variant === 'error'
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600'
            )}>
              {icon}
            </div>
          )}
        </div>

        {change && (
          <div className="mt-4 flex items-center">
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
              variant === 'gradient' ? 'bg-white/20 text-white' : getTrendColor(change.value)
            )}>
              {getTrendIcon(change.value)}
              {Math.abs(change.value)}%
            </span>
            <span className={cn(
              'ml-2 text-xs',
              variant === 'gradient' ? 'text-white/70' : 'text-gray-500'
            )}>
              vs {change.period}
            </span>
          </div>
        )}
      </div>
    );
  }
);

StatsCard.displayName = 'StatsCard';
