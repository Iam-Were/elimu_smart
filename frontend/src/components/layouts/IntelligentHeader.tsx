import React from 'react';
import {
  Group,
  Title,
  Button,
  Avatar,
  Menu,
  Text,
  Stack,
  Badge,
  ActionIcon,
  Divider,
  Paper,
} from '@mantine/core';
import {
  Home,
  Search,
  Bell,
  MessageSquare,
  Settings,
  HelpCircle,
  User,
  ChevronDown,
  Zap,
  Users,
  Moon,
  Sun,
  Shield,
  LogOut,
  Download,
  Target,
  BookOpen,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';
import type { ThemeRole } from '../../types';

interface IntelligentHeaderProps {
  onSearchOpen?: () => void;
}

export const IntelligentHeader: React.FC<IntelligentHeaderProps> = ({
  onSearchOpen,
}) => {
  const { user, logout } = useAuth();
  const { currentTheme, isDark, toggleDarkMode } = useThemeContext();
  
  // Get current path to determine active navigation
  const currentPath = window.location.pathname;
  
  // Navigation handler
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const getThemeColor = (theme: ThemeRole) => {
    switch (theme) {
      case 'admin':
        return '#a855f7';
      case 'counselor':
        return '#eab308';
      default:
        return '#ff6b35';
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

  // Role-based navigation items with singular naming
  const getNavigationItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: Home },
    ];
    
    // Role-specific navigation items
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      return [
        ...baseItems,
        { path: '/admin/portal', label: 'Portal', icon: Shield },
        { path: '/admin/users', label: 'User', icon: Users },
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/profile', label: 'Profile', icon: User },
      ];
    }
    
    if (user?.role === 'counselor' || user?.role === 'career_counselor') {
      return [
        ...baseItems,
        { path: '/counselor/toolkit', label: 'Toolkit', icon: Zap },
        { path: '/counselor/students', label: 'Student', icon: Users },
        { path: '/counselor/sessions', label: 'Session', icon: Calendar },
        { path: '/profile', label: 'Profile', icon: User },
      ];
    }
    
    // Default student navigation
    return [
      ...baseItems,
      { path: '/guidance', label: 'Guidance', icon: MessageSquare },
      { path: '/assessment', label: 'Assessment', icon: Target },
      { path: '/subject-mapper', label: 'Mapper', icon: BookOpen },
      { path: '/profile', label: 'Profile', icon: User },
    ];
  };
  
  const navigationItems = getNavigationItems();
  
  // Navigation Group with active states
  const NavigationGroup = () => (
    <Group gap="lg" className="header-nav-group">
      {navigationItems.map((item) => {
        const isActive = currentPath === item.path || 
          (currentPath === '/' && item.path === '/dashboard'); // Default dashboard active
        
        return (
          <Button
            key={item.path}
            variant="subtle"
            size="sm"
            leftSection={<item.icon size={16} />}
            className="nav-item-professional"
            onClick={() => handleNavigation(item.path)}
            style={{
              color: isActive ? '#f97316' : '#6b7280',
              fontWeight: isActive ? 600 : 500,
              fontSize: '14px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: isActive ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
              cursor: 'pointer'
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Group>
  );




  // Profile Group - User profile, account, session management
  const ProfileGroup = () => (
    <Menu shadow="lg" width={280} position="bottom-end">
      <Menu.Target>
        <Button 
          variant="subtle" 
          className="profile-button-professional"
          rightSection={<ChevronDown className="icon-sm" />}
        >
          <Group gap="sm">
            <Avatar
              size={32}
              radius="xl"
              style={{
                backgroundColor: getThemeColor(currentTheme),
                color: 'white',
              }}
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </Avatar>
            <Stack gap={0} align="flex-start" style={{ minWidth: 0 }}>
              <Text size="sm" fw={500} truncate style={{ maxWidth: 120 }}>
                {getUserDisplayName()}
              </Text>
              <Badge 
                size="xs" 
                variant="light"
                style={{
                  backgroundColor: `${getThemeColor(currentTheme)}20`,
                  color: getThemeColor(currentTheme),
                }}
              >
                {user?.role && getRoleDisplayName(user.role)}
              </Badge>
            </Stack>
          </Group>
        </Button>
      </Menu.Target>

      <Menu.Dropdown className="profile-dropdown" style={{ width: '320px' }}>
        {/* Profile Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
          <Group gap="md">
            <Avatar
              size={48}
              radius="xl"
              style={{
                backgroundColor: getThemeColor(currentTheme),
                color: 'white',
              }}
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </Avatar>
            <Stack gap={2} style={{ flex: 1 }}>
              <Text size="md" fw={600}>
                {getUserDisplayName()}
              </Text>
              <Badge 
                size="xs" 
                variant="light"
                style={{
                  backgroundColor: `${getThemeColor(currentTheme)}20`,
                  color: getThemeColor(currentTheme),
                }}
              >
                {user?.role && getRoleDisplayName(user.role)}
              </Badge>
              <Text size="xs" c="dimmed">
                {user?.email}
              </Text>
            </Stack>
          </Group>
          <Button 
            variant="light" 
            size="xs" 
            fullWidth 
            style={{ marginTop: '8px' }}
            leftSection={<User size={14} />}
          >
            View Profile
          </Button>
        </div>
        
        {/* Navigation Menu Items */}
        <Menu.Label style={{ marginTop: '8px' }}>Navigation</Menu.Label>
        <Menu.Item leftSection={<Home size={16} />} onClick={() => handleNavigation('/dashboard')}>
          Dashboard
        </Menu.Item>
        <Menu.Item leftSection={<Target size={16} />} onClick={() => handleNavigation('/assessment')}>
          Career Assessment
        </Menu.Item>
        <Menu.Item leftSection={<MessageSquare size={16} />} onClick={() => handleNavigation('/guidance')}>
          Career Guidance
        </Menu.Item>
        <Menu.Item leftSection={<Search size={16} />} onClick={() => handleNavigation('/career-hub')}>
          Career Explorer
        </Menu.Item>
        <Menu.Item leftSection={<BookOpen size={16} />} onClick={() => handleNavigation('/subject-mapper')}>
          Subject Mapper
        </Menu.Item>
        
        <Divider />
        
        {/* Account & Settings */}
        <Menu.Label>Account & Settings</Menu.Label>
        <Menu.Item leftSection={<User size={16} />} onClick={() => handleNavigation('/profile')}>
          Profile & Preferences
        </Menu.Item>
        <Menu.Item leftSection={<Bell size={16} />}>
          Notifications
        </Menu.Item>
        <Menu.Item leftSection={<Shield size={16} />}>
          Privacy & Security
        </Menu.Item>
        <Menu.Item leftSection={<Settings size={16} />}>
          Account Settings
        </Menu.Item>
        
        <Divider />
        
        {/* Tools & Resources */}
        <Menu.Label>Tools & Resources</Menu.Label>
        <Menu.Item leftSection={<HelpCircle size={16} />}>
          Help Center
        </Menu.Item>
        <Menu.Item leftSection={<Zap size={16} />}>
          Keyboard Shortcuts
        </Menu.Item>
        <Menu.Item leftSection={<Download size={16} />}>
          Download Mobile App
        </Menu.Item>
        
        <Divider />
        
        {/* Theme & Display */}
        <Menu.Label>Display</Menu.Label>
        <Menu.Item 
          leftSection={isDark ? <Moon size={16} /> : <Sun size={16} />}
          onClick={toggleDarkMode}
        >
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </Menu.Item>
        
        <Divider />
        
        {/* Sign Out */}
        <Menu.Item
          leftSection={<LogOut size={16} />}
          color="red"
          onClick={logout}
          style={{ marginTop: '4px' }}
        >
          Sign Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <div className="header-world-class" style={{ 
      backgroundColor: 'white', 
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <Group h={70} px="xl" justify="space-between" wrap="nowrap">
        {/* Left: Brand with logo */}
        <Group gap="md">
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            E
          </div>
          <div>
            <Title order={3} style={{ color: '#1f2937', margin: 0, fontSize: '18px', fontWeight: 600 }}>
              Elimu Smart
            </Title>
            <Text size="xs" c="dimmed" style={{ fontSize: '11px', margin: 0, lineHeight: 1 }}>
              Career Guidance Platform
            </Text>
          </div>
        </Group>

        {/* Center: Search Bar */}
        <div style={{
          position: 'relative',
          width: '400px',
          maxWidth: '40%'
        }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af',
              zIndex: 1 
            }} 
          />
          <input
            type="text"
            placeholder="Search careers..."
            onClick={onSearchOpen}
            style={{
              width: '100%',
              height: '36px',
              paddingLeft: '40px',
              paddingRight: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Right: Actions + Profile */}
        <Group gap="lg" wrap="nowrap">
          <NavigationGroup />
          
          {/* Notifications and Profile */}
          <Group gap="sm">
            <Menu shadow="lg" width={350} position="bottom-end">
              <Menu.Target>
                <ActionIcon
                  size="md"
                  variant="subtle"
                  className="icon-action-professional"
                  pos="relative"
                  style={{ color: '#6b7280' }}
                >
                  <Bell size={18} />
                  <Badge
                    size="xs"
                    circle
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      minWidth: '16px',
                      height: '16px',
                      fontSize: '10px',
                      background: '#f97316',
                      color: 'white',
                      border: '2px solid white'
                    }}
                  >
                    1
                  </Badge>
                </ActionIcon>
              </Menu.Target>
              
              <Menu.Dropdown className="notification-center">
                <Group justify="space-between" px="md" py="sm">
                  <Text size="sm" fw={600}>
                    Notifications
                  </Text>
                  <Badge size="xs" variant="light">
                    1 new
                  </Badge>
                </Group>
                <Divider />
                
                <Stack gap="xs" p="sm">
                  <Paper p="sm" radius="md" className="notification-item">
                    <Group justify="space-between" align="start">
                      <Group gap="sm">
                        <Avatar size="sm" color="blue">
                          <Users className="icon-sm" />
                        </Avatar>
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>
                            New career match available
                          </Text>
                          <Text size="xs" c="dimmed">
                            Your assessment results are ready
                          </Text>
                        </Stack>
                      </Group>
                      <Text size="xs" c="dimmed">
                        5m
                      </Text>
                    </Group>
                  </Paper>
                </Stack>
                
                <Divider />
                <Menu.Item>
                  <Text size="sm" ta="center">
                    View all notifications
                  </Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <ProfileGroup />
          </Group>
        </Group>
      </Group>
    </div>
  );
};

export default IntelligentHeader;