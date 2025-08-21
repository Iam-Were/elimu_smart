import React, { type ReactNode } from 'react';
import { Container } from '@mantine/core';

interface LinkedInLayoutProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
}

export const LinkedInLayout: React.FC<LinkedInLayoutProps> = ({ 
  children, 
  size = 1200,
  className = '' 
}) => {
  return (
    <Container
      size={size}
      px="xl"
      className={`linkedin-layout ${className}`}
      style={{
        width: '100%',
        maxWidth: typeof size === 'number' ? `${size}px` : undefined,
        margin: '0 auto',
        padding: '0 24px',
      }}
      styles={{
        root: {
          '@media (max-width: 768px)': {
            padding: '0 16px',
          },
          '@media (max-width: 480px)': {
            padding: '0 12px',
          },
        },
      }}
    >
      {children}
    </Container>
  );
};