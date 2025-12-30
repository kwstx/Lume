/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Basic implementation - consider using DOMPurify for production
 */
export function sanitizeHtml(html: string): string {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize user input for database queries
 */
export function sanitizeInput(input: string): string {
    // Remove null bytes
    let sanitized = input.replace(/\0/g, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    // Limit length to prevent DoS
    if (sanitized.length > 10000) {
        sanitized = sanitized.substring(0, 10000);
    }

    return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify CSRF token
 */
export function verifyCsrfToken(token: string, expectedToken: string): boolean {
    if (!token || !expectedToken) {
        return false;
    }

    // Constant-time comparison to prevent timing attacks
    if (token.length !== expectedToken.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < token.length; i++) {
        result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
    }

    return result === 0;
}

/**
 * Security headers for Next.js responses
 */
export const securityHeaders = [
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
    },
];

/**
 * CORS configuration
 */
export function getCorsHeaders(origin?: string): HeadersInit {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
        return {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };
    }

    // In production, only allow specific origins
    if (origin && allowedOrigins.includes(origin)) {
        return {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
        };
    }

    return {};
}

/**
 * Validate and sanitize file upload
 */
export function validateFileUpload(file: File, options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
}): { valid: boolean; error?: string } {
    const maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB default
    const allowedTypes = options.allowedTypes || ['text/csv', 'application/json'];

    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
        };
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `File type ${file.type} not allowed`,
        };
    }

    return { valid: true };
}
