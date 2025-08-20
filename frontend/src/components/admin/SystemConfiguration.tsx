import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Button,
  TextInput,
  Textarea,
  Switch,
  NumberInput,
  Select,
  Alert,
  Tabs,
  Badge,
  Progress,
  SimpleGrid,
  Divider,
} from '@mantine/core';
import {
  GearIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  ReloadIcon,
  DownloadIcon,
  UploadIcon,
  LockClosedIcon,
  GlobeIcon,
  EnvelopeClosedIcon,
  BellIcon,
} from '@radix-ui/react-icons';
import { notifications } from '@mantine/notifications';

interface SystemConfig {
  general: {
    platformName: string;
    platformDescription: string;
    supportEmail: string;
    maxFileUploadSize: number;
    sessionTimeout: number;
    maintenanceMode: boolean;
    allowUserRegistration: boolean;
    requireEmailVerification: boolean;
  };
  security: {
    passwordMinLength: number;
    passwordRequireSpecialChar: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
    twoFactorEnabled: boolean;
    encryptionEnabled: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    dailyDigest: boolean;
    systemAlerts: boolean;
    notificationRetentionDays: number;
  };
  content: {
    autoModeration: boolean;
    moderationStrictness: string;
    maxQuestionLength: number;
    maxAnswerLength: number;
    allowAnonymousQuestions: boolean;
    requireCounselorApproval: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheExpiration: number;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    maxConcurrentUsers: number;
    autoScaling: boolean;
  };
}

const defaultConfig: SystemConfig = {
  general: {
    platformName: 'Elimu Smart',
    platformDescription: 'Comprehensive career guidance platform for Kenyan students',
    supportEmail: 'support@elimu-smart.co.ke',
    maxFileUploadSize: 10,
    sessionTimeout: 60,
    maintenanceMode: false,
    allowUserRegistration: true,
    requireEmailVerification: true,
  },
  security: {
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorEnabled: false,
    encryptionEnabled: true,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dailyDigest: true,
    systemAlerts: true,
    notificationRetentionDays: 90,
  },
  content: {
    autoModeration: true,
    moderationStrictness: 'medium',
    maxQuestionLength: 1000,
    maxAnswerLength: 2000,
    allowAnonymousQuestions: true,
    requireCounselorApproval: false,
  },
  performance: {
    cacheEnabled: true,
    cacheExpiration: 3600,
    compressionEnabled: true,
    cdnEnabled: true,
    maxConcurrentUsers: 1000,
    autoScaling: true,
  },
};

export const SystemConfiguration: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState<string | null>('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateConfig = (section: keyof SystemConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const saveConfiguration = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    notifications.show({
      title: 'Configuration Saved',
      message: 'System configuration has been updated successfully',
      color: 'green',
    });
    
    setHasChanges(false);
    setIsLoading(false);
  };

  const resetToDefaults = () => {
    setConfig(defaultConfig);
    setHasChanges(true);
    notifications.show({
      title: 'Reset to Defaults',
      message: 'Configuration has been reset to default values',
      color: 'blue',
    });
  };

  const exportConfiguration = () => {
    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elimu-smart-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfiguration = () => {
    // In a real app, this would open a file picker
    notifications.show({
      title: 'Import Configuration',
      message: 'File picker functionality would be implemented here',
      color: 'blue',
    });
  };

  const restartSystem = () => {
    notifications.show({
      title: 'System Restart Scheduled',
      message: 'System will restart in 5 minutes to apply changes',
      color: 'orange',
    });
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="2rem">
              System Configuration
            </Title>
            <Text size="lg" c="dimmed">
              Configure platform settings and system behavior
            </Text>
          </Stack>
          <Group gap="sm">
            {hasChanges && (
              <Badge size="lg" color="yellow" variant="filled">
                Unsaved Changes
              </Badge>
            )}
            <Button
              leftSection={<DownloadIcon width={16} height={16} />}
              variant="light"
              onClick={exportConfiguration}
            >
              Export Config
            </Button>
            <Button
              leftSection={<UploadIcon width={16} height={16} />}
              variant="light"
              onClick={importConfiguration}
            >
              Import Config
            </Button>
          </Group>
        </Group>

        {/* Action Buttons */}
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            border: '1px solid var(--border)',
          }}
        >
          <Group justify="space-between">
            <Group gap="md">
              <Button
                leftSection={<CheckCircledIcon width={16} height={16} />}
                onClick={saveConfiguration}
                loading={isLoading}
                disabled={!hasChanges}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                Save Configuration
              </Button>
              <Button
                leftSection={<ReloadIcon width={16} height={16} />}
                variant="light"
                onClick={resetToDefaults}
              >
                Reset to Defaults
              </Button>
            </Group>
            <Group gap="md">
              {config.general.maintenanceMode && (
                <Alert icon={<ExclamationTriangleIcon width={16} height={16} />} color="orange">
                  Maintenance Mode Active
                </Alert>
              )}
              <Button
                leftSection={<ReloadIcon width={16} height={16} />}
                variant="light"
                color="orange"
                onClick={restartSystem}
              >
                Restart System
              </Button>
            </Group>
          </Group>
        </Card>

        {/* Configuration Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="general" leftSection={<GearIcon width={14} height={14} />}>
              General
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<LockClosedIcon width={14} height={14} />}>
              Security
            </Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<BellIcon width={14} height={14} />}>
              Notifications
            </Tabs.Tab>
            <Tabs.Tab value="content" leftSection={<GlobeIcon width={14} height={14} />}>
              Content
            </Tabs.Tab>
            <Tabs.Tab value="performance" leftSection={<ReloadIcon width={14} height={14} />}>
              Performance
            </Tabs.Tab>
          </Tabs.List>

          {/* General Settings */}
          <Tabs.Panel value="general" pt="lg">
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
              }}
            >
              <Stack gap="md">
                <Title order={3}>General Platform Settings</Title>
                
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  <TextInput
                    label="Platform Name"
                    value={config.general.platformName}
                    onChange={e => updateConfig('general', 'platformName', e.target.value)}
                  />
                  <TextInput
                    label="Support Email"
                    value={config.general.supportEmail}
                    onChange={e => updateConfig('general', 'supportEmail', e.target.value)}
                  />
                </SimpleGrid>

                <Textarea
                  label="Platform Description"
                  value={config.general.platformDescription}
                  onChange={e => updateConfig('general', 'platformDescription', e.target.value)}
                  minRows={3}
                />

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  <NumberInput
                    label="Max File Upload Size (MB)"
                    value={config.general.maxFileUploadSize}
                    onChange={value => updateConfig('general', 'maxFileUploadSize', value)}
                    min={1}
                    max={100}
                  />
                  <NumberInput
                    label="Session Timeout (minutes)"
                    value={config.general.sessionTimeout}
                    onChange={value => updateConfig('general', 'sessionTimeout', value)}
                    min={5}
                    max={480}
                  />
                </SimpleGrid>

                <Divider />

                <Stack gap="sm">
                  <Title order={4}>User Registration</Title>
                  <Switch
                    label="Allow User Registration"
                    checked={config.general.allowUserRegistration}
                    onChange={e => updateConfig('general', 'allowUserRegistration', e.currentTarget.checked)}
                  />
                  <Switch
                    label="Require Email Verification"
                    checked={config.general.requireEmailVerification}
                    onChange={e => updateConfig('general', 'requireEmailVerification', e.currentTarget.checked)}
                    disabled={!config.general.allowUserRegistration}
                  />
                </Stack>

                <Divider />

                <Stack gap="sm">
                  <Title order={4}>System Status</Title>
                  <Switch
                    label="Maintenance Mode"
                    description="When enabled, only administrators can access the platform"
                    checked={config.general.maintenanceMode}
                    onChange={e => updateConfig('general', 'maintenanceMode', e.currentTarget.checked)}
                  />
                  {config.general.maintenanceMode && (
                    <Alert icon={<ExclamationTriangleIcon width={16} height={16} />} color="orange">
                      Maintenance mode will prevent regular users from accessing the platform
                    </Alert>
                  )}
                </Stack>
              </Stack>
            </Card>
          </Tabs.Panel>

          {/* Security Settings */}
          <Tabs.Panel value="security" pt="lg">
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
              }}
            >
              <Stack gap="md">
                <Title order={3}>Security & Authentication</Title>

                <Stack gap="sm">
                  <Title order={4}>Password Requirements</Title>
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    <NumberInput
                      label="Minimum Password Length"
                      value={config.security.passwordMinLength}
                      onChange={value => updateConfig('security', 'passwordMinLength', value)}
                      min={6}
                      max={32}
                    />
                    <div style={{ paddingTop: '25px' }}>
                      <Switch
                        label="Require Special Characters"
                        checked={config.security.passwordRequireSpecialChar}
                        onChange={e => updateConfig('security', 'passwordRequireSpecialChar', e.currentTarget.checked)}
                      />
                    </div>
                  </SimpleGrid>
                </Stack>

                <Divider />

                <Stack gap="sm">
                  <Title order={4}>Login Security</Title>
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    <NumberInput
                      label="Max Login Attempts"
                      value={config.security.maxLoginAttempts}
                      onChange={value => updateConfig('security', 'maxLoginAttempts', value)}
                      min={3}
                      max={10}
                    />
                    <NumberInput
                      label="Lockout Duration (minutes)"
                      value={config.security.lockoutDuration}
                      onChange={value => updateConfig('security', 'lockoutDuration', value)}
                      min={5}
                      max={120}
                    />
                  </SimpleGrid>
                </Stack>

                <Divider />

                <Stack gap="sm">
                  <Title order={4}>Advanced Security</Title>
                  <Switch
                    label="Two-Factor Authentication"
                    description="Require 2FA for admin and counselor accounts"
                    checked={config.security.twoFactorEnabled}
                    onChange={e => updateConfig('security', 'twoFactorEnabled', e.currentTarget.checked)}
                  />
                  <Switch
                    label="Data Encryption"
                    description="Encrypt sensitive data at rest"
                    checked={config.security.encryptionEnabled}
                    onChange={e => updateConfig('security', 'encryptionEnabled', e.currentTarget.checked)}
                  />
                </Stack>
              </Stack>
            </Card>
          </Tabs.Panel>

          {/* Notifications Settings */}
          <Tabs.Panel value="notifications" pt="lg">
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
              }}
            >
              <Stack gap="md">
                <Title order={3}>Notification Settings</Title>

                <Stack gap="sm">
                  <Title order={4}>Notification Channels</Title>
                  <Switch
                    label="Email Notifications"
                    description="Send notifications via email"
                    checked={config.notifications.emailNotifications}
                    onChange={e => updateConfig('notifications', 'emailNotifications', e.currentTarget.checked)}
                  />
                  <Switch
                    label="SMS Notifications"
                    description="Send notifications via SMS"
                    checked={config.notifications.smsNotifications}
                    onChange={e => updateConfig('notifications', 'smsNotifications', e.currentTarget.checked)}
                  />
                  <Switch
                    label="Push Notifications"
                    description="Send browser push notifications"
                    checked={config.notifications.pushNotifications}
                    onChange={e => updateConfig('notifications', 'pushNotifications', e.currentTarget.checked)}
                  />
                </Stack>

                <Divider />

                <Stack gap="sm">
                  <Title order={4}>Notification Types</Title>
                  <Switch
                    label="Daily Digest"
                    description="Send daily summary emails to users"
                    checked={config.notifications.dailyDigest}
                    onChange={e => updateConfig('notifications', 'dailyDigest', e.currentTarget.checked)}
                  />
                  <Switch
                    label="System Alerts"
                    description="Send critical system alerts to administrators"
                    checked={config.notifications.systemAlerts}
                    onChange={e => updateConfig('notifications', 'systemAlerts', e.currentTarget.checked)}
                  />
                </Stack>

                <Divider />

                <NumberInput
                  label="Notification Retention (days)"
                  description="How long to keep notification records"
                  value={config.notifications.notificationRetentionDays}
                  onChange={value => updateConfig('notifications', 'notificationRetentionDays', value)}
                  min={30}
                  max={365}
                />
              </Stack>
            </Card>
          </Tabs.Panel>

          {/* Content Settings */}
          <Tabs.Panel value="content" pt="lg">
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
              }}
            >
              <Stack gap="md">
                <Title order={3}>Content Management</Title>

                <Stack gap="sm">
                  <Title order={4}>Content Moderation</Title>
                  <Switch
                    label="Automatic Moderation"
                    description="Automatically review content using AI"
                    checked={config.content.autoModeration}
                    onChange={e => updateConfig('content', 'autoModeration', e.currentTarget.checked)}
                  />
                  <Select
                    label="Moderation Strictness"
                    value={config.content.moderationStrictness}
                    onChange={value => updateConfig('content', 'moderationStrictness', value)}
                    data={[
                      { value: 'low', label: 'Low - Minimal filtering' },
                      { value: 'medium', label: 'Medium - Balanced approach' },
                      { value: 'high', label: 'High - Strict filtering' },
                    ]}
                    disabled={!config.content.autoModeration}
                  />
                </Stack>

                <Divider />

                <Stack gap="sm">
                  <Title order={4}>Content Limits</Title>
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    <NumberInput
                      label="Max Question Length (characters)"
                      value={config.content.maxQuestionLength}
                      onChange={value => updateConfig('content', 'maxQuestionLength', value)}
                      min={100}
                      max={5000}
                    />
                    <NumberInput
                      label="Max Answer Length (characters)"
                      value={config.content.maxAnswerLength}
                      onChange={value => updateConfig('content', 'maxAnswerLength', value)}
                      min={100}
                      max={10000}
                    />
                  </SimpleGrid>
                </Stack>

                <Divider />

                <Stack gap="sm">
                  <Title order={4}>Content Policies</Title>
                  <Switch
                    label="Allow Anonymous Questions"
                    description="Users can submit questions without revealing identity"
                    checked={config.content.allowAnonymousQuestions}
                    onChange={e => updateConfig('content', 'allowAnonymousQuestions', e.currentTarget.checked)}
                  />
                  <Switch
                    label="Require Counselor Approval"
                    description="All answers must be approved by counselors"
                    checked={config.content.requireCounselorApproval}
                    onChange={e => updateConfig('content', 'requireCounselorApproval', e.currentTarget.checked)}
                  />
                </Stack>
              </Stack>
            </Card>
          </Tabs.Panel>

          {/* Performance Settings */}
          <Tabs.Panel value="performance" pt="lg">
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
              }}
            >
              <Stack gap="md">
                <Title order={3}>Performance & Scaling</Title>

                <Stack gap="sm">
                  <Title order={4}>Caching</Title>
                  <Switch
                    label="Enable Caching"
                    description="Cache frequently accessed data"
                    checked={config.performance.cacheEnabled}
                    onChange={e => updateConfig('performance', 'cacheEnabled', e.currentTarget.checked)}
                  />
                  <NumberInput
                    label="Cache Expiration (seconds)"
                    value={config.performance.cacheExpiration}
                    onChange={value => updateConfig('performance', 'cacheExpiration', value)}
                    min={300}
                    max={86400}
                    disabled={!config.performance.cacheEnabled}
                  />
                </Stack>

                <Divider />

                <Stack gap="sm">
                  <Title order={4}>Optimization</Title>
                  <Switch
                    label="Enable Compression"
                    description="Compress responses to reduce bandwidth"
                    checked={config.performance.compressionEnabled}
                    onChange={e => updateConfig('performance', 'compressionEnabled', e.currentTarget.checked)}
                  />
                  <Switch
                    label="Enable CDN"
                    description="Use content delivery network for static assets"
                    checked={config.performance.cdnEnabled}
                    onChange={e => updateConfig('performance', 'cdnEnabled', e.currentTarget.checked)}
                  />
                </Stack>

                <Divider />

                <Stack gap="sm">
                  <Title order={4}>Scaling</Title>
                  <NumberInput
                    label="Max Concurrent Users"
                    value={config.performance.maxConcurrentUsers}
                    onChange={value => updateConfig('performance', 'maxConcurrentUsers', value)}
                    min={100}
                    max={10000}
                  />
                  <Switch
                    label="Auto Scaling"
                    description="Automatically scale resources based on demand"
                    checked={config.performance.autoScaling}
                    onChange={e => updateConfig('performance', 'autoScaling', e.currentTarget.checked)}
                  />
                </Stack>

                <Alert icon={<CheckCircledIcon width={16} height={16} />} color="blue">
                  Performance changes may require a system restart to take effect
                </Alert>
              </Stack>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};