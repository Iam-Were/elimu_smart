import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import {
  MagnifyingGlassIcon,
  PersonIcon,
  ChatBubbleIcon,
  FileTextIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from '@radix-ui/react-icons';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
}) => (
  <Card className="dashboard-card border border-border theme-transition">
    <CardContent className="p-12 text-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          {icon || <FileTextIcon width={32} height={32} />}
        </div>

        {/* Content */}
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col items-center space-y-2">
            {action && (
              <Button
                className={action.variant === 'primary' ? 'bg-primary hover:bg-primary/90' : 'variant-secondary'}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
            
            {secondaryAction && (
              <Button
                variant="ghost"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Predefined empty states for common scenarios
export const NoSearchResults: React.FC<{ 
  searchTerm?: string;
  onClearSearch?: () => void;
  onNewSearch?: () => void;
}> = ({ 
  searchTerm, 
  onClearSearch,
  onNewSearch 
}) => (
  <EmptyState
    icon={<MagnifyingGlassIcon width={32} height={32} />}
    title="No results found"
    description={
      searchTerm 
        ? `We couldn't find anything matching "${searchTerm}". Try adjusting your search terms or filters.`
        : "No results match your current filters. Try adjusting your search criteria."
    }
    action={onNewSearch ? {
      label: 'New Search',
      onClick: onNewSearch,
      variant: 'primary'
    } : undefined}
    secondaryAction={onClearSearch ? {
      label: 'Clear Filters',
      onClick: onClearSearch
    } : undefined}
  />
);

export const NoStudents: React.FC<{ 
  onAddStudent?: () => void;
  onInviteStudents?: () => void;
}> = ({ 
  onAddStudent,
  onInviteStudents 
}) => (
  <EmptyState
    icon={<PersonIcon width={32} height={32} />}
    title="No students yet"
    description="Get started by adding your first student to begin tracking their career guidance journey."
    action={onAddStudent ? {
      label: 'Add Student',
      onClick: onAddStudent,
      variant: 'primary'
    } : undefined}
    secondaryAction={onInviteStudents ? {
      label: 'Invite Students',
      onClick: onInviteStudents
    } : undefined}
  />
);

export const NoQuestions: React.FC<{ 
  onAskQuestion?: () => void;
  onBrowseTopics?: () => void;
}> = ({ 
  onAskQuestion,
  onBrowseTopics 
}) => (
  <EmptyState
    icon={<ChatBubbleIcon width={32} height={32} />}
    title="No questions yet"
    description="Start your career exploration by asking your first question. Our counselors are here to help guide your journey."
    action={onAskQuestion ? {
      label: 'Ask a Question',
      onClick: onAskQuestion,
      variant: 'primary'
    } : undefined}
    secondaryAction={onBrowseTopics ? {
      label: 'Browse Topics',
      onClick: onBrowseTopics
    } : undefined}
  />
);

export const NoContent: React.FC<{ 
  onCreateContent?: () => void;
  onUploadContent?: () => void;
}> = ({ 
  onCreateContent,
  onUploadContent 
}) => (
  <EmptyState
    icon={<FileTextIcon width={32} height={32} />}
    title="No content available"
    description="Create your first piece of content to help students explore career opportunities and make informed decisions."
    action={onCreateContent ? {
      label: 'Create Content',
      onClick: onCreateContent,
      variant: 'primary'
    } : undefined}
    secondaryAction={onUploadContent ? {
      label: 'Upload Files',
      onClick: onUploadContent
    } : undefined}
  />
);

export const ErrorState: React.FC<{ 
  title?: string;
  description?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}> = ({ 
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again or contact support if the problem persists.",
  onRetry,
  onGoBack 
}) => (
  <EmptyState
    icon={<ExclamationTriangleIcon width={32} height={32} />}
    title={title}
    description={description}
    action={onRetry ? {
      label: 'Try Again',
      onClick: onRetry,
      variant: 'primary'
    } : undefined}
    secondaryAction={onGoBack ? {
      label: 'Go Back',
      onClick: onGoBack
    } : undefined}
  />
);

export const ConnectionError: React.FC<{ 
  onRetry?: () => void;
  onOfflineMode?: () => void;
}> = ({ 
  onRetry,
  onOfflineMode 
}) => (
  <EmptyState
    icon={<ExclamationTriangleIcon width={32} height={32} />}
    title="Connection problem"
    description="We're having trouble connecting to our servers. Please check your internet connection and try again."
    action={onRetry ? {
      label: 'Retry Connection',
      onClick: onRetry,
      variant: 'primary'
    } : undefined}
    secondaryAction={onOfflineMode ? {
      label: 'Work Offline',
      onClick: onOfflineMode
    } : undefined}
  />
);

export const UnderConstruction: React.FC<{ 
  feature?: string;
  expectedDate?: string;
  onNotifyMe?: () => void;
}> = ({ 
  feature = "This feature",
  expectedDate,
  onNotifyMe 
}) => (
  <EmptyState
    icon={<PlusIcon width={32} height={32} />}
    title={`${feature} coming soon`}
    description={
      expectedDate 
        ? `We're working hard to bring you this feature. Expected availability: ${expectedDate}.`
        : "We're working hard to bring you this amazing new feature. Stay tuned for updates!"
    }
    action={onNotifyMe ? {
      label: 'Notify Me',
      onClick: onNotifyMe,
      variant: 'primary'
    } : undefined}
  />
);

export const PermissionDenied: React.FC<{ 
  onRequestAccess?: () => void;
  onContactAdmin?: () => void;
}> = ({ 
  onRequestAccess,
  onContactAdmin 
}) => (
  <EmptyState
    icon={<ExclamationTriangleIcon width={32} height={32} />}
    title="Access restricted"
    description="You don't have permission to view this content. Contact your administrator if you believe this is an error."
    action={onRequestAccess ? {
      label: 'Request Access',
      onClick: onRequestAccess,
      variant: 'primary'
    } : undefined}
    secondaryAction={onContactAdmin ? {
      label: 'Contact Admin',
      onClick: onContactAdmin
    } : undefined}
  />
);

interface EmptyTableProps {
  columns: string[];
  onAddItem?: () => void;
  onImportData?: () => void;
  entityName?: string;
}

export const EmptyTable: React.FC<EmptyTableProps> = ({
  columns,
  onAddItem,
  onImportData,
  entityName = "items"
}) => (
  <Card className="dashboard-card border border-border theme-transition">
    {/* Table Header */}
    <div className={`grid gap-4 p-4 border-b border-border bg-muted`} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
      {columns.map((column, index) => (
        <span key={index} className="text-sm font-semibold text-muted-foreground">
          {column}
        </span>
      ))}
    </div>

    {/* Empty State */}
    <CardContent className="p-12">
      <EmptyState
        icon={<FileTextIcon width={24} height={24} />}
        title={`No ${entityName} yet`}
        description={`Get started by adding your first ${entityName.slice(0, -1)} to this table.`}
        action={onAddItem ? {
          label: `Add ${entityName.slice(0, -1)}`,
          onClick: onAddItem,
          variant: 'primary'
        } : undefined}
        secondaryAction={onImportData ? {
          label: 'Import Data',
          onClick: onImportData
        } : undefined}
      />
    </CardContent>
  </Card>
);