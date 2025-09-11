import React, { Component, type ReactNode } from 'react';
import { Container, Title, Text, Button, Stack, Alert } from '@mantine/core';

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
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Update state with error info
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
        <Container size="sm" py="xl">
          <Stack gap="lg" align="center">
            <Alert color="red" title="Something went wrong" variant="light">
              <Text size="sm">
                We encountered an unexpected error. Please try refreshing the
                page.
              </Text>
            </Alert>

            <Stack gap="md" align="center">
              <Title order={2} ta="center" c="dimmed">
                Oops! Something went wrong
              </Title>

              <Text ta="center" c="dimmed" size="sm" maw={400}>
                We're sorry for the inconvenience. An unexpected error occurred
                while rendering this page.
              </Text>

              <Stack gap="sm" align="center">
                <Button onClick={this.handleReset} variant="light">
                  Try Again
                </Button>
                <Button onClick={this.handleReload} variant="secondary" size="sm">
                  Reload Page
                </Button>
              </Stack>
            </Stack>

            {import.meta.env.DEV && this.state.error && (
              <Alert color="gray" variant="light" w="100%">
                <Text size="xs" fw={500} mb="xs">
                  Error Details (Development Only):
                </Text>
                <Text
                  size="xs"
                  ff="monospace"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </Text>
              </Alert>
            )}
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}
