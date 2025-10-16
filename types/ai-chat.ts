// Core AI Chat Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: ContentRecommendations;
}

export interface ContentRecommendations {
  quizzes?: QuizRecommendation[];
  blogs?: BlogRecommendation[];
}

export interface QuizRecommendation {
  slug: string;
  title: string;
  description: string;
  price?: number;
  isFree?: boolean;
}

export interface BlogRecommendation {
  slug: string;
  title: string;
  excerpt: string;
  isPremium?: boolean;
  isFree?: boolean;
}

// Quiz Results Types
export interface QuizResults {
  quizTitle: string;
  score: number;
  maxScore: number;
  band: {
    label: string;
    description: string;
    advice: string;
  };
  answers: Record<string, any>;
}

// User Subscription Types
export interface UserSubscription {
  isSubscribed: boolean;
  plan: 'free' | 'premium';
  freeQuizzesUsed?: number;
  premiumArticlesUsed?: number;
  subscriptionId?: string;
  expiresAt?: Date;
}

// Chat Modes
export type ChatMode = 'quiz-results' | 'general' | 'subscription';

// API Request/Response Types
export interface UniversalChatRequest {
  message: string;
  mode: ChatMode;
  context: {
    quizResults?: QuizResults;
    userSubscription?: UserSubscription;
    conversationHistory?: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
  };
}

export interface ChatResponse {
  response: string;
  recommendations?: ContentRecommendations;
  error?: string;
}

// Feedback Types
export interface FeedbackData {
  rating: number;
  comment: string;
  quizSlug?: string;
  timestamp: Date;
}

// Component Props Types
export interface UniversalAIChatProps {
  mode: ChatMode;
  quizResults?: QuizResults;
  userSubscription?: UserSubscription;
  onFeedback?: (feedback: FeedbackData) => void;
  initialMessage?: string;
  className?: string;
}

// Utility Types
export interface ChatState {
  messages: Message[];
  input: string;
  isLoading: boolean;
  showFeedback: boolean;
  feedbackRating: number;
  feedbackComment: string;
}

export interface SubscriptionLimits {
  freeQuizzesLimit: number;
  premiumArticlesLimit: number;
  freeQuizzesUsed: number;
  premiumArticlesUsed: number;
  freeQuizzesRemaining: number;
  premiumArticlesRemaining: number;
}
