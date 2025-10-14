import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import Button from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  metadata?: Record<string, unknown>;
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

  return (
    <Card 
      className="chart-animate dashboard-card border border-border theme-transition"
      style={{ height }}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoCircledIcon width={14} height={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Chart information</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <DownloadIcon width={14} height={14} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex items-center gap-8">
          {/* Simplified Ring Progress - Using CSS for visual representation */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-8 border-muted relative overflow-hidden">
              <div 
                className="absolute inset-0 rounded-full border-8 border-primary transition-all duration-500"
                style={{
                  background: `conic-gradient(hsl(var(--primary)) ${percentage * 3.6}deg, transparent 0deg)`
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {percentage}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Complete
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showLegend && (
            <div className="flex-1 space-y-2">
              {data.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                    hoveredSection === index ? 'bg-muted' : ''
                  } ${interactive ? 'cursor-pointer' : ''}`}
                  onMouseEnter={() => interactive && setHoveredSection(index)}
                  onMouseLeave={() => interactive && setHoveredSection(null)}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: item.color || `hsl(var(--chart-${index + 1}))`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {item.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.value.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {chartTotal > 0 ? Math.round((item.value / chartTotal) * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
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
      className={`chart-animate dashboard-card border border-border theme-transition ${animated ? 'progressive-reveal' : ''}`}
      style={{ height }}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <DownloadIcon width={14} height={14} />
          </Button>
        </div>
      </CardHeader>

              <CardContent className="flex-1">
        <div className="flex items-end gap-2 px-4 h-full">
          {data.map((item, index) => {
            const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
            const isHovered = hoveredBar === index;
            
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2 cursor-pointer"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Bar Value */}
                {showValues && (
                  <span className="text-xs font-medium text-foreground">
                    {item.value.toLocaleString()}
                  </span>
                )}
                
                {/* Bar */}
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    isHovered ? 'opacity-80' : ''
                  }`}
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: item.color || `hsl(var(--chart-${index + 1}))`,
                    minHeight: '4px'
                  }}
                />
                
                {/* Label */}
                <span className="text-xs text-center text-muted-foreground max-w-full">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
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
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm text-muted-foreground font-medium">
            {title}
          </span>
          {icon && (
            <div style={{ color, opacity: 0.7 }}>
              {icon}
            </div>
          )}
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="text-2xl font-bold" style={{ color }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {subtitle && (
              <div className="text-xs text-muted-foreground">
                {subtitle}
              </div>
            )}
          </div>

          {trend && (
            <div className="flex items-center gap-2">
              {trend.positive !== undefined && (
                <div style={{ color: trend.positive ? 'var(--success)' : 'var(--destructive)' }}>
                  {trend.positive ? (
                    <ChevronUpIcon width={16} height={16} />
                  ) : (
                    <ChevronDownIcon width={16} height={16} />
                  )}
                </div>
              )}
              <div className="flex flex-col items-end">
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: trend.positive !== undefined 
                      ? (trend.positive ? 'var(--success)' : 'var(--destructive)')
                      : 'var(--muted-foreground)'
                  }}
                >
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {trend.period}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
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
      <div className="flex flex-col gap-6 h-full">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {title}
          </h3>
          <Button variant="ghost" size="sm">
            <DownloadIcon width={14} height={14} />
          </Button>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          {data.map((item, index) => {
            const percentage = item.maxValue > 0 ? (item.value / item.maxValue) * 100 : 0;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">
                      {item.label}
                    </div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">
                      {item.value.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {item.maxValue.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <Progress
                  value={percentage}
                  className="progress-bar-animate"
                  style={{ 
                    backgroundColor: 'var(--muted)',
                    '--progress-foreground': item.color 
                  } as React.CSSProperties}
                />
                
                <div className="text-xs text-right text-muted-foreground">
                  {Math.round(percentage)}% complete
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

interface MetricData {
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

interface DashboardAnalyticsProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  metrics?: MetricData[];
  progressData?: ChartDataPoint[];
  barData?: ChartDataPoint[];
  progressBarData?: Array<{
    label: string;
    value: number;
    maxValue: number;
    color?: string;
    description?: string;
  }>;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  timeRange,
  onTimeRangeChange,
  metrics = [],
  progressData = [],
  barData = [],
  progressBarData = [],
}) => {
  // Data is now passed via props
  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Analytics Dashboard
        </h1>
        <Select 
          value={timeRange} 
          onValueChange={(value) => onTimeRangeChange(value || '30d')}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metric Cards */}
      {metrics.length > 0 && (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}
      >
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      )}


      {/* Charts Grid */}
      {(progressData.length > 0 || barData.length > 0) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '16px',
          }}
        >
          {progressData.length > 0 && (
            <ProgressChart
              title="Career Interest Distribution"
              subtitle="Student preferences by field"
              data={progressData}
              height={300}
            />
          )}
          
          {barData.length > 0 && (
            <BarChart
              title="Monthly Assessments"
              subtitle="Completed assessments over time"
              data={barData}
              height={300}
            />
          )}
        </div>
      )}

      {/* Progress Bars */}
      {progressBarData.length > 0 && (
        <ProgressBarChart
          title="Goal Progress"
          data={progressBarData}
          height={280}
        />
      )}
    </div>
  );
};