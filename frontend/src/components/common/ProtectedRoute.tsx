import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Button from '@/components/ui/button';
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
      <div className="container max-w-md mx-auto py-12">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <ExclamationTriangleIcon 
                width={64} 
                height={64} 
                className="text-destructive" 
              />
            </div>
            <CardTitle className="text-destructive">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-destructive/20">
              <AlertDescription>
                You don't have permission to access this page. This area is restricted to {allowedRoles.join(', ')} users only.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button
                onClick={() => window.location.href = redirectTo}
                className="w-full"
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};