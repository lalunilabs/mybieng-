"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ListChecks, FlaskConical, Users, TrendingUp, Sparkles, Brain, Search, Lightbulb, BookOpenCheck, Mail, MessageCircle, Star, ArrowRight, Play, CheckCircle, Zap } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/ui/PageTransition';
import { SmartCard } from '@/components/ui/SmartCard';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { quizzes } from '@/data/quizzes';
import { blogs } from '@/data/blogs';

export default function Home() {
  // Calculate dynamic counts
  const publishedQuizzes = quizzes.filter(quiz => quiz.published).length;
  const publishedBlogs = blogs.filter(blog => blog.published).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-100">
      
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-yellow-300/30 to-purple-500/20" />
        
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Understand your patterns.
                <br />
                <span className="text-purple-600">Improve your being.</span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-lg">
                Discover yourself through scientifically-backed quizzes and personalized insights. Track your growth, explore patterns, and unlock your potential with AI-powered guidance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full" asChild>
                  <Link href="/quizzes">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Your Journey
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-white/50 px-8 py-4 text-lg rounded-full" asChild>
                  <Link href="/blog">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Explore Insights
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            {/* Right Visual - iPad Style Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative flex justify-center items-center h-96"
            >
              {/* iPad-style device mockup */}
              <div className="relative">
                <div className="w-80 h-96 relative">
                  {/* iPad frame */}
                  <div className="w-full h-full bg-gray-900 rounded-3xl p-3 shadow-2xl">
                    {/* Screen */}
                    <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                      {/* Screen content - rotating between blog, newsletter, quiz */}
                      <motion.div
                        key="screen-content"
                        className="absolute inset-0 p-4"
                      >
                        {/* Blog preview */}
                        <div className="h-full flex flex-col">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="text-xs text-gray-500">mybeing.com/blog</div>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="h-16 bg-gradient-to-r from-purple-100 to-yellow-100 rounded-lg flex items-center px-3">
                              <div className="w-8 h-8 bg-purple-500 rounded-lg mr-3 flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-semibold text-gray-800">Understanding Patterns</div>
                                <div className="text-xs text-gray-600">5 min read</div>
                              </div>
                            </div>
                            <div className="h-12 bg-gray-50 rounded-lg flex items-center px-3">
                              <div className="w-6 h-6 bg-blue-400 rounded mr-2"></div>
                              <div className="text-xs text-gray-700">Self-Discovery Guide</div>
                            </div>
                            <div className="h-12 bg-gray-50 rounded-lg flex items-center px-3">
                              <div className="w-6 h-6 bg-green-400 rounded mr-2"></div>
                              <div className="text-xs text-gray-700">Weekly Insights</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements around iPad */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-8 -left-8 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Mail className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute -top-4 -right-12 w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    x: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-6 -right-8 w-14 h-14 bg-blue-400 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <BookOpenCheck className="w-7 h-7 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, 12, 0],
                    x: [0, -3, 0]
                  }}
                  transition={{ 
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                  className="absolute -bottom-4 -left-10 w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center shadow-lg"
                >
                  <Brain className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Everything you need section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for self-discovery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl">
              A comprehensive platform designed to help you understand yourself through research, reflection, and growth.
            </p>
          </motion.div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600">Self-discoveries made</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-gray-900 mb-2">{publishedQuizzes}+</div>
              <div className="text-gray-600">Research-backed quizzes</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-gray-600">Find insights valuable</div>
            </motion.div>
          </div>
          
          {/* Feature Cards */}
          <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { 
                icon: BookOpen, 
                title: 'Blogs', 
                description: 'Discover research-backed articles and insights',
                color: 'bg-yellow-100 text-yellow-600',
                tooltip: 'Evidence-based articles on psychology and personal growth'
              },
              { 
                icon: ListChecks, 
                title: 'Quizzes', 
                description: 'Interactive self-assessments',
                color: 'bg-purple-100 text-purple-600',
                tooltip: 'Research-backed assessments to understand your patterns'
              },
              { 
                icon: FlaskConical, 
                title: 'Inner Research', 
                description: 'Dive into deep insights and analysis',
                color: 'bg-blue-100 text-blue-600',
                tooltip: 'Advanced analytics and longitudinal tracking'
              }
            ].map((feature, index) => (
              <StaggerItem key={index}>
                <SmartCard 
                  className="text-center h-full" 
                  hover 
                  glow
                  variant="gradient"
                >
                  <Tooltip content={feature.tooltip}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.color} mb-6 transition-all duration-300 hover:scale-110`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                  </Tooltip>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </SmartCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Email Report Preview Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Your Personalized Report
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Receive detailed insights delivered to your inbox. Chat with AI about your results and get personalized guidance.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Email Preview */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Email header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-4 text-sm text-gray-600">Your MyBeing Report</div>
                  </div>
                </div>
                
                {/* Email content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">MyBeing Insights</div>
                      <div className="text-sm text-gray-600">insights@mybeing.com</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Your Cognitive Dissonance Analysis is Ready! 🧠
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-purple-900">Your Pattern: Moderate Dissonance</span>
                      </div>
                      <p className="text-sm text-purple-800">You show healthy awareness of value-behavior gaps with room for growth.</p>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-semibold text-yellow-900">Key Insight</span>
                      </div>
                      <p className="text-sm text-yellow-800">Focus on decision-making alignment for better consistency.</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4 text-center">
                    <MessageCircle className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Chat with AI about your results</div>
                    <div className="text-xs opacity-90">Ask questions, explore patterns, get guidance</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Features list */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Detailed Email Reports</h4>
                  <p className="text-gray-600">Get comprehensive analysis delivered to your inbox with actionable insights and personalized recommendations.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Chat Integration</h4>
                  <p className="text-gray-600">Ask questions about your results, explore deeper patterns, and get personalized guidance through conversational AI.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h4>
                  <p className="text-gray-600">Monitor your growth over time with longitudinal insights and track improvements in your patterns.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Quizzes Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Self-Discovery Quizzes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Research-backed assessments designed to reveal patterns in your thinking, behavior, and personal growth.
            </p>
          </motion.div>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {quizzes.filter(quiz => quiz.published).slice(0, 2).map((quiz, index) => (
              <StaggerItem key={quiz.slug}>
                <SmartCard 
                  className="p-8 group" 
                  hover 
                  glow 
                  tilt
                  variant="gradient"
                  onClick={() => window.location.href = `/quiz/${quiz.slug}`}
                >
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-2">
                      {quiz.questions.length} questions
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {quiz.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {quiz.description}
                </p>
                
                {/* What you'll learn */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">What you'll discover:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Your cognitive patterns and triggers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Personalized growth recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Research-backed insights</span>
                    </div>
                  </div>
                </div>
                
                {/* Why it's important */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">Why this matters</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Understanding these patterns helps you make better decisions and improve your overall well-being.
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Free</span> • 10-15 minutes
                  </div>
                  <div className="text-sm text-purple-600 font-semibold">
                    + AI Chat Analysis
                  </div>
                </div>
                
                <EnhancedButton 
                  className="w-full group-hover:bg-purple-700" 
                  variant="gradient"
                  icon={<ArrowRight className="w-4 h-4" />}
                  asChild
                >
                  <Link href={`/quiz/${quiz.slug}`}>
                    Start Assessment
                  </Link>
                </EnhancedButton>
                </SmartCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg" className="border-purple-200 text-purple-700 hover:bg-purple-50" asChild>
              <Link href="/quizzes">
                View All Assessments <ListChecks className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Quiz Process */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Journey to Self-Discovery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, research-backed process designed to give you actionable insights about yourself.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Take Assessment",
                description: "Answer thoughtful questions designed by researchers to reveal patterns in your thinking and behavior.",
                icon: ListChecks,
                color: "bg-blue-100 text-blue-600"
              },
              {
                step: "2", 
                title: "Get Insights",
                description: "Receive personalized results with detailed analysis of your patterns and what they mean for your growth.",
                icon: TrendingUp,
                color: "bg-purple-100 text-purple-600"
              },
              {
                step: "3",
                title: "Take Action",
                description: "Follow specific, actionable guidance tailored to your results. Track your progress over time.",
                icon: Sparkles,
                color: "bg-yellow-100 text-yellow-600"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                {/* Connection line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent transform translate-x-4"></div>
                )}
                
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.color} mb-6 relative z-10`}>
                  <step.icon className="w-8 h-8" />
                </div>
                
                <div className="bg-gray-50 text-gray-700 text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Research & Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Evidence-based articles to deepen your understanding of psychology, behavior patterns, and personal growth.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.filter(blog => blog.published).slice(0, 2).map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {blog.tags.map((tag) => (
                        <span key={tag} className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {blog.readTime} min read
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {blog.author}
                    </span>
                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50 group" asChild>
                      <Link href={`/blog/${blog.slug}`}>
                        Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-white" asChild>
              <Link href="/blog">
                Explore All Articles <BookOpen className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Self-Discovery Journey
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Start with free assessments or unlock deeper insights with premium features.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Free Explorer</h3>
                <div className="text-4xl font-bold text-white mb-2">$0</div>
                <div className="text-purple-200">Perfect to get started</div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">2 Free Assessments</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Basic Email Reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Access to Blog Articles</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Community Support</span>
                </div>
              </div>
              
              <Button className="w-full bg-white text-purple-700 hover:bg-gray-100 font-semibold" asChild>
                <Link href="/signup">Start Free</Link>
              </Button>
            </motion.div>
            
            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-yellow-400 relative transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Insights</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$19<span className="text-lg text-gray-600">/month</span></div>
                <div className="text-gray-600">Comprehensive self-discovery</div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited Assessments</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">AI Chat Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Detailed Progress Tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Premium Articles & Research</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Weekly Insights Newsletter</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Priority Support</span>
                </div>
              </div>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold" asChild>
                <Link href="/subscribe">Start Premium</Link>
              </Button>
            </motion.div>
            
            {/* Research Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Research Partner</h3>
                <div className="text-4xl font-bold text-white mb-2">$49<span className="text-lg text-purple-200">/month</span></div>
                <div className="text-purple-200">For serious self-researchers</div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Everything in Premium</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Custom Assessment Creation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Advanced Analytics Dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Research Data Export</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">1-on-1 Consultation</span>
                </div>
              </div>
              
              <Button className="w-full bg-white text-purple-700 hover:bg-gray-100 font-semibold" asChild>
                <Link href="/subscribe?plan=research">Contact Us</Link>
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-purple-200 mb-4">All plans include a 14-day free trial. Cancel anytime.</p>
            <div className="flex items-center justify-center gap-6 text-sm text-purple-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>No hidden fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>30-day money back</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to understand yourself better?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands discovering their patterns, improving their well-being, and unlocking their potential through science-backed self-discovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold" asChild>
                <Link href="/quizzes">Start Your First Assessment</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg" asChild>
                <Link href="/signup">Create Free Account</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
