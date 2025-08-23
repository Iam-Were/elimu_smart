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
  Tooltip,
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
  Bookmark,
  Calendar,
  Users,
  Moon,
  Sun,
  Shield,
  LogOut,
  Plus,
  Upload,
  Download,
  Filter,
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

  // Navigation Group - Primary navigation and breadcrumbs
  const NavigationGroup = () => (
    <Group gap="xs" className="header-icon-group">
      <Tooltip label="Dashboard" position="bottom">
        <ActionIcon
          size="lg"
          variant="subtle"
          className="icon-action-professional"
          style={{ color: 'var(--primary)' }}
        >
          <Home className="icon-base" />
        </ActionIcon>
      </Tooltip>
      
      <Tooltip label="Quick Search (⌘K)" position="bottom">
        <ActionIcon
          size="lg"
          variant="subtle"
          onClick={onSearchOpen}
          className="icon-action-professional"
        >
          <Search className="icon-base" />
        </ActionIcon>
      </Tooltip>
      
      <Tooltip label="Bookmarks" position="bottom">
        <ActionIcon
          size="lg"
          variant="subtle"
          className="icon-action-professional"
        >
          <Bookmark className="icon-base" />
        </ActionIcon>
      </Tooltip>
    </Group>
  );

  // Action Group - Primary actions and quick tools
  const ActionGroup = () => (
    <Menu shadow="lg" width={220} position="bottom-end">
      <Menu.Target>
        <Group gap="xs" className="header-icon-group">
          <Tooltip label="Quick Actions" position="bottom">
            <ActionIcon
              size="lg"
              variant="subtle"
              className="icon-action-professional"
            >
              <Plus className="icon-base" />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Menu.Target>
      
      <Menu.Dropdown className="command-palette-dropdown">
        <Menu.Label>Quick Actions</Menu.Label>
        <Menu.Item leftSection={<Plus className="icon-sm" />}>
          New Assessment
        </Menu.Item>
        <Menu.Item leftSection={<Upload className="icon-sm" />}>
          Import Data
        </Menu.Item>
        <Menu.Item leftSection={<Download className="icon-sm" />}>
          Export Report
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item leftSection={<Filter className="icon-sm" />}>
          Advanced Filters
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  // Communication Group - Notifications, messages, collaboration
  const CommunicationGroup = () => (
    <Group gap="xs" className="header-icon-group">
      <Menu shadow="lg" width={350} position="bottom-end">
        <Menu.Target>
          <Tooltip label="Notifications" position="bottom">
            <ActionIcon
              size="lg"
              variant="subtle"
              className="icon-action-professional notification-icon"
              pos="relative"
            >
              <Bell className="icon-base" />
              <Badge
                size="xs"
                circle
                className="notification-badge"
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  minWidth: 16,
                  height: 16,
                  fontSize: 10,
                  background: 'var(--primary)',
                  color: 'white',
                }}
              >
                3
              </Badge>
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        
        <Menu.Dropdown className="notification-center">
          <Group justify="space-between" px="md" py="sm">
            <Text size="sm" fw={600}>
              Notifications
            </Text>
            <Badge size="xs" variant="light">
              3 new
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
                      New assessment submitted
                    </Text>
                    <Text size="xs" c="dimmed">
                      John completed career assessment
                    </Text>
                  </Stack>
                </Group>
                <Text size="xs" c="dimmed">
                  2m
                </Text>
              </Group>
            </Paper>
            
            <Paper p="sm" radius="md" className="notification-item">
              <Group justify="space-between" align="start">
                <Group gap="sm">
                  <Avatar size="sm" color="orange">
                    <Calendar className="icon-sm" />
                  </Avatar>
                  <Stack gap={2}>
                    <Text size="sm" fw={500}>
                      Meeting reminder
                    </Text>
                    <Text size="xs" c="dimmed">
                      Team sync in 15 minutes
                    </Text>
                  </Stack>
                </Group>
                <Text size="xs" c="dimmed">
                  15m
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

      <Tooltip label="Messages" position="bottom">
        <ActionIcon
          size="lg"
          variant="subtle"
          className="icon-action-professional"
        >
          <MessageSquare className="icon-base" />
        </ActionIcon>
      </Tooltip>
    </Group>
  );

  // Utility Group - Settings, help, theme controls
  const UtilityGroup = () => (
    <Group gap="xs" className="header-icon-group">
      <Menu shadow="lg" width={200} position="bottom-end">
        <Menu.Target>
          <Tooltip label="Settings & Help" position="bottom">
            <ActionIcon
              size="lg"
              variant="subtle"
              className="icon-action-professional"
            >
              <Settings className="icon-base" />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        
        <Menu.Dropdown>
          <Menu.Label>Preferences</Menu.Label>
          <Menu.Item 
            leftSection={isDark ? <Moon className="icon-sm" /> : <Sun className="icon-sm" />}
            onClick={toggleDarkMode}
          >
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>Support</Menu.Label>
          <Menu.Item leftSection={<HelpCircle className="icon-sm" />}>
            Help Center
          </Menu.Item>
          <Menu.Item leftSection={<Zap className="icon-sm" />}>
            Keyboard Shortcuts
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
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

      <Menu.Dropdown className="profile-dropdown">
        <Group gap="sm" p="sm">
          <Avatar
            size={40}
            radius="xl"
            style={{
              backgroundColor: getThemeColor(currentTheme),
              color: 'white',
            }}
          >
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </Avatar>
          <Stack gap={2}>
            <Text size="sm" fw={600}>
              {getUserDisplayName()}
            </Text>
            <Text size="xs" c="dimmed">
              {user?.email}
            </Text>
          </Stack>
        </Group>
        
        <Divider />
        
        <Menu.Label>Account</Menu.Label>
        <Menu.Item leftSection={<User className="icon-sm" />}>
          Profile Settings
        </Menu.Item>
        <Menu.Item leftSection={<Shield className="icon-sm" />}>
          Privacy & Security
        </Menu.Item>
        
        <Divider />
        
        <Menu.Item
          leftSection={<LogOut className="icon-sm" />}
          color="red"
          onClick={logout}
        >
          Sign Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <div className="header-world-class">
      <Group h={70} px="xl" justify="space-between" wrap="nowrap">
        {/* Left: Brand */}
        <Group gap="lg">
          <Title order={3} style={{ color: 'var(--primary)' }} className="brand-title">
            Elimu Smart
          </Title>
        </Group>

        {/* Center: Intelligent Icon Groups */}
        <Group gap="xl" className="header-center-groups">
          <NavigationGroup />
          <ActionGroup />
          <CommunicationGroup />
          <UtilityGroup />
        </Group>

        {/* Right: Profile */}
        <Group gap="md" wrap="nowrap">
          <ProfileGroup />
        </Group>
      </Group>
    </div>
  );
};

export default IntelligentHeader;