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
      // GET /api/admin/articles - List all articles
      case 'GET':
        if (!id) {
          const articles = await prisma.article.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
              _count: {
                select: { likes: true, bookmarks: true }
              },
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true
                }
              }
            }
          });
          return res.status(200).json(articles);
        }
        
        // GET /api/admin/articles/[id] - Get single article
        const article = await prisma.article.findUnique({
          where: { id },
          include: {
            _count: {
              select: { likes: true, bookmarks: true }
            },
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        });
        
        if (!article) {
          return res.status(404).json({ error: 'Article not found' });
        }
        
        return res.status(200).json(article);

      // POST /api/admin/articles - Create new article
      case 'POST':
        const newArticle = await prisma.article.create({
          data: {
            ...req.body,
            authorId: session.user.id,
            status: req.body.status || 'DRAFT',
            publishedAt: req.body.status === 'PUBLISHED' ? new Date() : null,
            tags: req.body.tags || [],
            seoKeywords: req.body.seoKeywords || [],
          },
        });
        return res.status(201).json(newArticle);

      // PUT /api/admin/articles/[id] - Update article
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Article ID is required' });
        }
        
        const updateData = { ...req.body };
        
        // Only update publishedAt if status is being changed to PUBLISHED
        if (updateData.status === 'PUBLISHED') {
          updateData.publishedAt = new Date();
        }
        
        const updatedArticle = await prisma.article.update({
          where: { id },
          data: {
            ...updateData,
            updatedAt: new Date()
          },
        });
        return res.status(200).json(updatedArticle);

      // DELETE /api/admin/articles/[id] - Delete article
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Article ID is required' });
        }
        
        await prisma.article.delete({ where: { id } });
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Article API error:', error);
    return res.status(500).json({ 
      error: 'An error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default handler;
