import { useEffect, useRef } from 'react';

// Intersection Observer hook for scroll animations
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options,
    });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [callback, options]);

  return targetRef;
}

// Scroll-triggered animations
export function useScrollAnimation(animationClass: string = 'animate-fade-in-up') {
  const ref = useIntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
        entry.target.classList.remove('opacity-0');
      }
    });
  });

  return ref;
}

// Staggered animations for lists
export function useStaggeredAnimation(delay: number = 100) {
  const ref = useIntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, index) => {
          setTimeout(() => {
            child.classList.add('animate-fade-in-up');
            child.classList.remove('opacity-0');
          }, index * delay);
        });
      }
    });
  });

  return ref;
}

// Parallax scroll effect
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * speed;
      element.style.transform = `translateY(${parallax}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}

// Smooth scroll to element
export function smoothScrollTo(elementId: string, offset: number = 0) {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Animation variants for Framer Motion-like behavior
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
    transition: { 
      duration: 0.6, 
      ease: [0.68, -0.55, 0.265, 1.55] 
    }
  }
};

// CSS class utilities for animations
export const animationClasses = {
  // Entrance animations
  fadeIn: 'opacity-0 animate-fade-in',
  fadeInUp: 'opacity-0 translate-y-8 animate-fade-in-up',
  fadeInDown: 'opacity-0 -translate-y-8 animate-fade-in-down',
  slideInLeft: 'opacity-0 -translate-x-12 animate-slide-in-left',
  slideInRight: 'opacity-0 translate-x-12 animate-slide-in-right',
  scaleIn: 'opacity-0 scale-95 animate-scale-in',
  bounceIn: 'opacity-0 scale-75 animate-bounce-in',
  zoomIn: 'opacity-0 scale-50 animate-zoom-in',
  
  // Hover effects
  hoverScale: 'transition-transform duration-200 hover:scale-105',
  hoverLift: 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
  hoverGlow: 'transition-all duration-200 hover:shadow-glow',
  hoverRotate: 'transition-transform duration-200 hover:rotate-3',
  
  // Loading states
  shimmer: 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  
  // Interactive states
  active: 'scale-95 transition-transform duration-100',
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'opacity-75 pointer-events-none',
};

// Stagger delay utilities
export function getStaggerDelay(index: number, baseDelay: number = 100): string {
  return `${index * baseDelay}ms`;
}

// Animation timing functions
export const easings = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

// Performance optimized scroll listener
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}
