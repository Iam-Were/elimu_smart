import React, { useState } from 'react';
import {
  TextInput,
  Button,
  Stack,
  Alert,
  Text,
  Anchor,
  Paper,
  ThemeIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layouts/AuthLayout';

export const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: value =>
        /^\S+@\S+$/.test(value) ? null : 'Invalid email address',
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setEmailSent(true);
      notifications.show({
        title: 'Reset Email Sent',
        message: 'Check your email for password reset instructions',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to send reset email. Please try again.',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent you a password reset link"
      >
        <Stack gap="lg" align="center">
          <ThemeIcon
            size="xl"
            radius="xl"
            style={{
              backgroundColor: 'var(--success)',
              color: 'var(--success-foreground)',
              width: '80px',
              height: '80px',
              fontSize: '2rem',
            }}
          >
            📧
          </ThemeIcon>

          <Stack gap="sm" align="center">
            <Text ta="center" fw={500}>
              Password reset link sent!
            </Text>
            <Text ta="center" size="sm" c="dimmed" maw={400}>
              We've sent a password reset link to your email address. Please
              check your inbox and follow the instructions to reset your
              password.
            </Text>
          </Stack>

          <Stack gap="sm" w="100%">
            <Button
              fullWidth
              variant="light"
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
              }}
            >
              Back to Sign In
            </Button>

            <Button
              fullWidth
              variant="subtle"
              onClick={() => setEmailSent(false)}
            >
              Try Different Email
            </Button>
          </Stack>

          <Text ta="center" size="xs" c="dimmed">
            Didn't receive an email? Check your spam folder or{' '}
            <Anchor
              onClick={() => setEmailSent(false)}
              style={{ cursor: 'pointer' }}
              size="xs"
            >
              try again
            </Anchor>
          </Text>
        </Stack>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive reset instructions"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Alert color="blue" variant="light">
            <Text size="sm">
              Enter the email address associated with your account and we'll
              send you a link to reset your password.
            </Text>
          </Alert>

          <TextInput
            label="Email Address"
            placeholder="your@email.com"
            required
            {...form.getInputProps('email')}
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
            Send Reset Instructions
          </Button>

          <Stack gap="sm" align="center">
            <Text ta="center" size="sm" c="dimmed">
              Remember your password?{' '}
              <Anchor
                onClick={() => navigate('/login')}
                style={{
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                Sign in
              </Anchor>
            </Text>

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
                Create one
              </Anchor>
            </Text>
          </Stack>

          {/* Demo Mode Notice */}
          <Paper
            p="sm"
            radius="md"
            style={{
              backgroundColor: 'var(--muted)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
            }}
          >
            <Stack gap="xs">
              <Text size="xs" fw={500} c="dimmed">
                Demo Mode Notice:
              </Text>
              <Text size="xs" c="dimmed">
                In demo mode, no actual emails are sent. You can use the demo
                accounts to explore the platform features.
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </form>
    </AuthLayout>
  );
};
