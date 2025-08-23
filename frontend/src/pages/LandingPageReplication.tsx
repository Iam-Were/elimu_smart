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

  const features = [
    {
      icon: Target,
      title: 'Personalized Career Assessment',
      description: 'Discover your strengths and interests with our comprehensive assessment tool designed for Kenyan students.',
      color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600'
    },
    {
      icon: BookOpen,
      title: 'Subject-to-Career Mapping',
      description: 'See how your current subjects align with various career paths and university requirements.',
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'Expert Counselor Support',
      description: 'Connect with certified career counselors who understand the Kenyan education system.',
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600'
    },
    {
      icon: BarChart3,
      title: 'Career Market Insights',
      description: 'Get real-time data on job market trends and salary expectations in Kenya.',
      color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Students Guided' },
    { number: '500+', label: 'Career Paths' },
    { number: '50+', label: 'University Partners' },
    { number: '98%', label: 'Success Rate' }
  ];

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
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
              </button>
            </div>
            
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Discover Your Perfect
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  {' '}Career Path
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Empowering Kenyan students with AI-powered career guidance, personalized assessments, 
                and expert counselor support to make informed educational and career choices.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium text-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button 
                  onClick={() => navigate('/demo')}
                  className="w-full sm:w-auto inline-flex items-center px-8 py-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Everything You Need for Career Success
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and support you need 
              to make informed career decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Simple Steps to Your Future
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started with your career journey in just three easy steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Take Assessment
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Complete our comprehensive career assessment to understand your interests and strengths.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Explore Options
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Discover personalized career recommendations based on your assessment results.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Get Guidance
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with expert counselors for personalized guidance and support.
              </p>
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