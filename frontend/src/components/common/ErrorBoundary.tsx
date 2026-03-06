import React, { Component, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Button from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // In production, you would log this to an error reporting service
    // reportError(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="container max-w-sm mx-auto py-12">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-destructive">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Alert className="border-destructive/20">
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>
                  We encountered an unexpected error. Please try refreshing the page.
                </AlertDescription>
              </Alert>

              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                We're sorry for the inconvenience. An unexpected error occurred
                while rendering this page.
              </p>

              <div className="space-y-3">
                <Button 
                  onClick={this.handleReset} 
                  variant="outline" 
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleReload} 
                  variant="secondary" 
                  size="sm"
                  className="w-full"
                >
                  Reload Page
                </Button>
              </div>

              {import.meta.env.DEV && this.state.error && (
                <Alert className="text-left">
                  <AlertTitle className="text-xs font-medium mb-2">
                    Error Details (Development Only):
                  </AlertTitle>
                  <AlertDescription>
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack && (
                        <>
                          {'\n\nComponent Stack:'}
                          {this.state.errorInfo.componentStack}
                        </>
                      )}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
