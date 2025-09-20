// Core TypeScript types for MyBeing platform

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription?: Subscription;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  newsletter: boolean;
  marketing: boolean;
  language: string;
  timezone: string;
}

// Subscription types
export interface Subscription {
  id: string;
  userId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  plan: 'free' | 'premium';
  startDate: Date;
  endDate?: Date;
  monthlyQuota: {
    quizzes: number;
    articles: number;
    used: {
      quizzes: number;
      articles: number;
    };
  };
}

// Content types
export interface BaseContent {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  updatedAt?: Date;
  tags: string[];
  category: string;
  featured: boolean;
  premium: boolean;
  seo: SEOData;
  analytics: ContentAnalytics;
}

export interface Article extends BaseContent {
  type: 'article';
  readTime: string;
  wordCount: number;
  audioAvailable: boolean;
  image?: string;
}

export interface Quiz extends BaseContent {
  type: 'quiz';
  questions: QuizQuestion[];
  bands: QuizBand[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  researchData: ResearchData;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'scale' | 'text' | 'ranking';
  options?: string[];
  required: boolean;
  category: string;
  weight: number;
}

export interface QuizBand {
  id: string;
  name: string;
  description: string;
  minScore: number;
  maxScore: number;
  color: string;
  insights: string[];
}

export interface ResearchData {
  totalCompletions: number;
  averageScore: number;
  completionRate: number;
  demographicBreakdown: Record<string, number>;
  patternInsights: string[];
}

// SEO types
export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  robots: string;
}

// Analytics types
export interface ContentAnalytics {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  averageReadTime: number;
  bounceRate: number;
  conversionRate: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form types
export interface FormValidation<T> {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
  values: T;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Cache types
export interface CacheConfig {
  key: string;
  ttl: number;
  tags?: string[];
}

// Performance types
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  totalTime: number;
}

// Accessibility types
export interface AccessibilityProps {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
}

// Component props base
export interface BaseComponentProps extends AccessibilityProps {
  className?: string;
  id?: string;
  testId?: string;
}
