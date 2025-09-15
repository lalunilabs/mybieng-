import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const slugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format');

// Quiz validation schemas
export const quizAnswerSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  value: z.number().int().min(1).max(5, 'Answer value must be between 1-5'),
});

export const quizRunSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  quizSlug: slugSchema,
  answers: z.array(quizAnswerSchema).min(1, 'At least one answer is required'),
});

// Newsletter validation
export const newsletterSchema = z.object({
  email: emailSchema,
  source: z.string().optional(),
});

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// API response validation
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
});

// Validation helper functions
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Validation failed' };
  }
}

export function createApiResponse<T>(success: boolean, data?: T, message?: string, error?: string) {
  return {
    success,
    ...(data && { data }),
    ...(message && { message }),
    ...(error && { error }),
    timestamp: new Date().toISOString(),
  };
}
