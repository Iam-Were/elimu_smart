import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Button,
  Progress,
  Alert,
  SimpleGrid,
  Badge,
  Select,
  Switch,
} from '@mantine/core';
import {
  ReloadIcon,
  DownloadIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  TrashIcon,
  GearIcon,
} from '@radix-ui/react-icons';
import { toast } from 'sonner';

export const MaintenanceTools: React.FC = () => {
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [lastBackup] = useState(new Date('2024-01-20T02:00:00'));
  const [systemHealth] = useState(85);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [cleanupInProgress, setCleanupInProgress] = useState(false);

  const startBackup = async () => {
    setIsBackupRunning(true);
    setBackupProgress(0);

    // Simulate backup progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setBackupProgress(i);
    }

    setIsBackupRunning(false);
    toast.success('Backup Completed', {
      description: 'System backup has been created successfully'
    });
  };

  const runMaintenance = async () => {
    setCleanupInProgress(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setCleanupInProgress(false);

    toast.success('Maintenance Complete', {
      description: 'System cleanup and optimization completed'
    });
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="2rem">
              Maintenance & Backup Tools
            </Title>
            <Text size="lg" c="dimmed">
              System maintenance, backup, and monitoring tools
            </Text>
          </Stack>
          <Badge
            size="lg"
            color={systemHealth > 80 ? 'green' : systemHealth > 60 ? 'yellow' : 'red'}
            variant="filled"
          >
            System Health: {systemHealth}%
          </Badge>
        </Group>

        {/* System Health Overview */}
        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md">
          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <GearIcon width={24} height={24} style={{ color: 'purple' }} />
              <Text size="xs" c="dimmed" ta="center">Database Size</Text>
              <Text fw={700} size="lg" style={{ color: 'purple' }}>
                2.4 GB
              </Text>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <DownloadIcon width={24} height={24} style={{ color: 'purple' }} />
              <Text size="xs" c="dimmed" ta="center">Last Backup</Text>
              <Text fw={700} size="sm" style={{ color: 'purple' }} ta="center">
                {lastBackup.toLocaleDateString()}
              </Text>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ClockIcon width={24} height={24} style={{ color: 'purple' }} />
              <Text size="xs" c="dimmed" ta="center">Uptime</Text>
              <Text fw={700} size="lg" style={{ color: 'purple' }}>
                99.8%
              </Text>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <TrashIcon width={24} height={24} style={{ color: 'purple' }} />
              <Text size="xs" c="dimmed" ta="center">Cache Usage</Text>
              <Text fw={700} size="lg" style={{ color: 'purple' }}>
                67%
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Backup Management */}
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
            <Title order={3}>Backup Management</Title>
            
            <Group justify="space-between">
              <Stack gap="xs">
                <Text fw={500}>Automatic Backups</Text>
                <Switch
                  checked={autoBackupEnabled}
                  onChange={e => setAutoBackupEnabled(e.currentTarget.checked)}
                  label="Enable automatic daily backups"
                />
              </Stack>
              <Group gap="sm">
                <Select
                  data={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                  defaultValue="daily"
                  disabled={!autoBackupEnabled}
                />
                <Button
                  leftSection={<DownloadIcon width={16} height={16} />}
                  onClick={startBackup}
                  loading={isBackupRunning}
                  style={{
                    backgroundColor: 'var(--primary)',
                    // color: 'var(--primary-foreground)',
                  }}
                >
                  Create Backup Now
                </Button>
              </Group>
            </Group>

            {isBackupRunning && (
              <Stack gap="xs">
                <Text size="sm">Creating system backup...</Text>
                <Progress value={backupProgress} />
              </Stack>
            )}

            <Alert icon={<CheckCircledIcon width={16} height={16} />} color="green">
              Last successful backup: {lastBackup.toLocaleDateString()} at {lastBackup.toLocaleTimeString()}
            </Alert>
          </Stack>
        </Card>

        {/* Maintenance Tools */}
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
            <Title order={3}>System Maintenance</Title>
            
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              <Stack gap="sm">
                <Text fw={500}>Database Optimization</Text>
                <Text size="sm" c="dimmed">
                  Optimize database performance and clean up unused data
                </Text>
                <Button
                  leftSection={<GearIcon width={16} height={16} />}
                  variant="light"
                  onClick={runMaintenance}
                  loading={cleanupInProgress}
                >
                  Optimize Database
                </Button>
              </Stack>

              <Stack gap="sm">
                <Text fw={500}>Cache Management</Text>
                <Text size="sm" c="dimmed">
                  Clear system cache and rebuild indexes
                </Text>
                <Button
                  leftSection={<TrashIcon width={16} height={16} />}
                  variant="light"
                  onClick={() => toast.success('Cache Cleared', {
                    description: 'System cache has been cleared successfully'
                  })}
                >
                  Clear Cache
                </Button>
              </Stack>

              <Stack gap="sm">
                <Text fw={500}>Log Cleanup</Text>
                <Text size="sm" c="dimmed">
                  Archive old logs and free up storage space
                </Text>
                <Button
                  leftSection={<TrashIcon width={16} height={16} />}
                  variant="light"
                  onClick={() => toast.success('Logs Archived', {
                    description: 'Old log files have been archived'
                  })}
                >
                  Archive Logs
                </Button>
              </Stack>

              <Stack gap="sm">
                <Text fw={500}>System Restart</Text>
                <Text size="sm" c="dimmed">
                  Restart system services for optimal performance
                </Text>
                <Button
                  leftSection={<ReloadIcon width={16} height={16} />}
                  variant="light"
                  color="orange"
                  onClick={() => toast.info('Restart Scheduled', {
                    description: 'System restart scheduled for 2 AM'
                  })}
                >
                  Schedule Restart
                </Button>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Card>

        {/* System Monitoring */}
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
            <Title order={3}>System Monitoring</Title>
            
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
              <Stack gap="xs">
                <Text fw={500}>CPU Usage</Text>
                <Progress value={23} color="green" />
                <Text size="xs" c="dimmed">23% - Normal</Text>
              </Stack>

              <Stack gap="xs">
                <Text fw={500}>Memory Usage</Text>
                <Progress value={67} color="yellow" />
                <Text size="xs" c="dimmed">67% - Moderate</Text>
              </Stack>

              <Stack gap="xs">
                <Text fw={500}>Disk Usage</Text>
                <Progress value={45} color="green" />
                <Text size="xs" c="dimmed">45% - Good</Text>
              </Stack>
            </SimpleGrid>

            <Alert icon={<ExclamationTriangleIcon width={16} height={16} />} color="blue">
              System monitoring is active. Alerts will be sent for any critical issues.
            </Alert>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};