import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentAdminUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions,
          lastLogin: user.lastLogin,
          avatar: user.avatar
        }
      }),
      { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );

  } catch (error) {
    console.error('Admin auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
