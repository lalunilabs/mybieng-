'use client';

import { motion, useInView, useAnimation, useScroll, useTransform, Variants, useReducedMotion } from 'framer-motion';
import { useRef, useEffect } from 'react';

// Premium animation variants
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom bezier curve
      staggerChildren: 0.1
    }
  }
};

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -60,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 60,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotateX: -15
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1], // Bounce effect
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

export const cardHover: Variants = {
  rest: { 
    scale: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    z: 0
  },
  hover: { 
    scale: 1.03,
    y: -8,
    rotateX: 5,
    rotateY: 5,
    z: 50,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const magneticHover: Variants = {
  rest: { 
    scale: 1,
    rotate: 0
  },
  hover: { 
    scale: 1.05,
    rotate: [0, -1, 1, 0],
    transition: {
      duration: 0.3,
      rotate: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  }
};

// Premium animated components
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
  delay?: number;
}

export function AnimatedSection({ 
  children, 
  className = '', 
  variant = 'fadeInUp',
  delay = 0 
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    scaleIn
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={shouldReduceMotion ? 'visible' : controls}
      variants={variants[variant]}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Floating elements animation
export function FloatingElement({ 
  children, 
  className = '',
  intensity = 1,
  duration = 6 
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  duration?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10 * intensity, 0],
        x: [0, 5 * intensity, 0],
        rotate: [0, 2 * intensity, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
}

// Magnetic button effect
export function MagneticButton({ 
  children, 
  className = '',
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const shouldReduceMotion = useReducedMotion();
  const hoverProps = shouldReduceMotion ? {} : { variants: magneticHover, initial: 'rest' as const, whileHover: 'hover' as const, whileTap: { scale: 0.95 } };
  return (
    <motion.button
      className={className}
      {...hoverProps}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Text reveal animation
export function TextReveal({ 
  text, 
  className = '',
  delay = 0 
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className}>
        {words.map((word, index) => (
          <span key={index} className="inline-block mr-2">{word}</span>
        ))}
      </div>
    );
  }
  return (
    <motion.div 
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      style={{ overflow: 'hidden' }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.5,
                ease: 'easeOut',
                delay: delay + index * 0.1
              }
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Parallax scroll effect
export function ParallaxElement({ 
  children, 
  speed = 0.5,
  className = '' 
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) {
    return (
      <div ref={ref as any} className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
