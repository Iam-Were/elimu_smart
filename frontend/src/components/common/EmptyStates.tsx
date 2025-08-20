import React from 'react';
import { Stack, Text, Button, Card } from '@mantine/core';
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
  <Card
    className="dashboard-card"
    style={{
      backgroundColor: 'var(--card)',
      border: '1px solid var(--border)',
      textAlign: 'center',
      padding: '3rem 2rem',
    }}
  >
    <Stack gap="lg" align="center">
      {/* Icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--muted-foreground)',
        }}
      >
        {icon || <FileTextIcon width={32} height={32} />}
      </div>

      {/* Content */}
      <Stack gap="sm" align="center">
        <Text size="xl" fw={600} style={{ color: 'var(--foreground)' }}>
          {title}
        </Text>
        <Text
          size="md"
          style={{ 
            color: 'var(--muted-foreground)', 
            maxWidth: 400,
            lineHeight: 1.5 
          }}
        >
          {description}
        </Text>
      </Stack>

      {/* Actions */}
      {(action || secondaryAction) && (
        <Stack gap="sm" align="center">
          {action && (
            <Button
              className={action.variant === 'primary' ? 'btn-primary-linkedin btn-md' : 'btn-secondary-linkedin btn-md'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              className="btn-ghost-linkedin btn-md"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </Stack>
      )}
    </Stack>
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
  <Card
    className="dashboard-card"
    style={{
      backgroundColor: 'var(--card)',
      border: '1px solid var(--border)',
    }}
  >
    {/* Table Header */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
        gap: '1rem',
        padding: '1rem',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--muted)',
      }}
    >
      {columns.map((column, index) => (
        <Text key={index} size="sm" fw={600} style={{ color: 'var(--muted-foreground)' }}>
          {column}
        </Text>
      ))}
    </div>

    {/* Empty State */}
    <div style={{ padding: '3rem 2rem' }}>
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
    </div>
  </Card>
);