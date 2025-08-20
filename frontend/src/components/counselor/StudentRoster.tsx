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
  SimpleGrid,
  Modal,
  Textarea,
  ActionIcon,
  Tooltip,
  Progress,
} from '@mantine/core';
import {
  MagnifyingGlassIcon,
  PersonIcon,
  ChatBubbleIcon,
  CalendarIcon,
  Pencil1Icon,
  EyeOpenIcon,
  StarIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { useDisclosure } from '@mantine/hooks';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  school: string;
  assignedDate: string;
  lastInteraction: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'on-hold';
  profileCompletion: number;
  assessmentsCompleted: number;
  totalAssessments: number;
  careerMatches: number;
  notes: string;
  interests: string[];
  topCareers: string[];
}

// Mock data for students
const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@school.edu',
    grade: 'Form 4',
    school: 'Nairobi High School',
    assignedDate: '2024-01-15',
    lastInteraction: '2024-01-18',
    priority: 'high',
    status: 'active',
    profileCompletion: 85,
    assessmentsCompleted: 3,
    totalAssessments: 4,
    careerMatches: 15,
    notes: 'Interested in STEM careers, particularly engineering. Needs guidance on university applications.',
    interests: ['Mathematics', 'Physics', 'Technology'],
    topCareers: ['Software Engineer', 'Civil Engineer', 'Data Scientist'],
  },
  {
    id: '2',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@school.edu',
    grade: 'Form 3',
    school: 'Mombasa Secondary',
    assignedDate: '2024-01-10',
    lastInteraction: '2024-01-17',
    priority: 'medium',
    status: 'active',
    profileCompletion: 60,
    assessmentsCompleted: 2,
    totalAssessments: 4,
    careerMatches: 8,
    notes: 'Exploring business and commerce careers. Good leadership potential.',
    interests: ['Business', 'Leadership', 'Communication'],
    topCareers: ['Business Manager', 'Marketing Specialist', 'Entrepreneur'],
  },
  {
    id: '3',
    firstName: 'Lisa',
    lastName: 'Chen',
    email: 'lisa.chen@school.edu',
    grade: 'Form 4',
    school: 'Kisumu Girls School',
    assignedDate: '2024-01-08',
    lastInteraction: '2024-01-16',
    priority: 'low',
    status: 'completed',
    profileCompletion: 100,
    assessmentsCompleted: 4,
    totalAssessments: 4,
    careerMatches: 20,
    notes: 'Successfully completed career planning. Ready for university applications.',
    interests: ['Healthcare', 'Biology', 'Community Service'],
    topCareers: ['Doctor', 'Nurse', 'Public Health Officer'],
  },
  {
    id: '4',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@school.edu',
    grade: 'Form 2',
    school: 'Eldoret Boys High',
    assignedDate: '2024-01-20',
    lastInteraction: '2024-01-20',
    priority: 'medium',
    status: 'active',
    profileCompletion: 30,
    assessmentsCompleted: 1,
    totalAssessments: 4,
    careerMatches: 5,
    notes: 'New student, just started career exploration journey.',
    interests: ['Sports', 'Physical Education'],
    topCareers: ['Sports Coach', 'Physical Therapist', 'Fitness Trainer'],
  },
];

export const StudentRoster: React.FC = () => {
  const [students] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [newNote, setNewNote] = useState('');

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.school.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = !filterPriority || student.priority === filterPriority;
    const matchesStatus = !filterStatus || student.status === filterStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'blue';
      case 'completed':
        return 'green';
      case 'on-hold':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setNewNote('');
    open();
  };

  const handleAddNote = () => {
    if (selectedStudent && newNote.trim()) {
      // In a real app, this would update the database
      console.log(`Adding note for ${selectedStudent.firstName}: ${newNote}`);
      setNewNote('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getProgressColor = (completion: number) => {
    if (completion >= 80) return 'green';
    if (completion >= 50) return 'yellow';
    return 'red';
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="2rem">
              Student Management
            </Title>
            <Text size="lg" c="dimmed">
              Manage and track your assigned students
            </Text>
          </Stack>
          <Badge size="lg" color="yellow" variant="light">
            {filteredStudents.length} Students
          </Badge>
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
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            <TextInput
              placeholder="Search students..."
              leftSection={<MagnifyingGlassIcon width={16} height={16} />}
              value={searchQuery}
              onChange={event => setSearchQuery(event.currentTarget.value)}
            />
            <Select
              placeholder="Filter by priority"
              value={filterPriority}
              onChange={setFilterPriority}
              data={[
                { value: 'high', label: 'High Priority' },
                { value: 'medium', label: 'Medium Priority' },
                { value: 'low', label: 'Low Priority' },
              ]}
              clearable
            />
            <Select
              placeholder="Filter by status"
              value={filterStatus}
              onChange={setFilterStatus}
              data={[
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'on-hold', label: 'On Hold' },
              ]}
              clearable
            />
            <Button
              variant="light"
              leftSection={<PersonIcon width={16} height={16} />}
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
              }}
            >
              Add Student
            </Button>
          </SimpleGrid>
        </Card>

        {/* Students Grid */}
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {filteredStudents.map(student => (
            <Card
              key={student.id}
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
                {/* Student Header */}
                <Group justify="space-between" align="flex-start">
                  <Group gap="sm">
                    <Avatar
                      size={40}
                      radius="xl"
                      color="yellow"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      {student.firstName[0]}{student.lastName[0]}
                    </Avatar>
                    <Stack gap={2}>
                      <Text fw={500} size="sm">
                        {student.firstName} {student.lastName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {student.grade} • {student.school}
                      </Text>
                    </Stack>
                  </Group>
                  <Group gap="xs">
                    <Badge
                      size="sm"
                      color={getPriorityColor(student.priority)}
                      variant="light"
                    >
                      {student.priority}
                    </Badge>
                    <Badge
                      size="sm"
                      color={getStatusColor(student.status)}
                      variant="light"
                    >
                      {student.status}
                    </Badge>
                  </Group>
                </Group>

                {/* Progress */}
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Profile Completion</Text>
                    <Text size="xs" fw={500} style={{ color: 'var(--primary)' }}>
                      {student.profileCompletion}%
                    </Text>
                  </Group>
                  <Progress
                    value={student.profileCompletion}
                    color={getProgressColor(student.profileCompletion)}
                    size="sm"
                  />
                </Stack>

                {/* Stats */}
                <Group gap="md" grow>
                  <Stack gap={2} align="center">
                    <Text size="xs" c="dimmed">Assessments</Text>
                    <Text fw={500} size="sm" style={{ color: 'var(--primary)' }}>
                      {student.assessmentsCompleted}/{student.totalAssessments}
                    </Text>
                  </Stack>
                  <Stack gap={2} align="center">
                    <Text size="xs" c="dimmed">Career Matches</Text>
                    <Text fw={500} size="sm" style={{ color: 'var(--primary)' }}>
                      {student.careerMatches}
                    </Text>
                  </Stack>
                  <Stack gap={2} align="center">
                    <Text size="xs" c="dimmed">Last Contact</Text>
                    <Text fw={500} size="xs" style={{ color: 'var(--primary)' }}>
                      {formatDate(student.lastInteraction)}
                    </Text>
                  </Stack>
                </Group>

                {/* Actions */}
                <Group gap="xs">
                  <Tooltip label="View Details">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => handleViewStudent(student)}
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                      }}
                    >
                      <EyeOpenIcon width={14} height={14} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Send Message">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                      }}
                    >
                      <ChatBubbleIcon width={14} height={14} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Schedule Session">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                      }}
                    >
                      <CalendarIcon width={14} height={14} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Add Note">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                      }}
                    >
                      <Pencil1Icon width={14} height={14} />
                    </ActionIcon>
                  </Tooltip>
                  {student.priority === 'high' && (
                    <Tooltip label="High Priority Student">
                      <ActionIcon
                        variant="filled"
                        size="sm"
                        color="red"
                      >
                        <ExclamationTriangleIcon width={14} height={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

        {/* Student Detail Modal */}
        <Modal
          opened={opened}
          onClose={close}
          title={
            selectedStudent
              ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
              : 'Student Details'
          }
          size="lg"
        >
          {selectedStudent && (
            <Stack gap="md">
              {/* Student Info */}
              <Group justify="space-between">
                <Group gap="sm">
                  <Avatar
                    size={50}
                    radius="xl"
                    color="yellow"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                  </Avatar>
                  <Stack gap={2}>
                    <Text fw={500}>
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {selectedStudent.email}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {selectedStudent.grade} • {selectedStudent.school}
                    </Text>
                  </Stack>
                </Group>
                <Group gap="xs">
                  <Badge color={getPriorityColor(selectedStudent.priority)}>
                    {selectedStudent.priority} priority
                  </Badge>
                  <Badge color={getStatusColor(selectedStudent.status)}>
                    {selectedStudent.status}
                  </Badge>
                </Group>
              </Group>

              {/* Progress Overview */}
              <Card padding="md" style={{ backgroundColor: 'var(--muted)' }}>
                <SimpleGrid cols={3} spacing="md">
                  <Stack gap={2} align="center">
                    <Text size="xs" c="dimmed">Profile</Text>
                    <Text fw={500} style={{ color: 'var(--primary)' }}>
                      {selectedStudent.profileCompletion}%
                    </Text>
                  </Stack>
                  <Stack gap={2} align="center">
                    <Text size="xs" c="dimmed">Assessments</Text>
                    <Text fw={500} style={{ color: 'var(--primary)' }}>
                      {selectedStudent.assessmentsCompleted}/{selectedStudent.totalAssessments}
                    </Text>
                  </Stack>
                  <Stack gap={2} align="center">
                    <Text size="xs" c="dimmed">Career Matches</Text>
                    <Text fw={500} style={{ color: 'var(--primary)' }}>
                      {selectedStudent.careerMatches}
                    </Text>
                  </Stack>
                </SimpleGrid>
              </Card>

              {/* Interests */}
              <Stack gap="xs">
                <Text fw={500} size="sm">Interests</Text>
                <Group gap="xs">
                  {selectedStudent.interests.map((interest, index) => (
                    <Badge key={index} variant="light" color="blue" size="sm">
                      {interest}
                    </Badge>
                  ))}
                </Group>
              </Stack>

              {/* Top Career Matches */}
              <Stack gap="xs">
                <Text fw={500} size="sm">Top Career Matches</Text>
                <Group gap="xs">
                  {selectedStudent.topCareers.map((career, index) => (
                    <Badge key={index} variant="light" color="yellow" size="sm">
                      <Group gap={4}>
                        <StarIcon width={10} height={10} />
                        {career}
                      </Group>
                    </Badge>
                  ))}
                </Group>
              </Stack>

              {/* Notes */}
              <Stack gap="xs">
                <Text fw={500} size="sm">Notes</Text>
                <Text size="sm" c="dimmed">
                  {selectedStudent.notes}
                </Text>
              </Stack>

              {/* Add Note */}
              <Stack gap="xs">
                <Text fw={500} size="sm">Add New Note</Text>
                <Textarea
                  placeholder="Add a note about this student..."
                  value={newNote}
                  onChange={event => setNewNote(event.currentTarget.value)}
                  minRows={3}
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  Add Note
                </Button>
              </Stack>

              {/* Action Buttons */}
              <Group justify="flex-end" gap="sm">
                <Button
                  variant="light"
                  leftSection={<ChatBubbleIcon width={16} height={16} />}
                >
                  Send Message
                </Button>
                <Button
                  variant="light"
                  leftSection={<CalendarIcon width={16} height={16} />}
                >
                  Schedule Session
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};