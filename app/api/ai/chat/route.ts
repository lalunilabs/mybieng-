import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getAIManager, getSystemPrompt } from '@/lib/ai/config';
import { AIMessage } from '@/lib/ai/providers/base';
import { z } from 'zod';

const chatRequestSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
  context: z.object({
    mode: z.enum(['quiz-results', 'general', 'subscription']),
    quiz: z.string().optional(),
    results: z.any().optional(),
    contextType: z.string().optional(),
    contextId: z.string().optional()
  }).optional(),
  preferredProvider: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    // Validate request body
    const validationResult = chatRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request format', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { 
      message,
      conversationId,
      context,
      preferredProvider,
      temperature,
      maxTokens 
    } = validationResult.data;

    // Generate conversation ID if not provided
    const currentConversationId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Check if AI is available, otherwise use mock response
    const openaiKey = process.env.OPENAI_API_KEY;
    let response: string;

    if (openaiKey && context?.mode === 'quiz-results' && context?.results) {
      try {
        response = await generateAIResponse(message, context);
      } catch (error) {
        console.error('OpenAI error, falling back to mock:', error);
        response = generateMockQuizResponse(message, context);
      }
    } else {
      // Use mock response for development or when AI is not configured
      response = context?.mode === 'quiz-results' ? 
        generateMockQuizResponse(message, context) : 
        generateMockGeneralResponse(message);
    }

    // Log the interaction for analytics
    await logAIInteraction({
      userId: session?.user?.email || undefined,
      conversationId: currentConversationId,
      message,
      response,
      context: context?.mode || 'general',
      quizId: context?.quiz,
      timestamp: new Date(),
    });

    return NextResponse.json({
      response,
      conversationId: currentConversationId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    
    // Return user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (errorMessage.includes('Rate limit')) {
      return NextResponse.json(
        { error: 'AI service is temporarily busy. Please try again in a moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate AI response. Please try again.' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const aiManager = getAIManager();
    const health = await aiManager.healthCheck();
    const status = aiManager.getProviderStatus();

    return NextResponse.json({
      status: 'ok',
      providers: status,
      health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: 'Health check failed' },
      { status: 500 }
    );
  }
}

// Helper function to log AI interactions
async function logAIInteraction(data: {
  userId?: string;
  conversationId: string;
  message: string;
  response: string;
  context: string;
  quizId?: string;
  timestamp: Date;
}) {
  try {
    // In a real implementation, save to database
    console.log('AI Interaction Log:', {
      user: data.userId || 'anonymous',
      conversationId: data.conversationId,
      message: data.message.substring(0, 100) + '...',
      response: data.response.substring(0, 100) + '...',
      context: data.context,
      quiz: data.quizId || 'none',
      timestamp: data.timestamp.toISOString(),
    });

    // Example database save:
    // await prisma.aiUsageLog.create({
    //   data: {
    //     userId: data.userId,
    //     provider: data.provider,
    //     model: data.model,
    //     tokensUsed: data.tokensUsed,
    //     responseTime: data.responseTime,
    //     context: data.context,
    //     quizId: data.quizId,
    //     timestamp: data.timestamp,
    //   }
    // });
  } catch (error) {
    console.error('Failed to log AI interaction:', error);
  }
}

function generateMockResponse(message: string, context: any): string {
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

// Generate AI response using OpenAI
async function generateAIResponse(message: string, context: any): Promise<string> {
  const systemPrompt = `You are a thoughtful AI assistant helping users understand their quiz results. 

Context: The user took "${context.quiz}" and got the result "${context.results.band}".
Result details: ${JSON.stringify(context.results, null, 2)}

Guidelines:
- Be empathetic and encouraging
- Focus on patterns and insights, not judgments
- Provide actionable advice
- Reference their specific results when relevant
- Keep responses conversational and supportive
- No "right/wrong" framing - focus on self-discovery`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try asking your question again.';
}

// Generate mock response for quiz results
function generateMockQuizResponse(message: string, context: any): string {
  const lowerMessage = message.toLowerCase();
  const results = context?.results;
  
  if (!results) {
    return "I'd be happy to help you understand your quiz results! Could you tell me more about what you'd like to explore?";
  }

  // Result interpretation
  if (lowerMessage.includes('why') || lowerMessage.includes('mean')) {
    return `Your result of "${results.band}" suggests ${results.bandDescription.toLowerCase()}

This indicates specific patterns in how you approach ${context.quiz}. The key insight is understanding how this shows up in your daily life and what it means for your personal growth.

What aspect of this result would you like to explore further?`;
  }
  
  // Improvement focus
  if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('work on')) {
    const actions = results.recommendedActions || ['Reflect on your patterns', 'Practice self-awareness', 'Take small steps toward change'];
    return `Based on your results, here are some areas to focus on:

${actions.slice(0, 3).map((action: string, i: number) => `${i + 1}. ${action}`).join('\n')}

Remember, growth is a process. Start with what feels most manageable and build from there. Which of these resonates most with you?`;
  }
  
  // Pattern exploration
  if (lowerMessage.includes('pattern') || lowerMessage.includes('insight')) {
    const insights = results.keyInsights || [];
    if (insights.length > 0) {
      return `Your results reveal some interesting patterns:

**${insights[0].pattern}**: ${insights[0].description}

${insights[0].actionableAdvice}

This pattern likely shows up in various areas of your life. Can you think of a recent example where you noticed something similar?`;
    }
  }
  
  // Next steps
  if (lowerMessage.includes('next') || lowerMessage.includes('do now') || lowerMessage.includes('action')) {
    const nextSteps = results.nextSteps || ['Reflect on your results', 'Notice patterns in daily life', 'Retake the assessment in a few weeks'];
    return `Here's what I recommend as your next steps:

${nextSteps.slice(0, 3).map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}

The most important thing is to start small and be consistent. Which step feels like the right place to begin?`;
  }
  
  // Default response
  return `I can see you got "${results.band}" on your ${context.quiz} assessment. That's a meaningful result that offers insights into your patterns and tendencies.

I'm here to help you understand what this means and how to use these insights. Would you like me to:

• Explain what your result suggests about your patterns?
• Give you specific strategies to work with this insight?
• Help you think about how this shows up in daily life?
• Suggest practical next steps?

What would be most helpful for you right now?`;
}

// Generate mock response for general chat
function generateMockGeneralResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm here to help you explore your quiz results and personal insights. What would you like to discuss?";
  }
  
  if (lowerMessage.includes('help')) {
    return "I can help you understand your quiz results, explore patterns, and suggest practical next steps for personal growth. What specific area would you like to explore?";
  }
  
  return "I'm here to help you understand your assessment results and personal patterns. Could you tell me more about what you'd like to explore or ask about your quiz results?";
}
