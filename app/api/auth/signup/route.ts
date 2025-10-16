import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { validateRequest, withErrorHandling, successResponse, ValidationError, ConflictError } from '@/lib/api-error-handler';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password too long'),
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { name, email, password } = await validateRequest(request, signupSchema);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    throw new ConflictError('An account with this email already exists');
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user (Note: Prisma schema doesn't have password field - using NextAuth providers)
  // For credentials-based auth, you'd need to add password field to User model
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      role: 'user'
    }
  });

  // Log analytics
  await prisma.analytics.create({
    data: {
      event: 'user_signup',
      userId: user.id,
      data: JSON.stringify({
        method: 'credentials',
        emailDomain: email.split('@')[1]
      })
    }
  });

  // Return success (don't include password)
  return successResponse({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }, 201);
});

// Note: The User model in Prisma doesn't have a password field
// This is because the app uses NextAuth with OAuth providers (Google)
// To support email/password signup, add a password field to the User model:
// password  String?  // Optional for OAuth users
