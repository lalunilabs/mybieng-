'use client';

import { motion } from 'framer-motion';
import { PremiumArticleCard } from '@/components/ui/PremiumArticleCard';
import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const featuredArticles = [
  {
    slug: 'psychology-self-deception',
    title: 'The Psychology of Self-Deception',
    category: 'Cognitive Science',
    readTime: '7 min read',
    views: 12400,
    isPremium: true,
    excerpt: 'How our minds protect us from uncomfortable truths'
  },
  {
    slug: 'understanding-inner-critic',
    title: 'Understanding Your Inner Critic',
    category: 'Mental Health',
    readTime: '5 min read',
    views: 8900,
    isPremium: false,
    excerpt: 'Transform self-criticism into self-compassion'
  },
  {
    slug: 'science-habit-formation',
    title: 'The Science of Habit Formation',
    category: 'Behavioral Psychology',
    readTime: '9 min read',
    views: 15600,
    isPremium: true,
    excerpt: 'Evidence-based strategies for lasting change'
  }
];

export function ArticleSection() {
  const router = useRouter();
  return (
    <section className="article-section py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-orange-500" />
            <span className="text-sm font-medium text-orange-500 uppercase tracking-wider">
              Research & Insights
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Evidence-Based
            <span className="block text-orange-500">Self-Discovery</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Dive deep into the science of human behavior, cognition, and personal growth. 
            Research-backed articles to complement your self-discovery journey.
          </p>
        </motion.div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredArticles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <PremiumArticleCard
                title={article.title}
                category={article.category}
                readTime={article.readTime}
                views={article.views}
                isPremium={article.isPremium}
                onRead={() => router.push(`/blog/${article.slug}`)}
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
          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-2xl font-semibold text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
            >
              Read All Articles
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          
          <p className="text-sm text-muted-foreground mt-4">
            New research-backed content weekly • Free and premium articles
          </p>
        </motion.div>

        {/* Content Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">47</div>
            <div className="text-sm text-muted-foreground">Research Articles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">156k</div>
            <div className="text-sm text-muted-foreground">Total Reads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">23</div>
            <div className="text-sm text-muted-foreground">Expert Contributors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">Weekly</div>
            <div className="text-sm text-muted-foreground">New Content</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ArticleSection;
