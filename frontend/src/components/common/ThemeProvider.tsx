import React, { type ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '../../hooks/useTheme';
import { ThemeContext } from '../../contexts/ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeHook = useTheme();

  // Apply CSS custom properties for role-based theming
  React.useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme-specific CSS variables
    if (themeHook.currentTheme === 'student') {
      root.style.setProperty('--primary', '#f97316'); // Orange-500
      root.style.setProperty('--primary-foreground', '#ffffff');
    } else if (themeHook.currentTheme === 'counselor') {
      root.style.setProperty('--primary', '#eab308'); // Yellow-500
      root.style.setProperty('--primary-foreground', '#ffffff');
    } else if (themeHook.currentTheme === 'admin') {
      root.style.setProperty('--primary', '#8b5cf6'); // Purple-500
      root.style.setProperty('--primary-foreground', '#ffffff');
    }

    // Dark mode support
    if (themeHook.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeHook.currentTheme, themeHook.isDark]);

  return (
    <ThemeContext.Provider value={themeHook}>
      {children}
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        theme={themeHook.isDark ? 'dark' : 'light'}
      />
    </ThemeContext.Provider>
  );
};