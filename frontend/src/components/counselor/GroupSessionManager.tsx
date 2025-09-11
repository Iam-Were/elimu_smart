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
  MultiSelect,
  Alert,
  SimpleGrid,
  ActionIcon,
  Tooltip,
  Divider,
} from '@mantine/core';
import {
  CalendarIcon,
  PersonIcon,
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  ClockIcon,
  CheckCircledIcon,
  GroupIcon,
} from '@radix-ui/react-icons';
import { useDisclosure } from '@mantine/hooks';

interface GroupSession {
  id: string;
  title: string;
  description: string;
  type: 'career-exploration' | 'study-skills' | 'college-prep' | 'personal-development';
  scheduledAt: Date;
  duration: number;
  maxParticipants: number;
  participants: Participant[];
  agenda: AgendaItem[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  location: string;
  materials: string[];
  objectives: string[];
  outcomes: SessionOutcome[];
  attendance: AttendanceRecord[];
  notes: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  grade: string;
  status: 'registered' | 'confirmed' | 'attended' | 'absent';
}

interface AgendaItem {
  id: string;
  title: string;
  duration: number;
  type: 'discussion' | 'activity' | 'presentation' | 'breakout';
  description: string;
  materials: string[];
}

interface SessionOutcome {
  participantId: string;
  goals: string[];
  achievements: string[];
  nextSteps: string[];
  rating: number;
}

interface AttendanceRecord {
  participantId: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: Date;
  notes?: string;
}

// Mock data
const mockGroupSessions: GroupSession[] = [
  {
    id: '1',
    title: 'Career Exploration Workshop',
    description: 'Explore various career paths and understand industry requirements',
    type: 'career-exploration',
    scheduledAt: new Date('2024-01-25T10:00:00'),
    duration: 120,
    maxParticipants: 15,
    participants: [
      { id: '1', name: 'Sarah Wilson', email: 'sarah@school.edu', grade: 'Form 4', status: 'confirmed' },
      { id: '2', name: 'David Brown', email: 'david@school.edu', grade: 'Form 3', status: 'registered' },
      { id: '3', name: 'Lisa Chen', email: 'lisa@school.edu', grade: 'Form 4', status: 'confirmed' },
    ],
    agenda: [
      {
        id: '1',
        title: 'Icebreaker Activity',
        duration: 15,
        type: 'activity',
        description: 'Get to know each other and share career interests',
        materials: ['Name tags', 'Interest cards'],
      },
      {
        id: '2',
        title: 'Career Overview Presentation',
        duration: 30,
        type: 'presentation',
        description: 'Overview of career categories and pathways',
        materials: ['Presentation slides', 'Career handouts'],
      },
    ],
    status: 'scheduled',
    location: 'Conference Room A',
    materials: ['Career exploration workbook', 'Assessment forms'],
    objectives: ['Identify personal interests', 'Explore career options', 'Understand education requirements'],
    outcomes: [],
    attendance: [],
    notes: 'Focus on STEM careers based on participant interests',
  },
  {
    id: '2',
    title: 'Study Skills Masterclass',
    description: 'Learn effective study techniques and time management',
    type: 'study-skills',
    scheduledAt: new Date('2024-01-22T14:00:00'),
    duration: 90,
    maxParticipants: 12,
    participants: [
      { id: '4', name: 'John Doe', email: 'john@school.edu', grade: 'Form 2', status: 'attended' },
      { id: '5', name: 'Mary Smith', email: 'mary@school.edu', grade: 'Form 2', status: 'attended' },
    ],
    agenda: [],
    status: 'completed',
    location: 'Library Meeting Room',
    materials: ['Study planner templates', 'Time management guides'],
    objectives: ['Learn effective note-taking', 'Master time management', 'Develop study schedules'],
    outcomes: [
      {
        participantId: '4',
        goals: ['Improve note-taking', 'Better time management'],
        achievements: ['Learned Cornell method', 'Created study schedule'],
        nextSteps: ['Practice for 2 weeks', 'Schedule follow-up'],
        rating: 4,
      },
    ],
    attendance: [
      { participantId: '4', status: 'present', checkInTime: new Date('2024-01-22T14:00:00') },
      { participantId: '5', status: 'present', checkInTime: new Date('2024-01-22T14:05:00') },
    ],
    notes: 'Great engagement, students particularly liked the Cornell note-taking method',
  },
];

const mockAvailableStudents = [
  { value: '1', label: 'Sarah Wilson - Form 4' },
  { value: '2', label: 'David Brown - Form 3' },
  { value: '3', label: 'Lisa Chen - Form 4' },
  { value: '4', label: 'John Doe - Form 2' },
  { value: '5', label: 'Mary Smith - Form 2' },
  { value: '6', label: 'Alex Johnson - Form 3' },
  { value: '7', label: 'Emma Davis - Form 4' },
  { value: '8', label: 'Michael Brown - Form 2' },
];

const sessionTemplates = [
  {
    type: 'career-exploration',
    title: 'Career Exploration Workshop',
    duration: 120,
    objectives: ['Identify personal interests', 'Explore career options', 'Understand education requirements'],
    materials: ['Career exploration workbook', 'Assessment forms', 'Career cards'],
    agenda: [
      { title: 'Icebreaker Activity', duration: 15, type: 'activity', description: 'Career interest sharing' },
      { title: 'Career Overview', duration: 30, type: 'presentation', description: 'Overview of career categories' },
      { title: 'Group Discussion', duration: 45, type: 'discussion', description: 'Career exploration activities' },
      { title: 'Action Planning', duration: 30, type: 'activity', description: 'Next steps planning' },
    ],
  },
  {
    type: 'study-skills',
    title: 'Study Skills Workshop',
    duration: 90,
    objectives: ['Learn effective study techniques', 'Master time management', 'Develop study schedules'],
    materials: ['Study planner templates', 'Time management guides', 'Note-taking samples'],
    agenda: [
      { title: 'Study Techniques Overview', duration: 20, type: 'presentation', description: 'Effective study methods' },
      { title: 'Note-Taking Practice', duration: 30, type: 'activity', description: 'Cornell method practice' },
      { title: 'Time Management', duration: 25, type: 'discussion', description: 'Creating study schedules' },
      { title: 'Q&A and Planning', duration: 15, type: 'discussion', description: 'Questions and next steps' },
    ],
  },
];

export const GroupSessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<GroupSession[]>(mockGroupSessions);
  const [opened, { open, close }] = useDisclosure(false);
  const [attendanceOpened, { open: openAttendance, close: closeAttendance }] = useDisclosure(false);
  const [editingSession, setEditingSession] = useState<GroupSession | null>(null);
  const [selectedSession, setSelectedSession] = useState<GroupSession | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'career-exploration',
    scheduledDate: '',
    scheduledTime: '10:00',
    duration: 120,
    maxParticipants: 15,
    location: '',
    participants: [] as string[],
    objectives: [] as string[],
    materials: [] as string[],
    notes: '',
  });

  const filteredSessions = sessions.filter(session => {
    const matchesType = !filterType || session.type === filterType;
    const matchesStatus = !filterStatus || session.status === filterStatus;
    return matchesType && matchesStatus;
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'career-exploration':
        return 'blue';
      case 'study-skills':
        return 'green';
      case 'college-prep':
        return 'purple';
      case 'personal-development':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const handleOpenForm = (session?: GroupSession) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        title: session.title,
        description: session.description,
        type: session.type,
        scheduledDate: session.scheduledAt.toISOString().split('T')[0],
        scheduledTime: session.scheduledAt.toTimeString().slice(0, 5),
        duration: session.duration,
        maxParticipants: session.maxParticipants,
        location: session.location,
        participants: session.participants.map(p => p.id),
        objectives: session.objectives,
        materials: session.materials,
        notes: session.notes,
      });
    } else {
      setEditingSession(null);
      setFormData({
        title: '',
        description: '',
        type: 'career-exploration',
        scheduledDate: '',
        scheduledTime: '10:00',
        duration: 120,
        maxParticipants: 15,
        location: '',
        participants: [],
        objectives: [],
        materials: [],
        notes: '',
      });
    }
    open();
  };

  const handleUseTemplate = (template: typeof sessionTemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      duration: template.duration,
      objectives: template.objectives,
      materials: template.materials,
    }));
  };

  const handleSaveSession = () => {
    const [hours, minutes] = formData.scheduledTime.split(':').map(Number);
    const scheduledAt = new Date(formData.scheduledDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    const participantDetails = formData.participants.map(id => {
      const student = mockAvailableStudents.find(s => s.value === id);
      return {
        id,
        name: student?.label.split(' - ')[0] || '',
        email: `${student?.label.split(' - ')[0].toLowerCase().replace(' ', '.')}@school.edu`,
        grade: student?.label.split(' - ')[1] || '',
        status: 'registered' as const,
      };
    });

    if (editingSession) {
      // Update existing session
      const updatedSessions = sessions.map(s =>
        s.id === editingSession.id
          ? {
              ...s,
              title: formData.title,
              description: formData.description,
              type: formData.type as GroupSession['type'],
              scheduledAt,
              duration: formData.duration,
              maxParticipants: formData.maxParticipants,
              location: formData.location,
              participants: participantDetails,
              objectives: formData.objectives,
              materials: formData.materials,
              notes: formData.notes,
            }
          : s
      );
      setSessions(updatedSessions);
    } else {
      // Create new session
      const newSession: GroupSession = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        type: formData.type as GroupSession['type'],
        scheduledAt,
        duration: formData.duration,
        maxParticipants: formData.maxParticipants,
        participants: participantDetails,
        agenda: [],
        status: 'scheduled',
        location: formData.location,
        materials: formData.materials,
        objectives: formData.objectives,
        outcomes: [],
        attendance: [],
        notes: formData.notes,
      };
      setSessions([...sessions, newSession]);
    }
    close();
  };

  const handleAttendance = (session: GroupSession) => {
    setSelectedSession(session);
    openAttendance();
  };

  const markAttendance = (participantId: string, status: 'present' | 'absent' | 'late') => {
    if (!selectedSession) return;
    
    const updatedSessions = sessions.map(s => {
      if (s.id === selectedSession.id) {
        const attendance = s.attendance.filter(a => a.participantId !== participantId);
        attendance.push({
          participantId,
          status,
          checkInTime: status === 'present' ? new Date() : undefined,
        });
        return { ...s, attendance };
      }
      return s;
    });
    setSessions(updatedSessions);
    setSelectedSession(updatedSessions.find(s => s.id === selectedSession.id) || null);
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

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="2rem">
              Group Sessions
            </Title>
            <Text size="lg" c="dimmed">
              Manage group counseling sessions and workshops
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
            Schedule Group Session
          </Button>
        </Group>

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
              placeholder="Filter by type"
              value={filterType}
              onChange={setFilterType}
              data={[
                { value: 'career-exploration', label: 'Career Exploration' },
                { value: 'study-skills', label: 'Study Skills' },
                { value: 'college-prep', label: 'College Prep' },
                { value: 'personal-development', label: 'Personal Development' },
              ]}
              clearable
              style={{ minWidth: 200 }}
            />
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
          </Group>
        </Card>

        {/* Sessions List */}
        <Stack gap="md">
          {filteredSessions.length === 0 ? (
            <Alert
              icon={<CalendarIcon width={16} height={16} />}
              title="No group sessions found"
              color="blue"
            >
              <Text size="sm">
                No group sessions match your current filters. Try adjusting your search criteria or schedule a new session.
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
                <Stack gap="md">
                  {/* Session Header */}
                  <Group justify="space-between" align="flex-start">
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Group gap="sm">
                        <GroupIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
                        <Text fw={500} size="lg">{session.title}</Text>
                      </Group>
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {session.description}
                      </Text>
                    </Stack>
                    <Group gap="xs">
                      <Badge
                        size="sm"
                        color={getTypeColor(session.type)}
                        variant="light"
                      >
                        {session.type.replace('-', ' ')}
                      </Badge>
                      <Badge
                        size="sm"
                        color={getStatusColor(session.status)}
                        variant="light"
                      >
                        {session.status}
                      </Badge>
                    </Group>
                  </Group>

                  {/* Session Details */}
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
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
                    <Group gap="xs">
                      <PersonIcon width={14} height={14} />
                      <Text size="sm" fw={500}>
                        {session.participants.length}/{session.maxParticipants} participants
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">
                        📍 {session.location}
                      </Text>
                    </Group>
                  </SimpleGrid>

                  {/* Participants */}
                  <Stack gap="xs">
                    <Text size="sm" fw={500}>Participants</Text>
                    <Group gap="xs">
                      {session.participants.slice(0, 5).map(participant => (
                        <Tooltip key={participant.id} label={`${participant.name} - ${participant.grade}`}>
                          <Avatar
                            size={32}
                            radius="xl"
                            color="yellow"
                            style={{ backgroundColor: 'var(--primary)' }}
                          >
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        </Tooltip>
                      ))}
                      {session.participants.length > 5 && (
                        <Avatar size={32} radius="xl" color="gray">
                          +{session.participants.length - 5}
                        </Avatar>
                      )}
                    </Group>
                  </Stack>

                  {/* Objectives */}
                  {session.objectives.length > 0 && (
                    <Stack gap="xs">
                      <Text size="sm" fw={500}>Objectives</Text>
                      <Group gap="xs">
                        {session.objectives.slice(0, 3).map((objective, index) => (
                          <Badge key={index} size="sm" variant="secondary" color="blue">
                            {objective}
                          </Badge>
                        ))}
                        {session.objectives.length > 3 && (
                          <Badge size="sm" variant="secondary" color="gray">
                            +{session.objectives.length - 3} more
                          </Badge>
                        )}
                      </Group>
                    </Stack>
                  )}

                  {/* Actions */}
                  <Group justify="flex-end" gap="xs">
                    {session.status === 'scheduled' && (
                      <>
                        <Tooltip label="Take Attendance">
                          <ActionIcon
                            variant="light"
                            color="green"
                            onClick={() => handleAttendance(session)}
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
                          >
                            <TrashIcon width={16} height={16} />
                          </ActionIcon>
                        </Tooltip>
                      </>
                    )}
                    {session.status === 'completed' && (
                      <Tooltip label="View Results">
                        <ActionIcon
                          variant="light"
                          color="blue"
                        >
                          <CheckCircledIcon width={16} height={16} />
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
          title={editingSession ? 'Edit Group Session' : 'Schedule New Group Session'}
          size="xl"
        >
          <Stack gap="md">
            {/* Template Selection */}
            <Stack gap="xs">
              <Text fw={500} size="sm">Quick Start Templates</Text>
              <Group gap="sm">
                {sessionTemplates.map((template, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="light"
                    onClick={() => handleUseTemplate(template)}
                  >
                    {template.title}
                  </Button>
                ))}
              </Group>
            </Stack>

            <Divider />

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
                onChange={value => setFormData({ ...formData, type: value || 'career-exploration' })}
                data={[
                  { value: 'career-exploration', label: 'Career Exploration' },
                  { value: 'study-skills', label: 'Study Skills' },
                  { value: 'college-prep', label: 'College Prep' },
                  { value: 'personal-development', label: 'Personal Development' },
                ]}
                required
              />
              
              <Select
                label="Duration"
                value={formData.duration.toString()}
                onChange={value => setFormData({ ...formData, duration: parseInt(value || '120') })}
                data={[
                  { value: '60', label: '1 hour' },
                  { value: '90', label: '1.5 hours' },
                  { value: '120', label: '2 hours' },
                  { value: '180', label: '3 hours' },
                ]}
                required
              />
            </Group>
            
            <Group grow>
              <TextInput
                label="Date"
                type="date"
                value={formData.scheduledDate}
                onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
                required
              />
              
              <TextInput
                label="Time"
                type="time"
                value={formData.scheduledTime}
                onChange={e => setFormData({ ...formData, scheduledTime: e.target.value })}
                required
              />
            </Group>
            
            <Group grow>
              <TextInput
                label="Location"
                placeholder="Enter location"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                required
              />
              
              <TextInput
                label="Max Participants"
                type="number"
                min={1}
                max={30}
                value={formData.maxParticipants}
                onChange={e => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 15 })}
                required
              />
            </Group>
            
            <MultiSelect
              label="Select Participants"
              placeholder="Choose students for this session"
              value={formData.participants}
              onChange={participants => setFormData({ ...formData, participants })}
              data={mockAvailableStudents}
              searchable
              clearable
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

        {/* Attendance Modal */}
        <Modal
          opened={attendanceOpened}
          onClose={closeAttendance}
          title={`Take Attendance - ${selectedSession?.title}`}
          size="md"
        >
          {selectedSession && (
            <Stack gap="md">
              <Text size="sm" c="dimmed">
                Session: {formatDate(selectedSession.scheduledAt)} at {formatTime(selectedSession.scheduledAt)}
              </Text>
              
              <Stack gap="sm">
                {selectedSession.participants.map(participant => {
                  const attendanceRecord = selectedSession.attendance.find(a => a.participantId === participant.id);
                  
                  return (
                    <Card key={participant.id} padding="sm" style={{ backgroundColor: 'var(--muted)' }}>
                      <Group justify="space-between">
                        <Group gap="sm">
                          <Avatar
                            size={32}
                            radius="xl"
                            color="yellow"
                            style={{ backgroundColor: 'var(--primary)' }}
                          >
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Stack gap={2}>
                            <Text size="sm" fw={500}>{participant.name}</Text>
                            <Text size="xs" c="dimmed">{participant.grade}</Text>
                          </Stack>
                        </Group>
                        
                        <Group gap="xs">
                          <Button
                            size="xs"
                            variant={attendanceRecord?.status === 'present' ? 'filled' : 'light'}
                            color="green"
                            onClick={() => markAttendance(participant.id, 'present')}
                          >
                            Present
                          </Button>
                          <Button
                            size="xs"
                            variant={attendanceRecord?.status === 'late' ? 'filled' : 'light'}
                            color="yellow"
                            onClick={() => markAttendance(participant.id, 'late')}
                          >
                            Late
                          </Button>
                          <Button
                            size="xs"
                            variant={attendanceRecord?.status === 'absent' ? 'filled' : 'light'}
                            color="red"
                            onClick={() => markAttendance(participant.id, 'absent')}
                          >
                            Absent
                          </Button>
                        </Group>
                      </Group>
                    </Card>
                  );
                })}
              </Stack>
              
              <Group justify="flex-end">
                <Button onClick={closeAttendance}>Done</Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};