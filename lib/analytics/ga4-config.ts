// Google Analytics 4 Configuration and Custom Dimensions
import { setUserProperties } from './gtag';

// Custom dimensions configuration for GA4
export const GA4_CUSTOM_DIMENSIONS = {
  user_type: 'custom_dimension_1',
  quiz_category: 'custom_dimension_2', 
  engagement_level: 'custom_dimension_3',
  subscription_tier: 'custom_dimension_4',
  user_persona: 'custom_dimension_5',
  content_preference: 'custom_dimension_6',
  completion_rate: 'custom_dimension_7',
  geographic_region: 'custom_dimension_8'
};

// User segmentation for analytics
export interface UserSegment {
  user_type: 'free' | 'premium' | 'admin';
  engagement_level: 'low' | 'medium' | 'high';
  quiz_completion_rate: number;
  subscription_status: 'none' | 'active' | 'expired';
  lifetime_value: number;
  preferred_content: string[];
}

// Set user properties for GA4 segmentation
export const setUserSegment = (segment: Partial<UserSegment>) => {
  const properties: Record<string, any> = {};
  
  if (segment.user_type) {
    properties[GA4_CUSTOM_DIMENSIONS.user_type] = segment.user_type;
  }
  
  if (segment.engagement_level) {
    properties[GA4_CUSTOM_DIMENSIONS.engagement_level] = segment.engagement_level;
  }
  
  if (segment.subscription_status) {
    properties[GA4_CUSTOM_DIMENSIONS.subscription_tier] = segment.subscription_status;
  }
  
  if (segment.quiz_completion_rate !== undefined) {
    properties[GA4_CUSTOM_DIMENSIONS.completion_rate] = Math.round(segment.quiz_completion_rate);
  }
  
  setUserProperties(properties);
};

// Quiz category mapping for analytics
export const QUIZ_CATEGORIES = {
  'cognitive-dissonance': 'cognitive_psychology',
  'stress-patterns': 'behavioral_health',
  'self-awareness-mixed': 'personality_assessment',
  'behavioral-patterns': 'behavioral_psychology'
};

// Content engagement scoring
export const calculateEngagementLevel = (metrics: {
  timeOnSite: number;
  pagesViewed: number;
  quizzesCompleted: number;
  blogArticlesRead: number;
  aiChatSessions: number;
}): 'low' | 'medium' | 'high' => {
  let score = 0;
  
  // Time on site (minutes)
  if (metrics.timeOnSite > 30) score += 3;
  else if (metrics.timeOnSite > 10) score += 2;
  else if (metrics.timeOnSite > 2) score += 1;
  
  // Pages viewed
  if (metrics.pagesViewed > 10) score += 3;
  else if (metrics.pagesViewed > 5) score += 2;
  else if (metrics.pagesViewed > 2) score += 1;
  
  // Quizzes completed
  score += Math.min(metrics.quizzesCompleted * 2, 6);
  
  // Blog articles read
  score += Math.min(metrics.blogArticlesRead, 4);
  
  // AI chat sessions
  score += Math.min(metrics.aiChatSessions * 2, 4);
  
  if (score >= 12) return 'high';
  if (score >= 6) return 'medium';
  return 'low';
};

// Goal configurations for GA4
export const GA4_GOALS = {
  quiz_completion: {
    name: 'Quiz Completion',
    description: 'User completes any quiz',
    value: 5
  },
  subscription: {
    name: 'Subscription Conversion',
    description: 'User subscribes to premium',
    value: 50
  },
  quiz_purchase: {
    name: 'Quiz Purchase',
    description: 'User purchases individual quiz',
    value: 10
  },
  ai_chat_engagement: {
    name: 'AI Chat Engagement',
    description: 'User engages with AI chat for 3+ messages',
    value: 3
  },
  blog_engagement: {
    name: 'Blog Engagement',
    description: 'User reads blog article for 2+ minutes',
    value: 2
  },
  report_view: {
    name: 'Report Analysis',
    description: 'User views detailed quiz report',
    value: 3
  }
};

// Audience segments for GA4
export const GA4_AUDIENCES = {
  high_value_users: {
    name: 'High Value Users',
    criteria: 'Premium subscribers with high engagement',
    description: 'Users with active subscription and high engagement scores'
  },
  quiz_enthusiasts: {
    name: 'Quiz Enthusiasts', 
    criteria: 'Completed 3+ quizzes in 30 days',
    description: 'Users who actively take multiple quizzes'
  },
  ai_chat_users: {
    name: 'AI Chat Users',
    criteria: 'Used AI chat 2+ times',
    description: 'Users who engage with AI chat feature'
  },
  blog_readers: {
    name: 'Blog Readers',
    criteria: 'Read 3+ blog articles',
    description: 'Users who regularly consume blog content'
  },
  conversion_candidates: {
    name: 'Conversion Candidates',
    criteria: 'Free users with medium+ engagement',
    description: 'Free users likely to convert to premium'
  }
};
