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
  Select,
  Badge,
  Avatar,
  Modal,
  Textarea,
  Alert,
  SimpleGrid,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import {
  CalendarIcon,
  ClockIcon,
  PersonIcon,
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  VideoIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons';
import { useDisclosure } from '@mantine/hooks';

interface Session {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentGrade: string;
  title: string;
  description: string;
  type: 'individual' | 'group' | 'virtual' | 'phone';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledAt: Date;
  duration: number; // minutes
  location: string;
  notes: string;
  outcomes: string[];
  nextSteps: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for sessions
const mockSessions: Session[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Sarah Wilson',
    studentEmail: 'sarah.wilson@school.edu',
    studentGrade: 'Form 4',
    title: 'Career Guidance - Engineering vs Medicine',
    description: 'Discuss career options, requirements, and help student make informed decision',
    type: 'individual',
    status: 'scheduled',
    scheduledAt: new Date('2024-01-19T14:00:00'),
    duration: 60,
    location: 'Counseling Office Room 201',
    notes: 'Student is torn between engineering and medicine. Prepare KUCCPS requirements for both fields.',
    outcomes: [],
    nextSteps: [],
    createdAt: new Date('2024-01-18T10:30:00'),
    updatedAt: new Date('2024-01-18T10:30:00'),
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'David Brown',
    studentEmail: 'david.brown@school.edu',
    studentGrade: 'Form 3',
    title: 'Business Career Planning Session',
    description: 'Explore business career options and university programs',
    type: 'virtual',
    status: 'scheduled',
    scheduledAt: new Date('2024-01-20T10:00:00'),
    duration: 45,
    location: 'Zoom Meeting',
    notes: 'Student interested in entrepreneurship. Discuss business programs and practical experience opportunities.',
    outcomes: [],
    nextSteps: [],
    createdAt: new Date('2024-01-17T14:20:00'),
    updatedAt: new Date('2024-01-17T14:20:00'),
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Lisa Chen',
    studentEmail: 'lisa.chen@school.edu',
    studentGrade: 'Form 4',
    title: 'Medical School Application Review',
    description: 'Review university applications and prepare for interviews',
    type: 'individual',
    status: 'completed',
    scheduledAt: new Date('2024-01-17T11:00:00'),
    duration: 90,
    location: 'Counseling Office Room 201',
    notes: 'Reviewed application essays and practiced interview questions.',
    outcomes: [
      'Improved personal statement',
      'Gained confidence in interview skills',
      'Clarified university preferences'
    ],
    nextSteps: [
      'Submit university applications by February 1st',
      'Schedule mock interview sessions',
      'Research scholarship opportunities'
    ],
    createdAt: new Date('2024-01-16T09:15:00'),
    updatedAt: new Date('2024-01-17T12:30:00'),
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'John Doe',
    studentEmail: 'john.doe@school.edu',
    studentGrade: 'Form 2',
    title: 'Sports Career Exploration',
    description: 'Discuss professional sports career possibilities and alternatives',
    type: 'individual',
    status: 'scheduled',
    scheduledAt: new Date('2024-01-21T15:30:00'),
    duration: 45,
    location: 'Counseling Office Room 203',
    notes: 'Student passionate about football. Need to discuss realistic expectations and backup plans.',
    outcomes: [],
    nextSteps: [],
    createdAt: new Date('2024-01-15T16:45:00'),
    updatedAt: new Date('2024-01-15T16:45:00'),
  },
];

export const SessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    studentName: '',
    title: '',
    description: '',
    type: 'individual',
    scheduledDate: new Date(),
    scheduledTime: '10:00',
    duration: 60,
    location: '',
    notes: '',
  });

  const filteredSessions = sessions.filter(session => {
    const matchesStatus = !filterStatus || session.status === filterStatus;
    const matchesType = !filterType || session.type === filterType;
    return matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'in-progress':
        return 'orange';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'virtual':
        return <VideoIcon width={16} height={16} />;
      case 'phone':
        return <PersonIcon width={16} height={16} />;
      case 'group':
        return <PersonIcon width={16} height={16} />;
      default:
        return <PersonIcon width={16} height={16} />;
    }
  };

  const handleOpenForm = (session?: Session) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        studentName: session.studentName,
        title: session.title,
        description: session.description,
        type: session.type,
        scheduledDate: session.scheduledAt,
        scheduledTime: session.scheduledAt.toTimeString().slice(0, 5),
        duration: session.duration,
        location: session.location,
        notes: session.notes,
      });
    } else {
      setEditingSession(null);
      setFormData({
        studentName: '',
        title: '',
        description: '',
        type: 'individual',
        scheduledDate: new Date(),
        scheduledTime: '10:00',
        duration: 60,
        location: '',
        notes: '',
      });
    }
    open();
  };

  const handleSaveSession = () => {
    const [hours, minutes] = formData.scheduledTime.split(':').map(Number);
    const scheduledAt = new Date(formData.scheduledDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    if (editingSession) {
      // Update existing session
      const updatedSessions = sessions.map(s =>
        s.id === editingSession.id
          ? {
              ...s,
              title: formData.title,
              description: formData.description,
              type: formData.type as Session['type'],
              scheduledAt,
              duration: formData.duration,
              location: formData.location,
              notes: formData.notes,
              updatedAt: new Date(),
            }
          : s
      );
      setSessions(updatedSessions);
    } else {
      // Create new session
      const newSession: Session = {
        id: Date.now().toString(),
        studentId: '1', // In real app, this would be selected
        studentName: formData.studentName,
        studentEmail: 'student@school.edu',
        studentGrade: 'Form 4',
        title: formData.title,
        description: formData.description,
        type: formData.type as Session['type'],
        status: 'scheduled',
        scheduledAt,
        duration: formData.duration,
        location: formData.location,
        notes: formData.notes,
        outcomes: [],
        nextSteps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSessions([...sessions, newSession]);
    }
    close();
  };

  const handleCompleteSession = (sessionId: string) => {
    // In a real app, this would open a completion form
    const updatedSessions = sessions.map(s =>
      s.id === sessionId
        ? { ...s, status: 'completed' as const, updatedAt: new Date() }
        : s
    );
    setSessions(updatedSessions);
  };

  const handleCancelSession = (sessionId: string) => {
    const updatedSessions = sessions.map(s =>
      s.id === sessionId
        ? { ...s, status: 'cancelled' as const, updatedAt: new Date() }
        : s
    );
    setSessions(updatedSessions);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSessionsByStatus = (status: string) => {
    return sessions.filter(s => s.status === status).length;
  };

  const getTodaySessions = () => {
    const today = new Date();
    return sessions.filter(s => {
      const sessionDate = new Date(s.scheduledAt);
      return sessionDate.toDateString() === today.toDateString() && s.status === 'scheduled';
    });
  };


  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="2rem">
              Session Management
            </Title>
            <Text size="lg" c="dimmed">
              Schedule and manage counseling sessions with students
            </Text>
          </Stack>
          <Button
            leftSection={<PlusIcon width={16} height={16} />}
            onClick={() => handleOpenForm()}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            Schedule Session
          </Button>
        </Group>

        {/* Quick Stats */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Card
            padding="lg"
            radius="md"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
            }}
          >
            <Stack gap="xs" align="center">
              <Text size="xs" c="dimmed">Today's Sessions</Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--primary)' }}>
                {getTodaySessions().length}
              </Title>
            </Stack>
          </Card>
          <Card
            padding="lg"
            radius="md"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
            }}
          >
            <Stack gap="xs" align="center">
              <Text size="xs" c="dimmed">Scheduled</Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--primary)' }}>
                {getSessionsByStatus('scheduled')}
              </Title>
            </Stack>
          </Card>
          <Card
            padding="lg"
            radius="md"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
            }}
          >
            <Stack gap="xs" align="center">
              <Text size="xs" c="dimmed">Completed</Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--primary)' }}>
                {getSessionsByStatus('completed')}
              </Title>
            </Stack>
          </Card>
          <Card
            padding="lg"
            radius="md"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
            }}
          >
            <Stack gap="xs" align="center">
              <Text size="xs" c="dimmed">This Week</Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--primary)' }}>
                {sessions.filter(s => {
                  const sessionDate = new Date(s.scheduledAt);
                  const today = new Date();
                  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                  const weekEnd = new Date(today.setDate(today.getDate() + 6));
                  return sessionDate >= weekStart && sessionDate <= weekEnd;
                }).length}
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
            <Select
              placeholder="Filter by status"
              value={filterStatus}
              onChange={setFilterStatus}
              data={[
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              clearable
              style={{ minWidth: 200 }}
            />
            <Select
              placeholder="Filter by type"
              value={filterType}
              onChange={setFilterType}
              data={[
                { value: 'individual', label: 'Individual' },
                { value: 'group', label: 'Group' },
                { value: 'virtual', label: 'Virtual' },
                { value: 'phone', label: 'Phone' },
              ]}
              clearable
              style={{ minWidth: 200 }}
            />
          </Group>
        </Card>

        {/* Today's Sessions Alert */}
        {getTodaySessions().length > 0 && (
          <Alert
            icon={<CalendarIcon width={16} height={16} />}
            title={`You have ${getTodaySessions().length} session(s) scheduled for today`}
            color="blue"
          >
            <Stack gap="xs">
              {getTodaySessions().map(session => (
                <Text key={session.id} size="sm">
                  • {formatTime(session.scheduledAt)} - {session.studentName} ({session.title})
                </Text>
              ))}
            </Stack>
          </Alert>
        )}

        {/* Sessions List */}
        <Stack gap="md">
          {filteredSessions.length === 0 ? (
            <Alert
              icon={<CalendarIcon width={16} height={16} />}
              title="No sessions found"
              color="blue"
            >
              <Text size="sm">
                No sessions match your current filters. Try adjusting your search criteria or schedule a new session.
              </Text>
            </Alert>
          ) : (
            filteredSessions.map(session => (
              <Card
                key={session.id}
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
                  {/* Session Header */}
                  <Group justify="space-between" align="flex-start">
                    <Group gap="sm" style={{ flex: 1 }}>
                      <Avatar
                        size={40}
                        radius="xl"
                        color="yellow"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        {session.studentName.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Stack gap={2} style={{ flex: 1 }}>
                        <Text fw={500}>{session.title}</Text>
                        <Group gap="xs">
                          <Text size="sm" c="dimmed">
                            {session.studentName} • {session.studentGrade}
                          </Text>
                        </Group>
                        <Text size="sm" c="dimmed" lineClamp={1}>
                          {session.description}
                        </Text>
                      </Stack>
                    </Group>
                    <Group gap="xs">
                      <Badge
                        size="sm"
                        color={getStatusColor(session.status)}
                        variant="light"
                      >
                        {session.status}
                      </Badge>
                      <Tooltip label={session.type}>
                        <Badge
                          size="sm"
                          variant="secondary"
                          color="gray"
                          leftSection={getTypeIcon(session.type)}
                        >
                          {session.type}
                        </Badge>
                      </Tooltip>
                    </Group>
                  </Group>

                  {/* Session Details */}
                  <Group gap="md">
                    <Group gap="xs">
                      <CalendarIcon width={14} height={14} />
                      <Text size="sm" fw={500}>
                        {formatDate(session.scheduledAt)}
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <ClockIcon width={14} height={14} />
                      <Text size="sm" fw={500}>
                        {formatTime(session.scheduledAt)} ({session.duration}min)
                      </Text>
                    </Group>
                    {session.location && (
                      <Group gap="xs">
                        <PersonIcon width={14} height={14} />
                        <Text size="sm" c="dimmed">
                          {session.location}
                        </Text>
                      </Group>
                    )}
                  </Group>

                  {/* Session Notes */}
                  {session.notes && (
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {session.notes}
                    </Text>
                  )}

                  {/* Outcomes and Next Steps (for completed sessions) */}
                  {session.status === 'completed' && (session.outcomes.length > 0 || session.nextSteps.length > 0) && (
                    <Card padding="sm" style={{ backgroundColor: 'var(--muted)' }}>
                      <Stack gap="xs">
                        {session.outcomes.length > 0 && (
                          <Stack gap="xs">
                            <Text size="sm" fw={500} c="green">Outcomes:</Text>
                            {session.outcomes.map((outcome, index) => (
                              <Text key={index} size="xs" c="dimmed">• {outcome}</Text>
                            ))}
                          </Stack>
                        )}
                        {session.nextSteps.length > 0 && (
                          <Stack gap="xs">
                            <Text size="sm" fw={500} c="blue">Next Steps:</Text>
                            {session.nextSteps.map((step, index) => (
                              <Text key={index} size="xs" c="dimmed">• {step}</Text>
                            ))}
                          </Stack>
                        )}
                      </Stack>
                    </Card>
                  )}

                  {/* Session Actions */}
                  <Group justify="flex-end" gap="xs">
                    {session.status === 'scheduled' && (
                      <>
                        <Tooltip label="Complete Session">
                          <ActionIcon
                            variant="light"
                            color="green"
                            onClick={() => handleCompleteSession(session.id)}
                          >
                            <CheckCircledIcon width={16} height={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Edit Session">
                          <ActionIcon
                            variant="light"
                            onClick={() => handleOpenForm(session)}
                          >
                            <Pencil1Icon width={16} height={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Cancel Session">
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleCancelSession(session.id)}
                          >
                            <TrashIcon width={16} height={16} />
                          </ActionIcon>
                        </Tooltip>
                      </>
                    )}
                    {session.status === 'completed' && (
                      <Tooltip label="Edit Session">
                        <ActionIcon
                          variant="light"
                          onClick={() => handleOpenForm(session)}
                        >
                          <Pencil1Icon width={16} height={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                </Stack>
              </Card>
            ))
          )}
        </Stack>

        {/* Session Form Modal */}
        <Modal
          opened={opened}
          onClose={close}
          title={editingSession ? 'Edit Session' : 'Schedule New Session'}
          size="lg"
        >
          <Stack gap="md">
            <TextInput
              label="Student Name"
              placeholder="Enter student name"
              value={formData.studentName}
              onChange={e => setFormData({ ...formData, studentName: e.target.value })}
              required
            />
            
            <TextInput
              label="Session Title"
              placeholder="Enter session title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
            
            <Textarea
              label="Description"
              placeholder="Enter session description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              minRows={3}
            />
            
            <Group grow>
              <Select
                label="Session Type"
                value={formData.type}
                onChange={value => setFormData({ ...formData, type: value || 'individual' })}
                data={[
                  { value: 'individual', label: 'Individual' },
                  { value: 'group', label: 'Group' },
                  { value: 'virtual', label: 'Virtual' },
                  { value: 'phone', label: 'Phone' },
                ]}
                required
              />
              
              <Select
                label="Duration"
                value={formData.duration.toString()}
                onChange={value => setFormData({ ...formData, duration: parseInt(value || '60') })}
                data={[
                  { value: '30', label: '30 minutes' },
                  { value: '45', label: '45 minutes' },
                  { value: '60', label: '1 hour' },
                  { value: '90', label: '1.5 hours' },
                  { value: '120', label: '2 hours' },
                ]}
                required
              />
            </Group>
            
            <Group grow>
              <TextInput
                label="Date"
                type="date"
                value={formData.scheduledDate.toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, scheduledDate: new Date(e.target.value) })}
                required
              />
              
              <TimeInput
                label="Time"
                value={formData.scheduledTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, scheduledTime: e.target.value })}
                required
              />
            </Group>
            
            <TextInput
              label="Location"
              placeholder="Enter location or meeting link"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
            
            <Textarea
              label="Notes"
              placeholder="Enter any additional notes"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              minRows={3}
            />
            
            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={close}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveSession}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                {editingSession ? 'Update Session' : 'Schedule Session'}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};