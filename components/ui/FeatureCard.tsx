'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: 'purple' | 'blue' | 'green' | 'yellow' | 'pink';
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  accent = 'purple',
  className = ""
}: FeatureCardProps) {
  const accentColors = {
    purple: 'from-lilac-400 to-lilac-300',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-amber-500',
    pink: 'from-pink-500 to-rose-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`feature-card relative overflow-hidden ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '15px 15px'
        }} />
      </div>

      {/* Border Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            strokeDasharray="10 5"
            strokeWidth="1"
            stroke="rgb(var(--primary))"
            fill="none"
            d="M1,1 L99,1 L99,99 L1,99 Z"
            className="opacity-20"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 h-full bg-white border border-lilac-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
        
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-lilac-400 to-lilac-300 flex items-center justify-center text-lilac-900 mb-4 shadow-md`}>
          {icon}
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>

        {/* Decorative dots */}
        <div className="absolute bottom-4 right-4 opacity-10">
          <svg viewBox="0 0 20 10" className="w-5 h-2.5">
            <circle fill="currentColor" r="1" cy="5" cx="3" />
            <circle fill="currentColor" r="1" cy="5" cx="8" />
            <circle fill="currentColor" r="1" cy="5" cx="13" />
            <circle fill="currentColor" r="1" cy="5" cx="18" />
          </svg>
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-10 h-10 opacity-5">
          <div className={`w-full h-full bg-gradient-to-br ${accentColors[accent]} rounded-bl-2xl`} />
        </div>
      </div>
    </motion.div>
  );
}

export default FeatureCard;
