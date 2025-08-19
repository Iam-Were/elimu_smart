import React, { type ReactNode } from 'react';
import {
  Container,
  Paper,
  Stack,
  Title,
  Text,
  Group,
  Switch,
} from '@mantine/core';
import { useThemeContext } from '../common/ThemeProvider';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const { isDark, toggleDarkMode } = useThemeContext();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      className="theme-transition"
    >
      <Container size="xs" w="100%">
        <Stack gap="lg" align="center">
          {/* Header */}
          <Stack gap="sm" align="center">
            <Title
              order={1}
              size="2rem"
              fw={600}
              style={{ color: 'var(--primary)' }}
            >
              Elimu Smart
            </Title>
            <Text c="dimmed" ta="center" size="sm">
              Career Guidance Platform
            </Text>
          </Stack>

          {/* Auth Form */}
          <Paper
            shadow="lg"
            p="xl"
            radius="lg"
            w="100%"
            maw={400}
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
            }}
            className="theme-transition"
          >
            <Stack gap="md">
              <Stack gap="xs" align="center">
                <Title order={2} size="1.5rem" ta="center">
                  {title}
                </Title>
                {subtitle && (
                  <Text c="dimmed" ta="center" size="sm">
                    {subtitle}
                  </Text>
                )}
              </Stack>

              {children}
            </Stack>
          </Paper>

          {/* Dark Mode Toggle */}
          <Group gap="sm">
            <Text size="sm" c="dimmed">
              Dark Mode
            </Text>
            <Switch
              checked={isDark}
              onChange={toggleDarkMode}
              size="sm"
            />
          </Group>
        </Stack>
      </Container>
    </div>
  );
};