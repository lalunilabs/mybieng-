import { z } from 'zod';

// Base schema that matches the Blog interface
export const articleSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(100).regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase, alphanumeric with hyphens'
  ),
  excerpt: z.string().min(1, 'Excerpt is required').max(500),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required').default('MyBeing Research'),
  publishedAt: z.string().datetime({ offset: true }),
  tags: z.array(z.string().max(50)).min(1, 'At least one tag is required').max(10),
  readTime: z.number().int().positive().default(5),
  imageUrl: z.string().url('Invalid image URL').optional(),
  published: z.boolean().default(true),
  relatedQuizzes: z.array(z.string()).optional(),
  isPremium: z.boolean().default(false),
  likes: z.number().int().min(0).default(0),
  audioUrl: z.string().url('Invalid audio URL').optional(),
  price: z.number().min(0).optional(),
  // SEO fields
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().url('Invalid URL').optional(),
  ogImage: z.string().url('Invalid image URL').optional(),
  robots: z.string().optional(),
});

// Input type for creating/updating articles
export type ArticleInput = z.infer<typeof articleSchema>;

// Type for the saved article (with resolved dates)
export type Article = Omit<ArticleInput, 'publishedAt'> & {
  publishedAt: Date;
};
