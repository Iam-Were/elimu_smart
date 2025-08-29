import React from 'react';
import {
  Container,
  Title,
  Text,
  Grid,
  Stack,
  Badge,
  Group,
} from '@mantine/core';
// Removed unused icon imports after cleaning up dead code
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useThemeContext';
import { CounselorDashboard } from '../components/counselor/CounselorDashboard';
import { DashboardAnalytics, MetricCard } from '../components/common/InteractiveCharts';
import Dashboard from './Dashboard'; // Import the new Dashboard component

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { currentTheme } = useThemeContext();
  const [timeRange, setTimeRange] = React.useState('30d');

  // Mock data removed after cleaning up dead code - keep for potential future admin dashboard
  const _studentStats = {
    assessmentsCompleted: 2,
    totalAssessments: 4,
    careerMatches: 12,
    profileCompletion: 75,
    recentActivity: [
      {
        id: 1,
        action: 'Completed Interest Assessment',
        time: '2 hours ago',
        type: 'assessment',
      },
      {
        id: 2,
        action: 'Updated academic information',
        time: '1 day ago',
        type: 'profile',
      },
      {
        id: 3,
        action: 'Viewed Career Recommendations',
        time: '3 days ago',
        type: 'career',
      },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Career Fair Registration Opens',
        date: 'Tomorrow',
        type: 'deadline',
      },
      {
        id: 2,
        title: 'Skills Assessment Reminder',
        date: 'In 3 days',
        type: 'assessment',
      },
    ],
    achievements: [
      {
        id: 1,
        title: 'Assessment Pioneer',
        description: 'Completed your first assessment',
        unlocked: true,
      },
      {
        id: 2,
        title: 'Profile Master',
        description: 'Complete your profile 100%',
        unlocked: false,
      },
    ],
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
  if (user?.role === 'counselor' || user?.role === 'career_counselor') {
    return <CounselorDashboard />;
  }
  
  if (user?.role === 'student') {
    return <Dashboard />;
  }
  

  // Admin and Super Admin dashboard with advanced analytics
  if (user?.role === 'admin' || user?.role === 'super_admin') {
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
                  Personal Overview & Advanced Analytics
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

          {/* Admin Analytics Dashboard */}
          <DashboardAnalytics
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </Stack>
      </Container>
    );
  }

  // Default dashboard for other roles
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

        {/* Development Status */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <MetricCard
              title="Current Sprint"
              value="Sprint 11"
              subtitle="Advanced UX Patterns"
              color="var(--primary)"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <MetricCard
              title="Theme"
              value={currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
              subtitle="Role-based theming"
              color="var(--primary)"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <MetricCard
              title="User Role"
              value={user?.role ? getRoleDisplayName(user.role) : 'N/A'}
              subtitle="Your account type"
              color="var(--primary)"
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};
