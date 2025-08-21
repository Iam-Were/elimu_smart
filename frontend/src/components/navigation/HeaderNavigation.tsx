import React from 'react';
import { Group, UnstyledButton } from '@mantine/core';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  TargetIcon,
  BookmarkIcon,
  PersonIcon,
  BarChartIcon,
  ChatBubbleIcon,
  CalendarIcon,
  GearIcon,
  ActivityLogIcon,
} from '@radix-ui/react-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NavigationDropdown } from './NavigationDropdown';

interface HeaderNavigationProps {
  className?: string;
}

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Learning dropdown items (primarily for students)
  const learningItems = [
    {
      id: 'assessment',
      label: 'Career Assessment',
      description: 'Discover your career interests and strengths',
      path: '/assessment',
      icon: MagnifyingGlassIcon,
      roleRequired: ['student'],
    },
    {
      id: 'subject-mapper',
      label: 'Subject Mapper',
      description: 'Map your subjects to career paths',
      path: '/subject-mapper',
      icon: TargetIcon,
      roleRequired: ['student'],
    },
    {
      id: 'career-hub',
      label: 'Career Guidance Hub',
      description: 'Explore career opportunities and advice',
      path: '/career-hub',
      icon: BookmarkIcon,
      roleRequired: ['student'],
    },
  ];

  // Work dropdown items (role-specific tools)
  const workItems = [
    // Counselor items
    {
      id: 'qa-management',
      label: 'Q&A Management',
      description: 'Manage student questions and answers',
      path: '/counselor/questions',
      icon: ChatBubbleIcon,
      roleRequired: ['counselor', 'career_counselor'],
    },
    {
      id: 'sessions',
      label: 'Counseling Sessions',
      description: 'Schedule and manage counseling sessions',
      path: '/counselor/sessions',
      icon: CalendarIcon,
      roleRequired: ['counselor', 'career_counselor'],
    },
    {
      id: 'group-sessions',
      label: 'Group Sessions',
      description: 'Manage group counseling sessions',
      path: '/counselor/group-sessions',
      icon: CalendarIcon,
      roleRequired: ['counselor', 'career_counselor'],
    },
    // Admin items
    {
      id: 'system-config',
      label: 'System Configuration',
      description: 'Configure platform settings and parameters',
      path: '/admin/system-configuration',
      icon: GearIcon,
      roleRequired: ['admin', 'super_admin'],
    },
    {
      id: 'content-moderation',
      label: 'Content Moderation',
      description: 'Moderate user-generated content',
      path: '/admin/content-moderation',
      icon: ActivityLogIcon,
      roleRequired: ['admin', 'super_admin'],
    },
    {
      id: 'security-monitoring',
      label: 'Security Monitoring',
      description: 'Monitor platform security and threats',
      path: '/admin/security-monitoring',
      icon: GearIcon,
      roleRequired: ['admin', 'super_admin'],
    },
    {
      id: 'maintenance-tools',
      label: 'Maintenance Tools',
      description: 'Platform maintenance and diagnostics',
      path: '/admin/maintenance-tools',
      icon: GearIcon,
      roleRequired: ['admin', 'super_admin'],
    },
    {
      id: 'audit-log',
      label: 'Audit Logs',
      description: 'View system activity and audit trails',
      path: '/admin/audit-log',
      icon: ActivityLogIcon,
      roleRequired: ['admin', 'super_admin'],
    },
  ];

  const NavigationButton: React.FC<{
    label: string;
    path: string;
    active?: boolean;
    onClick: () => void;
    icon?: React.ComponentType<{ width?: number; height?: number }>;
  }> = ({ label, active = false, onClick, icon: Icon }) => (
    <UnstyledButton
      onClick={onClick}
      style={{
        padding: '0.5rem 0.75rem',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: active ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
        fontSize: '14px',
        fontWeight: 600,
        color: active ? 'var(--primary)' : 'var(--foreground)',
        borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <Group gap="xs" style={{ alignItems: 'center' }}>
        {Icon && <Icon width={16} height={16} />}
        {label}
      </Group>
    </UnstyledButton>
  );

  return (
    <Group gap="xs" className={`header-navigation ${className}`}>
      {/* Home */}
      <NavigationButton
        label="Home"
        path="/dashboard"
        active={isActive('/dashboard')}
        onClick={() => handleNavigation('/dashboard')}
        icon={HomeIcon}
      />

      {/* Role-specific primary navigation */}
      {user?.role === 'student' && (
        <NavigationDropdown
          label="Learning"
          items={learningItems}
          userRole={user.role}
        />
      )}

      {(user?.role === 'counselor' || user?.role === 'career_counselor') && (
        <>
          <NavigationButton
            label="Students"
            path="/counselor/students"
            active={isActive('/counselor/students')}
            onClick={() => handleNavigation('/counselor/students')}
            icon={PersonIcon}
          />
          <NavigationButton
            label="Analytics"
            path="/counselor/analytics"
            active={isActive('/counselor/analytics')}
            onClick={() => handleNavigation('/counselor/analytics')}
            icon={BarChartIcon}
          />
        </>
      )}

      {(user?.role === 'admin' || user?.role === 'super_admin') && (
        <>
          <NavigationButton
            label="Users"
            path="/admin/users"
            active={isActive('/admin/users')}
            onClick={() => handleNavigation('/admin/users')}
            icon={PersonIcon}
          />
          <NavigationButton
            label="Analytics"
            path="/admin/analytics"
            active={isActive('/admin/analytics')}
            onClick={() => handleNavigation('/admin/analytics')}
            icon={BarChartIcon}
          />
        </>
      )}

      {/* Work dropdown for role-specific tools */}
      {user?.role && ['counselor', 'career_counselor', 'admin', 'super_admin'].includes(user.role) && (
        <NavigationDropdown
          label="Work"
          items={workItems}
          userRole={user.role}
        />
      )}

      {/* Messages - always visible */}
      <NavigationButton
        label="Messaging"
        path="/messages"
        active={isActive('/messages')}
        onClick={() => handleNavigation('/messages')}
        icon={ChatBubbleIcon}
      />
    </Group>
  );
};