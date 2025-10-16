'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Quiz Progress Indicators
 * Beautiful progress visualization for quiz experience
 */

interface ProgressIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

// 1. Linear Progress Bar with Steps
export function LinearProgress({ current, total, className }: ProgressIndicatorProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span className="font-medium">Question {current} of {total}</span>
        <span className="text-xs">{Math.round(percentage)}%</span>
      </div>
      
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 0.5, 
            ease: [0.25, 0.1, 0.25, 1] 
          }}
          className="absolute h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
        />
        
        {/* Animated shimmer effect */}
        <motion.div
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </div>
    </div>
  );
}

// 2. Circular Progress
export function CircularProgress({ current, total, className }: ProgressIndicatorProps) {
  const percentage = (current / total) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg className="transform -rotate-90" width="100" height="100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          key={current}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold text-gray-900"
        >
          {current}
        </motion.span>
        <span className="text-xs text-gray-500">of {total}</span>
      </div>
    </div>
  );
}

// 3. Step Indicators (Breadcrumb style)
export function StepIndicator({ current, total, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => {
        const isCompleted = step < current;
        const isCurrent = step === current;
        
        return (
          <div key={step} className="flex items-center">
            <motion.div
              initial={false}
              animate={{
                scale: isCurrent ? 1.2 : 1,
                backgroundColor: isCompleted || isCurrent ? '#6366f1' : '#e5e7eb'
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-full",
                "transition-shadow",
                isCurrent && "shadow-lg shadow-indigo-500/50"
              )}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              ) : (
                <span className={cn(
                  "text-sm font-medium",
                  isCurrent ? "text-white" : "text-gray-400"
                )}>
                  {step}
                </span>
              )}
            </motion.div>
            
            {step < total && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: step < current ? 1 : 0,
                  backgroundColor: step < current ? '#6366f1' : '#e5e7eb'
                }}
                transition={{ duration: 0.3 }}
                className="h-0.5 w-8 mx-1"
                style={{ transformOrigin: 'left' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// 4. Minimal Dot Indicator
export function DotIndicator({ current, total, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => {
        const isActive = step === current;
        const isPast = step < current;
        
        return (
          <motion.div
            key={step}
            animate={{
              width: isActive ? '24px' : '6px',
              backgroundColor: isActive || isPast ? '#6366f1' : '#d1d5db'
            }}
            transition={{ duration: 0.3 }}
            className="h-1.5 rounded-full"
          />
        );
      })}
    </div>
  );
}

// 5. Percentage Ring (Compact)
export function PercentageRing({ current, total, className }: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative w-12 h-12">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            stroke="#6366f1"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 125.6 }}
            animate={{ 
              strokeDashoffset: 125.6 - (percentage / 100) * 125.6 
            }}
            transition={{ duration: 0.5 }}
            strokeDasharray="125.6"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            key={percentage}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-xs font-bold text-gray-900"
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
    </div>
  );
}

// 6. Animated Wave Progress (Creative)
export function WaveProgress({ current, total, className }: ProgressIndicatorProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={cn("relative h-16 bg-gray-100 rounded-2xl overflow-hidden", className)}>
      <motion.div
        initial={{ height: '0%' }}
        animate={{ height: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-500 to-purple-400"
      >
        {/* Animated wave */}
        <motion.div
          animate={{
            x: ['-100%', '0%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 100px)'
          }}
        />
      </motion.div>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          key={current}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center z-10"
        >
          <div className="text-2xl font-bold text-gray-900 mix-blend-difference">
            {current}/{total}
          </div>
          <div className="text-xs text-gray-600 mix-blend-difference">
            Questions
          </div>
        </motion.div>
      </div>
    </div>
  );
}
