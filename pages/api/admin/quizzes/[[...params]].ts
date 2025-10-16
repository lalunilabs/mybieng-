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

  const { method, query: { params = [] } } = req;
  const [id] = params as string[];

  try {
    switch (method) {
      // GET /api/admin/quizzes - List all quizzes
      case 'GET':
        if (!id) {
          const quizzes = await prisma.quiz.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
              _count: {
                select: { sessions: true }
              }
            }
          });
          return res.status(200).json(quizzes);
        }
        
        // GET /api/admin/quizzes/[id] - Get single quiz
        const quiz = await prisma.quiz.findUnique({
          where: { id },
          include: {
            _count: {
              select: { sessions: true }
            }
          }
        });
        
        if (!quiz) {
          return res.status(404).json({ error: 'Quiz not found' });
        }
        
        return res.status(200).json(quiz);

      // POST /api/admin/quizzes - Create new quiz
      case 'POST':
        const newQuiz = await prisma.quiz.create({
          data: {
            ...req.body,
            published: false,
            publishedAt: req.body.published ? new Date() : null,
            questions: req.body.questions || [],
            keywords: req.body.keywords || [],
            benefits: req.body.benefits || [],
            requirements: req.body.requirements || [],
          },
        });
        return res.status(201).json(newQuiz);

      // PUT /api/admin/quizzes/[id] - Update quiz
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Quiz ID is required' });
        }
        
        const updatedQuiz = await prisma.quiz.update({
          where: { id },
          data: {
            ...req.body,
            publishedAt: req.body.published ? new Date() : null,
            updatedAt: new Date()
          },
        });
        return res.status(200).json(updatedQuiz);

      // DELETE /api/admin/quizzes/[id] - Delete quiz
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Quiz ID is required' });
        }
        
        await prisma.quiz.delete({ where: { id } });
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Quiz API error:', error);
    return res.status(500).json({ 
      error: 'An error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default handler;
