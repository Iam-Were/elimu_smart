import React from 'react';
import Button from '@/components/ui/button';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useThemeContext } from '../../hooks/useThemeContext';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9', 
  lg: 'h-10 w-10'
};

const iconSizeMap = {
  sm: 16,
  md: 18,
  lg: 20
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'lg', 
  className = '' 
}) => {
  const { isDark, toggleDarkMode } = useThemeContext();

  return (
    <Button
      variant="ghost"
      onClick={toggleDarkMode}
      className={`theme-toggle rounded-lg transition-colors hover:bg-muted ${sizeMap[size]} ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <SunIcon width={iconSizeMap[size]} height={iconSizeMap[size]} />
      ) : (
        <MoonIcon width={iconSizeMap[size]} height={iconSizeMap[size]} />
      )}
    </Button>
  );
};