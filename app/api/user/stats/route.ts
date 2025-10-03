import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In a real app, calculate from database
    // const stats = await calculateUserStats(session.user.email);

    // Mock stats for now
    const mockStats = {
      quizzesCompleted: 3,
      articlesRead: 12,
      aiChatsStarted: 8,
      streakDays: 7,
      totalInsights: 24,
      favoriteQuizzes: ['cognitive-dissonance'],
      joinedDate: new Date('2024-01-01'),
      lastActive: new Date(),
      progressScore: 75
    };

    return NextResponse.json(mockStats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}

// Helper function to calculate user stats (implement with your database)
async function calculateUserStats(userId: string) {
  // Example implementation:
  // const quizzesCompleted = await prisma.quizResult.count({
  //   where: { userId }
  // });
  // 
  // const articlesRead = await prisma.articleView.count({
  //   where: { userId }
  // });
  // 
  // const aiChatsStarted = await prisma.chatSession.count({
  //   where: { userId }
  // });
  // 
  // return { quizzesCompleted, articlesRead, aiChatsStarted, ... };
}
