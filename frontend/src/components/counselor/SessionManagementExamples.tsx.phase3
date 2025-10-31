import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
  User
} from 'lucide-react';
import { useSessionManagement } from '@/hooks/counselor/useSessionManagement';
import { useStudentManagement } from '@/hooks/counselor/useStudentManagement';

interface SessionActionsProps {
  sessionId: string;
  sessionStatus: string;
  studentId: string;
  studentName: string;
  onUpdate?: () => void;
}

/**
 * Session Actions Component
 * Demonstrates Phase 1 (Session Management) integration
 */
export const SessionActions: React.FC<SessionActionsProps> = ({
  sessionId,
  sessionStatus,
  studentId,
  studentName,
  onUpdate
}) => {
  const {
    confirmSession,
    cancelSession,
    completeSession,
    addSessionNotes,
    isLoading
  } = useSessionManagement();

  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleConfirm = async () => {
    try {
      await confirmSession(sessionId, `Confirmed session with ${studentName}`);
      onUpdate?.();
      alert('Session confirmed successfully!');
    } catch (error) {
      console.error('Failed to confirm session:', error);
    }
  };

  const handleCancel = async () => {
    const reason = prompt('Reason for cancellation:');
    if (!reason) return;

    try {
      await cancelSession(sessionId, reason);
      onUpdate?.();
      alert('Session cancelled successfully!');
    } catch (error) {
      console.error('Failed to cancel session:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeSession(sessionId, notes, {
        studentSatisfaction: 'positive',
        topicsDiscussed: ['Career Path', 'University Selection']
      });
      onUpdate?.();
      setNotes('');
      setShowNotes(false);
      alert('Session marked as completed!');
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  };

  const handleSaveNotes = async () => {
    try {
      await addSessionNotes({
        sessionId,
        notes,
        nextSteps: 'Follow up on university applications next week'
      });
      alert('Notes saved successfully!');
      setShowNotes(false);
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Session Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div>
          <Badge
            variant={
              sessionStatus === 'completed'
                ? 'default'
                : sessionStatus === 'confirmed'
                ? 'secondary'
                : 'outline'
            }
          >
            {sessionStatus}
          </Badge>
        </div>

        {/* Action Buttons */}
        {sessionStatus === 'pending' && (
          <div className="flex gap-2">
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}

        {sessionStatus === 'confirmed' && (
          <Button
            onClick={() => setShowNotes(true)}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            <FileText className="w-4 h-4 mr-2" />
            Complete Session
          </Button>
        )}

        {/* Notes Section */}
        {showNotes && (
          <div className="space-y-3 border-t pt-4">
            <label className="text-sm font-medium">Session Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter session notes, key takeaways, and next steps..."
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleComplete}
                disabled={isLoading || !notes}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                Complete & Save
              </Button>
              <Button
                onClick={handleSaveNotes}
                disabled={isLoading || !notes}
                variant="outline"
                className="flex-1"
              >
                Save Notes Only
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <p className="text-sm text-slate-500 text-center">Processing...</p>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Student Management Component
 * Demonstrates Phase 2 (Student Management) integration
 */
export const StudentManagementPanel: React.FC<{
  studentId: string;
  studentName: string;
  currentPriority?: string;
}> = ({ studentId, studentName, currentPriority = 'medium' }) => {
  const {
    updateStudentPriority,
    addStudentNote,
    getStudentAssessmentResults,
    flagAsUrgent,
    isLoading
  } = useStudentManagement();

  const [note, setNote] = useState('');
  const [assessments, setAssessments] = useState<any>(null);

  const handlePriorityChange = async (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    try {
      await updateStudentPriority({
        studentId,
        priority,
        reason: `Priority updated to ${priority} for ${studentName}`
      });
      alert(`Priority updated to ${priority}`);
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const handleFlagUrgent = async () => {
    const reason = prompt('Why is this student urgent?');
    if (!reason) return;

    try {
      await flagAsUrgent(studentId, reason);
      alert('Student flagged as urgent!');
    } catch (error) {
      console.error('Failed to flag as urgent:', error);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;

    try {
      await addStudentNote({
        studentId,
        note,
        isPrivate: true,
        tags: ['follow-up', 'counseling']
      });
      setNote('');
      alert('Note added successfully!');
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleViewAssessments = async () => {
    try {
      const results = await getStudentAssessmentResults(studentId);
      setAssessments(results);
    } catch (error) {
      console.error('Failed to get assessments:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Student Management: {studentName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Priority Management */}
        <div>
          <label className="text-sm font-medium mb-2 block">Priority Level</label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
              <Button
                key={priority}
                onClick={() => handlePriorityChange(priority)}
                disabled={isLoading}
                variant={currentPriority === priority ? 'default' : 'outline'}
                size="sm"
                className={
                  currentPriority === priority ? getPriorityColor(priority) : ''
                }
              >
                {priority}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleFlagUrgent}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Flag Urgent
          </Button>
          <Button
            onClick={handleViewAssessments}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Assessments
          </Button>
        </div>

        {/* Assessment Results */}
        {assessments && (
          <div className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900">
            <h4 className="font-semibold text-sm mb-2">Assessment Summary</h4>
            {assessments.summary && (
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Holland Code:</span>{' '}
                  {assessments.summary.hollandCode || 'Not completed'}
                </p>
                <p>
                  <span className="font-medium">Primary Type:</span>{' '}
                  {assessments.summary.primaryType || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Assessments Completed:</span>{' '}
                  {assessments.summary.assessmentsCompleted}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Add Note */}
        <div className="space-y-2 border-t pt-4">
          <label className="text-sm font-medium">Add Private Note</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter private notes about this student..."
            rows={3}
          />
          <Button
            onClick={handleAddNote}
            disabled={isLoading || !note.trim()}
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Save Note
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4 animate-spin" />
            Processing...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
