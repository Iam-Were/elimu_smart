import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Grid,
  Stack,
  Badge,
  Group,
  Button,
  Select,
  SimpleGrid,
  Progress,
  RingProgress,
  Alert,
  Tabs,
} from '@mantine/core';
import {
  BarChartIcon,
  ArrowUpIcon,
  PersonIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  ClockIcon,
  TargetIcon,
  DownloadIcon,
} from '@radix-ui/react-icons';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

// Mock data for analytics
const studentProgressData = [
  { month: 'Sep', completionRate: 65, engagementScore: 72, sessions: 15 },
  { month: 'Oct', completionRate: 72, engagementScore: 78, sessions: 22 },
  { month: 'Nov', completionRate: 78, engagementScore: 85, sessions: 28 },
  { month: 'Dec', completionRate: 82, engagementScore: 88, sessions: 35 },
  { month: 'Jan', completionRate: 85, engagementScore: 90, sessions: 42 },
];

const riskDistributionData = [
  { name: 'Low Risk', value: 62, color: '#22c55e' },
  { name: 'Medium Risk', value: 28, color: '#eab308' },
  { name: 'High Risk', value: 8, color: '#ef4444' },
  { name: 'Critical', value: 2, color: '#dc2626' },
];

const interventionSuccessData = [
  { category: 'Academic Support', success: 85, total: 20 },
  { category: 'Career Guidance', success: 92, total: 35 },
  { category: 'Personal Development', success: 78, total: 15 },
  { category: 'Study Skills', success: 88, total: 25 },
];

const cohortComparisonData = [
  { cohort: 'Form 1', progress: 68, satisfaction: 82, completion: 75 },
  { cohort: 'Form 2', progress: 74, satisfaction: 85, completion: 80 },
  { cohort: 'Form 3', progress: 82, satisfaction: 88, completion: 85 },
  { cohort: 'Form 4', progress: 88, satisfaction: 90, completion: 92 },
];

const performanceKPIs = {
  totalStudents: 52,
  activeStudents: 45,
  atRiskStudents: 5,
  avgResponseTime: 4.2,
  studentSatisfaction: 4.8,
  sessionEffectiveness: 87,
  interventionSuccessRate: 82,
  careerReadinessScore: 78,
};

export const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last-3-months');
  const [activeTab, setActiveTab] = useState<string | null>('overview');

  const generateReport = (type: string) => {
    // In a real app, this would generate and download a report
    console.log(`Generating ${type} report...`);
  };


  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="2rem">
              Advanced Analytics
            </Title>
            <Text size="lg" c="dimmed">
              Data-driven insights for counseling effectiveness
            </Text>
          </Stack>
          <Group gap="sm">
            <Select
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value || 'last-3-months')}
              data={[
                { value: 'last-month', label: 'Last Month' },
                { value: 'last-3-months', label: 'Last 3 Months' },
                { value: 'semester', label: 'This Semester' },
                { value: 'year', label: 'This Year' },
              ]}
              style={{ minWidth: 150 }}
            />
            <Button
              leftSection={<DownloadIcon width={16} height={16} />}
              variant="light"
              onClick={() => generateReport('comprehensive')}
            >
              Export Report
            </Button>
          </Group>
        </Group>

        {/* KPI Overview */}
        <SimpleGrid cols={{ base: 2, sm: 4, lg: 8 }} spacing="md">
          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <PersonIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">Total Students</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                {performanceKPIs.totalStudents}
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ArrowUpIcon width={20} height={20} style={{ color: 'var(--success)' }} />
              <Text size="xs" c="dimmed" ta="center">Active</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--success)' }}>
                {performanceKPIs.activeStudents}
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ExclamationTriangleIcon width={20} height={20} style={{ color: 'var(--destructive)' }} />
              <Text size="xs" c="dimmed" ta="center">At Risk</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--destructive)' }}>
                {performanceKPIs.atRiskStudents}
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ClockIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">Avg Response</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                {performanceKPIs.avgResponseTime}h
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <CheckCircledIcon width={20} height={20} style={{ color: 'var(--success)' }} />
              <Text size="xs" c="dimmed" ta="center">Satisfaction</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--success)' }}>
                {performanceKPIs.studentSatisfaction}/5
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <TargetIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">Effectiveness</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                {performanceKPIs.sessionEffectiveness}%
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ArrowUpIcon width={20} height={20} style={{ color: 'var(--success)' }} />
              <Text size="xs" c="dimmed" ta="center">Interventions</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--success)' }}>
                {performanceKPIs.interventionSuccessRate}%
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <BarChartIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">Readiness</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                {performanceKPIs.careerReadinessScore}%
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<BarChartIcon width={14} height={14} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="students" leftSection={<PersonIcon width={14} height={14} />}>
              Student Analytics
            </Tabs.Tab>
            <Tabs.Tab value="interventions" leftSection={<ExclamationTriangleIcon width={14} height={14} />}>
              Risk Assessment
            </Tabs.Tab>
            <Tabs.Tab value="performance" leftSection={<ArrowUpIcon width={14} height={14} />}>
              Performance
            </Tabs.Tab>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Panel value="overview" pt="lg">
            <Grid>
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                  <Stack gap="md">
                    <Title order={4}>Student Progress Trends</Title>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={studentProgressData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                        <YAxis stroke="var(--muted-foreground)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card)', 
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Area type="monotone" dataKey="completionRate" stackId="1" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} name="Completion Rate %" />
                        <Area type="monotone" dataKey="engagementScore" stackId="2" stroke="var(--success)" fill="var(--success)" fillOpacity={0.3} name="Engagement Score %" />
                        <Area type="monotone" dataKey="sessions" stackId="3" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.3} name="Sessions Completed" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                  <Stack gap="md">
                    <Title order={4}>Risk Distribution</Title>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={riskDistributionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        >
                          {riskDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* Student Analytics Tab */}
          <Tabs.Panel value="students" pt="lg">
            <Grid>
              <Grid.Col span={12}>
                <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                  <Stack gap="md">
                    <Title order={4}>Cohort Comparison</Title>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={cohortComparisonData} barGap={10}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="cohort" stroke="var(--muted-foreground)" />
                        <YAxis stroke="var(--muted-foreground)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card)', 
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="progress" fill="var(--primary)" name="Progress %" />
                        <Bar dataKey="satisfaction" fill="var(--success)" name="Satisfaction %" />
                        <Bar dataKey="completion" fill="var(--secondary)" name="Completion %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* Risk Assessment Tab */}
          <Tabs.Panel value="interventions" pt="lg">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                  <Stack gap="md">
                    <Title order={4}>Intervention Success Rates</Title>
                    <Stack gap="sm">
                      {interventionSuccessData.map((item, index) => (
                        <Stack key={index} gap="xs">
                          <Group justify="space-between">
                            <Text size="sm" fw={500}>{item.category}</Text>
                            <Text size="sm" c="dimmed">{item.success}% ({item.total} cases)</Text>
                          </Group>
                          <Progress 
                            value={item.success} 
                            color={item.success > 85 ? 'green' : item.success > 75 ? 'yellow' : 'red'} 
                          />
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                  <Stack gap="md">
                    <Title order={4}>Predictive Insights</Title>
                    <Alert icon={<ExclamationTriangleIcon width={16} height={16} />} color="orange">
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>High Risk Students Identified</Text>
                        <Text size="xs">
                          3 students show patterns indicating potential academic difficulties. 
                          Recommended interventions have been queued for review.
                        </Text>
                      </Stack>
                    </Alert>
                    
                    <Alert icon={<ArrowUpIcon width={16} height={16} />} color="green">
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>Positive Trend Detected</Text>
                        <Text size="xs">
                          Overall student engagement has increased 15% this month. 
                          Career readiness scores are above target.
                        </Text>
                      </Stack>
                    </Alert>

                    <Alert icon={<TargetIcon width={16} height={16} />} color="blue">
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>Intervention Opportunity</Text>
                        <Text size="xs">
                          Students in Form 2 cohort would benefit from additional study skills support.
                          Consider scheduling group sessions.
                        </Text>
                      </Stack>
                    </Alert>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* Performance Tab */}
          <Tabs.Panel value="performance" pt="lg">
            <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="md">
              <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <Stack gap="sm" align="center">
                  <RingProgress
                    size={120}
                    thickness={12}
                    sections={[{ value: performanceKPIs.sessionEffectiveness, color: 'var(--primary)' }]}
                    label={
                      <Text ta="center" fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                        {performanceKPIs.sessionEffectiveness}%
                      </Text>
                    }
                  />
                  <Text fw={500} ta="center">Session Effectiveness</Text>
                  <Badge color="green" variant="light">Above Target</Badge>
                </Stack>
              </Card>

              <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <Stack gap="sm" align="center">
                  <RingProgress
                    size={120}
                    thickness={12}
                    sections={[{ value: performanceKPIs.interventionSuccessRate, color: 'var(--success)' }]}
                    label={
                      <Text ta="center" fw={700} size="lg" style={{ color: 'var(--success)' }}>
                        {performanceKPIs.interventionSuccessRate}%
                      </Text>
                    }
                  />
                  <Text fw={500} ta="center">Intervention Success</Text>
                  <Badge color="green" variant="light">Excellent</Badge>
                </Stack>
              </Card>

              <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <Stack gap="sm" align="center">
                  <RingProgress
                    size={120}
                    thickness={12}
                    sections={[{ value: performanceKPIs.careerReadinessScore, color: 'var(--secondary)' }]}
                    label={
                      <Text ta="center" fw={700} size="lg" style={{ color: 'var(--secondary)' }}>
                        {performanceKPIs.careerReadinessScore}%
                      </Text>
                    }
                  />
                  <Text fw={500} ta="center">Career Readiness</Text>
                  <Badge color="yellow" variant="light">Good</Badge>
                </Stack>
              </Card>

              <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <Stack gap="sm" align="center">
                  <RingProgress
                    size={120}
                    thickness={12}
                    sections={[{ value: (performanceKPIs.studentSatisfaction / 5) * 100, color: 'var(--primary)' }]}
                    label={
                      <Text ta="center" fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                        {performanceKPIs.studentSatisfaction}
                      </Text>
                    }
                  />
                  <Text fw={500} ta="center">Student Rating</Text>
                  <Badge color="green" variant="light">Outstanding</Badge>
                </Stack>
              </Card>
            </SimpleGrid>
          </Tabs.Panel>
        </Tabs>

        {/* Quick Actions */}
        <Card padding="lg" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <Stack gap="md">
            <Title order={4}>Quick Actions</Title>
            <Group gap="sm">
              <Button
                variant="light"
                leftSection={<DownloadIcon width={16} height={16} />}
                onClick={() => generateReport('student-progress')}
              >
                Student Progress Report
              </Button>
              <Button
                variant="light"
                leftSection={<DownloadIcon width={16} height={16} />}
                onClick={() => generateReport('intervention-summary')}
              >
                Intervention Summary
              </Button>
              <Button
                variant="light"
                leftSection={<DownloadIcon width={16} height={16} />}
                onClick={() => generateReport('performance-metrics')}
              >
                Performance Report
              </Button>
              <Button
                variant="light"
                leftSection={<DownloadIcon width={16} height={16} />}
                onClick={() => generateReport('risk-assessment')}
              >
                Risk Assessment Report
              </Button>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};