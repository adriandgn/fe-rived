"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center animate-in fade-in zoom-in duration-300">
                    <div className="bg-destructive/10 p-4 rounded-full mb-6">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Something went wrong</h1>
                    <p className="text-muted-foreground max-w-md mb-8">
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>

                    <div className="flex gap-4">
                        <Button onClick={() => window.location.reload()} variant="default" className="gap-2">
                            <RefreshCw className="h-4 w-4" /> Reload Page
                        </Button>
                        <Button onClick={() => window.location.href = "/"} variant="outline">
                            Go Home
                        </Button>
                    </div>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div className="mt-8 p-4 bg-muted rounded-md text-left max-w-lg overflow-auto text-xs font-mono">
                            {this.state.error.toString()}
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
