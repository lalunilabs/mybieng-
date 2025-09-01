import { NextRequest, NextResponse } from 'next/server';
import { analyzeQuizResponses, QuizResponse } from '@/lib/ai';
import { sendQuizResults, generateChatSession, EmailQuizResult } from '@/lib/email';
import { getQuizBySlug } from '@/lib/quiz';
import { collectAnonymousResponse } from '@/lib/research';
import { getQuizAccess } from '@/lib/purchases';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizSlug, responses, userEmail } = body;

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

    // Get quiz details
    const quiz = getQuizBySlug(quizSlug);
    if (!quiz) {
      return NextResponse.json({ 
        error: 'Quiz not found' 
      }, { status: 404 });
    }
    // Server-side access gating to prevent unauthorized completions
    const access = getQuizAccess(userEmail, quizSlug);
    if (!access.hasAccess) {
      return NextResponse.json({
        error: "Access denied",
        reason: "purchase_required",
        isSubscriber: access.isSubscriber,
        price: access.finalPrice
      }, { status: 402 });
    }

    // Analyze responses with AI
    const analysis = await analyzeQuizResponses(quizSlug, responses);

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
      quizTitle: quiz.title,
      quizSlug,
      analysis,
      completedAt: new Date()
    });

    // Prepare email result
    const emailResult: EmailQuizResult = {
      userEmail,
      quizTitle: quiz.title,
      quizSlug,
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
