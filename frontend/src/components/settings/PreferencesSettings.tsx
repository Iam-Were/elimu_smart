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
import { useThemeContext } from '../../hooks/useThemeContext';

interface PreferencesSettingsProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
}

export const PreferencesSettings: React.FC<PreferencesSettingsProps> = () => {
  const { isDark, toggleDarkMode } = useThemeContext();
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Africa/Nairobi');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <Stack gap="xl">
      {/* Appearance */}
      <Card>
        <Stack gap="md">
          <Text size="lg" fw={600}>
            Appearance
          </Text>
          
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500}>Dark Mode</Text>
              <Text size="xs" c="dimmed">Use dark theme for the interface</Text>
            </div>
            <Switch
              checked={isDark}
              onChange={toggleDarkMode}
            />
          </Group>
        </Stack>
      </Card>

      {/* Language & Region */}
      <Card>
        <Stack gap="md">
          <Text size="lg" fw={600}>
            Language & Region
          </Text>
          
          <Select
            label="Language"
            description="Choose your preferred language"
            value={language}
            onChange={(value) => setLanguage(value || 'en')}
            data={[
              { value: 'en', label: 'English' },
              { value: 'sw', label: 'Kiswahili' },
              { value: 'fr', label: 'Français' },
            ]}
          />

          <Select
            label="Timezone"
            description="Your local timezone for scheduling"
            value={timezone}
            onChange={(value) => setTimezone(value || 'Africa/Nairobi')}
            data={[
              { value: 'Africa/Nairobi', label: 'East Africa Time (EAT)' },
              { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
              { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
            ]}
          />

          <Select
            label="Date Format"
            description="How dates should be displayed"
            value={dateFormat}
            onChange={(value) => setDateFormat(value || 'DD/MM/YYYY')}
            data={[
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2023)' },
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2023)' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2023-12-31)' },
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
          Preferences updated successfully!
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