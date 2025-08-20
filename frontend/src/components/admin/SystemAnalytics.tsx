import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Grid,
  Stack,
  Badge,
  Group,
  Button,
  Select,
  SimpleGrid,
  Alert,
  RingProgress,
  Tabs,
} from '@mantine/core';
import {
  BarChartIcon,
  ArrowUpIcon,
  PersonIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  TargetIcon,
  DownloadIcon,
  GlobeIcon,
  ActivityLogIcon,
} from '@radix-ui/react-icons';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Mock data for system analytics
const userGrowthData = [
  { month: 'Aug', students: 1845, counselors: 38, admins: 6, total: 1889 },
  { month: 'Sep', students: 2156, counselors: 41, admins: 7, total: 2204 },
  { month: 'Oct', students: 2398, counselors: 43, admins: 8, total: 2449 },
  { month: 'Nov', students: 2456, counselors: 45, admins: 8, total: 2509 },
  { month: 'Dec', students: 2547, counselors: 47, admins: 8, total: 2602 },
];

const systemPerformanceData = [
  { time: '00:00', cpu: 15, memory: 45, disk: 67 },
  { time: '04:00', cpu: 12, memory: 48, disk: 67 },
  { time: '08:00', cpu: 35, memory: 62, disk: 68 },
  { time: '12:00', cpu: 28, memory: 58, disk: 68 },
  { time: '16:00', cpu: 42, memory: 71, disk: 69 },
  { time: '20:00', cpu: 23, memory: 55, disk: 69 },
];

const engagementData = [
  { name: 'Active Users', value: 1923, color: '#22c55e' },
  { name: 'Moderate Users', value: 456, color: '#eab308' },
  { name: 'Low Activity', value: 234, color: '#ef4444' },
];

const platformUsageData = [
  { feature: 'Career Assessment', usage: 89, users: 2156 },
  { feature: 'Subject Mapper', usage: 76, users: 1834 },
  { feature: 'Q&A System', usage: 67, users: 1612 },
  { feature: 'Session Booking', usage: 54, users: 1304 },
  { feature: 'Resource Library', usage: 43, users: 1036 },
];

const systemMetrics = {
  totalUsers: 2847,
  activeUsers: 1923,
  newUsersToday: 45,
  systemUptime: 99.8,
  averageResponseTime: 245,
  errorRate: 0.08,
  storageUsed: 67.4,
  bandwidthUsage: 89.2,
  activeConnections: 1234,
  questionsAnswered: 5678,
  sessionsCompleted: 892,
  assessmentsCompleted: 3456,
};

const recentSystemEvents = [
  {
    id: 1,
    type: 'info',
    message: 'System backup completed successfully',
    timestamp: '2 minutes ago',
  },
  {
    id: 2,
    type: 'warning',
    message: 'High memory usage detected on server-02',
    timestamp: '15 minutes ago',
  },
  {
    id: 3,
    type: 'success',
    message: 'Database optimization completed',
    timestamp: '1 hour ago',
  },
  {
    id: 4,
    type: 'error',
    message: 'Email service temporarily unavailable',
    timestamp: '2 hours ago',
  },
];

export const SystemAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [activeTab, setActiveTab] = useState<string | null>('overview');

  const generateReport = (type: string) => {
    console.log(`Generating ${type} report...`);
    // In a real app, this would generate and download a report
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'green';
      case 'warning':
        return 'yellow';
      case 'error':
        return 'red';
      case 'info':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="2rem">
              System Analytics & Reporting
            </Title>
            <Text size="lg" c="dimmed">
              Platform performance and usage insights
            </Text>
          </Stack>
          <Group gap="sm">
            <Select
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value || 'last-30-days')}
              data={[
                { value: 'last-7-days', label: 'Last 7 Days' },
                { value: 'last-30-days', label: 'Last 30 Days' },
                { value: 'last-90-days', label: 'Last 90 Days' },
                { value: 'last-year', label: 'Last Year' },
              ]}
              style={{ minWidth: 150 }}
            />
            <Button
              leftSection={<DownloadIcon width={16} height={16} />}
              variant="light"
              onClick={() => generateReport('system-analytics')}
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
              }}
            >
              Export Report
            </Button>
          </Group>
        </Group>

        {/* System Health Overview */}
        <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="md">
          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <PersonIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">Total Users</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                {formatNumber(systemMetrics.totalUsers)}
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ArrowUpIcon width={20} height={20} style={{ color: 'var(--success)' }} />
              <Text size="xs" c="dimmed" ta="center">Active Today</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--success)' }}>
                {formatNumber(systemMetrics.activeUsers)}
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <TargetIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">Uptime</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--success)' }}>
                {systemMetrics.systemUptime}%
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ClockIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">Response Time</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                {systemMetrics.averageResponseTime}ms
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ExclamationTriangleIcon width={20} height={20} style={{ color: systemMetrics.errorRate < 1 ? 'var(--success)' : 'var(--destructive)' }} />
              <Text size="xs" c="dimmed" ta="center">Error Rate</Text>
              <Text fw={700} size="lg" style={{ color: systemMetrics.errorRate < 1 ? 'var(--success)' : 'var(--destructive)' }}>
                {systemMetrics.errorRate}%
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <GlobeIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">Connections</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                {formatNumber(systemMetrics.activeConnections)}
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<BarChartIcon width={14} height={14} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="users" leftSection={<PersonIcon width={14} height={14} />}>
              User Analytics
            </Tabs.Tab>
            <Tabs.Tab value="performance" leftSection={<TargetIcon width={14} height={14} />}>
              Performance
            </Tabs.Tab>
            <Tabs.Tab value="events" leftSection={<ActivityLogIcon width={14} height={14} />}>
              System Events
            </Tabs.Tab>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Panel value="overview" pt="lg">
            <Grid>
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                  <Stack gap="md">
                    <Title order={4}>User Growth Trends</Title>
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                        <YAxis stroke="var(--muted-foreground)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card)', 
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Area type="monotone" dataKey="students" stackId="1" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} name="Students" />
                        <Area type="monotone" dataKey="counselors" stackId="1" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.6} name="Counselors" />
                        <Area type="monotone" dataKey="admins" stackId="1" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.6} name="Admins" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                  <Stack gap="md">
                    <Title order={4}>User Engagement</Title>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={engagementData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        >
                          {engagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* User Analytics Tab */}
          <Tabs.Panel value="users" pt="lg">
            <Grid>
              <Grid.Col span={12}>
                <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                  <Stack gap="md">
                    <Title order={4}>Platform Feature Usage</Title>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={platformUsageData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis type="number" stroke="var(--muted-foreground)" />
                        <YAxis type="category" dataKey="feature" stroke="var(--muted-foreground)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card)', 
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="usage" fill="var(--primary)" name="Usage %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* Performance Tab */}
          <Tabs.Panel value="performance" pt="lg">
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                  <Stack gap="md">
                    <Title order={4}>System Performance (Last 24 Hours)</Title>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={systemPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="time" stroke="var(--muted-foreground)" />
                        <YAxis stroke="var(--muted-foreground)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card)', 
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Line type="monotone" dataKey="cpu" stroke="var(--primary)" name="CPU %" />
                        <Line type="monotone" dataKey="memory" stroke="var(--secondary)" name="Memory %" />
                        <Line type="monotone" dataKey="disk" stroke="var(--accent)" name="Disk %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="md">
                  <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                    <Stack gap="sm" align="center">
                      <RingProgress
                        size={120}
                        thickness={12}
                        sections={[{ value: systemMetrics.storageUsed, color: 'var(--primary)' }]}
                        label={
                          <Text ta="center" fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                            {systemMetrics.storageUsed}%
                          </Text>
                        }
                      />
                      <Text fw={500} ta="center">Storage Usage</Text>
                      <Badge color={systemMetrics.storageUsed > 80 ? 'red' : 'green'} variant="light">
                        {systemMetrics.storageUsed > 80 ? 'High Usage' : 'Normal'}
                      </Badge>
                    </Stack>
                  </Card>

                  <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                    <Stack gap="sm" align="center">
                      <RingProgress
                        size={120}
                        thickness={12}
                        sections={[{ value: systemMetrics.bandwidthUsage, color: 'var(--secondary)' }]}
                        label={
                          <Text ta="center" fw={700} size="lg" style={{ color: 'var(--secondary)' }}>
                            {systemMetrics.bandwidthUsage}%
                          </Text>
                        }
                      />
                      <Text fw={500} ta="center">Bandwidth Usage</Text>
                      <Badge color={systemMetrics.bandwidthUsage > 90 ? 'red' : 'green'} variant="light">
                        {systemMetrics.bandwidthUsage > 90 ? 'High Usage' : 'Normal'}
                      </Badge>
                    </Stack>
                  </Card>
                </Stack>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* System Events Tab */}
          <Tabs.Panel value="events" pt="lg">
            <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={4}>Recent System Events</Title>
                  <Button
                    size="sm"
                    variant="light"
                    leftSection={<ActivityLogIcon width={14} height={14} />}
                    onClick={() => generateReport('system-events')}
                  >
                    Export Events
                  </Button>
                </Group>
                
                <Stack gap="sm">
                  {recentSystemEvents.map(event => (
                    <Alert
                      key={event.id}
                      icon={<ActivityLogIcon width={16} height={16} />}
                      color={getStatusColor(event.type)}
                      variant="light"
                    >
                      <Group justify="space-between">
                        <Text size="sm">{event.message}</Text>
                        <Text size="xs" c="dimmed">{event.timestamp}</Text>
                      </Group>
                    </Alert>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Tabs.Panel>
        </Tabs>

        {/* Quick Actions */}
        <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <Stack gap="md">
            <Title order={4}>System Reports</Title>
            <Group gap="sm">
              <Button
                variant="light"
                leftSection={<DownloadIcon width={16} height={16} />}
                onClick={() => generateReport('user-activity')}
              >
                User Activity Report
              </Button>
              <Button
                variant="light"
                leftSection={<DownloadIcon width={16} height={16} />}
                onClick={() => generateReport('performance-metrics')}
              >
                Performance Report
              </Button>
              <Button
                variant="light"
                leftSection={<DownloadIcon width={16} height={16} />}
                onClick={() => generateReport('system-health')}
              >
                System Health Report
              </Button>
              <Button
                variant="light"
                leftSection={<DownloadIcon width={16} height={16} />}
                onClick={() => generateReport('security-audit')}
              >
                Security Audit Report
              </Button>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};