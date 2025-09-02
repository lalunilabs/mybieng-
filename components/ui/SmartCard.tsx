"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SmartCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  tilt?: boolean;
  variant?: 'default' | 'glass' | 'gradient' | 'premium';
  onClick?: () => void;
}

export function SmartCard({
  children,
  className,
  hover = true,
  glow = false,
  tilt = false,
  variant = 'default',
  onClick,
}: SmartCardProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x, y });
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200',
    premium: 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200',
  };

  const glowClass = glow ? 'shadow-lg hover:shadow-2xl hover:shadow-purple-500/20' : '';

  return (
    <motion.div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300 cursor-pointer overflow-hidden relative',
        variantClasses[variant],
        glowClass,
        hover && 'hover:shadow-xl hover:-translate-y-1',
        className
      )}
      style={{
        transform: tilt && isHovered 
          ? `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg) translateZ(20px)`
          : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Animated background gradient */}
      {variant === 'premium' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />
      )}

      {/* Hover spotlight effect */}
      {hover && (
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 50 + 50}% ${mousePosition.y * 50 + 50}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
