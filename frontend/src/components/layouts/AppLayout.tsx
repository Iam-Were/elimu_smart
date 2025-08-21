import React, { type ReactNode, useEffect } from 'react';
import {
  AppShell,
  Title,
  Stack,
  NavLink,
} from '@mantine/core';
import {
  DashboardIcon,
  PersonIcon,
  GearIcon,
  MagnifyingGlassIcon,
  TargetIcon,
  BookmarkIcon,
  ChatBubbleIcon,
  CalendarIcon,
  BarChartIcon,
  ActivityLogIcon,
} from '@radix-ui/react-icons';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';
import { DemoModeSwitch } from '../common/DemoModeSwitch';
import { IntelligentHeader } from '../common/IntelligentHeader';
import { SmartBreadcrumbs, useBreadcrumbs } from '../common/SmartBreadcrumbs';
import type { ThemeRole } from '../../types';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { currentTheme, setTheme } = useThemeContext();
  const breadcrumbs = useBreadcrumbs();

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





  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      className="theme-transition"
    >
      <IntelligentHeader
        notificationCount={3}
        messageCount={1}
        onToggleSidebar={toggle}
      />

      {/* Smart Breadcrumbs */}
      <SmartBreadcrumbs items={breadcrumbs} />

      <AppShell.Navbar p="md" className="theme-transition">
        <Stack gap="lg" h="100%">
          <Stack gap="sm">
            <Title order={4} c="dimmed">
              Navigation
            </Title>

            <Stack gap="xs">
              <NavLink
                href="#"
                label={user?.role === 'admin' || user?.role === 'super_admin' ? "Personal Overview" : "Dashboard"}
                leftSection={<DashboardIcon className="sidebar-icon" />}
                active={location.pathname === '/dashboard'}
                onClick={e => {
                  e.preventDefault();
                  navigate('/dashboard');
                }}
                className={`sidebar-item-linkedin ${location.pathname === '/dashboard' ? 'active' : ''}`}
              />

              {user?.role === 'student' && (
                <>
                  <NavLink
                    href="#"
                    label="Career Assessment"
                    leftSection={<MagnifyingGlassIcon className="sidebar-icon" />}
                    active={location.pathname === '/assessment'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/assessment');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/assessment' ? 'active' : ''}`}
                  />
                  <NavLink
                    href="#"
                    label="Subject Mapper"
                    leftSection={<TargetIcon className="sidebar-icon" />}
                    active={location.pathname === '/subject-mapper'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/subject-mapper');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/subject-mapper' ? 'active' : ''}`}
                  />
                  <NavLink
                    href="#"
                    label="Career Hub"
                    leftSection={<BookmarkIcon className="sidebar-icon" />}
                    active={location.pathname === '/career-hub'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/career-hub');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/career-hub' ? 'active' : ''}`}
                  />
                </>
              )}

              {(user?.role === 'counselor' || user?.role === 'career_counselor') && (
                <>
                  <NavLink
                    href="#"
                    label="Students"
                    leftSection={<PersonIcon className="sidebar-icon" />}
                    active={location.pathname === '/counselor/students'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/counselor/students');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/counselor/students' ? 'active' : ''}`}
                  />
                  <NavLink
                    href="#"
                    label="Q&A"
                    leftSection={<ChatBubbleIcon className="sidebar-icon" />}
                    active={location.pathname === '/counselor/questions'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/counselor/questions');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/counselor/questions' ? 'active' : ''}`}
                  />
                  <NavLink
                    href="#"
                    label="Sessions"
                    leftSection={<CalendarIcon className="sidebar-icon" />}
                    active={location.pathname === '/counselor/sessions'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/counselor/sessions');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/counselor/sessions'
                          ? 'active' : ''}`}
                  />
                  <NavLink
                    href="#"
                    label="Analytics"
                    leftSection={<BarChartIcon className="sidebar-icon" />}
                    active={location.pathname === '/counselor/analytics'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/counselor/analytics');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/counselor/analytics'
                          ? 'active' : ''}`}
                  />
                </>
              )}

              {(user?.role === 'admin' || user?.role === 'super_admin') && (
                <>
                  <NavLink
                    href="#"
                    label="System Administration"
                    leftSection={<GearIcon />}
                    active={location.pathname === '/admin/dashboard'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/dashboard');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/admin/dashboard'
                          ? 'active' : ''}`}
                  />
                  <NavLink
                    href="#"
                    label="User Management"
                    leftSection={<PersonIcon className="sidebar-icon" />}
                    active={location.pathname === '/admin/users'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/users');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/admin/users'
                          ? 'active' : ''}`}
                  />
                  <NavLink
                    href="#"
                    label="System Analytics"
                    leftSection={<BarChartIcon className="sidebar-icon" />}
                    active={location.pathname === '/admin/analytics'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/analytics');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/admin/analytics'
                          ? 'active' : ''}`}
                  />
                  <NavLink
                    href="#"
                    label="Content Moderation"
                    leftSection={<ActivityLogIcon className="sidebar-icon" />}
                    active={location.pathname === '/admin/content-moderation'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/content-moderation');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/admin/content-moderation'
                          ? 'active' : ''}`}
                  />
                  <NavLink
                    href="#"
                    label="System Configuration"
                    leftSection={<GearIcon className="sidebar-icon" />}
                    active={location.pathname === '/admin/system-configuration'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/system-configuration');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/admin/system-configuration'
                          ? 'active' : ''}`}
                  />
                  <NavLink
                    href="#"
                    label="Security Monitoring"
                    leftSection={<GearIcon className="sidebar-icon" />}
                    active={location.pathname === '/admin/security-monitoring'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/security-monitoring');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/admin/security-monitoring'
                          ? 'active' : ''}`}
                  />
                  <NavLink
                    href="#"
                    label="Maintenance Tools"
                    leftSection={<GearIcon className="sidebar-icon" />}
                    active={location.pathname === '/admin/maintenance-tools'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/maintenance-tools');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/admin/maintenance-tools'
                          ? 'active' : ''}`}
                  />
                  <NavLink
                    href="#"
                    label="Audit Log"
                    leftSection={<ActivityLogIcon className="sidebar-icon" />}
                    active={location.pathname === '/admin/audit-log'}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/admin/audit-log');
                    }}
                    className={`sidebar-item-linkedin ${location.pathname === '/admin/audit-log'
                          ? 'active' : ''}`}
                  />
                </>
              )}

              <NavLink
                href="#"
                label="Profile"
                leftSection={<PersonIcon className="sidebar-icon" />}
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
                label="Form Demo"
                leftSection={<GearIcon className="sidebar-icon" />}
                onClick={e => {
                  e.preventDefault();
                  navigate('/form-demo');
                }}
                style={{ borderRadius: 'var(--radius)' }}
              />

              <NavLink
                href="#"
                label="Settings"
                leftSection={<GearIcon className="sidebar-icon" />}
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
