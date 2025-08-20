import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Button,
  TextInput,
  Badge,
  Avatar,
  Alert,
  Tabs,
  Textarea,
  Modal,
} from '@mantine/core';
import {
  ChatBubbleIcon,
  BookmarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons';
import { useDisclosure } from '@mantine/hooks';

interface CounselorMessage {
  id: string;
  fromCounselor: string;
  toCounselor: string;
  subject: string;
  content: string;
  timestamp: Date;
  read: boolean;
  category: 'consultation' | 'resource-sharing' | 'general';
}

interface ResourceShare {
  id: string;
  counselor: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  url?: string;
  attachment?: string;
  likes: number;
  timestamp: Date;
}

interface BestPractice {
  id: string;
  counselor: string;
  title: string;
  description: string;
  category: string;
  effectiveness: number;
  implementation: string[];
  outcomes: string[];
  timestamp: Date;
}

// Mock data
const mockMessages: CounselorMessage[] = [
  {
    id: '1',
    fromCounselor: 'Dr. Jane Smith',
    toCounselor: 'Current User',
    subject: 'Student with Complex Career Anxiety',
    content: 'Hi! I have a Form 4 student showing severe anxiety about career choices. They are academically strong but paralyzed by indecision. Have you encountered similar cases? Would love to discuss intervention strategies.',
    timestamp: new Date('2024-01-20T10:30:00'),
    read: false,
    category: 'consultation',
  },
  {
    id: '2',
    fromCounselor: 'Michael Johnson',
    toCounselor: 'Current User',
    subject: 'Group Session Success Story',
    content: 'Just wanted to share that the career exploration workshop template you shared last month worked amazingly well! Had 15 students participate and 90% reported increased clarity about their future paths.',
    timestamp: new Date('2024-01-18T14:15:00'),
    read: true,
    category: 'resource-sharing',
  },
];

const mockResources: ResourceShare[] = [
  {
    id: '1',
    counselor: 'Dr. Sarah Williams',
    title: 'KUCCPS Application Checklist',
    description: 'Comprehensive checklist for students applying through KUCCPS, including deadlines and required documents',
    category: 'University Applications',
    tags: ['KUCCPS', 'university', 'applications', 'checklist'],
    attachment: 'kuccps-checklist.pdf',
    likes: 12,
    timestamp: new Date('2024-01-15T09:00:00'),
  },
  {
    id: '2',
    counselor: 'James Ochieng',
    title: 'Career Assessment Tool - Updated Version',
    description: 'Modified career interest assessment specifically designed for Kenyan students, includes local career options',
    category: 'Assessment Tools',
    tags: ['assessment', 'career-interest', 'tools'],
    url: 'https://career-assessment.example.com',
    likes: 8,
    timestamp: new Date('2024-01-12T16:45:00'),
  },
];

const mockBestPractices: BestPractice[] = [
  {
    id: '1',
    counselor: 'Dr. Mary Wanjiku',
    title: 'Involving Parents in Career Guidance Process',
    description: 'Effective strategies for engaging parents who have different career expectations for their children',
    category: 'Parent Engagement',
    effectiveness: 85,
    implementation: [
      'Schedule initial parent-student-counselor meeting',
      'Present objective career assessment results',
      'Facilitate open discussion about student interests vs parent expectations',
      'Develop compromise career path with multiple options',
    ],
    outcomes: [
      'Reduced family conflict over career choices',
      'Increased parent support for student decisions',
      'Better student confidence in career path',
    ],
    timestamp: new Date('2024-01-10T11:20:00'),
  },
];

export const CounselorCollaboration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [messageForm, setMessageForm] = useState({
    to: '',
    subject: '',
    content: '',
    category: 'general',
  });

  const handleSendMessage = () => {
    // In a real app, this would send the message
    console.log('Sending message:', messageForm);
    setMessageForm({ to: '', subject: '', content: '', category: 'general' });
    close();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="2rem">
              Counselor Collaboration Hub
            </Title>
            <Text size="lg" c="dimmed">
              Connect, share, and learn from fellow counselors
            </Text>
          </Stack>
          <Button
            leftSection={<PlusIcon width={16} height={16} />}
            onClick={open}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            New Message
          </Button>
        </Group>

        {/* Search and Filter */}
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
          <Group gap="md">
            <TextInput
              placeholder="Search messages, resources, or practices..."
              leftSection={<MagnifyingGlassIcon width={16} height={16} />}
              value={searchQuery}
              onChange={e => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
          </Group>
        </Card>

        {/* Collaboration Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="messages" leftSection={<ChatBubbleIcon width={14} height={14} />}>
              Messages ({mockMessages.filter(m => !m.read).length} unread)
            </Tabs.Tab>
            <Tabs.Tab value="resources" leftSection={<BookmarkIcon width={14} height={14} />}>
              Resource Library ({mockResources.length})
            </Tabs.Tab>
            <Tabs.Tab value="practices" leftSection={<CheckCircledIcon width={14} height={14} />}>
              Best Practices ({mockBestPractices.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* Messages Tab */}
          <Tabs.Panel value="messages" pt="lg">
            <Stack gap="md">
              {mockMessages.length === 0 ? (
                <Alert icon={<ChatBubbleIcon width={16} height={16} />} color="blue">
                  No messages yet. Start collaborating with fellow counselors!
                </Alert>
              ) : (
                mockMessages.map(message => (
                  <Card
                    key={message.id}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    className="hover-lift theme-transition"
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: message.read ? 'var(--border)' : 'var(--primary)',
                      border: `2px solid ${message.read ? 'var(--border)' : 'var(--primary)'}`,
                    }}
                  >
                    <Stack gap="sm">
                      <Group justify="space-between" align="flex-start">
                        <Group gap="sm">
                          <Avatar
                            size={32}
                            radius="xl"
                            color="yellow"
                            style={{ backgroundColor: 'var(--secondary)' }}
                          >
                            {message.fromCounselor.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Stack gap={2}>
                            <Text fw={500} size="sm">{message.fromCounselor}</Text>
                            <Text size="xs" c="dimmed">{formatDate(message.timestamp)}</Text>
                          </Stack>
                        </Group>
                        <Group gap="xs">
                          <Badge
                            size="sm"
                            color={message.category === 'consultation' ? 'red' : message.category === 'resource-sharing' ? 'blue' : 'green'}
                            variant="light"
                          >
                            {message.category.replace('-', ' ')}
                          </Badge>
                          {!message.read && (
                            <Badge size="sm" color="red" variant="filled">
                              NEW
                            </Badge>
                          )}
                        </Group>
                      </Group>

                      <Text fw={500}>{message.subject}</Text>
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {message.content}
                      </Text>

                      <Group justify="flex-end">
                        <Button size="sm" variant="light">
                          Reply
                        </Button>
                        <Button size="sm" variant="light">
                          View Full
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                ))
              )}
            </Stack>
          </Tabs.Panel>

          {/* Resources Tab */}
          <Tabs.Panel value="resources" pt="lg">
            <Stack gap="md">
              {mockResources.map(resource => (
                <Card
                  key={resource.id}
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
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                      <Group gap="sm">
                        <Avatar
                          size={32}
                          radius="xl"
                          color="blue"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          {resource.counselor.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Stack gap={2}>
                          <Text fw={500}>{resource.title}</Text>
                          <Text size="xs" c="dimmed">
                            by {resource.counselor} • {formatDate(resource.timestamp)}
                          </Text>
                        </Stack>
                      </Group>
                      <Badge size="sm" color="blue" variant="light">
                        {resource.category}
                      </Badge>
                    </Group>

                    <Text size="sm" c="dimmed">
                      {resource.description}
                    </Text>

                    <Group gap="xs">
                      {resource.tags.slice(0, 4).map(tag => (
                        <Badge key={tag} size="xs" variant="outline" color="gray">
                          #{tag}
                        </Badge>
                      ))}
                    </Group>

                    <Group justify="space-between">
                      <Group gap="sm">
                        <Text size="sm" c="dimmed">
                          ❤️ {resource.likes} likes
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <Button size="sm" variant="light">
                          Download
                        </Button>
                        <Button size="sm" variant="light">
                          Like
                        </Button>
                      </Group>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Tabs.Panel>

          {/* Best Practices Tab */}
          <Tabs.Panel value="practices" pt="lg">
            <Stack gap="md">
              {mockBestPractices.map(practice => (
                <Card
                  key={practice.id}
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
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                      <Group gap="sm">
                        <Avatar
                          size={32}
                          radius="xl"
                          color="green"
                          style={{ backgroundColor: 'var(--success)' }}
                        >
                          {practice.counselor.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Stack gap={2}>
                          <Text fw={500}>{practice.title}</Text>
                          <Text size="xs" c="dimmed">
                            by {practice.counselor} • {formatDate(practice.timestamp)}
                          </Text>
                        </Stack>
                      </Group>
                      <Group gap="xs">
                        <Badge size="sm" color="green" variant="light">
                          {practice.category}
                        </Badge>
                        <Badge size="sm" color="green" variant="filled">
                          {practice.effectiveness}% effective
                        </Badge>
                      </Group>
                    </Group>

                    <Text size="sm" c="dimmed">
                      {practice.description}
                    </Text>

                    <Card padding="sm" style={{ backgroundColor: 'var(--muted)' }}>
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>Implementation Steps:</Text>
                        {practice.implementation.slice(0, 2).map((step, index) => (
                          <Text key={index} size="sm">
                            {index + 1}. {step}
                          </Text>
                        ))}
                        {practice.implementation.length > 2 && (
                          <Text size="sm" c="dimmed">
                            +{practice.implementation.length - 2} more steps
                          </Text>
                        )}
                      </Stack>
                    </Card>

                    <Card padding="sm" style={{ backgroundColor: 'var(--muted)' }}>
                      <Stack gap="xs">
                        <Text size="sm" fw={500} c="green">Key Outcomes:</Text>
                        {practice.outcomes.map((outcome, index) => (
                          <Text key={index} size="sm" c="green">
                            ✓ {outcome}
                          </Text>
                        ))}
                      </Stack>
                    </Card>

                    <Group justify="flex-end">
                      <Button size="sm" variant="light">
                        Try This Practice
                      </Button>
                      <Button size="sm" variant="light">
                        Share Experience
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>

        {/* New Message Modal */}
        <Modal
          opened={opened}
          onClose={close}
          title="Send Message to Colleague"
          size="lg"
        >
          <Stack gap="md">
            <TextInput
              label="To"
              placeholder="Select counselor or enter email"
              value={messageForm.to}
              onChange={e => setMessageForm({ ...messageForm, to: e.target.value })}
              required
            />

            <TextInput
              label="Subject"
              placeholder="Enter message subject"
              value={messageForm.subject}
              onChange={e => setMessageForm({ ...messageForm, subject: e.target.value })}
              required
            />

            <Textarea
              label="Message"
              placeholder="Enter your message"
              value={messageForm.content}
              onChange={e => setMessageForm({ ...messageForm, content: e.target.value })}
              minRows={4}
              required
            />

            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={close}>
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                Send Message
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};