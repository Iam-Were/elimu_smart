import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, DollarSign, Video } from 'lucide-react';
import Parse from 'parse';
import { MpesaPaymentDialog } from '../payment/MpesaPaymentDialog';

interface SessionType {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  isActive: boolean;
}

interface BookingModalProps {
  counselorId: string;
  counselorName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  counselorId,
  counselorName,
  isOpen,
  onClose
}) => {
  const [loading, setLoading] = useState(true);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [calUsername, setCalUsername] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);

  useEffect(() => {
    if (isOpen && counselorId) {
      loadCounselorSettings();
    }
  }, [isOpen, counselorId]);

  const loadCounselorSettings = async () => {
    setLoading(true);
    try {
      const counselorQuery = new Parse.Query(Parse.User);
      const counselor = await counselorQuery.get(counselorId);

      const calUsernameStored = counselor.get('calUsername');
      const sessionTypesStored = counselor.get('sessionTypes') || [];

      setCalUsername(calUsernameStored);
      setSessionTypes(sessionTypesStored.filter((s: SessionType) => s.isActive));
    } catch (error) {
      console.error('Failed to load counselor settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = (session: SessionType) => {
    if (session.price === 0) {
      // Free session - direct to Cal.com
      if (calUsername) {
        const eventType = session.duration === 30 ? '30min' : '60min';
        window.open(`https://cal.com/${calUsername}/${eventType}`, '_blank');
      }
    } else {
      // Paid session - show M-Pesa payment dialog
      setSelectedSession(session);
      setShowPaymentDialog(true);
    }
  };

  const handlePaymentSuccess = () => {
    // After successful payment, redirect to Cal.com to book time slot
    setShowPaymentDialog(false);
    
    if (calUsername && selectedSession) {
      const eventType = selectedSession.duration === 30 ? '30min' : '60min';
      window.open(`https://cal.com/${calUsername}/${eventType}`, '_blank');
    }
    
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book a Session with {counselorName}</DialogTitle>
            <DialogDescription>
              Choose a session type that fits your needs
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
          ) : !calUsername ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                This counselor hasn't set up their calendar yet.
              </p>
              <p className="text-sm">
                You can still send them a message to coordinate a session manually.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessionTypes.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No active session types available.
                  </p>
                </div>
              ) : (
                sessionTypes.map((session) => (
                  <Card key={session.id} className="border-2 hover:border-orange-500 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{session.name}</h3>
                            {session.price === 0 && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Free
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-4">
                            {session.description}
                          </p>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{session.duration} minutes</span>
                            </div>

                            <Separator orientation="vertical" className="h-4" />

                            <div className="flex items-center gap-1 text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              <span>
                                {session.price === 0 ? 'Free' : `KES ${session.price.toLocaleString()}`}
                              </span>
                            </div>

                            <Separator orientation="vertical" className="h-4" />

                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Video className="h-4 w-4" />
                              <span>Video call</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleBookSession(session)}
                          className="ml-4"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Powered by Cal.com - You'll be redirected to select a time slot
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* M-Pesa Payment Dialog */}
      {selectedSession && (
        <MpesaPaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          onSuccess={handlePaymentSuccess}
          amount={selectedSession.price}
          sessionName={selectedSession.name}
          counselorName={counselorName}
          counselorId={counselorId}
          sessionId={selectedSession.id}
        />
      )}
    </>
  );
};
