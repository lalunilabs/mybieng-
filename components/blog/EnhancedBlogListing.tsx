'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  BookOpen, 
  TrendingUp,
  Filter,
  Search,
  Grid,
  List,
  Star,
  Eye,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  imageUrl?: string;
  category?: string;
  featured?: boolean;
  views?: number;
  likes?: number;
  premium?: boolean;
}

interface EnhancedBlogListingProps {
  articles: Article[];
  featuredArticles?: Article[];
}

export function EnhancedBlogListing({ articles, featuredArticles = [] }: EnhancedBlogListingProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'magazine'>('magazine');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(articles);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))];

  // Filter articles
  useEffect(() => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredArticles(filtered);
  }, [articles, selectedCategory, searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section - Inspired by Medium/Substack */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5" />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Insights for
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {' '}Self-Discovery
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Research-backed articles exploring the patterns that shape who you are and who you're becoming.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Articles - Magazine Style */}
      {featuredArticles.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Featured Article */}
              <div className="lg:col-span-2">
                <FeaturedArticleCard article={featuredArticles[0]} large />
              </div>
              
              {/* Secondary Featured Articles */}
              <div className="space-y-6">
                {featuredArticles.slice(1, 3).map((article) => (
                  <FeaturedArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters & Search - Inspired by Ghost/Notion */}
      <section className="py-8 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('magazine')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'magazine' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Magazine View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${selectedCategory}-${searchQuery}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'magazine' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.map((article, index) => (
                    <ArticleCard key={article.slug} article={article} index={index} />
                  ))}
                </div>
              )}

              {viewMode === 'list' && (
                <div className="space-y-6">
                  {filteredArticles.map((article, index) => (
                    <ArticleListItem key={article.slug} article={article} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Featured Article Card Component
function FeaturedArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group cursor-pointer"
      >
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
          {article.imageUrl && (
            <div className={`relative overflow-hidden ${large ? 'h-64' : 'h-40'}`}>
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {article.premium && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                  Premium
                </Badge>
              )}
            </div>
          )}
          <CardContent className="p-6">
            {article.category && (
              <Badge variant="outline" className="mb-3">
                {article.category}
              </Badge>
            )}
            <h3 className={`font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-3 ${
              large ? 'text-2xl' : 'text-lg'
            }`}>
              {article.title}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span>{article.author}</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

// Regular Article Card Component
function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${article.slug}`}>
        <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
          {article.imageUrl && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {article.premium && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                  Premium
                </Badge>
              )}
            </div>
          )}
          <CardContent className="p-6 flex-1 flex flex-col">
            {article.category && (
              <Badge variant="outline" className="mb-3 w-fit">
                {article.category}
              </Badge>
            )}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-3 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-3">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime}m</span>
                </div>
                {article.views && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{article.views}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// List View Article Item
function ArticleListItem({ article, index }: { article: Article; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/blog/${article.slug}`}>
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {article.imageUrl && (
                <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {article.category && (
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                    )}
                    {article.premium && (
                      <Badge className="bg-yellow-500 text-white text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(article.publishedAt)}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>{article.author}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime} min read</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
