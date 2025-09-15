'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, User, ArrowRight, Brain, Users, Target, Zap, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { fallbackQuizzes } from '@/lib/fallbackData';
import { useGeneratedImage } from '@/components/hooks/useGeneratedImage';
import type { ReactNode } from 'react';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import PrimaryCTA from '@/components/ui/PrimaryCTA';

const SHOW_METRICS = process.env.NEXT_PUBLIC_SHOW_METRICS === 'true';
import ImageCard from '@/components/ui/ImageCard';

// Sample quiz data - replace with actual data from your quiz system
const featuredQuizzes = [
  {
    slug: 'cognitive-dissonance',
    title: 'Cognitive Dissonance Assessment',
    description: 'Discover how aligned your actions are with your core values and beliefs.',
    duration: '8-12 minutes',
    completions: '2.3k+',
    difficulty: 'Beginner',
    icon: Brain,
    color: 'from-purple-400 to-indigo-400',
    category: 'Self-Awareness',
    insights: 5
  },
  {
    slug: 'stress-patterns',
    title: 'Stress Pattern Analysis',
    description: 'Understand your stress triggers and develop personalized coping strategies.',
    duration: '10-15 minutes',
    completions: '1.8k+',
    difficulty: 'Intermediate',
    icon: Target,
    color: 'from-amber-500 to-orange-500',
    category: 'Wellness',
    insights: 7
  },
  {
    slug: 'self-awareness-mixed',
    title: 'Behavioral Tendencies Quiz',
    description: 'Explore your natural behavioral patterns and decision-making style.',
    duration: '6-10 minutes',
    completions: '3.1k+',
    difficulty: 'Beginner',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500',
    category: 'Behavior',
    insights: 4
  }
];

function QuizHeaderImage({ color, prompt, children }: { color: string; prompt: string; children: ReactNode }) {
  const { src: generated, enabled } = useGeneratedImage(prompt, '16:9');
  return (
    <div className="h-32 relative overflow-hidden">
      {enabled && generated && (
        <Image
          src={generated}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
      )}
      <div className={`absolute inset-0 bg-gradient-to-r ${color} ${enabled && generated ? 'opacity-70' : ''}`}></div>
      {children}
    </div>
  );
}

export default function FeaturedQuizzes() {
  return (
    <section className="py-20 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SectionHeader
            overline={<span className="inline-flex items-center"><Sparkles className="w-4 h-4 mr-2" /> Popular Assessments</span>}
            title="Discover Your"
            highlight="Inner Patterns"
            description="Take research-backed assessments designed to reveal insights about your cognitive patterns, stress responses, and behavioral tendencies."
            align="center"
          />
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
                <Card className="group h-full flex flex-col overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl">
                  {/* Header with optional generated image */}
                  <QuizHeaderImage
                    color={quiz.color}
                    prompt={`Editorial abstract cover for quiz titled \"${quiz.title}\" in category ${quiz.category}. Soft pastel, minimal, no people, high quality.`}
                  >
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-4 left-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-sm">
                        {quiz.category}
                      </span>
                    </div>
                    {/* Insights Badge (hide in starter mode) */}
                    {SHOW_METRICS && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                        <TrendingUp className="w-3 h-3 text-white" />
                        <span className="text-white text-xs font-medium">{quiz.insights} insights</span>
                      </div>
                    )}
                  </QuizHeaderImage>

                  <CardHeader className="pb-3 flex-1">
                    <CardTitle className="text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                      {quiz.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 line-clamp-2 mt-2">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 mt-auto">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{quiz.duration}</span>
                      </div>
                      {SHOW_METRICS && quiz.completions && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{quiz.completions} taken</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-gray-600">Difficulty:</span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        quiz.difficulty === 'Beginner' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                    
                    <PrimaryCTA
                      href={`/quizzes/${quiz.slug}`}
                      variant="uiverse"
                      className="w-full py-2.5 font-medium"
                    >
                      <span className="mr-2">Start Assessment</span>
                      <ArrowRight className="w-4 h-4" />
                    </PrimaryCTA>
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
          <PrimaryCTA href="/quizzes" size="lg" variant="uiverse" className="px-8 py-4 text-lg">
            <span className="mr-2">Explore All Assessments</span>
            <ArrowRight className="w-5 h-5" />
          </PrimaryCTA>
        </motion.div>
      </div>
    </section>
  );
}
