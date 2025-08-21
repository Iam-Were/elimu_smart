import React, { useState, useRef, useEffect } from 'react';
import {
  Group,
  Text,
  Avatar,
  Stack,
  Divider,
  Badge,
  UnstyledButton,
  Paper,
  ActionIcon,
  Switch,
} from '@mantine/core';
import {
  PersonIcon,
  GearIcon,
  ExitIcon,
  BellIcon,
  EyeOpenIcon,
  LockClosedIcon,
  ActivityLogIcon,
  DashboardIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';

interface ProfileDropdownProps {
  className?: string;
}

interface DropdownMenuItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ width?: number; height?: number }>;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
  roleRequired?: string[];
  badge?: string;
}

interface DropdownSection {
  title: string;
  items: DropdownMenuItem[];
  roleVisible?: string[];
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ className }) => {
  const [opened, setOpened] = useState(false);
  const { user, logout } = useAuth();
  const { currentTheme, isDark, toggleDarkMode } = useThemeContext();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpened(false);
      }
    };

    if (opened) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [opened]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && opened) {
        setOpened(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [opened]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (path: string) => {
    setOpened(false);
    navigate(path);
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

  const getThemeColor = () => {
    switch (currentTheme) {
      case 'admin':
        return '#a855f7';
      case 'counselor':
        return '#eab308';
      default:
        return '#f97316';
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const dropdownSections: DropdownSection[] = [
    {
      title: 'Profile',
      items: [
        {
          id: 'view-profile',
          label: 'View Profile',
          description: 'See your public profile',
          icon: PersonIcon,
          onClick: () => handleNavigation('/profile'),
        },
        {
          id: 'edit-profile',
          label: 'Edit Profile',
          description: 'Update your information',
          icon: PersonIcon,
          onClick: () => handleNavigation('/profile/edit'),
        },
      ],
    },
    {
      title: 'Account Settings',
      items: [
        {
          id: 'account-settings',
          label: 'Account Settings',
          description: 'Privacy, security, preferences',
          icon: GearIcon,
          onClick: () => handleNavigation('/settings/account'),
        },
        {
          id: 'security',
          label: 'Security',
          description: 'Password, 2FA, sessions',
          icon: LockClosedIcon,
          onClick: () => handleNavigation('/settings/security'),
        },
        {
          id: 'privacy',
          label: 'Privacy',
          description: 'Data and visibility settings',
          icon: EyeOpenIcon,
          onClick: () => handleNavigation('/settings/privacy'),
        },
        {
          id: 'notifications',
          label: 'Notifications',
          description: 'Email and push preferences',
          icon: BellIcon,
          onClick: () => handleNavigation('/settings/notifications'),
        },
      ],
    },
    {
      title: 'Development',
      items: [
        {
          id: 'demo-mode',
          label: 'Demo Mode',
          description: 'Switch between user roles for testing',
          icon: PersonIcon,
          onClick: () => handleNavigation('/form-demo'),
        },
      ],
    },
  ];

  // Add admin-specific section
  if (isAdmin) {
    dropdownSections.push({
      title: 'Administration',
      items: [
        {
          id: 'system-admin',
          label: 'System Administration',
          description: 'Platform management',
          icon: DashboardIcon,
          onClick: () => handleNavigation('/admin/dashboard'),
          badge: 'Admin',
        },
        {
          id: 'user-management',
          label: 'User Management',
          description: 'Manage users and roles',
          icon: PersonIcon,
          onClick: () => handleNavigation('/admin/users'),
        },
        {
          id: 'audit-logs',
          label: 'Audit Logs',
          description: 'System activity logs',
          icon: ActivityLogIcon,
          onClick: () => handleNavigation('/admin/audit-log'),
        },
      ],
      roleVisible: ['admin', 'super_admin'],
    });
  }

  if (!user) return null;

  return (
    <div ref={dropdownRef} className={`profile-dropdown ${className || ''}`} style={{ position: 'relative' }}>
      <UnstyledButton
        className="profile-trigger"
        onClick={() => setOpened(!opened)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: opened ? 'var(--sidebar-accent)' : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!opened) {
            e.currentTarget.style.backgroundColor = 'var(--sidebar-accent)';
          }
        }}
        onMouseLeave={(e) => {
          if (!opened) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <div style={{ position: 'relative' }}>
          <Avatar
            size={32}
            radius="xl"
            color={currentTheme}
            style={{
              backgroundColor: getThemeColor(),
            }}
          >
            {user.firstName?.[0]}{user.lastName?.[0]}
          </Avatar>
          {/* Online status indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: -1,
              right: -1,
              width: 10,
              height: 10,
              border: '2px solid var(--background)',
              borderRadius: '50%',
              backgroundColor: '#22c55e', // green-500
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
          <Text
            size="sm"
            fw={600}
            style={{
              color: 'var(--foreground)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '120px',
            }}
          >
            {getUserDisplayName()}
          </Text>
          <Text
            size="xs"
            style={{
              color: 'var(--muted-foreground)',
              textTransform: 'capitalize',
            }}
          >
            {user.role && getRoleDisplayName(user.role)}
          </Text>
        </div>

        <ActionIcon size="sm" variant="subtle" style={{ marginLeft: 'auto' }}>
          <ChevronDownIcon
            width={16}
            height={16}
            style={{
              transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </ActionIcon>
      </UnstyledButton>

      {opened && (
        <Paper
          className="dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: '320px',
            maxWidth: '400px',
            zIndex: 1000,
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 8px 24px -4px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
            animation: 'dropdownSlideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* User Card Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--muted)',
            }}
          >
            <Group gap="sm">
              <Avatar
                size={40}
                radius="xl"
                color={currentTheme}
                style={{
                  backgroundColor: getThemeColor(),
                }}
              >
                {user.firstName?.[0]}{user.lastName?.[0]}
              </Avatar>
              <Stack gap={2} style={{ flex: 1 }}>
                <Text fw={600} size="sm">
                  {getUserDisplayName()}
                </Text>
                <Text size="xs" c="dimmed">
                  {user.email}
                </Text>
                <Group gap="xs">
                  <Badge
                    size="xs"
                    variant="light"
                    color={currentTheme === 'admin' ? 'violet' : currentTheme === 'counselor' ? 'yellow' : 'orange'}
                  >
                    {user.role && getRoleDisplayName(user.role)}
                  </Badge>
                  {isAdmin && (
                    <Badge size="xs" variant="dot" color="green">
                      Online
                    </Badge>
                  )}
                </Group>
              </Stack>
            </Group>
          </div>

          {/* Dropdown Sections */}
          <div style={{ padding: '0.5rem' }}>
            {dropdownSections.map((section, sectionIndex) => {
              // Check if section should be visible based on role
              if (section.roleVisible && user.role && !section.roleVisible.includes(user.role)) {
                return null;
              }

              return (
                <div key={section.title}>
                  {sectionIndex > 0 && <Divider my="xs" />}
                  
                  <Text
                    size="xs"
                    fw={600}
                    c="dimmed"
                    style={{
                      padding: '0.5rem 0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {section.title}
                  </Text>

                  {section.items.map((item) => {
                    // Check if item should be visible based on role
                    if (item.roleRequired && user.role && !item.roleRequired.includes(user.role)) {
                      return null;
                    }

                    return (
                      <UnstyledButton
                        key={item.id}
                        onClick={item.onClick}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                          color: item.danger ? 'var(--destructive)' : 'var(--foreground)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--sidebar-accent)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ color: item.danger ? 'var(--destructive)' : 'var(--muted-foreground)' }}>
                          <item.icon width={16} height={16} />
                        </div>
                        
                        <Stack gap={1} style={{ flex: 1, textAlign: 'left' }}>
                          <Group justify="space-between" align="center">
                            <Text size="sm" fw={500}>
                              {item.label}
                            </Text>
                            {item.badge && (
                              <Badge size="xs" variant="light" color="blue">
                                {item.badge}
                              </Badge>
                            )}
                          </Group>
                          {item.description && (
                            <Text size="xs" c="dimmed">
                              {item.description}
                            </Text>
                          )}
                        </Stack>
                      </UnstyledButton>
                    );
                  })}
                </div>
              );
            })}

            {/* Theme & Settings */}
            <Divider my="xs" />
            <div style={{ padding: '8px 12px' }}>
              <Text
                size="xs"
                fw={600}
                c="dimmed"
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                }}
              >
                Preferences
              </Text>
              
              {/* Dark Mode Toggle */}
              <Group justify="space-between" mb="sm">
                <Group gap="sm">
                  {isDark ? (
                    <SunIcon width={16} height={16} style={{ color: 'var(--muted-foreground)' }} />
                  ) : (
                    <MoonIcon width={16} height={16} style={{ color: 'var(--muted-foreground)' }} />
                  )}
                  <Text size="sm" fw={500}>
                    Dark Mode
                  </Text>
                </Group>
                <Switch
                  checked={isDark}
                  onChange={toggleDarkMode}
                  size="sm"
                />
              </Group>
              
              {/* Quick Demo Switch */}
              <Text
                size="xs"
                fw={600}
                c="dimmed"
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  marginTop: '12px',
                }}
              >
                Quick Demo Switch
              </Text>
              <Group gap="xs">
                <UnstyledButton
                  onClick={() => handleNavigation('/dashboard?demo=student')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  Student
                </UnstyledButton>
                <UnstyledButton
                  onClick={() => handleNavigation('/dashboard?demo=counselor')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    backgroundColor: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  Counselor
                </UnstyledButton>
                <UnstyledButton
                  onClick={() => handleNavigation('/dashboard?demo=admin')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    backgroundColor: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  Admin
                </UnstyledButton>
              </Group>
            </div>

            {/* Sign Out Section */}
            <Divider my="xs" />
            <UnstyledButton
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                color: 'var(--destructive)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--destructive-foreground)';
                e.currentTarget.style.color = 'var(--destructive)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--destructive)';
              }}
            >
              <ExitIcon width={16} height={16} />
              <Stack gap={1} style={{ flex: 1, textAlign: 'left' }}>
                <Text size="sm" fw={500}>
                  Sign Out
                </Text>
                <Text size="xs" c="dimmed">
                  Sign out of your account
                </Text>
              </Stack>
            </UnstyledButton>
          </div>
        </Paper>
      )}

      <style>{`
        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};