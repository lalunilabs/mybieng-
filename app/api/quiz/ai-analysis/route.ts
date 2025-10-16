import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getQuizBySlug } from '@/data/quizzes';
import { generateAIAnalysis } from '@/lib/quiz-processing';
import { ipRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/db';

// Validation schema for AI analysis request
const aiAnalysisSchema = z.object({
  runId: z.string().min(1),
  sessionId: z.string().optional(),
  userId: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - 5 AI analysis requests per minute per IP
    await ipRateLimit.check(req, 5);

    // Parse and validate request body
    const body = await req.json();
    const { runId, sessionId, userId } = aiAnalysisSchema.parse(body);

    // Retrieve the quiz run
    const quizRun = await prisma.quizRun.findUnique({
      where: { id: runId },
      include: { answers: true }
    });

    if (!quizRun) {
      return NextResponse.json(
        { error: 'Quiz results not found', code: 'RESULTS_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Verify ownership (if userId provided)
    if (userId && quizRun.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access to quiz results', code: 'UNAUTHORIZED' },
        { status: 403 }
      );
    }

    // Verify session (if sessionId provided and no userId)
    if (!userId && sessionId && quizRun.sessionId !== sessionId) {
      return NextResponse.json(
        { error: 'Unauthorized access to quiz results', code: 'UNAUTHORIZED' },
        { status: 403 }
      );
    }

    // Get quiz configuration
    const quiz = getQuizBySlug(quizRun.quizSlug);
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz configuration not found', code: 'QUIZ_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Parse existing metadata
    let existingResult;
    try {
      const metadata = JSON.parse(quizRun.metadata || '{}');
      existingResult = {
        id: quizRun.id,
        quizSlug: quizRun.quizSlug,
        quizTitle: quiz.title,
        resultStyle: metadata.resultStyle || 'numeric',
        completedAt: quizRun.createdAt.toISOString(),
        totalTime: metadata.totalTime || 0,
        numericResult: metadata.numericResult,
        categoricalResult: metadata.categoricalResult,
        aiResult: metadata.aiResult,
        researchContext: {
          methodology: 'Validated psychometric assessment',
          sampleSize: 10000,
          reliability: 0.87,
          validatedBy: ['Behavioral Psychology Research Lab', 'MyBeing Research Team']
        },
        recommendations: {
          articles: [],
          quizzes: []
        }
      };
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid quiz result data', code: 'INVALID_DATA' },
        { status: 400 }
      );
    }

    // Check if AI analysis already exists
    if (existingResult.aiResult) {
      return NextResponse.json({
        success: true,
        data: existingResult.aiResult,
        cached: true
      });
    }

    // Generate AI analysis
    const aiAnalysis = await generateAIAnalysis(existingResult, quiz);

    // Update the quiz run with AI analysis
    const updatedMetadata = {
      ...JSON.parse(quizRun.metadata || '{}'),
      aiResult: aiAnalysis
    };

    await prisma.quizRun.update({
      where: { id: runId },
      data: {
        metadata: JSON.stringify(updatedMetadata)
      }
    });

    // Log analytics event
    try {
      await prisma.analytics.create({
        data: {
          event: 'ai_analysis_generated',
          sessionId: quizRun.sessionId,
          userId: quizRun.userId,
          data: JSON.stringify({
            quizSlug: quizRun.quizSlug,
            runId: quizRun.id,
            confidence: aiAnalysis.confidence
          })
        }
      });
    } catch (analyticsError) {
      console.error('Failed to log AI analysis analytics:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      data: aiAnalysis,
      cached: false
    });

  } catch (error: any) {
    console.error('AI analysis generation error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          code: 'VALIDATION_ERROR',
          details: error.format()
        },
        { status: 400 }
      );
    }

    // Handle rate limiting
    if (error.message?.includes('Rate limit exceeded')) {
      return NextResponse.json(
        { 
          error: 'Too many AI analysis requests', 
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Please wait before requesting another analysis.'
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate AI analysis', 
        code: 'AI_ANALYSIS_ERROR',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
