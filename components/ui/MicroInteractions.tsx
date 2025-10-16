'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Micro-Interactions Library
 * Production-ready components for smooth, delightful user feedback
 */

// 1. Press Animation - Haptic-style feedback for buttons
interface PressProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Press({ children, className, disabled, ...props }: PressProps) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
      className={cn(
        "relative transition-colors",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// 2. Magnetic Button - Follows cursor on hover (desktop)
interface MagneticProps extends PressProps {
  strength?: number;
}

export function Magnetic({ children, strength = 0.3, className, disabled, ...props }: MagneticProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { 
        scale: 1.05,
      }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      className={cn(
        "relative",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// 3. Ripple Effect - Material Design inspired
interface RippleProps {
  className?: string;
  color?: string;
}

export function Ripple({ className, color = "rgba(255, 255, 255, 0.4)" }: RippleProps) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "absolute rounded-full pointer-events-none",
        className
      )}
      style={{ backgroundColor: color }}
    />
  );
}

// 4. Fade In - Entrance animation
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 0.5, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.1, 0.25, 1] // Custom easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 5. Slide In - Directional entrance
interface SlideInProps extends FadeInProps {
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
}

export function SlideIn({ 
  children, 
  direction = 'up', 
  distance = 30,
  delay = 0, 
  duration = 0.6, 
  className 
}: SlideInProps) {
  const directions = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 6. Scale In - Zoom entrance
export function ScaleIn({ children, delay = 0, duration = 0.4, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration, 
        delay,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 7. Bounce In - Playful entrance
export function BounceIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 8. Stagger Children - Sequential animation
interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function Stagger({ children, staggerDelay = 0.1, className }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 9. Pulse - Attention grabber
interface PulseProps {
  children: ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export function Pulse({ children, scale = 1.05, duration = 2, className }: PulseProps) {
  return (
    <motion.div
      animate={{ 
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 10. Shake - Error indication
export function Shake({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{ 
        x: [0, -10, 10, -10, 10, 0],
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 11. Float - Subtle hover effect
export function Float({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 12. Glow - Highlight effect
interface GlowProps {
  children: ReactNode;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function Glow({ children, color = '99, 102, 241', intensity = 'medium', className }: GlowProps) {
  const intensities = {
    low: `0 0 20px rgba(${color}, 0.3)`,
    medium: `0 0 30px rgba(${color}, 0.5)`,
    high: `0 0 40px rgba(${color}, 0.7)`
  };

  return (
    <motion.div
      whileHover={{
        boxShadow: intensities[intensity]
      }}
      transition={{ duration: 0.3 }}
      className={cn("transition-shadow", className)}
    >
      {children}
    </motion.div>
  );
}

// 13. Counter - Animated number
interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function Counter({ from = 0, to, duration = 1, className, suffix = '', prefix = '' }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = from;
    const endValue = to;
    const totalDuration = duration * 1000;

    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Easing function (easeOut)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      
      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  }, [from, to, duration]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {`${prefix}${displayValue}${suffix}`}
    </motion.span>
  );
}

// 14. Progress Bar - Smooth fill
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  barClassName,
  showLabel = false 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("relative w-full h-2 bg-gray-200 rounded-full overflow-hidden", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.1, 0.25, 1] 
        }}
        className={cn(
          "h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full",
          barClassName
        )}
      />
      {showLabel && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white"
        >
          {Math.round(percentage)}%
        </motion.span>
      )}
    </div>
  );
}

// 15. Skeleton Loader - Loading placeholder
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  animation = 'pulse' 
}: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full aspect-square',
    rectangular: 'w-full h-24 rounded-lg'
  };

  const animations = {
    pulse: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    wave: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <motion.div
      animate={animations[animation]}
      className={cn(
        "bg-gray-200",
        animation === 'wave' && "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
        variants[variant],
        className
      )}
    />
  );
}
