import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Select,
  Text,
  Group,
  Progress,
  List,
  ThemeIcon,
  Anchor,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/layouts/AuthLayout';
import type { RegisterData } from '../types';

interface PasswordRequirement {
  meets: boolean;
  label: string;
}

const requirements = [
  { re: /.{8,}/, label: 'At least 8 characters' },
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string): number {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

function PasswordRequirement({ meets, label }: PasswordRequirement) {
  return (
    <Text
      c={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size="sm"
    >
      <ThemeIcon size="sm" radius="xl" color={meets ? 'teal' : 'red'} mr="sm">
        {meets ? '✓' : '✗'}
      </ThemeIcon>
      {label}
    </Text>
  );
}

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { register, error } = useAuth();

  const form = useForm<RegisterData>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'student',
    },
    validate: {
      firstName: (value) => 
        value.length < 2 ? 'First name must have at least 2 characters' : null,
      lastName: (value) => 
        value.length < 2 ? 'Last name must have at least 2 characters' : null,
      email: (value) => 
        /^\S+@\S+$/.test(value) ? null : 'Invalid email address',
      password: (value) => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must include uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must include lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must include a number';
        if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(value)) return 'Password must include special character';
        return null;
      },
      role: (value) => 
        !value ? 'Please select a role' : null,
    },
  });

  const handleSubmit = async (values: RegisterData) => {
    setIsLoading(true);
    try {
      await register(values);
      notifications.show({
        title: 'Registration Successful!',
        message: `Welcome to Elimu Smart, ${values.firstName}!`,
        color: 'green',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getStrength(password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement 
      key={index} 
      label={requirement.label} 
      meets={requirement.re.test(password)} 
    />
  ));

  return (
    <AuthLayout
      title="Join Elimu Smart"
      subtitle="Create your account to get started"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {error && (
            <Alert color="red" variant="light">
              {error}
            </Alert>
          )}

          <Group grow>
            <TextInput
              label="First Name"
              placeholder="John"
              required
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              required
              {...form.getInputProps('lastName')}
            />
          </Group>

          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            {...form.getInputProps('email')}
          />

          <Select
            label="I am a..."
            placeholder="Select your role"
            required
            data={[
              { value: 'student', label: '🎓 Student' },
              { value: 'counselor', label: '👨‍🏫 Career Counselor' },
              { value: 'admin', label: '👨‍💼 Administrator' },
            ]}
            {...form.getInputProps('role')}
          />

          <Stack gap="xs">
            <PasswordInput
              label="Password"
              placeholder="Create a strong password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
                form.setFieldValue('password', event.currentTarget.value);
              }}
              error={form.errors.password}
            />

            {password.length > 0 && (
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" fw={500}>
                    Password strength
                  </Text>
                  <Text size="sm" c={color} fw={500}>
                    {strength < 30 ? 'Weak' : strength < 70 ? 'Fair' : strength < 100 ? 'Good' : 'Strong'}
                  </Text>
                </Group>
                <Progress color={color} value={strength} size="sm" />
              </Stack>
            )}

            {password.length > 0 && (
              <Stack gap={0}>
                <Text size="sm" fw={500} mb="xs">
                  Password requirements:
                </Text>
                <List size="sm" spacing={0}>
                  {checks}
                </List>
              </Stack>
            )}
          </Stack>

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            size="md"
            disabled={strength < 100}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            Create Account
          </Button>

          <Text ta="center" size="sm" c="dimmed">
            Already have an account?{' '}
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

          <Text ta="center" size="xs" c="dimmed" mt="md">
            By creating an account, you agree to our{' '}
            <Anchor href="#" size="xs">Terms of Service</Anchor>
            {' '}and{' '}
            <Anchor href="#" size="xs">Privacy Policy</Anchor>
          </Text>
        </Stack>
      </form>
    </AuthLayout>
  );
};