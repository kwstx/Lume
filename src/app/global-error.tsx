"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log critical error
        console.error('Global error:', error);

        // TODO: Send to error tracking service
        // if (process.env.NODE_ENV === 'production') {
        //   Sentry.captureException(error, { level: 'fatal' });
        // }
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 bg-gray-50">
                    <div className="rounded-full bg-red-100 p-6">
                        <AlertTriangle className="h-12 w-12 text-red-600" />
                    </div>

                    <div className="space-y-3 text-center max-w-md">
                        <h1 className="text-3xl font-bold">Application Error</h1>
                        <p className="text-muted-foreground">
                            We're sorry, but something went wrong. Our team has been notified.
                        </p>
                        {error.digest && (
                            <p className="text-xs text-muted-foreground font-mono">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>

                    {process.env.NODE_ENV === 'development' && (
                        <div className="w-full max-w-2xl space-y-2">
                            <div className="text-left overflow-auto bg-red-50 p-4 rounded-lg border border-red-200">
                                <p className="text-sm font-mono text-red-900 font-semibold">
                                    {error.message}
                                </p>
                            </div>
                            <div className="text-left overflow-auto bg-gray-100 p-4 rounded-lg text-xs font-mono max-h-64">
                                {error.stack}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button onClick={() => reset()}>
                            Try Again
                        </Button>
                        <Button variant="outline" onClick={() => window.location.href = '/'}>
                            Go Home
                        </Button>
                    </div>
                </div>
            </body>
        </html>
    );
}
