import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';
import { verifyAdminToken } from '@/lib/auth/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const targetBase = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const targetUrl = new URL(targetBase);
  const isPreviewHost = host.endsWith('.vercel.app') || host.includes('localhost');
  const isSameHost = host === targetUrl.host;

  // Canonical domain redirect: enforce mybeing.in in production-like hosts
  if (!isPreviewHost && !isSameHost) {
    const url = new URL(request.url);
    url.protocol = 'https:';
    url.host = targetUrl.host;
    return NextResponse.redirect(url, 308);
  }

  // Canonicalize quiz routes: /quiz and /quiz/* -> /quizzes and /quizzes/*
  // This maintains the canonical path for SEO and consistency across the app
  if (pathname === '/quiz') {
    const url = new URL(request.url);
    url.pathname = '/quizzes';
    return NextResponse.redirect(url, 308);
  }
  if (pathname.startsWith('/quiz/')) {
    const url = new URL(request.url);
    // Preserve the rest of the path after /quiz
    url.pathname = '/quizzes' + pathname.substring('/quiz'.length);
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();

  // Apply rate limiting based on route
  let rateLimitConfig = RATE_LIMITS.api; // Default
  
  if (pathname.startsWith('/api/auth')) {
    rateLimitConfig = RATE_LIMITS.auth;
  } else if (pathname.startsWith('/api/quiz') || pathname.startsWith('/api/quizzes')) {
    rateLimitConfig = RATE_LIMITS.quiz;
  } else if (pathname.startsWith('/api/search')) {
    rateLimitConfig = RATE_LIMITS.search;
  } else if (pathname.startsWith('/api/newsletter')) {
    rateLimitConfig = RATE_LIMITS.newsletter;
  } else if (pathname.startsWith('/api/contact')) {
    rateLimitConfig = RATE_LIMITS.contact;
  } else if (pathname.startsWith('/api/admin')) {
    rateLimitConfig = RATE_LIMITS.admin;
  }

  const rateLimitResult = await checkRateLimit(request, rateLimitConfig);
  
  // Set rate limit headers
  response.headers.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());

  if (rateLimitResult.limited) {
    logger.warn('Rate limit exceeded', {
      pathname,
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent')
    });
    
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: rateLimitResult.resetTime },
      { status: 429, headers: response.headers }
    );
  }

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  // Tighter CSP for production - remove 'unsafe-eval' in production
  const isDev = process.env.NODE_ENV === 'development';
  const scriptSrc = isDev 
    ? "'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com"
    : "'self' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com";
  
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https: wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`
  );

  // Protect admin routes (skip login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    try {
      // Check for admin JWT token in cookies
      const adminToken = request.cookies.get('admin_token')?.value;
      const legacy = request.cookies.get('admin_auth')?.value === '1';
      if (!adminToken && !legacy) {
        logger.warn('No admin token found', {
          pathname,
          ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown'
        });
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Presence is sufficient for page-level guard; API routes validate token
    } catch (error) {
      logger.error('Error in admin route protection', { pathname, error: error as Error });
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect API routes that need authentication
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/analytics')) {
    try {
      // Public admin auth endpoints should be accessible without prior auth
      if (
        pathname.startsWith('/api/admin/auth/login') ||
        pathname.startsWith('/api/admin/auth/logout') ||
        pathname.startsWith('/api/admin/auth/me') ||
        pathname === '/api/admin/login' ||
        pathname === '/api/admin/logout'
      ) {
        return response;
      }

      // 1) Accept valid admin JWT cookie
      const adminToken = request.cookies.get('admin_token')?.value;
      if (adminToken) {
        const adminUser = await verifyAdminToken(adminToken);
        if (adminUser && adminUser.email === process.env.OWNER_EMAIL) {
          return response;
        }
      }

      // 2) Fallback: accept NextAuth token when email matches OWNER_EMAIL
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });

      const ownerEmail = process.env.OWNER_EMAIL;
      const userEmail = token?.email;

      if (!token || !userEmail || userEmail !== ownerEmail) {
        logger.warn('Unauthorized API access attempt', {
          pathname,
          userEmail: userEmail || 'none',
          ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown'
        });
        return NextResponse.json(
          { error: 'Unauthorized access' },
          { status: 401, headers: response.headers }
        );
      }
    } catch (error) {
      logger.error('Error in API route protection', { pathname, error: error as Error });
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500, headers: response.headers }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/analytics/:path*',
    '/api/auth/:path*',
    '/api/quiz/:path*',
    '/api/newsletter/:path*',
    '/api/contact/:path*',
    // Apply security headers and rate limiting to all routes
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ],
};
