import React, { type ReactNode, useEffect, useState } from 'react';
import {
  AppShell,
  Burger,
  Group,
  Title,
  Button,
  Avatar,
  Menu,
  Text,
  Switch,
  Divider,
  Stack,
  NavLink,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../common/ThemeProvider';
import { DemoModeSwitch } from '../common/DemoModeSwitch';
import type { ThemeRole } from '../../types';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentTheme, setTheme, isDark, toggleDarkMode } = useThemeContext();

  // Automatically update theme when user role changes
  useEffect(() => {
    if (user?.role) {
      const roleTheme: ThemeRole = user.role === 'admin' || user.role === 'super_admin' 
        ? 'admin' 
        : user.role === 'counselor' || user.role === 'career_counselor'
        ? 'counselor'
        : 'student';
      
      if (currentTheme !== roleTheme) {
        setTheme(roleTheme);
      }
    }
  }, [user?.role, currentTheme, setTheme]);

  const handleLogout = async () => {
    try {
      await logout();
      notifications.show({
        title: 'Logged out',
        message: 'You have been successfully logged out',
        color: 'blue',
      });
    } catch {
      notifications.show({
        title: 'Logout failed',
        message: 'Failed to log out. Please try again.',
        color: 'red',
      });
    }
  };

  const getThemeColor = (theme: ThemeRole) => {
    switch (theme) {
      case 'admin':
        return '#a855f7';
      case 'counselor':
        return '#eab308';
      default:
        return '#f97316';
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return `${user.firstName} ${user.lastName}`;
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'career_counselor':
        return 'Career Counselor';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      className="theme-transition"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger 
              opened={opened} 
              onClick={toggle} 
              hiddenFrom="sm" 
              size="sm" 
            />
            <Title 
              order={3}
              style={{ color: 'var(--primary)' }}
            >
              Elimu Smart
            </Title>
          </Group>

          <Group>
            <Menu shadow="md" width={280} position="bottom-end">
              <Menu.Target>
                <Button variant="subtle" style={{ padding: '0 8px' }}>
                  <Group gap="sm">
                    <Avatar 
                      size={32} 
                      radius="xl"
                      color={currentTheme}
                      style={{ 
                        backgroundColor: getThemeColor(currentTheme),
                      }}
                    >
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </Avatar>
                    <Stack gap={0} align="flex-start" style={{ minWidth: 0 }}>
                      <Text size="sm" fw={500} truncate>
                        {getUserDisplayName()}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {user?.role && getRoleDisplayName(user.role)}
                      </Text>
                    </Stack>
                  </Group>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Settings</Menu.Label>
                
                <Menu.Item>
                  <Group justify="space-between">
                    <Text size="sm">Dark Mode</Text>
                    <Switch
                      checked={isDark}
                      onChange={toggleDarkMode}
                      size="sm"
                    />
                  </Group>
                </Menu.Item>

                <Divider my="xs" />
                
                <Menu.Label>Account</Menu.Label>
                <Menu.Item 
                  onClick={() => navigate('/profile')}
                  leftSection="👤"
                >
                  Profile Settings
                </Menu.Item>
                <Menu.Item onClick={handleLogout} color="red" leftSection="🚪">
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className="theme-transition">
        <Stack gap="lg" h="100%">
          <Stack gap="sm">
            <Title order={4} c="dimmed">
              Navigation
            </Title>
            
            <Stack gap="xs">
              <NavLink
                href="#"
                label="Dashboard"
                leftSection="📊"
                active={location.pathname === '/dashboard'}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/dashboard');
                }}
                style={{
                  borderRadius: 'var(--radius)',
                  color: location.pathname === '/dashboard' ? 'var(--primary)' : undefined,
                }}
              />

              {user?.role === 'student' && (
                <NavLink
                  href="#"
                  label="Career Assessment"
                  leftSection="🧭"
                  active={location.pathname === '/assessment'}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/assessment');
                  }}
                  style={{
                    borderRadius: 'var(--radius)',
                    color: location.pathname === '/assessment' ? 'var(--primary)' : undefined,
                  }}
                />
              )}
              
              <NavLink
                href="#"
                label="Profile"
                leftSection="👤"
                active={location.pathname === '/profile'}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/profile');
                }}
                style={{
                  borderRadius: 'var(--radius)',
                  color: location.pathname === '/profile' ? 'var(--primary)' : undefined,
                }}
              />

              <NavLink
                href="#"
                label="Settings"
                leftSection="⚙️"
                onClick={(e) => {
                  e.preventDefault();
                  notifications.show({
                    title: 'Coming Soon',
                    message: 'Settings page will be available in upcoming sprints',
                    color: 'blue',
                  });
                }}
                style={{ borderRadius: 'var(--radius)' }}
              />
            </Stack>
          </Stack>

          <div style={{ flex: 1 }} />

          <DemoModeSwitch />
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main className="theme-transition">
        {children}
      </AppShell.Main>
    </AppShell>
  );
};