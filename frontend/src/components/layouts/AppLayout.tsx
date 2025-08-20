import React, { type ReactNode, useEffect } from 'react';
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
import {
  DashboardIcon,
  PersonIcon,
  GearIcon,
  ExitIcon,
  MagnifyingGlassIcon,
  TargetIcon,
  BookmarkIcon,
  MoonIcon,
  SunIcon,
  ChatBubbleIcon,
  CalendarIcon,
  BarChartIcon,
  ActivityLogIcon,
  ShieldIcon,
  DatabaseIcon,
} from '@radix-ui/react-icons';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';
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
      const roleTheme: ThemeRole =
        user.role === 'admin' || user.role === 'super_admin'
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
            <Title order={3} style={{ color: 'var(--primary)' }}>
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
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
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
                    <Group gap="sm">
                      {isDark ? (
                        <MoonIcon width={16} height={16} />
                      ) : (
                        <SunIcon width={16} height={16} />
                      )}
                      <Text size="sm">Dark Mode</Text>
                    </Group>
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
                  leftSection={<PersonIcon width={16} height={16} />}
                >
                  Profile Settings
                </Menu.Item>
                <Menu.Item
                  onClick={handleLogout}
                  color="red"
                  leftSection={<ExitIcon width={16} height={16} />}
                >
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
                leftSection={<DashboardIcon />}
                active={location.pathname === '/dashboard'}
                onClick={e => {
                  e.preventDefault();
                  navigate('/dashboard');
                }}
                style={{
                  borderRadius: 'var(--radius)',
                  color:
                    location.pathname === '/dashboard'
                      ? 'var(--primary)'
                      : undefined,
                }}
              />

              {user?.role === 'student' && (
                <>
                  <NavLink
                    href="#"
                    label="Career Assessment"
                    leftSection={<MagnifyingGlassIcon />}
                    active={location.pathname === '/assessment'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/assessment');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/assessment'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                  <NavLink
                    href="#"
                    label="Subject Mapper"
                    leftSection={<TargetIcon />}
                    active={location.pathname === '/subject-mapper'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/subject-mapper');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/subject-mapper'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                  <NavLink
                    href="#"
                    label="Career Hub"
                    leftSection={<BookmarkIcon />}
                    active={location.pathname === '/career-hub'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/career-hub');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/career-hub'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                </>
              )}

              {(user?.role === 'counselor' || user?.role === 'career_counselor') && (
                <>
                  <NavLink
                    href="#"
                    label="Students"
                    leftSection={<PersonIcon />}
                    active={location.pathname === '/counselor/students'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/counselor/students');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/counselor/students'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                  <NavLink
                    href="#"
                    label="Q&A"
                    leftSection={<ChatBubbleIcon />}
                    active={location.pathname === '/counselor/questions'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/counselor/questions');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/counselor/questions'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                  <NavLink
                    href="#"
                    label="Sessions"
                    leftSection={<CalendarIcon />}
                    active={location.pathname === '/counselor/sessions'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/counselor/sessions');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/counselor/sessions'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                  <NavLink
                    href="#"
                    label="Analytics"
                    leftSection={<BarChartIcon />}
                    active={location.pathname === '/counselor/analytics'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/counselor/analytics');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/counselor/analytics'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                </>
              )}

              {(user?.role === 'admin' || user?.role === 'super_admin') && (
                <>
                  <NavLink
                    href="#"
                    label="Admin Dashboard"
                    leftSection={<DashboardIcon />}
                    active={location.pathname === '/admin/dashboard'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/dashboard');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/admin/dashboard'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                  <NavLink
                    href="#"
                    label="User Management"
                    leftSection={<PersonIcon />}
                    active={location.pathname === '/admin/users'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/users');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/admin/users'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                  <NavLink
                    href="#"
                    label="System Analytics"
                    leftSection={<BarChartIcon />}
                    active={location.pathname === '/admin/analytics'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/analytics');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/admin/analytics'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                  <NavLink
                    href="#"
                    label="Content Moderation"
                    leftSection={<ActivityLogIcon />}
                    active={location.pathname === '/admin/content-moderation'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/content-moderation');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/admin/content-moderation'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                  <NavLink
                    href="#"
                    label="System Configuration"
                    leftSection={<GearIcon />}
                    active={location.pathname === '/admin/system-configuration'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/system-configuration');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/admin/system-configuration'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                  <NavLink
                    href="#"
                    label="Security Monitoring"
                    leftSection={<ShieldIcon />}
                    active={location.pathname === '/admin/security-monitoring'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/security-monitoring');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/admin/security-monitoring'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                  <NavLink
                    href="#"
                    label="Maintenance Tools"
                    leftSection={<DatabaseIcon />}
                    active={location.pathname === '/admin/maintenance-tools'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/maintenance-tools');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/admin/maintenance-tools'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                  <NavLink
                    href="#"
                    label="Audit Log"
                    leftSection={<ActivityLogIcon />}
                    active={location.pathname === '/admin/audit-log'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/audit-log');
                    }}
                    style={{
                      borderRadius: 'var(--radius)',
                      color:
                        location.pathname === '/admin/audit-log'
                          ? 'var(--primary)'
                          : undefined,
                    }}
                  />
                </>
              )}

              <NavLink
                href="#"
                label="Profile"
                leftSection={<PersonIcon />}
                active={location.pathname === '/profile'}
                onClick={e => {
                  e.preventDefault();
                  navigate('/profile');
                }}
                style={{
                  borderRadius: 'var(--radius)',
                  color:
                    location.pathname === '/profile'
                      ? 'var(--primary)'
                      : undefined,
                }}
              />

              <NavLink
                href="#"
                label="Settings"
                leftSection={<GearIcon />}
                onClick={e => {
                  e.preventDefault();
                  notifications.show({
                    title: 'Coming Soon',
                    message:
                      'Settings page will be available in upcoming sprints',
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

      <AppShell.Main className="theme-transition">{children}</AppShell.Main>
    </AppShell>
  );
};
