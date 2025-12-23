import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component to catch React errors and display a fallback UI.
 * 
 * This component catches errors during rendering, in lifecycle methods, 
 * and in constructors of the whole tree below them.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: In production, send error to error tracking service (e.g., Sentry)
    // if (import.meta.env.PROD) {
    //   errorTrackingService.captureException(error, { extra: errorInfo });
    // }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI using ErrorState component
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md">
            <ErrorState
              title="Algo deu errado"
              description={
                this.state.error?.message ||
                'Ocorreu um erro inesperado. Por favor, tente recarregar a página.'
              }
              onRetry={this.handleReset}
            />
            <div className="mt-4 flex flex-col gap-2">
              <ErrorBoundaryActions onReset={this.handleReset} />
              {import.meta.env.DEV && this.state.errorInfo && (
                <details className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <summary className="cursor-pointer text-sm font-medium text-destructive">
                    Detalhes do erro (apenas em desenvolvimento)
                  </summary>
                  <pre className="mt-2 overflow-auto text-xs text-muted-foreground">
                    {this.state.error?.stack}
                    {'\n\n'}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Action buttons for ErrorBoundary fallback UI
 * Uses window.location for navigation since ErrorBoundary may be outside Router
 */
function ErrorBoundaryActions({ onReset }: { onReset: () => void }) {
  const handleGoHome = () => {
    // Use window.location as fallback since ErrorBoundary may be outside Router
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" onClick={onReset} className="w-full">
        Tentar novamente
      </Button>
      <Button
        variant="ghost"
        onClick={handleGoHome}
        className="w-full"
      >
        <Home className="mr-2 h-4 w-4" />
        Voltar para o início
      </Button>
    </div>
  );
}

/**
 * Hook-based wrapper for ErrorBoundary (for functional components)
 * Note: Error boundaries must be class components, but this provides
 * a convenient wrapper with navigation support.
 */
export function ErrorBoundaryWrapper({
  children,
  fallback,
  onError,
}: ErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}
