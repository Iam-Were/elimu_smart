import React, { type ReactNode } from 'react';
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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../common/ThemeProvider';
import type { ThemeRole } from '../../types';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const { user, logout } = useAuth();
  const { currentTheme, setTheme, isDark, toggleDarkMode } = useThemeContext();

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

  const handleThemeChange = (newTheme: ThemeRole) => {
    setTheme(newTheme);
    notifications.show({
      title: 'Theme changed',
      message: `Switched to ${newTheme} theme`,
      color: 'blue',
    });
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
                <Menu.Label>Theme Settings</Menu.Label>
                
                <Menu.Item
                  color={currentTheme === 'student' ? 'orange' : undefined}
                  onClick={() => handleThemeChange('student')}
                  leftSection={
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: '#f97316',
                      }}
                    />
                  }
                >
                  Student Theme
                </Menu.Item>
                
                <Menu.Item
                  color={currentTheme === 'counselor' ? 'yellow' : undefined}
                  onClick={() => handleThemeChange('counselor')}
                  leftSection={
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: '#eab308',
                      }}
                    />
                  }
                >
                  Counselor Theme
                </Menu.Item>
                
                <Menu.Item
                  color={currentTheme === 'admin' ? 'violet' : undefined}
                  onClick={() => handleThemeChange('admin')}
                  leftSection={
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: '#a855f7',
                      }}
                    />
                  }
                >
                  Admin Theme
                </Menu.Item>

                <Divider my="xs" />

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
                <Menu.Item onClick={handleLogout} color="red">
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className="theme-transition">
        <Stack gap="sm">
          <Title order={4} c="dimmed">
            Navigation
          </Title>
          <Text size="sm" c="dimmed">
            Navigation menu will be implemented in upcoming sprints
          </Text>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main className="theme-transition">
        {children}
      </AppShell.Main>
    </AppShell>
  );
};