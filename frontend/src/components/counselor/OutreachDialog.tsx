import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Loader2, AlertCircle } from 'lucide-react';

interface OutreachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    careerInterest?: string;
    assessmentCount: number;
  } | null;
  counselorName: string;
  onSend: (studentId: string, message: string) => Promise<void>;
}

export const OutreachDialog: React.FC<OutreachDialogProps> = ({
  open,
  onOpenChange,
  student,
  counselorName,
  onSend,
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && student) {
      // Generate personalized intro message
      let intro = `Hi ${student.firstName},\n\n`;
      intro += `I'm ${counselorName}, a career counselor here at Elimu Smart. `;

      if (student.careerInterest) {
        intro += `I noticed you're interested in ${student.careerInterest} careers. `;
      }

      if (student.assessmentCount === 0) {
        intro += `I'd love to help you explore career options and get started with some assessments. `;
      } else if (student.assessmentCount > 0) {
        intro += `I saw you've completed ${student.assessmentCount} ${student.assessmentCount === 1 ? 'assessment' : 'assessments'}! I'd love to discuss your results and help you with next steps. `;
      }

      intro += `\n\nFeel free to reach out if you have any questions about:\n`;
      intro += `• Career exploration and planning\n`;
      intro += `• KUCCPS university selection\n`;
      intro += `• Subject combinations for your career goals\n`;
      intro += `• Scholarship opportunities\n\n`;
      intro += `Looking forward to connecting!\n\n`;
      intro += `Best regards,\n${counselorName}`;

      setMessage(intro);
      setError(null);
    }
  }, [open, student, counselorName]);

  const handleSend = async () => {
    if (!student || !message.trim()) return;

    setSending(true);
    setError(null);

    try {
      await onSend(student.id, message.trim());
      onOpenChange(false);
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-yellow-600" />
            Reach Out to {student.firstName} {student.lastName}
          </DialogTitle>
          <DialogDescription>
            Send an introduction message to start a conversation. The student will receive a
            notification and can reply directly in their inbox.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Introduction Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your introduction message..."
              className="min-h-[400px] resize-none font-sans"
              disabled={sending}
            />
            <p className="text-sm text-gray-500">
              Tip: Be friendly and specific about how you can help. Students appreciate
              personalized outreach!
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Introduction
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
