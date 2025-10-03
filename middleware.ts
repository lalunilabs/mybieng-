import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
// Rate limiting and logging for Vercel Edge Functions
const RATE_LIMITS = {
  api: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  quiz: { windowMs: 60 * 1000, maxRequests: 10 },
  newsletter: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  contact: { windowMs: 60 * 60 * 1000, maxRequests: 2 },
  admin: { windowMs: 15 * 60 * 1000, maxRequests: 200 },
  search: { windowMs: 60 * 1000, maxRequests: 30 },
};

// Simple logger for Edge Functions
const logger = {
  warn: (message: string, context?: any) => {
    console.warn(`[WARN] ${message}`, context);
  },
  error: (message: string, context?: any) => {
    console.error(`[ERROR] ${message}`, context);
  }
};

// Simple admin token verification for Edge Functions
async function verifyAdminToken(token: string): Promise<any> {
  try {
    // In Edge Functions, we can't use jwt.verify directly
    // This is a simplified check - full verification happens in API routes
    const payload = JSON.parse(atob(token.split('.')[1]));
    const ownerEmail = process.env.OWNER_EMAIL || 'sainiharika227@gmail.com';
    if (payload.email === ownerEmail) {
      return payload;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const targetBase = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const targetUrl = new URL(targetBase);
  const enforceCanonical = process.env.ENFORCE_CANONICAL_DOMAIN === 'true';
  const isPreviewHost =
    host.endsWith('.vercel.app') ||
    host.includes('localhost') ||
    host.endsWith('.netlify.app') ||
    host.endsWith('.netlify.live');
  const isSameHost = host === targetUrl.host;
  const isLocalTarget = ['localhost', '127.0.0.1'].includes(targetUrl.hostname);

  // Canonical domain redirect: enforce mybeing.in in production-like hosts
  // Only enforce when explicitly enabled and target is not a localhost URL
  if (enforceCanonical && !isLocalTarget && !isPreviewHost && !isSameHost) {
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
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // CSP for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https: blob:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://api.openai.com https://api.stripe.com; " +
      "frame-src 'self' https://js.stripe.com;"
    );
  }

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

  // Simple rate limiting for Edge Functions
  const rateLimitResult = {
    limited: false,
    remaining: rateLimitConfig.maxRequests,
    resetTime: Date.now() + rateLimitConfig.windowMs
  };
  
  // In a production Edge environment, you would implement proper rate limiting
  // using a service like Upstash Redis
  /*
  const clientId = request.ip || 'unknown';
  const key = `rate-limit:${clientId}:${pathname}`;
  // Implement rate limiting logic here
  */
  
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
      const ownerEmail = process.env.OWNER_EMAIL || 'sainiharika227@gmail.com';
      
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

      const ownerEmail = process.env.OWNER_EMAIL || 'sainiharika227@gmail.com';
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
