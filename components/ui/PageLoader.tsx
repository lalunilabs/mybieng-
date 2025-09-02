'use client';

import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';

interface PageLoaderProps {
  message?: string;
  variant?: 'default' | 'brain' | 'dots';
}

export function PageLoader({ message = 'Loading...', variant = 'brain' }: PageLoaderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-6">
          <LoadingSpinner size="xl" variant={variant} />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-600 font-medium"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}
