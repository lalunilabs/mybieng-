'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Brain, 
  MessageSquare, 
  BookOpen, 
  Star,
  Clock,
  Users,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const FEATURED_ARTICLES = [
  {
    id: 1,
    title: 'Why You Keep Making the Same Mistakes (And How to Finally Stop)',
    excerpt: 'The hidden psychological trap that keeps 90% of people stuck in self-defeating patterns—and the simple framework that breaks you free.',
    category: 'Psychology',
    readTime: 8,
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    featured: true,
    author: 'Dr. Sarah Chen'
  },
  {
    id: 2,
    title: 'The Secret Language Your Brain Uses to Motivate You',
    excerpt: 'Harvard research reveals why willpower fails—and the 5 motivation "languages" that actually work for lasting change.',
    category: 'Self-Improvement',
    readTime: 12,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    author: 'Marcus Rodriguez'
  },
  {
    id: 3,
    title: 'What 10,000 Self-Assessments Taught Us About Human Nature',
    excerpt: 'Shocking patterns emerge when people answer honestly about themselves—including the one trait that predicts success better than IQ.',
    category: 'Research',
    readTime: 15,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    author: 'Dr. Emily Watson'
  }
];

const STATS = [
  { value: '2,847+', label: 'Curious Minds', icon: Users },
  { value: '15+', label: 'Research Articles', icon: BookOpen },
  { value: '5', label: 'Assessments', icon: Brain },
  { value: '94%', label: 'Satisfaction', icon: Star }
];

export default function MagazineLanding() {
  const [currentDate, setCurrentDate] = useState('');
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Magazine Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">MYBEING</h1>
                <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Research Edition</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/blog" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Articles
              </Link>
              <Link href="/quizzes" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Assessments
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Research
              </Link>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6">
                Start Journey
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Magazine Cover Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
            
            {/* Main Headline - World-Class Copy */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none tracking-tight">
              <motion.span 
                className="block bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                STOP
              </motion.span>
              <motion.span 
                className="block text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                GUESSING
              </motion.span>
            </h1>
            
            {/* Subtitle - Compelling Copy */}
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Finally understand <span className="text-purple-300 font-semibold">why you do what you do</span> with 
              research-backed assessments that reveal your hidden patterns—no judgment, just{' '}
              <span className="text-purple-300 font-semibold">pure insight</span>
            </motion.p>
            
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
                  <Brain className="w-6 h-6 mr-3" />
                  Discover Your Patterns
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-slate-900 transition-all shadow-2xl"
              >
                <Link href="/blog">
                  <BookOpen className="w-6 h-6 mr-3" />
                  See The Science
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
              {STATS.map((stat, index) => (
                <div key={stat.label} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                </div>
              ))}
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
              <article className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={FEATURED_ARTICLES[0].imageUrl}
                    alt={FEATURED_ARTICLES[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full font-semibold">
                      {FEATURED_ARTICLES[0].category}
                    </Badge>
                  </div>
                  
                  {/* Article Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                      {FEATURED_ARTICLES[0].title}
                    </h2>
                    <p className="text-gray-200 text-lg mb-4 line-clamp-2">
                      {FEATURED_ARTICLES[0].excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {FEATURED_ARTICLES[0].readTime} min read
                      </span>
                      <span>By {FEATURED_ARTICLES[0].author}</span>
                    </div>
                  </div>
                </div>
              </article>
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
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Your Personal Pattern Decoder</h3>
                  <p className="text-purple-100 mb-6 leading-relaxed">
                    Get instant AI analysis of your results. Ask questions, explore patterns, discover what makes you tick.
                  </p>
                  <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-full w-full">
                    <Brain className="w-5 h-5 mr-2" />
                    Decode My Patterns
                  </Button>
                </div>
              </motion.div>
              
              {/* Latest Articles */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Latest Research</h3>
                  <div className="space-y-6">
                    {FEATURED_ARTICLES.slice(1).map((article, index) => (
                      <article key={article.id} className="group cursor-pointer">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={article.imageUrl}
                              alt={article.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mb-2">
                              {article.category}
                            </Badge>
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                              {article.title}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{article.readTime} min</span>
                              <span className="mx-2">•</span>
                              <span>{article.author}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-12">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get the Insights That Actually Matter
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join 2,847+ curious minds getting weekly breakthroughs in human psychology—no fluff, just the patterns that change lives
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-full focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-lg"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-semibold">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
