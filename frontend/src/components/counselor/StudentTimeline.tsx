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
    switch (icon) {
      case 'user-plus':
        return <UserPlus className="w-5 h-5" />;
      case 'user-check':
        return <UserCheck className="w-5 h-5" />;
      case 'clipboard-check':
        return <ClipboardCheck className="w-5 h-5" />;
      case 'calendar':
        return <Calendar className="w-5 h-5" />;
      case 'check-circle':
        return <CheckCircle className="w-5 h-5" />;
      case 'trophy':
        return <Trophy className="w-5 h-5" />;
      case 'target':
        return <Target className="w-5 h-5" />;
      case 'file-text':
        return <FileText className="w-5 h-5" />;
      default:
        return <UserPlus className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'registration':
        return 'bg-blue-100 text-blue-600 border-blue-300';
      case 'assignment':
        return 'bg-yellow-100 text-yellow-600 border-yellow-300';
      case 'assessment':
        return 'bg-purple-100 text-purple-600 border-purple-300';
      case 'session':
        return 'bg-green-100 text-green-600 border-green-300';
      case 'milestone':
        return 'bg-orange-100 text-orange-600 border-orange-300';
      case 'note':
        return 'bg-gray-100 text-gray-600 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <div>
          <p className="font-medium text-red-800">Failed to load timeline</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
        <button
          onClick={refresh}
          className="ml-auto text-red-600 hover:text-red-700"
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
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              {i < 4 && <div className="w-0.5 h-16 bg-gray-200 mt-2" />}
            </div>
            <div className="flex-1 pb-8">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">No timeline events yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Student Journey</h3>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-6">
        {timeline.map((event, index) => (
          <div key={`${event.type}-${event.id}`} className="flex gap-4">
            {/* Timeline line and icon */}
            <div className="flex flex-col items-center">
              <div
                className={`p-2.5 rounded-full border-2 ${getEventColor(event.type)}`}
              >
                {getEventIcon(event.icon)}
              </div>
              {index < timeline.length - 1 && (
                <div className="w-0.5 h-full bg-gray-200 mt-2" />
              )}
            </div>

            {/* Event content */}
            <div className="flex-1 pb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 mb-1">{event.title}</h4>
                <p className="text-sm text-gray-500 mb-3">
                  {formatDate(event.timestamp)}
                </p>

                {/* Event-specific details */}
                {event.type === 'assessment' && event.hollandCode && (
                  <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded">
                    <p className="text-sm text-purple-800">
                      <strong>Holland Code:</strong> {event.hollandCode}
                    </p>
                    <p className="text-sm text-purple-800">
                      <strong>Primary Type:</strong> {event.primaryType}
                    </p>
                  </div>
                )}

                {event.type === 'session' && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-700">
                      <strong>Counselor:</strong> {event.counselorName}
                    </p>
                    {event.status && (
                      <p className="text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            event.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : event.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {event.status}
                        </span>
                      </p>
                    )}
                    {event.duration && (
                      <p className="text-sm text-gray-600">{event.duration} minutes</p>
                    )}
                  </div>
                )}

                {event.type === 'milestone' && (
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        event.achieved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {event.achieved ? '✓ Achieved' : 'In Progress'}
                    </span>
                    {event.category && (
                      <span className="ml-2 text-xs text-gray-600">
                        {event.category}
                      </span>
                    )}
                  </div>
                )}

                {event.type === 'note' && event.content && (
                  <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded">
                    <p className="text-sm text-gray-700 italic">{event.content}</p>
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
