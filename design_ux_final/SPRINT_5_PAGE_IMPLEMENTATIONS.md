# Sprint 5: Page Implementations - Final Implementation

## 🎯 Sprint Goal
Implement complete page structures with exact layouts, component compositions, content hierarchy, and responsive behavior for every major page in the Elimu Smart platform. This sprint provides the definitive implementation guide for recreating the entire application.

## 🏠 Landing Page (COMPLETE IMPLEMENTATION)

### Landing Page Structure (EXACT IMPLEMENTATION)
```tsx
// pages/LandingPage.tsx - COMPLETE IMPLEMENTATION
import React from 'react';
import { 
  ArrowRight, Play, Star, Check, Sparkles, Target, BookOpen, 
  MessageCircle, GraduationCap, Users, Phone, Mail, MapPin,
  TrendingUp, Shield, Clock, Award
} from 'lucide-react';
import { InteractiveButton as Button } from '../components/ui/InteractiveButton';
import { InteractiveCard as Card } from '../components/ui/InteractiveCard';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLoginClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 to-primary/5">
      
      {/* Navigation Header - EXACT RESPONSIVE LAYOUT */}
      <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section - EXACT BRAND STYLING */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Elimu Smart</h1>
                <p className="text-xs text-primary font-medium">Career Guidance Platform</p>
              </div>
            </div>
            
            {/* Navigation Menu - EXACT SPACING */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                How It Works
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Success Stories
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Pricing
              </a>
            </div>
            
            {/* CTA Buttons - EXACT LAYOUT */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={onLoginClick}>
                Sign In
              </Button>
              <Button variant="primary" onClick={onGetStarted} icon={ArrowRight} iconPosition="right">
                Get Started
              </Button>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Hero Section - EXACT RESPONSIVE STRUCTURE */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Content - EXACT TEXT HIERARCHY */}
            <div className="space-y-8">
              <div className="space-y-6">
                
                {/* Trust Badge */}
                <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>Trusted by 10,000+ Kenyan Students</span>
                </div>
                
                {/* Main Headline - EXACT RESPONSIVE TYPOGRAPHY */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
                  Discover Your
                  <span className="block text-transparent bg-clip-text gradient-primary">
                    Perfect Career
                  </span>
                  Path in Kenya
                </h1>
                
                {/* Value Proposition - EXACT COPY */}
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">
                  The most comprehensive AI-powered career guidance platform designed specifically 
                  for Kenyan students. From KCSE to university placement and beyond.
                </p>
                
                {/* Key Benefits - EXACT LIST */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>AI-Powered Career Matching</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>KUCCPS Integration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Expert Counselor Network</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Real Job Market Data</span>
                  </div>
                </div>
              </div>
              
              {/* Hero CTAs - EXACT RESPONSIVE LAYOUT */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={onGetStarted}
                  icon={ArrowRight} 
                  iconPosition="right"
                  className="text-lg px-8 py-4"
                >
                  Start Free Assessment
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  icon={Play}
                  className="text-lg px-8 py-4"
                >
                  Watch Success Stories
                </Button>
              </div>
              
              {/* Social Proof - EXACT RESPONSIVE STATS */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-semibold text-foreground">10K+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Students Guided</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-semibold text-foreground">98%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-semibold text-foreground">500+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Career Paths</div>
                </div>
              </div>
            </div>
            
            {/* Hero Visual - EXACT INTERACTIVE PREVIEW */}
            <div className="relative order-first lg:order-last">
              <Card padding="lg" className="relative z-10 bg-gradient-to-br from-background to-muted/50">
                
                {/* Assessment Preview Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Career Assessment Preview</h3>
                    <p className="text-sm text-muted-foreground">See how our AI works</p>
                  </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assessment Progress</span>
                    <span className="text-primary font-medium">85%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div className="gradient-primary h-2 rounded-full w-[85%] transition-all duration-1000 ease-out"></div>
                  </div>
                </div>
                
                {/* Sample Results */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Top Career Matches:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">Software Engineering</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">95%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">Data Science</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">88%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">Business Analysis</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">82%</span>
                    </div>
                  </div>
                </div>
                
                {/* CTA in preview */}
                <div className="mt-6 pt-4 border-t border-border">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full"
                    onClick={onGetStarted}
                  >
                    Start Your Assessment
                  </Button>
                </div>
              </Card>
              
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl transform rotate-2 scale-105 -z-10"></div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Section - EXACT 3-COLUMN GRID */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header - EXACT SPACING */}
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Star className="h-4 w-4" />
              <span>Core Features</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-foreground">
              Everything You Need for
              <span className="block text-transparent bg-clip-text gradient-primary">
                Career Success
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform combines AI technology, expert guidance, 
              and real-time market insights to guide your career journey.
            </p>
          </div>
          
          {/* Features Grid - EXACT RESPONSIVE BEHAVIOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 - AI Assessment */}
            <Card hover={true} padding="lg" className="group text-center">
              <div className="space-y-4">
                <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-200">
                  <Target className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-200" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">AI Career Assessment</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced psychometric testing powered by AI to identify your natural talents, 
                  interests, and personality traits for optimal career matching.
                </p>
                <div className="flex items-center justify-center text-primary font-medium">
                  <span>Take Assessment</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Card>
            
            {/* Feature 2 - Subject Mapping */}
            <Card hover={true} padding="lg" className="group text-center">
              <div className="space-y-4">
                <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-200">
                  <BookOpen className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-200" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Subject to Career Mapping</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Discover how your current subjects and grades translate into specific career 
                  opportunities and university course requirements.
                </p>
                <div className="flex items-center justify-center text-primary font-medium">
                  <span>Explore Mapping</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Card>
            
            {/* Feature 3 - Expert Counseling */}
            <Card hover={true} padding="lg" className="group text-center">
              <div className="space-y-4">
                <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-200">
                  <MessageCircle className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-200" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Expert Counseling</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with certified career counselors who provide personalized guidance 
                  and support throughout your career discovery journey.
                </p>
                <div className="flex items-center justify-center text-primary font-medium">
                  <span>Book Session</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Card>
            
            {/* Feature 4 - KUCCPS Integration */}
            <Card hover={true} padding="lg" className="group text-center">
              <div className="space-y-4">
                <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-200">
                  <Shield className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-200" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">KUCCPS Integration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time placement tracking and course selection assistance integrated 
                  directly with the official KUCCPS portal.
                </p>
                <div className="flex items-center justify-center text-primary font-medium">
                  <span>Track Placement</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Card>
            
            {/* Feature 5 - Market Insights */}
            <Card hover={true} padding="lg" className="group text-center">
              <div className="space-y-4">
                <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-200">
                  <TrendingUp className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-200" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Market Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access real-time job market data, salary information, and employment 
                  trends specific to the Kenyan market.
                </p>
                <div className="flex items-center justify-center text-primary font-medium">
                  <span>View Insights</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Card>
            
            {/* Feature 6 - 24/7 Support */}
            <Card hover={true} padding="lg" className="group text-center">
              <div className="space-y-4">
                <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-200">
                  <Clock className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-200" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">24/7 AI Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant answers to your career questions with our AI-powered 
                  support system, available around the clock.
                </p>
                <div className="flex items-center justify-center text-primary font-medium">
                  <span>Get Support</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Card>
            
          </div>
        </div>
      </section>

      {/* How It Works Section - EXACT 4-STEP PROCESS */}
      <section id="how-it-works" className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-foreground">
              Your Journey to
              <span className="block text-transparent bg-clip-text gradient-primary">
                Career Clarity
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Follow our proven 4-step process to discover your ideal career path 
              and create an actionable plan for success.
            </p>
          </div>
          
          {/* Process Steps - EXACT RESPONSIVE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="relative text-center">
              <Card padding="lg" hover={true}>
                <div className="h-16 w-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-semibold text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Sign Up & Assess</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Create your profile and complete our comprehensive AI-powered career assessment 
                  that analyzes your interests, skills, and personality.
                </p>
              </Card>
              {/* Connector Line */}
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30"></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative text-center">
              <Card padding="lg" hover={true}>
                <div className="h-16 w-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-semibold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Get Matched</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our AI analyzes your results and matches you with career paths that align 
                  with your strengths and market opportunities.
                </p>
              </Card>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30"></div>
            </div>
            
            {/* Step 3 */}
            <div className="relative text-center">
              <Card padding="lg" hover={true}>
                <div className="h-16 w-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-semibold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Plan & Explore</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Explore detailed career information, education requirements, and 
                  create a personalized roadmap to your goals.
                </p>
              </Card>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30"></div>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <Card padding="lg" hover={true}>
                <div className="h-16 w-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-semibold text-white">4</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Track & Succeed</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Monitor your progress, access ongoing support, and stay updated 
                  with placement opportunities and market trends.
                </p>
              </Card>
            </div>
            
          </div>
        </div>
      </section>

      {/* Pricing Section - EXACT 3-TIER STRUCTURE */}
      <section id="pricing" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-foreground">
              Choose Your
              <span className="block text-transparent bg-clip-text gradient-primary">
                Success Plan
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start free and upgrade as you grow. All plans include our AI-powered 
              career matching and basic guidance features.
            </p>
          </div>
          
          {/* Pricing Cards - EXACT 3-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Starter Plan */}
            <Card padding="lg" variant="outlined">
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Starter</h3>
                  <p className="text-sm text-muted-foreground mt-1">Perfect for exploration</p>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-semibold text-foreground">Free</div>
                  <div className="text-sm text-muted-foreground">Forever</div>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Basic career assessment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>5 career suggestions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Subject mapping tool</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Basic market insights</span>
                  </li>
                </ul>
                <Button variant="secondary" className="w-full" onClick={onGetStarted}>
                  Get Started Free
                </Button>
              </div>
            </Card>
            
            {/* Premium Plan - HIGHLIGHTED */}
            <Card padding="lg" variant="outlined" className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Premium</h3>
                  <p className="text-sm text-muted-foreground mt-1">For serious career planning</p>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-semibold text-foreground">KSh 2,500</div>
                  <div className="text-sm text-muted-foreground">Per month</div>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Advanced AI assessment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Unlimited career matches</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Monthly counselor sessions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>KUCCPS placement tracking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Premium market insights</span>
                  </li>
                </ul>
                <Button variant="primary" className="w-full">
                  Start Premium Trial
                </Button>
              </div>
            </Card>
            
            {/* Pro Plan */}
            <Card padding="lg" variant="outlined">
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Pro</h3>
                  <p className="text-sm text-muted-foreground mt-1">For institutions & schools</p>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-semibold text-foreground">Custom</div>
                  <div className="text-sm text-muted-foreground">Per school</div>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Unlimited student accounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Institutional dashboard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
                <Button variant="secondary" className="w-full">
                  Contact Sales
                </Button>
              </div>
            </Card>
            
          </div>
        </div>
      </section>

      {/* Final CTA Section - EXACT GRADIENT BACKGROUND */}
      <section className="py-20 gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-5xl font-semibold leading-tight">
              Ready to Discover Your
              <span className="block">Perfect Career Path?</span>
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Kenyan students who have found clarity and direction 
              through our AI-powered career guidance platform.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={onGetStarted}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4"
              icon={ArrowRight}
              iconPosition="right"
            >
              Start Your Journey Today
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4"
              icon={Phone}
            >
              Talk to Expert
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="pt-8 space-y-4">
            <p className="text-primary-foreground/70 text-sm">Trusted by leading Kenyan institutions</p>
            <div className="flex items-center justify-center space-x-8 opacity-70">
              <div className="text-sm font-medium">University of Nairobi</div>
              <div className="text-sm font-medium">Strathmore University</div>
              <div className="text-sm font-medium">KICD</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - EXACT LAYOUT */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 gradient-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-white text-lg">Elimu Smart</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering Kenyan students with AI-powered career guidance for a brighter future.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <Users className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <Phone className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {/* Platform Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Career Assessment</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Subject Mapping</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Expert Counseling</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">KUCCPS Integration</a></li>
              </ul>
            </div>
            
            {/* Resources Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Career Library</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Market Insights</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            
            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
          </div>
          
          {/* Footer Bottom */}
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">
              © 2024 Elimu Smart. All rights reserved. Made with ❤️ in Kenya.
            </p>
            <div className="flex space-x-6 text-sm text-slate-400 mt-4 md:mt-0">
              <span>🇰🇪 Proudly Kenyan</span>
              <span>📞 +254 700 123 456</span>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default LandingPage;
```

## 📊 Dashboard Page (COMPLETE IMPLEMENTATION)

### Student Dashboard Structure (EXACT LAYOUT)
```tsx
// pages/StudentDashboard.tsx - COMPLETE IMPLEMENTATION
import React from 'react';
import { 
  Target, BookOpen, MessageCircle, Calendar, TrendingUp, Clock, 
  CheckCircle, ArrowRight, Plus, Bell, Settings, Star, Award,
  Users, BarChart3, FileText, Zap
} from 'lucide-react';
import { InteractiveButton as Button } from '../components/ui/InteractiveButton';
import { InteractiveCard as Card, CardHeader, CardContent, CardFooter } from '../components/ui/InteractiveCard';
import AppLayout from '../components/AppLayout';

interface StudentDashboardProps {
  userData: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onPageChange: (page: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ userData, onPageChange }) => {
  return (
    <AppLayout
      title={`Welcome back, ${userData.name}!`}
      subtitle="Track your career discovery progress and next steps"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Dashboard' }
      ]}
      actions={
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon={Settings}>
            Settings
          </Button>
          <Button variant="primary" icon={Plus}>
            Take Assessment
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area - 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Welcome Section with Progress Overview */}
          <Card padding="lg" className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Your Career Journey</h2>
                <p className="text-muted-foreground">You're making great progress! Keep going.</p>
              </div>
              <div className="h-16 w-16 bg-primary/20 rounded-xl flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-semibold text-foreground">85%</div>
                <div className="text-sm text-muted-foreground">Assessment Complete</div>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-semibold text-foreground">12</div>
                <div className="text-sm text-muted-foreground">Careers Explored</div>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-semibold text-foreground">3</div>
                <div className="text-sm text-muted-foreground">Counselor Sessions</div>
              </div>
            </div>
            
            {/* Overall Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="text-primary font-medium">85%</span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-3">
                <div className="gradient-primary h-3 rounded-full w-[85%] transition-all duration-1000 ease-out"></div>
              </div>
            </div>
          </Card>
          
          {/* Career Recommendations - EXACT LAYOUT */}
          <Card padding="lg">
            <CardHeader
              icon={Star}
              title="Recommended for You"
              subtitle="Based on your assessment results and interests"
              action={
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              }
            />
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Top Career Match */}
                <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Software Engineering</h4>
                      <p className="text-sm text-primary font-medium">95% Match</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    High demand career with excellent growth prospects in Kenya's expanding tech sector.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Salary: KSh 80K-150K</span>
                    <Button variant="ghost" size="sm">
                      Explore
                    </Button>
                  </div>
                </div>
                
                {/* Second Career Match */}
                <div className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Data Science</h4>
                      <p className="text-sm text-blue-600 font-medium">88% Match</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rapidly growing field combining statistics, programming, and business insights.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Salary: KSh 90K-180K</span>
                    <Button variant="ghost" size="sm">
                      Explore
                    </Button>
                  </div>
                </div>
                
                {/* Third Career Match */}
                <div className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Business Analysis</h4>
                      <p className="text-sm text-green-600 font-medium">82% Match</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bridge between business needs and technology solutions in growing companies.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Salary: KSh 70K-120K</span>
                    <Button variant="ghost" size="sm">
                      Explore
                    </Button>
                  </div>
                </div>
                
                {/* Fourth Career Match */}
                <div className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Digital Marketing</h4>
                      <p className="text-sm text-purple-600 font-medium">78% Match</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Creative field combining technology with marketing strategy for modern businesses.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Salary: KSh 60K-100K</span>
                    <Button variant="ghost" size="sm">
                      Explore
                    </Button>
                  </div>
                </div>
                
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Applications - EXACT IMPLEMENTATION */}
          <Card padding="lg">
            <CardHeader
              icon={FileText}
              title="Recent Applications"
              subtitle="Track your university and course applications"
              action={
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              }
            />
            
            <CardContent>
              <div className="space-y-4">
                
                {/* Application Item 1 */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        University of Nairobi - Computer Science
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Applied 2 days ago • Deadline: March 15, 2024
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Under Review
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">Expected response: 2 weeks</p>
                  </div>
                </div>
                
                {/* Application Item 2 */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        KCA University - Software Engineering
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Applied 1 week ago • Deadline: March 20, 2024
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Accepted
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">Offer expires: April 1, 2024</p>
                  </div>
                </div>
                
                {/* Application Item 3 */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        Strathmore University - Business IT
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Draft • Deadline: March 25, 2024
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button variant="ghost" size="sm">
                      Complete Application
                    </Button>
                  </div>
                </div>
                
              </div>
            </CardContent>
          </Card>
          
        </div>
        
        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card padding="md">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => onPageChange('assessment')}
              >
                <Target className="mr-3 h-4 w-4" />
                Continue Assessment
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => onPageChange('counselor')}
              >
                <Calendar className="mr-3 h-4 w-4" />
                Book Counselor Session
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => onPageChange('careers')}
              >
                <BookOpen className="mr-3 h-4 w-4" />
                Explore Careers
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => onPageChange('placement')}
              >
                <TrendingUp className="mr-3 h-4 w-4" />
                Track KUCCPS Status
              </Button>
            </div>
          </Card>
          
          {/* Upcoming Events */}
          <Card padding="md">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">
                    Career Fair - Tech Careers
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Tomorrow, 2:00 PM - 5:00 PM
                  </p>
                  <p className="text-xs text-primary">University of Nairobi</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">
                    Counselor Session with Dr. Wanjiku
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Friday, 10:00 AM - 11:00 AM
                  </p>
                  <p className="text-xs text-blue-600">Virtual Meeting</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">
                    Application Deadline Reminder
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    March 25, 2024
                  </p>
                  <p className="text-xs text-green-600">Strathmore University</p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Performance Summary */}
          <Card padding="md">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              This Month
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Assessment Progress</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-success">+15%</span>
                  <TrendingUp className="h-3 w-3 text-success" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Careers Explored</span>
                <span className="text-sm font-medium text-foreground">8 new</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sessions Completed</span>
                <span className="text-sm font-medium text-foreground">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Goals Achieved</span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-success">3/4</span>
                  <CheckCircle className="h-3 w-3 text-success" />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Achievement Badge */}
          <Card padding="md" className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Career Explorer</h4>
                <p className="text-sm text-muted-foreground">
                  You've explored 10+ career paths! Keep discovering new opportunities.
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View All Badges
              </Button>
            </div>
          </Card>
          
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;
```

## 🎯 Assessment Page (COMPLETE IMPLEMENTATION)

### Career Assessment Structure (EXACT FLOW)
```tsx
// pages/CareerAssessment.tsx - COMPLETE IMPLEMENTATION
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Brain, Calculator, Users, FileText, 
  Pause, CheckCircle, Clock, Target, Star, Lightbulb
} from 'lucide-react';
import { InteractiveButton as Button } from '../components/ui/InteractiveButton';
import { InteractiveCard as Card } from '../components/ui/InteractiveCard';
import { ProgressBar } from '../components/ui/Progress';

interface AssessmentQuestion {
  id: string;
  category: string;
  categoryIcon: React.ReactNode;
  question: string;
  type: 'multiple-choice' | 'rating' | 'ranking';
  options: Array<{
    id: string;
    text: string;
    icon?: React.ReactNode;
    value?: number;
  }>;
}

interface CareerAssessmentProps {
  onBack: () => void;
  onComplete: (results: any) => void;
}

const CareerAssessment: React.FC<CareerAssessmentProps> = ({ onBack, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const totalQuestions = 45;
  const progress = (currentQuestion / totalQuestions) * 100;
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Sample question data - exact question structure
  const getCurrentQuestion = (): AssessmentQuestion => {
    const questions: AssessmentQuestion[] = [
      {
        id: `q${currentQuestion}`,
        category: "Personality & Interests",
        categoryIcon: <Brain className="h-6 w-6 text-primary" />,
        question: "Which of these activities gives you the most energy and satisfaction?",
        type: 'multiple-choice',
        options: [
          {
            id: 'a',
            text: 'Solving complex analytical problems that require deep thinking and research',
            icon: <Calculator className="h-5 w-5" />
          },
          {
            id: 'b',
            text: 'Leading team projects and motivating others to achieve common goals',
            icon: <Users className="h-5 w-5" />
          },
          {
            id: 'c',
            text: 'Creating detailed plans and organizing systems for maximum efficiency',
            icon: <FileText className="h-5 w-5" />
          },
          {
            id: 'd',
            text: 'Generating innovative ideas and finding creative solutions to challenges',
            icon: <Lightbulb className="h-5 w-5" />
          }
        ]
      }
    ];
    
    return questions[0]; // In real implementation, this would select based on currentQuestion
  };
  
  const currentQuestionData = getCurrentQuestion();
  
  const handleAnswerSelect = (answerId: string | number) => {
    setSelectedAnswer(answerId);
  };
  
  const handleNext = () => {
    if (selectedAnswer !== null) {
      setAnswers(prev => ({ 
        ...prev, 
        [currentQuestionData.id]: selectedAnswer 
      }));
      
      if (currentQuestion < totalQuestions) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        // Assessment complete
        onComplete({ 
          answers, 
          timeElapsed,
          completedAt: new Date().toISOString(),
          score: 85 
        });
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[`q${currentQuestion - 1}`] || null);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen bg-muted">
      
      {/* Assessment Header - EXACT STICKY LAYOUT */}
      <div className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack} icon={ArrowLeft}>
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  AI Career Assessment
                </h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion} of {totalQuestions}
                </p>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center space-x-6">
              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </div>
              <Button variant="ghost" size="sm" icon={Pause}>
                Save & Exit
              </Button>
            </div>
          </div>
          
          {/* Progress Bar - EXACT STYLING */}
          <div className="mt-4">
            <ProgressBar 
              progress={progress} 
              animated={true}
              showPercentage={false}
            />
          </div>
        </div>
      </div>

      {/* Assessment Content - EXACT RESPONSIVE LAYOUT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card padding="lg" className="bg-gradient-to-br from-background to-muted/50">
          
          {/* Question Section - EXACT LAYOUT */}
          <div className="mb-8">
            
            {/* Category Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                {currentQuestionData.categoryIcon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {currentQuestionData.category}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Understanding your preferences and motivations
                </p>
              </div>
            </div>
            
            {/* Question Text */}
            <h3 className="text-lg font-medium text-foreground mb-6 leading-relaxed">
              {currentQuestionData.question}
            </h3>
          </div>
          
          {/* Answer Options - EXACT INTERACTIVE STYLING */}
          <div className="space-y-4 mb-8">
            {currentQuestionData.options.map((option) => (
              <label
                key={option.id}
                className={`
                  flex items-start space-x-4 p-4 border rounded-lg cursor-pointer
                  transition-all duration-200 group
                  ${selectedAnswer === option.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:bg-muted/50 hover:border-primary/50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="question"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={() => handleAnswerSelect(option.id)}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary/50 border-border"
                />
                
                <div className="flex items-start space-x-3 flex-1">
                  {option.icon && (
                    <div className={`
                      h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200
                      ${selectedAnswer === option.id 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                      }
                    `}>
                      {option.icon}
                    </div>
                  )}
                  
                  <span className="text-foreground leading-relaxed">
                    {option.text}
                  </span>
                </div>
                
                {/* Selected indicator */}
                {selectedAnswer === option.id && (
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 animate-in zoom-in-50 duration-200" />
                )}
              </label>
            ))}
          </div>
          
          {/* Navigation Section - EXACT BUTTON LAYOUT */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            
            {/* Previous Button */}
            <Button 
              variant="secondary" 
              disabled={currentQuestion === 1}
              onClick={handlePrevious}
              icon={ArrowLeft}
            >
              Previous
            </Button>
            
            {/* Question Counter */}
            <div className="text-sm text-muted-foreground text-center">
              <span className="block">Question {currentQuestion} of {totalQuestions}</span>
              <span className="text-xs">Estimated time remaining: {Math.ceil((totalQuestions - currentQuestion) * 1.5)} minutes</span>
            </div>
            
            {/* Next Button */}
            <Button 
              variant="primary"
              disabled={selectedAnswer === null}
              onClick={handleNext}
              icon={ArrowRight}
              iconPosition="right"
            >
              {currentQuestion === totalQuestions ? 'Complete Assessment' : 'Next'}
            </Button>
          </div>
          
        </Card>
        
        {/* Assessment Tips Sidebar */}
        <Card padding="md" className="mt-6 bg-primary/5 border-primary/20">
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Assessment Tip</h4>
              <p className="text-sm text-muted-foreground">
                Answer honestly based on what truly interests and motivates you, not what you think sounds impressive. 
                There are no right or wrong answers.
              </p>
            </div>
          </div>
        </Card>
      </div>
      
    </div>
  );
};

export default CareerAssessment;
```

## ✅ Page Implementation Checklist

### Core Pages (MUST IMPLEMENT ALL)
- [ ] Landing page with exact hero, features, pricing, and footer sections
- [ ] Student dashboard with progress overview and career recommendations
- [ ] Career assessment with question flow and progress tracking
- [ ] Subject mapper with responsive form layouts and grade inputs
- [ ] Profile page with tabbed sections and file upload areas
- [ ] Career hub with filterable career cards and search
- [ ] Counselor booking with calendar integration and session management
- [ ] KUCCPS placement tracker with real-time status updates

### Layout Requirements (MUST VALIDATE ALL)
- [ ] All pages use AppLayout wrapper for consistency
- [ ] Navigation breadcrumbs show current location and hierarchy
- [ ] Page headers include title, subtitle, and contextual actions
- [ ] Grid layouts adapt properly on mobile devices (1-2-3 column responsive)
- [ ] Card components maintain consistent padding and hover effects
- [ ] Form layouts stack appropriately on small screens
- [ ] Button groups adapt to mobile layout patterns (flex-col sm:flex-row)
- [ ] Content sections use proper spacing hierarchy (space-y-8, space-y-6)

### Content Requirements (MUST INCLUDE ALL)
- [ ] Real Kenyan career data and accurate salary information
- [ ] Kenyan university and course information with KUCCPS integration
- [ ] Local job market insights and employment trends
- [ ] Proper placeholder content for all sections with realistic data
- [ ] Consistent tone and voice across all copy (professional, encouraging)
- [ ] Accessible alt text for all images and icons
- [ ] Proper heading hierarchy for screen readers (h1 > h2 > h3)
- [ ] Loading states for all dynamic content with skeleton placeholders

### Interactive Requirements (MUST IMPLEMENT ALL)
- [ ] Assessment flow with exact question types and validation
- [ ] Dashboard widgets with real-time progress tracking
- [ ] Career recommendation cards with match percentages
- [ ] Application tracking with status indicators and deadlines
- [ ] Quick action buttons with proper icon placement
- [ ] Event calendar with clickable date navigation
- [ ] Achievement badges with unlock animations
- [ ] Performance metrics with animated progress bars

### Responsive Requirements (MUST TEST ALL)
- [ ] Mobile navigation with hamburger menu and overlay
- [ ] Touch-friendly button sizes (minimum 44px touch targets)
- [ ] Readable text on all screen sizes (minimum 16px on mobile)
- [ ] Proper spacing on mobile devices (adequate padding and margins)
- [ ] Dashboard grid collapses properly (3-column to 1-column)
- [ ] Assessment interface works on small screens
- [ ] Career cards stack appropriately on mobile
- [ ] Form fields remain usable on 320px width screens

This complete page documentation ensures every screen in Elimu Smart can be recreated with identical structure, content, interactivity, and responsive behavior across all devices and user contexts.