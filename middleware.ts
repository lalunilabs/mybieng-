import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // Check if user is authenticated and is the owner
    const ownerEmail = process.env.OWNER_EMAIL;
    const userEmail = token?.email;

    if (!token || !userEmail || userEmail !== ownerEmail) {
      // Redirect to admin login if not authorized
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    // Exclude static files and API routes that don't need protection
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
