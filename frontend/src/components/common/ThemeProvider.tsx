import React, { createContext, useContext, type ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { getMantineProviderProps } from '../../theme/mantineTheme';
import { useTheme } from '../../hooks/useTheme';
import type { ThemeRole } from '../../types';

interface ThemeContextType {
  currentTheme: ThemeRole;
  setTheme: (theme: ThemeRole) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};


interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeHook = useTheme();

  const mantineProps = getMantineProviderProps(themeHook.currentTheme);

  return (
    <ThemeContext.Provider value={themeHook}>
      <MantineProvider 
        theme={mantineProps.theme}
        defaultColorScheme={themeHook.isDark ? 'dark' : 'light'}
        forceColorScheme={themeHook.isDark ? 'dark' : 'light'}
      >
        <Notifications position="top-right" />
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};