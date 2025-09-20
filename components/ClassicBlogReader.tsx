'use client';

import { useState, useEffect } from 'react';
import type { ImgHTMLAttributes } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PRICING } from '@/lib/constants';
import { trackBlogView, trackBlogLike, trackBlogReadProgress } from '@/lib/analytics/gtag';
import { trackSubscription } from '@/lib/analytics/gtag';
import { Blog } from '@/data/blogs';
import PrimaryCTA from '@/components/ui/PrimaryCTA';

interface ClassicBlogReaderProps {
  blog: Blog;
}

interface ArticleAccessResponse {
  exists?: boolean;
  hasAccess: boolean;
  isPaid: boolean;
  basePrice: number;
  finalPrice: number;
  isSubscriber: boolean;
  purchased: boolean;
  error?: string;
}

export function ClassicBlogReader({ blog }: ClassicBlogReaderProps) {
  const [userSubscription, setUserSubscription] = useState<{ isPremium: boolean } | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(blog.likes || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [articleAccess, setArticleAccess] = useState<ArticleAccessResponse | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const router = useRouter();

  // Load cached email if present
  useEffect(() => {
    try {
      const cached = localStorage.getItem('mybeing_email');
      if (cached) setUserEmail(cached);
    } catch {}
  }, []);

  useEffect(() => {
    // Check subscription status
    fetch('/api/user/subscription')
      .then(res => res.json())
      .then(data => setUserSubscription(data))
      .catch(() => setUserSubscription({ isPremium: false }));

    // Check like status (only when we have an email)
    if (userEmail) {
      fetch(`/api/blog/like-status?email=${encodeURIComponent(userEmail)}&articleId=${encodeURIComponent(blog.id)}`)
        .then(res => res.json())
        .then(data => setIsLiked(!!data.isLiked))
        .catch(() => {});
    } else {
      setIsLiked(false);
    }
    // Check article access for premium articles
    if (blog.isPremium) {
      const params = new URLSearchParams({ slug: blog.slug });
      if (userEmail) params.set('email', userEmail);
      fetch(`/api/article/access?${params.toString()}`)
        .then(res => res.json())
        .then(data => setArticleAccess(data))
        .catch(() => setArticleAccess({ hasAccess: false, isPaid: true, basePrice: blog.price || 0, finalPrice: blog.price || 0, isSubscriber: false, purchased: false }));
    } else {
      setArticleAccess({ hasAccess: true, isPaid: false, basePrice: 0, finalPrice: 0, isSubscriber: false, purchased: false });
    }
  }, [blog.id, blog.slug, blog.isPremium, blog.price, userEmail]);

  useEffect(() => {
    if (!blog.isPremium) {
      setShowPaywall(false);
      return;
    }
    if (articleAccess) {
      setShowPaywall(!articleAccess.hasAccess);
      return;
    }
    setShowPaywall(true);
  }, [blog.isPremium, articleAccess]);

  const handleLike = async () => {
    try {
      let email = userEmail;
      if (!email) {
        email = prompt('Enter your email to like this article:') || '';
        if (!email) return;
        try { localStorage.setItem('mybeing_email', email); } catch {}
        setUserEmail(email);
      }

      const action = isLiked ? 'unlike' : 'like';
      const response = await fetch('/api/blog/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, articleId: blog.id, action })
      });
      
      if (response.ok) {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        // Track blog like event only on like
        if (action === 'like') {
          try { trackBlogLike(blog.slug); } catch {}
        }
      }
    } catch (error) {
      console.error('Failed to like article:', error);
    }
  };

  const handlePlayAudio = () => {
    // Allow audio for subscribers or if article access has been granted (purchase/unlock)
    if (userSubscription?.isPremium || articleAccess?.hasAccess) {
      setIsPlaying(!isPlaying);
      // Audio implementation would go here
    } else {
      setShowPaywall(true);
    }
  };

  const handleSubscribe = () => {
    // Track subscription intent
    trackSubscription('premium', PRICING.monthly);
    router.push('/subscribe');
  };

  const handlePurchaseArticle = async () => {
    // Ensure we have an email
    let email = userEmail;
    if (!email) {
      email = prompt('Enter your email to purchase this article:') || '';
      if (!email) return;
      try { localStorage.setItem('mybeing_email', email); } catch {}
      setUserEmail(email);
    }
    try {
      const res = await fetch('/api/article/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slug: blog.slug }),
      });
      if (res.ok) {
        const params = new URLSearchParams({ slug: blog.slug, email });
        const accessRes = await fetch(`/api/article/access?${params.toString()}`);
        const accessJson: ArticleAccessResponse = await accessRes.json();
        setArticleAccess(accessJson);
        setShowPaywall(!accessJson.hasAccess);
      }
    } catch (e) {
      console.error('Article purchase failed', e);
    }
  };

  // Show paywall for premium content if access not granted
  if (showPaywall && blog.isPremium) {
    return (
      <div className="min-h-screen bg-white">
        <article className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center border-b border-gray-100 pb-12 mb-16">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                Premium Article
              </span>
            </div>
            <h1 className="text-5xl font-serif text-black mb-8 leading-tight max-w-4xl mx-auto">
              {blog.title}
            </h1>
            <p className="text-2xl text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
              {blog.excerpt}
            </p>
          </div>
        
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif text-black mb-12">Choose Your Access</h2>
            
            <div className="space-y-8 mb-12">
              {/* Premium Subscription */}
              <div className="border border-gray-200 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl">★</span>
                  </div>
                  <h3 className="text-2xl font-serif text-black mb-4">Premium Monthly</h3>
                  <div className="text-4xl font-serif text-black mb-6">
                    {'$'}{PRICING.monthly}<span className="text-xl text-gray-600 font-sans">/month</span>
                  </div>
                  
                  <ul className="text-gray-700 space-y-3 mb-8 text-left max-w-sm mx-auto">
                    <li className="flex items-center">
                      <span className="mr-3 text-gray-400">✓</span> 
                      Audio narration for all articles
                    </li>
                    <li className="flex items-center">
                      <span className="mr-3 text-gray-400">✓</span> 
                      3 premium articles/month
                    </li>
                    <li className="flex items-center">
                      <span className="mr-3 text-gray-400">✓</span> 
                      2 free quizzes/month (≤ $50 value each)
                    </li>
                    <li className="flex items-center">
                      <span className="mr-3 text-gray-400">✓</span> 
                      Ad-free experience
                    </li>
                  </ul>
                  
                  <PrimaryCTA 
                    onClick={handleSubscribe}
                    surface="classic_article_paywall"
                    eventName="subscribe_click"
                    variant="secondary"
                    className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg font-medium"
                  >
                    Subscribe Now
                  </PrimaryCTA>
                </div>
              </div>

              {/* Individual Purchase */}
              <div className="border border-gray-200 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-6">
                    <span className="text-gray-600 text-2xl">📖</span>
                  </div>
                  <h3 className="text-2xl font-serif text-black mb-4">Single Article</h3>
                  <div className="text-4xl font-serif text-black mb-6">${articleAccess?.finalPrice ?? blog.price}</div>
                  
                  <ul className="text-gray-700 space-y-3 mb-8 text-left max-w-sm mx-auto">
                    <li className="flex items-center">
                      <span className="mr-3 text-gray-400">✓</span> 
                      Full article access
                    </li>
                    <li className="flex items-center">
                      <span className="mr-3 text-gray-400">✓</span> 
                      Audio narration
                    </li>
                    <li className="flex items-center">
                      <span className="mr-3 text-gray-400">✓</span> 
                      Lifetime access
                    </li>
                  </ul>
                  
                  <PrimaryCTA 
                    onClick={handlePurchaseArticle}
                    surface="classic_article_paywall"
                    eventName="purchase_click"
                    variant="outline"
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-4 text-lg font-medium"
                  >
                    Purchase Article
                  </PrimaryCTA>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center">
              Private by default • Cancel anytime • No right/wrong answers
            </p>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
        {/* Article Header */}
        <header className="mb-16 border-b border-gray-100 pb-12">
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {blog.isPremium && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium tracking-wide text-gray-600 uppercase border border-gray-200 rounded-full">
                Premium
              </span>
            )}
            {blog.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1 text-xs font-medium tracking-wide text-gray-600 uppercase border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-150">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 font-normal mb-6 leading-tight tracking-tight">
            {blog.title}
          </h1>
          <p className="text-xl text-gray-600 font-light mb-10 leading-relaxed">
            {blog.excerpt}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-4xl font-bold text-gray-900">${PRICING.monthly}</span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span>{blog.readTime} min read</span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <time dateTime={blog.publishedAt.toISOString()} className="whitespace-nowrap">
                {blog.publishedAt.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </time>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
              {blog.audioUrl && (
                <button
                  onClick={handlePlayAudio}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                >
                  <span className="mr-2">{isPlaying ? '⏸' : '▶'}</span>
                  <span>Listen</span>
                </button>
              )}
              
              <button
                onClick={handleLike}
                className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors duration-150 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                  isLiked 
                    ? 'text-red-600 border-red-200 hover:bg-red-50 focus:ring-red-500' 
                    : 'text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-700 focus:ring-gray-500'
                }`}
                aria-label={isLiked ? 'Unlike this article' : 'Like this article'}
              >
                <span className="mr-1">{isLiked ? '♥' : '♡'}</span>
                <span>{likes}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="mb-16">
          <div className="prose prose-lg sm:prose-xl max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}
              components={{
                img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img {...props} alt={(props.alt as string) || ''} className="rounded-md" />
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Related Quizzes */}
        {blog.relatedQuizzes && blog.relatedQuizzes.length > 0 && (
          <div className="border-t border-gray-100 pt-12 mb-16">
            <div className="mb-8">
              <h3 className="text-3xl font-serif text-black mb-4">
                Related Assessments
              </h3>
              <p className="text-xl text-gray-700 font-light">
                Apply what you've learned with these research-backed assessments
              </p>
            </div>
            <div>
              <div className="space-y-6">
                {blog.relatedQuizzes.map(quizSlug => (
                  <Link key={quizSlug} href={`/quizzes/${quizSlug}/classic`} className="block group">
                    <div className="p-6 border border-gray-200 hover:border-black transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xl font-serif text-black mb-2 group-hover:underline">
                            {quizSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Assessment
                          </h4>
                          <p className="text-gray-700 font-light">
                            Explore your patterns and get personalized insights
                          </p>
                        </div>
                        <span className="text-2xl text-gray-400 group-hover:text-black transition-colors">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Subscription CTA for free users */}
        {!userSubscription?.isPremium && (
          <div className="border-t border-gray-100 pt-12 text-center">
            <h3 className="text-3xl font-serif text-black mb-6">
              Continue Your Journey
            </h3>
            <p className="text-xl text-gray-700 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
              Get audio narration, premium articles, and related assessments with a MyBeing subscription.
            </p>
            <Button 
              onClick={handleSubscribe} 
              className="bg-black text-white hover:bg-gray-800 px-12 py-4 text-lg font-medium"
            >
              Subscribe for {'$'}{PRICING.monthly}/month
            </Button>
          </div>
        )}

      </article>
    </div>
  );
}
