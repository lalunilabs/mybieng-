import { NextRequest, NextResponse } from 'next/server';
import { 
  UniversalChatRequest, 
  ChatResponse, 
  ChatMode 
} from '@/types/ai-chat';
import { 
  chatRequestSchema, 
  sanitizeMessage, 
  handleChatError 
} from '@/lib/ai-chat-utils';
import {
  generateQuizResultsResponse,
  generateSubscriptionResponse,
  generateGeneralResponse
} from '@/lib/ai-response-generator';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate request schema
    const validatedData = chatRequestSchema.parse(body);
    const { message, mode, context } = validatedData;
    
    // Additional validation checks
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message too long. Please keep it under 2000 characters.' },
        { status: 400 }
      );
    }
    
    // Sanitize message
    const sanitizedMessage = sanitizeMessage(message);
    
    // Generate response based on mode
    const response = await generateChatResponse(sanitizedMessage, mode, context);
    
    // Add response metadata
    const enrichedResponse = {
      ...response,
      timestamp: new Date().toISOString(),
      mode,
      requestId: generateRequestId()
    };
    
    return NextResponse.json(enrichedResponse);
  } catch (error) {
    console.error('Universal chat API error:', error);
    const { error: errorMessage, statusCode } = handleChatError(error);
    return NextResponse.json(
      { 
        error: errorMessage,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId()
      },
      { status: statusCode }
    );
  }
}

async function generateChatResponse(
  message: string,
  mode: ChatMode,
  context: UniversalChatRequest['context']
): Promise<ChatResponse> {
  try {
    // Validate context based on mode
    if (mode === 'quiz-results' && !context.quizResults) {
      throw new Error('Quiz results required for quiz-results mode');
    }

    if (mode === 'subscription' && !context.userSubscription) {
      throw new Error('User subscription data required for subscription mode');
    }

    // Quiz Results Mode
    if (mode === 'quiz-results' && context.quizResults) {
      return generateQuizResultsResponse(message, context.quizResults);
    }

    // Subscription Mode - Enhanced features for subscribers
    if (mode === 'subscription' && context.userSubscription?.isSubscribed) {
      return generateSubscriptionResponse(message, context.userSubscription);
    }

    // General Mode - Basic AI assistance
    return generateGeneralResponse(message, context.userSubscription);
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}

// Helper functions
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  return 'unknown';
}

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }
  
  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  clientData.count++;
  return true;
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Cleanup old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);
