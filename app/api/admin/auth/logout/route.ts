import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Build response with no-store headers
    const res = new NextResponse(
      JSON.stringify({ success: true, message: 'Logged out successfully' }),
      { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );

    // Clear the admin token cookie (modern)
    res.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    // Clear legacy admin flag cookie if present
    res.cookies.set('admin_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    // Also clear via request cookie store for good measure in this invocation
    const cookieStore = cookies();
    try { cookieStore.delete('admin_token'); } catch {}
    try { cookieStore.delete('admin_auth'); } catch {}

    return res;
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
