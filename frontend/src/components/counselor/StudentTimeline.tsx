import React from 'react';
import {
  UserPlus,
  UserCheck,
  ClipboardCheck,
  Calendar,
  CheckCircle,
  Trophy,
  Target,
  FileText,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useStudentTimeline } from '../../hooks/counselor/useStudentTimeline';
import { IconContainer } from '../ui/icon-container';
import type { IconTheme } from '../ui/icon-container';
import { Badge } from '../ui/badge';

interface StudentTimelineProps {
  studentId: string;
}

// Simple date formatter
const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const StudentTimeline: React.FC<StudentTimelineProps> = ({ studentId }) => {
  const { timeline, isLoading, error, refresh } = useStudentTimeline(studentId);

  const getEventIcon = (icon: string) => {
    const iconMap: Record<string, any> = {
      'user-plus': UserPlus,
      'user-check': UserCheck,
      'clipboard-check': ClipboardCheck,
      'calendar': Calendar,
      'check-circle': CheckCircle,
      'trophy': Trophy,
      'target': Target,
      'file-text': FileText,
    };
    return iconMap[icon] || UserPlus;
  };

  const getEventTheme = (type: string): IconTheme => {
    switch (type) {
      case 'registration':
        return 'neutral'; // Blue for resources/info
      case 'assignment':
        return 'counselor'; // Yellow for counselor actions
      case 'assessment':
        return 'student'; // Purple (will override to purple in IconContainer)
      case 'session':
        return 'neutral'; // Will use green via custom class
      case 'milestone':
        return 'student'; // Orange for student journey
      case 'note':
        return 'neutral'; // Gray for notes
      default:
        return 'neutral';
    }
  };

  const getEventCustomClass = (type: string) => {
    // Override for assessment (purple) and session (green)
    switch (type) {
      case 'assessment':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case 'session':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      default:
        return '';
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        <div>
          <p className="font-medium text-red-800 dark:text-red-200">Failed to load timeline</p>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
        <button
          onClick={refresh}
          className="ml-auto text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          aria-label="Retry loading timeline"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    );
  }

  if (isLoading && timeline.length === 0) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
              {i < 4 && <div className="w-0.5 h-16 bg-slate-200 dark:bg-slate-700 mt-2" />}
            </div>
            <div className="flex-1 pb-8">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
        <p className="text-slate-500 dark:text-slate-400">No timeline events yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Student Journey</h3>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 transition-colors"
          title="Refresh"
          aria-label="Refresh student timeline"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-6">
        {timeline.map((event, index) => (
          <div key={`${event.type}-${event.id}`} className="flex gap-4">
            {/* Timeline line and icon */}
            <div className="flex flex-col items-center">
              <IconContainer
                icon={getEventIcon(event.icon)}
                emphasis="medium"
                theme={getEventTheme(event.type)}
                size="md"
                className={getEventCustomClass(event.type)}
              />
              {index < timeline.length - 1 && (
                <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 mt-2" />
              )}
            </div>

            {/* Event content */}
            <div className="flex-1 pb-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-700/30 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">{event.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {formatDate(event.timestamp)}
                </p>

                {/* Event-specific details */}
                {event.type === 'assessment' && event.hollandCode && (
                  <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/30 rounded">
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      <strong>Holland Code:</strong> {event.hollandCode}
                    </p>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      <strong>Primary Type:</strong> {event.primaryType}
                    </p>
                  </div>
                )}

                {event.type === 'session' && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      <strong>Counselor:</strong> {event.counselorName}
                    </p>
                    {event.status && (
                      <Badge
                        variant={
                          event.status === 'completed'
                            ? 'default'
                            : event.status === 'cancelled'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-xs"
                      >
                        {event.status}
                      </Badge>
                    )}
                    {event.duration && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">{event.duration} minutes</p>
                    )}
                  </div>
                )}

                {event.type === 'milestone' && (
                  <div className="mt-2">
                    <Badge
                      variant={event.achieved ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {event.achieved ? '✓ Achieved' : 'In Progress'}
                    </Badge>
                    {event.category && (
                      <span className="ml-2 text-xs text-slate-600 dark:text-slate-400">
                        {event.category}
                      </span>
                    )}
                  </div>
                )}

                {event.type === 'note' && event.content && (
                  <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
                    <p className="text-sm text-slate-700 dark:text-slate-200 italic">{event.content}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
