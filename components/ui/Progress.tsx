import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'default' | 'gradient' | 'animated' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = 'default', size = 'md', showValue = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const variants = {
      default: 'bg-gray-200',
      gradient: 'bg-gradient-to-r from-lilac-400 to-lilac-300',
      animated: 'bg-gradient-to-r from-lilac-400 via-lilac-300 to-lilac-400 bg-[length:200%_100%] animate-shimmer',
      premium: 'bg-gradient-to-r from-lilac-400 to-lilac-300'
    };

    const sizes = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-3.5'
    };

    return (
      <div className="relative w-full">
        <div
          ref={ref}
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-gray-100',
            sizes[size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'h-full transition-all duration-700 ease-out rounded-full',
              variants[variant],
              percentage > 0 && 'shadow-sm'
            )}
            style={{ width: `${percentage}%` }}
          />
          
          {/* Glow effect for premium variant */}
          {variant === 'premium' && percentage > 0 && (
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-lilac-300 to-lilac-200 opacity-30 blur-sm"
              style={{ width: `${percentage}%` }}
            />
          )}
          
          {/* Shimmer effect for animated variant */}
          {variant === 'animated' && percentage > 0 && (
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
        
        {showValue && (
          <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
            <span className="font-medium">{Math.round(percentage)}%</span>
            <span>{value} / {max}</span>
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
