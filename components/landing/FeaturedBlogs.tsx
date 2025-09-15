'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { fallbackBlogs } from '@/lib/fallbackData';
import ImageCard from '@/components/ui/ImageCard';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import SectionHeader from '@/components/ui/SectionHeader';

// Sample blog data - replace with actual data from your CMS
const featuredBlogs = [
  {
    slug: 'understanding-cognitive-patterns',
    title: 'Understanding Your Cognitive Patterns',
    excerpt: 'Discover how your mind processes information and makes decisions through research-backed insights.',
    author: 'Dr N',
    readTime: '8 min read',
    category: 'Psychology',
    imageUrl: '/images/blog/cognitive-patterns.jpg',
    publishedAt: new Date('2024-01-15')
  },
  {
    slug: 'stress-response-mechanisms',
    title: 'The Science of Stress Response',
    excerpt: 'Learn about your body\'s stress mechanisms and how to develop healthier coping strategies.',
    author: 'Dr N',
    readTime: '6 min read',
    category: 'Wellness',
    imageUrl: '/images/blog/stress-response.jpg',
    publishedAt: new Date('2024-01-10')
  },
  {
    slug: 'behavioral-change-psychology',
    title: 'The Psychology of Behavioral Change',
    excerpt: 'Explore the science behind habit formation and sustainable personal transformation.',
    author: 'Dr N',
    readTime: '10 min read',
    category: 'Behavior',
    imageUrl: '/images/blog/behavioral-change.jpg',
    publishedAt: new Date('2024-01-05')
  }
];

export default function FeaturedBlogs() {
  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SectionHeader
            overline={<span className="inline-flex items-center"><BookOpen className="w-4 h-4 mr-2" /> Latest Insights</span>}
            title="Research‑Backed"
            highlight="Articles"
            description="Dive deeper into the science of self-discovery with our curated articles on psychology, behavior, and personal growth."
            align="center"
          />
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fallbackBlogs.slice(0, 3).map((blog, index) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ImageCard
                title={blog.title}
                description={blog.excerpt}
                imageUrl={`https://images.unsplash.com/photo-${1559757148 + index}?w=400&h=250&fit=crop&auto=format&q=80`}
                author={blog.author}
                date={new Date(blog.published_at || '').toLocaleDateString()}
                readTime={blog.readTime}
                href={`/blog/${blog.slug}`}
                category="Understanding Yourself"
                isPremium={index === 2}
              />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <PrimaryCTA href="/blog" size="lg" variant="uiverse" className="px-8 py-4">
            <span className="mr-2">View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </PrimaryCTA>
        </motion.div>
      </div>
    </section>
  );
}
