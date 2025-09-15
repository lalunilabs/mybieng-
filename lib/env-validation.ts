/**
 * Environment variable validation for MyBeing platform
 * Ensures all required environment variables are present and valid
 */

import { z } from 'zod';

const envSchema = z.object({
  // Core Application
  NEXT_PUBLIC_SITE_NAME: z.string().default('mybeing'),
  NEXT_PUBLIC_DOMAIN: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Authentication
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),

  // Admin Authentication
  ADMIN_JWT_SECRET: z.string().min(32, 'ADMIN_JWT_SECRET must be at least 32 characters'),
  ADMIN_SESSION_TIMEOUT: z.string().transform(Number).pipe(z.number().positive()).default(86400),

  // Owner Access
  OWNER_EMAIL: z.string().email('OWNER_EMAIL must be a valid email address'),

  // Database (Optional - for Supabase)
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Payment Processing (Optional)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // AI Services
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  OPENAI_MODEL: z.string().default('gpt-4'),

  // Alternative AI
  ANTHROPIC_API_KEY: z.string().optional(),

  // Email Service
  EMAIL_PROVIDER: z.enum(['sendgrid', 'mailgun', 'ses']).default('sendgrid'),
  EMAIL_API_KEY: z.string().min(1, 'EMAIL_API_KEY is required'),
  FROM_EMAIL: z.string().email('FROM_EMAIL must be a valid email address'),
  FROM_NAME: z.string().default('MyBeing Self-Discovery'),

  // Security
  UNSUBSCRIBE_SECRET: z.string().min(32, 'UNSUBSCRIBE_SECRET must be at least 32 characters'),

  // Optional: OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Optional: Development
  DEV_CREDENTIALS_PASSWORD: z.string().optional(),

  // Optional: Monitoring
  SENTRY_DSN: z.string().url().optional(),
  GOOGLE_ANALYTICS_ID: z.string().optional(),

  // Optional: Caching
  REDIS_URL: z.string().url().optional(),

  // Rate Limiting
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().positive()).default(100),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().positive()).default(900000),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables and returns typed env object
 * Throws error if validation fails
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      throw new Error(
        `Environment validation failed:\n${missingVars.join('\n')}\n\nPlease check your .env.local file.`
      );
    }
    throw error;
  }
}

/**
 * Get validated environment variables
 * Use this instead of process.env for type safety
 */
export const env = validateEnv();

/**
 * Check if we're in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if we're in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if we're in test mode
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Validate specific service configurations
 */
export const serviceConfig = {
  hasDatabase: Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY),
  hasStripe: Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PUBLISHABLE_KEY),
  hasRedis: Boolean(env.REDIS_URL),
  hasGoogleAuth: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
  hasSentry: Boolean(env.SENTRY_DSN),
  hasAnalytics: Boolean(env.GOOGLE_ANALYTICS_ID),
  hasOpenAI: Boolean(env.OPENAI_API_KEY),
  hasAnthropic: Boolean(env.ANTHROPIC_API_KEY),
};

/**
 * Runtime environment checks for critical services
 */
export function checkCriticalServices() {
  const missing = [];

  if (!env.OPENAI_API_KEY && !env.ANTHROPIC_API_KEY) {
    missing.push('AI Service (OPENAI_API_KEY or ANTHROPIC_API_KEY)');
  }

  if (!env.EMAIL_API_KEY) {
    missing.push('Email Service (EMAIL_API_KEY)');
  }

  if (!env.ADMIN_JWT_SECRET) {
    missing.push('Admin Authentication (ADMIN_JWT_SECRET)');
  }

  if (isProduction && missing.length > 0) {
    throw new Error(
      `Critical services not configured for production:\n${missing.join('\n')}`
    );
  }

  return missing;
}
