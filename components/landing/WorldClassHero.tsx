'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import { Brain, Sparkles, TrendingUp, Users, Clock, ArrowRight, Play, BookOpen, Zap } from 'lucide-react';

const STATS = [
  { value: '15+', label: 'Research Articles', icon: BookOpen },
  { value: '3', label: 'Self-Assessments', icon: Brain },
  { value: 'AI', label: 'Chat Support', icon: Zap },
];

const TRUST_SIGNALS = [
  'Research-backed insights',
  'No right/wrong answers', 
  'Privacy-first approach',
  'Expert-curated content',
  'AI-powered guidance'
];

export default function WorldClassHero() {
  const [currentSignal, setCurrentSignal] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.05]), {
    stiffness: 100,
    damping: 30
  });

  // Rotating trust signals
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSignal((prev) => (prev + 1) % TRUST_SIGNALS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-3xl opacity-20 ${
              i % 3 === 0 ? 'bg-purple-400' : i % 3 === 1 ? 'bg-indigo-400' : 'bg-fuchsia-400'
            }`}
            style={{
              width: `${120 + i * 40}px`,
              height: `${120 + i * 40}px`,
              left: `${10 + i * 15}%`,
              top: `${10 + i * 12}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Interactive gradient that follows mouse */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(147, 51, 234, 0.1), transparent 50%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Brand Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full text-sm font-medium text-purple-700 mb-6 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 2,847+ curious minds</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="text-gray-900">Discover yourself through</span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: '200% 100%' }}
              >
                research & insights
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
            >
              Read thought-provoking articles and take personalized assessments to understand your mind, patterns, and potential.
            </motion.p>

            {/* Rotating Trust Signal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8 h-6"
            >
              <motion.p
                key={currentSignal}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg text-gray-500 font-medium"
              >
                ✨ {TRUST_SIGNALS[currentSignal]}
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-8"
            >
              <PrimaryCTA 
                href="/blog" 
                variant="uiverse" 
                size="lg"
                className="px-8 py-4 text-base font-semibold group"
                eventName="hero_start_reading"
                surface="hero"
              >
                <BookOpen className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start Reading Articles
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </PrimaryCTA>
              
              <PrimaryCTA 
                href="/quizzes" 
                variant="outline" 
                size="lg"
                className="px-6 py-4 text-base group border-2 hover:bg-purple-50"
                eventName="hero_take_assessment"
                surface="hero"
              >
                <Brain className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Take Assessment
              </PrimaryCTA>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 mb-6"
            >
              {STATS.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5 text-purple-600 mr-1" />
                      <div className="text-gray-900 font-bold text-lg">{stat.value}</div>
                    </div>
                    <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Quick Access Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center lg:text-left"
            >
              <Link 
                href="/blog" 
                className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 group transition-colors"
              >
                <span>Explore featured articles</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Visual */}
          <div className="lg:col-span-5 order-first lg:order-none">
            <motion.div
              style={{ y, scale }}
              className="relative"
            >
              {/* Main Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1400&auto=format&fit=crop"
                  alt="Self-discovery journey"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-indigo-600/20" />
                
                {/* Floating UI Elements */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">+47% insights</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">2,847+ readers</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-20 blur-xl"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-r from-fuchsia-400 to-purple-400 rounded-full opacity-20 blur-xl"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
