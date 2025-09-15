import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime <= now) {
        delete this.store[key];
      }
    });
  }

  private getClientId(request: NextRequest): string {
    // Try to get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || request.ip || 'unknown';

    // Include user agent for additional uniqueness (Edge-safe)
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const safeBase64 = (input: string) => {
      try {
        // Prefer Web API in Edge runtime
        // eslint-disable-next-line no-undef
        if (typeof btoa !== 'undefined') return btoa(input);
      } catch {}
      try {
        // Fallback to Node Buffer when available (API routes)
        const buf = (globalThis as any).Buffer ? (globalThis as any).Buffer.from(input) : null;
        if (buf) return buf.toString('base64');
      } catch {}
      // Last resort: truncate raw UA
      return input;
    };
    const uaToken = safeBase64(userAgent).slice(0, 10);
    return `${ip}-${uaToken}`;
  }

  public isRateLimited(request: NextRequest, config: RateLimitConfig): {
    limited: boolean;
    remaining: number;
    resetTime: number;
  } {
    const clientId = this.getClientId(request);
    const now = Date.now();
    const windowStart = now;
    const windowEnd = windowStart + config.windowMs;

    // Get or create client entry
    let clientData = this.store[clientId];
    
    if (!clientData || clientData.resetTime <= now) {
      // Create new window
      clientData = {
        count: 0,
        resetTime: windowEnd
      };
      this.store[clientId] = clientData;
    }

    // Increment request count
    clientData.count++;

    const remaining = Math.max(0, config.maxRequests - clientData.count);
    const limited = clientData.count > config.maxRequests;

    return {
      limited,
      remaining,
      resetTime: clientData.resetTime
    };
  }

  public destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Predefined rate limit configurations
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // General API endpoints
  api: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes
  
  // Authentication endpoints
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes
  
  // Quiz submission
  quiz: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
  
  // Newsletter signup
  newsletter: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 requests per hour
  
  // Contact form
  contact: { windowMs: 60 * 60 * 1000, maxRequests: 2 }, // 2 requests per hour
  
  // Admin endpoints
  admin: { windowMs: 15 * 60 * 1000, maxRequests: 200 }, // 200 requests per 15 minutes

  // Search endpoint (typeahead friendly)
  search: { windowMs: 60 * 1000, maxRequests: 30 }, // 30 requests per minute
};

export default rateLimiter;

// Upstash REST-based (optional) global rate limiter
function isUpstashConfigured() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function isRateLimitedUpstash(request: NextRequest, config: RateLimitConfig): Promise<{
  limited: boolean;
  remaining: number;
  resetTime: number;
}> {
  const url = process.env.UPSTASH_REDIS_REST_URL as string;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN as string;

  const clientId = ((): string => {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || request.ip || 'unknown';
    const ua = request.headers.get('user-agent') || 'unknown';
    const safeBase64 = (input: string) => {
      try { if (typeof btoa !== 'undefined') return btoa(input); } catch {}
      return input;
    };
    return `${ip}-${safeBase64(ua).slice(0, 10)}`;
  })();

  const now = Date.now();
  const windowMs = config.windowMs;
  const windowId = Math.floor(now / windowMs);
  const key = `rl:${clientId}:${windowId}`;
  const expireSeconds = Math.ceil(windowMs / 1000);
  const windowReset = (windowId + 1) * windowMs;

  // Pipeline: INCR key, EXPIRE key expireSeconds NX, PTTL key
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      commands: [
        ['INCR', key],
        ['EXPIRE', key, `${expireSeconds}`, 'NX'],
        ['PTTL', key],
      ],
    }),
  });

  if (!res.ok) {
    // Fallback to local limiter on error
    return rateLimiter.isRateLimited(request, config);
  }

  const json: any = await res.json();
  // Upstash pipeline returns array of results; first is count
  const currentCount = Number(json?.result?.[0]) || 0;
  const remaining = Math.max(0, config.maxRequests - currentCount);
  const limited = currentCount > config.maxRequests;

  return { limited, remaining, resetTime: windowReset };
}

export async function checkRateLimit(request: NextRequest, config: RateLimitConfig): Promise<{
  limited: boolean;
  remaining: number;
  resetTime: number;
}> {
  try {
    if (isUpstashConfigured()) {
      return await isRateLimitedUpstash(request, config);
    }
  } catch {}
  // Fallback to in-memory
  return rateLimiter.isRateLimited(request, config);
}
