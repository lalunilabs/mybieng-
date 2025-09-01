
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { Blog } from '@/data/blogs';
import Breadcrumbs from '@/components/blog/Breadcrumbs';

interface BlogReaderProps {
  blog: Blog;
  userEmail?: string;
  prev?: Blog;
  next?: Blog;
}

export function BlogReader({ blog, userEmail, prev, next }: BlogReaderProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(blog.likes || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [subLoaded, setSubLoaded] = useState(false);

  const checkLikeStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/blog/like-status?email=${userEmail}&articleId=${blog.id}`);
      const data = await response.json();
      setIsLiked(data.isLiked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }, [userEmail, blog.id]);

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/subscription/status?email=${userEmail}`);
      const data = await response.json();
      setUserSubscription(data);
      setSubLoaded(true);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubLoaded(true);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      // Check if user has liked this article
      checkLikeStatus();
      // Check subscription status
      checkSubscriptionStatus();
    }

    // Decide paywall state
    if (!blog.isPremium) {
      setShowPaywall(false);
    } else if (!userEmail) {
      // Logged out users must see paywall for premium content
      setShowPaywall(true);
    } else if (subLoaded) {
      // Logged-in: wait until subscription status is loaded
      setShowPaywall(!userSubscription?.canAccess);
    }
  }, [userEmail, blog.id, blog.isPremium, subLoaded, userSubscription?.canAccess, checkLikeStatus, checkSubscriptionStatus]);

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
      // Check if user has premium access for audio
      if (userSubscription?.isPremium) {
        setIsPlaying(!isPlaying);
        // Implement audio playback logic here
        console.log('Playing audio:', blog.audioUrl);
      } else {
        setShowPaywall(true);
      }
    }
  };

  const handleSubscribe = () => {
    // Redirect to subscription page
    window.location.href = '/subscribe';
  };

  const handlePurchaseArticle = () => {
    // Redirect to individual article purchase
    window.location.href = `/purchase/article/${blog.id}`;
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
                    <div className="text-4xl font-bold text-foreground mb-4">$32<span className="text-lg text-muted-foreground">/month</span></div>
                    
                    <ul className="text-sm text-muted-foreground space-y-3 mb-6">
                      <li className="flex items-center"><span className="mr-2 text-emerald-500">✅</span> Audio narration for all articles</li>
                      <li className="flex items-center"><span className="mr-2 text-emerald-500">✅</span> 2 premium articles/month</li>
                      <li className="flex items-center"><span className="mr-2 text-emerald-500">✅</span> Related quizzes free for those articles</li>
                      <li className="flex items-center"><span className="mr-2 text-emerald-500">✅</span> No ads + member discounts on extras</li>
                    </ul>
                    
                    <Button 
                      onClick={handleSubscribe}
                      variant="gradient"
                      className="w-full"
                      size="lg"
                    >
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>

                {/* Individual Purchase */}
                <Card variant="elevated" className="hover:shadow-medium transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">📖</span>
                    </div>
                    <h4 className="font-bold text-xl text-foreground mb-2">Single Article</h4>
                    <div className="text-4xl font-bold text-foreground mb-4">${blog.price}</div>
                    
                    <ul className="text-sm text-muted-foreground space-y-3 mb-6">
                      <li className="flex items-center"><span className="mr-2">📖</span> Full article access</li>
                      <li className="flex items-center"><span className="mr-2">🎧</span> Audio narration</li>
                      <li className="flex items-center"><span className="mr-2">💾</span> Lifetime access</li>
                      <li className="flex items-center"><span className="mr-2">📱</span> Mobile friendly</li>
                    </ul>
                    
                    <Button 
                      onClick={handlePurchaseArticle}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Buy Article
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p className="flex items-center justify-center gap-2">
                <span>🔒</span> Secure payment 
                <span>•</span> Cancel anytime 
                <span>•</span> 30-day money-back guarantee
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-float" />
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
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs mr-3">
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
              <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                {blog.content}
              </div>
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
                <a key={quizSlug} href={`/quizzes/${quizSlug}`} className="block group">
                  <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group-hover:shadow-soft">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center text-white text-sm mr-4">
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
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Subscription CTA for free users */}
        {!userSubscription?.isPremium && (
          <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                <span className="text-2xl">🎧</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Want to listen to this article?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Get audio narration for all articles, no ads, 2 premium articles/month, and related quizzes free for those articles.
              </p>
              <Button onClick={handleSubscribe} variant="gradient" size="lg" className="shadow-glow hover:shadow-glow-lg">
                <span className="mr-2">Subscribe for $32/month</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
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
    </div>
  );
}
