import React, { type ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '../../hooks/useTheme';
import { ThemeContext } from '../../contexts/ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // `useTheme` is the single theme controller — it owns the `.dark` class and
  // the role `.theme-*` class. Role + dark-mode colors come entirely from the
  // CSS cascade in globals.css. We deliberately do NOT set inline `--primary`
  // here: inline styles outrank `.dark`, which was the recurring dark-mode bug.
  const themeHook = useTheme();

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