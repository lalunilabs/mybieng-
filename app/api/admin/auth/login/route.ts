import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, AdminAuthError } from '@/lib/auth/admin';
import { cookies } from 'next/headers';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1).max(256),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid credentials format', details: parsed.error.flatten() },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const session = await authenticateAdmin(parsed.data.email, parsed.data.password);
    
    // Set secure HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set('admin_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          permissions: session.user.permissions
        }
      }),
      { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );

  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
