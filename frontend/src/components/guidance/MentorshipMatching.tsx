import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { getParse } from '@/config/parse';
import { Compass, Star, MessageSquare, ArrowRight } from 'lucide-react';

const MentorshipMatching: React.FC = () => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestMentorship = async (mentorId: string) => {
    setIsRequesting(true);
    try {
      const Parse = getParse();
      // Uses Parse function: sendMessage (mentor request)
      await Parse.Cloud.run('sendMessage', {
        roomId: `mentor_request_${mentorId}`,
        content: 'I would like to request mentorship',
        type: 'mentor_request'
      });
    } catch (error) {
      console.error('Mentorship request failed:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const mentors = [
    {
      id: '1',
      name: 'Peter Mwangi',
      career: 'Software Engineer',
      company: 'Safaricom',
      rating: 4.9,
      mentees: 23
    },
    {
      id: '2',
      name: 'Grace Nyambura',
      career: 'Marketing Manager',
      company: 'Equity Bank',
      rating: 4.8,
      mentees: 18
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-50/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">Find Your Career Mentor</h1>
          <p className="text-muted-foreground">Connect with working professionals</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="border-orange-200">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{mentor.name}</CardTitle>
                    <p className="text-orange-600 font-medium">{mentor.career}</p>
                    <p className="text-sm text-muted-foreground">{mentor.company}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{mentor.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{mentor.mentees} mentees</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button
                    onClick={() => handleRequestMentorship(mentor.id)}
                    disabled={isRequesting}
                    size="sm"
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    {isRequesting ? 'Requesting...' : 'Request Mentorship'}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-orange-600" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2 text-orange-600 font-bold">1</div>
                <h4 className="font-medium">Choose Mentor</h4>
                <p className="text-sm text-muted-foreground">Select a professional in your field of interest</p>
              </div>
              <div>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2 text-orange-600 font-bold">2</div>
                <h4 className="font-medium">Get Matched</h4>
                <p className="text-sm text-muted-foreground">Complete profile and wait for mentor approval</p>
              </div>
              <div>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2 text-orange-600 font-bold">3</div>
                <h4 className="font-medium">Start Learning</h4>
                <p className="text-sm text-muted-foreground">Monthly calls and ongoing guidance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentorshipMatching;