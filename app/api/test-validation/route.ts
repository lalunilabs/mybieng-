import { NextRequest, NextResponse } from 'next/server';
import { validateRequest, createApiResponse, quizRunSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validation = validateRequest(quizRunSchema, body);
    
    if (!validation.success) {
      logger.warn('Validation failed', { error: validation.error, body });
      return NextResponse.json(
        createApiResponse(false, null, undefined, validation.error),
        { status: 400 }
      );
    }

    // Process the validated data
    const { sessionId, quizSlug, answers } = validation.data;
    
    logger.info('Quiz submission validated', { sessionId, quizSlug, answerCount: answers.length });
    
    return NextResponse.json(
      createApiResponse(true, { sessionId, quizSlug, processed: answers.length }, 'Validation successful')
    );
    
  } catch (error) {
    logger.error('API error', { error: error as Error });
    return NextResponse.json(
      createApiResponse(false, null, undefined, 'Internal server error'),
      { status: 500 }
    );
  }
}
