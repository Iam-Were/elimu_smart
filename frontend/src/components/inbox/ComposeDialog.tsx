import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Lock, Star } from 'lucide-react';
import { toast } from 'sonner';
import { getParse } from '@/config/parse';
import { cn } from '@/lib/utils';

interface Counselor {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  rating: number;
  specialties: string[];
  isOnline: boolean;
}

interface ComposeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (conversationId: string) => void;
  isPremium: boolean;
}

export const ComposeDialog: React.FC<ComposeDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isPremium
}) => {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselorId, setSelectedCounselorId] = useState<string>('');
  const [message, setMessage] = useState('');

  // Load available counselors
  useEffect(() => {
    const loadCounselors = async () => {
      try {
        const Parse = await getParse();
        
        // Ensure current user is set in Parse SDK for cloud function auth
        const sessionToken = localStorage.getItem('parse-session-token');
        
        if (sessionToken && !Parse.User.current()) {
          console.log('🔄 Restoring Parse user session for cloud functions...');
          try {
            await Parse.User.become(sessionToken);
            console.log('✅ Parse user session restored');
          } catch (err) {
            console.warn('⚠️ Failed to restore user session:', err);
          }
        }
        
        const result = await Parse.Cloud.run('getAllCounselors');

        // Transform counselor data
        const counselorList: Counselor[] = result.counselors || [
          // Fallback demo data
          {
            id: 'counselor-1',
            name: 'Sarah Njeri',
            title: 'Senior Career Counselor',
            rating: 4.9,
            specialties: ['University Selection', 'KUCCPS Guidance'],
            isOnline: true
          },
          {
            id: 'counselor-2',
            name: 'James Mutua',
            title: 'Educational Psychologist',
            rating: 4.8,
            specialties: ['Academic Stress', 'Study Skills'],
            isOnline: false
          }
        ];

        setCounselors(counselorList);
        
        // Auto-select assigned counselor if available
        if (result.assignedCounselorId && counselorList.length > 0) {
          const assignedCounselor = counselorList.find(c => c.id === result.assignedCounselorId);
          if (assignedCounselor) {
            setSelectedCounselorId(result.assignedCounselorId);
          }
        }
      } catch (error) {
        console.error('Failed to load counselors:', error);
        toast.error('Failed to load counselors');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadCounselors();
    }
  }, [isOpen]);

  const selectedCounselor = counselors.find(c => c.id === selectedCounselorId);

  const handleSend = async () => {
    if (!selectedCounselorId || !message.trim()) {
      toast.error('Please select a counselor and write a message');
      return;
    }

    if (!isPremium) {
      toast.error('Premium feature - Upgrade to initiate conversations');
      return;
    }

    setSending(true);

    try {
      const Parse = await getParse();
      const user = await Parse.User.currentAsync();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create new chat room with both participants
      const chatRoomResult = await Parse.Cloud.run('createChatRoom', {
        participantIds: [user.id, selectedCounselorId],
        type: 'counseling',
        title: `Chat with ${selectedCounselor?.name}`
      });

      if (!chatRoomResult || !chatRoomResult.id) {
        throw new Error('Failed to create chat room');
      }

      // Send initial message
      const messageResult = await Parse.Cloud.run('sendMessage', {
        chatRoomId: chatRoomResult.id,
        message: message.trim(),
        messageType: 'text'
      });

      if (messageResult) {
        toast.success('Message sent successfully!');
        onSuccess(chatRoomResult.id);
        onClose();

        // Reset form
        setSelectedCounselorId('');
        setMessage('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  // Suggested conversation starters
  const suggestions = [
    "Hi! Can you help me understand my RIASEC results?",
    "I'm confused about which university course to pick",
    "What career options fit my subject combination?",
    "I need guidance for my KUCCPS application"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Start a conversation with a counselor to get personalized career guidance
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-3 text-sm text-gray-600">Loading counselors...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Counselor Selection */}
            <div>
              <Label htmlFor="counselor">
                Select Counselor <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedCounselorId} onValueChange={setSelectedCounselorId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Choose a counselor..." />
                </SelectTrigger>
                <SelectContent>
                  {counselors.map((counselor) => (
                    <SelectItem key={counselor.id} value={counselor.id}>
                      <div className="flex items-center gap-2">
                        <span>{counselor.name}</span>
                        <span className="text-xs text-gray-500">({counselor.title})</span>
                        {counselor.isOnline && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Online
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Counselor Details */}
            {selectedCounselor && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                    <AvatarImage src={selectedCounselor.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold">
                      {selectedCounselor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{selectedCounselor.name}</h4>
                      {selectedCounselor.isOnline && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Online</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{selectedCounselor.title}</p>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-semibold">{selectedCounselor.rating}</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2">
                      {selectedCounselor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Message Textarea */}
            <div>
              <Label htmlFor="message">
                Your Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder={selectedCounselor ? `Type your message to ${selectedCounselor.name}...` : "Select a counselor first..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                disabled={!selectedCounselorId}
                className="mt-1.5"
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length}/1000 characters
              </p>
            </div>

            {/* Suggested Starters */}
            {selectedCounselorId && message.length === 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Quick Start Ideas</Label>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className={cn(
                        "text-left text-sm p-3 rounded-lg border border-gray-200",
                        "hover:border-orange-500 hover:bg-orange-50 transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-orange-500"
                      )}
                      onClick={() => setMessage(suggestion)}
                    >
                      💡 {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
          {!isPremium && (
            <div className="flex-1 text-xs text-orange-600 bg-orange-50 rounded px-3 py-2 mb-2 sm:mb-0">
              <Lock className="inline h-3 w-3 mr-1" />
              Premium feature - Upgrade to send messages
            </div>
          )}

          <div className="flex gap-2 w-full sm:w-auto">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button
              onClick={isPremium ? handleSend : () => {
                toast.info('Upgrade to Premium to send messages');
                window.location.href = '/subscription';
              }}
              disabled={sending || !selectedCounselorId || !message.trim()}
              className={cn(
                "flex-1 sm:flex-none",
                isPremium ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-300"
              )}
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : isPremium ? (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Upgrade to Send
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
