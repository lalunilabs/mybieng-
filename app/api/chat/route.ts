import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message, conversationHistory } = body;

    if (!sessionId || !message) {
      return NextResponse.json({ 
        error: 'Missing required fields: sessionId, message' 
      }, { status: 400 });
    }

    // In a real implementation, you'd:
    // 1. Validate the session ID and retrieve quiz analysis data
    // 2. Call your AI service (OpenAI, Claude, etc.) with the quiz context
    // 3. Generate contextual responses based on the user's specific results

    // For now, we'll simulate AI responses based on common patterns
    const mockQuizAnalysis = {
      score: 65,
      band: 'Moderate Dissonance',
      bandDescription: 'Some tension exists between your beliefs and behaviors.',
      keyInsights: [
        {
          pattern: 'Justification Patterns',
          description: 'You show moderate tendency to rationalize decisions that conflict with your values.',
          actionableAdvice: 'Practice the "pause and reflect" technique when you notice quick justifications.',
          relatedContent: ['mental-tug-of-war-cognitive-dissonance']
        }
      ],
      personalizedMessage: 'Your cognitive dissonance score suggests some normal tension between ideals and reality.',
      recommendedActions: [
        'Keep a brief daily log of value-action conflicts',
        'Practice the "values check" before major decisions',
        'Experiment with one small behavior change that aligns with your values'
      ],
      nextSteps: [
        'Take the Stress Patterns quiz',
        'Read our blog post on cognitive dissonance',
        'Set up weekly reflection time'
      ]
    };

    const response = await generateChatResponse(
      message,
      mockQuizAnalysis,
      conversationHistory || []
    );

    return NextResponse.json({
      response,
      sessionId
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate response' 
    }, { status: 500 });
  }
}
