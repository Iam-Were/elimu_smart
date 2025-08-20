import React from 'react';
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
  RingProgress,
  SimpleGrid,
  Alert,
  Progress,
} from '@mantine/core';
import {
  PersonIcon,
  ActivityLogIcon,
  GearIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  ClockIcon,
  BarChartIcon,
  GlobeIcon,
} from '@radix-ui/react-icons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for admin dashboard - will be replaced with real data
  const systemMetrics = {
    users: {
      total: 2847,
      active: 1923,
      students: 2456,
      counselors: 45,
      admins: 8,
      newThisMonth: 234,
    },
    performance: {
      uptime: 99.7,
      responseTime: 245, // ms
      errorRate: 0.12, // %
      apiCalls: 45678,
    },
    content: {
      totalCareers: 156,
      pendingModeration: 12,
      questionsAnswered: 1234,
      resourcesAvailable: 89,
    },
    system: {
      cpuUsage: 23,
      memoryUsage: 67,
      diskUsage: 45,
      activeConnections: 1234,
    },
  };

  const recentActivity = [
    {
      id: 1,
      action: 'New user registration',
      user: 'John Doe (Student)',
      time: '2 minutes ago',
      type: 'user',
      status: 'success',
    },
    {
      id: 2,
      action: 'System performance alert resolved',
      user: 'System',
      time: '15 minutes ago',
      type: 'system',
      status: 'success',
    },
    {
      id: 3,
      action: 'Content moderation required',
      user: 'Career Q&A System',
      time: '1 hour ago',
      type: 'content',
      status: 'warning',
    },
    {
      id: 4,
      action: 'Bulk user import completed',
      user: 'Admin: Jane Smith',
      time: '3 hours ago',
      type: 'admin',
      status: 'success',
    },
  ];

  const systemAlerts = [
    {
      id: 1,
      level: 'warning',
      message: 'Database query performance slower than usual',
      timestamp: '10 minutes ago',
      resolved: false,
    },
    {
      id: 2,
      level: 'info',
      message: 'Scheduled maintenance completed successfully',
      timestamp: '2 hours ago',
      resolved: true,
    },
    {
      id: 3,
      level: 'error',
      message: 'Failed login attempts from suspicious IP',
      timestamp: '4 hours ago',
      resolved: false,
    },
  ];

  const getWelcomeMessage = () => {
    const time = new Date().getHours();
    let greeting = 'Good morning';
    if (time >= 12 && time < 18) greeting = 'Good afternoon';
    else if (time >= 18) greeting = 'Good evening';

    return `${greeting}, ${user?.firstName}!`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <PersonIcon width={14} height={14} />;
      case 'system':
        return <GearIcon width={14} height={14} />;
      case 'content':
        return <ActivityLogIcon width={14} height={14} />;
      case 'admin':
        return <GearIcon width={14} height={14} />;
      default:
        return <ClockIcon width={14} height={14} />;
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Welcome Section */}
        <Stack gap="sm">
          <Group justify="space-between" align="flex-start">
            <Stack gap="xs">
              <Title order={1} size="2rem">
                {getWelcomeMessage()}
              </Title>
              <Text size="lg" c="dimmed">
                Platform administration and system oversight
              </Text>
            </Stack>
            <Badge
              size="lg"
              variant="light"
              color="violet"
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
              }}
            >
              System Administrator
            </Badge>
          </Group>
        </Stack>

        {/* Key System Metrics */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className="hover-lift theme-transition"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
            }}
          >
            <Stack gap="xs" align="center">
              <div
                style={{
                  color: 'var(--primary)',
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonIcon width={32} height={32} />
              </div>
              <Text fw={500} size="sm" ta="center">
                Total Users
              </Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--primary)' }}>
                {systemMetrics.users.total.toLocaleString()}
              </Title>
              <Text size="xs" c="dimmed" ta="center">
                {systemMetrics.users.active.toLocaleString()} active
              </Text>
            </Stack>
          </Card>

          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className="hover-lift theme-transition"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
            }}
          >
            <Stack gap="xs" align="center">
              <RingProgress
                size={60}
                thickness={6}
                sections={[
                  {
                    value: systemMetrics.performance.uptime,
                    color: systemMetrics.performance.uptime > 99 ? 'var(--success)' : 'var(--warning)',
                  },
                ]}
                label={
                  <Text
                    ta="center"
                    fw={700}
                    size="xs"
                    style={{ 
                      color: systemMetrics.performance.uptime > 99 ? 'var(--success)' : 'var(--warning)' 
                    }}
                  >
                    {systemMetrics.performance.uptime}%
                  </Text>
                }
              />
              <Text fw={500} size="sm" ta="center">
                System Uptime
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                Last 30 days
              </Text>
            </Stack>
          </Card>

          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className="hover-lift theme-transition"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
            }}
          >
            <Stack gap="xs" align="center">
              <div
                style={{
                  color: 'var(--primary)',
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ClockIcon width={32} height={32} />
              </div>
              <Text fw={500} size="sm" ta="center">
                Avg Response Time
              </Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--primary)' }}>
                {systemMetrics.performance.responseTime}ms
              </Title>
              <Text size="xs" c="dimmed" ta="center">
                API response time
              </Text>
            </Stack>
          </Card>

          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className="hover-lift theme-transition"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
            }}
          >
            <Stack gap="xs" align="center">
              <div
                style={{
                  color: systemMetrics.content.pendingModeration > 10 ? 'var(--destructive)' : 'var(--primary)',
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ExclamationTriangleIcon width={32} height={32} />
              </div>
              <Text fw={500} size="sm" ta="center">
                Pending Moderation
              </Text>
              <Title 
                order={2} 
                size="1.5rem" 
                style={{ 
                  color: systemMetrics.content.pendingModeration > 10 ? 'var(--destructive)' : 'var(--primary)' 
                }}
              >
                {systemMetrics.content.pendingModeration}
              </Title>
              <Text size="xs" c="dimmed" ta="center">
                Items need review
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* System Health Overview */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Card padding="md" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" fw={500}>CPU Usage</Text>
                <Text size="sm" style={{ color: 'var(--primary)' }}>{systemMetrics.system.cpuUsage}%</Text>
              </Group>
              <Progress 
                value={systemMetrics.system.cpuUsage} 
                color={systemMetrics.system.cpuUsage > 80 ? 'red' : systemMetrics.system.cpuUsage > 60 ? 'yellow' : 'green'} 
              />
            </Stack>
          </Card>

          <Card padding="md" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" fw={500}>Memory Usage</Text>
                <Text size="sm" style={{ color: 'var(--primary)' }}>{systemMetrics.system.memoryUsage}%</Text>
              </Group>
              <Progress 
                value={systemMetrics.system.memoryUsage} 
                color={systemMetrics.system.memoryUsage > 80 ? 'red' : systemMetrics.system.memoryUsage > 60 ? 'yellow' : 'green'} 
              />
            </Stack>
          </Card>

          <Card padding="md" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" fw={500}>Disk Usage</Text>
                <Text size="sm" style={{ color: 'var(--primary)' }}>{systemMetrics.system.diskUsage}%</Text>
              </Group>
              <Progress 
                value={systemMetrics.system.diskUsage} 
                color={systemMetrics.system.diskUsage > 80 ? 'red' : systemMetrics.system.diskUsage > 60 ? 'yellow' : 'green'} 
              />
            </Stack>
          </Card>

          <Card padding="md" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <GlobeIcon width={24} height={24} style={{ color: 'var(--primary)' }} />
              <Text size="sm" fw={500}>Active Connections</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                {systemMetrics.system.activeConnections.toLocaleString()}
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Main Content Grid */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="lg">
              {/* Quick Actions */}
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
                  <Title order={3}>Quick Actions</Title>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                    <Button
                      variant="light"
                      size="md"
                      leftSection={<PersonIcon width={18} height={18} />}
                      onClick={() => navigate('/admin/users')}
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        justifyContent: 'flex-start',
                      }}
                    >
                      Manage Users
                    </Button>
                    <Button
                      variant="light"
                      size="md"
                      leftSection={<BarChartIcon width={18} height={18} />}
                      onClick={() => navigate('/admin/monitoring')}
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        justifyContent: 'flex-start',
                      }}
                    >
                      System Monitoring
                    </Button>
                    <Button
                      variant="light"
                      size="md"
                      leftSection={<ActivityLogIcon width={18} height={18} />}
                      onClick={() => navigate('/admin/content')}
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        justifyContent: 'flex-start',
                      }}
                    >
                      Content Management
                    </Button>
                    <Button
                      variant="light"
                      size="md"
                      leftSection={<GearIcon width={18} height={18} />}
                      onClick={() => navigate('/admin/settings')}
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        justifyContent: 'flex-start',
                      }}
                    >
                      System Settings
                    </Button>
                  </SimpleGrid>
                </Stack>
              </Card>

              {/* Recent Activity */}
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
                  <Title order={3}>Recent System Activity</Title>
                  <Stack gap="sm">
                    {recentActivity.map(activity => (
                      <Group key={activity.id} gap="md">
                        <div style={{ color: getStatusColor(activity.status) }}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <Stack gap={2} style={{ flex: 1 }}>
                          <Text size="sm">{activity.action}</Text>
                          <Group gap="sm">
                            <Text size="xs" c="dimmed">
                              {activity.user}
                            </Text>
                            <Text size="xs" c="dimmed">•</Text>
                            <Text size="xs" c="dimmed">
                              {activity.time}
                            </Text>
                          </Group>
                        </Stack>
                        <Badge
                          size="xs"
                          color={getStatusColor(activity.status)}
                          variant="light"
                        >
                          {activity.status}
                        </Badge>
                      </Group>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="lg">
              {/* System Alerts */}
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
                  <Title order={4}>System Alerts</Title>
                  <Stack gap="sm">
                    {systemAlerts.filter(alert => !alert.resolved).map(alert => (
                      <Alert
                        key={alert.id}
                        variant="light"
                        color={getStatusColor(alert.level)}
                        styles={{
                          root: {
                            backgroundColor: 'var(--muted)',
                            borderColor: 'var(--border)',
                          },
                        }}
                      >
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>
                            {alert.message}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {alert.timestamp}
                          </Text>
                        </Stack>
                      </Alert>
                    ))}
                    {systemAlerts.filter(alert => !alert.resolved).length === 0 && (
                      <Alert
                        variant="light"
                        color="green"
                        icon={<CheckCircledIcon width={16} height={16} />}
                      >
                        <Text size="sm">All systems operating normally</Text>
                      </Alert>
                    )}
                  </Stack>
                </Stack>
              </Card>

              {/* User Distribution */}
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
                  <Title order={4}>User Distribution</Title>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm">Students</Text>
                      <Group gap="xs">
                        <Text size="sm" fw={500} style={{ color: 'var(--primary)' }}>
                          {systemMetrics.users.students.toLocaleString()}
                        </Text>
                        <Text size="xs" c="dimmed">
                          ({Math.round((systemMetrics.users.students / systemMetrics.users.total) * 100)}%)
                        </Text>
                      </Group>
                    </Group>
                    
                    <Group justify="space-between">
                      <Text size="sm">Counselors</Text>
                      <Group gap="xs">
                        <Text size="sm" fw={500} style={{ color: 'var(--primary)' }}>
                          {systemMetrics.users.counselors}
                        </Text>
                        <Text size="xs" c="dimmed">
                          ({Math.round((systemMetrics.users.counselors / systemMetrics.users.total) * 100)}%)
                        </Text>
                      </Group>
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm">Administrators</Text>
                      <Group gap="xs">
                        <Text size="sm" fw={500} style={{ color: 'var(--primary)' }}>
                          {systemMetrics.users.admins}
                        </Text>
                        <Text size="xs" c="dimmed">
                          ({Math.round((systemMetrics.users.admins / systemMetrics.users.total) * 100)}%)
                        </Text>
                      </Group>
                    </Group>
                  </Stack>
                </Stack>
              </Card>

              {/* Performance Summary */}
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
                  <Title order={4}>Performance Summary</Title>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm">API Calls (24h)</Text>
                      <Text size="sm" fw={500} style={{ color: 'var(--primary)' }}>
                        {systemMetrics.performance.apiCalls.toLocaleString()}
                      </Text>
                    </Group>
                    
                    <Group justify="space-between">
                      <Text size="sm">Error Rate</Text>
                      <Text size="sm" fw={500} style={{ 
                        color: systemMetrics.performance.errorRate > 1 ? 'var(--destructive)' : 'var(--success)' 
                      }}>
                        {systemMetrics.performance.errorRate}%
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm">New Users (Month)</Text>
                      <Text size="sm" fw={500} style={{ color: 'var(--primary)' }}>
                        {systemMetrics.users.newThisMonth}
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};