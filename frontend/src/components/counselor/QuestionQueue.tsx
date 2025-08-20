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
  ActionIcon,
  Tooltip,
  Divider,
  Alert,
  Tabs,
} from '@mantine/core';
import {
  MagnifyingGlassIcon,
  ChatBubbleIcon,
  ClockIcon,
  CheckCircledIcon,
  BookmarkIcon,
  PersonIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { useDisclosure } from '@mantine/hooks';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface Question {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentGrade: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'answered' | 'resolved';
  createdAt: string;
  updatedAt: string;
  responses: Response[];
  views: number;
  upvotes: number;
}

interface Response {
  id: string;
  counselorId: string;
  counselorName: string;
  content: string;
  createdAt: string;
  helpful: boolean;
}

// Mock data for questions
const mockQuestions: Question[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Sarah Wilson',
    studentEmail: 'sarah.wilson@school.edu',
    studentGrade: 'Form 4',
    title: 'Should I choose Engineering or Medicine?',
    content: 'I am really torn between pursuing Engineering and Medicine. I love both Math and Biology, and I want to help people but also love problem-solving with technology. What factors should I consider when making this decision?',
    category: 'Career Choice',
    tags: ['engineering', 'medicine', 'career-decision'],
    priority: 'high',
    status: 'pending',
    createdAt: '2024-01-18T10:30:00Z',
    updatedAt: '2024-01-18T10:30:00Z',
    responses: [],
    views: 15,
    upvotes: 8,
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'David Brown',
    studentEmail: 'david.brown@school.edu',
    studentGrade: 'Form 3',
    title: 'What business courses should I take in university?',
    content: 'I want to start my own business someday. What specific business courses would be most helpful? Should I focus on Business Administration, Economics, or something else?',
    category: 'Education Planning',
    tags: ['business', 'university', 'entrepreneurship'],
    priority: 'medium',
    status: 'pending',
    createdAt: '2024-01-17T14:20:00Z',
    updatedAt: '2024-01-17T14:20:00Z',
    responses: [],
    views: 12,
    upvotes: 5,
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Lisa Chen',
    studentEmail: 'lisa.chen@school.edu',
    studentGrade: 'Form 4',
    title: 'How to prepare for medical school applications?',
    content: 'I have decided I want to be a doctor. What should I do now to prepare for medical school applications? What grades do I need, and what activities should I focus on?',
    category: 'University Applications',
    tags: ['medicine', 'university-applications', 'preparation'],
    priority: 'medium',
    status: 'answered',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-17T11:45:00Z',
    responses: [
      {
        id: '1',
        counselorId: 'c1',
        counselorName: 'Dr. Jane Smith',
        content: 'Great question! For medical school in Kenya, you\'ll need strong grades in Biology, Chemistry, and Math. Focus on getting A- or better in these subjects. Also consider volunteering at hospitals or health centers to gain experience.',
        createdAt: '2024-01-17T11:45:00Z',
        helpful: true,
      },
    ],
    views: 25,
    upvotes: 12,
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'John Doe',
    studentEmail: 'john.doe@school.edu',
    studentGrade: 'Form 2',
    title: 'Can I become a professional athlete?',
    content: 'I love playing football and I\'m pretty good at it. My coach says I have potential. Is it realistic to pursue a career as a professional athlete? What should I do to prepare?',
    category: 'Career Exploration',
    tags: ['sports', 'athletics', 'career-planning'],
    priority: 'low',
    status: 'pending',
    createdAt: '2024-01-15T16:45:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    responses: [],
    views: 8,
    upvotes: 3,
  },
];

// Response templates
const responseTemplates = [
  {
    title: 'University Requirements',
    content: 'Thank you for your question about university requirements. For most programs in Kenya, you\'ll need to consider both your KCSE grades and KUCCPS cluster points. Here\'s what you should know...',
  },
  {
    title: 'Career Exploration',
    content: 'It\'s great that you\'re exploring different career options! When choosing a career, consider these factors: your interests, skills, values, and the job market outlook...',
  },
  {
    title: 'Subject Combinations',
    content: 'Choosing the right subject combination is crucial for your future career path. Based on your interests, here are some recommended combinations...',
  },
  {
    title: 'Follow-up Needed',
    content: 'Thanks for your question. To provide you with the most accurate guidance, I\'d like to schedule a one-on-one session to discuss your specific situation in more detail...',
  },
];

export const QuestionQueue: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>('pending');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !filterCategory || question.category === filterCategory;
    const matchesStatus = !filterStatus || question.status === filterStatus;
    const matchesTab = !activeTab || question.status === activeTab;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
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
      case 'pending':
        return 'orange';
      case 'answered':
        return 'blue';
      case 'resolved':
        return 'green';
      default:
        return 'gray';
    }
  };

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question);
    // Load existing response if editing
    if (question.responses.length > 0 && editor) {
      editor.commands.setContent(question.responses[question.responses.length - 1].content);
    } else if (editor) {
      editor.commands.clearContent();
    }
    open();
  };

  const handleSendResponse = () => {
    if (selectedQuestion && editor) {
      const content = editor.getHTML();
      if (content.trim()) {
        const newResponse: Response = {
          id: Date.now().toString(),
          counselorId: 'current-counselor',
          counselorName: 'Current Counselor',
          content,
          createdAt: new Date().toISOString(),
          helpful: false,
        };

        const updatedQuestions = questions.map(q => {
          if (q.id === selectedQuestion.id) {
            return {
              ...q,
              responses: [...q.responses, newResponse],
              status: 'answered' as const,
              updatedAt: new Date().toISOString(),
            };
          }
          return q;
        });

        setQuestions(updatedQuestions);
        editor.commands.clearContent();
        close();
      }
    }
  };

  const handleUseTemplate = React.useCallback((template: typeof responseTemplates[0]) => {
    if (editor) {
      editor.commands.setContent(template.content);
    }
  }, [editor]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getQuestionsByStatus = (status: string) => {
    return questions.filter(q => q.status === status).length;
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="2rem">
              Student Questions
            </Title>
            <Text size="lg" c="dimmed">
              Respond to student questions and provide guidance
            </Text>
          </Stack>
          <Group gap="sm">
            <Badge size="lg" color="orange" variant="light">
              {getQuestionsByStatus('pending')} Pending
            </Badge>
            <Badge size="lg" color="blue" variant="light">
              {getQuestionsByStatus('answered')} Answered
            </Badge>
          </Group>
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
          <Group gap="md" grow>
            <TextInput
              placeholder="Search questions..."
              leftSection={<MagnifyingGlassIcon width={16} height={16} />}
              value={searchQuery}
              onChange={event => setSearchQuery(event.currentTarget.value)}
            />
            <Select
              placeholder="Filter by category"
              value={filterCategory}
              onChange={setFilterCategory}
              data={[
                { value: 'Career Choice', label: 'Career Choice' },
                { value: 'Education Planning', label: 'Education Planning' },
                { value: 'University Applications', label: 'University Applications' },
                { value: 'Career Exploration', label: 'Career Exploration' },
              ]}
              clearable
            />
            <Select
              placeholder="Filter by status"
              value={filterStatus}
              onChange={setFilterStatus}
              data={[
                { value: 'pending', label: 'Pending' },
                { value: 'answered', label: 'Answered' },
                { value: 'resolved', label: 'Resolved' },
              ]}
              clearable
            />
          </Group>
        </Card>

        {/* Question Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="pending" leftSection={<ClockIcon width={14} height={14} />}>
              Pending ({getQuestionsByStatus('pending')})
            </Tabs.Tab>
            <Tabs.Tab value="answered" leftSection={<ChatBubbleIcon width={14} height={14} />}>
              Answered ({getQuestionsByStatus('answered')})
            </Tabs.Tab>
            <Tabs.Tab value="resolved" leftSection={<CheckCircledIcon width={14} height={14} />}>
              Resolved ({getQuestionsByStatus('resolved')})
            </Tabs.Tab>
          </Tabs.List>

          {/* Questions List */}
          <Tabs.Panel value={activeTab || 'pending'} pt="lg">
            <Stack gap="md">
              {filteredQuestions.length === 0 ? (
                <Alert
                  icon={<ChatBubbleIcon width={16} height={16} />}
                  title="No questions found"
                  color="blue"
                >
                  <Text size="sm">
                    No questions match your current filters. Try adjusting your search criteria.
                  </Text>
                </Alert>
              ) : (
                filteredQuestions.map(question => (
                  <Card
                    key={question.id}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    className="hover-lift theme-transition"
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleViewQuestion(question)}
                  >
                    <Stack gap="sm">
                      {/* Question Header */}
                      <Group justify="space-between" align="flex-start">
                        <Group gap="sm" style={{ flex: 1 }}>
                          <Avatar
                            size={32}
                            radius="xl"
                            color="yellow"
                            style={{ backgroundColor: 'var(--primary)' }}
                          >
                            {question.studentName.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Stack gap={2} style={{ flex: 1 }}>
                            <Text fw={500} size="sm" lineClamp={1}>
                              {question.title}
                            </Text>
                            <Group gap="xs">
                              <Text size="xs" c="dimmed">
                                {question.studentName} • {question.studentGrade}
                              </Text>
                              <Text size="xs" c="dimmed">•</Text>
                              <Text size="xs" c="dimmed">
                                {formatDate(question.createdAt)}
                              </Text>
                            </Group>
                          </Stack>
                        </Group>
                        <Group gap="xs">
                          <Badge
                            size="sm"
                            color={getPriorityColor(question.priority)}
                            variant="light"
                          >
                            {question.priority}
                          </Badge>
                          <Badge
                            size="sm"
                            color={getStatusColor(question.status)}
                            variant="light"
                          >
                            {question.status}
                          </Badge>
                          {question.priority === 'high' && (
                            <Tooltip label="High Priority">
                              <ActionIcon size="sm" color="red" variant="light">
                                <ExclamationTriangleIcon width={12} height={12} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Group>
                      </Group>

                      {/* Question Content Preview */}
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {question.content}
                      </Text>

                      {/* Question Meta */}
                      <Group justify="space-between">
                        <Group gap="sm">
                          <Badge size="xs" variant="outline" color="blue">
                            {question.category}
                          </Badge>
                          {question.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} size="xs" variant="light" color="gray">
                              #{tag}
                            </Badge>
                          ))}
                          {question.tags.length > 2 && (
                            <Badge size="xs" variant="light" color="gray">
                              +{question.tags.length - 2} more
                            </Badge>
                          )}
                        </Group>
                        <Group gap="sm">
                          <Group gap={2}>
                            <PersonIcon width={12} height={12} />
                            <Text size="xs" c="dimmed">{question.views} views</Text>
                          </Group>
                          <Group gap={2}>
                            <BookmarkIcon width={12} height={12} />
                            <Text size="xs" c="dimmed">{question.upvotes} helpful</Text>
                          </Group>
                          {question.responses.length > 0 && (
                            <Group gap={2}>
                              <ChatBubbleIcon width={12} height={12} />
                              <Text size="xs" c="dimmed">{question.responses.length} responses</Text>
                            </Group>
                          )}
                        </Group>
                      </Group>
                    </Stack>
                  </Card>
                ))
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>

        {/* Question Detail Modal */}
        <Modal
          opened={opened}
          onClose={close}
          title={selectedQuestion?.title || 'Question Details'}
          size="xl"
        >
          {selectedQuestion && (
            <Stack gap="lg">
              {/* Student Info */}
              <Group gap="sm">
                <Avatar
                  size={40}
                  radius="xl"
                  color="yellow"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {selectedQuestion.studentName.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Stack gap={2}>
                  <Text fw={500}>{selectedQuestion.studentName}</Text>
                  <Text size="sm" c="dimmed">
                    {selectedQuestion.studentGrade} • {selectedQuestion.studentEmail}
                  </Text>
                </Stack>
              </Group>

              {/* Question Details */}
              <Card padding="md" style={{ backgroundColor: 'var(--muted)' }}>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Badge color={getStatusColor(selectedQuestion.status)}>
                      {selectedQuestion.status}
                    </Badge>
                    <Group gap="xs">
                      <Badge size="sm" color={getPriorityColor(selectedQuestion.priority)}>
                        {selectedQuestion.priority} priority
                      </Badge>
                      <Badge size="sm" variant="outline" color="blue">
                        {selectedQuestion.category}
                      </Badge>
                    </Group>
                  </Group>
                  <Text>{selectedQuestion.content}</Text>
                  <Group gap="xs">
                    {selectedQuestion.tags.map(tag => (
                      <Badge key={tag} size="xs" variant="light" color="gray">
                        #{tag}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Card>

              {/* Existing Responses */}
              {selectedQuestion.responses.length > 0 && (
                <Stack gap="sm">
                  <Text fw={500}>Previous Responses</Text>
                  {selectedQuestion.responses.map(response => (
                    <Card key={response.id} padding="md" style={{ backgroundColor: 'var(--muted)' }}>
                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Text size="sm" fw={500}>{response.counselorName}</Text>
                          <Text size="xs" c="dimmed">
                            {formatDate(response.createdAt)}
                          </Text>
                        </Group>
                        <div dangerouslySetInnerHTML={{ __html: response.content }} />
                      </Stack>
                    </Card>
                  ))}
                  <Divider />
                </Stack>
              )}

              {/* Response Templates */}
              <Stack gap="sm">
                <Text fw={500}>Quick Templates</Text>
                <Group gap="sm">
                  {responseTemplates.map((template, index) => (
                    <Button
                      key={index}
                      size="xs"
                      variant="light"
                      onClick={() => handleUseTemplate(template)}
                    >
                      {template.title}
                    </Button>
                  ))}
                </Group>
              </Stack>

              {/* Response Editor */}
              <Stack gap="sm">
                <Text fw={500}>Your Response</Text>
                <RichTextEditor editor={editor}>
                  <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Underline />
                      <RichTextEditor.Strikethrough />
                      <RichTextEditor.ClearFormatting />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.H1 />
                      <RichTextEditor.H2 />
                      <RichTextEditor.H3 />
                      <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Blockquote />
                      <RichTextEditor.Hr />
                      <RichTextEditor.BulletList />
                      <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>

                  <RichTextEditor.Content style={{ minHeight: 200 }} />
                </RichTextEditor>
              </Stack>

              {/* Action Buttons */}
              <Group justify="flex-end" gap="sm">
                <Button variant="light" onClick={close}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSendResponse}
                  leftSection={<ChatBubbleIcon width={16} height={16} />}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  Send Response
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};