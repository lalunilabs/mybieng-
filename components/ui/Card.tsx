import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'premium';
  size?: 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-black/10 shadow-sm',
      elevated: 'bg-white border border-black/10 shadow-lg',
      glass: 'glass border border-white/20',
      gradient: 'bg-gradient-to-br from-white to-lilac-50 border border-black/10 shadow-md',
      premium: 'bg-gradient-to-br from-white to-lilac-50 border border-black/10 shadow-md'
    };

    const sizes = {
      sm: 'rounded-lg',
      md: 'rounded-xl',
      lg: 'rounded-2xl'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-300 group',
          variants[variant],
          sizes[size],
          hover && 'hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] cursor-pointer',
          'animate-fade-in',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn('flex flex-col space-y-2 p-6 pb-4', className)} 
      {...props} 
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-xl font-semibold leading-tight text-foreground tracking-tight',
        'group-hover:text-primary transition-colors duration-200',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p 
      ref={ref} 
      className={cn(
        'text-sm text-muted-foreground leading-relaxed',
        'group-hover:text-lilac-700 transition-colors duration-200',
        className
      )} 
      {...props} 
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn('flex items-center p-6 pt-0 gap-2', className)} 
      {...props} 
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
