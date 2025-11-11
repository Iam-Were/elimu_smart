import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sprint18Navigation } from '../navigation/Sprint18Navigation';
import { MobileHeader } from '../navigation/MobileHeader';
import { PreFooterCTA } from './PreFooterCTA';
import { ModernFooter } from './ModernFooter';
import { MobileBottomNavOptimized } from '../navigation/MobileBottomNavOptimized';
import { PersistentSearchHeader } from '../common/PersistentSearchHeader';
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

  // Check if current page is landing page
  const isLandingPage = location.pathname === '/';

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Sprint 18 Navigation */}
      <Sprint18Navigation />

      {/* Persistent Search Header - Hide on messaging/inbox pages */}
      {!location.pathname.startsWith('/inbox') &&
       !location.pathname.startsWith('/messages') && <PersistentSearchHeader />}

      {/* Main Content Area */}
      <main id="main-content" className="relative pt-16 md:pt-0" role="main" aria-label="Main content">
        {/* Content Container */}
        <div className="container max-w-5xl mx-auto pb-20 md:pb-0">
          {children || <Outlet />}
        </div>
      </main>


      {/* Pre-Footer CTA Section - Only on landing page */}
      {isLandingPage && <PreFooterCTA />}

      {/* Modern Minimalist Footer - Only on landing page */}
      {isLandingPage && <ModernFooter />}

      {/* Mobile Bottom Navigation */}
      <MobileHeader />
      <MobileBottomNavOptimized />
    </div>
  );
};
