"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
        secondary: "bg-gray-800 text-white hover:bg-gray-900 shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-lilac-400 to-lilac-300 text-lilac-900 hover:from-lilac-300 hover:to-lilac-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
        premium: "bg-gradient-to-r from-lilac-400 to-lilac-300 text-lilac-900 hover:from-lilac-300 hover:to-lilac-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4",
        lg: "h-13 rounded-xl px-8",
        xl: "h-16 rounded-2xl px-10 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  ripple?: boolean;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, icon, ripple = true, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

    const addRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple) return;
      
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    };

    return (
      <motion.div
        whileHover={{ scale: variant === "ghost" || variant === "link" ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={loading || props.disabled}
          onClick={(e) => {
            addRipple(e);
            props.onClick?.(e);
          }}
          aria-busy={loading}
          {...props}
        >
          {/* Ripple effect */}
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute bg-white/30 rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 0,
                height: 0,
              }}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ 
                width: 100, 
                height: 100, 
                opacity: 0,
                scale: 2
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
          
          {/* Gradient overlay for hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          
          {/* Content */}
          <div className="relative flex items-center gap-2">
            {loading && (
              <motion.div
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
            {icon && !loading && (
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {icon}
              </motion.div>
            )}
            {children}
          </div>
        </Comp>
      </motion.div>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton, buttonVariants };
