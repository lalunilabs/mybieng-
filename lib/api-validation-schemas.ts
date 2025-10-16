import { z } from 'zod';

/**
 * Centralized validation schemas for API requests
 * Ensures consistency across endpoints
 */

// Common schemas
export const emailSchema = z.string().email('Invalid email address');
export const slugSchema = z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Invalid slug format');
export const idSchema = z.string().cuid();

// Pagination schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// User schemas
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters').max(100)
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

// Quiz schemas
export const quizAnswerSchema = z.object({
  questionId: z.string(),
  value: z.union([z.number(), z.string()]),
  category: z.string().optional()
});

export const quizSubmissionSchema = z.object({
  quizSlug: slugSchema,
  answers: z.array(quizAnswerSchema).min(1),
  startTime: z.number().int().positive(),
  endTime: z.number().int().positive(),
  sessionId: z.string().min(1),
  userId: z.string().optional(),
  generateAI: z.boolean().optional().default(false)
}).refine(data => data.endTime > data.startTime, {
  message: 'End time must be after start time'
});

export const aiAnalysisRequestSchema = z.object({
  runId: idSchema,
  sessionId: z.string().optional(),
  userId: z.string().optional()
});

// Newsletter schemas
export const newsletterPreferencesSchema = z.object({
  weeklyInsights: z.boolean().default(true),
  newQuizzes: z.boolean().default(true),
  researchUpdates: z.boolean().default(false)
});

export const newsletterSubscribeSchema = z.object({
  email: emailSchema,
  preferences: newsletterPreferencesSchema.default({
    weeklyInsights: true,
    newQuizzes: true,
    researchUpdates: false
  }),
  source: z.string().optional(),
  leadMagnet: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

// Subscription schemas
export const subscriptionStatusSchema = z.enum([
  'active',
  'cancelled',
  'expired',
  'past_due',
  'trialing'
]);

export const createSubscriptionSchema = z.object({
  userId: idSchema,
  plan: z.string().default('premium'),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  stripePriceId: z.string().optional()
});

// Content schemas
export const contentTypeSchema = z.enum(['quiz', 'article']);

export const purchaseContentSchema = z.object({
  type: contentTypeSchema,
  itemId: z.string(),
  paymentMethod: z.enum(['stripe', 'subscription', 'free']),
  discountCode: z.string().optional()
});

// Bookmark schemas
export const createBookmarkSchema = z.object({
  type: contentTypeSchema,
  itemId: z.string(),
  title: z.string()
});

// Like schemas
export const createLikeSchema = z.object({
  type: contentTypeSchema,
  itemId: z.string()
});

// Feedback schemas
export const feedbackTypeSchema = z.enum(['bug', 'feature', 'general']);

export const createFeedbackSchema = z.object({
  type: feedbackTypeSchema,
  message: z.string().min(10, 'Feedback must be at least 10 characters').max(2000, 'Feedback too long'),
  email: emailSchema.optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

// AI Chat schemas
export const aiChatModeSchema = z.enum(['quiz-results', 'general', 'subscription']);

export const aiChatRequestSchema = z.object({
  message: z.string().min(1, 'Message required').max(2000, 'Message too long'),
  conversationId: z.string().optional(),
  context: z.object({
    mode: aiChatModeSchema,
    quiz: z.string().optional(),
    results: z.any().optional(),
    contextType: z.string().optional(),
    contextId: z.string().optional()
  }).optional(),
  preferredProvider: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4000).optional()
});

// Admin schemas
export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password required').max(256, 'Password too long')
});

export const createArticleSchema = z.object({
  title: z.string().min(1, 'Title required').max(200, 'Title too long'),
  slug: slugSchema,
  excerpt: z.string().max(500),
  content: z.string().min(1, 'Content required'),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  isPremium: z.boolean().default(false),
  price: z.number().min(0).optional(),
  readTime: z.number().int().positive(),
  publishedAt: z.string().datetime().optional()
});

export const createQuizSchema = z.object({
  title: z.string().min(1, 'Title required').max(200, 'Title too long'),
  slug: slugSchema,
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  isPremium: z.boolean().default(false),
  price: z.number().min(0).optional(),
  estimatedTime: z.number().int().positive(),
  resultType: z.enum(['numeric', 'categorical', 'ai-narrative', 'hybrid']).default('numeric'),
  questions: z.array(z.any()).min(1, 'At least one question required') // Could be more specific
});

// Longitudinal check-in schemas
export const checkinTypeSchema = z.enum(['daily', 'weekly', 'monthly']);

export const createCheckinSchema = z.object({
  type: checkinTypeSchema,
  responses: z.record(z.string(), z.any()),
  mood: z.number().int().min(1).max(10).optional(),
  energy: z.number().int().min(1).max(10).optional(),
  context: z.record(z.string(), z.any()).optional()
});

// Analytics schemas
export const trackEventSchema = z.object({
  event: z.string(),
  data: z.record(z.string(), z.any()).optional(),
  sessionId: z.string().optional(),
  userId: z.string().optional()
});

// Search schemas
export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query required').max(200, 'Query too long'),
  type: z.enum(['all', 'quizzes', 'articles']).default('all'),
  category: z.string().optional(),
  limit: z.coerce.number().int().positive().max(50).default(10)
});
