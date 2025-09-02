"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  animation?: 'pulse' | 'wave' | 'shimmer';
  lines?: number;
  width?: string | number;
  height?: string | number;
}

const skeletonVariants = {
  pulse: {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  wave: {
    x: ['-100%', '100%'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  shimmer: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export function SkeletonLoader({
  className,
  variant = 'text',
  animation = 'pulse',
  lines = 1,
  width,
  height
}: SkeletonProps) {
  const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded";
  
  const variantClasses = {
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-md",
    card: "rounded-lg"
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 && "w-3/4", // Last line shorter
              className
            )}
            style={{ 
              width: index === lines - 1 ? '75%' : width, 
              height: height || '1rem'
            }}
            variants={skeletonVariants}
            animate={animation}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animation === 'shimmer' && "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        className
      )}
      style={{ width, height }}
      variants={skeletonVariants}
      animate={animation}
    />
  );
}

// Predefined skeleton components for common use cases
export function QuizCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <div className="flex items-start justify-between mb-6">
        <SkeletonLoader variant="circular" width="3rem" height="3rem" />
        <div className="text-right space-y-2">
          <SkeletonLoader width="5rem" height="1.5rem" />
          <SkeletonLoader width="3rem" height="1rem" />
        </div>
      </div>
      
      <SkeletonLoader width="80%" height="1.5rem" className="mb-3" />
      <SkeletonLoader lines={3} className="mb-6" />
      
      <div className="space-y-2 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <SkeletonLoader variant="circular" width="1rem" height="1rem" />
            <SkeletonLoader width="70%" height="0.875rem" />
          </div>
        ))}
      </div>
      
      <SkeletonLoader width="100%" height="3rem" className="rounded-full" />
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Skeleton variant="rectangular" className="w-16 h-5" />
            <Skeleton variant="rectangular" className="w-12 h-5" />
          </div>
          <Skeleton variant="rectangular" className="w-20 h-5" />
        </div>
        <Skeleton variant="text" className="h-6 mb-3" />
        <Skeleton variant="text" lines={3} className="mb-6" />
        <div className="flex items-center justify-between">
          <Skeleton variant="rectangular" className="w-24 h-5" />
          <Skeleton variant="rectangular" className="w-20 h-8" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-100">
      {/* Header skeleton */}
      <div className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <Skeleton variant="rectangular" className="w-32 h-8" />
          <div className="flex items-center gap-4">
            <Skeleton variant="rectangular" className="w-20 h-8" />
            <Skeleton variant="rectangular" className="w-24 h-8" />
          </div>
        </div>
      </div>
      
      {/* Hero section skeleton */}
      <div className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Skeleton variant="text" className="h-12 mb-6" />
              <Skeleton variant="text" className="h-12 mb-6 w-4/5" />
              <Skeleton variant="text" lines={3} className="mb-8" />
              <div className="flex gap-4">
                <Skeleton variant="rectangular" className="w-32 h-12" />
                <Skeleton variant="rectangular" className="w-32 h-12" />
              </div>
            </div>
            <div className="flex justify-center">
              <Skeleton variant="rectangular" className="w-80 h-96 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
