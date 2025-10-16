'use client';

import { useState, useEffect, useRef } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Heart, 
  MessageCircle,
  Clock, 
  User, 
  Calendar,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  Eye,
  TrendingUp,
  Tag,
  ChevronUp,
  Moon,
  Sun,
  Type,
  Minus,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  imageUrl?: string;
  category?: string;
  views?: number;
  likes?: number;
}

interface EnhancedArticleReaderProps {
  article: Article;
  relatedArticles?: Article[];
}

export function EnhancedArticleReader({ article, relatedArticles = [] }: EnhancedArticleReaderProps) {
  // Enhanced hooks for premium experience
  useSmoothScroll();
  useKeyboardNavigation({
    enableArrowKeys: true,
    enableTabNavigation: true,
    enableEscapeKey: true
  });
  
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  const [wordsRead, setWordsRead] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Calculate reading progress and time
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      setReadingProgress(progress);
      setShowScrollTop(scrollTop > 500);

      // Calculate words read based on scroll position
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrolled = scrollTop + viewportHeight;
        const contentProgress = Math.min(1, scrolled / contentHeight);
        
        const totalWords = article.content.split(' ').length;
        const currentWordsRead = Math.floor(totalWords * contentProgress);
        setWordsRead(currentWordsRead);
        
        const wordsPerMinute = 200;
        const remainingWords = totalWords - currentWordsRead;
        const timeRemaining = Math.ceil(remainingWords / wordsPerMinute);
        setEstimatedReadTime(Math.max(0, timeRemaining));
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.content]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = article.title;
    const text = article.excerpt;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy URL');
      }
    } else if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.error('Failed to share');
      }
    }
    setShowShareMenu(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const adjustFontSize = (increment: boolean) => {
    setFontSize(prev => {
      const newSize = increment ? prev + 2 : prev - 2;
      return Math.max(14, Math.min(24, newSize));
    });
  };
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200/50 backdrop-blur-sm z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 shadow-lg shadow-purple-500/20"
          style={{ width: progressWidth }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Floating Reading Tools */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        <Card className={`p-3 shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="flex flex-col items-center gap-3">
            {/* Reading Progress */}
            <div className="text-center">
              <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {Math.round(readingProgress)}%
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {estimatedReadTime}m left
              </div>
            </div>

            {/* Font Size Controls */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => adjustFontSize(true)}
                className={`p-1 rounded hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => adjustFontSize(false)}
                className={`p-1 rounded hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </Card>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`shadow-lg ${
            isBookmarked 
              ? 'bg-purple-50 text-purple-600 border-purple-200' 
              : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsLiked(!isLiked)}
          className={`shadow-lg ${
            isLiked 
              ? 'bg-red-50 text-red-600 border-red-200' 
              : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>
        
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareMenu(!showShareMenu)}
            className={`shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          
          {showShareMenu && (
            <Card className={`absolute right-full mr-3 top-0 p-3 shadow-xl ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
            }`}>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
                    darkMode ? 'hover:bg-gray-700' : ''
                  }`}
                >
                  <Twitter className="w-4 h-4" />
                  <span className="text-sm">Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
                    darkMode ? 'hover:bg-gray-700' : ''
                  }`}
                >
                  <Facebook className="w-4 h-4" />
                  <span className="text-sm">Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
                    darkMode ? 'hover:bg-gray-700' : ''
                  }`}
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
                    darkMode ? 'hover:bg-gray-700' : ''
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="fixed top-20 left-6 z-40">
        <Link href="/blog">
          <Button 
            variant="outline" 
            size="sm" 
            className={`shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg transition-colors ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-24">
        {/* Article Header */}
        <header className="mb-12">
          {article.category && (
            <div className="mb-4">
              <Badge variant="secondary" className={`${
                darkMode ? 'bg-purple-900 text-purple-200' : 'text-purple-600 bg-purple-50'
              }`}>
                {article.category}
              </Badge>
            </div>
          )}
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {article.title}
          </h1>
          
          <p className={`text-xl md:text-2xl leading-relaxed mb-8 font-light ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {article.excerpt}
          </p>

          {/* Article Meta */}
          <div className={`flex flex-wrap items-center gap-6 text-sm mb-8 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {article.author}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} min read</span>
            </div>
            {article.views && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div 
          ref={contentRef}
          className={`prose prose-lg max-w-none ${
            darkMode ? 'prose-invert' : 'prose-slate'
          }`}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
        >
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: formatArticleContent(article.content) }}
          />
        </div>

        {/* Article Tags */}
        {article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Tag className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tags
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className={darkMode ? 'border-gray-600 text-gray-300' : 'text-gray-600'}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className={`mt-16 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {article.author.charAt(0)}
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {article.author}
              </h3>
              <p className={`leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Research-focused writer exploring the intersection of psychology, technology, and human behavior. 
                Passionate about making complex behavioral science accessible and actionable.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-20">
            <h2 className={`text-2xl font-bold mb-8 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedArticles.slice(0, 4).map((relatedArticle) => (
                <Link key={relatedArticle.id} href={`/blog/${relatedArticle.id}`}>
                  <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'hover:shadow-xl'
                  }`}>
                    <CardContent className="p-6">
                      {relatedArticle.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={relatedArticle.imageUrl}
                            alt={relatedArticle.title}
                            width={400}
                            height={200}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className={`text-lg font-semibold group-hover:text-purple-600 transition-colors mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {relatedArticle.title}
                      </h3>
                      <p className={`text-sm leading-relaxed mb-3 line-clamp-3 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {relatedArticle.excerpt}
                      </p>
                      <div className={`flex items-center gap-4 text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <span>{relatedArticle.readTime} min read</span>
                        <span>{formatDate(relatedArticle.publishedAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

// Helper function to format article content with proper styling
function formatArticleContent(content: string): string {
  // Enhanced content formatting with dark mode support
  let formattedContent = content
    // H1 headings
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl md:text-4xl font-bold mt-16 mb-8 leading-tight">$1</h1>')
    // H2 headings
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl md:text-3xl font-semibold mt-12 mb-6 leading-tight">$1</h2>')
    // H3 headings
    .replace(/^### (.+)$/gm, '<h3 class="text-xl md:text-2xl font-semibold mt-10 mb-4 leading-tight">$1</h3>')
    // H4 headings
    .replace(/^#### (.+)$/gm, '<h4 class="text-lg md:text-xl font-semibold mt-8 mb-3 leading-tight">$1</h4>')
    // Bold text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic text
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    // Paragraphs
    .replace(/^(?!<[h1-6]|<strong|<em|<blockquote|<ul|<li)(.+)$/gm, '<p class="text-lg leading-relaxed mb-6">$1</p>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-purple-500 pl-6 py-4 my-8 bg-purple-50 dark:bg-purple-900/20 text-lg italic">$1</blockquote>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="text-lg mb-2">$1</li>')
    .replace(/(<li.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-2 mb-6 ml-4">$1</ul>');

  return formattedContent;
}
