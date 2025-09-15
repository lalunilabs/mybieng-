// Google Analytics 4 (GA4) integration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (action: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, parameters);
  }
};

// Quiz-specific events
export const trackQuizStart = (quizSlug: string, quizTitle: string) => {
  event('quiz_start', {
    quiz_id: quizSlug,
    quiz_name: quizTitle,
    event_category: 'quiz',
    event_label: quizSlug,
  });
};

export const trackQuizProgress = (quizSlug: string, questionNumber: number, totalQuestions: number) => {
  event('quiz_progress', {
    quiz_id: quizSlug,
    question_number: questionNumber,
    total_questions: totalQuestions,
    progress_percentage: Math.round((questionNumber / totalQuestions) * 100),
    event_category: 'quiz',
  });
};

export const trackQuizComplete = (quizSlug: string, score: number, timeSpent: number) => {
  event('quiz_complete', {
    quiz_id: quizSlug,
    score: score,
    time_spent_seconds: timeSpent,
    event_category: 'quiz',
    event_label: quizSlug,
  });
};

// Blog engagement events
export const trackBlogView = (blogSlug: string, blogTitle: string, readTime: number) => {
  event('blog_view', {
    blog_id: blogSlug,
    blog_title: blogTitle,
    estimated_read_time: readTime,
    event_category: 'blog',
    event_label: blogSlug,
  });
};

export const trackBlogLike = (blogSlug: string) => {
  event('blog_like', {
    blog_id: blogSlug,
    event_category: 'engagement',
    event_label: blogSlug,
  });
};

export const trackBlogReadProgress = (blogSlug: string, progressPercent: number) => {
  event('blog_read_progress', {
    blog_id: blogSlug,
    progress_percent: progressPercent,
    event_category: 'engagement',
  });
};

// Conversion events
export const trackSubscription = (planType: string, price: number) => {
  event('purchase', {
    transaction_id: `sub_${Date.now()}`,
    value: price,
    currency: 'USD',
    items: [{
      item_id: 'subscription',
      item_name: `${planType} Subscription`,
      category: 'subscription',
      price: price,
      quantity: 1,
    }],
    event_category: 'conversion',
  });
};

export const trackQuizPurchase = (quizSlug: string, price: number) => {
  event('purchase', {
    transaction_id: `quiz_${quizSlug}_${Date.now()}`,
    value: price,
    currency: 'USD',
    items: [{
      item_id: quizSlug,
      item_name: `Quiz: ${quizSlug}`,
      category: 'quiz_purchase',
      price: price,
      quantity: 1,
    }],
    event_category: 'conversion',
  });
};

// AI Chat events
export const trackAIChatStart = (sessionId: string, context: string) => {
  event('ai_chat_start', {
    session_id: sessionId,
    chat_context: context,
    event_category: 'ai_interaction',
  });
};

export const trackAIChatMessage = (sessionId: string, messageType: 'user' | 'assistant') => {
  event('ai_chat_message', {
    session_id: sessionId,
    message_type: messageType,
    event_category: 'ai_interaction',
  });
};

// Report and analytics events
export const trackReportView = (reportId: string, reportType: string) => {
  event('report_view', {
    report_id: reportId,
    report_type: reportType,
    event_category: 'reports',
  });
};

export const trackReportExport = (reportId: string, exportFormat: string) => {
  event('report_export', {
    report_id: reportId,
    export_format: exportFormat,
    event_category: 'reports',
  });
};

// User engagement events
export const trackSignup = (method: string) => {
  event('sign_up', {
    method: method,
    event_category: 'user_engagement',
  });
};

export const trackLogin = (method: string) => {
  event('login', {
    method: method,
    event_category: 'user_engagement',
  });
};

export const trackSearch = (searchTerm: string, resultCount: number) => {
  event('search', {
    search_term: searchTerm,
    result_count: resultCount,
    event_category: 'search',
  });
};

// Custom user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      custom_map: properties,
    });
  }
};

// Enhanced ecommerce events
export const trackViewItem = (itemId: string, itemName: string, category: string, value: number) => {
  event('view_item', {
    currency: 'USD',
    value: value,
    items: [{
      item_id: itemId,
      item_name: itemName,
      category: category,
      price: value,
      quantity: 1,
    }],
  });
};

export const trackAddToCart = (itemId: string, itemName: string, category: string, value: number) => {
  event('add_to_cart', {
    currency: 'USD',
    value: value,
    items: [{
      item_id: itemId,
      item_name: itemName,
      category: category,
      price: value,
      quantity: 1,
    }],
  });
};

export const trackBeginCheckout = (items: Array<{id: string, name: string, category: string, price: number}>) => {
  event('begin_checkout', {
    currency: 'USD',
    value: items.reduce((sum, item) => sum + item.price, 0),
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      price: item.price,
      quantity: 1,
    })),
  });
};
