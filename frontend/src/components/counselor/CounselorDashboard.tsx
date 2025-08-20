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
} from '@mantine/core';
import {
  PersonIcon,
  ChatBubbleIcon,
  CalendarIcon,
  BarChartIcon,
  ClockIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const CounselorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for counselor dashboard - will be replaced with real data
  const counselorStats = {
    activeStudents: 45,
    totalStudents: 52,
    pendingQuestions: 8,
    answeredQuestions: 124,
    scheduledSessions: 12,
    completedSessions: 89,
    responseTime: 4.2, // hours
    satisfactionRating: 4.8,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'question',
      content: 'Answered question about Engineering careers',
      student: 'John Doe',
      time: '30 minutes ago',
    },
    {
      id: 2,
      type: 'session',
      content: 'Completed career guidance session',
      student: 'Jane Smith',
      time: '2 hours ago',
    },
    {
      id: 3,
      type: 'assignment',
      content: 'New student assigned',
      student: 'Mike Johnson',
      time: '4 hours ago',
    },
  ];

  const upcomingSessions = [
    {
      id: 1,
      student: 'Sarah Wilson',
      time: '2:00 PM Today',
      type: 'Career Guidance',
      priority: 'high',
    },
    {
      id: 2,
      student: 'David Brown',
      time: '10:00 AM Tomorrow',
      type: 'Academic Planning',
      priority: 'medium',
    },
    {
      id: 3,
      student: 'Lisa Chen',
      time: '3:00 PM Tomorrow',
      type: 'Follow-up Session',
      priority: 'low',
    },
  ];

  const getWelcomeMessage = () => {
    const time = new Date().getHours();
    let greeting = 'Good morning';
    if (time >= 12 && time < 18) greeting = 'Good afternoon';
    else if (time >= 18) greeting = 'Good evening';

    return `${greeting}, ${user?.firstName}!`;
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
                Ready to guide your students today?
              </Text>
            </Stack>
            <Badge
              size="lg"
              variant="light"
              color="yellow"
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
              }}
            >
              Career Counselor
            </Badge>
          </Group>
        </Stack>

        {/* Quick Stats Overview */}
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
                Active Students
              </Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--primary)' }}>
                {counselorStats.activeStudents}
              </Title>
              <Text size="xs" c="dimmed" ta="center">
                of {counselorStats.totalStudents} total
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
                <ChatBubbleIcon width={32} height={32} />
              </div>
              <Text fw={500} size="sm" ta="center">
                Pending Questions
              </Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--primary)' }}>
                {counselorStats.pendingQuestions}
              </Title>
              <Text size="xs" c="dimmed" ta="center">
                Need responses
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
                <CalendarIcon width={32} height={32} />
              </div>
              <Text fw={500} size="sm" ta="center">
                Today's Sessions
              </Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--primary)' }}>
                {upcomingSessions.filter(s => s.time.includes('Today')).length}
              </Title>
              <Text size="xs" c="dimmed" ta="center">
                Scheduled sessions
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
                    value: (counselorStats.satisfactionRating / 5) * 100,
                    color: 'var(--primary)',
                  },
                ]}
                label={
                  <Text
                    ta="center"
                    fw={700}
                    size="xs"
                    style={{ color: 'var(--primary)' }}
                  >
                    {counselorStats.satisfactionRating}
                  </Text>
                }
              />
              <Text fw={500} size="sm" ta="center">
                Satisfaction
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                Student rating
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
                      onClick={() => navigate('/counselor/students')}
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        justifyContent: 'flex-start',
                      }}
                    >
                      Manage Students
                    </Button>
                    <Button
                      variant="light"
                      size="md"
                      leftSection={<ChatBubbleIcon width={18} height={18} />}
                      onClick={() => navigate('/counselor/questions')}
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        justifyContent: 'flex-start',
                      }}
                    >
                      Answer Questions
                    </Button>
                    <Button
                      variant="light"
                      size="md"
                      leftSection={<CalendarIcon width={18} height={18} />}
                      onClick={() => navigate('/counselor/sessions')}
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        justifyContent: 'flex-start',
                      }}
                    >
                      Schedule Sessions
                    </Button>
                    <Button
                      variant="light"
                      size="md"
                      leftSection={<BarChartIcon width={18} height={18} />}
                      onClick={() => navigate('/counselor/analytics')}
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        justifyContent: 'flex-start',
                      }}
                    >
                      View Analytics
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
                  <Title order={3}>Recent Activity</Title>
                  <Stack gap="sm">
                    {recentActivity.map(activity => (
                      <Group key={activity.id} gap="md">
                        <div style={{ color: 'var(--primary)' }}>
                          {activity.type === 'question' ? (
                            <ChatBubbleIcon width={16} height={16} />
                          ) : activity.type === 'session' ? (
                            <CalendarIcon width={16} height={16} />
                          ) : (
                            <PersonIcon width={16} height={16} />
                          )}
                        </div>
                        <Stack gap={2} style={{ flex: 1 }}>
                          <Text size="sm">{activity.content}</Text>
                          <Group gap="sm">
                            <Text size="xs" c="dimmed">
                              Student: {activity.student}
                            </Text>
                            <Text size="xs" c="dimmed">
                              •
                            </Text>
                            <Text size="xs" c="dimmed">
                              {activity.time}
                            </Text>
                          </Group>
                        </Stack>
                      </Group>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="lg">
              {/* Upcoming Sessions */}
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
                  <Title order={4}>Today's Schedule</Title>
                  <Stack gap="sm">
                    {upcomingSessions.map(session => (
                      <Alert
                        key={session.id}
                        variant="light"
                        color={
                          session.priority === 'high'
                            ? 'red'
                            : session.priority === 'medium'
                              ? 'yellow'
                              : 'blue'
                        }
                        styles={{
                          root: {
                            backgroundColor: 'var(--muted)',
                            borderColor: 'var(--border)',
                          },
                        }}
                      >
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>
                            {session.student}
                          </Text>
                          <Group gap="xs">
                            <ClockIcon width={12} height={12} />
                            <Text size="xs" c="dimmed">
                              {session.time}
                            </Text>
                          </Group>
                          <Text size="xs" c="dimmed">
                            {session.type}
                          </Text>
                        </Stack>
                      </Alert>
                    ))}
                  </Stack>
                </Stack>
              </Card>

              {/* Performance Metrics */}
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
                  <Title order={4}>This Week</Title>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm">Response Time</Text>
                      <Group gap="xs">
                        <Text size="sm" fw={500} style={{ color: 'var(--primary)' }}>
                          {counselorStats.responseTime}h
                        </Text>
                        <CheckCircledIcon width={14} height={14} style={{ color: 'var(--success)' }} />
                      </Group>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Questions Answered</Text>
                      <Text size="sm" fw={500} style={{ color: 'var(--primary)' }}>
                        {counselorStats.answeredQuestions}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Sessions Completed</Text>
                      <Text size="sm" fw={500} style={{ color: 'var(--primary)' }}>
                        {counselorStats.completedSessions}
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