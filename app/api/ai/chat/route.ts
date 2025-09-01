import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
  message: string;
  context: {
    quizTitle: string;
    score: number;
    maxScore: number;
    band: {
      label: string;
      description: string;
      advice: string;
    };
    answers: Record<string, any>;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { message, context }: ChatRequest = await request.json();
    
    // Mock AI responses based on quiz context
    const responses = generateMockResponse(message, context);
    
    return NextResponse.json({ response: responses });
  } catch (error) {
    console.error('AI Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

function generateMockResponse(message: string, context: ChatRequest['context']): string {
  const lowerMessage = message.toLowerCase();
  
  // Score interpretation
  if (lowerMessage.includes('mean') || lowerMessage.includes('interpret')) {
    return `Your score of ${context.score}/${context.maxScore} in the "${context.band.label}" category suggests ${context.band.description.toLowerCase()}\n\nThis indicates that you're experiencing ${context.band.label.toLowerCase()} levels of cognitive dissonance. The key insight is understanding how this affects your daily decision-making and self-perception.`;
  }
  
  // Weekly actions
  if (lowerMessage.includes('week') || lowerMessage.includes('daily')) {
    return `For this week, focus on:\n\n1. **Awareness**: Notice when you feel uncomfortable about a decision\n2. **Journaling**: Write down the conflicting thoughts\n3. **Values check**: Ask "Does this align with who I want to be?"\n4. **Small experiments**: Try making one decision differently\n\nStart small - even noticing the pattern is progress.`;
  }
  
  // Specific examples
  if (lowerMessage.includes('example') || lowerMessage.includes('specific')) {
    return `Here's a specific example:\n\nLet's say you value honesty but told a "white lie" today. Instead of justifying it, try:\n- Acknowledge: "I wasn't fully honest"\n- Explore: "What made me choose this?"\n- Align: "What would honesty look like next time?"\n\nThe goal isn't perfection, but understanding your patterns.`;
  }
  
  // Pattern recognition
  if (lowerMessage.includes('pattern') || lowerMessage.includes('notice')) {
    return `Watch for these signs:\n\n- **Instant justification**: "It's not that bad because..."\n- **Selective memory**: Forgetting details that contradict your values\n- **Social comparison**: "Others do worse"\n- **Identity protection**: "That's not who I really am"\n\nWhen you catch these, pause and get curious rather than judgmental.`;
  }
  
  // What to work on
  if (lowerMessage.includes('work on') || lowerMessage.includes('focus')) {
    return `Based on your results, focus on:\n\n${context.band.advice}\n\nRemember: The goal isn't to eliminate all dissonance (that's impossible), but to use it as a signal for growth. Each uncomfortable feeling is an opportunity to align your actions more closely with your values.`;
  }
  
  // Default response
  return `I understand you're asking about your ${context.quizTitle} results. Your score suggests ${context.band.label.toLowerCase()} levels of cognitive dissonance.\n\nWould you like me to:\n- Explain what this means for your daily life?\n- Give you specific strategies to work on this?\n- Help you understand the patterns you might notice?\n- Suggest how to track your progress?`;
}
