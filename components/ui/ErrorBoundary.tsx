'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Auto-retry for certain types of errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 2000);
    }
  }

  render() {
    if (this.state.hasError) {
      const CustomFallback = this.props.fallback;
      if (CustomFallback) {
        return (
          <CustomFallback
            error={this.state.error!}
            reset={() => this.setState({ hasError: false, error: null })}
          />
        );
      }

      return <DefaultErrorFallback error={this.state.error!} reset={() => this.setState({ hasError: false, error: null })} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <Card variant="elevated" className="border-red-200 shadow-brutal">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-red-900">Something went wrong</CardTitle>
            <p className="text-red-700 mt-2">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <details className="p-4 bg-red-50 rounded-lg border border-red-200">
              <summary className="cursor-pointer text-sm font-medium text-red-800 hover:text-red-900">
                Error Details
              </summary>
              <pre className="mt-2 text-xs text-red-700 overflow-auto">
                {error.message}
              </pre>
            </details>
            
            <div className="flex gap-3">
              <Button
                onClick={reset}
                variant="outline"
                className="flex-1 group"
              >
                <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                Try Again
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="gradient"
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <ErrorBoundaryClass fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  );
}
