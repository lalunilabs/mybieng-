import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  
  // Only allow admin users
  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const [
      totalQuizzes,
      totalArticles,
      totalUsers,
      totalQuizSessions,
      popularQuizzes,
      recentActivity
    ] = await Promise.all([
      // Total quizzes
      prisma.quiz.count(),
      
      // Total articles
      prisma.article.count(),
      
      // Total users
      prisma.user.count(),
      
      // Total quiz sessions
      prisma.quizSession.count(),
      
      // Most popular quizzes
      prisma.quiz.findMany({
        take: 5,
        orderBy: {
          sessions: {
            _count: 'desc'
          }
        },
        include: {
          _count: {
            select: { sessions: true }
          }
        }
      }),
      
      // Recent activity
      prisma.analyticsEvent.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        where: {
          type: {
            in: ['quiz_started', 'quiz_completed', 'article_viewed']
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      })
    ]);

    // Calculate completion rate for quizzes
    const quizCompletionStats = await prisma.quizSession.groupBy({
      by: ['quizId'],
      _count: {
        _all: true
      },
      _sum: {
        isComplete: true
      }
    });

    const completionRate = quizCompletionStats.length > 0
      ? (quizCompletionStats.reduce((sum, quiz) => sum + (quiz._sum.isComplete || 0), 0) / 
         quizCompletionStats.reduce((sum, quiz) => sum + quiz._count._all, 0)) * 100
      : 0;

    res.status(200).json({
      stats: {
        totalQuizzes,
        totalArticles,
        totalUsers,
        totalQuizSessions,
        completionRate: Math.round(completionRate * 100) / 100 // Round to 2 decimal places
      },
      popularQuizzes,
      recentActivity
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return res.status(500).json({ 
      error: 'An error occurred while fetching analytics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default handler;
