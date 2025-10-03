'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Star, Quote, ArrowLeft, ArrowRight, Play, Pause, CheckCircle, TrendingUp } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Product Manager",
    company: "Tech Startup",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&h=150&auto=format&fit=crop&crop=face",
    content: "The cognitive dissonance assessment was a game-changer. I finally understood why I kept making decisions that went against my stated values. The AI chat helped me work through the insights in a way that felt personal and non-judgmental.",
    rating: 5,
    category: "Self-Discovery",
    featured: true,
    results: "Improved decision alignment by 73%",
    timeframe: "After 2 weeks"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Therapist",
    company: "Private Practice",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop&crop=face",
    content: "As a professional, I'm impressed by the research-backed approach. The articles are well-written and the assessments provide genuine insights without the typical 'personality test' fluff. I've recommended it to several clients.",
    rating: 5,
    category: "Professional Use",
    featured: false,
    results: "Recommended to 12+ clients",
    timeframe: "Past 3 months"
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Graduate Student",
    company: "Psychology PhD",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop&crop=face",
    content: "The depth of research behind each article is incredible. It's like having access to a psychology journal that's actually readable and applicable to daily life. The assessment results gave me insights I'm still processing months later.",
    rating: 5,
    category: "Academic",
    featured: true,
    results: "Enhanced research understanding",
    timeframe: "Ongoing impact"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Executive Coach",
    company: "Leadership Consulting",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop&crop=face",
    content: "I use MyBeing assessments with my executive clients. The non-judgmental approach and focus on patterns rather than labels makes it perfect for leadership development. The AI chat feature is surprisingly sophisticated.",
    rating: 5,
    category: "Professional Use",
    featured: false,
    results: "Integrated into coaching practice",
    timeframe: "6 months"
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Marketing Director",
    company: "Fortune 500",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=150&h=150&auto=format&fit=crop&crop=face",
    content: "The articles challenged my thinking in ways I didn't expect. The writing is engaging without being dumbed down. I've shared several pieces with my team - they've sparked some of our best strategic discussions.",
    rating: 5,
    category: "Leadership",
    featured: true,
    results: "Improved team discussions",
    timeframe: "Immediate impact"
  }
];

const STATS = [
  { value: "2,847+", label: "Active Readers", growth: "+23%" },
  { value: "4.9/5", label: "Average Rating", growth: "98% positive" },
  { value: "1,247+", label: "Assessments Completed", growth: "+156%" },
  { value: "89%", label: "Return Rate", growth: "Industry leading" }
];

function TestimonialCard({ testimonial, isActive }: { testimonial: typeof TESTIMONIALS[0], isActive: boolean }) {
  return (
    <motion.div
      layout
      className={`relative p-8 rounded-2xl border transition-all duration-500 ${
        testimonial.featured 
          ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-lg' 
          : 'bg-white border-gray-200 shadow-md'
      } ${isActive ? 'scale-105 shadow-xl' : 'scale-100'}`}
    >
      {/* Quote Icon */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <Quote className="w-4 h-4 text-white" />
      </div>

      {/* Featured Badge */}
      {testimonial.featured && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
            Featured
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        <span className="ml-2 text-sm text-gray-600 font-medium">{testimonial.rating}.0</span>
      </div>

      {/* Content */}
      <blockquote className="text-gray-700 leading-relaxed mb-6 text-base">
        "{testimonial.content}"
      </blockquote>

      {/* Results */}
      <div className="bg-white/80 rounded-lg p-3 mb-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900">{testimonial.results}</div>
            <div className="text-xs text-gray-600">{testimonial.timeframe}</div>
          </div>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
      </div>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{testimonial.name}</div>
          <div className="text-sm text-gray-600">{testimonial.role}</div>
          <div className="text-xs text-gray-500">{testimonial.company}</div>
        </div>
        <div className="ml-auto">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
            {testimonial.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function PremiumTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Auto-rotation
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % TESTIMONIALS.length;
      visible.push({ ...TESTIMONIALS[index], isActive: i === 1 });
    }
    return visible;
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            <span>Trusted by Thousands</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            What Our Readers
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Are Saying
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of curious minds who've discovered profound insights about themselves through our research-backed content and assessments.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {STATS.map((stat, index) => (
            <div key={stat.label} className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-green-600 font-medium">{stat.growth}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={prevTestimonial}
              className="p-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-purple-50"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-purple-50"
            >
              {isAutoPlaying ? <Pause className="w-5 h-5 text-gray-600" /> : <Play className="w-5 h-5 text-gray-600" />}
            </button>
            
            <button
              onClick={nextTestimonial}
              className="p-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-purple-50"
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Testimonials Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence mode="wait">
              {getVisibleTestimonials().map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-${currentIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TestimonialCard testimonial={testimonial} isActive={testimonial.isActive} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-purple-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to join our community of curious minds?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl">
              Start Your Journey
            </button>
            <button className="px-6 py-4 text-purple-600 font-medium hover:text-purple-700 transition-colors">
              Read More Reviews →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
