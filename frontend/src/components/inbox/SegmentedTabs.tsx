import React from 'react';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SegmentedTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    count?: number;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div className={cn('flex gap-1 bg-gray-100 p-1 rounded-lg w-fit', className)}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'transition-all',
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span className={cn(
              'ml-2 px-1.5 py-0.5 rounded text-xs font-medium',
              activeTab === tab.id
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-200 text-gray-600'
            )}>
              {tab.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};
