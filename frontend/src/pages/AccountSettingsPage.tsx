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
} from '@mantine/core';
import {
  PersonIcon,
  LockClosedIcon,
  BellIcon,
  EyeOpenIcon,
  GearIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
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
  const [activeTab, setActiveTab] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1} size="h2" mb="xs">
            Account Settings
          </Title>
          <Text c="dimmed" size="lg">
            Manage your account settings, privacy, and preferences.
          </Text>
        </div>

        {/* Settings Layout */}
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
                      leftSection={<Icon width={16} height={16} />}
                      onClick={() => handleTabChange(tab.id)}
                      style={{
                        justifyContent: 'flex-start',
                        height: 'auto',
                        padding: '0.75rem',
                      }}
                      styles={{
                        inner: {
                          justifyContent: 'flex-start',
                        },
                        label: {
                          fontSize: '0.875rem',
                          fontWeight: isActive ? 600 : 500,
                        },
                      }}
                    >
                      {tab.label}
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

                {/* Active Component */}
                {ActiveComponent && (
                  <ActiveComponent onUnsavedChanges={setHasUnsavedChanges} />
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <Paper
            p="md"
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              backgroundColor: 'var(--warning)',
              borderColor: 'var(--warning)',
              borderWidth: '2px',
              maxWidth: '500px',
              width: '90%',
            }}
          >
            <Group justify="space-between" align="center">
              <div>
                <Text fw={600} c="white">
                  Unsaved Changes
                </Text>
                <Text size="sm" c="white" opacity={0.9}>
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