'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnhancedLoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient' | 'pulse' | 'dots' | 'bars' | 'orbit';
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'indigo';
  className?: string;
  text?: string;
}

export function EnhancedLoadingSpinner({
  size = 'md',
  variant = 'default',
  color = 'purple',
  className,
  text
}: EnhancedLoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    pink: 'text-pink-600',
    indigo: 'text-indigo-600'
  };

  const gradientClasses = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500',
    pink: 'from-pink-500 to-rose-500',
    indigo: 'from-indigo-500 to-purple-500'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'gradient':
        return (
          <motion.div
            className={cn(
              sizeClasses[size],
              'rounded-full bg-gradient-to-r',
              gradientClasses[color],
              className
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              background: `conic-gradient(from 0deg, transparent, currentColor, transparent)`
            }}
          />
        );

      case 'pulse':
        return (
          <motion.div
            className={cn(
              sizeClasses[size],
              'rounded-full bg-current',
              colorClasses[color],
              className
            )}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          />
        );

      case 'dots':
        return (
          <div className={cn('flex space-x-1', className)}>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full bg-current',
                  colorClasses[color]
                )}
                animate={{ 
                  y: [0, -8, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity, 
                  delay: index * 0.2,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div className={cn('flex space-x-1', className)}>
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className={cn(
                  'w-1 bg-current rounded-full',
                  colorClasses[color]
                )}
                animate={{ 
                  height: ['8px', '24px', '8px'],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  delay: index * 0.1,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        );

      case 'orbit':
        return (
          <div className={cn('relative', sizeClasses[size], className)}>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-current"
              style={{ borderTopColor: 'currentColor' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-1 rounded-full border-2 border-transparent border-b-current opacity-60"
              style={{ borderBottomColor: 'currentColor' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <div className={cn(
              'absolute inset-2 rounded-full bg-current opacity-20',
              colorClasses[color]
            )} />
          </div>
        );

      default:
        return (
          <motion.div
            className={cn(
              sizeClasses[size],
              'rounded-full border-2 border-transparent border-t-current',
              colorClasses[color],
              className
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        );
    }
  };

  return (
    <div
      className="flex flex-col items-center space-y-3"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={text || 'Loading'}
    >
      <div className={cn(colorClasses[color])}>
        {renderSpinner()}
      </div>
      {/* Screen reader fallback text */}
      <span className="sr-only">{text || 'Loading'}</span>
      {text && (
        <motion.p
          className="text-sm font-medium text-gray-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Skeleton loading components
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="bg-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-300 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-3 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gray-300 rounded" />
          <div className="h-3 bg-gray-300 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ 
  lines = 3, 
  className 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={cn('animate-pulse space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-4 bg-gray-200 rounded',
            index === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ 
  size = 'md',
  className 
}: { 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={cn(
      'animate-pulse bg-gray-200 rounded-full',
      sizeClasses[size],
      className
    )} />
  );
}

// Page transition wrapper
export function PageTransition({ 
  children,
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger animation wrapper
export function StaggerContainer({ 
  children,
  className,
  staggerDelay = 0.1 
}: { 
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ 
  children,
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
