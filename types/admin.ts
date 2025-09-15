export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'content_manager' | 'support';
  name: string;
  avatar?: string;
  lastLogin: Date;
  permissions: AdminPermission[];
}

export interface AdminPermission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  subscribedUsers: number;
  subscriptionRevenue: number;
  averageEngagementTime: number;
  userRetentionRate: number;
}

export interface ContentAnalytics {
  totalQuizzes: number;
  totalBlogs: number;
  quizCompletions: number;
  blogViews: number;
  averageQuizScore: number;
  mostPopularQuiz: string;
  mostPopularBlog: string;
  contentEngagementRate: number;
}

export interface AIAnalytics {
  totalConversations: number;
  averageConversationLength: number;
  userSatisfactionRating: number;
  commonQuestions: string[];
  feedbackCount: number;
  averageFeedbackRating: number;
  responseTime: number;
  errorRate: number;
}

export interface SystemHealth {
  uptime: number;
  responseTime: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
  databaseConnections: number;
  apiRequestsPerMinute: number;
  lastBackup: Date;
}

export interface UserManagement {
  id: string;
  email: string;
  name: string;
  joinDate: Date;
  lastActive: Date;
  subscription: {
    plan: string;
    status: 'active' | 'cancelled' | 'expired';
    nextBilling: Date;
    revenue: number;
  };
  quizzesTaken: number;
  blogsRead: number;
  aiConversations: number;
  totalEngagementTime: number;
}

export interface ContentManagement {
  id: string;
  type: 'quiz' | 'blog';
  title: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdDate: Date;
  publishedDate?: Date;
  views: number;
  engagement: number;
  revenue?: number;
}

export interface AdminDashboardData {
  userAnalytics: UserAnalytics;
  contentAnalytics: ContentAnalytics;
  aiAnalytics: AIAnalytics;
  systemHealth: SystemHealth;
  recentUsers: UserManagement[];
  recentContent: ContentManagement[];
  alerts: AdminAlert[];
}

export interface AdminAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
}

export interface AdminSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  subscriptionPrice: number;
  freeQuizLimit: number;
  premiumArticleLimit: number;
  aiRateLimit: number;
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    fromEmail: string;
    fromName: string;
  };
  paymentSettings: {
    stripePublicKey: string;
    webhookSecret: string;
  };
}

export interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: Date;
  details: Record<string, any>;
  ipAddress: string;
}
