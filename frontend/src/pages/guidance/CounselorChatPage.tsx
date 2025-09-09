import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Search, Users } from 'lucide-react';
import { ChatInterface } from '../../components/chat/ChatInterface';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';

const CounselorChatPage: React.FC = () => {
  const { user } = useAuth();
  const { createChatRoom, rooms } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');

  // Demo: Auto-create a counseling room if none exists
  useEffect(() => {
    const createDemoRoom = async () => {
      if (user && rooms.length === 0) {
        // Find a counselor to chat with (for demo purposes)
        // In production, this would be based on user selection
        try {
          await createChatRoom(
            ['aQDHKvIIz0'], // Counselor ID from our demo data
            'counseling', 
            'Career Guidance Session'
          );
        } catch (error) {
          console.error('Failed to create demo room:', error);
        }
      }
    };

    // Small delay to ensure chat hook is initialized
    setTimeout(createDemoRoom, 1000);
  }, [user, rooms.length, createChatRoom]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;

    try {
      await createChatRoom(
        ['aQDHKvIIz0'], // Demo counselor ID
        'counseling',
        newRoomTitle
      );
      setNewRoomTitle('');
      setShowCreateRoom(false);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Please log in to access chat.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-orange-500" />
              Chat with Counselor
            </h1>
            <p className="text-muted-foreground mt-1">
              Connect with professional counselors for personalized guidance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Button 
              onClick={() => setShowCreateRoom(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {rooms.filter(r => r.type === 'counseling').length}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Counselors</p>
                  <p className="text-2xl font-bold text-green-600">5</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="text-2xl font-bold text-blue-600">2m</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Fast
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Room Modal */}
        {showCreateRoom && (
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle>Start New Counseling Session</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <Input 
                    placeholder="Session title (e.g., Career Planning Discussion)"
                    value={newRoomTitle}
                    onChange={(e) => setNewRoomTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    Start Session
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowCreateRoom(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Chat Interface */}
        <ChatInterface type="counseling" />

        {/* Help Section */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <MessageSquare className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">
                  Getting the Most from Your Counseling Sessions
                </h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Be specific about your career concerns and goals</li>
                  <li>• Ask about university admission requirements and KUCCPS process</li>
                  <li>• Discuss your subject combinations and career alignment</li>
                  <li>• Request guidance on scholarship opportunities</li>
                  <li>• Share any family or academic pressure you're facing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CounselorChatPage;