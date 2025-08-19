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
  Anchor,
  Paper,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/layouts/AuthLayout';
import type { LoginCredentials } from '../types';

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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

          <Stack gap="xs">
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />
            <Group justify="flex-end">
              <Anchor
                size="sm"
                onClick={() => navigate('/forgot-password')}
                style={{ 
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                Forgot password?
              </Anchor>
            </Group>
          </Stack>

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

          <Text ta="center" size="sm" c="dimmed">
            Don't have an account?{' '}
            <Anchor
              onClick={() => navigate('/register')}
              style={{ 
                color: 'var(--primary)',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              Sign up
            </Anchor>
          </Text>

          <Divider label="Demo Accounts" labelPosition="center" />

          <Paper
            p="md"
            radius="md"
            style={{
              backgroundColor: 'var(--muted)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
            }}
          >
            <Stack gap="xs">
              <Text size="sm" fw={500} c="dimmed" ta="center" mb="xs">
                Try these demo accounts:
              </Text>
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
          </Paper>

          <Text ta="center" size="xs" c="dimmed">
            Want to explore first?{' '}
            <Anchor
              onClick={() => navigate('/')}
              style={{ 
                color: 'var(--primary)',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              View landing page
            </Anchor>
          </Text>
        </Stack>
      </form>
    </AuthLayout>
  );
};