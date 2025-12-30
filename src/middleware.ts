import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { rateLimiters, getClientIdentifier } from "./lib/rate-limit";
import { securityHeaders } from "./lib/security";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
    const response = NextResponse.next();

    // Add security headers
    securityHeaders.forEach(({ key, value }) => {
        response.headers.set(key, value);
    });

    // Apply rate limiting to API routes
    if (req.nextUrl.pathname.startsWith('/api')) {
        try {
            const identifier = getClientIdentifier(req);
            await rateLimiters.api.check(identifier);

            // Add rate limit headers
            const status = await rateLimiters.api.getStatus(identifier);
            response.headers.set('X-RateLimit-Limit', status.limit.toString());
            response.headers.set('X-RateLimit-Remaining', status.remaining.toString());
            response.headers.set('X-RateLimit-Reset', new Date(status.resetTime).toISOString());
        } catch (error: any) {
            return NextResponse.json(
                { error: error.message || 'Rate limit exceeded' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': '900', // 15 minutes in seconds
                    }
                }
            );
        }
    }

    // Apply stricter rate limiting to auth routes
    if (req.nextUrl.pathname.startsWith('/api/auth')) {
        try {
            const identifier = getClientIdentifier(req);
            await rateLimiters.auth.check(identifier);
        } catch (error: any) {
            return NextResponse.json(
                { error: 'Too many authentication attempts. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': '900',
                    }
                }
            );
        }
    }

    return response;
});

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
