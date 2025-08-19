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
  Alert,
  RingProgress,
  SimpleGrid,
} from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useThemeContext';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { currentTheme } = useThemeContext();
  const navigate = useNavigate();

  // Mock data for student dashboard - will be replaced with real data
  const studentStats = {
    assessmentsCompleted: 2,
    totalAssessments: 4,
    careerMatches: 12,
    profileCompletion: 75,
    recentActivity: [
      { id: 1, action: 'Completed Interest Assessment', time: '2 hours ago', type: 'assessment' },
      { id: 2, action: 'Updated academic information', time: '1 day ago', type: 'profile' },
      { id: 3, action: 'Viewed Career Recommendations', time: '3 days ago', type: 'career' },
    ],
    upcomingEvents: [
      { id: 1, title: 'Career Fair Registration Opens', date: 'Tomorrow', type: 'deadline' },
      { id: 2, title: 'Skills Assessment Reminder', date: 'In 3 days', type: 'assessment' },
    ],
    achievements: [
      { id: 1, title: 'Assessment Pioneer', description: 'Completed your first assessment', unlocked: true },
      { id: 2, title: 'Profile Master', description: 'Complete your profile 100%', unlocked: false },
    ]
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'career_counselor':
        return 'Career Counselor';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const getWelcomeMessage = () => {
    const time = new Date().getHours();
    let greeting = 'Good morning';
    if (time >= 12 && time < 18) greeting = 'Good afternoon';
    else if (time >= 18) greeting = 'Good evening';
    
    return `${greeting}, ${user?.firstName}!`;
  };

  const getThemeColor = () => {
    switch (currentTheme) {
      case 'admin':
        return 'violet';
      case 'counselor':
        return 'yellow';
      default:
        return 'orange';
    }
  };

  // Show different dashboard based on user role
  if (user?.role === 'student') {
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
                  Ready to explore your career journey?
                </Text>
              </Stack>
              <Badge 
                size="lg" 
                variant="light" 
                color={getThemeColor()}
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--secondary-foreground)',
                }}
              >
                {user?.role && getRoleDisplayName(user.role)}
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
                <RingProgress
                  size={60}
                  thickness={6}
                  sections={[{ value: (studentStats.assessmentsCompleted / studentStats.totalAssessments) * 100, color: 'var(--primary)' }]}
                  label={
                    <Text ta="center" fw={700} size="xs" style={{ color: 'var(--primary)' }}>
                      {Math.round((studentStats.assessmentsCompleted / studentStats.totalAssessments) * 100)}%
                    </Text>
                  }
                />
                <Text fw={500} size="sm" ta="center">Assessments</Text>
                <Text size="xs" c="dimmed" ta="center">
                  {studentStats.assessmentsCompleted}/{studentStats.totalAssessments} completed
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
                <Title 
                  order={2} 
                  size="2rem"
                  style={{ color: 'var(--primary)' }}
                >
                  {studentStats.careerMatches}
                </Title>
                <Text fw={500} size="sm" ta="center">Career Matches</Text>
                <Text size="xs" c="dimmed" ta="center">
                  Personalized for you
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
                  sections={[{ value: studentStats.profileCompletion, color: 'var(--primary)' }]}
                  label={
                    <Text ta="center" fw={700} size="xs" style={{ color: 'var(--primary)' }}>
                      {studentStats.profileCompletion}%
                    </Text>
                  }
                />
                <Text fw={500} size="sm" ta="center">Profile</Text>
                <Text size="xs" c="dimmed" ta="center">
                  Almost complete!
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
                <Title 
                  order={2} 
                  size="2rem"
                  style={{ color: 'var(--primary)' }}
                >
                  🎯
                </Title>
                <Text fw={500} size="sm" ta="center">Next Goal</Text>
                <Text size="xs" c="dimmed" ta="center">
                  Complete Skills Assessment
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
                        leftSection="📊"
                        onClick={() => navigate('/assessment')}
                        style={{
                          backgroundColor: 'var(--secondary)',
                          color: 'var(--secondary-foreground)',
                          justifyContent: 'flex-start',
                        }}
                      >
                        Take Career Assessment
                      </Button>
                      <Button 
                        variant="light"
                        size="md"
                        leftSection="🎯"
                        onClick={() => navigate('/subject-mapper')}
                        style={{
                          backgroundColor: 'var(--secondary)',
                          color: 'var(--secondary-foreground)',
                          justifyContent: 'flex-start',
                        }}
                      >
                        Subject-Career Mapper
                      </Button>
                      <Button 
                        variant="light"
                        size="md"
                        leftSection="👤"
                        style={{
                          backgroundColor: 'var(--secondary)',
                          color: 'var(--secondary-foreground)',
                          justifyContent: 'flex-start',
                        }}
                      >
                        Complete Profile
                      </Button>
                      <Button 
                        variant="light"
                        size="md"
                        leftSection="📚"
                        onClick={() => navigate('/career-hub')}
                        style={{
                          backgroundColor: 'var(--secondary)',
                          color: 'var(--secondary-foreground)',
                          justifyContent: 'flex-start',
                        }}
                      >
                        Career Hub
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
                      {studentStats.recentActivity.map((activity) => (
                        <Group key={activity.id} gap="md">
                          <Text 
                            size="xs" 
                            style={{
                              color: 'var(--primary)',
                              fontWeight: 500,
                            }}
                          >
                            {activity.type === 'assessment' ? '📊' : 
                             activity.type === 'profile' ? '👤' : '🎯'}
                          </Text>
                          <Stack gap={2} style={{ flex: 1 }}>
                            <Text size="sm">{activity.action}</Text>
                            <Text size="xs" c="dimmed">{activity.time}</Text>
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
                {/* Upcoming Events */}
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
                    <Title order={4}>Upcoming</Title>
                    <Stack gap="sm">
                      {studentStats.upcomingEvents.map((event) => (
                        <Alert 
                          key={event.id}
                          variant="light" 
                          color={event.type === 'deadline' ? 'orange' : 'blue'}
                          styles={{
                            root: {
                              backgroundColor: 'var(--muted)',
                              borderColor: 'var(--border)',
                            }
                          }}
                        >
                          <Stack gap={2}>
                            <Text size="sm" fw={500}>{event.title}</Text>
                            <Text size="xs" c="dimmed">{event.date}</Text>
                          </Stack>
                        </Alert>
                      ))}
                    </Stack>
                  </Stack>
                </Card>

                {/* Achievements */}
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
                    <Title order={4}>Achievements</Title>
                    <Stack gap="sm">
                      {studentStats.achievements.map((achievement) => (
                        <Group key={achievement.id} gap="sm">
                          <Text size="lg">{achievement.unlocked ? '🏆' : '🔒'}</Text>
                          <Stack gap={2} style={{ flex: 1 }}>
                            <Text 
                              size="sm" 
                              fw={500}
                              c={achievement.unlocked ? undefined : 'dimmed'}
                            >
                              {achievement.title}
                            </Text>
                            <Text 
                              size="xs" 
                              c="dimmed"
                            >
                              {achievement.description}
                            </Text>
                          </Stack>
                        </Group>
                      ))}
                    </Stack>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    );
  }

  // Default dashboard for other roles (admin/counselor)
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Welcome Section */}
        <Stack gap="sm">
          <Title order={1} size="2.5rem">
            {getWelcomeMessage()}
          </Title>
          <Group gap="md">
            <Text size="lg" c="dimmed">
              Welcome to your Elimu Smart dashboard
            </Text>
            <Badge 
              size="lg" 
              variant="light" 
              color={getThemeColor()}
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
              }}
            >
              {user?.role && getRoleDisplayName(user.role)}
            </Badge>
          </Group>
        </Stack>

        {/* Role-specific content coming in future sprints */}
        <Alert 
          color={getThemeColor()} 
          title={`${getRoleDisplayName(user?.role || '')} Dashboard Coming Soon!`} 
          variant="light"
        >
          <Text size="sm">
            Your personalized {user?.role} dashboard will be available in upcoming sprints.
          </Text>
        </Alert>

        {/* Development Status */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
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
              <Stack gap="xs">
                <Text fw={500} size="lg">Current Sprint</Text>
                <Title 
                  order={2} 
                  style={{ color: 'var(--primary)' }}
                >
                  Sprint 3
                </Title>
                <Text size="sm" c="dimmed">
                  Student Dashboard MVP
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
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
              <Stack gap="xs">
                <Text fw={500} size="lg">Theme</Text>
                <Title 
                  order={2} 
                  style={{ color: 'var(--primary)' }}
                >
                  {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
                </Title>
                <Text size="sm" c="dimmed">
                  Role-based theming
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
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
              <Stack gap="xs">
                <Text fw={500} size="lg">User Role</Text>
                <Title 
                  order={2} 
                  style={{ color: 'var(--primary)' }}
                >
                  {user?.role && getRoleDisplayName(user.role)}
                </Title>
                <Text size="sm" c="dimmed">
                  Your account type
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};