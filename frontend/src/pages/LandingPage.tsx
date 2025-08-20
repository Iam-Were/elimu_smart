import React from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Grid,
  Card,
  ThemeIcon,
  List,
  Badge,
  Anchor,
  Center,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🎯',
      title: 'Personalized Career Guidance',
      description:
        'Get tailored career recommendations based on your interests, skills, and academic performance.',
    },
    {
      icon: '📊',
      title: 'Academic Progress Tracking',
      description:
        'Monitor your academic journey with detailed analytics and progress reports.',
    },
    {
      icon: '👥',
      title: 'Expert Counselor Support',
      description:
        'Connect with professional career counselors for personalized advice and mentorship.',
    },
    {
      icon: '📚',
      title: 'Learning Resources',
      description:
        'Access comprehensive study materials and career development resources.',
    },
    {
      icon: '🚀',
      title: 'Future Planning',
      description:
        'Create actionable plans for your academic and career goals with timeline tracking.',
    },
    {
      icon: '🌐',
      title: 'University Matching',
      description:
        'Find the perfect university programs that align with your career aspirations.',
    },
  ];

  const benefits = [
    'AI-powered career recommendation engine',
    'Real-time academic progress monitoring',
    'Professional counselor network access',
    'Comprehensive university database',
    'Interactive career exploration tools',
    'Personalized learning pathways',
    'Goal setting and milestone tracking',
    'Parent and teacher collaboration tools',
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'High School Student',
      text: 'Elimu Smart helped me discover my passion for computer science and guided me to the perfect university program!',
    },
    {
      name: 'Dr. James K.',
      role: 'Career Counselor',
      text: 'This platform revolutionizes how we support students. The analytics and tools are incredibly comprehensive.',
    },
    {
      name: 'Michael R.',
      role: 'University Graduate',
      text: "Started using Elimu Smart in high school. Now I'm in my dream career thanks to their guidance!",
    },
  ];

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Navigation Header */}
      <Container size="lg" py="md">
        <Group justify="space-between" align="center">
          <Title order={2} style={{ color: 'white' }}>
            Elimu Smart
          </Title>
          <Group>
            <Button
              variant="subtle"
              style={{ color: 'white' }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button
              variant="white"
              style={{
                color: 'var(--primary)',
                backgroundColor: 'white',
              }}
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </Group>
        </Group>
      </Container>

      {/* Hero Section */}
      <Container size="lg" py="xl">
        <Center>
          <Stack gap="xl" align="center" maw={800}>
            <Badge
              size="lg"
              variant="light"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            >
              🚀 Your Future Starts Here
            </Badge>

            <Title
              order={1}
              size="3.5rem"
              ta="center"
              style={{
                color: 'white',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Smart Career Guidance for
              <br />
              <span style={{ color: 'var(--accent-foreground)' }}>
                Tomorrow's Leaders
              </span>
            </Title>

            <Text
              size="xl"
              ta="center"
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: 600,
                lineHeight: 1.6,
              }}
            >
              Empowering students with AI-driven career insights, personalized
              learning paths, and expert guidance to achieve their academic and
              professional dreams.
            </Text>

            <Group gap="md" mt="lg">
              <Button
                size="xl"
                variant="white"
                style={{
                  color: 'var(--primary)',
                  backgroundColor: 'white',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '16px 32px',
                }}
                onClick={() => navigate('/register')}
              >
                Start Your Journey
              </Button>
              <Button
                size="xl"
                variant="outline"
                style={{
                  color: 'white',
                  borderColor: 'white',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '16px 32px',
                }}
                onClick={() => navigate('/login')}
              >
                Explore Demo
              </Button>
            </Group>

            <Group gap="lg" mt="xl">
              <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                ⭐ Trusted by 10,000+ students
              </Text>
              <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                🎓 500+ university partners
              </Text>
              <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                👨‍🏫 200+ expert counselors
              </Text>
            </Group>
          </Stack>
        </Center>
      </Container>

      {/* Features Section */}
      <div
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          paddingTop: '4rem',
          paddingBottom: '4rem',
        }}
      >
        <Container size="lg">
          <Stack gap="xl" align="center">
            <Stack gap="sm" align="center">
              <Title order={2} size="2.5rem" ta="center">
                Everything You Need to Succeed
              </Title>
              <Text size="lg" ta="center" c="dimmed" maw={600}>
                Comprehensive tools and resources designed to guide your
                educational journey and career development.
              </Text>
            </Stack>

            <Grid gutter="lg">
              {features.map((feature, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                  <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    h="100%"
                    className="hover-lift theme-transition"
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <Stack gap="md" h="100%">
                      <ThemeIcon
                        size="xl"
                        radius="md"
                        style={{
                          backgroundColor: 'var(--secondary)',
                          color: 'var(--secondary-foreground)',
                          fontSize: '1.5rem',
                        }}
                      >
                        {feature.icon}
                      </ThemeIcon>
                      <Stack gap="xs">
                        <Title order={4} size="1.2rem">
                          {feature.title}
                        </Title>
                        <Text size="sm" c="dimmed" style={{ flex: 1 }}>
                          {feature.description}
                        </Text>
                      </Stack>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </div>

      {/* Benefits Section */}
      <div
        style={{
          backgroundColor: 'var(--muted)',
          color: 'var(--muted-foreground)',
          paddingTop: '4rem',
          paddingBottom: '4rem',
        }}
      >
        <Container size="lg">
          <Grid align="center">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg">
                <Stack gap="sm">
                  <Title order={2} size="2.5rem">
                    Why Choose Elimu Smart?
                  </Title>
                  <Text size="lg" c="dimmed">
                    Join thousands of students who have transformed their
                    futures with our comprehensive career guidance platform.
                  </Text>
                </Stack>

                <List
                  spacing="sm"
                  size="md"
                  icon={
                    <ThemeIcon
                      size="sm"
                      radius="xl"
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                      }}
                    >
                      ✓
                    </ThemeIcon>
                  }
                >
                  {benefits.map((benefit, index) => (
                    <List.Item key={index}>
                      <Text fw={500}>{benefit}</Text>
                    </List.Item>
                  ))}
                </List>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                {testimonials.map((testimonial, index) => (
                  <Card
                    key={index}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <Stack gap="sm">
                      <Text size="sm" style={{ fontStyle: 'italic' }}>
                        "{testimonial.text}"
                      </Text>
                      <Group justify="space-between">
                        <Text fw={600} size="sm">
                          {testimonial.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {testimonial.role}
                        </Text>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </div>

      {/* CTA Section */}
      <div
        style={{
          background:
            'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          paddingTop: '4rem',
          paddingBottom: '4rem',
        }}
      >
        <Container size="lg">
          <Stack gap="xl" align="center">
            <Stack gap="sm" align="center">
              <Title
                order={2}
                size="2.5rem"
                ta="center"
                style={{ color: 'white' }}
              >
                Ready to Shape Your Future?
              </Title>
              <Text
                size="lg"
                ta="center"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: 600,
                }}
              >
                Join Elimu Smart today and take the first step towards achieving
                your academic and career goals.
              </Text>
            </Stack>

            <Group gap="md">
              <Button
                size="xl"
                variant="white"
                style={{
                  color: 'var(--primary)',
                  backgroundColor: 'white',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '16px 32px',
                }}
                onClick={() => navigate('/register')}
              >
                Get Started Free
              </Button>
              <Button
                size="xl"
                variant="outline"
                style={{
                  color: 'white',
                  borderColor: 'white',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '16px 32px',
                }}
                onClick={() => navigate('/login')}
              >
                Try Demo
              </Button>
            </Group>

            <Group gap="lg" mt="xl">
              <Anchor
                href="#"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                size="sm"
              >
                Privacy Policy
              </Anchor>
              <Anchor
                href="#"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                size="sm"
              >
                Terms of Service
              </Anchor>
              <Anchor
                href="#"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                size="sm"
              >
                Contact Support
              </Anchor>
            </Group>
          </Stack>
        </Container>
      </div>
    </div>
  );
};
