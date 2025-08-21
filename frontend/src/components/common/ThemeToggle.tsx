import React from 'react';
import { ActionIcon } from '@mantine/core';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useThemeContext } from '../../hooks/useThemeContext';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'lg', 
  className = '' 
}) => {
  const { isDark, toggleDarkMode } = useThemeContext();

  return (
    <ActionIcon
      variant="subtle"
      size={size}
      onClick={toggleDarkMode}
      className={`theme-toggle ${className}`}
      style={{
        borderRadius: '8px',
        transition: 'background-color 0.2s ease',
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <SunIcon width={20} height={20} />
      ) : (
        <MoonIcon width={20} height={20} />
      )}
    </ActionIcon>
  );
};