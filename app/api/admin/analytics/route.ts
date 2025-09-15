import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Mock analytics data - in production, this would integrate with Google Analytics API
const mockAnalyticsData = {
  '7d': {
    pageViews: 12543,
    uniqueUsers: 3421,
    quizCompletions: 892,
    blogViews: 2156,
    aiChatSessions: 445,
    conversions: 67,
    topPages: [
      { page: '/quizzes/cognitive-dissonance', views: 2341 },
      { page: '/blog/understanding-cognitive-patterns', views: 1876 },
      { page: '/', views: 1654 },
      { page: '/quizzes/stress-patterns', views: 1432 },
      { page: '/blog/mindfulness-techniques', views: 987 }
    ],
    userSegments: [
      { segment: 'Free Users', count: 2890, percentage: 84.5 },
      { segment: 'Premium Users', count: 431, percentage: 12.6 },
      { segment: 'Admin Users', count: 100, percentage: 2.9 }
    ],
    conversionFunnel: [
      { step: 'Page Visit', users: 3421, conversionRate: 100 },
      { step: 'Quiz Started', users: 1234, conversionRate: 36.1 },
      { step: 'Quiz Completed', users: 892, conversionRate: 72.3 },
      { step: 'Email Provided', users: 445, conversionRate: 49.9 },
      { step: 'Subscription', users: 67, conversionRate: 15.1 }
    ]
  },
  '30d': {
    pageViews: 45231,
    uniqueUsers: 12876,
    quizCompletions: 3421,
    blogViews: 8765,
    aiChatSessions: 1876,
    conversions: 234,
    topPages: [
      { page: '/quizzes/cognitive-dissonance', views: 8765 },
      { page: '/blog/understanding-cognitive-patterns', views: 6543 },
      { page: '/', views: 5432 },
      { page: '/quizzes/stress-patterns', views: 4321 },
      { page: '/blog/mindfulness-techniques', views: 3210 }
    ],
    userSegments: [
      { segment: 'Free Users', count: 10987, percentage: 85.3 },
      { segment: 'Premium Users', count: 1543, percentage: 12.0 },
      { segment: 'Admin Users', count: 346, percentage: 2.7 }
    ],
    conversionFunnel: [
      { step: 'Page Visit', users: 12876, conversionRate: 100 },
      { step: 'Quiz Started', users: 4567, conversionRate: 35.5 },
      { step: 'Quiz Completed', users: 3421, conversionRate: 74.9 },
      { step: 'Email Provided', users: 1876, conversionRate: 54.8 },
      { step: 'Subscription', users: 234, conversionRate: 12.5 }
    ]
  },
  '90d': {
    pageViews: 134567,
    uniqueUsers: 34521,
    quizCompletions: 9876,
    blogViews: 23456,
    aiChatSessions: 5432,
    conversions: 678,
    topPages: [
      { page: '/quizzes/cognitive-dissonance', views: 23456 },
      { page: '/blog/understanding-cognitive-patterns', views: 18765 },
      { page: '/', views: 15432 },
      { page: '/quizzes/stress-patterns', views: 12345 },
      { page: '/blog/mindfulness-techniques', views: 9876 }
    ],
    userSegments: [
      { segment: 'Free Users', count: 29876, percentage: 86.5 },
      { segment: 'Premium Users', count: 3987, percentage: 11.5 },
      { segment: 'Admin Users', count: 658, percentage: 1.9 }
    ],
    conversionFunnel: [
      { step: 'Page Visit', users: 34521, conversionRate: 100 },
      { step: 'Quiz Started', users: 12345, conversionRate: 35.8 },
      { step: 'Quiz Completed', users: 9876, conversionRate: 80.0 },
      { step: 'Email Provided', users: 5432, conversionRate: 55.0 },
      { step: 'Subscription', users: 678, conversionRate: 12.5 }
    ]
  }
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.email !== process.env.OWNER_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Validate range
    if (!['7d', '30d', '90d'].includes(range)) {
      return NextResponse.json({ error: 'Invalid range' }, { status: 400 });
    }

    // In production, this would fetch real data from Google Analytics API
    const analyticsData = mockAnalyticsData[range as keyof typeof mockAnalyticsData];

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
