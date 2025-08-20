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
  Avatar,
  Modal,
  Textarea,
  Select,
  Alert,
  SimpleGrid,
  ActionIcon,
  Tooltip,
  Progress,
  Tabs,
  MultiSelect,
} from '@mantine/core';
import {
  ExclamationTriangleIcon,
  PersonIcon,
  PlusIcon,
  EyeOpenIcon,
  Pencil1Icon,
  CheckCircledIcon,
  ClockIcon,
  TargetIcon,
  ArrowUpIcon,
  CrossCircledIcon,
} from '@radix-ui/react-icons';
import { useDisclosure } from '@mantine/hooks';

interface StudentRiskAssessment {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentGrade: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  factors: RiskFactor[];
  interventionHistory: Intervention[];
  recommendations: string[];
  lastAssessed: Date;
  trends: RiskTrend[];
}

interface RiskFactor {
  category: string;
  factor: string;
  severity: 'low' | 'medium' | 'high';
  impact: number;
  description: string;
}

interface Intervention {
  id: string;
  type: 'academic-support' | 'counseling' | 'peer-mentoring' | 'parental-engagement' | 'referral';
  title: string;
  description: string;
  goals: string[];
  strategies: string[];
  timeline: InterventionTimeline;
  stakeholders: string[];
  status: 'planned' | 'active' | 'completed' | 'suspended';
  effectiveness: number;
  outcomes: string[];
  createdAt: Date;
  completedAt?: Date;
}

interface InterventionTimeline {
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  outcomes?: string[];
}

interface RiskTrend {
  date: Date;
  riskScore: number;
  factors: string[];
  notes: string;
}

// Mock data
const mockRiskAssessments: StudentRiskAssessment[] = [
  {
    studentId: '1',
    studentName: 'Sarah Wilson',
    studentEmail: 'sarah@school.edu',
    studentGrade: 'Form 4',
    riskLevel: 'medium',
    riskScore: 65,
    factors: [
      {
        category: 'Academic',
        factor: 'Declining grades in Math',
        severity: 'medium',
        impact: 70,
        description: 'Math performance dropped from B+ to C- in recent assessments',
      },
      {
        category: 'Engagement',
        factor: 'Reduced session attendance',
        severity: 'medium',
        impact: 60,
        description: 'Missed 3 out of last 5 scheduled counseling sessions',
      },
    ],
    interventionHistory: [
      {
        id: '1',
        type: 'academic-support',
        title: 'Math Tutoring Support',
        description: 'Additional math support through peer tutoring program',
        goals: ['Improve math grade to B-', 'Increase confidence in mathematics'],
        strategies: ['Weekly tutoring sessions', 'Practice problem sets', 'Study group participation'],
        timeline: {
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-02-15'),
          milestones: [
            {
              id: '1',
              title: 'Initial Assessment',
              description: 'Baseline math skills assessment',
              targetDate: new Date('2024-01-18'),
              status: 'completed',
              outcomes: ['Identified gaps in algebra fundamentals'],
            },
            {
              id: '2',
              title: 'Mid-point Review',
              description: 'Progress evaluation',
              targetDate: new Date('2024-02-01'),
              status: 'in-progress',
            },
          ],
        },
        stakeholders: ['Math Teacher', 'Peer Tutor', 'Parent'],
        status: 'active',
        effectiveness: 75,
        outcomes: ['Improved test scores by 15%', 'Increased class participation'],
        createdAt: new Date('2024-01-15'),
      },
    ],
    recommendations: [
      'Continue math tutoring program',
      'Schedule regular check-ins with counselor',
      'Consider study skills workshop',
    ],
    lastAssessed: new Date('2024-01-20'),
    trends: [
      { date: new Date('2024-01-01'), riskScore: 45, factors: ['Low engagement'], notes: 'Initial assessment' },
      { date: new Date('2024-01-15'), riskScore: 60, factors: ['Declining grades', 'Low engagement'], notes: 'Academic concerns emerging' },
      { date: new Date('2024-01-20'), riskScore: 65, factors: ['Declining grades', 'Reduced attendance'], notes: 'Intervention initiated' },
    ],
  },
  {
    studentId: '2',
    studentName: 'David Brown',
    studentEmail: 'david@school.edu',
    studentGrade: 'Form 3',
    riskLevel: 'low',
    riskScore: 25,
    factors: [
      {
        category: 'Social',
        factor: 'Limited peer interaction',
        severity: 'low',
        impact: 30,
        description: 'Student prefers individual activities over group work',
      },
    ],
    interventionHistory: [],
    recommendations: [
      'Monitor social integration',
      'Encourage group activity participation',
    ],
    lastAssessed: new Date('2024-01-18'),
    trends: [
      { date: new Date('2024-01-01'), riskScore: 20, factors: [], notes: 'Baseline assessment' },
      { date: new Date('2024-01-18'), riskScore: 25, factors: ['Social isolation'], notes: 'Minor social concerns' },
    ],
  },
  {
    studentId: '3',
    studentName: 'Alex Johnson',
    studentEmail: 'alex@school.edu',
    studentGrade: 'Form 2',
    riskLevel: 'high',
    riskScore: 85,
    factors: [
      {
        category: 'Academic',
        factor: 'Multiple failing grades',
        severity: 'high',
        impact: 90,
        description: 'Failing in 3 out of 5 core subjects',
      },
      {
        category: 'Behavioral',
        factor: 'Chronic absenteeism',
        severity: 'high',
        impact: 80,
        description: 'Absent 40% of school days this term',
      },
      {
        category: 'Family',
        factor: 'Family financial stress',
        severity: 'medium',
        impact: 70,
        description: 'Family experiencing financial difficulties affecting attendance',
      },
    ],
    interventionHistory: [
      {
        id: '2',
        type: 'counseling',
        title: 'Comprehensive Support Plan',
        description: 'Multi-faceted intervention addressing academic and attendance issues',
        goals: ['Improve attendance to 90%', 'Pass all core subjects', 'Address family support needs'],
        strategies: ['Daily check-ins', 'Academic recovery plan', 'Family support services'],
        timeline: {
          startDate: new Date('2024-01-10'),
          endDate: new Date('2024-03-10'),
          milestones: [
            {
              id: '1',
              title: 'Family Meeting',
              description: 'Meet with parents to discuss support options',
              targetDate: new Date('2024-01-15'),
              status: 'completed',
              outcomes: ['Identified transportation issues', 'Connected with social services'],
            },
            {
              id: '2',
              title: 'Academic Recovery Plan',
              description: 'Develop plan to address failing grades',
              targetDate: new Date('2024-01-25'),
              status: 'in-progress',
            },
          ],
        },
        stakeholders: ['Parents', 'Academic Coordinator', 'Social Worker'],
        status: 'active',
        effectiveness: 60,
        outcomes: ['Attendance improved to 75%', 'Math grade improved to C'],
        createdAt: new Date('2024-01-10'),
      },
    ],
    recommendations: [
      'Continue comprehensive support plan',
      'Weekly family check-ins',
      'Consider additional academic support',
      'Monitor for signs of improvement',
    ],
    lastAssessed: new Date('2024-01-22'),
    trends: [
      { date: new Date('2023-12-01'), riskScore: 60, factors: ['Academic struggles'], notes: 'Initial concerns' },
      { date: new Date('2024-01-01'), riskScore: 80, factors: ['Academic struggles', 'Absenteeism'], notes: 'Escalating issues' },
      { date: new Date('2024-01-22'), riskScore: 85, factors: ['Multiple failures', 'Chronic absence', 'Family stress'], notes: 'High risk - active intervention' },
    ],
  },
];

const interventionTemplates = [
  {
    type: 'academic-support',
    title: 'Academic Support Intervention',
    goals: ['Improve academic performance', 'Build study skills', 'Increase engagement'],
    strategies: ['Tutoring sessions', 'Study skills training', 'Progress monitoring'],
    stakeholders: ['Teacher', 'Parent', 'Tutor'],
  },
  {
    type: 'counseling',
    title: 'Individual Counseling Plan',
    goals: ['Address personal challenges', 'Improve coping skills', 'Build resilience'],
    strategies: ['Regular counseling sessions', 'Skill-building activities', 'Goal setting'],
    stakeholders: ['Counselor', 'Parent', 'Student'],
  },
  {
    type: 'peer-mentoring',
    title: 'Peer Mentoring Program',
    goals: ['Improve social connections', 'Build confidence', 'Academic support'],
    strategies: ['Mentor matching', 'Regular meetings', 'Group activities'],
    stakeholders: ['Mentor', 'Counselor', 'Parent'],
  },
];

export const InterventionSystem: React.FC = () => {
  const [assessments, setAssessments] = useState<StudentRiskAssessment[]>(mockRiskAssessments);
  const [selectedStudent, setSelectedStudent] = useState<StudentRiskAssessment | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [interventionOpened, { open: openIntervention, close: closeIntervention }] = useDisclosure(false);
  const [filterRisk, setFilterRisk] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('overview');

  // Intervention form state
  const [interventionForm, setInterventionForm] = useState({
    type: 'academic-support',
    title: '',
    description: '',
    goals: [] as string[],
    strategies: [] as string[],
    stakeholders: [] as string[],
    startDate: '',
    endDate: '',
  });

  const filteredAssessments = assessments.filter(assessment => {
    const matchesRisk = !filterRisk || assessment.riskLevel === filterRisk;
    return matchesRisk;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'green';
      case 'medium':
        return 'yellow';
      case 'high':
        return 'orange';
      case 'critical':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getInterventionTypeColor = (type: string) => {
    switch (type) {
      case 'academic-support':
        return 'blue';
      case 'counseling':
        return 'green';
      case 'peer-mentoring':
        return 'purple';
      case 'parental-engagement':
        return 'orange';
      case 'referral':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleViewStudent = (assessment: StudentRiskAssessment) => {
    setSelectedStudent(assessment);
    open();
  };

  const handleCreateIntervention = (assessment: StudentRiskAssessment) => {
    setSelectedStudent(assessment);
    setInterventionForm({
      type: 'academic-support',
      title: '',
      description: '',
      goals: [],
      strategies: [],
      stakeholders: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    openIntervention();
  };

  const handleUseInterventionTemplate = (template: typeof interventionTemplates[0]) => {
    setInterventionForm(prev => ({
      ...prev,
      title: template.title,
      goals: template.goals,
      strategies: template.strategies,
      stakeholders: template.stakeholders,
    }));
  };

  const handleSaveIntervention = () => {
    if (!selectedStudent) return;

    const newIntervention: Intervention = {
      id: Date.now().toString(),
      type: interventionForm.type as Intervention['type'],
      title: interventionForm.title,
      description: interventionForm.description,
      goals: interventionForm.goals,
      strategies: interventionForm.strategies,
      timeline: {
        startDate: new Date(interventionForm.startDate),
        endDate: new Date(interventionForm.endDate),
        milestones: [],
      },
      stakeholders: interventionForm.stakeholders,
      status: 'planned',
      effectiveness: 0,
      outcomes: [],
      createdAt: new Date(),
    };

    const updatedAssessments = assessments.map(assessment =>
      assessment.studentId === selectedStudent.studentId
        ? {
            ...assessment,
            interventionHistory: [...assessment.interventionHistory, newIntervention],
          }
        : assessment
    );

    setAssessments(updatedAssessments);
    closeIntervention();
  };

  const getAssessmentsByRisk = (level: string) => {
    return assessments.filter(a => a.riskLevel === level).length;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="2rem">
              Student Risk Assessment & Intervention
            </Title>
            <Text size="lg" c="dimmed">
              Proactive identification and support for at-risk students
            </Text>
          </Stack>
          <Group gap="sm">
            <Badge size="lg" color="red" variant="light">
              {getAssessmentsByRisk('high') + getAssessmentsByRisk('critical')} High Risk
            </Badge>
            <Badge size="lg" color="yellow" variant="light">
              {getAssessmentsByRisk('medium')} Medium Risk
            </Badge>
          </Group>
        </Group>

        {/* Risk Overview Cards */}
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <CrossCircledIcon width={24} height={24} style={{ color: 'var(--destructive)' }} />
              <Text size="xs" c="dimmed" ta="center">Critical Risk</Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--destructive)' }}>
                {getAssessmentsByRisk('critical')}
              </Title>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ExclamationTriangleIcon width={24} height={24} style={{ color: '#ef4444' }} />
              <Text size="xs" c="dimmed" ta="center">High Risk</Text>
              <Title order={2} size="1.5rem" style={{ color: '#ef4444' }}>
                {getAssessmentsByRisk('high')}
              </Title>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ClockIcon width={24} height={24} style={{ color: '#eab308' }} />
              <Text size="xs" c="dimmed" ta="center">Medium Risk</Text>
              <Title order={2} size="1.5rem" style={{ color: '#eab308' }}>
                {getAssessmentsByRisk('medium')}
              </Title>
            </Stack>
          </Card>

          <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <CheckCircledIcon width={24} height={24} style={{ color: 'var(--success)' }} />
              <Text size="xs" c="dimmed" ta="center">Low Risk</Text>
              <Title order={2} size="1.5rem" style={{ color: 'var(--success)' }}>
                {getAssessmentsByRisk('low')}
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
              placeholder="Filter by risk level"
              value={filterRisk}
              onChange={setFilterRisk}
              data={[
                { value: 'critical', label: 'Critical Risk' },
                { value: 'high', label: 'High Risk' },
                { value: 'medium', label: 'Medium Risk' },
                { value: 'low', label: 'Low Risk' },
              ]}
              clearable
              style={{ minWidth: 200 }}
            />
          </Group>
        </Card>

        {/* Urgent Alerts */}
        {assessments.some(a => a.riskLevel === 'critical' || a.riskLevel === 'high') && (
          <Alert
            icon={<ExclamationTriangleIcon width={16} height={16} />}
            title="Immediate Attention Required"
            color="red"
          >
            <Stack gap="xs">
              <Text size="sm">
                {getAssessmentsByRisk('critical') + getAssessmentsByRisk('high')} student(s) require immediate intervention.
              </Text>
              <Group gap="xs">
                {filteredAssessments
                  .filter(a => a.riskLevel === 'critical' || a.riskLevel === 'high')
                  .slice(0, 3)
                  .map(student => (
                    <Badge key={student.studentId} color="red" size="sm">
                      {student.studentName}
                    </Badge>
                  ))}
                {filteredAssessments.filter(a => a.riskLevel === 'critical' || a.riskLevel === 'high').length > 3 && (
                  <Badge color="red" size="sm">
                    +{filteredAssessments.filter(a => a.riskLevel === 'critical' || a.riskLevel === 'high').length - 3} more
                  </Badge>
                )}
              </Group>
            </Stack>
          </Alert>
        )}

        {/* Student Risk Assessments */}
        <Stack gap="md">
          {filteredAssessments.map(assessment => (
            <Card
              key={assessment.studentId}
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
                      {assessment.studentName.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Stack gap={2}>
                      <Text fw={500}>{assessment.studentName}</Text>
                      <Text size="sm" c="dimmed">
                        {assessment.studentGrade} • Last assessed: {formatDate(assessment.lastAssessed)}
                      </Text>
                    </Stack>
                  </Group>
                  <Group gap="xs">
                    <Badge
                      size="lg"
                      color={getRiskColor(assessment.riskLevel)}
                      variant="filled"
                    >
                      {assessment.riskLevel.toUpperCase()} RISK
                    </Badge>
                    <Text size="sm" fw={500} style={{ color: 'var(--primary)' }}>
                      Score: {assessment.riskScore}/100
                    </Text>
                  </Group>
                </Group>

                {/* Risk Progress */}
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>Risk Level</Text>
                    <Text size="sm" c="dimmed">{assessment.riskScore}/100</Text>
                  </Group>
                  <Progress
                    value={assessment.riskScore}
                    color={getRiskColor(assessment.riskLevel)}
                    size="lg"
                  />
                </Stack>

                {/* Risk Factors */}
                <Stack gap="xs">
                  <Text size="sm" fw={500}>Risk Factors ({assessment.factors.length})</Text>
                  <Group gap="xs">
                    {assessment.factors.slice(0, 3).map((factor, index) => (
                      <Tooltip key={index} label={factor.description}>
                        <Badge
                          size="sm"
                          color={getRiskColor(factor.severity)}
                          variant="light"
                        >
                          {factor.factor}
                        </Badge>
                      </Tooltip>
                    ))}
                    {assessment.factors.length > 3 && (
                      <Badge size="sm" variant="outline" color="gray">
                        +{assessment.factors.length - 3} more
                      </Badge>
                    )}
                  </Group>
                </Stack>

                {/* Active Interventions */}
                <Stack gap="xs">
                  <Text size="sm" fw={500}>
                    Active Interventions ({assessment.interventionHistory.filter(i => i.status === 'active').length})
                  </Text>
                  {assessment.interventionHistory.filter(i => i.status === 'active').length > 0 ? (
                    <Group gap="xs">
                      {assessment.interventionHistory
                        .filter(i => i.status === 'active')
                        .slice(0, 2)
                        .map((intervention, index) => (
                          <Badge
                            key={index}
                            size="sm"
                            color={getInterventionTypeColor(intervention.type)}
                            variant="light"
                          >
                            {intervention.title}
                          </Badge>
                        ))}
                    </Group>
                  ) : (
                    <Text size="sm" c="dimmed">No active interventions</Text>
                  )}
                </Stack>

                {/* Actions */}
                <Group justify="flex-end" gap="xs">
                  <Tooltip label="View Details">
                    <ActionIcon
                      variant="light"
                      onClick={() => handleViewStudent(assessment)}
                    >
                      <EyeOpenIcon width={16} height={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Create Intervention">
                    <ActionIcon
                      variant="light"
                      color="green"
                      onClick={() => handleCreateIntervention(assessment)}
                    >
                      <PlusIcon width={16} height={16} />
                    </ActionIcon>
                  </Tooltip>
                  {assessment.interventionHistory.length > 0 && (
                    <Tooltip label="Update Assessment">
                      <ActionIcon
                        variant="light"
                        color="blue"
                      >
                        <Pencil1Icon width={16} height={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              </Stack>
            </Card>
          ))}
        </Stack>

        {/* Student Detail Modal */}
        <Modal
          opened={opened}
          onClose={close}
          title={selectedStudent ? `${selectedStudent.studentName} - Risk Assessment` : 'Student Risk Assessment'}
          size="xl"
        >
          {selectedStudent && (
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Tab value="overview" leftSection={<PersonIcon width={14} height={14} />}>
                  Overview
                </Tabs.Tab>
                <Tabs.Tab value="interventions" leftSection={<TargetIcon width={14} height={14} />}>
                  Interventions
                </Tabs.Tab>
                <Tabs.Tab value="trends" leftSection={<ArrowUpIcon width={14} height={14} />}>
                  Trends
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="lg">
                <Stack gap="md">
                  {/* Student Info */}
                  <Group gap="sm">
                    <Avatar
                      size={50}
                      radius="xl"
                      color="yellow"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      {selectedStudent.studentName.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Stack gap={2}>
                      <Text fw={500} size="lg">{selectedStudent.studentName}</Text>
                      <Text size="sm" c="dimmed">{selectedStudent.studentEmail}</Text>
                      <Text size="sm" c="dimmed">{selectedStudent.studentGrade}</Text>
                    </Stack>
                  </Group>

                  {/* Risk Factors */}
                  <Card padding="md" style={{ backgroundColor: 'var(--muted)' }}>
                    <Stack gap="sm">
                      <Text fw={500}>Risk Factors</Text>
                      {selectedStudent.factors.map((factor, index) => (
                        <Card key={index} padding="sm" style={{ backgroundColor: 'var(--card)' }}>
                          <Stack gap="xs">
                            <Group justify="space-between">
                              <Text size="sm" fw={500}>{factor.factor}</Text>
                              <Badge size="sm" color={getRiskColor(factor.severity)}>
                                {factor.severity}
                              </Badge>
                            </Group>
                            <Text size="xs" c="dimmed">{factor.description}</Text>
                            <Progress value={factor.impact} size="xs" color={getRiskColor(factor.severity)} />
                          </Stack>
                        </Card>
                      ))}
                    </Stack>
                  </Card>

                  {/* Recommendations */}
                  <Card padding="md" style={{ backgroundColor: 'var(--muted)' }}>
                    <Stack gap="sm">
                      <Text fw={500}>Recommendations</Text>
                      {selectedStudent.recommendations.map((rec, index) => (
                        <Text key={index} size="sm">• {rec}</Text>
                      ))}
                    </Stack>
                  </Card>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="interventions" pt="lg">
                <Stack gap="md">
                  {selectedStudent.interventionHistory.length === 0 ? (
                    <Alert icon={<TargetIcon width={16} height={16} />} color="blue">
                      No interventions have been created for this student yet.
                    </Alert>
                  ) : (
                    selectedStudent.interventionHistory.map((intervention, index) => (
                      <Card key={index} padding="md" style={{ backgroundColor: 'var(--muted)' }}>
                        <Stack gap="sm">
                          <Group justify="space-between">
                            <Text fw={500}>{intervention.title}</Text>
                            <Badge color={getInterventionTypeColor(intervention.type)}>
                              {intervention.status}
                            </Badge>
                          </Group>
                          <Text size="sm" c="dimmed">{intervention.description}</Text>
                          
                          {intervention.goals.length > 0 && (
                            <Stack gap="xs">
                              <Text size="sm" fw={500}>Goals:</Text>
                              {intervention.goals.map((goal, i) => (
                                <Text key={i} size="sm">• {goal}</Text>
                              ))}
                            </Stack>
                          )}

                          {intervention.outcomes.length > 0 && (
                            <Stack gap="xs">
                              <Text size="sm" fw={500} c="green">Outcomes:</Text>
                              {intervention.outcomes.map((outcome, i) => (
                                <Text key={i} size="sm" c="green">✓ {outcome}</Text>
                              ))}
                            </Stack>
                          )}
                        </Stack>
                      </Card>
                    ))
                  )}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="trends" pt="lg">
                <Stack gap="md">
                  <Text fw={500}>Risk Score Trends</Text>
                  {selectedStudent.trends.map((trend, index) => (
                    <Card key={index} padding="sm" style={{ backgroundColor: 'var(--muted)' }}>
                      <Group justify="space-between">
                        <Group gap="sm">
                          <Text size="sm" fw={500}>{formatDate(trend.date)}</Text>
                          <Badge size="sm" color={trend.riskScore > 70 ? 'red' : trend.riskScore > 40 ? 'yellow' : 'green'}>
                            {trend.riskScore}
                          </Badge>
                        </Group>
                        <Text size="xs" c="dimmed">{trend.notes}</Text>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Tabs.Panel>
            </Tabs>
          )}
        </Modal>

        {/* Create Intervention Modal */}
        <Modal
          opened={interventionOpened}
          onClose={closeIntervention}
          title={selectedStudent ? `Create Intervention - ${selectedStudent.studentName}` : 'Create Intervention'}
          size="lg"
        >
          <Stack gap="md">
            {/* Templates */}
            <Stack gap="xs">
              <Text fw={500} size="sm">Quick Start Templates</Text>
              <Group gap="sm">
                {interventionTemplates.map((template, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="light"
                    onClick={() => handleUseInterventionTemplate(template)}
                  >
                    {template.title}
                  </Button>
                ))}
              </Group>
            </Stack>

            <Select
              label="Intervention Type"
              value={interventionForm.type}
              onChange={value => setInterventionForm({ ...interventionForm, type: value || 'academic-support' })}
              data={[
                { value: 'academic-support', label: 'Academic Support' },
                { value: 'counseling', label: 'Individual Counseling' },
                { value: 'peer-mentoring', label: 'Peer Mentoring' },
                { value: 'parental-engagement', label: 'Parental Engagement' },
                { value: 'referral', label: 'External Referral' },
              ]}
            />

            <Textarea
              label="Intervention Title"
              placeholder="Enter intervention title"
              value={interventionForm.title}
              onChange={e => setInterventionForm({ ...interventionForm, title: e.target.value })}
              required
            />

            <Textarea
              label="Description"
              placeholder="Describe the intervention plan"
              value={interventionForm.description}
              onChange={e => setInterventionForm({ ...interventionForm, description: e.target.value })}
              minRows={3}
            />

            <MultiSelect
              label="Goals"
              placeholder="Define intervention goals"
              value={interventionForm.goals}
              onChange={goals => setInterventionForm({ ...interventionForm, goals })}
              data={[
                { value: 'Improve academic performance', label: 'Improve academic performance' },
                { value: 'Increase engagement', label: 'Increase engagement' },
                { value: 'Build study skills', label: 'Build study skills' },
                { value: 'Improve attendance', label: 'Improve attendance' },
                { value: 'Address behavioral issues', label: 'Address behavioral issues' },
                { value: 'Family support', label: 'Family support' },
                ...interventionForm.goals.map(goal => ({ value: goal, label: goal }))
              ]}
              searchable
            />

            <MultiSelect
              label="Strategies"
              placeholder="Define intervention strategies"
              value={interventionForm.strategies}
              onChange={strategies => setInterventionForm({ ...interventionForm, strategies })}
              data={[
                { value: 'Tutoring sessions', label: 'Tutoring sessions' },
                { value: 'Study skills training', label: 'Study skills training' },
                { value: 'Regular check-ins', label: 'Regular check-ins' },
                { value: 'Parent meetings', label: 'Parent meetings' },
                { value: 'Peer mentoring', label: 'Peer mentoring' },
                { value: 'Goal setting', label: 'Goal setting' },
                ...interventionForm.strategies.map(strategy => ({ value: strategy, label: strategy }))
              ]}
              searchable
            />

            <Group grow>
              <div>
                <Text size="sm" fw={500} mb={5}>Start Date</Text>
                <input
                  type="date"
                  value={interventionForm.startDate}
                  onChange={e => setInterventionForm({ ...interventionForm, startDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                  }}
                />
              </div>
              <div>
                <Text size="sm" fw={500} mb={5}>End Date</Text>
                <input
                  type="date"
                  value={interventionForm.endDate}
                  onChange={e => setInterventionForm({ ...interventionForm, endDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                  }}
                />
              </div>
            </Group>

            <MultiSelect
              label="Stakeholders"
              placeholder="Who will be involved?"
              value={interventionForm.stakeholders}
              onChange={stakeholders => setInterventionForm({ ...interventionForm, stakeholders })}
              data={[
                { value: 'Parent', label: 'Parent/Guardian' },
                { value: 'Teacher', label: 'Subject Teacher' },
                { value: 'Counselor', label: 'School Counselor' },
                { value: 'Tutor', label: 'Tutor' },
                { value: 'Peer Mentor', label: 'Peer Mentor' },
                { value: 'Social Worker', label: 'Social Worker' },
                { value: 'Administrator', label: 'School Administrator' },
              ]}
            />

            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={closeIntervention}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveIntervention}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                Create Intervention
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};