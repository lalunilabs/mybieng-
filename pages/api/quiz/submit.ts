import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getQuizBySlug } from '@/data/quizzes';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sessionId, quizSlug, answers } = req.body;
    const session = await getServerSession(req, res, authOptions);

    // Validate input
    if (!sessionId || !quizSlug || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Get the quiz data
    const quiz = getQuizBySlug(quizSlug);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate total score and prepare answers for storage
    let totalScore = 0;
    const answerData = [];

    for (const answer of answers) {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      // For numeric answers (likert, etc.)
      const numericValue = typeof answer.value === 'number' 
        ? answer.value 
        : question.type === 'yes_no' 
          ? answer.value === 'yes' ? 1 : 0 
          : 0;

      totalScore += numericValue;

      answerData.push({
        runId: '', // Will be set after quizRun is created
        question: question.text,
        value: numericValue,
        metadata: JSON.stringify({
          questionType: question.type,
          originalValue: answer.value,
          timestamp: new Date().toISOString(),
        }),
      });
    }

    // Get max possible score
    const maxScore = quiz.questions.reduce((max, q) => {
      if (q.type === 'likert') return max + 7; // Assuming 7-point Likert
      if (q.type === 'yes_no') return max + 1;
      return max;
    }, 0);

    // Calculate percentage and determine band
    const percentage = Math.round((totalScore / maxScore) * 100);
    const band = quiz.bands.find(
      b => percentage >= b.min && percentage <= b.max
    ) || quiz.bands[quiz.bands.length - 1];

    // Update the quiz run
    const [updatedRun] = await prisma.$transaction([
      prisma.quizRun.update({
        where: { sessionId },
        data: {
          total: totalScore,
          bandLabel: band?.label || '',
          completed: true,
          userId: session?.user?.id || undefined,
          metadata: JSON.stringify({
            ...(JSON.parse((await prisma.quizRun.findUnique({ where: { sessionId } }))?.metadata || '{}')),
            completedAt: new Date().toISOString(),
            totalScore,
            maxScore,
            percentage,
            band: band?.label,
          }),
        },
      }),
      // Create all answers
      ...answerData.map(answer => 
        prisma.quizAnswer.create({
          data: {
            run: { connect: { sessionId } },
            question: answer.question,
            value: answer.value,
            metadata: answer.metadata,
          },
        })
      ),
    ]);

    // If user is logged in, update their profile with quiz completion
    if (session?.user?.id) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          quizRuns: {
            connect: { id: updatedRun.id },
          },
        },
      });
    }

    return res.status(200).json({
      success: true,
      runId: updatedRun.id,
      totalScore,
      maxScore,
      percentage,
      band: band?.label,
      advice: band?.advice,
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
