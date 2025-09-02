'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

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
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-black rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            Latest Insights
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Research-Backed 
            <span className="block text-gradient bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Articles
            </span>
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
            Dive deeper into the science of self-discovery with our curated articles on psychology, behavior, and personal growth.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredBlogs.map((blog, index) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group hover:shadow-brutal transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 shadow-soft">
                {/* Image */}
                <div className="aspect-[16/9] bg-gradient-to-br from-yellow-300 to-purple-400 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/80 to-purple-400/80"></div>
                  <span className="text-4xl text-white relative z-10">📚</span>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-black group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                    {blog.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-black line-clamp-3">
                    {blog.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-black mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{blog.readTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-yellow-50 group-hover:border-purple-200 transition-colors duration-200"
                    asChild
                  >
                    <Link href={`/blog/${blog.slug}`}>
                      <span className="mr-2">Read Article</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
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
          <Button 
            variant="gradient" 
            size="lg"
            className="shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link href="/blog">
              <span className="mr-2">View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
