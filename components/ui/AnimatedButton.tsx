'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'glow';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  animation?: 'none' | 'bounce' | 'pulse' | 'wiggle' | 'scale';
  ripple?: boolean;
}

const buttonVariants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-md hover:shadow-lg',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-md hover:shadow-lg',
  outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50 focus:ring-brand-500',
  ghost: 'text-brand-600 hover:bg-brand-50 focus:ring-brand-500',
  gradient: 'bg-gradient-to-r from-brand-500 via-purple-600 to-pink-600 text-white hover:from-brand-600 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl',
  glow: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-lg hover:shadow-glow hover:shadow-brand-500/50'
};

const buttonSizes = {
  xs: 'px-2 py-1 text-xs rounded-md',
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
  xl: 'px-8 py-4 text-lg rounded-xl'
};

const animations = {
  none: '',
  bounce: 'hover:animate-bounce-subtle',
  pulse: 'hover:animate-pulse-subtle',
  wiggle: 'hover:animate-wiggle',
  scale: 'hover:scale-105 active:scale-95'
};

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    iconPosition = 'left',
    animation = 'scale',
    ripple = true,
    children,
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !loading) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.className = 'absolute rounded-full bg-white/30 pointer-events-none animate-ping';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }
      
      if (onClick && !disabled && !loading) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden',
          // Variant styles
          buttonVariants[variant],
          // Size styles
          buttonSizes[size],
          // Animation styles
          animations[animation],
          // Loading state
          loading && 'pointer-events-none',
          className
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <LoadingSpinner 
            size="xs" 
            color={variant === 'outline' || variant === 'ghost' ? 'brand' : 'primary'}
            className="mr-2" 
          />
        )}
        
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2 flex-shrink-0">{icon}</span>
        )}
        
        <span className={loading ? 'opacity-0' : ''}>{children}</span>
        
        {icon && iconPosition === 'right' && !loading && (
          <span className="ml-2 flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
