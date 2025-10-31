import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
  User
} from 'lucide-react';
import { toast } from 'sonner';
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
 * Demonstrates Phase 3/4 (Session Management) integration with shadcn V2
 */
export const SessionActions = ({
  sessionId,
  sessionStatus,
  studentName,
  onUpdate
}: SessionActionsProps) => {
  const {
    confirmSession,
    cancelSession,
    completeSession,
    addSessionNotes,
    isLoading
  } = useSessionManagement();

  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleConfirm = async () => {
    try {
      await confirmSession(sessionId, `Confirmed session with ${studentName}`);
      onUpdate?.();
      toast.success('Session confirmed successfully!');
    } catch {
      toast.error('Failed to confirm session');
    }
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      await cancelSession(sessionId, cancelReason);
      onUpdate?.();
      setShowCancelDialog(false);
      setCancelReason('');
      toast.success('Session cancelled successfully');
    } catch {
      toast.error('Failed to cancel session');
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
      toast.success('Session marked as completed!');
    } catch {
      toast.error('Failed to complete session');
    }
  };

  const handleSaveNotes = async () => {
    try {
      await addSessionNotes({
        sessionId,
        notes,
        nextSteps: 'Follow up on university applications next week'
      });
      toast.success('Notes saved successfully!');
      setShowNotes(false);
    } catch {
      toast.error('Failed to save notes');
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
              onClick={() => setShowCancelDialog(true)}
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
          <p className="text-sm text-muted-foreground text-center">Processing...</p>
        )}
      </CardContent>

      {/* Cancel Session Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Session</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this session with {studentName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Cancellation Reason</Label>
              <Textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g., Student requested reschedule, Emergency conflict..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelDialog(false);
                setCancelReason('');
              }}
            >
              Nevermind
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubmit}
              disabled={!cancelReason.trim()}
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

/**
 * Student Management Component
 * Demonstrates Phase 3/4 (Student Management) integration with shadcn V2
 */
export const StudentManagementPanel = ({
  studentId,
  studentName,
  currentPriority = 'medium'
}: {
  studentId: string;
  studentName: string;
  currentPriority?: string;
}) => {
  const {
    updateStudentPriority,
    addStudentNote,
    getStudentAssessmentResults,
    flagAsUrgent,
    isLoading
  } = useStudentManagement();

  const [note, setNote] = useState('');
  const [assessments, setAssessments] = useState<unknown>(null);

  const handlePriorityChange = async (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    try {
      await updateStudentPriority({
        studentId,
        priority,
        reason: `Priority updated to ${priority} for ${studentName}`
      });
      toast.success(`Priority updated to ${priority}`);
    } catch {
      toast.error('Failed to update priority');
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
      toast.success('Note added successfully!');
    } catch {
      toast.error('Failed to add note');
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
