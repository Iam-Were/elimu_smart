import React, { useState } from 'react';
import {
  Container,
  Title,
  Card,
  Stack,
  Group,
  Text,
  Button,
  TextInput,
  Avatar,
  Badge,
  Divider,
  Grid,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useThemeContext';

export const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { currentTheme } = useThemeContext();

  const form = useForm({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
    validate: {
      firstName: (value) => 
        value.length < 2 ? 'First name must have at least 2 characters' : null,
      lastName: (value) => 
        value.length < 2 ? 'Last name must have at least 2 characters' : null,
      email: (value) => 
        /^\S+@\S+$/.test(value) ? null : 'Invalid email address',
    },
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notifications.show({
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated',
        color: 'green',
      });
      setIsEditing(false);
    } catch {
      notifications.show({
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return '👨‍💼';
      case 'counselor':
      case 'career_counselor':
        return '👨‍🏫';
      default:
        return '🎓';
    }
  };

  if (!user) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Error">
          User information not available
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Title order={1} size="2rem">
          Profile Settings
        </Title>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
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
              <Stack gap="md" align="center">
                <Avatar
                  size="xl"
                  radius="xl"
                  color={getThemeColor()}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    fontSize: '2rem',
                  }}
                >
                  {getRoleIcon(user.role)}
                </Avatar>

                <Stack gap="xs" align="center">
                  <Text fw={600} size="lg">
                    {user.firstName} {user.lastName}
                  </Text>
                  <Badge
                    color={getThemeColor()}
                    variant="light"
                    size="md"
                  >
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </Stack>

                <Divider w="100%" />

                <Stack gap="xs" w="100%">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Member since:</Text>
                    <Text size="sm" fw={500}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Account status:</Text>
                    <Badge
                      color={user.isActive ? 'green' : 'red'}
                      variant="light"
                      size="xs"
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Group>
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
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
                  <Title order={3}>Personal Information</Title>
                  {!isEditing ? (
                    <Button
                      variant="light"
                      color={getThemeColor()}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Group>
                      <Button
                        variant="subtle"
                        onClick={() => {
                          setIsEditing(false);
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        loading={isLoading}
                        onClick={() => form.onSubmit(handleSaveProfile)()}
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: 'var(--primary-foreground)',
                        }}
                      >
                        Save Changes
                      </Button>
                    </Group>
                  )}
                </Group>

                <Divider />

                <form onSubmit={form.onSubmit(handleSaveProfile)}>
                  <Stack gap="md">
                    <Group grow>
                      <TextInput
                        label="First Name"
                        placeholder="Enter first name"
                        disabled={!isEditing}
                        {...form.getInputProps('firstName')}
                      />
                      <TextInput
                        label="Last Name"
                        placeholder="Enter last name"
                        disabled={!isEditing}
                        {...form.getInputProps('lastName')}
                      />
                    </Group>

                    <TextInput
                      label="Email Address"
                      placeholder="Enter email address"
                      disabled={!isEditing}
                      {...form.getInputProps('email')}
                    />

                    <TextInput
                      label="Role"
                      value={getRoleDisplayName(user.role)}
                      disabled
                      description="Contact your administrator to change your role"
                    />
                  </Stack>
                </form>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Security Settings */}
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
            <Title order={3}>Security Settings</Title>
            <Divider />
            
            <Group justify="space-between" align="center">
              <Stack gap="xs">
                <Text fw={500}>Password</Text>
                <Text size="sm" c="dimmed">
                  Last updated: {new Date(user.updatedAt).toLocaleDateString()}
                </Text>
              </Stack>
              <Button
                variant="light"
                color="blue"
                onClick={() => {
                  notifications.show({
                    title: 'Password Reset',
                    message: 'Password reset functionality will be available in production',
                    color: 'blue',
                  });
                }}
              >
                Change Password
              </Button>
            </Group>

            <Alert color="blue" variant="light">
              <Text size="sm">
                <strong>Demo Mode:</strong> Security features are limited in demo mode. 
                In production, you'll be able to change passwords, enable two-factor authentication, 
                and manage security settings.
              </Text>
            </Alert>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};