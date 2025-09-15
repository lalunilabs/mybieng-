import { z } from 'zod';
import { QuizResults, UserSubscription, SubscriptionLimits, ContentRecommendations } from '@/types/ai-chat';
import { quizzes } from '@/data/quizzes';
import { blogs } from '@/data/blogs';

// Validation Schemas
export const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  mode: z.enum(['quiz-results', 'general', 'subscription']),
  context: z.object({
    quizResults: z.object({
      quizTitle: z.string(),
      score: z.number(),
      maxScore: z.number(),
      band: z.object({
        label: z.string(),
        description: z.string(),
        advice: z.string(),
      }),
      answers: z.record(z.string(), z.any()),
    }).optional(),
    userSubscription: z.object({
      isSubscribed: z.boolean(),
      plan: z.enum(['free', 'premium']),
      freeQuizzesUsed: z.number().optional(),
      premiumArticlesUsed: z.number().optional(),
    }).optional(),
    conversationHistory: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })).optional(),
  }),
});

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
  quizSlug: z.string().optional(),
});

// Utility Functions
export function calculateSubscriptionLimits(userSubscription?: UserSubscription): SubscriptionLimits {
  const freeQuizzesLimit = 2;
  const premiumArticlesLimit = 3;
  const freeQuizzesUsed = userSubscription?.freeQuizzesUsed || 0;
  const premiumArticlesUsed = userSubscription?.premiumArticlesUsed || 0;

  return {
    freeQuizzesLimit,
    premiumArticlesLimit,
    freeQuizzesUsed,
    premiumArticlesUsed,
    freeQuizzesRemaining: Math.max(0, freeQuizzesLimit - freeQuizzesUsed),
    premiumArticlesRemaining: Math.max(0, premiumArticlesLimit - premiumArticlesUsed),
  };
}

export function sanitizeMessage(message: string): string {
  return message.trim().replace(/\s+/g, ' ').substring(0, 1000);
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getRelatedContent(quizTitle: string): ContentRecommendations {
  const relatedQuizzes = quizzes
    .filter(q => q.title !== quizTitle)
    .slice(0, 2)
    .map(q => ({
      slug: q.slug,
      title: q.title,
      description: q.description,
      price: q.price,
      isFree: !q.price || q.price < 50
    }));

  const relatedBlogs = blogs
    .filter(b => 
      b.relatedQuizzes?.some(rq => quizTitle.toLowerCase().includes(rq.toLowerCase())) ||
      b.tags.some(tag => quizTitle.toLowerCase().includes(tag))
    )
    .slice(0, 2)
    .map(b => ({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      isPremium: b.isPremium
    }));

  return {
    quizzes: relatedQuizzes,
    blogs: relatedBlogs
  };
}

export function getPersonalizedQuizRecommendations(
  userSubscription?: UserSubscription
): ContentRecommendations['quizzes'] {
  const limits = calculateSubscriptionLimits(userSubscription);
  
  return quizzes.slice(0, 3).map(q => ({
    slug: q.slug,
    title: q.title,
    description: q.description,
    price: q.price,
    isFree: limits.freeQuizzesRemaining > 0 && (!q.price || q.price < 50)
  }));
}

export function getPersonalizedBlogRecommendations(
  userSubscription?: UserSubscription
): ContentRecommendations['blogs'] {
  const limits = calculateSubscriptionLimits(userSubscription);
  
  // Show premium articles if user has allowance remaining
  const premiumBlogs = blogs
    .filter(b => b.isPremium)
    .slice(0, limits.premiumArticlesRemaining)
    .map(b => ({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      isPremium: b.isPremium,
      isFree: true // Free within allowance
    }));

  const freeBlogs = blogs
    .filter(b => !b.isPremium)
    .slice(0, 2)
    .map(b => ({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      isPremium: false
    }));

  return [...premiumBlogs, ...freeBlogs].slice(0, 3);
}

export function formatSubscriptionStatus(userSubscription?: UserSubscription): string {
  if (!userSubscription?.isSubscribed) {
    return 'Free User';
  }

  const limits = calculateSubscriptionLimits(userSubscription);
  return `Premium Subscriber - ${limits.freeQuizzesRemaining}/2 quizzes, ${limits.premiumArticlesRemaining}/3 articles remaining`;
}

// Error handling utilities
export class ChatError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

export function handleChatError(error: unknown): { error: string; statusCode: number } {
  if (error instanceof ChatError) {
    return { error: error.message, statusCode: error.statusCode };
  }
  
  if (error instanceof z.ZodError) {
    return { 
      error: 'Invalid request format', 
      statusCode: 400 
    };
  }
  
  console.error('Unexpected chat error:', error);
  return { 
    error: 'An unexpected error occurred', 
    statusCode: 500 
  };
}
