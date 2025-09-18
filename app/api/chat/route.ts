import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/ai';
import { z } from 'zod';
import { sanitizeMessage } from '@/lib/ai-chat-utils';

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body safely
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Validate request payload
    const schema = z.object({
      sessionId: z.string().min(1).max(200),
      message: z.string().min(1).max(1000),
      conversationHistory: z
        .array(
          z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string().min(1).max(1000),
          })
        )
        .max(20)
        .optional(),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { sessionId, message, conversationHistory = [] } = parsed.data;

    // Sanitize user input
    const cleanMessage = sanitizeMessage(message);

    // In a real implementation, you'd:
    // 1) Validate the session and load quiz analysis context by sessionId
    // 2) Call your AI provider with that context
    // For now, simulate analysis with sensible defaults
    const mockQuizAnalysis = {
      score: 65,
      band: 'Moderate Dissonance',
      bandDescription: 'Some tension exists between your beliefs and behaviors.',
      keyInsights: [
        {
          pattern: 'Justification Patterns',
          description: 'You show moderate tendency to rationalize decisions that conflict with your values.',
          actionableAdvice: 'Practice the "pause and reflect" technique when you notice quick justifications.',
          relatedContent: ['mental-tug-of-war-cognitive-dissonance'],
        },
      ],
      personalizedMessage:
        'Your cognitive dissonance score suggests some normal tension between ideals and reality.',
      recommendedActions: [
        'Keep a brief daily log of value-action conflicts',
        'Practice the "values check" before major decisions',
        'Experiment with one small behavior change that aligns with your values',
      ],
      nextSteps: [
        'Take the Stress Patterns quiz',
        'Read our blog post on cognitive dissonance',
        'Set up weekly reflection time',
      ],
    };

    const responseText = await generateChatResponse(
      cleanMessage,
      mockQuizAnalysis as any,
      conversationHistory
    );

    return new NextResponse(
      JSON.stringify({ response: responseText, sessionId }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
