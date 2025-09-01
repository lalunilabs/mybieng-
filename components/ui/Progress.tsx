import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'default' | 'gradient' | 'animated';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = 'default', size = 'md', showValue = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const variants = {
      default: 'bg-primary',
      gradient: 'bg-gradient-to-r from-primary to-purple-600',
      animated: 'bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] animate-shimmer'
    };

    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    };

    return (
      <div className="relative w-full">
        <div
          ref={ref}
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-secondary/50',
            sizes[size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'h-full transition-all duration-500 ease-out rounded-full',
              variants[variant],
              percentage > 0 && 'shadow-sm'
            )}
            style={{ width: `${percentage}%` }}
          />
          
          {/* Shimmer effect for completed portion */}
          {variant === 'animated' && percentage > 0 && (
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
        
        {showValue && (
          <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
            <span>{Math.round(percentage)}%</span>
            <span>{value} / {max}</span>
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
