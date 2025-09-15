'use client';

import { motion } from 'framer-motion';
import { PremiumQuizCard } from '@/components/ui/PremiumQuizCard';
import { PremiumArticleCard } from '@/components/ui/PremiumArticleCard';
import { QuizResultCard } from '@/components/ui/QuizLandscapeCard';

const sampleQuizzes = [
  {
    title: "Cognitive Dissonance Assessment",
    subtitle: "Discover contradictions between your values and actions across 5 key patterns",
    duration: "8-12 min",
    participants: 2847
  },
  {
    title: "Emotional Intelligence Mapping",
    subtitle: "Understand your emotional patterns and social awareness levels",
    duration: "6-10 min",
    participants: 1923
  },
  {
    title: "Behavioral Pattern Analysis",
    subtitle: "Identify your decision-making patterns and behavioral tendencies",
    duration: "5-8 min",
    participants: 3156
  }
];

const sampleArticles = [
  {
    title: "The Psychology of Self-Deception",
    category: "Cognitive Science",
    readTime: "7 min read",
    views: 12400,
    isPremium: true
  },
  {
    title: "Understanding Your Inner Critic",
    category: "Mental Health",
    readTime: "5 min read",
    views: 8900,
    isPremium: false
  },
  {
    title: "The Science of Habit Formation",
    category: "Behavioral Psychology",
    readTime: "9 min read",
    views: 15600,
    isPremium: true
  }
];

const sampleResults = [
  {
    id: "1",
    quizSlug: "cognitive-dissonance",
    quizTitle: "The Mental Tug-of-War",
    score: 85,
    maxScore: 100,
    bandLabel: "High Awareness",
    completedAt: new Date('2024-01-15'),
    category: 'cognitive' as const,
    chatMessages: 12,
    lastChatAt: new Date('2024-01-16')
  },
  {
    id: "2",
    quizSlug: "emotional-intelligence",
    quizTitle: "Emotional Intelligence Mapping",
    score: 72,
    maxScore: 100,
    bandLabel: "Developing",
    completedAt: new Date('2024-01-10'),
    category: 'emotional' as const,
    chatMessages: 8,
    lastChatAt: new Date('2024-01-12')
  }
];

export function CardsShowcase() {
  return (
    <div className="cards-showcase w-full max-w-7xl mx-auto p-8 space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-foreground mb-4">
          MyBeing Component Showcase
        </h1>
        <p className="text-lg text-muted-foreground">
          Premium quiz cards, article cards, and result cards with consistent branding
        </p>
      </motion.div>

      {/* Premium Quiz Cards */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-foreground mb-6"
        >
          Premium Quiz Cards
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {sampleQuizzes.map((quiz, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PremiumQuizCard
                title={quiz.title}
                subtitle={quiz.subtitle}
                duration={quiz.duration}
                participants={quiz.participants}
                onTakeQuiz={() => console.log(`Taking quiz: ${quiz.title}`)}
                onLearnMore={() => console.log(`Learning more about: ${quiz.title}`)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Premium Article Cards */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-foreground mb-6"
        >
          Premium Article Cards
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleArticles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PremiumArticleCard
                title={article.title}
                category={article.category}
                readTime={article.readTime}
                views={article.views}
                isPremium={article.isPremium}
                onRead={() => console.log(`Reading article: ${article.title}`)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quiz Result Cards */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-foreground mb-6"
        >
          Quiz Result Cards
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          {sampleResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <QuizResultCard
                quiz={result}
                onClick={() => console.log(`Viewing results for: ${result.quizTitle}`)}
                onChatClick={() => console.log(`Opening chat for: ${result.quizTitle}`)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Design System Notes */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-foreground mb-4">Design System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Colors</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Purple gradients for quiz cards</li>
              <li>• Yellow/orange gradients for articles</li>
              <li>• Category-themed colors for results</li>
              <li>• Consistent foreground/background</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Typography</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Bold titles (text-lg to text-2xl)</li>
              <li>• Light subtitles (text-xs, font-light)</li>
              <li>• Consistent font weights</li>
              <li>• Proper text hierarchy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Animations</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Smooth hover effects</li>
              <li>• Scale and translate transforms</li>
              <li>• Staggered entrance animations</li>
              <li>• Interactive button feedback</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Layout</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Responsive grid systems</li>
              <li>• Consistent spacing (p-4, p-6, p-8)</li>
              <li>• Rounded corners (rounded-2xl)</li>
              <li>• Proper aspect ratios</li>
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default CardsShowcase;
