'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/lib/animations';

type AllowedElements =
  | 'p' | 'span' | 'div' | 'section' | 'article' | 'header' | 'footer' | 'label' | 'strong' | 'em'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error';
  align?: 'left' | 'center' | 'right' | 'justify';
  animation?: 'none' | 'fade' | 'slide' | 'typewriter';
  gradient?: boolean;
  as?: AllowedElements;
}

const variants = {
  h1: 'text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight',
  h2: 'text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight',
  h3: 'text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight',
  h4: 'text-xl md:text-2xl lg:text-3xl leading-tight tracking-tight',
  h5: 'text-lg md:text-xl lg:text-2xl leading-tight tracking-tight',
  h6: 'text-base md:text-lg lg:text-xl leading-tight tracking-tight',
  body: 'text-base leading-relaxed',
  caption: 'text-sm leading-normal',
  overline: 'text-xs uppercase tracking-wider leading-normal'
};

const weights = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold'
};

const colors = {
  primary: 'text-gray-900',
  secondary: 'text-gray-700',
  muted: 'text-gray-500',
  accent: 'text-brand-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600'
};

const alignments = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify'
};

const animations = {
  none: '',
  fade: 'opacity-0',
  slide: 'opacity-0 translate-y-4',
  typewriter: 'overflow-hidden border-r-2 border-brand-500 animate-typewriter'
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ 
    className,
    variant = 'body',
    weight = 'normal',
    color = 'primary',
    align = 'left',
    animation = 'none',
    gradient = false,
    as,
    children,
    ...props 
  }, ref) => {
    const animationRef = useScrollAnimation(
      animation === 'fade' ? 'animate-fade-in-up' :
      animation === 'slide' ? 'animate-slide-in-left' : ''
    );

    const Comp: any = as || (variant.startsWith('h') ? (variant as AllowedElements) : 'p');

    const typographyClass = cn(
      // Base styles
      'transition-all duration-200',
      // Variant styles
      variants[variant],
      // Weight styles
      weights[weight],
      // Color styles
      gradient 
        ? 'bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'
        : colors[color],
      // Alignment styles
      alignments[align],
      // Animation styles
      animation !== 'none' && animations[animation],
      className
    );

    const usedRef: any = animation !== 'none' ? (animationRef as any) : (ref as any);

    return (
      <Comp
        ref={usedRef}
        className={typographyClass}
        {...(props as any)}
      >
        {children}
      </Comp>
    );
  }
);

Typography.displayName = 'Typography';

// Convenience components
export const Heading = forwardRef<HTMLElement, Omit<TypographyProps, 'variant'> & { level: 1 | 2 | 3 | 4 | 5 | 6 }>(
  ({ level, ...props }, ref) => (
    <Typography ref={ref} variant={`h${level}` as TypographyProps['variant']} {...props} />
  )
);
Heading.displayName = 'Heading';

export const Text = forwardRef<HTMLElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => (
    <Typography ref={ref} variant="body" {...props} />
  )
);
Text.displayName = 'Text';

export const Caption = forwardRef<HTMLElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => (
    <Typography ref={ref} variant="caption" {...props} />
  )
);
Caption.displayName = 'Caption';

export const Overline = forwardRef<HTMLElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => (
    <Typography ref={ref} variant="overline" {...props} />
  )
);
Overline.displayName = 'Overline';
