import React from 'react';
import {
  Target,
  BookOpen,
  ArrowRight,
  Star,
  GraduationCap,
  MessageCircle,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { ThemeToggle } from '../components/common/ThemeToggle';
import logoImage from '@/assets/logo.png';

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img
                src={logoImage}
                alt="Elimu Smart Logo"
                className="h-12 w-12 object-contain"
              />
              <span className="font-display font-bold text-2xl text-gray-900 dark:text-gray-100 tracking-tight">
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
            <div className="flex items-center space-x-2 md:space-x-3">
              <ThemeToggle size="md" />
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium text-sm md:text-base whitespace-nowrap px-3 md:px-4"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/register')}
                className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform animate-pulse group text-sm md:text-base whitespace-nowrap"
              >
                Get Started
                <ArrowRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
          </div>
        </div>
      </header>

      {/* Hero Section - Two Column Card Layout */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-amber-50/20 to-white dark:from-orange-950/30 dark:via-transparent dark:to-transparent">
        {/* Atmospheric background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-orange-300/15 blur-3xl" />
          <div className="absolute top-40 -left-24 w-72 h-72 rounded-full bg-amber-300/10 blur-2xl" />
          <div className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full bg-orange-200/10 blur-xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 z-10">
          
          {/* Hero Card */}
          <Card className="bg-white shadow-xl border border-gray-200">
            <CardContent className="p-8 lg:p-12">
              
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                
                {/* Left Column - Content */}
                <div>
                  {/* Kenya badge */}
                  <div className="inline-flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-full px-4 py-1.5 mb-4 font-medium">
                    <span className="text-base">🇰🇪</span>
                    <span>Kenya's #1 Career Guidance Platform</span>
                  </div>

                  {/* Simple Badge */}
                  <Badge variant="secondary" className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <span>🎯</span>
                    <span>Find Your Perfect Career</span>
                  </Badge>

                  {/* Clear, Direct Headline */}
                  <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight mb-6 text-gray-900 dark:text-gray-50">
                    Discover Your Ideal Career Path
                    <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                      In Just 15 Minutes
                    </span>
                  </h1>
                  
                  {/* Simple Value Proposition */}
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    Take our AI-powered assessment and get personalized career recommendations 
                    based on your interests, skills, and personality.
                  </p>
                  
                  {/* Single Clear CTA */}
                  <div className="mb-8">
                    <Button 
                      size="lg"
                      onClick={() => navigate('/register')}
                      className="inline-flex items-center px-8 py-4 rounded-xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                    >
                      Start Free Assessment
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                  
                  {/* Simple Trust Indicators */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="text-orange-600 mr-2">✓</span>
                      <span>100% Free</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-orange-600 mr-2">✓</span>
                      <span>15 Minutes</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-orange-600 mr-2">✓</span>
                      <span>25,000+ Students Helped</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Visual Elements */}
                <div className="lg:text-center">
                  
                  {/* Main Visual Card */}
                  <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Target className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Career Assessment</h3>
                        <p className="text-orange-100 mb-4">Discover careers that match your unique personality and interests</p>
                        
                        {/* Mini Feature Cards */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                          <div className="bg-white/10 rounded-lg p-3">
                            <BookOpen className="h-5 w-5 text-white mx-auto mb-1" />
                            <div className="text-xs font-medium">45 Questions</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-3">
                            <Star className="h-5 w-5 text-white mx-auto mb-1" />
                            <div className="text-xs font-medium">AI Analysis</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Supporting Stats Cards */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Card className="bg-white border border-orange-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">94%</div>
                        <div className="text-xs text-gray-600">Success Rate</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border border-orange-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">750+</div>
                        <div className="text-xs text-gray-600">Career Paths</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                </div>
                
              </div>
              
            </CardContent>
          </Card>
          
        </div>
      </section>

      {/* Simple Social Proof Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Simple Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

            <div>
              <div className="font-display text-4xl font-bold text-gray-900 dark:text-gray-50">25,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Students Helped</div>
            </div>

            <div>
              <div className="font-display text-4xl font-bold text-gray-900 dark:text-gray-50">94%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Success Rate</div>
            </div>

            <div>
              <div className="font-display text-4xl font-bold text-gray-900 dark:text-gray-50">45+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">University Partners</div>
            </div>

            <div>
              <div className="font-display text-4xl font-bold text-gray-900 dark:text-gray-50">4.9/5</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Student Rating</div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Benefits Section - Simple and Direct */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Simple Header */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              How Elimu Smart Helps You
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three simple ways we guide you to your perfect career path.
            </p>
          </div>
          
          {/* 3 Core Benefits - Clean Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Benefit 1 - Discover */}
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow duration-300 text-center p-8">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">Discover Your Strengths</h3>
                <p className="text-gray-600 leading-relaxed">
                  Take our 15-minute assessment to identify your natural talents, 
                  interests, and personality traits.
                </p>
              </CardContent>
            </Card>
            
            {/* Benefit 2 - Match */}
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow duration-300 text-center p-8">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">Get Matched</h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive personalized career recommendations that align with 
                  your KCSE subjects and university options.
                </p>
              </CardContent>
            </Card>
            
            {/* Benefit 3 - Plan */}
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow duration-300 text-center p-8">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">Plan Your Path</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get a clear action plan with university requirements, 
                  scholarship opportunities, and next steps.
                </p>
              </CardContent>
            </Card>
            
          </div>
        </div>
      </section>

      {/* How It Works Section - Reference Design Individual Cards */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v15l-6 3-6-3z" />
              </svg>
              <span>Simple Process</span>
            </Badge>
            <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-6">
              Your Journey to
              <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Career Clarity
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto">
              Follow our proven 4-step process to discover your ideal career path 
              and create an actionable plan for success.
            </p>
          </div>
          
          {/* Process Steps - Individual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Step 1 Card */}
            <div className="relative">
              <Card className="bg-white shadow-lg border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-gray-50 mb-3">Sign Up & Assess</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Create your profile and complete our comprehensive AI-powered career assessment in just 15 minutes.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                      ⏱️ 15 minutes
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              {/* Connector Line */}
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-orange-200"></div>
            </div>
            
            {/* Step 2 Card */}
            <div className="relative">
              <Card className="bg-white shadow-lg border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-gray-50 mb-3">Get Matched</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Receive personalized career recommendations based on your assessment results and academic performance.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      🎯 Instant Results
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-orange-200"></div>
            </div>
            
            {/* Step 3 Card */}
            <div className="relative">
              <Card className="bg-white shadow-lg border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-gray-50 mb-3">Explore & Plan</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Dive deep into career options and create your personalized education and university application plan.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      📋 Custom Plan
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-orange-200"></div>
            </div>
            
            {/* Step 4 Card */}
            <div>
              <Card className="bg-white shadow-lg border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-gray-50 mb-3">Take Action</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Execute your plan with ongoing support from expert counselors and track your progress toward your goals.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                      🚀 Get Support
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="inline-flex items-center px-8 py-4 rounded-xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              Start Step 1 Now - It's Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Reference Design Card Container */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Card Container for Entire Section */}
          <Card className="bg-white shadow-lg border-gray-200">
            <CardContent className="p-12">
              
              {/* Section Header */}
              <div className="text-center mb-16">
                <Badge variant="secondary" className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Star className="h-4 w-4" />
                  <span>Student Success</span>
                </Badge>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-6">
                  What Our Students Say
                  <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    About Their Journey
                  </span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Hear inspiring stories from students who discovered their perfect career path 
                  and achieved their university dreams with Elimu Smart.
                </p>
              </div>
              
              {/* Testimonials Grid - Clean White Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-white border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-orange-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-gray-600 mb-4 italic leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-500 text-white font-bold">
                            {testimonial.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-display font-bold text-gray-900 dark:text-gray-50">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section - Reference Design with Subtle Gradients */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50/30 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/20 to-gray-50"></div>
        
        {/* Very Subtle Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Card Container for CTA Content */}
          <Card className="bg-white shadow-xl border-gray-200">
            <CardContent className="p-12 text-center">
              
              <Badge variant="secondary" className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span>🚀</span>
                <span>Ready to Start?</span>
              </Badge>
              
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-6">
                Ready to Discover
                <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Your Future?
                </span>
              </h2>
              
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students who have found their perfect career path with Elimu Smart.
                Start your journey to success today with our free assessment.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  🎯 Start Your Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold text-lg hover:bg-gray-50 hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Try Demo First
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">100% Free Assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">No Credit Card Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Instant Results</span>
                </div>
              </div>
              
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer - Uncarded with Inner Cards */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Footer Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8">

                {/* Company Info - Card on mobile */}
                <div className="bg-white md:bg-transparent p-6 md:p-0 rounded-lg md:rounded-none shadow-md md:shadow-none border md:border-0 border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-display font-bold text-xl text-gray-900 dark:text-gray-50">Elimu Smart</span>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Empowering Kenyan students with intelligent career guidance and university pathway discovery.
                  </p>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Secure & Private</span>
                  </div>
                </div>

                {/* Quick Links - Card on mobile */}
                <div className="bg-white md:bg-transparent p-6 md:p-0 rounded-lg md:rounded-none shadow-md md:shadow-none border md:border-0 border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li><a href="#features" className="hover:text-orange-600 transition-colors duration-200 flex items-center">
                      <ArrowRight className="h-3 w-3 mr-2" />
                      Features
                    </a></li>
                    <li><a href="#testimonials" className="hover:text-orange-600 transition-colors duration-200 flex items-center">
                      <ArrowRight className="h-3 w-3 mr-2" />
                      Success Stories
                    </a></li>
                    <li><a href="#" className="hover:text-orange-600 transition-colors duration-200 flex items-center">
                      <ArrowRight className="h-3 w-3 mr-2" />
                      About Us
                    </a></li>
                    <li><a href="#" className="hover:text-orange-600 transition-colors duration-200 flex items-center">
                      <ArrowRight className="h-3 w-3 mr-2" />
                      Contact
                    </a></li>
                  </ul>
                </div>

                {/* Support - Card on mobile */}
                <div className="bg-white md:bg-transparent p-6 md:p-0 rounded-lg md:rounded-none shadow-md md:shadow-none border md:border-0 border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li><a href="#" className="hover:text-orange-600 transition-colors duration-200 flex items-center">
                      <MessageCircle className="h-3 w-3 mr-2" />
                      Help Center
                    </a></li>
                    <li><a href="#" className="hover:text-orange-600 transition-colors duration-200 flex items-center">
                      <Shield className="h-3 w-3 mr-2" />
                      Privacy Policy
                    </a></li>
                    <li><a href="#" className="hover:text-orange-600 transition-colors duration-200 flex items-center">
                      <BookOpen className="h-3 w-3 mr-2" />
                      Terms of Service
                    </a></li>
                    <li><a href="#" className="hover:text-orange-600 transition-colors duration-200 flex items-center">
                      <Target className="h-3 w-3 mr-2" />
                      FAQs
                    </a></li>
                  </ul>
                </div>
                
                {/* Contact */}
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Get in Touch</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <MessageCircle className="h-4 w-4 text-orange-600 mr-3 flex-shrink-0" />
                      <span className="text-sm">support@elimusmart.co.ke</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-orange-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="text-sm">+254 700 123 456</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-orange-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Nairobi, Kenya</span>
                    </li>
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                      🔥 24/7 Student Support
                    </Badge>
                  </div>
                </div>
                
              </div>
              
              {/* Footer Bottom */}
              <div className="border-t border-gray-200 pt-8 text-center">
                <p className="text-gray-600">&copy; 2024 Elimu Smart. All rights reserved. Empowering Kenyan students to achieve their dreams.</p>
              </div>
              
        </div>
      </footer>
      
    </div>
  );
};

export default LandingPage;