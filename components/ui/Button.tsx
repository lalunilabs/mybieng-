import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'gradient' | 'premium' | 'uiverse' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'default',
  size = 'md',
  asChild = false,
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  disabled,
  fullWidth = false,
  rounded = false,
  ...props
}, ref) => {
  const isDisabled = disabled || isLoading;
  
  const renderContent = () => (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className={cn(
            'h-4 w-4 animate-spin',
            {
              'mr-2': !!loadingText,
            }
          )} />
          {loadingText && <span>{loadingText}</span>}
        </div>
      )}
      <span className={cn(
        'inline-flex items-center justify-center gap-2',
        isLoading ? 'opacity-0' : 'opacity-100',
        {
          'w-full': fullWidth,
        }
      )}>
        {leftIcon && !isLoading && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
      </span>
    </>
  );
  
  const buttonClasses = cn(
    'relative inline-flex items-center justify-center font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:opacity-60 disabled:pointer-events-none',
    'overflow-hidden group',
    {
      'cursor-not-allowed': isDisabled,
      'w-full': fullWidth,
      'rounded-full': rounded,
    },
    // Sizes
    {
      'h-8 px-3 text-xs': size === 'sm',
      'h-10 px-4 text-sm': size === 'md',
      'h-12 px-6 text-base': size === 'lg',
      'h-14 px-8 text-lg': size === 'xl',
    },
    // Variants
    {
      // Default
      'bg-primary text-primary-foreground shadow hover:bg-primary/90': variant === 'default',
      // Outline
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
      // Ghost
      'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
      // Secondary
      'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80': variant === 'secondary',
      // Destructive
      'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90': variant === 'destructive',
      // Gradient
      'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md hover:shadow-lg': variant === 'gradient',
      // Premium
      'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-md hover:shadow-lg': variant === 'premium',
      // Uiverse
      'relative isolate text-white rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 shadow-[0_8px_30px_rgba(99,102,241,0.25)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.35)]': variant === 'uiverse',
      // Link
      'text-primary underline-offset-4 hover:underline': variant === 'link',
    },
    // Rounded corners if not rounded
    !rounded && {
      'rounded-md': size === 'sm',
      'rounded-lg': size === 'md',
      'rounded-xl': size === 'lg',
      'rounded-2xl': size === 'xl',
    },
    className
  );

  if (asChild) {
    return (
      <span className={buttonClasses}>
        {renderContent()}
      </span>
    );
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {renderContent()}
      
      {/* Ripple effect */}
      <span className="absolute inset-0 -z-10 bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200 rounded-inherit" />
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
