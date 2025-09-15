'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ImgHTMLAttributes } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { PRICING } from '@/lib/constants';
import type { Blog } from '@/data/blogs';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import { trackBlogView, trackBlogLike, trackBlogReadProgress } from '@/lib/analytics/gtag';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import BookmarkButton from '@/components/BookmarkButton';
import NewsletterModal from '@/components/modals/NewsletterModal';
import SubscriptionOfferModal from '@/components/modals/SubscriptionOfferModal';

interface BlogReaderProps {
  blog: Blog;
  userEmail?: string;
  prev?: Blog;
  next?: Blog;
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

export function BlogReader({ blog, userEmail, prev, next }: BlogReaderProps) {
  const [userSubscription, setUserSubscription] = useState<{ isPremium: boolean } | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(blog.likes || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [readStartTime] = useState(Date.now());
  const [showPaywall, setShowPaywall] = useState(false);
  const [articleAccess, setArticleAccess] = useState<ArticleAccessResponse | null>(null);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showSubscriptionOffer, setShowSubscriptionOffer] = useState(false);
  const router = useRouter();

  const checkLikeStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/blog/like-status?email=${userEmail}&articleId=${blog.id}`);
      const data = await response.json();
      setIsLiked(data.isLiked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }, [userEmail, blog.id]);

  useEffect(() => {
    // Track blog view
    trackBlogView(blog.slug, blog.title, blog.readTime || 5);
    
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
    // Check article access (handles subscriber allowance and purchases)
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
      
    // Track read progress on scroll
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > 0 && scrollPercent % 25 === 0) {
        trackBlogReadProgress(blog.slug, scrollPercent);
      }
      // Trigger newsletter modal once per visitor after initial engagement
      if (
        !showNewsletterModal &&
        scrollPercent >= 35
      ) {
        try {
          const dismissed = localStorage.getItem('newsletter-modal-dismissed') === 'true';
          const subscribed = localStorage.getItem('newsletter-subscribed') === 'true';
          if (!dismissed && !subscribed) setShowNewsletterModal(true);
        } catch {
          setShowNewsletterModal(true);
        }
      }
      // Offer subscription near completion for non-subscribers
      if (
        !showSubscriptionOffer &&
        scrollPercent >= 90 &&
        !(userSubscription?.isPremium)
      ) {
        try {
          const dismissed = localStorage.getItem('subscription-offer-dismissed') === 'true';
          if (!dismissed) setShowSubscriptionOffer(true);
        } catch {
          setShowSubscriptionOffer(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog.id, blog.slug, blog.title, blog.readTime, blog.isPremium, blog.price, userEmail, showNewsletterModal, showSubscriptionOffer, userSubscription?.isPremium]);

  useEffect(() => {
    if (!blog.isPremium) {
      setShowPaywall(false);
      return;
    }
    // If we have an article access determination, use it
    if (articleAccess) {
      setShowPaywall(!articleAccess.hasAccess);
      return;
    }
    // Fallback: without access info, default to showing paywall for premium
    setShowPaywall(true);
  }, [blog.isPremium, articleAccess]);

  const handleLike = async () => {
    if (!userEmail) {
      // Prompt for email to like
      const email = prompt('Enter your email to like this article:');
      if (!email) return;
      
      try {
        const response = await fetch('/api/blog/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, articleId: blog.id, action: 'like' })
        });
        
        if (response.ok) {
          setIsLiked(true);
          setLikes(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error liking article:', error);
      }
    } else {
      try {
        const action = isLiked ? 'unlike' : 'like';
        const response = await fetch('/api/blog/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, articleId: blog.id, action })
        });
        
        if (response.ok) {
          setIsLiked(!isLiked);
          setLikes(prev => isLiked ? prev - 1 : prev + 1);
        }
      } catch (error) {
        console.error('Error updating like:', error);
      }
    }
  };

  const handlePlayAudio = () => {
    if (blog.audioUrl) {
      // Allow if subscriber or article is accessible (purchased/unlocked)
      if (userSubscription?.isPremium || articleAccess?.hasAccess) {
        setIsPlaying(!isPlaying);
        // Implement audio playback logic here
        console.log('Playing audio:', blog.audioUrl);
      } else {
        setShowPaywall(true);
      }
    }
  };

  const handleSubscribe = () => {
    router.push('/subscribe');
  };

  const handlePurchaseArticle = async () => {
    // Ensure we have an email
    let email = userEmail;
    if (!email) {
      const input = prompt('Enter your email to purchase this article:') || '';
      if (!input) return;
      email = input;
    }

    try {
      const res = await fetch('/api/article/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slug: blog.slug }),
      });
      if (res.ok) {
        // Re-check access
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

  if (showPaywall && blog.isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/10 to-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <Card variant="elevated" className="border-2 border-amber-500/20 shadow-glow">
            <CardHeader className="text-center pb-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <span className="text-2xl">🔒</span>
                </div>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  Premium Content
                </span>
              </div>
              <CardTitle className="text-3xl font-bold text-foreground mb-4">{blog.title}</CardTitle>
              <div className="flex justify-center mb-4">
                <BookmarkButton 
                  type="article" 
                  itemId={blog.slug} 
                  title={blog.title} 
                  className="bg-white/80 backdrop-blur-sm"
                />
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">{blog.excerpt}</p>
            </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="bg-gradient-to-r from-primary/5 to-amber-500/5 rounded-2xl p-8 border border-primary/10">
              <h3 className="text-2xl font-bold text-foreground mb-6">Choose Your Access</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Premium Subscription */}
                <Card variant="elevated" className="border-2 border-primary/20 hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">⭐</span>
                    </div>
                    <h4 className="font-bold text-xl text-primary mb-2">Premium Monthly</h4>
                    <div className="text-4xl font-bold text-foreground mb-4">${PRICING.MONTHLY_USD}<span className="text-lg text-muted-foreground">/month</span></div>
                    
                    <ul className="text-sm text-muted-foreground space-y-3 mb-6">
                      <li className="flex items-center"><span className="mr-2 text-emerald-500">✅</span> Audio narration for all articles</li>
                      <li className="flex items-center"><span className="mr-2 text-emerald-500">✅</span> 3 premium articles/month</li>
                      <li className="flex items-center"><span className="mr-2 text-emerald-500">✅</span> 2 free quizzes/month (≤ $50 value each)</li>
                      <li className="flex items-center"><span className="mr-2 text-emerald-500">✅</span> No ads + member discounts on extras</li>
                    </ul>
                    
                    <PrimaryCTA 
                      onClick={handleSubscribe}
                      surface="article_paywall"
                      eventName="subscribe_click"
                      className="w-full"
                      variant="uiverse"
                    >
                      Subscribe Now
                    </PrimaryCTA>
                  </CardContent>
                </Card>

                {/* Individual Purchase */}
                <Card variant="elevated" className="hover:shadow-medium transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">📖</span>
                    </div>
                    <h4 className="font-bold text-xl text-foreground mb-2">Single Article</h4>
                    <div className="text-4xl font-bold text-foreground mb-4">${articleAccess?.finalPrice ?? blog.price}</div>
                    
                    <ul className="text-sm text-muted-foreground space-y-3 mb-6">
                      <li className="flex items-center"><span className="mr-2">📖</span> Full article access</li>
                      <li className="flex items-center"><span className="mr-2">🎧</span> Audio narration</li>
                      <li className="flex items-center"><span className="mr-2">💾</span> Lifetime access</li>
                      <li className="flex items-center"><span className="mr-2">📱</span> Mobile friendly</li>
                    </ul>
                    
                    <PrimaryCTA 
                      onClick={handlePurchaseArticle}
                      surface="article_paywall"
                      eventName="purchase_click"
                      className="w-full"
                      variant="uiverse"
                    >
                      Buy Article
                    </PrimaryCTA>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p className="flex items-center justify-center gap-2">
                <span>🔒</span> Private by default
                <span>•</span> Cancel anytime
                <span>•</span> No right/wrong answers
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <article className="relative max-w-4xl mx-auto px-4 py-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: blog.title },
          ]}
        />
        {/* Article Header */}
        <header className="mb-12 animate-fade-in">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {blog.isPremium && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                <span className="mr-1">⭐</span> Premium
              </span>
            )}
            {blog.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">{blog.title}</h1>
          <p className="text-2xl text-muted-foreground mb-8 leading-relaxed">{blog.excerpt}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                  📝
                </div>
                <span className="font-medium">By {blog.author}</span>
              </div>
              <span>•</span>
              <span>{blog.readTime} min read</span>
              <span>•</span>
              <span>{blog.publishedAt.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <BookmarkButton 
                type="article" 
                itemId={blog.slug} 
                title={blog.title} 
                className="bg-white/80 backdrop-blur-sm"
              />
              
              {blog.audioUrl && (
                <Button
                  onClick={handlePlayAudio}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:shadow-soft transition-all duration-200"
                >
                  <span>{isPlaying ? '⏸️' : '▶️'}</span>
                  <span>Listen</span>
                </Button>
              )}
              
              <Button
                onClick={handleLike}
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 hover:shadow-soft transition-all duration-200 ${
                  isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <span>{isLiked ? '❤️' : '🤍'}</span>
                <span className="font-medium">{likes}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <Card variant="elevated" className="mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-8 lg:p-12">
            <div className="prose prose-lg prose-slate max-w-none">
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
          </CardContent>
        </Card>

        {/* Related Quizzes */}
        {blog.relatedQuizzes && blog.relatedQuizzes.length > 0 && (
          <Card variant="elevated" className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <span className="mr-3 text-3xl">📊</span>
                Related Assessments
              </CardTitle>
              <p className="text-muted-foreground">
                Apply what you've learned with these research-backed quizzes
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {blog.relatedQuizzes.map(quizSlug => (
                <Link key={quizSlug} href={`/quizzes/${quizSlug}`} className="block group">
                  <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group-hover:shadow-soft">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center text-white text-sm mr-4">
                          🧠
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {quizSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Assessment
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Explore your patterns and get personalized insights
                          </p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Subscription CTA for free users */}
        {!userSubscription?.isPremium && (
          <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                <span className="text-2xl">🎧</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Want to listen to this article?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Get audio narration for all articles, no ads, 3 premium articles/month, and 2 free quizzes/month (≤ $50 value each).
              </p>
              <PrimaryCTA onClick={handleSubscribe} surface="article_subscribe_cta" eventName="subscribe_click" variant="uiverse" className="">
                <span className="mr-2">Subscribe for ${PRICING.MONTHLY_USD}/month</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </PrimaryCTA>
            </CardContent>
          </Card>
        )}

        {/* Prev / Next Navigation */}
        {(prev || next) && (
          <nav className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev && (
              <Link href={`/blog/${prev.slug}`} className="group block">
                <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <div className="text-xs text-muted-foreground mb-1">Previous</div>
                  <div className="font-semibold group-hover:text-primary line-clamp-2">{prev.title}</div>
                </div>
              </Link>
            )}
            {next && (
              <Link href={`/blog/${next.slug}`} className="group block sm:text-right">
                <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <div className="text-xs text-muted-foreground mb-1">Next</div>
                  <div className="font-semibold group-hover:text-primary line-clamp-2">{next.title}</div>
                </div>
              </Link>
            )}
          </nav>
        )}
      </article>
      {/* Modals */}
      <NewsletterModal isOpen={showNewsletterModal} onClose={() => setShowNewsletterModal(false)} />
      <SubscriptionOfferModal isOpen={showSubscriptionOffer} onClose={() => setShowSubscriptionOffer(false)} />
    </div>
  );
}
