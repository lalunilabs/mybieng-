// TypeScript types for Google Analytics integration

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export interface GAEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface QuizAnalytics {
  quiz_id: string;
  quiz_name: string;
  start_time: number;
  completion_time?: number;
  score?: number;
  questions_answered: number;
  total_questions: number;
  user_responses: Array<{
    question_id: string;
    answer: string;
    time_spent: number;
  }>;
}

export interface BlogAnalytics {
  blog_id: string;
  blog_title: string;
  read_time: number;
  scroll_depth: number;
  time_on_page: number;
  engagement_events: Array<{
    event_type: 'like' | 'share' | 'comment' | 'bookmark';
    timestamp: number;
  }>;
}

export interface ConversionAnalytics {
  conversion_type: 'subscription' | 'quiz_purchase' | 'article_purchase';
  item_id: string;
  value: number;
  currency: string;
  funnel_step: string;
  user_journey: Array<{
    page: string;
    timestamp: number;
    action: string;
  }>;
}

export interface UserSegment {
  user_type: 'free' | 'premium' | 'admin';
  engagement_level: 'low' | 'medium' | 'high';
  quiz_completion_rate: number;
  subscription_status: 'none' | 'active' | 'expired';
  lifetime_value: number;
}

export interface CustomDimensions {
  quiz_category?: string;
  user_persona?: string;
  content_type?: string;
  engagement_score?: number;
  subscription_tier?: string;
  geographic_region?: string;
}
