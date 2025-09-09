import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sprint18Navigation } from '../navigation/Sprint18Navigation';
import { cn } from '@/lib/utils';

interface Sprint18LayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export const Sprint18Layout: React.FC<Sprint18LayoutProps> = ({
  children,
  className,
}) => {
  const location = useLocation();

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
        {/* Page Header - Only show for non-dashboard pages */}
        {location.pathname !== '/' && location.pathname !== '/dashboard' && (
          <div className="border-b border-border/40 bg-muted/20">
            <div className="container max-w-5xl mx-auto py-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
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
        <div className="container max-w-5xl mx-auto">
          {children || <Outlet />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 mt-20">
        <div className="container max-w-5xl mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-gradient-primary">Elimu Smart</h3>
              <p className="text-sm text-muted-foreground">
                AI-driven career guidance platform helping students discover their perfect career path.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Assessment</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><a href="/assessment/career" className="hover:text-primary transition-colors">Career Assessment</a></div>
                <div><a href="/assessment/subjects" className="hover:text-primary transition-colors">Subject Mapper</a></div>
                <div><a href="/assessment/career-hub" className="hover:text-primary transition-colors">Career Hub</a></div>
                <div><a href="/assessment/history" className="hover:text-primary transition-colors">Assessment History</a></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Guidance</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><a href="/guidance/find" className="hover:text-primary transition-colors">Find a Coach</a></div>
                <div><a href="/guidance/sessions" className="hover:text-primary transition-colors">My Sessions</a></div>
                <div><a href="/guidance/ask" className="hover:text-primary transition-colors">Ask a Question</a></div>
                <div><a href="/guidance/resources" className="hover:text-primary transition-colors">Resources</a></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><a href="/help" className="hover:text-primary transition-colors">Help Center</a></div>
                <div><a href="/contact" className="hover:text-primary transition-colors">Contact Us</a></div>
                <div><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></div>
                <div><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Elimu Smart. All rights reserved. Built with ❤️ for students worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Sprint18Layout;