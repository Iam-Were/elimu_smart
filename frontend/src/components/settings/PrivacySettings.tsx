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

interface PrivacySettingsProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = () => {
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [dataSharing, setDataSharing] = useState({
    analytics: true,
    recommendations: true,
    research: false,
    marketing: false,
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <Stack gap="xl">
      {/* Profile Visibility */}
      <Card>
        <Stack gap="md">
          <Text size="lg" fw={600}>
            Profile Visibility
          </Text>
          
          <Select
            label="Who can see your profile?"
            description="Control who can view your profile information"
            value={profileVisibility}
            onChange={(value) => setProfileVisibility(value || 'public')}
            data={[
              { value: 'public', label: 'Public - Anyone can see your profile' },
              { value: 'counselors', label: 'Counselors Only - Only career counselors' },
              { value: 'private', label: 'Private - Only you can see your profile' },
            ]}
          />
        </Stack>
      </Card>

      {/* Data Sharing */}
      <Card>
        <Stack gap="md">
          <Text size="lg" fw={600}>
            Data Sharing Preferences
          </Text>
          
          <Stack gap="sm">
            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>Usage Analytics</Text>
                <Text size="xs" c="dimmed">Help improve the platform with anonymous usage data</Text>
              </div>
              <Switch
                checked={dataSharing.analytics}
                onChange={(e) => setDataSharing(prev => ({ ...prev, analytics: e.currentTarget.checked }))}
              />
            </Group>

            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>Personalized Recommendations</Text>
                <Text size="xs" c="dimmed">Use your data to provide better career recommendations</Text>
              </div>
              <Switch
                checked={dataSharing.recommendations}
                onChange={(e) => setDataSharing(prev => ({ ...prev, recommendations: e.currentTarget.checked }))}
              />
            </Group>

            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>Educational Research</Text>
                <Text size="xs" c="dimmed">Contribute anonymized data to educational research</Text>
              </div>
              <Switch
                checked={dataSharing.research}
                onChange={(e) => setDataSharing(prev => ({ ...prev, research: e.currentTarget.checked }))}
              />
            </Group>

            <Group justify="space-between">
              <div>
                <Text size="sm" fw={500}>Marketing Communications</Text>
                <Text size="xs" c="dimmed">Receive targeted offers and communications</Text>
              </div>
              <Switch
                checked={dataSharing.marketing}
                onChange={(e) => setDataSharing(prev => ({ ...prev, marketing: e.currentTarget.checked }))}
              />
            </Group>
          </Stack>
        </Stack>
      </Card>

      {saveStatus === 'success' && (
        <Alert
          icon={<CheckCircledIcon width={16} height={16} />}
          color="green"
          variant="light"
        >
          Privacy settings updated successfully!
        </Alert>
      )}

      <Group justify="flex-end">
        <Button
          onClick={handleSave}
          leftSection={<CheckCircledIcon width={16} height={16} />}
        >
          Save Settings
        </Button>
      </Group>
    </Stack>
  );
};