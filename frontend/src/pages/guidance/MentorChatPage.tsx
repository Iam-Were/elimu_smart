import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass } from 'lucide-react';

const MentorChatPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Message Your Mentor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <Compass className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mentor Messaging Coming Soon</h3>
            <p className="text-muted-foreground">
              This feature will be implemented with Parse integration for mentor communication.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorChatPage;