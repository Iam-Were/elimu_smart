import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Button,
  Badge,
  SimpleGrid,
  Table,
  Progress,
  Alert,
  Select,
  ActionIcon,
  ScrollArea,
  Pagination,
} from '@mantine/core';
import {
  ExclamationTriangleIcon,
  EyeOpenIcon,
  LockClosedIcon,
  PersonIcon,
  GlobeIcon,
  ReloadIcon,
  DownloadIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons';
import { notifications } from '@mantine/notifications';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  status: 'active' | 'investigating' | 'resolved';
  affectedUsers?: number;
}

interface SecurityMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

export const SecurityMonitoring: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [alertFilter, setAlertFilter] = useState('all');

  const [securityMetrics] = useState<SecurityMetric[]>([
    { name: 'Failed Login Attempts', value: 47, unit: 'attempts', trend: 'down', status: 'good' },
    { name: 'Blocked IPs', value: 12, unit: 'IPs', trend: 'up', status: 'warning' },
    { name: 'Suspicious Activities', value: 3, unit: 'events', trend: 'stable', status: 'good' },
    { name: 'Data Breaches', value: 0, unit: 'incidents', trend: 'stable', status: 'good' },
    { name: 'Malware Detections', value: 2, unit: 'files', trend: 'down', status: 'good' },
    { name: 'Firewall Blocks', value: 234, unit: 'requests', trend: 'up', status: 'good' },
  ]);

  const [securityAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'high',
      title: 'Multiple Failed Login Attempts',
      description: 'Detected 15 failed login attempts from IP 192.168.1.100',
      timestamp: new Date('2024-01-20T14:30:00'),
      source: 'Authentication System',
      status: 'investigating',
      affectedUsers: 3,
    },
    {
      id: '2',
      type: 'medium',
      title: 'Unusual Data Access Pattern',
      description: 'User john.doe accessed 50+ student records within 5 minutes',
      timestamp: new Date('2024-01-20T13:15:00'),
      source: 'Data Access Monitor',
      status: 'active',
      affectedUsers: 1,
    },
    {
      id: '3',
      type: 'low',
      title: 'Outdated Password Policy',
      description: '5 users have not updated passwords in 90+ days',
      timestamp: new Date('2024-01-20T12:00:00'),
      source: 'Password Policy',
      status: 'active',
      affectedUsers: 5,
    },
    {
      id: '4',
      type: 'critical',
      title: 'SQL Injection Attempt',
      description: 'Detected SQL injection attempt on student data endpoint',
      timestamp: new Date('2024-01-20T11:45:00'),
      source: 'WAF',
      status: 'resolved',
      affectedUsers: 0,
    },
    {
      id: '5',
      type: 'medium',
      title: 'Elevated Privilege Usage',
      description: 'Admin user performed bulk operations outside normal hours',
      timestamp: new Date('2024-01-20T10:30:00'),
      source: 'Privilege Monitor',
      status: 'resolved',
      affectedUsers: 0,
    },
  ]);

  const filteredAlerts = securityAlerts.filter(alert => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'active') return alert.status === 'active';
    if (alertFilter === 'critical') return alert.type === 'critical';
    return alert.type === alertFilter;
  });

  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * 5, currentPage * 5);
  const totalPages = Math.ceil(filteredAlerts.length / 5);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'red';
      case 'investigating': return 'orange';
      case 'resolved': return 'green';
      default: return 'gray';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good': return 'green';
      case 'warning': return 'yellow';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
    notifications.show({
      title: 'Data Refreshed',
      message: 'Security monitoring data has been updated',
      color: 'green',
    });
  };

  const exportReport = () => {
    notifications.show({
      title: 'Report Generated',
      message: 'Security report has been exported successfully',
      color: 'green',
    });
  };

  const resolveAlert = () => {
    notifications.show({
      title: 'Alert Resolved',
      message: 'Security alert has been marked as resolved',
      color: 'green',
    });
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="2rem">
              Security Monitoring
            </Title>
            <Text size="lg" c="dimmed">
              Real-time security monitoring and threat detection
            </Text>
          </Stack>
          <Group gap="sm">
            <Select
              data={[
                { value: '1h', label: 'Last Hour' },
                { value: '24h', label: 'Last 24 Hours' },
                { value: '7d', label: 'Last 7 Days' },
                { value: '30d', label: 'Last 30 Days' },
              ]}
              value={selectedTimeframe}
              onChange={(value) => setSelectedTimeframe(value || '24h')}
            />
            <Button
              leftSection={<ReloadIcon width={16} height={16} />}
              onClick={refreshData}
              loading={refreshing}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              }}
            >
              Refresh
            </Button>
            <Button
              leftSection={<DownloadIcon width={16} height={16} />}
              variant="light"
              onClick={exportReport}
            >
              Export Report
            </Button>
          </Group>
        </Group>

        {/* Security Overview Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {securityMetrics.map((metric, index) => (
            <Card
              key={index}
              padding="lg"
              radius="md"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">{metric.name}</Text>
                  <Badge
                    size="xs"
                    color={getMetricColor(metric.status)}
                    variant="filled"
                  >
                    {metric.status.toUpperCase()}
                  </Badge>
                </Group>
                <Group justify="space-between" align="flex-end">
                  <Stack gap={0}>
                    <Text fw={700} size="xl" style={{ color: 'var(--primary)' }}>
                      {metric.value}
                    </Text>
                    <Text size="xs" c="dimmed">{metric.unit}</Text>
                  </Stack>
                  <Text
                    size="sm"
                    c={metric.trend === 'up' ? 'red' : metric.trend === 'down' ? 'green' : 'dimmed'}
                  >
                    {getTrendIcon(metric.trend)}
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

        {/* Security Status Overview */}
        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md">
          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ExclamationTriangleIcon width={32} height={32} style={{ color: 'var(--success)' }} />
              <Text size="xs" c="dimmed" ta="center">Security Score</Text>
              <Text fw={700} size="xl" style={{ color: 'var(--success)' }}>
                94%
              </Text>
              <Badge size="sm" color="green" variant="filled">Excellent</Badge>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <LockClosedIcon width={32} height={32} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">Active Sessions</Text>
              <Text fw={700} size="xl" style={{ color: 'var(--primary)' }}>
                127
              </Text>
              <Badge size="sm" color="blue" variant="filled">Normal</Badge>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <GlobeIcon width={32} height={32} style={{ color: 'var(--secondary)' }} />
              <Text size="xs" c="dimmed" ta="center">Network Events</Text>
              <Text fw={700} size="xl" style={{ color: 'var(--secondary)' }}>
                1,247
              </Text>
              <Badge size="sm" color="yellow" variant="filled">Monitoring</Badge>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <PersonIcon width={32} height={32} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">User Anomalies</Text>
              <Text fw={700} size="xl" style={{ color: 'var(--primary)' }}>
                3
              </Text>
              <Badge size="sm" color="blue" variant="filled">Low Risk</Badge>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Security Alerts */}
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
            <Group justify="space-between">
              <Title order={3}>Security Alerts</Title>
              <Group gap="sm">
                <Select
                  placeholder="Filter alerts"
                  data={[
                    { value: 'all', label: 'All Alerts' },
                    { value: 'active', label: 'Active Only' },
                    { value: 'critical', label: 'Critical Only' },
                    { value: 'high', label: 'High Priority' },
                    { value: 'medium', label: 'Medium Priority' },
                    { value: 'low', label: 'Low Priority' },
                  ]}
                  value={alertFilter}
                  onChange={(value) => setAlertFilter(value || 'all')}
                  style={{ minWidth: 150 }}
                />
              </Group>
            </Group>

            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Priority</Table.Th>
                    <Table.Th>Alert</Table.Th>
                    <Table.Th>Source</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Time</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedAlerts.map((alert) => (
                    <Table.Tr key={alert.id}>
                      <Table.Td>
                        <Badge
                          size="sm"
                          color={getAlertColor(alert.type)}
                          variant="filled"
                        >
                          {alert.type.toUpperCase()}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={2}>
                          <Text fw={500} size="sm">{alert.title}</Text>
                          <Text size="xs" c="dimmed">{alert.description}</Text>
                          {alert.affectedUsers && alert.affectedUsers > 0 && (
                            <Text size="xs" c="orange">
                              Affects {alert.affectedUsers} user(s)
                            </Text>
                          )}
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{alert.source}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          size="sm"
                          color={getStatusColor(alert.status)}
                          variant="secondary"
                        >
                          {alert.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" c="dimmed">
                          {alert.timestamp.toLocaleString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            color="blue"
                            onClick={() => {
                              notifications.show({
                                title: 'Alert Details',
                                message: alert.description,
                                color: 'blue',
                              });
                            }}
                          >
                            <EyeOpenIcon width={14} height={14} />
                          </ActionIcon>
                          {alert.status !== 'resolved' && (
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              color="green"
                              onClick={() => resolveAlert()}
                            >
                              <CheckCircledIcon width={14} height={14} />
                            </ActionIcon>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            {totalPages > 1 && (
              <Group justify="center">
                <Pagination
                  total={totalPages}
                  value={currentPage}
                  onChange={setCurrentPage}
                  size="sm"
                />
              </Group>
            )}
          </Stack>
        </Card>

        {/* Real-time Security Status */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
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
              <Title order={4}>Firewall Status</Title>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Incoming Traffic</Text>
                  <Badge color="green" variant="filled">Protected</Badge>
                </Group>
                <Progress value={85} color="green" />
                <Text size="xs" c="dimmed">85% of traffic allowed, 15% blocked</Text>
              </Stack>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Outgoing Traffic</Text>
                  <Badge color="green" variant="filled">Monitored</Badge>
                </Group>
                <Progress value={92} color="green" />
                <Text size="xs" c="dimmed">92% normal traffic patterns</Text>
              </Stack>
            </Stack>
          </Card>

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
              <Title order={4}>Authentication Security</Title>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Two-Factor Authentication</Text>
                  <Badge color="green" variant="filled">87% Adoption</Badge>
                </Group>
                <Progress value={87} color="green" />
              </Stack>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Password Strength</Text>
                  <Badge color="yellow" variant="filled">Good</Badge>
                </Group>
                <Progress value={73} color="yellow" />
                <Text size="xs" c="dimmed">73% of users have strong passwords</Text>
              </Stack>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* System Alerts */}
        <Alert
          icon={<ExclamationTriangleIcon width={16} height={16} />}
          title="Security Notice"
          color="blue"
        >
          All systems are operating normally. Security monitoring is active and all protective measures are in place.
          Last security scan completed: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}.
        </Alert>
      </Stack>
    </Container>
  );
};