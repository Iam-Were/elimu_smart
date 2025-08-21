import React, { useState } from 'react';
import {
  Stack,
  Group,
  Text,
  Switch,
  Card,
  Select,
  Alert,
  Button,
} from '@mantine/core';
import {
  CheckCircledIcon,
} from '@radix-ui/react-icons';

interface NotificationSettingsProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    careerUpdates: true,
    assessmentReminders: true,
    counselorMessages: true,
    systemUpdates: false,
    promotions: false,
  });


  const [frequency, setFrequency] = useState('immediate');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <Stack gap="xl">
      {/* Email Notifications */}
      <Card>
        <Stack gap="md">
          <Text size="lg" fw={600}>
            Email Notifications
          </Text>
          
          <Stack gap="sm">
            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>Career Updates</Text>
                <Text size="xs" c="dimmed">New career opportunities and guidance</Text>
              </div>
              <Switch
                checked={emailNotifications.careerUpdates}
                onChange={(e) => setEmailNotifications(prev => ({ ...prev, careerUpdates: e.currentTarget.checked }))}
              />
            </Group>

            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>Assessment Reminders</Text>
                <Text size="xs" c="dimmed">Reminders to complete pending assessments</Text>
              </div>
              <Switch
                checked={emailNotifications.assessmentReminders}
                onChange={(e) => setEmailNotifications(prev => ({ ...prev, assessmentReminders: e.currentTarget.checked }))}
              />
            </Group>

            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>Counselor Messages</Text>
                <Text size="xs" c="dimmed">Messages from your career counselor</Text>
              </div>
              <Switch
                checked={emailNotifications.counselorMessages}
                onChange={(e) => setEmailNotifications(prev => ({ ...prev, counselorMessages: e.currentTarget.checked }))}
              />
            </Group>

            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>System Updates</Text>
                <Text size="xs" c="dimmed">Important platform updates and maintenance</Text>
              </div>
              <Switch
                checked={emailNotifications.systemUpdates}
                onChange={(e) => setEmailNotifications(prev => ({ ...prev, systemUpdates: e.currentTarget.checked }))}
              />
            </Group>

            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>Promotions & Features</Text>
                <Text size="xs" c="dimmed">New features and promotional content</Text>
              </div>
              <Switch
                checked={emailNotifications.promotions}
                onChange={(e) => setEmailNotifications(prev => ({ ...prev, promotions: e.currentTarget.checked }))}
              />
            </Group>
          </Stack>
        </Stack>
      </Card>

      {/* Notification Frequency */}
      <Card>
        <Stack gap="md">
          <Text size="lg" fw={600}>
            Notification Frequency
          </Text>
          
          <Select
            label="Email Digest Frequency"
            description="How often would you like to receive email summaries?"
            value={frequency}
            onChange={(value) => setFrequency(value || 'immediate')}
            data={[
              { value: 'immediate', label: 'Immediate' },
              { value: 'daily', label: 'Daily Digest' },
              { value: 'weekly', label: 'Weekly Summary' },
              { value: 'never', label: 'Never' },
            ]}
          />
        </Stack>
      </Card>

      {saveStatus === 'success' && (
        <Alert
          icon={<CheckCircledIcon width={16} height={16} />}
          color="green"
          variant="light"
        >
          Notification preferences saved successfully!
        </Alert>
      )}

      <Group justify="flex-end">
        <Button
          onClick={handleSave}
          leftSection={<CheckCircledIcon width={16} height={16} />}
        >
          Save Preferences
        </Button>
      </Group>
    </Stack>
  );
};