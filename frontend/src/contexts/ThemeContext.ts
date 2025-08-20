import { createContext } from 'react';
import type { ThemeRole } from '../types';

interface ThemeContextType {
  currentTheme: ThemeRole;
  setTheme: (theme: ThemeRole) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
