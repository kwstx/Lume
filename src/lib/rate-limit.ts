import { RateLimitError } from './errors';

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

// In-memory store (use Redis in production for distributed systems)
const store: RateLimitStore = {};

export interface RateLimitConfig {
    interval: number; // Time window in milliseconds
    maxRequests: number; // Max requests per interval
}

/**
 * Rate limiter using sliding window algorithm
 */
export class RateLimiter {
    constructor(private config: RateLimitConfig) { }

    /**
     * Check if request should be allowed
     * @param identifier - Unique identifier (IP address, user ID, API key, etc.)
     * @returns true if allowed, throws RateLimitError if exceeded
     */
    async check(identifier: string): Promise<boolean> {
        const now = Date.now();
        const key = `ratelimit:${identifier}`;

        // Clean up old entries periodically
        this.cleanup();

        if (!store[key]) {
            store[key] = {
                count: 1,
                resetTime: now + this.config.interval,
            };
            return true;
        }

        const record = store[key];

        // Reset if window has passed
        if (now > record.resetTime) {
            store[key] = {
                count: 1,
                resetTime: now + this.config.interval,
            };
            return true;
        }

        // Increment count
        record.count++;

        // Check if limit exceeded
        if (record.count > this.config.maxRequests) {
            const retryAfter = Math.ceil((record.resetTime - now) / 1000);
            throw new RateLimitError(
                `Rate limit exceeded. Try again in ${retryAfter} seconds.`
            );
        }

        return true;
    }

    /**
     * Get current rate limit status
     */
    async getStatus(identifier: string): Promise<{
        remaining: number;
        resetTime: number;
        limit: number;
    }> {
        const key = `ratelimit:${identifier}`;
        const record = store[key];

        if (!record || Date.now() > record.resetTime) {
            return {
                remaining: this.config.maxRequests,
                resetTime: Date.now() + this.config.interval,
                limit: this.config.maxRequests,
            };
        }

        return {
            remaining: Math.max(0, this.config.maxRequests - record.count),
            resetTime: record.resetTime,
            limit: this.config.maxRequests,
        };
    }

    /**
     * Clean up expired entries
     */
    private cleanup() {
        const now = Date.now();
        for (const key in store) {
            if (store[key].resetTime < now - this.config.interval) {
                delete store[key];
            }
        }
    }
}

/**
 * Default rate limiters for different use cases
 */
export const rateLimiters = {
    // API endpoints: 100 requests per 15 minutes
    api: new RateLimiter({
        interval: 15 * 60 * 1000,
        maxRequests: 100,
    }),

    // Authentication: 5 attempts per 15 minutes
    auth: new RateLimiter({
        interval: 15 * 60 * 1000,
        maxRequests: 5,
    }),

    // File uploads: 10 per hour
    upload: new RateLimiter({
        interval: 60 * 60 * 1000,
        maxRequests: 10,
    }),

    // Email sending: 50 per hour
    email: new RateLimiter({
        interval: 60 * 60 * 1000,
        maxRequests: 50,
    }),
};

/**
 * Get client identifier from request (IP address or user ID)
 */
export function getClientIdentifier(request: Request, userId?: string): string {
    if (userId) {
        return `user:${userId}`;
    }

    // Try to get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
    return `ip:${ip}`;
}
