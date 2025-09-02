'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, Users, ArrowRight, Brain, Target, Zap } from 'lucide-react';
import Link from 'next/link';

// Sample quiz data - replace with actual data from your quiz system
const featuredQuizzes = [
  {
    slug: 'cognitive-dissonance-assessment',
    title: 'Cognitive Dissonance Assessment',
    description: 'Discover how aligned your actions are with your core values and beliefs.',
    duration: '8-12 minutes',
    completions: '2.3k+',
    difficulty: 'Beginner',
    icon: Brain,
    color: 'from-purple-400 to-purple-600',
    category: 'Self-Awareness'
  },
  {
    slug: 'stress-pattern-analysis',
    title: 'Stress Pattern Analysis',
    description: 'Understand your stress triggers and develop personalized coping strategies.',
    duration: '10-15 minutes',
    completions: '1.8k+',
    difficulty: 'Intermediate',
    icon: Target,
    color: 'from-yellow-300 to-purple-400',
    category: 'Wellness'
  },
  {
    slug: 'behavioral-tendencies-quiz',
    title: 'Behavioral Tendencies Quiz',
    description: 'Explore your natural behavioral patterns and decision-making style.',
    duration: '6-10 minutes',
    completions: '3.1k+',
    difficulty: 'Beginner',
    icon: Zap,
    color: 'from-purple-300 to-yellow-400',
    category: 'Behavior'
  }
];

export default function FeaturedQuizzes() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-black rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4 mr-2" />
            Popular Assessments
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Discover Your
            <span className="block text-gradient bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Inner Patterns
            </span>
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
            Take research-backed assessments designed to reveal insights about your cognitive patterns, stress responses, and behavioral tendencies.
          </p>
        </motion.div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredQuizzes.map((quiz, index) => {
            const IconComponent = quiz.icon;
            return (
              <motion.div
                key={quiz.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-brutal transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 shadow-soft">
                  {/* Header with gradient */}
                  <div className={`h-24 bg-gradient-to-r ${quiz.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        {quiz.category}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-black group-hover:text-purple-600 transition-colors duration-200">
                      {quiz.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-black line-clamp-2">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-black mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{quiz.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{quiz.completions} taken</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-black">Difficulty:</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        quiz.difficulty === 'Beginner' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                    
                    <Button 
                      variant="gradient" 
                      size="sm" 
                      className="w-full shadow-glow hover:shadow-glow-lg group-hover:scale-105 transition-all duration-300"
                      asChild
                    >
                      <Link href={`/quizzes/${quiz.slug}`}>
                        <span className="mr-2">Start Quiz</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button 
            variant="gradient" 
            size="lg"
            className="shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link href="/quizzes">
              <span className="mr-2">Explore All Quizzes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
