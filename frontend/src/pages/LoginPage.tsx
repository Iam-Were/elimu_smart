import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Text,
  Group,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/layouts/AuthLayout';
import type { LoginCredentials } from '../types';

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();

  const form = useForm<LoginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => 
        /^\S+@\S+$/.test(value) ? null : 'Invalid email address',
      password: (value) => 
        value.length < 1 ? 'Password is required' : null,
    },
  });

  const handleSubmit = async (values: LoginCredentials) => {
    setIsLoading(true);
    try {
      await login(values);
      notifications.show({
        title: 'Success!',
        message: 'Welcome back to Elimu Smart!',
        color: 'green',
      });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your Elimu Smart account"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {error && (
            <Alert color="red" variant="light">
              {error}
            </Alert>
          )}

          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            {...form.getInputProps('password')}
          />

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            size="md"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            Sign In
          </Button>

          <Divider label="Demo Accounts" labelPosition="center" />

          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Student:</Text>
              <Text size="sm" ff="monospace">student@elimu.com / student</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Counselor:</Text>
              <Text size="sm" ff="monospace">counselor@elimu.com / counselor</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Admin:</Text>
              <Text size="sm" ff="monospace">admin@elimu.com / admin</Text>
            </Group>
          </Stack>
        </Stack>
      </form>
    </AuthLayout>
  );
};