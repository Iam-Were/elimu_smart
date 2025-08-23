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
// Sprint 15: Enhanced Icon System with Intelligence
import { 
  UniversalIcon, 
  StatCardIcon, 
  QuickActionButton,
  ICON_INTELLIGENCE_SYSTEM
} from '../utils/iconIntelligence';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useThemeContext';
import { useNavigate } from 'react-router-dom';
import { CounselorDashboard } from '../components/counselor/CounselorDashboard';
import { DashboardAnalytics, MetricCard } from '../components/common/InteractiveCharts';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { currentTheme } = useThemeContext();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = React.useState('30d');

  // Mock data for student dashboard - will be replaced with real data
  const studentStats = {
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
    return (
      <div className="container-enhanced py-6">
        <Stack gap="lg">
          {/* Enhanced Welcome Section with Gradient */}
          <div className="welcome-banner-enhanced">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
              <div className="lg:col-span-2">
                <Stack gap="xs">
                  <Title order={1} size="2rem" style={{ color: 'inherit' }}>
                    {getWelcomeMessage()} 👋
                  </Title>
                  <Text size="lg" style={{ color: 'inherit', opacity: 0.9 }}>
                    Continue your journey to finding the perfect career path
                  </Text>
                  <Group gap="sm" mt="sm">
                    <Badge
                      size="md"
                      variant="light"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'inherit',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      Form Four Student
                    </Badge>
                    <Badge
                      size="md"
                      variant="light"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'inherit',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      Profile {studentStats.profileCompletion}% Complete
                    </Badge>
                  </Group>
                </Stack>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div 
                  className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30"
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <UniversalIcon
                    category="PROGRESS_INDICATORS"
                    type="completion"
                    size="2xl"
                    showContainer={false}
                    animate={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid with Icon Intelligence */}
          <div className="stats-grid-enhanced">
            <StatCardIcon
              category="PROGRESS_INDICATORS"
              type="assessments"
              value={`${Math.round((studentStats.assessmentsCompleted / studentStats.totalAssessments) * 100)}%`}
              label="Assessments"
              description={`${studentStats.assessmentsCompleted}/${studentStats.totalAssessments} completed`}
              trend="up"
              onClick={() => navigate('/assessment')}
            />

            <StatCardIcon
              category="LEARNING_GOALS"
              type="careerMatches"
              value={studentStats.careerMatches}
              label="Career Matches"
              description="Personalized for your interests"
              trend="up"
              onClick={() => navigate('/career-hub')}
            />

            <StatCardIcon
              category="PROGRESS_INDICATORS"
              type="completion"
              value={`${studentStats.profileCompletion}%`}
              label="Profile Complete"
              description="Almost there! Keep going"
              trend={studentStats.profileCompletion > 75 ? 'up' : 'neutral'}
              onClick={() => navigate('/profile')}
            />

            <StatCardIcon
              category="LEARNING_GOALS"
              type="currentTarget"
              value="3"
              label="Goals Set"
              description="Complete Skills Assessment"
              trend="neutral"
              onClick={() => navigate('/goals')}
            />
          </div>

          {/* Main Content Grid */}
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="lg">
                {/* Enhanced Quick Actions with Icon Intelligence */}
                <div className="dashboard-card-enhanced">
                  <Stack gap="md">
                    <Title order={3}>Quick Actions</Title>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <QuickActionButton
                        action="assessment"
                        onClick={() => navigate('/assessment')}
                      />
                      <QuickActionButton
                        action="subjectMapper"
                        onClick={() => navigate('/subject-mapper')}
                      />
                      <QuickActionButton
                        action="profile"
                        onClick={() => navigate('/profile')}
                      />
                      <QuickActionButton
                        action="careerHub"
                        onClick={() => navigate('/career-hub')}
                      />
                    </div>
                  </Stack>
                </div>

                {/* Enhanced Recent Activity */}
                <div className="dashboard-card-enhanced">
                  <Stack gap="md">
                    <Title order={3}>Recent Activity</Title>
                    <Stack gap="sm">
                      {studentStats.recentActivity.map(activity => (
                        <Group key={activity.id} gap="md" className="micro-lift p-2 rounded hover:bg-secondary/50">
                          <UniversalIcon
                            category="PROGRESS_INDICATORS"
                            type={activity.type === 'assessment' ? 'assessments' : activity.type === 'profile' ? 'completion' : 'achievements'}
                            size="sm"
                            showContainer={true}
                            animate={true}
                          />
                          <Stack gap={2} style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>{activity.action}</Text>
                            <Text size="xs" c="dimmed">
                              {activity.time}
                            </Text>
                          </Stack>
                        </Group>
                      ))}
                    </Stack>
                  </Stack>
                </div>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="lg">
                {/* Enhanced Upcoming Events */}
                <div className="dashboard-card-enhanced">
                  <Stack gap="md">
                    <Title order={4}>Upcoming Events</Title>
                    <Stack gap="sm">
                      {studentStats.upcomingEvents.map(event => (
                        <div key={event.id} className="micro-lift p-3 rounded border border-border">
                          <Group gap="sm">
                            <UniversalIcon
                              category="LEARNING_GOALS"
                              type="planning"
                              size="sm"
                              showContainer={false}
                              animate={true}
                            />
                            <Stack gap={2} style={{ flex: 1 }}>
                              <Text size="sm" fw={500}>
                                {event.title}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {event.date}
                              </Text>
                            </Stack>
                          </Group>
                        </div>
                      ))}
                    </Stack>
                  </Stack>
                </div>

                {/* Enhanced Achievements */}
                <div className="dashboard-card-enhanced">
                  <Stack gap="md">
                    <Title order={4}>Achievements</Title>
                    <Stack gap="sm">
                      {studentStats.achievements.map(achievement => (
                        <Group key={achievement.id} gap="sm" className={`micro-lift p-2 rounded ${achievement.unlocked ? 'bg-success/10' : 'bg-muted/50'}`}>
                          <UniversalIcon
                            category="PROGRESS_INDICATORS"
                            type="achievements"
                            size="sm"
                            showContainer={false}
                            animate={achievement.unlocked}
                          />
                          <Stack gap={2} style={{ flex: 1 }}>
                            <Text
                              size="sm"
                              fw={500}
                              c={achievement.unlocked ? 'success' : 'dimmed'}
                            >
                              {achievement.title}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {achievement.description}
                            </Text>
                          </Stack>
                        </Group>
                      ))}
                    </Stack>
                  </Stack>
                </div>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </div>
    );
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
