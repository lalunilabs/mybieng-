import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password too long'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // Check if user already exists
    // In a real app, you'd check your database here
    // For now, we'll simulate this check
    const existingUser = await checkUserExists(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await createUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Return success (don't include password)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock functions - replace with your actual database operations
async function checkUserExists(email: string): Promise<boolean> {
  // In a real app, query your database
  // Example with Prisma: await prisma.user.findUnique({ where: { email } })
  
  // For now, return false (user doesn't exist)
  return false;
}

async function createUser(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<{
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}> {
  // In a real app, save to your database
  // Example with Prisma:
  // return await prisma.user.create({
  //   data: {
  //     name: userData.name,
  //     email: userData.email,
  //     password: userData.password,
  //   }
  // });

  // Mock user creation
  return {
    id: `user_${Date.now()}`,
    name: userData.name,
    email: userData.email,
    createdAt: new Date(),
  };
}
