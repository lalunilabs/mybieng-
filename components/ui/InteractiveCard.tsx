'use client';

import { forwardRef, HTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/lib/animations';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InteractiveCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  expandable?: boolean;
  defaultExpanded?: boolean;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  hover?: 'lift' | 'scale' | 'glow' | 'tilt';
  animation?: 'fade' | 'slide' | 'scale';
  badge?: {
    text: string;
    color?: 'brand' | 'success' | 'warning' | 'error';
  };
  actions?: React.ReactNode;
}

const cardVariants = {
  default: 'bg-white border border-gray-200 shadow-sm',
  elevated: 'bg-white border-0 shadow-lg',
  glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-md',
  gradient: 'bg-gradient-to-br from-lilac-400 via-lilac-300 to-lilac-500 text-lilac-900 border-0 shadow-lg'
};

const hoverEffects = {
  lift: 'transition-all duration-300 hover:-translate-y-2 hover:shadow-xl',
  scale: 'transition-transform duration-300 hover:scale-[1.02]',
  glow: 'transition-all duration-300 hover:shadow-glow hover:shadow-brand-500/25',
  tilt: 'transition-transform duration-300 hover:rotate-1 hover:scale-105'
};

const badgeColors = {
  brand: 'bg-lilac-100 text-lilac-800 border-lilac-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200'
};

export const InteractiveCard = forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ 
    className,
    title,
    description,
    expandable = false,
    defaultExpanded = false,
    variant = 'default',
    hover = 'lift',
    animation = 'fade',
    badge,
    actions,
    children,
    ...props 
  }, ref) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const animationRef = useScrollAnimation('animate-fade-in-up');

    const toggleExpanded = () => {
      if (expandable) {
        setIsExpanded(!isExpanded);
      }
    };

    return (
      <div
        ref={animationRef as React.RefObject<HTMLDivElement>}
        className={cn(
          'relative rounded-xl p-6 opacity-0',
          cardVariants[variant],
          hoverEffects[hover],
          expandable && 'cursor-pointer',
          className
        )}
        onClick={expandable ? toggleExpanded : undefined}
        {...props}
      >
        {/* Glass effect overlay */}
        {variant === 'glass' && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl" />
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {badge && (
              <span className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-2',
                badgeColors[badge.color || 'brand']
              )}>
                {badge.text}
              </span>
            )}
            
            {title && (
              <h3 className={cn(
                'text-lg font-semibold mb-1',
                variant === 'gradient' ? 'text-lilac-900' : 'text-gray-900'
              )}>
                {title}
              </h3>
            )}
            
            {description && (
              <p className={cn(
                'text-sm',
                variant === 'gradient' ? 'text-white/80' : 'text-gray-600'
              )}>
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {actions}
            {expandable && (
              <button
                className={cn(
                  'p-1 rounded-full transition-colors',
                  variant === 'gradient' 
                    ? 'hover:bg-white/20 text-white' 
                    : 'hover:bg-gray-100 text-gray-500'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded();
                }}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            expandable && !isExpanded && 'max-h-0 overflow-hidden opacity-0',
            expandable && isExpanded && 'max-h-[1000px] opacity-100'
          )}
          style={{
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          {children}
        </div>

        {/* Expandable indicator */}
        {expandable && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-xl" />
        )}
      </div>
    );
  }
);

InteractiveCard.displayName = 'InteractiveCard';
