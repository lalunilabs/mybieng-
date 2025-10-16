import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  
  // Only allow admin users
  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const endpoints = {
    message: 'Admin API Endpoints',
    endpoints: {
      quizzes: {
        list: `${baseUrl}/api/admin/quizzes`,
        create: { 
          method: 'POST',
          url: `${baseUrl}/api/admin/quizzes`,
          body: 'Quiz object'
        },
        single: {
          method: 'GET',
          url: `${baseUrl}/api/admin/quizzes/[id]`
        },
        update: {
          method: 'PUT',
          url: `${baseUrl}/api/admin/quizzes/[id]`,
          body: 'Partial Quiz object'
        },
        delete: {
          method: 'DELETE',
          url: `${baseUrl}/api/admin/quizzes/[id]`
        }
      },
      articles: {
        list: `${baseUrl}/api/admin/articles`,
        create: {
          method: 'POST',
          url: `${baseUrl}/api/admin/articles`,
          body: 'Article object'
        },
        single: {
          method: 'GET',
          url: `${baseUrl}/api/admin/articles/[id]`
        },
        update: {
          method: 'PUT',
          url: `${baseUrl}/api/admin/articles/[id]`,
          body: 'Partial Article object'
        },
        delete: {
          method: 'DELETE',
          url: `${baseUrl}/api/admin/articles/[id]`
        }
      },
      analytics: {
        overview: `${baseUrl}/api/admin/analytics/overview`,
        quizStats: `${baseUrl}/api/admin/analytics/quiz-stats`,
        userActivity: `${baseUrl}/api/admin/analytics/user-activity`,
        exportData: `${baseUrl}/api/admin/analytics/export`
      }
    }
  };

  res.status(200).json(endpoints);
};

export default handler;
