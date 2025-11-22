import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types';
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle2,
  Star,
  Globe,
  Heart,
  ArrowRight,
  Shield,
  BookOpen
} from 'lucide-react';

export const LoginPageShadcn: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(formData);

      // Navigate based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'counselor') {
        navigate('/counselor/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Orange Brand Section - Hidden on mobile, shown on lg+ */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">Elimu Smart</h2>
              <p className="text-orange-100 text-sm">Career Guidance Platform</p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4 mb-12">
            <h1 className="text-white text-5xl font-bold leading-tight">
              Welcome Back to Your{' '}
              <span className="text-orange-200">Educational Journey</span>
            </h1>
            <p className="text-orange-100 text-lg leading-relaxed max-w-lg">
              Continue exploring career opportunities and building your future with Kenya's most trusted educational platform.
            </p>
          </div>

          {/* Feature Stats */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">50,000+ Students</p>
                <p className="text-orange-100 text-sm">Join Kenya's largest educational community</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Expert Guidance</p>
                <p className="text-orange-100 text-sm">Professional career counselors available 24/7</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">10,000+ Scholarships</p>
                <p className="text-orange-100 text-sm">Access opportunities from local and international institutions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-1 mb-3">
            <Heart className="w-5 h-5 text-orange-200 fill-orange-200" />
            <span className="text-white font-semibold">Trusted by Students</span>
            <div className="flex gap-0.5 ml-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 text-orange-200 fill-orange-200" />
              ))}
            </div>
            <span className="text-orange-100 text-sm ml-1">4.9/5 Rating</span>
          </div>
          <p className="text-white italic leading-relaxed">
            "Elimu Smart helped me discover my passion for engineering and connected me with the perfect scholarship opportunity."
          </p>
          <p className="text-orange-200 text-sm mt-3">- Sarah K., University of Nairobi</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-8 md:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-orange-600 mb-4">Sign in to continue your educational journey</p>
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Secure Login
                </Badge>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                      required
                      disabled={isLoading}
                      className="h-12 pl-10 pr-4 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500 bg-white"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-900">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      disabled={isLoading}
                      className="h-12 pl-10 pr-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-gray-700 cursor-pointer select-none"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-orange-600 hover:text-orange-700 hover:underline font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-medium border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="text-orange-600 hover:text-orange-700 hover:underline font-semibold transition-colors"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>

              {/* Terms & Privacy */}
              <div className="mt-8 text-center text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-orange-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-orange-600 hover:underline">
                  Privacy Policy
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Logo (shown on small screens) */}
          <div className="mt-6 lg:hidden text-center">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Elimu Smart</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageShadcn;
