import React, { useMemo, type ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { getMantineProviderProps } from '../../theme/mantineTheme';
import { useTheme } from '../../hooks/useTheme';
import { ThemeContext } from '../../contexts/ThemeContext';


interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeHook = useTheme();

  const mantineTheme = useMemo(() => {
    return getMantineProviderProps(themeHook.currentTheme).theme;
  }, [themeHook.currentTheme]);

  const colorScheme = themeHook.isDark ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={themeHook}>
      <MantineProvider 
        theme={mantineTheme}
        defaultColorScheme={colorScheme}
        forceColorScheme={colorScheme}
        key={`${themeHook.currentTheme}-${themeHook.isDark}`}
      >
        <Notifications position="top-right" />
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};