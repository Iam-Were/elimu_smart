import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Container, Alert, Button, Stack, Title } from '@mantine/core';
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@radix-ui/react-icons';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  redirectTo = '/dashboard',
}) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles required, allow access
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has required role
  const hasRequiredRole = user?.role && allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    return (
      <Container size="md" py="xl">
        <Stack gap="lg" align="center">
          <ExclamationTriangleIcon 
            width={64} 
            height={64} 
            style={{ color: 'var(--destructive)' }} 
          />
          
          <Stack gap="sm" align="center">
            <Title order={2} ta="center" style={{ color: 'var(--destructive)' }}>
              Access Denied
            </Title>
            <Alert 
              color="red" 
              variant="light"
              style={{ maxWidth: 400, textAlign: 'center' }}
            >
              You don't have permission to access this page. This area is restricted to {allowedRoles.join(', ')} users only.
            </Alert>
          </Stack>

          <Stack gap="sm" align="center">
            <Button
              leftSection={<ArrowLeftIcon width={16} height={16} />}
              onClick={() => window.history.back()}
              variant="light"
            >
              Go Back
            </Button>
            <Button
              onClick={() => window.location.href = redirectTo}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              }}
            >
              Return to Dashboard
            </Button>
          </Stack>
        </Stack>
      </Container>
    );
  }

  return <>{children}</>;
};