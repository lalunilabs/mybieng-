'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowUp,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { AnimatedSection, FloatingElement, MagneticButton, TextReveal, ParallaxElement, cardHover, staggerContainer } from '@/components/animations/PremiumAnimations';
import { designSystem, getCardClasses, getBadgeClasses } from '@/lib/design-system';

const FEATURED_ARTICLES = [
  {
    id: 1,
    title: 'Why You Keep Making the Same Mistakes (And How to Finally Stop)',
    excerpt: 'The hidden psychological trap that keeps 90% of people stuck in self-defeating patterns—and the simple framework that breaks you free.',
    category: 'Psychology',
    readTime: 8,
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    featured: true,
    author: 'Dr N'
  },
  {
    id: 2,
    title: 'The Secret Language Your Brain Uses to Motivate You',
    excerpt: 'Harvard research reveals why willpower fails—and the 5 motivation "languages" that actually work for lasting change.',
    category: 'Self-Improvement',
    readTime: 12,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    author: 'Dr N'
  },
  {
    id: 3,
    title: 'What 10,000 Self-Assessments Taught Us About Human Nature',
    excerpt: 'Shocking patterns emerge when people answer honestly about themselves—including the one trait that predicts success better than IQ.',
    category: 'Research',
    readTime: 15,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    author: 'Dr N'
  }
];

// Stats will be fetched dynamically from API
interface Stats {
  curiousMinds: string;
  researchArticles: string;
  assessments: string;
  satisfaction: string;
}

const DEFAULT_STATS: Stats = {
  curiousMinds: '2,847+',
  researchArticles: '24+',
  assessments: '8',
  satisfaction: '94%'
};

const QUIZ_STATS = [
  { 
    title: 'The Mental Tug-of-War',
    subtitle: 'Cognitive Dissonance Assessment',
    completions: '1,247',
    category: 'Most Popular',
    slug: 'cognitive-dissonance',
    isNew: false
  },
  { 
    title: 'Motivation Language',
    subtitle: 'Discover Your Drive Profile',
    completions: '892',
    category: 'Trending',
    slug: 'motivation-language',
    isNew: true
  },
  { 
    title: 'Stress Patterns',
    subtitle: 'Reset Lever Assessment',
    completions: '634',
    category: 'New',
    slug: 'stress-patterns',
    isNew: true
  }
];

// Scroll Progress Bar Component
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform-gpu z-50"
      style={{ scaleX, transformOrigin: "0%" }}
    />
  );
};

// Cursor Glow Effect
const CursorGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-30 mix-blend-difference"
      animate={{
        x: mousePosition.x - 20,
        y: mousePosition.y - 20,
        opacity: isVisible ? 0.6 : 0
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      <div className="w-10 h-10 bg-white rounded-full blur-sm" />
    </motion.div>
  );
};

// Scroll to Top Button
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      className="fixed bottom-8 right-8 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors z-40"
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
};

export default function MagazineLanding() {
  const [currentDate, setCurrentDate] = useState('');
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  
  // Enhanced hooks
  useSmoothScroll();
  useKeyboardNavigation({
    enableArrowKeys: true,
    enableTabNavigation: true,
    enableEscapeKey: true
  });
  
  const { ref: assessmentsRef, visibleItems } = useStaggeredAnimation(3, 0.15);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ triggerOnce: true });

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }));

    // Fetch dynamic stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/public', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success && result.data) {
          setStats(result.data);
        }
      } catch (error) {
        console.warn('Stats API unavailable, using defaults:', error);
        // Silently keep default stats on error - no user-facing error
      } finally {
        setIsLoadingStats(false);
      }
    };

    // Delay fetch slightly to avoid blocking initial render
    const timer = setTimeout(() => {
      fetchStats();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen relative ${designSystem.gradients.page}`}>
      {/* Global Microinteractions */}
      <ScrollProgressBar />
      <CursorGlow />
      <ScrollToTop />
      
      {/* Global navbar is rendered by app/layout.tsx; we intentionally omit any local header here */}

      {/* Hero Section - Magazine Cover Style */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      >
        {/* Radial Glow Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[size:60px_60px]" />
        </div>
        
        {/* Floating Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5 blur-xl"
            style={{
              width: `${80 + i * 30}px`,
              height: `${80 + i * 30}px`,
              left: `${5 + i * 12}%`,
              top: `${5 + i * 10}%`,
            }}
            animate={{
              x: [0, 40, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Magazine Issue Info */}
            <div className="text-sm font-semibold text-purple-300 mb-6 tracking-wider uppercase">
              {currentDate} • Research Edition • No Right/Wrong Answers
            </div>
            
            {/* Main Headline - Premium Text Animation */}
            <div className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none tracking-tight">
              <TextReveal 
                text="STOP" 
                className="block bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
                delay={0.2}
              />
              <TextReveal 
                text="GUESSING" 
                className="block text-white"
                delay={0.6}
              />
            </div>
            
            {/* Subtitle - Enhanced Animation */}
            <AnimatedSection 
              variant="fadeInUp"
              delay={1.0}
              className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Transform confusion into clarity — explore{' '}
              <span className="text-purple-300 font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">research-backed self-understanding</span>
            </AnimatedSection>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button 
                asChild
                size="lg"
                className="bg-white text-slate-900 px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
              >
                <Link href="/quizzes">
                  <span className="flex items-center gap-2">
                    <span>Discover Your Patterns</span>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-slate-900 transition-all shadow-2xl"
              >
                <Link href="/blog">
                  <span className="flex items-center gap-2">
                    <span>See The Science</span>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Link>
              </Button>
            </motion.div>

            {/* Stats Bar */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.curiousMinds}</div>
                <div className="text-sm text-gray-300">Curious Minds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.researchArticles}</div>
                <div className="text-sm text-gray-300">Research Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.assessments}</div>
                <div className="text-sm text-gray-300">Assessments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.satisfaction}</div>
                <div className="text-sm text-gray-300">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Popular Assessments Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Section Background Glow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-b from-purple-50/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <AnimatedSection variant="fadeInUp">
              {/* Enhanced Radial Glow Behind Title */}
              <div className="relative">
                <FloatingElement intensity={0.5} duration={8}>
                  <div className="absolute inset-0 bg-gradient-radial from-purple-100/30 to-transparent blur-3xl" />
                </FloatingElement>
                <h2 className="relative text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                  Discover Your Patterns
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Research-backed assessments that reveal how your mind works—no right or wrong answers, just insights.
              </p>
            </AnimatedSection>
          </div>

          <div ref={assessmentsRef} className="grid md:grid-cols-3 gap-6">
            {QUIZ_STATS.map((quiz, index) => (
              <motion.div
                key={quiz.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: visibleItems.includes(index) ? 1 : 0,
                  y: visibleItems.includes(index) ? 0 : 30
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                variants={cardHover}
                whileHover="hover"
                style={{ perspective: 1000 }}
              >
                <Link href={`/quizzes/${quiz.slug}`}>
                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 cursor-pointer group relative overflow-hidden transition-all duration-500 hover:border-purple-200 hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)] transform-gpu">
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50/50 group-hover:to-pink-50/30 transition-all duration-300" />
                    
                    {/* Content Reveal on Hover */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
                        {index === 0 ? 'Read in 8 min' : index === 1 ? 'Key insight' : 'Quick start'}
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={`${quiz.isNew ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'} px-3 py-1 rounded-full text-xs font-semibold`}>
                          {quiz.category}
                        </Badge>
                        <div className="text-sm text-gray-500">{quiz.completions} completed</div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">{quiz.subtitle}</p>
                      <div className="text-purple-600 font-medium text-sm flex items-center group-hover:text-purple-700 transition-colors">
                        <span className="mr-2">Explore This Pattern</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-semibold">
              <Link href="/quizzes">
                View All Assessments
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Content - Magazine Layout */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                BREAKTHROUGH INSIGHTS
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                The Hidden Patterns That Control Your Life
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real research. Real results. Real people discovering why they do what they do—and how to change it.
              </p>
            </motion.div>
          </div>

          {/* Magazine Grid Layout */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Feature Article */}
            <motion.div 
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/blog/understanding-behavioral-patterns">
                <article className={`${designSystem.components.card.base} ${designSystem.components.card.hover} overflow-hidden group cursor-pointer`}>
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <OptimizedImage
                      src={FEATURED_ARTICLES[0].imageUrl}
                      alt={FEATURED_ARTICLES[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    {/* Image Blur Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                    <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-[1px] transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full font-semibold group-hover:bg-white group-hover:scale-105 transition-all duration-300">
                        {FEATURED_ARTICLES[0].category}
                      </Badge>
                    </div>
                    
                    {/* Content Reveal on Hover */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Deep Dive
                      </div>
                    </div>
                  
                    {/* Article Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <motion.h2 
                        className="text-3xl md:text-4xl font-bold mb-3 leading-tight group-hover:text-purple-200 transition-colors duration-300"
                        whileHover={{ scale: 1.02 }}
                      >
                        {FEATURED_ARTICLES[0].title}
                      </motion.h2>
                      <p className="text-gray-200 text-lg mb-4 line-clamp-2 group-hover:text-gray-100 transition-colors duration-300">
                        {FEATURED_ARTICLES[0].excerpt}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="group-hover:text-purple-200 transition-colors duration-300">
                          {FEATURED_ARTICLES[0].readTime} min read
                        </span>
                        <span className="group-hover:text-purple-200 transition-colors duration-300">By {FEATURED_ARTICLES[0].author}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
            
            {/* Sidebar Articles */}
            <div className="lg:col-span-4 space-y-8">
              {/* Quick Assessment CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.3)_0%,transparent_50%)] group-hover:bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.3)_0%,transparent_50%)] transition-all duration-1000" />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4">Your Personal Pattern Decoder</h3>
                    <p className="text-purple-100 mb-6 leading-relaxed">
                      Get instant AI analysis of your results. Ask questions, explore patterns, discover what makes you tick.
                    </p>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-full w-full magnetic-button shadow-lg hover:shadow-xl transition-all duration-300">
                        Decode My Patterns
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Latest Articles */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className={getCardClasses('slate')}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Latest Research</h3>
                  <div className="space-y-6">
                    {FEATURED_ARTICLES.slice(1).map((article, index) => (
                      <Link key={article.id} href="/blog">
                        <article className="group cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-all duration-300">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative">
                              <OptimizedImage
                                src={article.imageUrl}
                                alt={article.title}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {/* Subtle overlay on hover */}
                              <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-all duration-300" />
                            </div>
                            <div className="flex-1">
                              <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mb-2 group-hover:bg-purple-100 group-hover:text-purple-700 transition-all duration-300">
                                {article.category}
                              </Badge>
                              <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors link-underline">
                                {article.title}
                              </h4>
                              <div className="flex items-center text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                                <span>{article.readTime} min read</span>
                                <span className="mx-2">•</span>
                                <span>{article.author}</span>
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Floating Dots Background */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: ctaVisible ? 1 : 0,
              y: ctaVisible ? 0 : 30
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-12 relative overflow-hidden">
              {/* Subtle Gradient Waves */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-pink-100/20" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Get the Insights That Actually Matter
                </h2>
                
                {/* Enhanced Microcopy */}
                <p className="text-xl text-gray-600 mb-4">
                  Join 2,847+ curious minds getting weekly breakthroughs in human psychology
                </p>
                <p className="text-lg text-gray-500 mb-8 font-light italic">
                  No fluff. Just real science and wisdom you can use every day.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <motion.input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-full focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-lg transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      Subscribe
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Premium Footer */}
      <footer className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 text-white py-16 relative overflow-hidden">
        {/* Animated Gradient Border */}
        <div className="absolute top-0 left-0 right-0 h-px">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Parallax Glow Background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  MyBeing
                </h3>
                <p className="text-purple-200 leading-relaxed mb-6">
                  Transform confusion into clarity with research-backed self-understanding. 
                  Discover the patterns that shape your life.
                </p>
                <div className="flex space-x-4">
                  <span className="text-purple-200 text-sm">Research • Insights • Growth • Discovery</span>
                </div>
              </motion.div>
            </div>
            
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="font-semibold mb-4 text-purple-200">Explore</h4>
                <ul className="space-y-3">
                  {['Assessments', 'Research', 'AI Chat', 'Reports'].map((item, index) => (
                    <li key={item}>
                      <motion.a
                        href="#"
                        className="text-purple-300 hover:text-white transition-colors duration-200 flex items-center group"
                        whileHover={{ x: 4 }}
                      >
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3 group-hover:bg-white transition-colors" />
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
            
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="font-semibold mb-4 text-purple-200">Connect</h4>
                <ul className="space-y-3">
                  {['About', 'Privacy', 'Terms', 'Support'].map((item, index) => (
                    <li key={item}>
                      <motion.a
                        href="#"
                        className="text-purple-300 hover:text-white transition-colors duration-200 flex items-center group"
                        whileHover={{ x: 4 }}
                      >
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3 group-hover:bg-white transition-colors" />
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="border-t border-purple-700/50 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-purple-300">
              © 2024 MyBeing. Crafted with care for curious minds.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
