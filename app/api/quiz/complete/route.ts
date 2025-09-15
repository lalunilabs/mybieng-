import { NextRequest, NextResponse } from 'next/server';
import { analyzeQuizResponses } from '@/lib/ai';
import { sendQuizResults, generateChatSession, EmailQuizResult } from '@/lib/email';
import { collectAnonymousResponse } from '@/lib/research';
import { prisma } from '@/lib/db';
import { getBandForScore } from '@/data/quizzes';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizSlug, responses, userEmail } = body;

    // Lightweight client path (current UI): { sessionId, quizId, responses, score }
    if (body?.sessionId && body?.quizId) {
      const sessionId = String(body.sessionId);
      const quizId = String(body.quizId);
      const score = typeof body.score === 'number' ? body.score : 0;
      const maxScore = Array.isArray(body.responses)
        ? body.responses.filter((r: any) => r?.questionType === 'scale').length * 5 || 100
        : 100;
      const band = getBandForScore(score, maxScore);

      // Store a run minimally for exports/reports
      const created = await prisma.quizRun.create({
        data: {
          sessionId,
          quizSlug: quizId,
          total: score,
          bandLabel: band?.label || 'Reported',
          answers: Array.isArray(body.responses)
            ? {
                create: body.responses.map((r: any) => ({
                  question: r?.questionId || r?.questionText || 'q',
                  value: typeof r?.answer === 'number' ? r.answer : 0,
                })),
              }
            : undefined,
        },
        select: { id: true, createdAt: true },
      });

      return NextResponse.json({ ok: true, id: created.id, createdAt: created.createdAt });
    }

    // Validate required fields
    if (!quizSlug || !responses || !userEmail) {
      return NextResponse.json({ 
        error: 'Missing required fields: quizSlug, responses, userEmail' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Advanced path (legacy): requires quizSlug + userEmail, performs AI analysis and sends email
    // Note: Retained for compatibility if called by other flows.
    const quizTitle = String(quizSlug);

    // Analyze responses with AI
    const analysis = await analyzeQuizResponses(quizTitle, responses);

    // Collect anonymous data for research purposes
    const sessionId = request.headers.get('x-session-id') || 'anonymous';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    collectAnonymousResponse(
      quizSlug,
      responses,
      sessionId,
      userAgent,
      analysis.score,
      analysis.band
    );

    // Generate chat session for AI interaction
    const chatSessionId = generateChatSession({
      userEmail,
      quizTitle,
      quizSlug: quizTitle,
      analysis,
      completedAt: new Date()
    });

    // Prepare email result
    const emailResult: EmailQuizResult = {
      userEmail,
      quizTitle,
      quizSlug: quizTitle,
      analysis,
      completedAt: new Date(),
      chatSessionId
    };

    // Send results via email
    const emailSent = await sendQuizResults(emailResult);

    if (!emailSent) {
      return NextResponse.json({ 
        error: 'Failed to send results email' 
      }, { status: 500 });
    }

    // Return success response with chat session
    return NextResponse.json({
      success: true,
      message: 'Quiz completed successfully! Check your email for detailed results.',
      analysis: {
        score: analysis.score,
        band: analysis.band,
        bandDescription: analysis.bandDescription
      },
      chatSessionId,
      emailSent: true
    });

  } catch (error) {
    console.error('Quiz completion error:', error);
    return NextResponse.json({ 
      error: 'Failed to process quiz completion' 
    }, { status: 500 });
  }
}
