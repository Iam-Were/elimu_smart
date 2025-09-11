import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const LoginPageShadcn: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // Demo accounts for easy testing
  const demoAccounts = [
    { type: 'Student', email: 'student@elimu.com', password: 'student' },
    { type: 'Counselor', email: 'counselor@elimu.com', password: 'counselor' },
    { type: 'Platform Admin', email: 'mike.platform@elimu.com', password: 'platform2024' },
    { type: 'Operations Admin', email: 'linda.operations@elimu.com', password: 'operations2024' },
    { type: 'Safety Manager', email: 'peter.safety@elimu.com', password: 'safety2024' }
  ];

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your Elimu Smart account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm text-orange-600 hover:text-orange-700 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 text-center">
                Demo Accounts - Quick Access
              </p>
              <div className="grid gap-2">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(account.email, account.password)}
                    disabled={isLoading}
                    className="text-xs justify-start"
                  >
                    <span className="font-medium">{account.type}:</span>
                    <span className="ml-1 text-gray-600">{account.email}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPageShadcn;