import React from 'react';
import {
  Group,
  Button,
  Card,
  Text,
  Stack,
  Badge,
  Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../hooks/useAuth';

export const DemoModeSwitch: React.FC = () => {
  const { login } = useAuth();

  const demoUsers = [
    {
      email: 'student@elimu.com',
      password: 'student',
      role: 'student',
      name: 'Alex Student',
      color: 'orange',
      icon: '🎓',
    },
    {
      email: 'counselor@elimu.com',
      password: 'counselor',
      role: 'counselor',
      name: 'Sarah Counselor',
      color: 'yellow',
      icon: '👨‍🏫',
    },
    {
      email: 'admin@elimu.com',
      password: 'admin',
      role: 'admin',
      name: 'Mike Admin',
      color: 'violet',
      icon: '👨‍💼',
    },
  ];

  const handleDemoLogin = async (user: typeof demoUsers[0]) => {
    try {
      await login({
        email: user.email,
        password: user.password,
      });
      
      notifications.show({
        title: '🎭 Demo Mode Active',
        message: `Switched to ${user.name} (${user.role})`,
        color: user.color,
      });
    } catch {
      notifications.show({
        title: 'Demo Login Failed',
        message: 'Could not switch to demo user',
        color: 'red',
      });
    }
  };

  return (
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
        <Group justify="space-between" align="center">
          <Text fw={600} size="lg">
            Demo Mode
          </Text>
          <Badge
            color="blue"
            variant="light"
            size="sm"
          >
            Development
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          Quickly switch between different user roles to explore the platform features.
        </Text>

        <Divider />

        <Stack gap="sm">
          {demoUsers.map((user) => (
            <Button
              key={user.role}
              variant="light"
              color={user.color}
              fullWidth
              leftSection={user.icon}
              onClick={() => handleDemoLogin(user)}
              style={{
                justifyContent: 'flex-start',
                height: 'auto',
                padding: '12px 16px',
              }}
            >
              <Stack gap={2} align="flex-start">
                <Text fw={500} size="sm">
                  {user.name}
                </Text>
                <Text size="xs" c="dimmed">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
                </Text>
              </Stack>
            </Button>
          ))}
        </Stack>

        <Text size="xs" ta="center" c="dimmed">
          💡 Demo users reset on page refresh
        </Text>
      </Stack>
    </Card>
  );
};