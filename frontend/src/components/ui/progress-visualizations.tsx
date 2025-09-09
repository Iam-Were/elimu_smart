import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  Activity,
  PieChart,
} from 'lucide-react';

// Interfaces for type safety
interface ProgressRingProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'red';
  showPercentage?: boolean;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  color?: 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'red';
  className?: string;
}

interface ProgressBreakdownProps {
  title: string;
  items: {
    label: string;
    value: number;
    color?: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}

interface AchievementProgressProps {
  title: string;
  description?: string;
  progress: number;
  target: number;
  unit?: string;
  icon?: React.ReactNode;
  milestones?: {
    label: string;
    value: number;
    achieved: boolean;
  }[];
  className?: string;
}

// Utility functions
const getColorConfig = (color: string) => {
  switch (color) {
    case 'orange':
      return {
        primary: 'stroke-orange-500',
        secondary: 'stroke-orange-100',
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-700',
      };
    case 'yellow':
      return {
        primary: 'stroke-yellow-500',
        secondary: 'stroke-yellow-100',
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        badge: 'bg-yellow-100 text-yellow-700',
      };
    case 'green':
      return {
        primary: 'stroke-green-500',
        secondary: 'stroke-green-100',
        bg: 'bg-green-50',
        text: 'text-green-600',
        badge: 'bg-green-100 text-green-700',
      };
    case 'blue':
      return {
        primary: 'stroke-blue-500',
        secondary: 'stroke-blue-100',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700',
      };
    case 'purple':
      return {
        primary: 'stroke-purple-500',
        secondary: 'stroke-purple-100',
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-700',
      };
    case 'red':
      return {
        primary: 'stroke-red-500',
        secondary: 'stroke-red-100',
        bg: 'bg-red-50',
        text: 'text-red-600',
        badge: 'bg-red-100 text-red-700',
      };
    default:
      return {
        primary: 'stroke-gray-500',
        secondary: 'stroke-gray-100',
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        badge: 'bg-gray-100 text-gray-700',
      };
  }
};

const getSizeConfig = (size: string) => {
  switch (size) {
    case 'sm':
      return { width: 60, height: 60, fontSize: 'text-xs' };
    case 'md':
      return { width: 80, height: 80, fontSize: 'text-sm' };
    case 'lg':
      return { width: 120, height: 120, fontSize: 'text-lg' };
    case 'xl':
      return { width: 160, height: 160, fontSize: 'text-xl' };
    default:
      return { width: 100, height: 100, fontSize: 'text-base' };
  }
};

const getTrendIcon = (trend?: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

// Progressive Ring Component
export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 'md',
  color = 'orange',
  showPercentage = true,
  strokeWidth = 8,
  children,
  className,
}) => {
  const sizeConfig = getSizeConfig(size);
  const colorConfig = getColorConfig(color);
  
  const radius = (sizeConfig.width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={sizeConfig.width}
        height={sizeConfig.height}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={sizeConfig.width / 2}
          cy={sizeConfig.height / 2}
          r={radius}
          fill="transparent"
          className={colorConfig.secondary}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={sizeConfig.width / 2}
          cy={sizeConfig.height / 2}
          r={radius}
          fill="transparent"
          className={colorConfig.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (showPercentage && (
          <div className={cn("font-bold", sizeConfig.fontSize, colorConfig.text)}>
            {Math.round(value)}%
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Metric Card Component
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  color = 'orange',
  className,
}) => {
  const colorConfig = getColorConfig(color);

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <div className="flex items-center gap-1 text-sm">
                {getTrendIcon(trend)}
                <span className={cn(
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 'text-gray-600'
                )}>
                  {change}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", colorConfig.bg)}>
              <div className={colorConfig.text}>
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Progress Breakdown Component
export const ProgressBreakdown: React.FC<ProgressBreakdownProps> = ({
  title,
  items,
  className,
}) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                {item.icon && <div className="text-muted-foreground">{item.icon}</div>}
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <span className="font-semibold text-foreground">{item.value}%</span>
            </div>
            <Progress 
              value={item.value} 
              className="h-2"
              style={item.color ? {
                '--progress-foreground': item.color,
              } as React.CSSProperties : undefined}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Achievement Progress Component
export const AchievementProgress: React.FC<AchievementProgressProps> = ({
  title,
  description,
  progress,
  target,
  unit = '',
  icon,
  milestones = [],
  className,
}) => {
  const progressPercentage = Math.min((progress / target) * 100, 100);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              {icon}
            </div>
          )}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
            <span className="text-lg font-bold text-orange-600">
              {progress} / {target} {unit}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="text-center">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {Math.round(progressPercentage)}% Complete
            </Badge>
          </div>
        </div>

        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Milestones</h4>
            <div className="space-y-2">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    milestone.achieved 
                      ? "bg-green-100 text-green-600" 
                      : progress >= milestone.value 
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-400"
                  )}>
                    {milestone.achieved ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : progress >= milestone.value ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <div className="w-2 h-2 bg-current rounded-full opacity-50" />
                    )}
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className={cn(
                      "text-sm",
                      milestone.achieved || progress >= milestone.value 
                        ? "text-foreground font-medium" 
                        : "text-muted-foreground"
                    )}>
                      {milestone.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {milestone.value} {unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Multi-Progress Component for comparing multiple metrics
interface MultiProgressProps {
  title: string;
  items: {
    label: string;
    value: number;
    target?: number;
    color: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}

export const MultiProgress: React.FC<MultiProgressProps> = ({
  title,
  items,
  className,
}) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => {
          const percentage = item.target ? (item.value / item.target) * 100 : item.value;
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {item.icon && <div className="text-muted-foreground">{item.icon}</div>}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="text-sm font-semibold">
                  {item.target ? `${item.value}/${item.target}` : `${Math.round(percentage)}%`}
                </div>
              </div>
              <div className="relative">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out rounded-full"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

// Stats Grid Component
interface StatsGridProps {
  stats: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
    trend?: {
      value: string;
      direction: 'up' | 'down' | 'stable';
    };
  }[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = 4,
  className,
}) => {
  return (
    <div className={cn(
      "grid gap-4",
      columns === 2 && "grid-cols-2",
      columns === 3 && "grid-cols-3",
      columns === 4 && "grid-cols-4",
      className
    )}>
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              {stat.icon && (
                <div className="flex justify-center">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: stat.color || '#f3f4f6' }}
                  >
                    {stat.icon}
                  </div>
                </div>
              )}
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
              {stat.trend && (
                <div className="flex items-center justify-center gap-1 text-xs">
                  {getTrendIcon(stat.trend.direction)}
                  <span className={cn(
                    stat.trend.direction === 'up' ? 'text-green-600' :
                    stat.trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                  )}>
                    {stat.trend.value}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default {
  ProgressRing,
  MetricCard,
  ProgressBreakdown,
  AchievementProgress,
  MultiProgress,
  StatsGrid,
};