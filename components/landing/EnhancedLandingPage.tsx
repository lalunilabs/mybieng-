'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Target,
  BarChart3,
  CheckCircle,
  Star,
  Zap,
  Award,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';

const FEATURES = [
  {
    icon: Brain,
    title: 'Adaptive Assessments',
    description: 'Take quizzes that adapt to your responses with multiple result formats',
    benefits: ['Numeric scoring', 'Categorical profiles', 'AI narratives'],
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: MessageSquare,
    title: 'AI-Powered Insights',
    description: 'Chat with AI about your results for deeper understanding',
    benefits: ['Contextual conversations', 'Pattern exploration', 'Personalized guidance'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: BookOpen,
    title: 'Smart Recommendations',
    description: 'Get personalized content based on your assessment results',
    benefits: ['Curated articles', 'Relevant research', 'Growth resources'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Monitor your growth journey with meaningful milestones',
    benefits: ['Trend analysis', 'Achievement badges', 'Growth insights'],
    color: 'from-orange-500 to-yellow-500'
  }
];

const TESTIMONIALS = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Psychology Researcher',
    content: 'The pattern recognition approach is brilliant. No judgment, just insights.',
    avatar: '👩‍🔬',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Self-Development Coach',
    content: 'The AI chat feature helps clients explore their results in ways I never could.',
    avatar: '👨‍💼',
    rating: 5
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Behavioral Scientist',
    content: 'Finally, assessments that focus on understanding rather than scoring.',
    avatar: '👩‍🎓',
    rating: 5
  }
];

const STATS = [
  { value: '2,847+', label: 'Active Users', icon: Users },
  { value: '15+', label: 'Research Articles', icon: BookOpen },
  { value: '5', label: 'Assessment Types', icon: Brain },
  { value: '94%', label: 'Satisfaction Rate', icon: Star }
];

export default function EnhancedLandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % FEATURES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
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
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full text-sm font-medium text-purple-700 mb-6 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Research-backed self-discovery</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              >
                <span className="text-gray-900">Understand yourself through</span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                  pattern recognition
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
              >
                Take adaptive assessments, chat with AI about your results, and discover insights 
                that help you understand your unique patterns and potential.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-8"
              >
                <Button 
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-xl group"
                >
                  <Link href="/quizzes">
                    <Brain className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="px-6 py-4 text-lg border-2 hover:bg-purple-50 rounded-xl"
                >
                  <Link href="/demo/ui-improvements">
                    <Zap className="w-5 h-5 mr-2" />
                    Try Demo
                  </Link>
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No right/wrong answers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Privacy-first approach</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Research-backed insights</span>
                </div>
              </motion.div>
            </div>

            {/* Right Visual - Interactive Feature Demo */}
            <motion.div
              style={{ y }}
              className="relative"
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Live Feature Preview</h3>
                  <div className="flex space-x-1">
                    {FEATURES.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentFeature ? 'bg-purple-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${FEATURES[currentFeature].color} rounded-xl flex items-center justify-center`}>
                    {(() => {
                      const IconComponent = FEATURES[currentFeature].icon;
                      return <IconComponent className="w-6 h-6 text-white" />;
                    })()}
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold mb-2">{FEATURES[currentFeature].title}</h4>
                    <p className="text-gray-600 mb-4">{FEATURES[currentFeature].description}</p>
                    
                    <div className="space-y-2">
                      {FEATURES[currentFeature].benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              A Complete Self-Discovery Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature is designed around pattern recognition and research-backed insights, 
              not judgmental scoring.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={index % 2 === 1 ? 'lg:order-2' : ''}
              >
                <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">{feature.description}</p>
                  
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Researchers & Users
            </h2>
            <p className="text-xl text-gray-600">
              See what experts and users say about our approach
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 shadow-2xl">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Discover Your Patterns?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are gaining deeper self-awareness through 
                research-backed assessments and AI-powered insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl"
                >
                  <Link href="/quizzes">
                    <Brain className="w-5 h-5 mr-2" />
                    Start First Assessment
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  size="lg" 
                  className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl"
                >
                  <Link href="/blog">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Read Research
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-purple-200">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>5-10 minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>No right/wrong answers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>AI chat included</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
