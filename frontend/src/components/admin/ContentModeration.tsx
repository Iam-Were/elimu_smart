import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Button,
  Badge,
  TextInput,
  Select,
  Alert,
  Tabs,
  Textarea,
  Modal,
  ActionIcon,
  Tooltip,
  SimpleGrid,
} from '@mantine/core';
import {
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  Cross1Icon,
  EyeOpenIcon,
  ChatBubbleIcon,
  PersonIcon,
  ClockIcon,
} from '@radix-ui/react-icons';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

interface ContentItem {
  id: string;
  type: 'question' | 'answer' | 'comment' | 'resource';
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorRole: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  category: string;
  reportCount: number;
  reports: Report[];
  moderatorNotes?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
}

interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  reportedAt: Date;
  severity: 'low' | 'medium' | 'high';
}

interface ModerationAction {
  id: string;
  action: 'approve' | 'reject' | 'flag' | 'edit' | 'delete';
  contentId: string;
  moderatorId: string;
  moderatorName: string;
  reason: string;
  notes?: string;
  timestamp: Date;
}

// Mock data
const mockContentItems: ContentItem[] = [
  {
    id: '1',
    type: 'question',
    title: 'Career guidance for engineering students',
    content: 'I am a Form 4 student interested in engineering. What are the best universities in Kenya for engineering and what subjects should I focus on?',
    author: 'John Mwangi',
    authorId: 'user1',
    authorRole: 'student',
    createdAt: new Date('2024-01-20T10:30:00'),
    status: 'pending',
    category: 'Career Guidance',
    reportCount: 0,
    reports: [],
  },
  {
    id: '2',
    type: 'answer',
    title: 'Response to: Career guidance for engineering students',
    content: 'For engineering in Kenya, I recommend University of Nairobi, JKUAT, and Moi University. Focus on Mathematics, Physics, Chemistry, and English. Make sure to excel in these subjects.',
    author: 'Dr. Mary Wanjiku',
    authorId: 'counselor1',
    authorRole: 'counselor',
    createdAt: new Date('2024-01-20T14:20:00'),
    status: 'approved',
    category: 'Career Guidance',
    reportCount: 0,
    reports: [],
    moderatedBy: 'admin1',
    moderatedAt: new Date('2024-01-20T15:00:00'),
  },
  {
    id: '3',
    type: 'question',
    title: 'Inappropriate content example',
    content: 'This is example content that has been flagged for inappropriate language or content that violates community guidelines.',
    author: 'Anonymous User',
    authorId: 'user2',
    authorRole: 'student',
    createdAt: new Date('2024-01-19T16:45:00'),
    status: 'flagged',
    category: 'General',
    reportCount: 3,
    reports: [
      {
        id: 'r1',
        reporterId: 'user3',
        reporterName: 'Sarah Wilson',
        reason: 'Inappropriate language',
        description: 'Contains offensive language and is not suitable for the platform',
        reportedAt: new Date('2024-01-19T17:00:00'),
        severity: 'high',
      },
    ],
  },
];

const mockModerationActions: ModerationAction[] = [
  {
    id: '1',
    action: 'approve',
    contentId: '2',
    moderatorId: 'admin1',
    moderatorName: 'James Kiprotich',
    reason: 'Content meets quality standards',
    timestamp: new Date('2024-01-20T15:00:00'),
  },
  {
    id: '2',
    action: 'flag',
    contentId: '3',
    moderatorId: 'admin1',
    moderatorName: 'James Kiprotich',
    reason: 'Inappropriate content reported by users',
    notes: 'Requires review before approval or removal',
    timestamp: new Date('2024-01-19T18:30:00'),
  },
];

export const ContentModeration: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>(mockContentItems);
  const [moderationActions] = useState<ModerationAction[]>(mockModerationActions);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [actionOpened, { open: openAction, close: closeAction }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('pending');
  const [moderationNotes, setModerationNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('approve');

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !filterStatus || item.status === filterStatus;
    const matchesType = !filterType || item.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'flagged':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'question':
        return <ChatBubbleIcon width={16} height={16} />;
      case 'answer':
        return <CheckCircledIcon width={16} height={16} />;
      case 'comment':
        return <ChatBubbleIcon width={16} height={16} />;
      case 'resource':
        return <PersonIcon width={16} height={16} />;
      default:
        return <ChatBubbleIcon width={16} height={16} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'green';
      case 'medium':
        return 'yellow';
      case 'high':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleViewContent = (item: ContentItem) => {
    setSelectedItem(item);
    open();
  };

  const handleModerationAction = (item: ContentItem, action: string) => {
    setSelectedItem(item);
    setSelectedAction(action);
    setModerationNotes('');
    openAction();
  };

  const submitModerationAction = () => {
    if (!selectedItem) return;

    const updatedItems = contentItems.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          status: selectedAction as ContentItem['status'],
          moderatorNotes: moderationNotes,
          moderatedBy: 'Current Admin',
          moderatedAt: new Date(),
        };
      }
      return item;
    });

    setContentItems(updatedItems);
    closeAction();

    notifications.show({
      title: 'Action Completed',
      message: `Content has been ${selectedAction}d successfully`,
      color: 'green',
    });
  };

  const getContentStats = () => {
    const stats = {
      pending: contentItems.filter(item => item.status === 'pending').length,
      approved: contentItems.filter(item => item.status === 'approved').length,
      rejected: contentItems.filter(item => item.status === 'rejected').length,
      flagged: contentItems.filter(item => item.status === 'flagged').length,
      total: contentItems.length,
    };
    return stats;
  };

  const stats = getContentStats();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
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
              Content Moderation
            </Title>
            <Text size="lg" c="dimmed">
              Review and moderate user-generated content
            </Text>
          </Stack>
          <Group gap="sm">
            {stats.pending > 0 && (
              <Badge size="lg" color="yellow" variant="filled">
                {stats.pending} Pending Review
              </Badge>
            )}
            {stats.flagged > 0 && (
              <Badge size="lg" color="red" variant="filled">
                {stats.flagged} Flagged
              </Badge>
            )}
          </Group>
        </Group>

        {/* Statistics Cards */}
        <SimpleGrid cols={{ base: 2, md: 5 }} spacing="md">
          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ClockIcon width={24} height={24} style={{ color: '#eab308' }} />
              <Text size="xs" c="dimmed" ta="center">Pending</Text>
              <Title order={2} size="1.5rem" style={{ color: '#eab308' }}>
                {stats.pending}
              </Title>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <CheckCircledIcon width={24} height={24} style={{ color: 'var(--success)' }} />
              <Text size="xs" c="dimmed" ta="center">Approved</Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--success)' }}>
                {stats.approved}
              </Title>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <Cross1Icon width={24} height={24} style={{ color: 'var(--destructive)' }} />
              <Text size="xs" c="dimmed" ta="center">Rejected</Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--destructive)' }}>
                {stats.rejected}
              </Title>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ExclamationTriangleIcon width={24} height={24} style={{ color: '#ef4444' }} />
              <Text size="xs" c="dimmed" ta="center">Flagged</Text>
              <Title order={2} size="1.5rem" style={{ color: '#ef4444' }}>
                {stats.flagged}
              </Title>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ChatBubbleIcon width={24} height={24} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">Total</Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--primary)' }}>
                {stats.total}
              </Title>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Filters */}
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
              placeholder="Search content, author, or category..."
              leftSection={<MagnifyingGlassIcon width={16} height={16} />}
              value={searchQuery}
              onChange={e => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Filter by status"
              value={filterStatus}
              onChange={setFilterStatus}
              data={[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'flagged', label: 'Flagged' },
              ]}
              clearable
              style={{ minWidth: 150 }}
            />
            <Select
              placeholder="Filter by type"
              value={filterType}
              onChange={setFilterType}
              data={[
                { value: 'question', label: 'Questions' },
                { value: 'answer', label: 'Answers' },
                { value: 'comment', label: 'Comments' },
                { value: 'resource', label: 'Resources' },
              ]}
              clearable
              style={{ minWidth: 150 }}
            />
          </Group>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="pending" leftSection={<ClockIcon width={14} height={14} />}>
              Pending Review ({stats.pending})
            </Tabs.Tab>
            <Tabs.Tab value="flagged" leftSection={<ExclamationTriangleIcon width={14} height={14} />}>
              Flagged Content ({stats.flagged})
            </Tabs.Tab>
            <Tabs.Tab value="all" leftSection={<ChatBubbleIcon width={14} height={14} />}>
              All Content ({stats.total})
            </Tabs.Tab>
            <Tabs.Tab value="actions" leftSection={<CheckCircledIcon width={14} height={14} />}>
              Recent Actions
            </Tabs.Tab>
          </Tabs.List>

          {/* Content Lists */}
          <Tabs.Panel value="pending" pt="lg">
            <Stack gap="md">
              {filteredContent.filter(item => item.status === 'pending').map(item => (
                <Card
                  key={item.id}
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
                        {getTypeIcon(item.type)}
                        <Stack gap={2} style={{ flex: 1 }}>
                          <Text fw={500}>{item.title}</Text>
                          <Text size="sm" c="dimmed" lineClamp={2}>
                            {item.content}
                          </Text>
                        </Stack>
                      </Group>
                      <Group gap="xs">
                        <Badge size="sm" color={getStatusColor(item.status)} variant="light">
                          {item.status}
                        </Badge>
                        <Badge size="sm" color="blue" variant="secondary">
                          {item.type}
                        </Badge>
                      </Group>
                    </Group>

                    <Group justify="space-between">
                      <Group gap="sm">
                        <Text size="sm" c="dimmed">
                          By {item.author} ({item.authorRole})
                        </Text>
                        <Text size="sm" c="dimmed">
                          {formatDate(item.createdAt)}
                        </Text>
                        {item.reportCount > 0 && (
                          <Badge size="sm" color="red" variant="filled">
                            {item.reportCount} reports
                          </Badge>
                        )}
                      </Group>
                      <Group gap="xs">
                        <Tooltip label="View Details">
                          <ActionIcon
                            variant="light"
                            onClick={() => handleViewContent(item)}
                          >
                            <EyeOpenIcon width={16} height={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Approve">
                          <ActionIcon
                            variant="light"
                            color="green"
                            onClick={() => handleModerationAction(item, 'approve')}
                          >
                            <CheckCircledIcon width={16} height={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Reject">
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleModerationAction(item, 'reject')}
                          >
                            <Cross1Icon width={16} height={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Flag for Review">
                          <ActionIcon
                            variant="light"
                            color="orange"
                            onClick={() => handleModerationAction(item, 'flag')}
                          >
                            <ExclamationTriangleIcon width={16} height={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="flagged" pt="lg">
            <Stack gap="md">
              {filteredContent.filter(item => item.status === 'flagged').map(item => (
                <Card
                  key={item.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: '#ef4444',
                    border: '2px solid #ef4444',
                  }}
                >
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                      <Group gap="sm">
                        <ExclamationTriangleIcon width={20} height={20} style={{ color: '#ef4444' }} />
                        <Stack gap={2} style={{ flex: 1 }}>
                          <Text fw={500}>{item.title}</Text>
                          <Text size="sm" c="dimmed" lineClamp={2}>
                            {item.content}
                          </Text>
                        </Stack>
                      </Group>
                      <Badge size="lg" color="red" variant="filled">
                        FLAGGED
                      </Badge>
                    </Group>

                    <Alert icon={<ExclamationTriangleIcon width={16} height={16} />} color="red">
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>
                          {item.reportCount} user report(s) received
                        </Text>
                        {item.reports.map(report => (
                          <Group key={report.id} justify="space-between">
                            <Text size="sm">
                              {report.reason} - {report.reporterName}
                            </Text>
                            <Badge size="sm" color={getSeverityColor(report.severity)}>
                              {report.severity}
                            </Badge>
                          </Group>
                        ))}
                      </Stack>
                    </Alert>

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        By {item.author} • {formatDate(item.createdAt)}
                      </Text>
                      <Group gap="xs">
                        <Button size="sm" variant="light" onClick={() => handleViewContent(item)}>
                          Review Details
                        </Button>
                        <Button size="sm" color="green" onClick={() => handleModerationAction(item, 'approve')}>
                          Approve
                        </Button>
                        <Button size="sm" color="red" onClick={() => handleModerationAction(item, 'reject')}>
                          Remove
                        </Button>
                      </Group>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="all" pt="lg">
            <Stack gap="md">
              {filteredContent.map(item => (
                <Card
                  key={item.id}
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
                  <Group justify="space-between">
                    <Group gap="sm">
                      {getTypeIcon(item.type)}
                      <Stack gap={2}>
                        <Text fw={500}>{item.title}</Text>
                        <Text size="sm" c="dimmed">
                          By {item.author} • {formatDate(item.createdAt)}
                        </Text>
                      </Stack>
                    </Group>
                    <Group gap="xs">
                      <Badge size="sm" color={getStatusColor(item.status)} variant="light">
                        {item.status}
                      </Badge>
                      <ActionIcon variant="light" onClick={() => handleViewContent(item)}>
                        <EyeOpenIcon width={16} height={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="actions" pt="lg">
            <Stack gap="md">
              {moderationActions.map(action => (
                <Card
                  key={action.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <Group justify="space-between">
                    <Group gap="sm">
                      <CheckCircledIcon width={16} height={16} style={{ color: 'var(--success)' }} />
                      <Stack gap={2}>
                        <Text fw={500}>
                          {action.moderatorName} {action.action}d content
                        </Text>
                        <Text size="sm" c="dimmed">
                          {action.reason}
                        </Text>
                        {action.notes && (
                          <Text size="sm" c="dimmed" fs="italic">
                            Notes: {action.notes}
                          </Text>
                        )}
                      </Stack>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {formatDate(action.timestamp)}
                    </Text>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>

        {/* Content Details Modal */}
        <Modal
          opened={opened}
          onClose={close}
          title={selectedItem ? `${selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)} Details` : 'Content Details'}
          size="lg"
        >
          {selectedItem && (
            <Stack gap="md">
              <Group gap="sm">
                {getTypeIcon(selectedItem.type)}
                <Badge color={getStatusColor(selectedItem.status)}>
                  {selectedItem.status}
                </Badge>
                <Badge variant="secondary">
                  {selectedItem.type}
                </Badge>
              </Group>

              <Stack gap="sm">
                <Text fw={500} size="lg">{selectedItem.title}</Text>
                <Text>{selectedItem.content}</Text>
              </Stack>

              <Group gap="sm">
                <Text size="sm" c="dimmed">
                  Author: {selectedItem.author} ({selectedItem.authorRole})
                </Text>
                <Text size="sm" c="dimmed">
                  Created: {formatDate(selectedItem.createdAt)}
                </Text>
              </Group>

              {selectedItem.reports.length > 0 && (
                <Stack gap="sm">
                  <Text fw={500}>Reports:</Text>
                  {selectedItem.reports.map(report => (
                    <Alert key={report.id} color={getSeverityColor(report.severity)}>
                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Text size="sm" fw={500}>{report.reason}</Text>
                          <Badge size="sm" color={getSeverityColor(report.severity)}>
                            {report.severity}
                          </Badge>
                        </Group>
                        <Text size="sm">{report.description}</Text>
                        <Text size="xs" c="dimmed">
                          Reported by {report.reporterName} on {formatDate(report.reportedAt)}
                        </Text>
                      </Stack>
                    </Alert>
                  ))}
                </Stack>
              )}

              {selectedItem.moderatorNotes && (
                <Alert icon={<CheckCircledIcon width={16} height={16} />} color="blue">
                  <Stack gap="xs">
                    <Text size="sm" fw={500}>Moderator Notes:</Text>
                    <Text size="sm">{selectedItem.moderatorNotes}</Text>
                    <Text size="xs" c="dimmed">
                      By {selectedItem.moderatedBy} on {selectedItem.moderatedAt && formatDate(selectedItem.moderatedAt)}
                    </Text>
                  </Stack>
                </Alert>
              )}
            </Stack>
          )}
        </Modal>

        {/* Moderation Action Modal */}
        <Modal
          opened={actionOpened}
          onClose={closeAction}
          title={`${selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)} Content`}
          size="md"
        >
          {selectedItem && (
            <Stack gap="md">
              <Text fw={500}>{selectedItem.title}</Text>
              
              <Select
                label="Action"
                value={selectedAction}
                onChange={value => setSelectedAction(value || 'approve')}
                data={[
                  { value: 'approve', label: 'Approve Content' },
                  { value: 'reject', label: 'Reject Content' },
                  { value: 'flag', label: 'Flag for Review' },
                ]}
              />

              <Textarea
                label="Moderation Notes"
                placeholder="Add notes about this moderation decision..."
                value={moderationNotes}
                onChange={e => setModerationNotes(e.target.value)}
                minRows={3}
              />

              <Group justify="flex-end" gap="sm">
                <Button variant="light" onClick={closeAction}>
                  Cancel
                </Button>
                <Button
                  onClick={submitModerationAction}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  Submit {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};