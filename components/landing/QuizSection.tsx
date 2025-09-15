'use client';

import { motion } from 'framer-motion';
import { PremiumQuizCard } from '@/components/ui/PremiumQuizCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const featuredQuizzes = [
  {
    slug: 'cognitive-dissonance',
    title: 'The Mental Tug-of-War',
    subtitle: 'Discover contradictions between your values and actions across 5 key psychological patterns',
    duration: '8-12 min',
    participants: 2847,
    category: 'cognitive'
  },
  {
    slug: 'stress-patterns',
    title: 'Emotional Intelligence Mapping',
    subtitle: 'Understand your emotional patterns, social awareness, and relationship dynamics',
    duration: '6-10 min',
    participants: 1923,
    category: 'emotional'
  },
  {
    slug: 'self-awareness-mixed',
    title: 'Behavioral Pattern Analysis',
    subtitle: 'Identify your decision-making patterns and unconscious behavioral tendencies',
    duration: '5-8 min',
    participants: 3156,
    category: 'behavioral'
  }
];

export function QuizSection() {
  const router = useRouter();
  return (
    <section className="quiz-section py-24 bg-gradient-to-b from-background to-slate-50/50 dark:to-slate-900/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Self-Discovery Assessments
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Understand Yourself
            <span className="block text-primary">Through Science</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Take research-backed assessments designed to reveal your cognitive patterns, 
            emotional intelligence, and behavioral tendencies. No right or wrong answers—just insights.
          </p>
        </motion.div>

        {/* Quiz Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 justify-items-center">
          {featuredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <PremiumQuizCard
                title={quiz.title}
                subtitle={quiz.subtitle}
                duration={quiz.duration}
                participants={quiz.participants}
                onTakeQuiz={() => router.push(`/quizzes/${quiz.slug}`)}
                onLearnMore={() => router.push(`/quizzes/${quiz.slug}`)}
              />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/quizzes">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              Explore All Assessments
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          
          <p className="text-sm text-muted-foreground mt-4">
            Join thousands discovering their patterns • Free to start
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">7,926</div>
            <div className="text-sm text-muted-foreground">Assessments Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">94%</div>
            <div className="text-sm text-muted-foreground">Found Insights Valuable</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">12</div>
            <div className="text-sm text-muted-foreground">Research-Backed Quizzes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.8</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default QuizSection;
