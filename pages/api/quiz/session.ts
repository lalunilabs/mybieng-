import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { quizSlug } = req.body;
    const session = await getServerSession(req, res, authOptions);
    
    if (!quizSlug) {
      return res.status(400).json({ message: 'Quiz slug is required' });
    }

    // Create a new quiz run
    const quizRun = await prisma.quizRun.create({
      data: {
        quizSlug,
        userId: session?.user?.id || null,
        sessionId: Math.random().toString(36).substring(2, 15),
        total: 0, // Will be updated on submission
        bandLabel: '',
        completed: false,
        metadata: JSON.stringify({
          userAgent: req.headers['user-agent'],
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          startedAt: new Date().toISOString(),
        }),
      },
    });

    return res.status(200).json({
      sessionId: quizRun.sessionId,
    });
  } catch (error) {
    console.error('Error creating quiz session:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
