import React, { type ReactNode, useEffect } from 'react';
import {
  AppShell,
  Burger,
  Title,
  useComputedColorScheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';
import { SmartBreadcrumbs, useBreadcrumbs } from '../common/SmartBreadcrumbs';
import { IntelligentHeader } from './IntelligentHeader';
import { GlobalSearch } from '../common/GlobalSearch';
import type { ThemeRole } from '../../types';

// Import Lucide icons for mobile header
import {
  Search,
} from 'lucide-react';

interface EnhancedAppLayoutProps {
  children: ReactNode;
}

export const EnhancedAppLayout: React.FC<EnhancedAppLayoutProps> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const [searchOpened, { toggle: toggleSearch }] = useDisclosure();
  const { user } = useAuth();
  const { currentTheme, setTheme } = useThemeContext();
  const breadcrumbs = useBreadcrumbs();
  const computedColorScheme = useComputedColorScheme('light');
  
  // Responsive behavior
  const isMobile = useMediaQuery('(max-width: 768px)');

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
    <AppShell
      header={{ height: 70 }}
      padding="md"
      className="theme-transition"
    >
      {/* Enhanced Header for Desktop, Fallback for Mobile */}
      <AppShell.Header>
        {!isMobile ? (
          <IntelligentHeader onSearchOpen={toggleSearch} />
        ) : (
          // Mobile Header Fallback
          <div className="header-mobile" style={{ height: '100%', padding: '0 1rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              height: '100%' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  size="sm"
                  aria-label="Toggle navigation"
                />
                <Title order={3} style={{ color: 'var(--primary)' }}>
                  Elimu Smart
                </Title>
              </div>
              
              {/* Mobile actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={toggleSearch}
                  className="icon-action-professional"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Open search"
                >
                  <Search className="icon-base" />
                </button>
              </div>
            </div>
          </div>
        )}
      </AppShell.Header>

      {/* Smart Breadcrumbs */}
      <SmartBreadcrumbs items={breadcrumbs} />

      {/* Main Content */}
      <AppShell.Main className="theme-transition">
        {children}
      </AppShell.Main>
      
      {/* Enhanced Global Search Modal */}
      {searchOpened && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            paddingTop: isMobile ? '5vh' : '10vh',
            backdropFilter: 'blur(4px)',
          }}
          onClick={toggleSearch}
        >
          <div
            style={{
              width: isMobile ? '95%' : '90%',
              maxWidth: '600px',
              height: 'fit-content',
              background: computedColorScheme === 'dark' 
                ? 'rgba(31, 41, 55, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 107, 53, 0.1)',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlobalSearch 
              className="w-full" 
              onClose={toggleSearch}
              placeholder="Search everything... (⌘K)"
            />
          </div>
        </div>
      )}
    </AppShell>
  );
};