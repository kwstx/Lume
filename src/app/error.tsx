"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { getSafeErrorMessage } from "@/lib/errors";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error (in production, this would go to error tracking service)
        console.error('Application error:', error);

        // TODO: Send to Sentry or similar service
        // if (process.env.NODE_ENV === 'production') {
        //   Sentry.captureException(error);
        // }
    }, [error]);

    const safeMessage = getSafeErrorMessage(error);
    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
        <div className="flex h-full min-h-[500px] flex-col items-center justify-center gap-6 p-8">
            <div className="rounded-full bg-red-100 p-4">
                <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>

            <div className="space-y-3 text-center max-w-md">
                <h2 className="text-2xl font-bold">Something went wrong</h2>
                <p className="text-muted-foreground">
                    {safeMessage}
                </p>
                {error.digest && (
                    <p className="text-xs text-muted-foreground font-mono">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>

            {isDevelopment && (
                <details className="w-full max-w-2xl">
                    <summary className="cursor-pointer text-sm font-medium mb-2">
                        Developer Details
                    </summary>
                    <div className="space-y-2">
                        <div className="text-left overflow-auto bg-red-50 p-4 rounded-lg border border-red-200">
                            <p className="text-sm font-mono text-red-900 font-semibold mb-2">
                                {error.message}
                            </p>
                        </div>
                        <div className="text-left overflow-auto bg-gray-100 p-4 rounded-lg text-xs font-mono max-h-64">
                            {error.stack}
                        </div>
                    </div>
                </details>
            )}

            <div className="flex gap-3">
                <Button onClick={() => reset()}>
                    Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
}
