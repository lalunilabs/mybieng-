import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Centralized API error handling utility
 * Provides consistent error responses across all endpoints
 */

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTH_REQUIRED');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends APIError {
  constructor(retryAfter?: number) {
    super('Too many requests', 429, 'RATE_LIMIT_EXCEEDED', { retryAfter });
    this.name = 'RateLimitError';
  }
}

export class ConflictError extends APIError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

/**
 * Handle different types of errors and return appropriate responses
 */
export function handleAPIError(error: unknown): NextResponse {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Handle known API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(isDevelopment && error.details ? { details: error.details } : {})
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.format()
      },
      { status: 400 }
    );
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error);
  }

  // Handle rate limit errors
  if (error instanceof Error && error.message?.includes('Rate limit exceeded')) {
    const retryMatch = error.message.match(/Try again in (\d+) seconds/);
    const retryAfter = retryMatch ? parseInt(retryMatch[1]) : 60;
    return NextResponse.json(
      {
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter
      },
      { status: 429, headers: { 'Retry-After': retryAfter.toString() } }
    );
  }

  // Handle generic errors
  console.error('Unhandled error:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      ...(isDevelopment && error instanceof Error ? { message: error.message, stack: error.stack } : {})
    },
    { status: 500 }
  );
}

/**
 * Handle Prisma-specific errors
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): NextResponse {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      return NextResponse.json(
        {
          error: 'Resource already exists',
          code: 'CONFLICT',
          details: error.meta
        },
        { status: 409 }
      );
    
    case 'P2025':
      // Record not found
      return NextResponse.json(
        {
          error: 'Resource not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      );
    
    case 'P2003':
      // Foreign key constraint violation
      return NextResponse.json(
        {
          error: 'Invalid reference',
          code: 'INVALID_REFERENCE',
          details: error.meta
        },
        { status: 400 }
      );
    
    case 'P2034':
      // Transaction conflict
      return NextResponse.json(
        {
          error: 'Transaction conflict, please retry',
          code: 'TRANSACTION_CONFLICT'
        },
        { status: 409 }
      );
    
    default:
      return NextResponse.json(
        {
          error: 'Database error',
          code: 'DATABASE_ERROR',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
  }
}

/**
 * Async error wrapper for API routes
 * Usage: export const POST = withErrorHandling(async (req) => { ... });
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleAPIError(error);
    }
  }) as T;
}

/**
 * Validate request body with Zod schema
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid request data', error.format());
    }
    throw error;
  }
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Paginated response helper
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasMore: page * pageSize < total
    }
  });
}
