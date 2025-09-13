import React from 'react';
import { 
  Target,
  BookOpen,
  ArrowRight,
  Star,
  GraduationCap,
  BarChart3,
  MessageCircle,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import DarkModeToggle from '../components/ui/DarkModeToggle';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: 'Grace Wanjiku',
      role: 'Form 4 → Software Engineering @ UoN',
      content: 'I was torn between medicine and tech. Elimu Smart\'s AI assessment showed me software engineering was my true calling. Now I\'m at UoN living my dream!',
      rating: 5,
      avatar: '👩‍💻'
    },
    {
      name: 'John Kamau',
      role: 'KCSE 2023 → Data Science @ JKUAT',
      content: 'The KCSE subject mapping was a game-changer! I discovered how my math and physics grades perfectly aligned with data science. Secured my HELB loan too!',
      rating: 5,
      avatar: '👨‍🔬'
    },
    {
      name: 'Sarah Akinyi',
      role: 'Career Counselor @ Alliance High',
      content: 'This platform revolutionized how I guide students. The AI insights help me provide personalized advice to 200+ students efficiently. My success rate doubled!',
      rating: 5,
      avatar: '👩‍🏫'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Navigation Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
                Elimu Smart
              </span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors duration-200">
                Features
              </a>
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors duration-200">
                About
              </a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors duration-200">
                Reviews
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors duration-200">
                Pricing
              </a>
            </nav>
            
            {/* Actions */}
            <div className="flex items-center space-x-3">
              <DarkModeToggle />
              <Button 
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform animate-pulse group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced Orange-to-Red Gradient with Pattern */}
      <section className="relative overflow-hidden">
        {/* Background Gradient - Premium Design */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-300"></div>
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Content */}
            <div className="text-white">
              <Badge variant="secondary" className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border-white/30">
                <span>🏆</span>
                <span>#1 Career Guidance Platform in Kenya</span>
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Transform Your{' '}
                <span className="block bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent drop-shadow-sm">
                  Career Dreams
                </span>{' '}
                Into Reality
              </h1>
              
              <p className="text-xl text-white/95 mb-8 max-w-xl leading-relaxed">
                The #1 AI-powered career guidance platform for Kenyan students. 
                From KCSE subject analysis to university placements and scholarship 
                opportunities - your complete career journey companion.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-orange-600 font-bold text-lg hover:bg-gray-50 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 group shadow-xl"
                >
                  🚀 Start Your Journey FREE
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg hover:bg-white/20 hover:border-white/60 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Try Demo
                </Button>
              </div>
              
              {/* Success Indicators */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-3 border-white flex items-center justify-center text-xs font-bold shadow-lg">👩‍🎓</div>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-3 border-white flex items-center justify-center text-xs font-bold shadow-lg">👨‍🎓</div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-3 border-white flex items-center justify-center text-xs font-bold shadow-lg">👩‍💼</div>
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-500 rounded-full border-3 border-white flex items-center justify-center text-xs font-bold shadow-lg">👨‍🔬</div>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full border-3 border-white flex items-center justify-center text-xs font-bold text-white">+5K</div>
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-lg">25,000+ students transformed</div>
                    <div className="text-white/80 flex items-center space-x-1">
                      <span>⭐⭐⭐⭐⭐</span>
                      <span className="font-semibold">4.9/5</span>
                      <span className="text-white/60">• 2,847 reviews</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold">Live: 847 students taking assessments</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative">
              <div className="relative z-10">
                {/* Main Hero Card */}
                <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-14 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                        <Target className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">AI Career Assessment</h3>
                        <p className="text-white/80">Powered by machine learning</p>
                      </div>
                    </div>
                    
                    {/* Progress Indicator */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 font-medium">Assessment Progress</span>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">92%</Badge>
                      </div>
                      <Progress value={92} className="h-3 bg-white/20" />
                      <div className="text-white/70 text-sm">🎯 Almost there! 2 more questions to unlock your results</div>
                    </div>
                    
                    {/* Sample Results */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-white text-lg">🏆 Your Top Career Matches:</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
                          <div className="flex items-center space-x-3">
                            <div className="h-6 w-6 bg-green-400 rounded-lg flex items-center justify-center">💻</div>
                            <span className="font-semibold text-white">Software Engineering</span>
                          </div>
                          <span className="text-green-300 font-bold text-lg">97%</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
                          <div className="flex items-center space-x-3">
                            <div className="h-6 w-6 bg-blue-400 rounded-lg flex items-center justify-center">📊</div>
                            <span className="font-semibold text-white">Data Science</span>
                          </div>
                          <span className="text-blue-300 font-bold text-lg">94%</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                          <div className="flex items-center space-x-3">
                            <div className="h-6 w-6 bg-purple-400 rounded-lg flex items-center justify-center">🎨</div>
                            <span className="font-semibold text-white">UX Design</span>
                          </div>
                          <span className="text-purple-300 font-bold text-lg">89%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Success Card */}
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-4 rounded-2xl shadow-2xl border-2 border-green-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-200 rounded-full animate-ping"></div>
                    <span className="font-bold text-lg">94% Success Rate</span>
                  </div>
                  <div className="text-sm opacity-95 mt-1">🎯 Students land their dream careers</div>
                </div>
                
                {/* Floating Careers Card */}
                <div className="absolute -top-6 -right-6 bg-white text-gray-900 px-5 py-4 rounded-2xl shadow-2xl border-2 border-orange-200">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-6 w-6 text-orange-600" />
                    <span className="font-bold text-lg text-gray-900">750+ Careers</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">📚 Mapped to all KCSE subjects</div>
                </div>
                
                {/* Floating AI Card */}
                <div className="absolute top-1/3 -left-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-2xl shadow-xl border-2 border-blue-300 rotate-12">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin">🤖</div>
                    <span className="font-semibold">AI Powered</span>
                  </div>
                  <div className="text-xs opacity-90">Smart recommendations</div>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl transform rotate-2 scale-105 -z-10"></div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Trusted by Thousands of Students
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and guidance 
              you need to make informed career decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stats Card 1 - Students Guided */}
            <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    {/* Circular Progress Ring */}
                    <svg className="absolute -inset-1 w-18 h-18 transform -rotate-90" viewBox="0 0 72 72">
                      <circle
                        cx="36"
                        cy="36"
                        r="32"
                        fill="none"
                        className="stroke-gray-200 dark:stroke-gray-700"
                        strokeWidth="4"
                      />
                      <circle
                        cx="36"
                        cy="36"
                        r="32"
                        fill="none"
                        className="stroke-orange-500"
                        strokeWidth="4"
                        strokeDasharray="201"
                        strokeDashoffset="21"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">25,000+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Students Transformed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Card 2 - Success Rate */}
            <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <svg className="absolute -inset-1 w-18 h-18 transform -rotate-90" viewBox="0 0 72 72">
                      <circle
                        cx="36"
                        cy="36"
                        r="32"
                        fill="none"
                        className="stroke-gray-200 dark:stroke-gray-700"
                        strokeWidth="4"
                      />
                      <circle
                        cx="36"
                        cy="36"
                        r="32"
                        fill="none"
                        className="stroke-green-500"
                        strokeWidth="4"
                        strokeDasharray="201"
                        strokeDashoffset="23"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">94%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Dream Career Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Card 3 - Career Paths */}
            <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <svg className="absolute -inset-1 w-18 h-18 transform -rotate-90" viewBox="0 0 72 72">
                      <circle
                        cx="36"
                        cy="36"
                        r="32"
                        fill="none"
                        className="stroke-gray-200 dark:stroke-gray-700"
                        strokeWidth="4"
                      />
                      <circle
                        cx="36"
                        cy="36"
                        r="32"
                        fill="none"
                        className="stroke-blue-500"
                        strokeWidth="4"
                        strokeDasharray="201"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">750+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Career Paths</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Card 4 - Universities */}
            <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <svg className="absolute -inset-1 w-18 h-18 transform -rotate-90" viewBox="0 0 72 72">
                      <circle
                        cx="36"
                        cy="36"
                        r="32"
                        fill="none"
                        className="stroke-gray-200 dark:stroke-gray-700"
                        strokeWidth="4"
                      />
                      <circle
                        cx="36"
                        cy="36"
                        r="32"
                        fill="none"
                        className="stroke-purple-500"
                        strokeWidth="4"
                        strokeDasharray="201"
                        strokeDashoffset="31"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">85+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Universities & Colleges</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced Modern Design */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              <span>Core Features</span>
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Everything You Need for
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Career Success
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform provides students with AI-powered assessments, 
              expert guidance, and real-time market insights.
            </p>
          </div>
          
          {/* Features Grid - Enhanced 3-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 - Career Assessment */}
            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Target className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl">AI Career Assessment</CardTitle>
                <CardDescription className="leading-relaxed">
                  Advanced psychometric testing powered by AI to identify your natural talents, 
                  interests, and personality traits for optimal career matching.
                </CardDescription>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-0">
                <div className="flex items-center text-orange-600 dark:text-orange-400 font-medium cursor-pointer">
                  <span>Take Assessment</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardFooter>
            </Card>
            
            {/* Feature 2 - Subject Mapping */}
            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Subject to Career Mapping</CardTitle>
                <CardDescription className="leading-relaxed">
                  Discover how your current subjects and grades translate into specific career 
                  opportunities and university course requirements.
                </CardDescription>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-0">
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium cursor-pointer">
                  <span>Explore Mapping</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardFooter>
            </Card>
            
            {/* Feature 3 - Expert Counseling */}
            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <MessageCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Expert Counseling</CardTitle>
                <CardDescription className="leading-relaxed">
                  Connect with certified career counselors who provide personalized guidance 
                  and support throughout your career discovery journey.
                </CardDescription>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-0">
                <div className="flex items-center text-green-600 dark:text-green-400 font-medium cursor-pointer">
                  <span>Book Session</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardFooter>
            </Card>
            
            {/* Feature 4 - University Tracking */}
            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <GraduationCap className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">KUCCPS Integration</CardTitle>
                <CardDescription className="leading-relaxed">
                  Real-time tracking of university placements, course availability, and 
                  admission requirements directly from KUCCPS database.
                </CardDescription>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-0">
                <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium cursor-pointer">
                  <span>Track Placement</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardFooter>
            </Card>
            
            {/* Feature 5 - Skills Development */}
            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <BarChart3 className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-xl">Skills for Future</CardTitle>
                <CardDescription className="leading-relaxed">
                  Access curated learning resources and skill development programs aligned 
                  with future job market demands and industry trends.
                </CardDescription>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-0">
                <div className="flex items-center text-yellow-600 dark:text-yellow-400 font-medium cursor-pointer">
                  <span>Build Skills</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardFooter>
            </Card>
            
            {/* Feature 6 - Career Spotlights */}
            <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <Shield className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-xl">Career Spotlights</CardTitle>
                <CardDescription className="leading-relaxed">
                  In-depth profiles of emerging careers, salary expectations, growth prospects, 
                  and success stories from industry professionals.
                </CardDescription>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-0">
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer">
                  <span>Browse Careers</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardFooter>
            </Card>
            
          </div>
        </div>
      </section>

      {/* How It Works Section - Enhanced 4-Step Process */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v15l-6 3-6-3z" />
              </svg>
              <span>Simple Process</span>
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Your Journey to
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Career Clarity
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Follow our proven 4-step process to discover your ideal career path 
              and create an actionable plan for success.
            </p>
          </div>
          
          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Sign Up & Assess</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Create your profile and complete our comprehensive AI-powered career assessment
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-orange-200 dark:bg-orange-800"></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Get Matched</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Receive personalized career recommendations based on your assessment results
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-orange-200 dark:bg-orange-800"></div>
            </div>
            
            {/* Step 3 */}
            <div className="relative text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Explore & Plan</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Dive deep into career options and create your personalized education plan
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-orange-200 dark:bg-orange-800"></div>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Take Action</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Execute your plan with ongoing support from expert counselors
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Hear from students who found their path with Elimu Smart.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 dark:text-gray-400 mb-4 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white font-bold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Discover Your Future?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of students who have found their perfect career path with Elimu Smart.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/register')}
            className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-orange-600 font-medium text-lg hover:bg-gray-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            Start Your Free Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">Elimu Smart</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering Kenyan students with intelligent career guidance.
              </p>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-400">Secure & Private</span>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">FAQs</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Get in Touch</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@elimusmart.co.ke</li>
                <li>+254 700 123 456</li>
                <li>Nairobi, Kenya</li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Elimu Smart. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default LandingPage;