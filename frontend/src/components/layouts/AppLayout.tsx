import React, { type ReactNode, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';
import { IntelligentHeader } from '../common/IntelligentHeader';
import { LinkedInLayout } from './LinkedInLayout';
import type { ThemeRole } from '../../types';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { currentTheme, setTheme } = useThemeContext();

  // Automatically update theme when user role changes
  useEffect(() => {
    if (user?.role) {
      const roleTheme: ThemeRole =
        user.role === 'admin' || user.role === 'super_admin'
          ? 'admin'
          : user.role === 'counselor' || user.role === 'career_counselor'
            ? 'counselor'
            : 'student';

      if (currentTheme !== roleTheme) {
        setTheme(roleTheme);
      }
    }
  }, [user?.role, currentTheme, setTheme]);





  return (
    <div className="linkedin-app-layout" style={{ minHeight: '100vh', backgroundColor: 'var(--muted)' }}>
      {/* LinkedIn-style Header */}
      <IntelligentHeader
        notificationCount={3}
        messageCount={1}
        showNavigation={true}
      />

      {/* Main Content Area */}
      <main 
        className="main-content"
        style={{
          paddingTop: '24px',
          paddingBottom: '40px',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: 'var(--muted)',
        }}
      >
        <LinkedInLayout>
          {children}
        </LinkedInLayout>
      </main>
    </div>
  );
};
