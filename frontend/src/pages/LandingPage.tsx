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
      name: 'Grace Wanjiku',
      role: 'Form 4 Student, Nairobi',
      text: 'Elimu Smart helped me discover my passion for data science. The assessment was incredibly accurate and the counselor guidance was invaluable.',
      rating: 5
    },
    {
      name: 'James Kiprotich',
      role: 'University Freshman, Eldoret',
      text: 'The subject-to-career mapping feature opened my eyes to opportunities I never knew existed. Now I\'m confidently pursuing engineering.',
      rating: 5
    },
    {
      name: 'Grace Muthoni',
      role: 'Parent, Kisumu',
      text: 'As a parent, seeing my daughter gain career clarity through Elimu Smart has been amazing. The platform is comprehensive and user-friendly.',
      rating: 5
    },
  ];

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)',
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
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              🏆 #1 Career Guidance Platform in Kenya
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
              Your Journey to{' '}
              <br />
              <span style={{ 
                background: 'linear-gradient(45deg, #fbbf24, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Career Success
              </span>{' '}
              Starts Here
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
              Discover your perfect career path with AI-powered guidance tailored 
              for Kenyan students. From KCSE subject mapping to university 
              scholarships - we've got you covered.
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
                variant="secondary"
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

            {/* Success Indicators with enhanced styling */}
            <Group gap="lg" mt="xl" justify="center">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '-2px' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      width: '24px', 
                      height: '24px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      border: '2px solid white',
                      borderRadius: '50%',
                      marginLeft: i > 1 ? '-8px' : '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: 'white'
                    }}>
                      S{i}
                    </div>
                  ))}
                </div>
                <div>
                  <Text size="sm" style={{ color: 'white', fontWeight: 600 }}>
                    15,000+ students guided
                  </Text>
                  <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    ⭐⭐⭐⭐⭐ 4.9/5 rating
                  </Text>
                </div>
              </div>
            </Group>
          </Stack>
        </Center>
      </Container>

      {/* Stats Section */}
      <div
        style={{
          backgroundColor: 'rgba(249, 115, 22, 0.05)',
          paddingTop: '3rem',
          paddingBottom: '3rem',
        }}
      >
        <Container size="lg">
          <Stack align="center" gap="xl">
            <Title order={2} ta="center" style={{ color: 'var(--foreground)' }}>
              Trusted by Thousands of Students
            </Title>
            <Grid gutter="xl">
              {[
                { number: '15,000+', label: 'Students Guided', icon: '🎯' },
                { number: '89%', label: 'Success Rate', icon: '📈' },
                { number: '500+', label: 'Career Paths', icon: '📚' },
                { number: '50+', label: 'Universities', icon: '🎓' }
              ].map((stat, index) => (
                <Grid.Col key={index} span={{ base: 6, sm: 3 }}>
                  <Stack align="center" gap="xs">
                    <ThemeIcon
                      size={60}
                      radius="xl"
                      style={{
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        color: 'white',
                        fontSize: '1.5rem'
                      }}
                    >
                      {stat.icon}
                    </ThemeIcon>
                    <Title order={2} size="2rem" style={{ color: '#f97316', margin: 0 }}>
                      {stat.number}
                    </Title>
                    <Text size="sm" c="dimmed" ta="center">
                      {stat.label}
                    </Text>
                  </Stack>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </div>

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
              <Badge
                size="md"
                variant="light"
                style={{
                  backgroundColor: 'rgba(249, 115, 22, 0.1)',
                  color: '#f97316',
                  marginBottom: '8px'
                }}
              >
                ⭐ Core Features
              </Badge>
              <Title order={2} size="2.5rem" ta="center">
                Everything You Need for{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #f97316, #dc2626)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Career Success
                </span>
              </Title>
              <Text size="lg" ta="center" c="dimmed" maw={600}>
                Our comprehensive platform provides students with AI-powered assessments, 
                expert guidance, and real-time market insights.
              </Text>
            </Stack>

            <Grid gutter="lg">
              {features.map((feature, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                  <Card
                    shadow="sm"
                    padding="lg"
                    radius="xl"
                    h="100%"
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      border: '1px solid var(--border)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
                    }}
                  >
                    <Stack gap="md" h="100%">
                      <ThemeIcon
                        size={56}
                        radius="xl"
                        style={{
                          background: index % 6 === 0 ? 'linear-gradient(135deg, #f97316, #ea580c)' :
                                     index % 6 === 1 ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' :
                                     index % 6 === 2 ? 'linear-gradient(135deg, #10b981, #059669)' :
                                     index % 6 === 3 ? 'linear-gradient(135deg, #a855f7, #7c3aed)' :
                                     index % 6 === 4 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                                                       'linear-gradient(135deg, #ec4899, #db2777)',
                          color: 'white',
                          fontSize: '1.5rem',
                        }}
                      >
                        {feature.icon}
                      </ThemeIcon>
                      <Stack gap="xs">
                        <Title order={4} size="1.2rem">
                          {feature.title}
                        </Title>
                        <Text size="sm" c="dimmed" style={{ flex: 1, lineHeight: 1.5 }}>
                          {feature.description}
                        </Text>
                        <Group gap="xs" style={{ marginTop: 'auto' }}>
                          <Text size="sm" fw={500} style={{ color: '#f97316' }}>
                            Learn More
                          </Text>
                          <span style={{ color: '#f97316' }}>→</span>
                        </Group>
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
                    padding="xl"
                    radius="xl"
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      border: '1px solid var(--border)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
                    }}
                  >
                    <Stack gap="md">
                      <Group gap="xs">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} style={{ color: '#fbbf24', fontSize: '16px' }}>⭐</span>
                        ))}
                      </Group>
                      <Text size="md" style={{ fontStyle: 'italic', lineHeight: 1.6, color: 'var(--foreground)' }}>
                        "{testimonial.text}"
                      </Text>
                      <Group justify="space-between" align="center">
                        <div>
                          <Text fw={600} size="sm" style={{ color: 'var(--foreground)' }}>
                            {testimonial.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {testimonial.role}
                          </Text>
                        </div>
                        <ThemeIcon
                          size={32}
                          radius="xl"
                          style={{
                            backgroundColor: 'rgba(249, 115, 22, 0.1)',
                            color: '#f97316'
                          }}
                        >
                          👤
                        </ThemeIcon>
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
            'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)',
          paddingTop: '4rem',
          paddingBottom: '4rem',
        }}
      >
        <Container size="lg">
          <Stack gap="xl" align="center">
            <Stack gap="sm" align="center">
              <Title
                order={2}
                size="3rem"
                ta="center"
                style={{ color: 'white', lineHeight: 1.2 }}
              >
                Ready to Discover Your
                <br />
                Perfect Career Path?
              </Title>
              <Text
                size="xl"
                ta="center"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: 600,
                  lineHeight: 1.6
                }}
              >
                Join thousands of Kenyan students who have found clarity and direction 
                through our AI-powered career guidance platform.
              </Text>
            </Stack>

            <Group gap="md">
              <Button
                size="xl"
                variant="white"
                style={{
                  color: '#f97316',
                  backgroundColor: 'white',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
                }}
                onClick={() => navigate('/register')}
              >
                Start Your Journey Today →
              </Button>
              <Button
                size="xl"
                variant="secondary"
                style={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.6)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
                onClick={() => navigate('/login')}
              >
                📞 Talk to Expert
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
