/**
 * Custom error classes for better error handling and reporting
 */

export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
        public isOperational: boolean = true
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, public field?: string) {
        super(message, 'VALIDATION_ERROR', 400);
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 'AUTHENTICATION_ERROR', 401);
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Insufficient permissions') {
        super(message, 'AUTHORIZATION_ERROR', 403);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 'NOT_FOUND', 404);
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests') {
        super(message, 'RATE_LIMIT_EXCEEDED', 429);
    }
}

export class ExternalServiceError extends AppError {
    constructor(service: string, message?: string) {
        super(
            message || `External service error: ${service}`,
            'EXTERNAL_SERVICE_ERROR',
            502
        );
    }
}

/**
 * Error handler utility for server actions
 */
export function handleServerError(error: unknown): {
    success: false;
    error: string;
    code?: string;
} {
    if (error instanceof AppError) {
        return {
            success: false,
            error: error.message,
            code: error.code,
        };
    }

    if (error instanceof Error) {
        // Log unexpected errors
        console.error('Unexpected error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred',
        };
    }

    return {
        success: false,
        error: 'An unknown error occurred',
    };
}

/**
 * Safe error message for client display (hides sensitive info in production)
 */
export function getSafeErrorMessage(error: unknown): string {
    if (process.env.NODE_ENV === 'development') {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    }

    // In production, only show user-friendly messages
    if (error instanceof AppError && error.isOperational) {
        return error.message;
    }

    return 'Something went wrong. Please try again later.';
}
