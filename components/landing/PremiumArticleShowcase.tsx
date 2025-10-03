'use client';

import { useState, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, TrendingUp, Sparkles, ArrowRight, Eye, Heart, Share2, Bookmark } from 'lucide-react';
import PrimaryCTA from '@/components/ui/PrimaryCTA';

const FEATURED_ARTICLES = [
  {
    id: 1,
    title: "The Mental Tug-of-War: Cognitive Dissonance",
    excerpt: "Explore the fascinating psychology behind conflicting beliefs and actions. Discover why we justify contradictions and how to align your values with your behavior through practical strategies backed by decades of research.",
    category: "Psychology",
    readTime: "8 min read",
    difficulty: "Beginner",
    href: "/blog/mental-tug-of-war-cognitive-dissonance",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=800&auto=format&fit=crop",
    featured: true,
    stats: { views: "2.3k", likes: "189", shares: "47" },
    tags: ["Decision Making", "Self-Awareness", "Psychology"]
  },
  {
    id: 2,
    title: "Understanding Decision-Making Patterns",
    excerpt: "Dive into the science of how we make choices and the cognitive biases that influence our daily decisions. Learn to recognize patterns and make more intentional choices.",
    category: "Research",
    readTime: "6 min read",
    difficulty: "Intermediate",
    href: "/blog",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800&auto=format&fit=crop",
    featured: false,
    stats: { views: "1.8k", likes: "142", shares: "31" },
    tags: ["Decision Science", "Cognitive Bias", "Research"]
  },
  {
    id: 3,
    title: "The Science of Behavioral Change",
    excerpt: "Explore evidence-based strategies for sustainable personal transformation. Understand the psychology of habit formation and how to create lasting positive changes.",
    category: "Behavior",
    readTime: "10 min read",
    difficulty: "Advanced",
    href: "/blog",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=800&auto=format&fit=crop",
    featured: false,
    stats: { views: "1.5k", likes: "98", shares: "23" },
    tags: ["Behavior Change", "Habits", "Psychology"]
  }
];

function ArticleCard({ article, index }: { article: typeof FEATURED_ARTICLES[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7.5, -7.5]));
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7.5, 7.5]));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`group relative ${article.featured ? 'lg:col-span-2 lg:row-span-2' : ''}`}
    >
      <Link href={article.href} className="block h-full">
        <div className={`relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 h-full ${
          article.featured 
            ? 'border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white' 
            : 'border border-gray-200 hover:border-purple-200'
        }`}>
          {/* Featured Badge */}
          {article.featured && (
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full shadow-lg">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </div>
            </div>
          )}

          {/* Image Section */}
          <div className={`relative overflow-hidden ${article.featured ? 'h-64' : 'h-48'}`}>
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes={article.featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            
            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg"
            >
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-gray-600" />
                  <span className="font-medium">{article.stats.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span className="font-medium">{article.stats.likes}</span>
                </div>
              </div>
            </motion.div>

            {/* Category Badge */}
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-full shadow-sm">
                {article.category}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className={`p-6 ${article.featured ? 'pb-8' : ''}`}>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {article.tags.slice(0, article.featured ? 3 : 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className={`font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-3 leading-tight ${
              article.featured ? 'text-xl sm:text-2xl' : 'text-lg'
            }`}>
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className={`text-gray-600 leading-relaxed mb-4 ${
              article.featured ? 'text-base' : 'text-sm line-clamp-3'
            }`}>
              {article.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  article.difficulty === 'Beginner' 
                    ? 'bg-green-100 text-green-700'
                    : article.difficulty === 'Intermediate'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {article.difficulty}
                </div>
              </div>
              
              {/* Action Icons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                className="flex items-center gap-2"
              >
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Bookmark className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
              </motion.div>
            </div>

            {/* Read More Link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                <span className={article.featured ? 'text-base' : 'text-sm'}>Read Article</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
              
              {article.featured && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3" />
                  <span>Trending</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function PremiumArticleShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Curated Insights</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Must-Read Articles for
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Curious Minds
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dive deep into research-backed insights that challenge your thinking and expand your understanding of psychology, behavior, and personal growth.
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {FEATURED_ARTICLES.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <PrimaryCTA 
            href="/blog" 
            variant="uiverse" 
            size="lg"
            className="px-8 py-4 text-lg font-semibold group"
            eventName="article_showcase_view_all"
            surface="article_showcase"
          >
            <BookOpen className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            Explore All Articles
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </PrimaryCTA>
          
          <p className="text-sm text-gray-500 mt-4">
            Join 2,847+ readers discovering new insights every week
          </p>
        </motion.div>
      </div>
    </section>
  );
}
