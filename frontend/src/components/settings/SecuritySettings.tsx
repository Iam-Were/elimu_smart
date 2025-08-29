import React, { useState } from 'react';
import {
  Stack,
  Group,
  Text,
  Button,
  Card,
  Badge,
  Switch,
  Alert,
  PasswordInput,
  Table,
} from '@mantine/core';
import {
  LockClosedIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from '@radix-ui/react-icons';

interface SecuritySettingsProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const activeSessions = [
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'Nairobi, Kenya',
      lastActive: '2 minutes ago',
      current: true,
    },
  ];

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setSaveStatus('error');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    console.log('Revoking session:', sessionId);
  };

  const hasPasswordChanges = currentPassword || newPassword || confirmPassword;

  return (
    <Stack gap="xl">
      {/* Password Change */}
      <Card>
        <Stack gap="md">
          <Group gap="sm">
            <LockClosedIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
            <Text size="lg" fw={600}>
              Change Password
            </Text>
          </Group>
          
          <Stack gap="md">
            <PasswordInput
              label="Current Password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Stack>

          <Group justify="flex-end">
            <Button
              onClick={handlePasswordChange}
              loading={isLoading}
              disabled={!hasPasswordChanges || !currentPassword || !newPassword || !confirmPassword}
              leftSection={<CheckCircledIcon width={16} height={16} />}
            >
              Update Password
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Group gap="sm" mb="xs">
                <LockClosedIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
                <Text size="lg" fw={600}>
                  Two-Factor Authentication
                </Text>
                <Badge color={twoFactorEnabled ? 'green' : 'gray'} variant="light">
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                Add an extra layer of security to your account by requiring a code from your phone
              </Text>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.currentTarget.checked)}
              size="md"
            />
          </Group>

          {twoFactorEnabled && (
            <Alert color="green" variant="light">
              Two-factor authentication is enabled. You'll need your authenticator app to sign in.
            </Alert>
          )}
        </Stack>
      </Card>

      {/* Active Sessions */}
      <Card>
        <Stack gap="md">
          <Group gap="sm">
            <Text size="lg" fw={600}>
              Active Sessions
            </Text>
            <Badge variant="light">
              {activeSessions.length} active
            </Badge>
          </Group>
          
          <Text size="sm" c="dimmed">
            These are the devices and locations where you're currently signed in
          </Text>

          <div style={{ overflowX: 'auto' }}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Device</Table.Th>
                  <Table.Th>Location</Table.Th>
                  <Table.Th>Last Active</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {activeSessions.map((session) => (
                  <Table.Tr key={session.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <Text size="sm">{session.device}</Text>
                        {session.current && (
                          <Badge size="xs" color="green">
                            Current
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">{session.location}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">{session.lastActive}</Text>
                    </Table.Td>
                    <Table.Td>
                      {!session.current && (
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          leftSection={<TrashIcon width={14} height={14} />}
                          onClick={() => handleRevokeSession(session.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>

          <Group justify="flex-end">
            <Button variant="light" color="red">
              Sign Out All Other Devices
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Status Messages */}
      {saveStatus === 'success' && (
        <Alert
          icon={<CheckCircledIcon width={16} height={16} />}
          color="green"
          variant="light"
        >
          Security settings updated successfully!
        </Alert>
      )}

      {saveStatus === 'error' && (
        <Alert
          icon={<ExclamationTriangleIcon width={16} height={16} />}
          color="red"
          variant="light"
        >
          Failed to update security settings. Please check your current password and try again.
        </Alert>
      )}
    </Stack>
  );
};