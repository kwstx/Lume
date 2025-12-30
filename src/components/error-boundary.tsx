"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        // Call optional error handler
        this.props.onError?.(error, errorInfo);

        // TODO: Send to error tracking service (Sentry)
        // if (process.env.NODE_ENV === 'production') {
        //   Sentry.captureException(error, { contexts: { react: errorInfo } });
        // }
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
                    <div className="rounded-full bg-red-100 p-4">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Something went wrong</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-4 text-left">
                                <summary className="cursor-pointer text-sm font-medium">
                                    Error details (dev only)
                                </summary>
                                <pre className="mt-2 overflow-auto rounded-lg bg-gray-100 p-4 text-xs">
                                    {this.state.error.message}
                                    {'\n\n'}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                    <Button
                        onClick={() => {
                            this.setState({ hasError: false, error: undefined });
                            window.location.reload();
                        }}
                    >
                        Refresh Page
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
