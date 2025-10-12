import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

      // Navigate to root - RoleBasedDefaultRoute will handle role-based routing
      navigate('/', { replace: true });
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

  const handleDemoLogin = async (email: string, password: string) => {
    setFormData({ email, password });
    setError('');

    try {
      await login({ email, password });

      // Navigate to root - RoleBasedDefaultRoute will handle role-based routing
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Sign in to your Elimu Smart account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className="h-12 px-4 text-base text-black placeholder:text-gray-500 border-gray-300 focus:border-orange-500 focus:ring-orange-500 bg-white"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="h-12 px-4 pr-12 text-base text-black placeholder:text-gray-500 border-gray-300 focus:border-orange-500 focus:ring-orange-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-700 hover:underline font-medium transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-medium">Demo Access</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid gap-2">
                {demoAccounts.slice(0, 3).map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(account.email, account.password)}
                    disabled={isLoading}
                    className="text-xs justify-start h-10 px-4 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{account.type}</span>
                    <span className="ml-2 text-gray-600">{account.email}</span>
                  </Button>
                ))}
              </div>
              <details className="text-center">
                <summary className="text-xs text-gray-600 hover:text-gray-800 cursor-pointer font-medium">
                  More Demo Accounts →
                </summary>
                <div className="grid gap-2 mt-2">
                  {demoAccounts.slice(3).map((account) => (
                    <Button
                      key={account.email}
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoLogin(account.email, account.password)}
                      disabled={isLoading}
                      className="text-xs justify-start h-10 px-4 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                    >
                      <span className="font-semibold text-gray-900">{account.type}</span>
                      <span className="ml-2 text-gray-600">{account.email}</span>
                    </Button>
                  ))}
                </div>
              </details>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-orange-600 hover:text-orange-700 hover:underline font-semibold transition-colors"
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