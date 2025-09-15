'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'brain' | 'gradient' | 'skeleton';
  className?: string;
  color?: 'brand' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  brand: 'text-brand-600 border-brand-600',
  primary: 'text-blue-600 border-blue-600',
  secondary: 'text-gray-600 border-gray-600',
  success: 'text-green-600 border-green-600',
  warning: 'text-yellow-600 border-yellow-600',
  error: 'text-red-600 border-red-600',
};

export function LoadingSpinner({ size = 'md', variant = 'default', color = 'brand', className }: LoadingSpinnerProps) {
  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full animate-bounce",
              color === 'brand' ? 'bg-brand-600' :
              color === 'primary' ? 'bg-blue-600' :
              color === 'secondary' ? 'bg-gray-600' :
              color === 'success' ? 'bg-green-600' :
              color === 'warning' ? 'bg-yellow-600' :
              'bg-red-600'
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div
        className={cn(
          "rounded-full animate-pulse",
          sizeClasses[size],
          color === 'brand' ? 'bg-brand-600' :
          color === 'primary' ? 'bg-blue-600' :
          color === 'secondary' ? 'bg-gray-600' :
          color === 'success' ? 'bg-green-600' :
          color === 'warning' ? 'bg-yellow-600' :
          'bg-red-600',
          className
        )}
      />
    );
  }

  if (variant === 'brain') {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <div className={cn(
          "absolute inset-0 border-2 rounded-full animate-spin",
          colorClasses[color]
        )} style={{ animationDuration: '2s' }} />
        <div className={cn(
          "absolute inset-1 border-2 rounded-full animate-spin",
          color === 'brand' ? 'border-blue-500' : 'border-purple-500'
        )} style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className={cn(
          "absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1 -translate-y-1 rounded-full animate-pulse",
          color === 'brand' ? 'bg-brand-600' :
          color === 'primary' ? 'bg-blue-600' :
          color === 'secondary' ? 'bg-gray-600' :
          color === 'success' ? 'bg-green-600' :
          color === 'warning' ? 'bg-yellow-600' :
          'bg-red-600'
        )} />
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 animate-spin" />
        <div className="absolute inset-1 rounded-full bg-white" />
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn(
        "rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer",
        sizeClasses[size],
        className
      )} />
    );
  }

  return (
    <div
      className={cn(
        "border-2 border-t-transparent rounded-full animate-spin",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
}
