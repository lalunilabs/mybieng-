'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/lib/animations';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: 'low' | 'medium' | 'high';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: 'none' | 'lift' | 'scale' | 'glow';
  animation?: 'none' | 'fade' | 'slide' | 'scale';
}

const blurs = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl'
};

const opacities = {
  low: 'bg-white/60',
  medium: 'bg-white/80',
  high: 'bg-white/90'
};

const shadows = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
};

const hovers = {
  none: '',
  lift: 'hover:-translate-y-1 hover:shadow-lg',
  scale: 'hover:scale-[1.02]',
  glow: 'hover:shadow-glow hover:shadow-brand-500/25'
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className,
    blur = 'md',
    opacity = 'medium',
    border = true,
    shadow = 'md',
    hover = 'lift',
    animation = 'fade',
    children,
    ...props 
  }, ref) => {
    const animationRef = useScrollAnimation('animate-fade-in-up');

    return (
      <div
        ref={animation !== 'none' ? animationRef as React.RefObject<HTMLDivElement> : ref}
        className={cn(
          'relative rounded-xl overflow-hidden transition-all duration-300',
          blurs[blur],
          opacities[opacity],
          border && 'border border-white/20',
          shadows[shadow],
          hovers[hover],
          animation !== 'none' && 'opacity-0',
          className
        )}
        {...props}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          {children}
        </div>
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
