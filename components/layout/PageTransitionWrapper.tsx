'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

export function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const pathname = usePathname();

  const variants = {
    hidden: { opacity: 0, y: 15 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname} // Keying by pathname triggers the animation on route change
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ type: 'linear', duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
