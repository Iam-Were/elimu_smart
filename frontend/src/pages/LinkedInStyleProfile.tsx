import React from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Avatar,
  Badge,
  Button,
  SimpleGrid,
  Divider,
  UnstyledButton,
} from '@mantine/core';
import {
  PersonIcon,
  GearIcon,
  PlusIcon,
  StarIcon,
  CalendarIcon,
  TargetIcon,
  BookmarkIcon,
} from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: React.ComponentType<{ width?: number; height?: number }>;
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  endorsements: number;
}

export const LinkedInStyleProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock achievement data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Career Assessment Completed',
      description: 'Successfully completed comprehensive career assessment with 85% confidence score',
      date: 'January 2024',
      icon: TargetIcon
    },
    {
      id: '2', 
      title: 'Subject Mapping Expert',
      description: 'Mapped 8 subjects to potential career paths with 92% accuracy',
      date: 'December 2023',
      icon: BookmarkIcon
    }
  ];

  // Mock skills data
  const skills: Skill[] = [
    { id: '1', name: 'Mathematics', level: 'Advanced', endorsements: 5 },
    { id: '2', name: 'Physics', level: 'Intermediate', endorsements: 3 },
    { id: '3', name: 'Chemistry', level: 'Advanced', endorsements: 4 },
    { id: '4', name: 'Leadership', level: 'Intermediate', endorsements: 2 }
  ];

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'green';
      case 'Advanced':
        return 'blue';
      case 'Intermediate':
        return 'orange';
      case 'Beginner':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <Container size="lg" py="md">
      <Stack gap="lg">
        {/* Profile Header - LinkedIn Style */}
        <Card
          shadow="sm"
          padding="xl"
          radius="md"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            border: '1px solid var(--border)',
          }}
        >
          <Group gap="xl" align="flex-start">
            {/* Profile Photo */}
            <Avatar
              size={120}
              radius="xl"
              color="blue"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
            
            {/* Profile Info */}
            <Stack gap="sm" style={{ flex: 1 }}>
              <Stack gap="xs">
                <Title order={1} size="2rem">
                  {user?.firstName} {user?.lastName}
                </Title>
                <Text size="lg" c="dimmed">
                  {user?.role === 'student' ? 'Student' : 'Professional'} • Form 4 Student
                </Text>
                <Text size="sm" c="dimmed">
                  Elimu Smart Career Development Platform
                </Text>
              </Stack>
              
              {/* Quick Stats */}
              <Group gap="md">
                <Badge
                  size="lg"
                  variant="light"
                  color="blue"
                  leftSection={<StarIcon width={14} height={14} />}
                >
                  88% Career Clarity
                </Badge>
                <Badge
                  size="lg"
                  variant="light"
                  color="green"
                  leftSection={<TargetIcon width={14} height={14} />}
                >
                  3/4 Assessments Complete
                </Badge>
              </Group>
              
              {/* Action Buttons */}
              <Group gap="sm" mt="sm">
                <Button
                  leftSection={<GearIcon width={16} height={16} />}
                  variant="light"
                  onClick={() => navigate('/settings/profile')}
                >
                  Edit Profile
                </Button>
                <Button
                  leftSection={<PersonIcon width={16} height={16} />}
                  variant="outline"
                  onClick={() => navigate('/counseling')}
                >
                  Book Counselor Session
                </Button>
              </Group>
            </Stack>
          </Group>
        </Card>

        {/* About Section */}
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
              <Title order={3}>About</Title>
              <UnstyledButton
                onClick={() => navigate('/settings/profile')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <PlusIcon width={16} height={16} />
              </UnstyledButton>
            </Group>
            <Text c="dimmed">
              I am a dedicated Form 4 student passionate about exploring career opportunities in STEM fields. 
              Through the Elimu Smart platform, I have discovered strong alignment with engineering and technology 
              careers. I am currently preparing for KCSE examinations and planning my university pathway.
            </Text>
          </Stack>
        </Card>

        {/* Academic Timeline & Skills - Side by Side */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {/* Achievements Timeline */}
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
                <Title order={3}>Achievements</Title>
                <Badge size="sm" variant="light" color="blue">
                  {achievements.length} earned
                </Badge>
              </Group>
              <Stack gap="md">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <Group key={achievement.id} gap="md" align="flex-start">
                      <div 
                        style={{ 
                          color: 'var(--primary)',
                          padding: '8px',
                          backgroundColor: 'var(--muted)',
                          borderRadius: '8px'
                        }}
                      >
                        <Icon width={20} height={20} />
                      </div>
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Text fw={500}>{achievement.title}</Text>
                        <Text size="sm" c="dimmed">
                          {achievement.description}
                        </Text>
                        <Group gap="xs">
                          <CalendarIcon width={12} height={12} style={{ color: 'var(--muted-foreground)' }} />
                          <Text size="xs" c="dimmed">{achievement.date}</Text>
                        </Group>
                      </Stack>
                    </Group>
                  );
                })}
              </Stack>
            </Stack>
          </Card>

          {/* Skills Section */}
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
                <Title order={3}>Skills & Subjects</Title>
                <Badge size="sm" variant="light" color="green">
                  {skills.length} subjects
                </Badge>
              </Group>
              <Stack gap="sm">
                {skills.map((skill) => (
                  <Group key={skill.id} justify="space-between" align="center">
                    <Stack gap={2} style={{ flex: 1 }}>
                      <Text fw={500} size="sm">{skill.name}</Text>
                      <Group gap="xs">
                        <Badge
                          size="xs"
                          color={getSkillLevelColor(skill.level)}
                          variant="light"
                        >
                          {skill.level}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {skill.endorsements} endorsements
                        </Text>
                      </Group>
                    </Stack>
                    <UnstyledButton
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--border)',
                        transition: 'all 0.2s',
                        fontSize: '12px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                        e.currentTarget.style.borderColor = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }}
                    >
                      <PlusIcon width={12} height={12} />
                    </UnstyledButton>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Academic Portfolio */}
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
              <Title order={3}>Academic Portfolio</Title>
              <Button
                size="sm"
                variant="light"
                leftSection={<PlusIcon width={14} height={14} />}
              >
                Add Project
              </Button>
            </Group>
            <Divider />
            <Group gap="xl" justify="center" py="xl">
              <Stack gap="sm" align="center">
                <div 
                  style={{ 
                    padding: '16px',
                    backgroundColor: 'var(--muted)',
                    borderRadius: '12px',
                    color: 'var(--muted-foreground)'
                  }}
                >
                  <BookmarkIcon width={24} height={24} />
                </div>
                <Text size="sm" c="dimmed" ta="center">
                  Start building your academic portfolio by adding projects, 
                  research work, and achievements.
                </Text>
                <Button size="xs" variant="outline">
                  Upload First Project
                </Button>
              </Stack>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};