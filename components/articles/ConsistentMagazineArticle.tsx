'use client';

import { useState, useEffect, type ReactNode, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  User,
  Calendar,
  Share2,
  Bookmark,
  Heart,
  ArrowLeft,
  Tag,
  Sparkles,
  ShieldCheck,
  Mail,
  Book,
  Brain,
  MessageCircle,
  Lightbulb,
  Quote,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';
import Link from 'next/link';
import UsefulnessSurvey from '@/components/articles/UsefulnessSurvey';
import { designSystem, getCardClasses, getBadgeClasses, fadeInUp, staggerContainer, staggerChild } from '@/lib/design-system';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number | string;
  tags: string[];
  imageUrl?: string;
  category?: string;
  tldr?: string[];
  keyIdeas?: string[];
  frameworks?: string[];
  prompts?: string[];
  citations?: string[];
}

export interface SidebarArticleCard {
  slug: string;
  title: string;
  excerpt?: string;
  image?: string;
  imageUrl?: string;
  readTime?: number | string;
  publishedAt?: string;
  category?: string;
  tags?: string[];
  author?: string;
  isPremium?: boolean;
}

export interface SidebarQuizCard {
  slug: string;
  title: string;
  description?: string;
  estimatedTime?: number;
  category?: string;
  image?: string;
}

interface MagazineArticleProps {
  article: Article;
  relatedArticles?: SidebarArticleCard[];
  recommendedArticles?: SidebarArticleCard[];
  relatedQuizzes?: SidebarQuizCard[];
}

export function ConsistentMagazineArticle({
  article,
  relatedArticles = [],
  recommendedArticles = [],
  relatedQuizzes = []
}: MagazineArticleProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const articleReadTime = formatReadTimeValue(article.readTime);

  // Track reading progress (rAF throttled)
  useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = (scrollTop / (docHeight || 1)) * 100;
      setReadingProgress(Math.min(100, Math.max(0, p)));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const combinedRecommendations = recommendedArticles.length
    ? recommendedArticles
    : relatedArticles.slice(0, 4);

  return (
    <div className={`min-h-screen ${designSystem.gradients.page}`}>
      {/* Reading Progress */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </div>

      {/* Navigation */}
      <motion.div 
        className="fixed top-6 left-6 z-40"
        {...designSystem.animations.slideInLeft}
      >
        <Link href="/blog">
          <Button 
            variant="outline" 
            size="sm" 
            className="backdrop-blur-sm bg-white/90 border-white/50 shadow-lg hover:bg-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back to Articles</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </motion.div>

      {/* Article Actions */}
      <motion.div 
        className="fixed top-6 right-6 z-40 flex flex-row sm:flex-col gap-2"
        {...designSystem.animations.slideInRight}
      >
        <motion.div {...designSystem.animations.buttonPress}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`backdrop-blur-sm shadow-lg transition-all duration-200 ${
              isBookmarked 
                ? 'bg-amber-100 text-amber-700 border-amber-300' 
                : 'bg-white/90 border-white/50 hover:bg-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </motion.div>
        <motion.div {...designSystem.animations.buttonPress}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className={`backdrop-blur-sm shadow-lg transition-all duration-200 ${
              isLiked 
                ? 'bg-rose-100 text-rose-700 border-rose-300' 
                : 'bg-white/90 border-white/50 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </motion.div>
        <motion.div {...designSystem.animations.buttonPress}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare} 
            className="backdrop-blur-sm bg-white/90 border-white/50 shadow-lg hover:bg-white transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Article Content */}
          <motion.article 
            className="max-w-none"
            {...fadeInUp}
          >
            {/* Article Header */}
            <motion.header 
              className="mb-16"
              {...staggerContainer}
            >
              {article.category && (
                <motion.div className="mb-6" variants={staggerChild}>
                  <Badge className={getBadgeClasses('primary')}>
                    {article.category}
                  </Badge>
                </motion.div>
              )}
              
              <motion.h1 
                className={`${designSystem.typography.display} text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 mb-8`}
                variants={staggerChild}
              >
                {article.title}
              </motion.h1>
              
              <motion.p 
                className={`${designSystem.typography.body} text-slate-600 mb-10 max-w-4xl`}
                variants={staggerChild}
              >
                {article.excerpt}
              </motion.p>

              {/* Article Meta */}
              <motion.div 
                className={getCardClasses('slate') + ' flex flex-wrap items-center gap-6 text-sm text-slate-500'}
                variants={staggerChild}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700">{article.author}</div>
                    <div className="text-xs text-slate-500">Research Writer</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                {articleReadTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{articleReadTime}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>2.3k views</span>
                </div>
              </motion.div>

              {/* Structured Sections */}
              {Array.isArray(article.tldr) && article.tldr.length > 0 && (
                <StructuredSection
                  title="TL;DR"
                  icon={Sparkles}
                  variant="violet"
                  items={article.tldr}
                  type="bullets"
                />
              )}

              {Array.isArray(article.keyIdeas) && article.keyIdeas.length > 0 && (
                <StructuredSection
                  title="Key Ideas"
                  icon={Lightbulb}
                  variant="amber"
                  items={article.keyIdeas}
                  type="numbered"
                />
              )}

              {/* Featured Image */}
              {article.imageUrl && (
                <motion.div 
                  className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
                  variants={staggerChild}
                >
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={1200}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </motion.div>
              )}
            </motion.header>

            {/* Article Content */}
            <motion.div 
              className="prose prose-xl prose-slate max-w-none mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div 
                className="article-content text-lg leading-relaxed text-slate-700"
                dangerouslySetInnerHTML={{ __html: formatArticleContent(article.content) }}
              />
            </motion.div>

            {/* Post-Content Sections */}
            {Array.isArray(article.frameworks) && article.frameworks.length > 0 && (
              <StructuredSection
                title="Frameworks"
                icon={Book}
                variant="emerald"
                items={article.frameworks}
                type="numbered"
              />
            )}

            {Array.isArray(article.prompts) && article.prompts.length > 0 && (
              <StructuredSection
                title="Reflection Prompts"
                icon={MessageCircle}
                variant="indigo"
                items={article.prompts}
                type="cards"
              />
            )}

            {Array.isArray(article.citations) && article.citations.length > 0 && (
              <StructuredSection
                title="Citations"
                icon={Quote}
                variant="slate"
                items={article.citations}
                type="numbered"
              />
            )}

            {/* Usefulness Survey */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <UsefulnessSurvey articleId={article.id} articleTitle={article.title} />
            </motion.div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <motion.div 
                className="mt-12 pt-8 border-t border-slate-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-slate-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.article>

          {/* Sidebar */}
          <motion.aside 
            className="space-y-8"
            {...designSystem.animations.slideInRight}
          >
            <PremiumPlanModule />
            <NewsletterCaptureModule />

            {relatedQuizzes.length > 0 && (
              <SidebarSection title="Related Quizzes" icon={Brain}>
                <div className="space-y-4">
                  {relatedQuizzes.map((quiz) => (
                    <QuizCard key={quiz.slug} quiz={quiz} />
                  ))}
                </div>
              </SidebarSection>
            )}

            {combinedRecommendations.length > 0 && (
              <SidebarSection title="Recommended Articles" icon={Book}>
                <div className="space-y-4">
                  {combinedRecommendations.slice(0, 3).map((item) => (
                    <ArticleCard key={item.slug} article={item} />
                  ))}
                </div>
              </SidebarSection>
            )}
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
interface StructuredSectionProps {
  title: string;
  icon: ComponentType<{ className?: string }>;
  variant: 'violet' | 'amber' | 'emerald' | 'indigo' | 'slate';
  items: string[];
  type: 'bullets' | 'numbered' | 'cards';
}

function StructuredSection({ title, icon: Icon, variant, items, type }: StructuredSectionProps) {
  return (
    <motion.div 
      className={getCardClasses(variant) + ' mt-12'}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className={designSystem.typography.h3 + ' text-slate-800'}>{title}</h2>
      </div>
      
      <div className={type === 'cards' ? 'grid gap-4' : 'space-y-3'}>
        {items.map((item, idx) => (
          <motion.div 
            key={idx} 
            className={
              type === 'cards' 
                ? 'p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40' 
                : 'flex items-start gap-3'
            }
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            {type === 'numbered' && (
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {idx + 1}
              </div>
            )}
            {type === 'bullets' && (
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 mt-2.5 flex-shrink-0" />
            )}
            <p className="text-base text-slate-700 leading-relaxed">{item}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PremiumPlanModule() {
  return (
    <motion.div 
      className={getCardClasses('violet')}
      {...designSystem.animations.hoverScale}
    >
      <div className={getBadgeClasses('primary')}>
        <ShieldCheck className="h-4 w-4" />
        Premium Plan
      </div>
      <h3 className={`${designSystem.typography.h4} text-slate-900 mt-4`}>
        Unlock the full MyBeing experience
      </h3>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
        $32/month for 3 premium research articles, 2 advanced quizzes, unlimited AI conversations, and personalized learning plans.
      </p>
      <motion.div className="mt-6" {...designSystem.animations.buttonPress}>
        <Button
          asChild
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
        >
          <Link href="/subscribe">Join Premium</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}

function NewsletterCaptureModule() {
  return (
    <motion.div 
      className={getCardClasses('slate')}
      {...designSystem.animations.hoverScale}
    >
      <div className={getBadgeClasses('secondary')}>
        <Mail className="h-4 w-4" />
        Weekly Insights
      </div>
      <h3 className={`${designSystem.typography.h4} text-slate-900 mt-4`}>
        Get research distilled into 5-minute briefs
      </h3>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
        Join thousands exploring non-medical psychology and longitudinal trends.
      </p>
      <form className="mt-4 space-y-3" action="/api/newsletter/subscribe" method="post">
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          className={designSystem.components.input.base}
          required
        />
        <motion.div {...designSystem.animations.buttonPress}>
          <Button type="submit" className="w-full bg-slate-800 text-white hover:bg-slate-900">
            Subscribe
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}

function SidebarSection({ title, icon: Icon, children }: { title: string; icon: ComponentType<{ className?: string }>; children: ReactNode }) {
  return (
    <motion.section 
      className={getCardClasses('slate')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h2 className={`${designSystem.typography.h4} text-slate-900`}>{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function QuizCard({ quiz }: { quiz: SidebarQuizCard }) {
  return (
    <Link
      href={`/quizzes/${quiz.slug}`}
      className="block p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:shadow-md transition-all duration-200"
    >
      <h3 className="font-semibold text-slate-900 mb-2">{quiz.title}</h3>
      {quiz.description && (
        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{quiz.description}</p>
      )}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        {quiz.category && <span>{quiz.category}</span>}
        {quiz.estimatedTime && <span>{quiz.estimatedTime} min</span>}
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: SidebarArticleCard }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="block p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:shadow-md transition-all duration-200"
    >
      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{article.title}</h3>
      {article.excerpt && (
        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{article.excerpt}</p>
      )}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        {article.category && <span>{article.category}</span>}
        {article.readTime && <span>{formatReadTimeValue(article.readTime)}</span>}
        {article.isPremium && <span className="text-violet-600">Premium</span>}
      </div>
    </Link>
  );
}

// Helper functions
function formatArticleContent(content: string): string {
  return content
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-slate-900 mt-12 mb-6">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-slate-800 mt-10 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-slate-800 mt-8 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/^(?!<[h1-6]|<strong|<em)(.+)$/gm, '<p class="mb-4 leading-relaxed">$1</p>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-violet-500 pl-4 py-2 my-6 bg-violet-50 italic">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="mb-1">$1</li>')
    .replace(/(<li.*<\/li>)/gs, '<ul class="list-disc list-inside mb-4 ml-4">$1</ul>');
}

function formatReadTimeValue(value: number | string | undefined): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    return `${value} min read`;
  }
  const trimmed = value.toString().trim();
  return trimmed.length ? trimmed : null;
}
