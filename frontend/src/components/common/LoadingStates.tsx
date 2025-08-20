import React from 'react';
import { Stack, Text, Card, Group, Skeleton } from '@mantine/core';

interface SkeletonCardProps {
  showAvatar?: boolean;
  lines?: number;
  height?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showAvatar = false,
  lines = 3,
  height = 200,
}) => (
  <Card
    className="dashboard-card"
    style={{ height, backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
  >
    <Stack gap="md">
      {showAvatar && (
        <Group gap="sm">
          <Skeleton height={40} circle />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Skeleton height={12} width="60%" className="skeleton-pulse" />
            <Skeleton height={10} width="40%" className="skeleton-pulse" />
          </Stack>
        </Group>
      )}
      
      <Stack gap="sm">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            height={12}
            width={index === lines - 1 ? '70%' : '100%'}
            className="skeleton-pulse"
          />
        ))}
      </Stack>
      
      <Group gap="sm" mt="auto">
        <Skeleton height={32} width={80} className="skeleton-pulse" />
        <Skeleton height={32} width={60} className="skeleton-pulse" />
      </Group>
    </Stack>
  </Card>
);

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'md',
  color = 'var(--primary)',
}) => {
  const sizeMap = {
    sm: 4,
    md: 6,
    lg: 8,
  };

  const dotSize = sizeMap[size];

  return (
    <div className="loading-dots">
      <span style={{ 
        width: dotSize, 
        height: dotSize, 
        backgroundColor: color 
      }} />
      <span style={{ 
        width: dotSize, 
        height: dotSize, 
        backgroundColor: color 
      }} />
      <span style={{ 
        width: dotSize, 
        height: dotSize, 
        backgroundColor: color 
      }} />
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 20,
  color = 'var(--primary)',
}) => (
  <div
    className="loading-spinner"
    style={{
      width: size,
      height: size,
      borderColor: 'var(--muted)',
      borderTopColor: color,
    }}
  />
);

interface ProgressiveListProps {
  itemCount: number;
  loading?: boolean;
  renderItem: (index: number) => React.ReactNode;
  renderSkeleton?: () => React.ReactNode;
}

export const ProgressiveList: React.FC<ProgressiveListProps> = ({
  itemCount,
  loading = false,
  renderItem,
  renderSkeleton = () => <SkeletonCard />,
}) => (
  <Stack gap="md">
    {Array.from({ length: itemCount }).map((_, index) => (
      <div key={index} className="progressive-reveal">
        {renderItem(index)}
      </div>
    ))}
    {loading && Array.from({ length: 3 }).map((_, index) => (
      <div key={`skeleton-${index}`} className="progressive-reveal">
        {renderSkeleton()}
      </div>
    ))}
  </Stack>
);

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
}) => (
  <Card
    className="dashboard-card"
    style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
  >
    <Stack gap="md">
      {/* Table Header */}
      <Group gap="md">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={`header-${index}`}
            height={14}
            width={`${100 / columns}%`}
            className="skeleton-pulse"
          />
        ))}
      </Group>
      
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Group key={`row-${rowIndex}`} gap="md">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              height={12}
              width={`${100 / columns}%`}
              className="skeleton-pulse"
            />
          ))}
        </Group>
      ))}
    </Stack>
  </Card>
);

interface ChartSkeletonProps {
  type?: 'bar' | 'line' | 'pie' | 'donut';
  height?: number;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  type = 'bar',
  height = 300,
}) => (
  <Card
    className="dashboard-card"
    style={{ 
      height, 
      backgroundColor: 'var(--card)', 
      border: '1px solid var(--border)' 
    }}
  >
    <Stack gap="md" h="100%">
      {/* Chart Title */}
      <Skeleton height={16} width="40%" className="skeleton-pulse" />
      
      {/* Chart Content */}
      <div style={{ flex: 1, position: 'relative' }}>
        {type === 'bar' && (
          <Group gap="xs" align="flex-end" h="100%">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                height={Math.random() * 80 + 20 + '%'}
                width={30}
                className="skeleton-pulse"
              />
            ))}
          </Group>
        )}
        
        {type === 'line' && (
          <div style={{ position: 'relative', height: '100%' }}>
            <Skeleton height="100%" width="100%" className="skeleton-pulse" />
          </div>
        )}
        
        {(type === 'pie' || type === 'donut') && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Skeleton height={150} width={150} circle className="skeleton-pulse" />
          </div>
        )}
      </div>
      
      {/* Chart Legend */}
      <Group gap="sm">
        {Array.from({ length: 3 }).map((_, index) => (
          <Group key={index} gap="xs">
            <Skeleton height={12} width={12} className="skeleton-pulse" />
            <Skeleton height={10} width={60} className="skeleton-pulse" />
          </Group>
        ))}
      </Group>
    </Stack>
  </Card>
);

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
}) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        gap: 16,
      }}
    >
      <LoadingSpinner size={32} />
      <Text size="lg" style={{ color: 'var(--muted-foreground)' }}>
        {message}
      </Text>
    </div>
  );
};