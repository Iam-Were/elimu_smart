import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getParse } from '@/config/parse';
import { Users, MessageSquare, Calendar, Clock } from 'lucide-react';

const CounselorConnect: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleStartChat = async () => {
    setIsConnecting(true);
    try {
      const Parse = getParse();
      // Uses Parse function: createChatRoom
      await Parse.Cloud.run('createChatRoom', {
        type: 'counselor_support',
        participants: ['student', 'counselor']
      });
    } catch (error) {
      console.error('Chat creation failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-50/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Note: H1 "Guidance Center" is provided by Sprint18Layout */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-orange-600 mb-2">Connect with a Counselor</h2>
          <p className="text-muted-foreground">Professional guidance for your career decisions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                Start Chat
                <Badge className="bg-green-100 text-green-700 text-xs">Available</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Instant messaging with qualified counselors
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Clock className="h-3 w-3" />
                Response within 5 minutes
              </div>
              <Button
                onClick={handleStartChat}
                disabled={isConnecting}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {isConnecting ? 'Connecting...' : 'Start Chat'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                Book Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                45-minute dedicated counseling session
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Clock className="h-3 w-3" />
                Next available: Today 3:00 PM
              </div>
              <Button variant="outline" className="w-full">
                Schedule Session
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              Available Counselors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {['Sarah Njoki', 'James Kimani', 'Maria Wanjiku'].map((name, i) => (
                <div key={i} className="text-center p-3 rounded border border-orange-100">
                  <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-semibold">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 className="font-medium text-sm">{name}</h4>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CounselorConnect;