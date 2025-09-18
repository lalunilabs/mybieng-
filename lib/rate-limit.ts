import { LRUCache } from 'lru-cache';
import type { NextRequest } from 'next/server';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // Default 1 minute
  });

  return {
    check: (req: NextRequest, limit: number, token?: string) => {
      const ip = req.ip || '127.0.0.1';
      const tokenKey = token || ip;
      
      // Get or create token count
      const tokenCount = tokenCache.get(tokenKey) || [0];
      
      // Increment count for this interval
      tokenCount[0] += 1;
      tokenCache.set(tokenKey, tokenCount);
      
      // Calculate remaining requests
      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage > limit;
      
      // Prepare response headers
      const headers = new Headers();
      headers.set('X-RateLimit-Limit', limit.toString());
      headers.set('X-RateLimit-Remaining', isRateLimited ? '0' : (limit - currentUsage).toString());
      
      if (isRateLimited) {
        const retryAfter = Math.ceil((tokenCache.getRemainingTTL(tokenKey) || 0) / 1000);
        headers.set('Retry-After', retryAfter.toString());
        throw new Error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
      }
      
      return {
        limit,
        remaining: limit - currentUsage,
        success: true,
      };
    },
  };
}

// Per-IP rate limiting (10 requests per minute by default)
export const ipRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per minute
});

// Per-endpoint rate limiting (100 requests per minute by default)
export const endpointRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000, // Max 1000 requests per minute
});
