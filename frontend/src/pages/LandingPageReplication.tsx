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
import DarkModeToggle from '../components/ui/DarkModeToggle';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: 'Grace Wanjiku',
      role: 'Form 4 Student',
      content: 'Elimu Smart helped me discover my passion for computer science. The assessment was so accurate!',
      rating: 5
    },
    {
      name: 'John Kamau',
      role: 'University Freshman',
      content: 'The career guidance I received was invaluable. I\'m now studying my dream course at UoN.',
      rating: 5
    },
    {
      name: 'Sarah Akinyi',
      role: 'Career Counselor',
      content: 'As a counselor, this platform makes my job easier and more effective.',
      rating: 5
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
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors duration-200"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="inline-flex items-center px-6 py-3 rounded-lg gradient-primary text-white font-medium hover:shadow-gradient-primary hover:-translate-y-1 transition-all duration-300 transform animate-pulse"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced Orange-to-Red Gradient */}
      <section className="relative overflow-hidden">
        {/* Background Gradient - Matching Design Reference */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Content */}
            <div className="text-white">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span>🏆</span>
                <span>#1 Career Guidance Platform in Kenya</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Your Journey to{' '}
                <span className="block bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                  Career Success
                </span>{' '}
                Starts Here
              </h1>
              
              <p className="text-lg text-white/90 mb-8 max-w-lg">
                Discover your perfect career path with AI-powered guidance tailored 
                for Kenyan students. From KCSE subject mapping to university 
                scholarships - we've got you covered.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-orange-600 font-semibold text-lg hover:bg-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  Start Your Career Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/demo')}
                  className="inline-flex items-center px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 group"
                >
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Demo
                </button>
              </div>
              
              {/* Success Indicators */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-xs">S1</div>
                    <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-xs">S2</div>
                    <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-xs">S3</div>
                    <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-xs">S4</div>
                  </div>
                  <div className="ml-3 text-sm">
                    <div className="font-semibold">15,000+ students guided</div>
                    <div className="text-white/70">⭐⭐⭐⭐⭐ 4.9/5 rating</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative">
              <div className="relative z-10">
                {/* Main Hero Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Career Assessment</h3>
                        <p className="text-sm text-white/70">Discover your strengths</p>
                      </div>
                    </div>
                    
                    {/* Progress Indicator */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Assessment Progress</span>
                        <span className="text-white font-medium">85%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>
                    
                    {/* Sample Results */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-white">Top Career Matches:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="h-4 w-4 bg-white/20 rounded"></div>
                            <span className="text-sm font-medium text-white">Software Engineering</span>
                          </div>
                          <span className="text-sm font-bold text-white">95%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="h-4 w-4 bg-white/20 rounded"></div>
                            <span className="text-sm font-medium text-white">Data Science</span>
                          </div>
                          <span className="text-sm font-bold text-white">88%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="h-4 w-4 bg-white/20 rounded"></div>
                            <span className="text-sm font-medium text-white">UX Design</span>
                          </div>
                          <span className="text-sm font-bold text-white">82%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Success Card */}
                <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold">89% Success Rate</span>
                  </div>
                  <div className="text-xs opacity-90">Students find their ideal career</div>
                </div>
                
                {/* Floating Careers Card */}
                <div className="absolute -top-4 -right-4 bg-white text-gray-900 px-4 py-3 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-semibold">500+ Careers</span>
                  </div>
                  <div className="text-xs text-gray-600">Mapped to KCSE subjects</div>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">15,000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Students Guided</div>
                </div>
              </div>
            </div>
            
            {/* Stats Card 2 - Success Rate */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">89%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>
            
            {/* Stats Card 3 - Career Paths */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Career Paths</div>
                </div>
              </div>
            </div>
            
            {/* Stats Card 4 - Universities */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Universities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced Modern Design */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              <span>Core Features</span>
            </div>
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
            <div className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Target className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">AI Career Assessment</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Advanced psychometric testing powered by AI to identify your natural talents, 
                  interests, and personality traits for optimal career matching.
                </p>
                <div className="flex items-center text-orange-600 dark:text-orange-400 font-medium cursor-pointer">
                  <span>Take Assessment</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Feature 2 - Subject Mapping */}
            <div className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Subject to Career Mapping</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Discover how your current subjects and grades translate into specific career 
                  opportunities and university course requirements.
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium cursor-pointer">
                  <span>Explore Mapping</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Feature 3 - Expert Counseling */}
            <div className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <MessageCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Expert Counseling</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Connect with certified career counselors who provide personalized guidance 
                  and support throughout your career discovery journey.
                </p>
                <div className="flex items-center text-green-600 dark:text-green-400 font-medium cursor-pointer">
                  <span>Book Session</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Feature 4 - University Tracking */}
            <div className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <GraduationCap className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">KUCCPS Integration</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Real-time tracking of university placements, course availability, and 
                  admission requirements directly from KUCCPS database.
                </p>
                <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium cursor-pointer">
                  <span>Track Placement</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Feature 5 - Skills Development */}
            <div className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <BarChart3 className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Skills for Future</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Access curated learning resources and skill development programs aligned 
                  with future job market demands and industry trends.
                </p>
                <div className="flex items-center text-yellow-600 dark:text-yellow-400 font-medium cursor-pointer">
                  <span>Build Skills</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Feature 6 - Career Spotlights */}
            <div className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <Shield className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Career Spotlights</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  In-depth profiles of emerging careers, salary expectations, growth prospects, 
                  and success stories from industry professionals.
                </p>
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer">
                  <span>Browse Careers</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* How It Works Section - Enhanced 4-Step Process */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v15l-6 3-6-3z" />
              </svg>
              <span>Simple Process</span>
            </div>
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
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
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
          <button 
            onClick={() => navigate('/register')}
            className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-orange-600 font-medium text-lg hover:bg-gray-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            Start Your Free Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
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