import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Paper,
  Grid,
  Avatar,
  ActionIcon,
  Badge,
  Divider,
  FileInput,
  rem,
  Progress,
} from '@mantine/core';
import {
  PersonIcon,
  LockClosedIcon,
  BellIcon,
  EyeOpenIcon,
  GearIcon,
  TrashIcon,
  CameraIcon,
  DownloadIcon,
} from '@radix-ui/react-icons';
import { useAuth } from '../hooks/useAuth';
// import type { User } from '../types'; // Unused after refactoring
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { SecuritySettings } from '../components/settings/SecuritySettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { PrivacySettings } from '../components/settings/PrivacySettings';
import { PreferencesSettings } from '../components/settings/PreferencesSettings';
import { AccountManagement } from '../components/settings/AccountManagement';

interface SettingsTab {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ width?: number; height?: number }>;
  component: React.ComponentType<any>;
}

export const AccountSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);

  const settingsTabs: SettingsTab[] = [
    {
      id: 'profile',
      label: 'Profile',
      description: 'Manage your personal information and profile settings',
      icon: PersonIcon,
      component: ProfileSettings,
    },
    {
      id: 'security',
      label: 'Security',
      description: 'Password, two-factor authentication, and session management',
      icon: LockClosedIcon,
      component: SecuritySettings,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Email and push notification preferences',
      icon: BellIcon,
      component: NotificationSettings,
    },
    {
      id: 'privacy',
      label: 'Privacy',
      description: 'Data sharing and profile visibility settings',
      icon: EyeOpenIcon,
      component: PrivacySettings,
    },
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Language, timezone, and appearance settings',
      icon: GearIcon,
      component: PreferencesSettings,
    },
    {
      id: 'account',
      label: 'Account Management',
      description: 'Export data, deactivate, or delete your account',
      icon: TrashIcon,
      component: AccountManagement,
    },
  ];

  const activeTabData = settingsTabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  const handleTabChange = (tabId: string) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave this section?'
      );
      if (!confirmed) return;
    }
    setActiveTab(tabId);
    setHasUnsavedChanges(false);
  };

  const handleProfileImageUpload = (file: File | null) => {
    if (file) {
      // Create preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
      setHasUnsavedChanges(true);
    }
  };

  const handleExportData = async () => {
    // TODO: Implement data export functionality
    console.log('Exporting user data...');
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Enhanced Header with Profile Preview */}
        <Paper p="xl" withBorder>
          <Group justify="space-between" align="flex-start">
            <Group align="flex-start" gap="xl">
              {/* Enhanced Profile Picture Section */}
              <div style={{ position: 'relative' }}>
                <Avatar
                  size={120}
                  src={profileImage}
                  alt={user ? `${user.firstName} ${user.lastName}` : 'User'}
                  style={{
                    border: '4px solid var(--mantine-color-orange-6)',
                    boxShadow: 'var(--mantine-shadow-sm)',
                  }}
                />
                <FileInput
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  style={{ display: 'none' }}
                  id="profile-image-upload"
                />
                <ActionIcon
                  component="label"
                  htmlFor="profile-image-upload"
                  size="md"
                  variant="filled"
                  color="orange"
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    cursor: 'pointer',
                    border: '2px solid white',
                  }}
                >
                  <CameraIcon width={16} height={16} />
                </ActionIcon>
              </div>

              <Stack gap="xs">
                <div>
                  <Title order={1} size="h2" mb="xs">
                    {user ? `${user.firstName} ${user.lastName}` : 'Your Name'}
                  </Title>
                  <Text c="dimmed" size="lg">
                    {user?.email || 'your.email@example.com'}
                  </Text>
                </div>

                <Group gap="md" mt="sm">
                  <Badge 
                    variant="light" 
                    color="orange" 
                    size="lg"
                    leftSection={<div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--mantine-color-orange-6)' }} />}
                  >
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}
                  </Badge>
                  <Text size="sm" c="dimmed">
                    Member since {new Date().getFullYear()}
                  </Text>
                </Group>

                {/* Profile Completion Indicator */}
                <div style={{ marginTop: rem(16), minWidth: rem(300) }}>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" fw={500}>Profile Completion</Text>
                    <Text size="sm" c="dimmed">85%</Text>
                  </Group>
                  <Progress value={85} color="orange" size="sm" />
                  <Text size="xs" c="dimmed" mt={4}>
                    Complete your profile to unlock all features
                  </Text>
                </div>
              </Stack>
            </Group>

            <Group gap="md">
              <Button
                variant="default"
                leftSection={<DownloadIcon width={16} height={16} />}
                onClick={handleExportData}
              >
                Export Data
              </Button>
            </Group>
          </Group>
        </Paper>

        {/* Enhanced Settings Layout */}
        <Grid gutter="xl" className="settings-layout">
          {/* Sidebar Navigation */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper
              p="md"
              style={{
                position: 'sticky',
                top: '80px',
                height: 'fit-content',
              }}
              className="settings-sidebar"
            >
              <Stack gap="xs">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <Button
                      key={tab.id}
                      variant={isActive ? 'filled' : 'subtle'}
                      color={isActive ? 'orange' : 'gray'}
                      leftSection={<Icon width={16} height={16} />}
                      onClick={() => handleTabChange(tab.id)}
                      justify="flex-start"
                      style={{
                        height: 'auto',
                        padding: rem(12),
                      }}
                    >
                      <div style={{ textAlign: 'left' }}>
                        <Text fw={isActive ? 600 : 500} size="sm">
                          {tab.label}
                        </Text>
                        <Text size="xs" c={isActive ? 'white' : 'dimmed'} mt={2}>
                          {tab.description}
                        </Text>
                      </div>
                    </Button>
                  );
                })}
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Main Content */}
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Paper p="xl" style={{ minHeight: '600px' }}>
              <Stack gap="lg">
                {/* Section Header */}
                <div>
                  <Group gap="sm" mb="xs">
                    {activeTabData?.icon && (
                      <activeTabData.icon width={24} height={24} />
                    )}
                    <Title order={2} size="h3">
                      {activeTabData?.label}
                    </Title>
                  </Group>
                  <Text c="dimmed" size="sm">
                    {activeTabData?.description}
                  </Text>
                </div>

                <Divider />

                {/* Active Component */}
                {ActiveComponent && (
                  <ActiveComponent 
                    onUnsavedChanges={setHasUnsavedChanges} 
                    user={user}
                    profileImage={profileImage}
                  />
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Enhanced Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <Paper
            p="md"
            style={{
              position: 'fixed',
              bottom: rem(32),
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              backgroundColor: 'var(--mantine-color-orange-6)',
              maxWidth: rem(500),
              width: '90%',
              boxShadow: 'var(--mantine-shadow-lg)',
            }}
          >
            <Group justify="space-between" align="center">
              <div>
                <Text fw={600} c="white">
                  Unsaved Changes
                </Text>
                <Text size="sm" c="white" style={{ opacity: 0.9 }}>
                  You have unsaved changes that will be lost if you navigate away.
                </Text>
              </div>
              <Group gap="sm">
                <Button
                  size="sm"
                  variant="white"
                  onClick={() => {
                    // Handle save logic here
                    setHasUnsavedChanges(false);
                  }}
                >
                  Save Changes
                </Button>
              </Group>
            </Group>
          </Paper>
        )}
      </Stack>

      <style>{`
        @media (max-width: 768px) {
          .settings-layout {
            display: block !important;
          }
          
          .settings-sidebar {
            position: static !important;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </Container>
  );
};