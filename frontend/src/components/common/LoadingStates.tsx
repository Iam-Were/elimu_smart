import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
    <div className="space-y-4">
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-[60%]" />
            <Skeleton className="h-2.5 w-[40%]" />
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            className={`h-3 ${index === lines - 1 ? 'w-[70%]' : 'w-full'}`}
          />
        ))}
      </div>
      
      <div className="flex items-center space-x-3 mt-auto">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-15" />
      </div>
    </div>
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
  <div className="space-y-4">
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
  </div>
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
    <div className="space-y-4">
      {/* Table Header */}
      <div className="flex items-center space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={`header-${index}`}
            className="h-3.5 flex-1"
          />
        ))}
      </div>
      
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex items-center space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-3 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
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
    <div className="space-y-4 h-full">
      {/* Chart Title */}
      <Skeleton className="h-4 w-[40%]" />
      
      {/* Chart Content */}
      <div className="flex-1 relative">
        {type === 'bar' && (
          <div className="flex items-end justify-between space-x-1 h-full">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-8"
                style={{ height: `${Math.random() * 80 + 20}%` }}
              />
            ))}
          </div>
        )}
        
        {type === 'line' && (
          <div className="relative h-full">
            <Skeleton className="h-full w-full" />
          </div>
        )}
        
        {(type === 'pie' || type === 'donut') && (
          <div className="flex justify-center items-center h-full">
            <Skeleton className="h-[150px] w-[150px] rounded-full" />
          </div>
        )}
      </div>
      
      {/* Chart Legend */}
      <div className="flex items-center space-x-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-2.5 w-15" />
          </div>
        ))}
      </div>
    </div>
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
      <p className="text-lg text-muted-foreground">
        {message}
      </p>
    </div>
  );
};

interface LoadingStatesProps {
  type: 'cards' | 'list' | 'table' | 'content';
  count?: number;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  type,
  count = 3,
}) => {
  switch (type) {
    case 'cards':
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, index) => (
            <SkeletonCard key={index} showAvatar lines={3} />
          ))}
        </div>
      );
    
    case 'list':
      return (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, index) => (
            <SkeletonCard key={index} lines={2} height={120} />
          ))}
        </div>
      );
    
    case 'table':
      return <TableSkeleton rows={count} />;
    
    case 'content':
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-[60%]" />
          <div className="space-y-2">
            {Array.from({ length: count }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
      );
    
    default:
      return <SkeletonCard />;
  }
};