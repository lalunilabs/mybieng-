import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  asChild?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild, loading, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group';
    
    const variants = {
      default: 'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-medium active:scale-[0.98]',
      outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground shadow-soft hover:shadow-medium active:scale-[0.98]',
      ghost: 'text-primary hover:bg-primary/10 hover:text-primary active:scale-[0.98]',
      secondary: 'bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80 hover:shadow-medium active:scale-[0.98]',
      destructive: 'bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90 hover:shadow-medium active:scale-[0.98]',
      gradient: 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-glow hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98]'
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm rounded-lg',
      md: 'h-11 px-6 text-base rounded-xl',
      lg: 'h-13 px-8 text-lg rounded-xl',
      xl: 'h-16 px-10 text-xl rounded-2xl'
    };

    if (asChild) {
      return (
        <span
          className={cn(
            baseClasses,
            variants[variant],
            sizes[size],
            loading && 'pointer-events-none',
            className
          )}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <span className={loading ? 'opacity-0' : 'opacity-100'}>
            {children}
          </span>
        </span>
      );
    }

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          loading && 'pointer-events-none',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <span className={loading ? 'opacity-0' : 'opacity-100 transition-opacity'}>
          {children}
        </span>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 -z-10 bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200 rounded-inherit" />
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
