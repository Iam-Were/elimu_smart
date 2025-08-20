import React, { useState } from 'react';
import {
  Card,
  Group,
  Text,
  Stack,
  Select,
  RingProgress,
  Progress,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  DownloadIcon,
  InfoCircledIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

// interface TimeSeriesDataPoint {
//   date: string;
//   value: number;
//   category?: string;
// }

interface ProgressChartProps {
  title: string;
  subtitle?: string;
  data: ChartDataPoint[];
  total?: number;
  showLegend?: boolean;
  height?: number;
  interactive?: boolean;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  title,
  subtitle,
  data,
  total,
  showLegend = true,
  height = 200,
  interactive = true,
}) => {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  const chartTotal = total || data.reduce((sum, item) => sum + item.value, 0);
  const percentage = chartTotal > 0 ? Math.round((data[0]?.value || 0) / chartTotal * 100) : 0;

  const ringData = data.map((item, index) => ({
    value: chartTotal > 0 ? (item.value / chartTotal) * 100 : 0,
    color: item.color || `var(--chart-${index + 1})`,
    tooltip: `${item.label}: ${item.value}`,
  }));

  return (
    <Card
      className="chart-animate card-linkedin dashboard-card"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        height,
      }}
    >
      <Stack gap="md" h="100%">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Text fw={600} size="lg">
              {title}
            </Text>
            {subtitle && (
              <Text size="sm" c="dimmed">
                {subtitle}
              </Text>
            )}
          </Stack>
          
          <Group gap="xs">
            <Tooltip label="Chart information">
              <ActionIcon variant="subtle" size="sm">
                <InfoCircledIcon width={14} height={14} />
              </ActionIcon>
            </Tooltip>
            <ActionIcon variant="subtle" size="sm">
              <DownloadIcon width={14} height={14} />
            </ActionIcon>
          </Group>
        </Group>

        <Group gap="xl" align="center" style={{ flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <RingProgress
              size={120}
              thickness={12}
              sections={ringData}
              label={
                <div style={{ textAlign: 'center' }}>
                  <Text size="xl" fw={700} style={{ color: 'var(--primary)' }}>
                    {percentage}%
                  </Text>
                  <Text size="xs" c="dimmed">
                    Complete
                  </Text>
                </div>
              }
            />
          </div>

          {showLegend && (
            <Stack gap="xs" style={{ flex: 1 }}>
              {data.map((item, index) => (
                <Group
                  key={index}
                  gap="sm"
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: hoveredSection === index ? 'var(--sidebar-accent)' : 'transparent',
                    cursor: interactive ? 'pointer' : 'default',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={() => interactive && setHoveredSection(index)}
                  onMouseLeave={() => interactive && setHoveredSection(null)}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: item.color || `var(--chart-${index + 1})`,
                    }}
                  />
                  <Stack gap={0} style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      {item.label}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {item.value.toLocaleString()}
                    </Text>
                  </Stack>
                  <Text size="sm" fw={600} style={{ color: 'var(--primary)' }}>
                    {chartTotal > 0 ? Math.round((item.value / chartTotal) * 100) : 0}%
                  </Text>
                </Group>
              ))}
            </Stack>
          )}
        </Group>
      </Stack>
    </Card>
  );
};

interface BarChartProps {
  title: string;
  subtitle?: string;
  data: ChartDataPoint[];
  height?: number;
  showValues?: boolean;
  animated?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  title,
  subtitle,
  data,
  height = 250,
  showValues = true,
  animated = true,
}) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = height - 100; // Reserve space for labels and title

  return (
    <Card
      className={`chart-animate card-linkedin dashboard-card ${animated ? 'progressive-reveal' : ''}`}
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        height,
      }}
    >
      <Stack gap="md" h="100%">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Text fw={600} size="lg">
              {title}
            </Text>
            {subtitle && (
              <Text size="sm" c="dimmed">
                {subtitle}
              </Text>
            )}
          </Stack>
          
          <ActionIcon variant="subtle" size="sm">
            <DownloadIcon width={14} height={14} />
          </ActionIcon>
        </Group>

        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '0 16px' }}>
          {data.map((item, index) => {
            const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
            const isHovered = hoveredBar === index;
            
            return (
              <div
                key={index}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {showValues && (
                  <Text
                    size="xs"
                    fw={600}
                    style={{
                      color: 'var(--primary)',
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {item.value.toLocaleString()}
                  </Text>
                )}
                
                <div
                  style={{
                    width: '100%',
                    maxWidth: 40,
                    height: barHeight,
                    backgroundColor: item.color || 'var(--primary)',
                    borderRadius: '4px 4px 0 0',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: isHovered ? 0.9 : 0.8,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  className={animated ? 'progress-bar-animate' : ''}
                />
                
                <Text
                  size="xs"
                  style={{
                    textAlign: 'center',
                    color: isHovered ? 'var(--primary)' : 'var(--muted-foreground)',
                    fontWeight: isHovered ? 600 : 400,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Text>
              </div>
            );
          })}
        </div>
      </Stack>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    period: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'var(--primary)',
}) => {
  return (
    <Card
      className="card-linkedin dashboard-card progressive-reveal"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Text size="sm" c="dimmed" fw={500}>
            {title}
          </Text>
          {icon && (
            <div style={{ color, opacity: 0.7 }}>
              {icon}
            </div>
          )}
        </Group>

        <Group justify="space-between" align="flex-end">
          <Stack gap="xs">
            <Text size="xl" fw={700} style={{ color }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Text>
            {subtitle && (
              <Text size="xs" c="dimmed">
                {subtitle}
              </Text>
            )}
          </Stack>

          {trend && (
            <Group gap="xs" align="center">
              {trend.positive !== undefined && (
                <div style={{ color: trend.positive ? 'var(--success)' : 'var(--destructive)' }}>
                  {trend.positive ? (
                    <ChevronUpIcon width={16} height={16} />
                  ) : (
                    <ChevronDownIcon width={16} height={16} />
                  )}
                </div>
              )}
              <Stack gap={0} align="flex-end">
                <Text
                  size="sm"
                  fw={600}
                  style={{
                    color: trend.positive !== undefined 
                      ? (trend.positive ? 'var(--success)' : 'var(--destructive)')
                      : 'var(--muted-foreground)'
                  }}
                >
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </Text>
                <Text size="xs" c="dimmed">
                  {trend.period}
                </Text>
              </Stack>
            </Group>
          )}
        </Group>
      </Stack>
    </Card>
  );
};

interface ProgressBarChartProps {
  title: string;
  data: Array<{
    label: string;
    value: number;
    maxValue: number;
    color?: string;
    description?: string;
  }>;
  height?: number;
}

export const ProgressBarChart: React.FC<ProgressBarChartProps> = ({
  title,
  data,
  height = 300,
}) => {
  return (
    <Card
      className="chart-animate card-linkedin dashboard-card"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        height,
      }}
    >
      <Stack gap="md" h="100%">
        <Group justify="space-between" align="center">
          <Text fw={600} size="lg">
            {title}
          </Text>
          <ActionIcon variant="subtle" size="sm">
            <DownloadIcon width={14} height={14} />
          </ActionIcon>
        </Group>

        <Stack gap="lg" style={{ flex: 1 }}>
          {data.map((item, index) => {
            const percentage = item.maxValue > 0 ? (item.value / item.maxValue) * 100 : 0;
            
            return (
              <Stack key={index} gap="xs">
                <Group justify="space-between" align="center">
                  <Stack gap={0}>
                    <Text size="sm" fw={500}>
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text size="xs" c="dimmed">
                        {item.description}
                      </Text>
                    )}
                  </Stack>
                  <Group gap="xs" align="center">
                    <Text size="sm" fw={600} style={{ color: 'var(--primary)' }}>
                      {item.value.toLocaleString()}
                    </Text>
                    <Text size="xs" c="dimmed">
                      / {item.maxValue.toLocaleString()}
                    </Text>
                  </Group>
                </Group>
                
                <Progress
                  value={percentage}
                  color={item.color}
                  size="md"
                  radius="sm"
                  className="progress-bar-animate"
                />
                
                <Text size="xs" style={{ textAlign: 'right', color: 'var(--muted-foreground)' }}>
                  {Math.round(percentage)}% complete
                </Text>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
};

interface DashboardAnalyticsProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  // Mock data - in real app this would come from props or API
  const mockMetrics = [
    {
      title: 'Total Students',
      value: 2847,
      subtitle: 'Active users',
      trend: { value: 12.5, period: 'vs last month', positive: true },
      color: 'var(--primary)',
    },
    {
      title: 'Assessments Completed',
      value: 1234,
      subtitle: 'This month',
      trend: { value: 8.2, period: 'vs last month', positive: true },
      color: 'var(--success)',
    },
    {
      title: 'Career Matches',
      value: '94%',
      subtitle: 'Success rate',
      trend: { value: 2.1, period: 'vs last month', positive: true },
      color: 'var(--info)',
    },
    {
      title: 'Avg. Session Time',
      value: '24m',
      subtitle: 'Per session',
      trend: { value: -3.2, period: 'vs last month', positive: false },
      color: 'var(--warning)',
    },
  ];

  const mockProgressData = [
    { label: 'Engineering', value: 245, color: 'var(--chart-1)' },
    { label: 'Medicine', value: 189, color: 'var(--chart-2)' },
    { label: 'Business', value: 156, color: 'var(--chart-3)' },
    { label: 'Arts', value: 98, color: 'var(--chart-4)' },
    { label: 'Other', value: 67, color: 'var(--chart-5)' },
  ];

  const mockBarData = [
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 145 },
    { label: 'Mar', value: 167 },
    { label: 'Apr', value: 189 },
    { label: 'May', value: 201 },
    { label: 'Jun', value: 234 },
  ];

  const mockProgressBarData = [
    {
      label: 'Profile Completion',
      value: 78,
      maxValue: 100,
      color: 'blue',
      description: 'Student profiles completed',
    },
    {
      label: 'Assessment Participation',
      value: 156,
      maxValue: 200,
      color: 'green',
      description: 'Monthly assessment target',
    },
    {
      label: 'Career Guidance Sessions',
      value: 89,
      maxValue: 120,
      color: 'orange',
      description: 'Counselor session quota',
    },
  ];

  return (
    <Stack gap="lg">
      {/* Header Controls */}
      <Group justify="space-between" align="center">
        <Text size="xl" fw={700}>
          Analytics Dashboard
        </Text>
        <Select
          value={timeRange}
          onChange={(value) => onTimeRangeChange(value || '30d')}
          data={[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 3 months' },
            { value: '1y', label: 'Last year' },
          ]}
          style={{ width: 150 }}
        />
      </Group>

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}
      >
        {mockMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '16px',
        }}
      >
        <ProgressChart
          title="Career Interest Distribution"
          subtitle="Student preferences by field"
          data={mockProgressData}
          height={300}
        />
        
        <BarChart
          title="Monthly Assessments"
          subtitle="Completed assessments over time"
          data={mockBarData}
          height={300}
        />
      </div>

      {/* Progress Bars */}
      <ProgressBarChart
        title="Goal Progress"
        data={mockProgressBarData}
        height={280}
      />
    </Stack>
  );
};