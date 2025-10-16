'use client';

import { useState, useEffect, useRef, TouchEvent } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Mobile-First UI Components
 * Optimized for touch interactions and mobile UX patterns
 */

// 1. Bottom Sheet Modal (Better than center modals on mobile)
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[];
  defaultSnap?: number;
}

export function BottomSheet({ 
  isOpen, 
  onClose, 
  children, 
  title,
  snapPoints = [0.9, 0.5],
  defaultSnap = 0.9
}: BottomSheetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black z-40"
        style={{ opacity }}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ y }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-white rounded-t-3xl shadow-2xl",
          "max-h-[90vh] flex flex-col"
        )}
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </motion.div>
    </>
  );
}

// 2. Swipeable Cards (Tinder-style)
interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export function SwipeableCard({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  className 
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipeRight?.();
    } else if (info.offset.x < -100) {
      onSwipeLeft?.();
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      className={cn("cursor-grab active:cursor-grabbing", className)}
    >
      {children}
    </motion.div>
  );
}

// 3. Pull to Refresh
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 80 
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      // Store initial touch position
      containerRef.current.setAttribute('data-touch-start', e.touches[0].clientY.toString());
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;

    const touchStart = parseFloat(container.getAttribute('data-touch-start') || '0');
    const touchCurrent = e.touches[0].clientY;
    const distance = Math.max(0, touchCurrent - touchStart);

    if (distance > 0) {
      setPullDistance(Math.min(distance, threshold * 1.5));
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-auto h-full"
    >
      {/* Pull indicator */}
      <motion.div
        animate={{ height: pullDistance }}
        className="flex items-center justify-center bg-gray-50"
      >
        {pullDistance > threshold ? (
          <span className="text-sm text-green-600 font-medium">Release to refresh</span>
        ) : pullDistance > 0 ? (
          <span className="text-sm text-gray-500">Pull to refresh</span>
        ) : null}
      </motion.div>

      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 flex justify-center py-4 bg-gray-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-gray-300 border-t-indigo-500 rounded-full"
          />
        </div>
      )}

      {children}
    </div>
  );
}

// 4. Touch-Friendly Button (44x44px minimum)
interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function TouchButton({ 
  children, 
  variant = 'primary', 
  className,
  ...props 
}: TouchButtonProps) {
  const variants = {
    primary: 'bg-indigo-500 text-white active:bg-indigo-600',
    secondary: 'bg-gray-200 text-gray-900 active:bg-gray-300',
    ghost: 'bg-transparent text-gray-700 active:bg-gray-100'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={cn(
        "min-h-[44px] min-w-[44px] px-6 py-3 rounded-xl font-medium",
        "transition-colors touch-manipulation",
        variants[variant],
        className
      )}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      form={props.form}
      formAction={props.formAction}
    >
      {children}
    </motion.button>
  );
}

// 5. Sticky Action Bar (Bottom of screen)
interface StickyActionBarProps {
  children: React.ReactNode;
  show?: boolean;
}

export function StickyActionBar({ children, show = true }: StickyActionBarProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: show ? 0 : 100 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30",
        "bg-white border-t border-gray-200 shadow-lg",
        "px-6 py-4 safe-area-bottom"
      )}
    >
      {children}
    </motion.div>
  );
}

// 6. Horizontal Scroll Snap
interface ScrollSnapProps {
  children: React.ReactNode[];
  className?: string;
}

export function ScrollSnap({ children, className }: ScrollSnapProps) {
  return (
    <div className={cn(
      "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-6 py-4",
      "-mx-6",
      className
    )}>
      {children.map((child, i) => (
        <div key={i} className="snap-center flex-shrink-0 first:pl-6 last:pr-6">
          {child}
        </div>
      ))}
    </div>
  );
}

// 7. Expandable FAB (Floating Action Button)
interface FABProps {
  icon: React.ReactNode;
  actions?: { icon: React.ReactNode; label: string; onClick: () => void }[];
  onClick?: () => void;
}

export function FloatingActionButton({ icon, actions, onClick }: FABProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-3">
      {/* Actions */}
      {isExpanded && actions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          {actions.map((action, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                action.onClick();
                setIsExpanded(false);
              }}
              className="flex items-center gap-3 bg-white rounded-full shadow-lg pl-4 pr-6 py-3 hover:shadow-xl transition-shadow"
            >
              <div className="text-indigo-500">{action.icon}</div>
              <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                {action.label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Main FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (actions) {
            setIsExpanded(!isExpanded);
          } else {
            onClick?.();
          }
        }}
        className={cn(
          "w-14 h-14 rounded-full shadow-2xl",
          "bg-gradient-to-br from-indigo-500 to-purple-600",
          "text-white flex items-center justify-center",
          "hover:shadow-xl transition-shadow"
        )}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </motion.button>
    </div>
  );
}

// 8. Safe Area Helper (for iOS notch)
export function SafeArea({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("pb-safe pt-safe", className)}>
      {children}
    </div>
  );
}

// 9. Haptic Feedback Hook (Web Vibration API)
export function useHapticFeedback() {
  const vibrate = (pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return {
    light: () => vibrate(10),
    medium: () => vibrate(20),
    heavy: () => vibrate(30),
    success: () => vibrate([10, 50, 10]),
    error: () => vibrate([50, 100, 50]),
    warning: () => vibrate([20, 50, 20])
  };
}

// 10. Mobile Stepper (Better than tabs on mobile)
interface MobileStepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function MobileStepper({ steps, currentStep, onStepClick }: MobileStepperProps) {
  return (
    <div className="flex items-center justify-between w-full overflow-x-auto">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <button
            key={index}
            onClick={() => onStepClick?.(index)}
            disabled={!isCompleted && !isActive}
            className={cn(
              "flex-1 min-w-[80px] text-center py-3 border-b-2 transition-colors text-sm font-medium",
              isActive && "border-indigo-500 text-indigo-600",
              isCompleted && "border-green-500 text-green-600",
              !isActive && !isCompleted && "border-gray-200 text-gray-400"
            )}
          >
            {step}
          </button>
        );
      })}
    </div>
  );
}
