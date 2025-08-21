import React, { useState } from 'react';
import {
  Stack,
  Group,
  Text,
  Card,
  Alert,
  Button,
  Modal,
  TextInput,
} from '@mantine/core';
import {
  DownloadIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from '@radix-ui/react-icons';

interface AccountManagementProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
}

export const AccountManagement: React.FC<AccountManagementProps> = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    // Simulate file download
    const element = document.createElement('a');
    element.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ message: 'Your data export' }));
    element.download = 'elimu-smart-data.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteAccount = () => {
    if (confirmText === 'DELETE') {
      console.log('Account deletion confirmed');
      setDeleteModalOpen(false);
    }
  };

  return (
    <Stack gap="xl">
      {/* Data Export */}
      <Card>
        <Stack gap="md">
          <Group gap="sm">
            <DownloadIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
            <Text size="lg" fw={600}>
              Export Your Data
            </Text>
          </Group>
          
          <Text size="sm" c="dimmed">
            Download a copy of all your data including profile information, assessment results, 
            and activity history. This may take a few minutes to prepare.
          </Text>

          <Alert color="blue" variant="light">
            Your data export will include your profile, assessment results, messages, and activity logs. 
            This information will be provided in JSON format.
          </Alert>

          <Group justify="flex-start">
            <Button
              leftSection={<DownloadIcon width={16} height={16} />}
              onClick={handleExportData}
              loading={isExporting}
            >
              {isExporting ? 'Preparing Export...' : 'Export My Data'}
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Account Deactivation */}
      <Card>
        <Stack gap="md">
          <Group gap="sm">
            <ExclamationTriangleIcon width={20} height={20} style={{ color: 'var(--warning)' }} />
            <Text size="lg" fw={600}>
              Deactivate Account
            </Text>
          </Group>
          
          <Text size="sm" c="dimmed">
            Temporarily deactivate your account. You can reactivate it anytime by logging back in. 
            Your data will be preserved.
          </Text>

          <Alert color="yellow" variant="light">
            Deactivating your account will hide your profile and prevent others from seeing your information. 
            You can reactivate anytime by logging in again.
          </Alert>

          <Group justify="flex-start">
            <Button
              variant="light"
              color="yellow"
              leftSection={<ExclamationTriangleIcon width={16} height={16} />}
            >
              Deactivate Account
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Account Deletion */}
      <Card style={{ borderColor: 'var(--destructive)', borderWidth: '2px' }}>
        <Stack gap="md">
          <Group gap="sm">
            <TrashIcon width={20} height={20} style={{ color: 'var(--destructive)' }} />
            <Text size="lg" fw={600} c="red">
              Delete Account
            </Text>
          </Group>
          
          <Text size="sm" c="dimmed">
            Permanently delete your account and all associated data. This action cannot be undone.
          </Text>

          <Alert color="red" variant="light">
            <Text fw={600} mb="xs">Warning: This action is permanent!</Text>
            <Text size="sm">
              Deleting your account will permanently remove all your data including:
            </Text>
            <ul style={{ margin: '8px 0 0 16px', fontSize: '14px' }}>
              <li>Profile information and settings</li>
              <li>Assessment results and progress</li>
              <li>Messages and conversation history</li>
              <li>All activity logs and preferences</li>
            </ul>
          </Alert>

          <Group justify="flex-start">
            <Button
              color="red"
              leftSection={<TrashIcon width={16} height={16} />}
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete My Account
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Account"
        centered
        size="md"
      >
        <Stack gap="md">
          <Alert color="red" variant="light">
            <Text fw={600} mb="xs">This action cannot be undone!</Text>
            <Text size="sm">
              All your data will be permanently deleted and cannot be recovered.
            </Text>
          </Alert>

          <TextInput
            label="Type 'DELETE' to confirm"
            placeholder="DELETE"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            error={confirmText && confirmText !== 'DELETE' ? 'Please type DELETE exactly' : ''}
          />

          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              onClick={() => {
                setDeleteModalOpen(false);
                setConfirmText('');
              }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDeleteAccount}
              disabled={confirmText !== 'DELETE'}
              leftSection={<TrashIcon width={16} height={16} />}
            >
              Delete Account
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};