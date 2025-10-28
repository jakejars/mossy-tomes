'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 *
 * Wraps components and displays a fallback UI when an error occurs
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen py-20 px-6 text-moss-100 flex items-center justify-center">
          <div className="max-w-2xl mx-auto">
            <div className="card p-8 bg-moss-900/70 border border-red-700/50 shadow-lg rounded-xl text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="font-serif text-3xl font-bold mb-4 text-moss-50">
                Something Went Wrong
              </h1>
              <p className="text-lg text-moss-200 mb-6">
                The generator encountered an unexpected error. Please try refreshing the page.
              </p>
              {this.state.error && (
                <details className="text-left bg-moss-800/50 p-4 rounded-lg mb-6">
                  <summary className="cursor-pointer text-moss-300 hover:text-moss-100 mb-2">
                    Error Details
                  </summary>
                  <pre className="text-xs text-red-400 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
                aria-label="Reload page"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
