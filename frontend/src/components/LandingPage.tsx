import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, GraduationCap, Brain, Zap, Target, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onGetStarted?: (role?: string) => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">Elimu Smart</h1>
              </div>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">
                  How it Works
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">
                  Testimonials
                </a>
              </div>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Button variant="ghost" className="text-gray-600 hover:text-primary">
                  Sign In
                </Button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2 space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm"
                      onClick={() => onGetStarted?.('student')}
                    >
                      Student Login
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm"
                      onClick={() => onGetStarted?.('counselor')}
                    >
                      Counselor Login
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm"
                      onClick={() => onGetStarted?.('admin')}
                    >
                      Admin Login
                    </Button>
                  </div>
                </div>
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => onGetStarted?.('student')}
              >
                Get Started
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-sm font-medium px-3 py-1 flex items-center gap-2 w-fit">
                  <Brain className="w-4 h-4" />
                  #1 AI-Powered Career Guidance Platform in Kenya
                </Badge>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-12 h-12 text-primary" />
                    AI-Driven
                  </span>
                  <span className="text-primary">Career Intelligence</span>{' '}
                  for Kenyan Students
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg">
                  Experience the future of career guidance with our advanced AI that analyzes your KCSE subjects, 
                  personality, and interests to provide personalized career recommendations with 89% accuracy.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-full">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-gray-700">Smart Career Matching</span>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-full">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-gray-700">Instant KCSE Analysis</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium flex items-center gap-2"
                  onClick={() => onGetStarted?.('student')}
                >
                  <Brain className="w-5 h-5" />
                  Get AI Career Analysis →
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-medium">
                  📺 See AI in Action
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-orange-200 border-2 border-white flex items-center justify-center">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-orange-300 border-2 border-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">15,000+ AI-guided students</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2 font-medium">4.9/5 AI accuracy</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto">
                      <GraduationCap className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-gray-700 font-medium">Students collaborating on career planning</p>
                  </div>
                </div>
              </div>
              
              {/* Floating cards matching Figma design */}
              <Card className="absolute top-4 right-4 w-56 bg-white/95 backdrop-blur-sm shadow-xl border-0 z-20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">AI-Powered Matching</p>
                      <p className="text-xs text-gray-600">500+ careers analyzed instantly</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="absolute bottom-4 left-4 w-56 bg-white/95 backdrop-blur-sm shadow-xl border-0 z-20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Smart Predictions</p>
                      <p className="text-xs text-gray-600">89% accuracy in career matching</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm font-medium px-4 py-2 mb-4">
              Powered by Advanced AI
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How Our AI Transforms Your Career Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience intelligent career guidance that learns from your unique profile and provides personalized recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Subject Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI analyzes your KCSE subjects and performance to identify career paths that match your academic strengths and interests.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Matching</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced algorithms consider your personality, interests, and goals to recommend careers with the highest success probability.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Insights</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get real-time career recommendations, university suggestions, and scholarship opportunities tailored to your profile.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-8 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">15,000+</h3>
                <p className="text-gray-600 font-medium">AI-Guided Students</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">89%</h3>
                <p className="text-gray-600 font-medium">AI Match Accuracy</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">500+</h3>
                <p className="text-gray-600 font-medium">Smart Career Paths</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">50+</h3>
                <p className="text-gray-600 font-medium">Partner Universities</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
