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
} from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../components/common/ThemeProvider';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { currentTheme } = useThemeContext();

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

        {/* Sprint 1 Completion Alert */}
        <Alert 
          color="green" 
          title="🎉 Sprint 1 Complete!" 
          variant="light"
        >
          <Text size="sm">
            Foundation setup is complete! The platform now includes:
          </Text>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Role-based theming system (Student/Counselor/Admin)</li>
            <li>Dark mode support</li>
            <li>Authentication with mock users</li>
            <li>Responsive layout with navigation</li>
            <li>Error boundaries and loading states</li>
          </ul>
          <Text size="sm" mt="sm">
            Ready to proceed with Sprint 2: Authentication System!
          </Text>
        </Alert>

        {/* Quick Stats */}
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
                <Text fw={500} size="lg">Theme</Text>
                <Title 
                  order={2} 
                  style={{ color: 'var(--primary)' }}
                >
                  {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
                </Title>
                <Text size="sm" c="dimmed">
                  Current active theme
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
                <Text fw={500} size="lg">Sprint Progress</Text>
                <Title 
                  order={2} 
                  style={{ color: 'var(--primary)' }}
                >
                  1/8
                </Title>
                <Text size="sm" c="dimmed">
                  Sprints completed
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

        {/* Next Steps */}
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
            <Title order={3}>Next Sprint: Authentication Enhancement</Title>
            <Text c="dimmed">
              Sprint 2 will enhance the authentication system with features like:
            </Text>
            <ul style={{ margin: '8px 0', paddingLeft: '20px', color: 'var(--muted-foreground)' }}>
              <li>User registration</li>
              <li>Password reset functionality</li>
              <li>Profile management</li>
              <li>Role-based access control</li>
            </ul>
            <Button 
              variant="light"
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
              }}
            >
              View Sprint 2 Details
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};