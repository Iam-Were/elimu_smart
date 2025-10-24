import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sprint18Navigation } from '../navigation/Sprint18Navigation';
import { MobileHeader } from '../navigation/MobileHeader';
import { PreFooterCTA } from './PreFooterCTA';
import { ModernFooter } from './ModernFooter';
import { MobileBottomNavOptimized } from '../navigation/MobileBottomNavOptimized';
import { PersistentSearchHeader } from '../common/PersistentSearchHeader';
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
      
      
      {/* Persistent Search Header */}
      <PersistentSearchHeader />
      {/* Main Content Area */}
      <main id="main-content" className="relative pt-16 md:pt-0" role="main" aria-label="Main content">
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


      {/* Pre-Footer CTA Section - Only on non-dashboard pages */}
      {location.pathname !== '/dashboard' && <PreFooterCTA />}

      {/* Modern Minimalist Footer */}
      <ModernFooter />

      {/* Mobile Bottom Navigation */}
      <MobileHeader />
      <MobileBottomNavOptimized />
    </div>
  );
};
