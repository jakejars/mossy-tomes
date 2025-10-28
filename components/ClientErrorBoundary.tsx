'use client';

import { ErrorBoundary } from './ErrorBoundary';
import { ReactNode } from 'react';

/**
 * Client-side wrapper for ErrorBoundary to use in Server Components
 */
export function ClientErrorBoundary({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
