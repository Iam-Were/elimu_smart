import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sprint18Navigation } from '../navigation/Sprint18Navigation';
import { LinkedInStyleChat } from '../chat/LinkedInStyleChat';
import { MobileBottomNav } from '../navigation/MobileBottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import {
  GraduationCap,
  Target,
  Heart,
  BookOpen,
  Award,
  Users,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  ClipboardCheck,
  MessageCircle,
  UserCircle,
  Library,
  Network,
  HelpCircle,
  Shield,
  FileText,
  Info,
  Briefcase,
  Newspaper,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeContext } from '../../hooks/useThemeContext';
import { getRoleColor } from '../../constants/theme';

interface Sprint18LayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export const Sprint18Layout: React.FC<Sprint18LayoutProps> = ({
  children,
  className,
}) => {
  const location = useLocation();
  const { currentTheme } = useThemeContext();

  const getThemeColor = () => {
    return getRoleColor(currentTheme);
  };

  // Get page title based on current route
  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith('/assessment')) {
      return 'Assessment Center';
    } else if (pathname.startsWith('/guidance')) {
      return 'Guidance Center';
    } else if (pathname.startsWith('/profile')) {
      return 'Your Profile';
    } else if (pathname === '/dashboard' || pathname === '/') {
      return 'Dashboard';
    }
    return 'Elimu Smart';
  };

  const getPageDescription = (pathname: string) => {
    if (pathname.startsWith('/assessment')) {
      return 'Discover your career path through comprehensive assessment tools';
    } else if (pathname.startsWith('/guidance')) {
      return 'Manage your bookings and access personalized guidance resources';
    } else if (pathname.startsWith('/profile')) {
      return 'Manage your academic journey and professional development';
    } else if (pathname === '/dashboard' || pathname === '/') {
      return 'Your personalized career guidance center';
    }
    return 'AI-driven career guidance platform';
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Sprint 18 Navigation */}
      <Sprint18Navigation />
      
      {/* Main Content Area */}
      <main className="relative">
        {/* Page Header - Only show for non-dashboard pages - Theme-colored title */}
        {location.pathname !== '/' && location.pathname !== '/dashboard' && (
          <div className="border-b border-border/40 bg-muted/20">
            <div className="container max-w-5xl mx-auto py-8">
              <div className="space-y-2">
                <h1
                  className="text-3xl font-bold tracking-tight"
                  style={{
                    background: `linear-gradient(to right, ${getThemeColor()}, ${getThemeColor()}dd)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {getPageTitle(location.pathname)}
                </h1>
                <p className="text-muted-foreground">
                  {getPageDescription(location.pathname)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className="container max-w-5xl mx-auto pb-20 md:pb-0">
          {children || <Outlet />}
        </div>
      </main>

      {/* World-Class Footer - High Contrast Card-Based Design */}
      <footer className="bg-slate-900 dark:bg-slate-950 mt-20 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

        <div className="container max-w-7xl mx-auto py-16 px-4 relative z-10">
          {/* Top Section - Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Start Your Journey Card */}
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Start Your Journey</h3>
                <p className="text-orange-50 text-sm leading-relaxed">
                  Discover your perfect career path with AI-driven assessments
                </p>
                <Button
                  asChild
                  className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold"
                >
                  <Link to="/assessment/career">
                    Take Free Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Get Expert Guidance Card */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Expert Guidance</h3>
                <p className="text-purple-50 text-sm leading-relaxed">
                  Connect with licensed counselors for personalized support
                </p>
                <Button
                  asChild
                  className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold"
                >
                  <Link to="/guidance/counselor-connect">
                    Find Counselor
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Features Card */}
            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-0 shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto relative">
                  <Sparkles className="w-7 h-7 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white">Go Premium</h3>
                <p className="text-amber-50 text-sm leading-relaxed">
                  Unlock unlimited access to all career tools and resources
                </p>
                <Button
                  asChild
                  className="w-full bg-white text-amber-600 hover:bg-amber-50 font-semibold"
                >
                  <Link to="/subscription">
                    View Plans
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Section - Quick Links with Icon Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {/* Platform Card */}
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-3 text-lg">Platform</h4>
                <div className="space-y-2.5">
                  <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors text-sm justify-center">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link to="/assessment" className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors text-sm justify-center">
                    <ClipboardCheck className="w-4 h-4" />
                    Assessments
                  </Link>
                  <Link to="/guidance" className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors text-sm justify-center">
                    <MessageCircle className="w-4 h-4" />
                    Guidance
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors text-sm justify-center">
                    <UserCircle className="w-4 h-4" />
                    Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Resources Card */}
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-3 text-lg">Resources</h4>
                <div className="space-y-2.5">
                  <Link to="/guidance/resources" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm justify-center">
                    <Library className="w-4 h-4" />
                    Career Guides
                  </Link>
                  <Link to="/guidance/professional-networking" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm justify-center">
                    <Network className="w-4 h-4" />
                    Networking
                  </Link>
                  <Link to="/guidance/community-qa" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm justify-center">
                    <HelpCircle className="w-4 h-4" />
                    Community Q&A
                  </Link>
                  <Link to="/guidance/crisis" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm justify-center">
                    <Shield className="w-4 h-4" />
                    Crisis Support
                  </Link>
                </div>
              </div>
            </div>

            {/* Company Card */}
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-3 text-lg">Company</h4>
                <div className="space-y-2.5">
                  <a href="#about" className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors text-sm justify-center">
                    <Info className="w-4 h-4" />
                    About Us
                  </a>
                  <a href="#blog" className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors text-sm justify-center">
                    <Newspaper className="w-4 h-4" />
                    Blog
                  </a>
                  <a href="#careers" className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors text-sm justify-center">
                    <Briefcase className="w-4 h-4" />
                    Careers
                  </a>
                  <a href="#press" className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors text-sm justify-center">
                    <Building className="w-4 h-4" />
                    Press Kit
                  </a>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-3 text-lg">Support</h4>
                <div className="space-y-2.5">
                  <a href="#help" className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors text-sm justify-center">
                    <HelpCircle className="w-4 h-4" />
                    Help Center
                  </a>
                  <a href="#contact" className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors text-sm justify-center">
                    <Mail className="w-4 h-4" />
                    Contact Us
                  </a>
                  <a href="#privacy" className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors text-sm justify-center">
                    <Shield className="w-4 h-4" />
                    Privacy Policy
                  </a>
                  <a href="#terms" className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors text-sm justify-center">
                    <FileText className="w-4 h-4" />
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mb-12">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Email Us</p>
                      <a href="mailto:support@elimu-smart.co.ke" className="text-white hover:text-orange-400 transition-colors font-medium text-sm">
                        support@elimu-smart.co.ke
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Call Us</p>
                      <a href="tel:+254700000000" className="text-white hover:text-orange-400 transition-colors font-medium text-sm">
                        +254 700 000 000
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Location</p>
                      <p className="text-white font-medium text-sm">Nairobi, Kenya</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section - Centered */}
          <div className="text-center space-y-8">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Elimu Smart</h3>
              </div>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
                Empowering Kenyan students to discover their perfect career path through AI-driven guidance,
                comprehensive assessments, and expert counseling. Your future starts here.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://facebook.com/elimusmart"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5 text-slate-400 hover:text-white" />
              </a>
              <a
                href="https://twitter.com/elimusmart"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-sky-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5 text-slate-400 hover:text-white" />
              </a>
              <a
                href="https://linkedin.com/company/elimusmart"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5 text-slate-400 hover:text-white" />
              </a>
              <a
                href="https://instagram.com/elimusmart"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5 text-slate-400 hover:text-white" />
              </a>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
                2,000+ Students Guided
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
                50+ Licensed Counselors
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1">
                99.7% Success Rate
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-3 py-1">
                KUCCPS Certified
              </Badge>
            </div>

            {/* Copyright */}
            <div className="pt-8 space-y-2">
              <p className="text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} Elimu Smart. All rights reserved.
              </p>
              <p className="text-slate-600 text-xs">
                Built with <Heart className="w-3 h-3 inline text-red-500" /> for students worldwide
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* LinkedIn-Style Chat - Only for student routes */}
      <LinkedInStyleChat />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Sprint18Layout;