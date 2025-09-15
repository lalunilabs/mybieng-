import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'gradient' | 'premium' | 'uiverse';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  asChild?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild, loading, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group';
    
    const variants = {
      default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.98]',
      outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary/5 hover:text-primary/90 shadow-sm hover:shadow-md active:scale-[0.98]',
      ghost: 'text-primary hover:bg-primary/10 hover:text-primary/90 active:scale-[0.98]',
      secondary: 'bg-gray-800 text-white shadow-sm hover:bg-gray-900 hover:shadow-md active:scale-[0.98]',
      destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:scale-[0.98]',
      gradient: 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-md hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg active:scale-[0.98]',
      premium: 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-md hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg active:scale-[0.98] border-0',
      uiverse: 'relative isolate text-white rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 shadow-[0_8px_30px_rgba(99,102,241,0.25)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.35)] ring-1 ring-white/10 hover:ring-white/20 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900/0'
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm rounded-lg',
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
