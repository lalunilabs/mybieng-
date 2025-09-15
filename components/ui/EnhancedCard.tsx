'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/lib/animations';

interface EnhancedCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'bordered' | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: 'none' | 'lift' | 'scale' | 'glow' | 'tilt';
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce';
  gradient?: 'brand' | 'sunset' | 'ocean' | 'forest' | 'purple';
}

const cardVariants = {
  default: 'bg-white border border-gray-200 shadow-sm',
  elevated: 'bg-white border-0 shadow-lg',
  glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-md',
  gradient: 'border-0 shadow-lg text-white',
  bordered: 'bg-white border-2 border-gray-200 shadow-sm',
  premium: 'bg-gradient-to-br from-white to-lilac-50 border border-lilac-100 shadow-md'
};

const cardSizes = {
  sm: 'p-4 rounded-lg',
  md: 'p-6 rounded-xl',
  lg: 'p-8 rounded-2xl',
  xl: 'p-10 rounded-3xl'
};

const hoverEffects = {
  none: '',
  lift: 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
  scale: 'transition-transform duration-300 hover:scale-[1.01]',
  glow: 'transition-all duration-300 hover:shadow-lg hover:shadow-lilac-400/25',
  tilt: 'transition-transform duration-300 hover:rotate-0.5 hover:scale-105'
};

const gradients = {
  brand: 'bg-gradient-to-br from-lilac-400 via-lilac-300 to-lilac-500',
  sunset: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600',
  ocean: 'bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-700',
  forest: 'bg-gradient-to-br from-green-400 via-emerald-600 to-teal-700',
  purple: 'bg-gradient-to-br from-lilac-400 via-lilac-300 to-lilac-500'
};

const animations = {
  none: '',
  fade: 'opacity-0',
  slide: 'opacity-0 translate-y-8',
  scale: 'opacity-0 scale-95',
  bounce: 'opacity-0 scale-75'
};

export const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    hover = 'lift',
    animation = 'fade',
    gradient = 'brand',
    children,
    ...props 
  }, ref) => {
    const animationRef = useScrollAnimation(
      animation === 'fade' ? 'animate-fade-in-up' :
      animation === 'slide' ? 'animate-slide-in-left' :
      animation === 'scale' ? 'animate-scale-in' :
      animation === 'bounce' ? 'animate-bounce-in' : ''
    );

    const cardClass = cn(
      // Base styles
      'relative overflow-hidden',
      // Variant styles
      variant === 'gradient' ? gradients[gradient] : cardVariants[variant],
      // Size styles
      cardSizes[size],
      // Hover effects
      hoverEffects[hover],
      // Animation styles
      animation !== 'none' && animations[animation],
      className
    );

    return (
      <div
        ref={animation !== 'none' ? animationRef as React.RefObject<HTMLDivElement> : ref}
        className={cardClass}
        {...props}
      >
        {variant === 'glass' && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        )}
        {children}
      </div>
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-6', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';
