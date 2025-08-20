import React, { useEffect, useState } from 'react';
import { Stack, Text, Button, Card, Group, Alert } from '@mantine/core';
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  ReloadIcon,
  Cross2Icon,
} from '@radix-ui/react-icons';

interface SuccessStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoHide?: boolean;
  duration?: number;
  onClose?: () => void;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  description,
  action,
  autoHide = false,
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onClose]);

  if (!visible) return null;

  return (
    <Card
      className="dashboard-card"
      style={{
        backgroundColor: 'var(--card)',
        border: '2px solid var(--success)',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <Stack gap="lg" align="center">
        {/* Success Checkmark Animation */}
        <div className="success-checkmark" />

        {/* Content */}
        <Stack gap="sm" align="center">
          <Text size="xl" fw={600} style={{ color: 'var(--success)' }}>
            {title}
          </Text>
          {description && (
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
          )}
        </Stack>

        {/* Action */}
        {action && (
          <Button
            className="btn-primary-linkedin btn-md"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}

        {/* Close Button */}
        {onClose && (
          <Button
            className="btn-ghost-linkedin"
            onClick={() => {
              setVisible(false);
              onClose();
            }}
            style={{ position: 'absolute', top: 16, right: 16 }}
          >
            <Cross2Icon width={16} height={16} />
          </Button>
        )}
      </Stack>
    </Card>
  );
};

interface ErrorStateProps {
  title: string;
  description?: string;
  error?: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  error,
  onRetry,
  onDismiss,
  showDetails = false,
}) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <Card
      className="dashboard-card error-shake"
      style={{
        backgroundColor: 'var(--card)',
        border: '2px solid var(--destructive)',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <Stack gap="lg" align="center">
        {/* Error Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'var(--destructive)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <ExclamationTriangleIcon width={32} height={32} />
        </div>

        {/* Content */}
        <Stack gap="sm" align="center">
          <Text size="xl" fw={600} style={{ color: 'var(--destructive)' }}>
            {title}
          </Text>
          {description && (
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
          )}
        </Stack>

        {/* Error Details */}
        {showDetails && errorMessage && (
          <Stack gap="sm" style={{ width: '100%' }}>
            <Button
              className="btn-ghost-linkedin btn-sm"
              onClick={() => setShowErrorDetails(!showErrorDetails)}
            >
              {showErrorDetails ? 'Hide' : 'Show'} Error Details
            </Button>
            {showErrorDetails && (
              <Alert
                color="red"
                variant="light"
                style={{
                  textAlign: 'left',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
              >
                {errorMessage}
              </Alert>
            )}
          </Stack>
        )}

        {/* Actions */}
        <Group gap="sm">
          {onRetry && (
            <Button
              className="btn-primary-linkedin btn-md"
              leftSection={<ReloadIcon width={16} height={16} />}
              onClick={onRetry}
            >
              Try Again
            </Button>
          )}
          
          {onDismiss && (
            <Button
              className="btn-ghost-linkedin btn-md"
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
};

interface ProcessingStateProps {
  title: string;
  description?: string;
  progress?: number;
  onCancel?: () => void;
  showProgress?: boolean;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  title,
  description,
  progress,
  onCancel,
  showProgress = false,
}) => (
  <Card
    className="dashboard-card"
    style={{
      backgroundColor: 'var(--card)',
      border: '1px solid var(--border)',
      textAlign: 'center',
      padding: '2rem',
    }}
  >
    <Stack gap="lg" align="center">
      {/* Loading Spinner */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="loading-spinner"
          style={{
            width: 32,
            height: 32,
            borderColor: 'var(--muted)',
            borderTopColor: 'var(--primary)',
          }}
        />
      </div>

      {/* Content */}
      <Stack gap="sm" align="center">
        <Text size="xl" fw={600} style={{ color: 'var(--foreground)' }}>
          {title}
        </Text>
        {description && (
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
        )}
      </Stack>

      {/* Progress Bar */}
      {showProgress && typeof progress === 'number' && (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <div
            style={{
              width: '100%',
              height: 8,
              backgroundColor: 'var(--muted)',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              className="progress-bar-animate"
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: 'var(--primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <Text size="sm" style={{ color: 'var(--muted-foreground)', marginTop: 8 }}>
            {Math.round(progress)}% complete
          </Text>
        </div>
      )}

      {/* Cancel Action */}
      {onCancel && (
        <Button
          className="btn-ghost-linkedin btn-md"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
    </Stack>
  </Card>
);

interface InfoStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissable?: boolean;
  onDismiss?: () => void;
}

export const InfoState: React.FC<InfoStateProps> = ({
  title,
  description,
  action,
  dismissable = false,
  onDismiss,
}) => (
  <Card
    className="dashboard-card"
    style={{
      backgroundColor: 'var(--card)',
      border: '2px solid var(--info)',
      textAlign: 'center',
      padding: '2rem',
      position: 'relative',
    }}
  >
    <Stack gap="lg" align="center">
      {/* Info Icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'var(--info)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <InfoCircledIcon width={32} height={32} />
      </div>

      {/* Content */}
      <Stack gap="sm" align="center">
        <Text size="xl" fw={600} style={{ color: 'var(--info)' }}>
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

      {/* Action */}
      {action && (
        <Button
          className="btn-primary-linkedin btn-md"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}

      {/* Dismiss Button */}
      {dismissable && onDismiss && (
        <Button
          className="btn-ghost-linkedin"
          onClick={onDismiss}
          style={{ position: 'absolute', top: 16, right: 16 }}
        >
          <Cross2Icon width={16} height={16} />
        </Button>
      )}
    </Stack>
  </Card>
);

interface InlineMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  dismissable?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const InlineMessage: React.FC<InlineMessageProps> = ({
  type,
  message,
  dismissable = false,
  onDismiss,
  action,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircledIcon width={16} height={16} />;
      case 'error':
        return <ExclamationTriangleIcon width={16} height={16} />;
      case 'warning':
        return <ExclamationTriangleIcon width={16} height={16} />;
      case 'info':
        return <InfoCircledIcon width={16} height={16} />;
      default:
        return <InfoCircledIcon width={16} height={16} />;
    }
  };

  const getColorVar = () => {
    switch (type) {
      case 'success':
        return 'var(--success)';
      case 'error':
        return 'var(--destructive)';
      case 'warning':
        return 'var(--warning)';
      case 'info':
        return 'var(--info)';
      default:
        return 'var(--info)';
    }
  };

  return (
    <Alert
      variant="light"
      style={{
        borderColor: getColorVar(),
        backgroundColor: `${getColorVar()}15`,
      }}
      icon={getIcon()}
    >
      <Group justify="space-between" align="flex-start">
        <Text size="sm" style={{ flex: 1 }}>
          {message}
        </Text>
        
        <Group gap="sm">
          {action && (
            <Button
              className="btn-ghost-linkedin btn-sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          
          {dismissable && onDismiss && (
            <Button
              className="btn-ghost-linkedin"
              onClick={onDismiss}
              style={{ padding: 4 }}
            >
              <Cross2Icon width={14} height={14} />
            </Button>
          )}
        </Group>
      </Group>
    </Alert>
  );
};