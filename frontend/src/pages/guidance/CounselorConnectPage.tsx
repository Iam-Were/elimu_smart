import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Zap,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Mock data for counselors - Replace with Parse data later
interface Counselor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  isOnline: boolean;
  responseTime: string;
  specialties: string[];
  rating: number;
  totalSessions: number;
  nextAvailable: string;
  bio: string;
}

const mockCounselors: Counselor[] = [
  {
    id: '1',
    name: 'Ms. Grace Wanjiku',
    title: 'Senior Career Counselor',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c28c101b?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
    responseTime: '< 5 minutes',
    specialties: ['Career Planning', 'University Applications', 'STEM Careers'],
    rating: 4.9,
    totalSessions: 1247,
    nextAvailable: 'Available now',
    bio: 'Passionate about helping students discover their perfect career match. 8+ years experience with Kenyan education system.',
  },
  {
    id: '2', 
    name: 'Mr. David Kimani',
    title: 'Career Development Specialist',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isOnline: false,
    responseTime: '2-4 hours',
    specialties: ['Business Careers', 'Entrepreneurship', 'Finance'],
    rating: 4.8,
    totalSessions: 892,
    nextAvailable: 'Tomorrow 9:00 AM',
    bio: 'Former business executive turned counselor. Helps students navigate business and finance career paths.',
  },
  {
    id: '3',
    name: 'Dr. Mary Ochieng',
    title: 'Academic & Mental Health Counselor',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
    responseTime: '< 3 minutes',
    specialties: ['Academic Stress', 'Mental Health', 'Study Skills'],
    rating: 5.0,
    totalSessions: 2156,
    nextAvailable: 'Available now',
    bio: 'Licensed clinical psychologist specializing in student mental health and academic performance.',
  },
];

const CounselorConnectPage: React.FC = () => {

  const getOnlineStatusBadge = (isOnline: boolean) => {
    return isOnline ? (
      <Badge className="bg-green-500 text-white text-xs">
        <div className="w-2 h-2 rounded-full bg-white mr-1 animate-pulse"></div>
        Online Now
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        <Clock className="w-3 h-3 mr-1" />
        Offline
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Connect with Your Counselor
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose how you'd like to get help - instant chat for quick questions or book a session for deeper conversations
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-orange-200 hover:border-orange-300 transition-colors cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Instant Chat</CardTitle>
              <CardDescription>
                Get quick answers right now - perfect for urgent questions or when you need immediate support
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3">
                <div className="flex justify-center items-center gap-2 text-sm text-green-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Usually responds in under 5 minutes
                </div>
                <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4" />
                  Free and confidential
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Book a Session</CardTitle>
              <CardDescription>
                Schedule a deeper conversation - ideal for complex decisions or when you need more time
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3">
                <div className="flex justify-center items-center gap-2 text-sm text-blue-600 font-medium">
                  <Clock className="h-4 w-4" />
                  30-45 minute sessions
                </div>
                <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  Personalized guidance
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Counselors */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Available Counselors</h2>
            <Badge variant="outline" className="text-sm">
              {mockCounselors.filter(c => c.isOnline).length} online now
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockCounselors.map((counselor) => (
              <Card 
                key={counselor.id} 
                className={cn(
                  "hover:shadow-xl transition-all duration-300 cursor-pointer border-2",
                  counselor.isOnline 
                    ? "border-green-200 hover:border-green-300 shadow-green-100" 
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-orange-200">
                        <AvatarImage src={counselor.avatar} alt={counselor.name} />
                        <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                          {counselor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg leading-tight">{counselor.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{counselor.title}</p>
                      </div>
                    </div>
                    {getOnlineStatusBadge(counselor.isOnline)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                    {counselor.bio}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Specialties */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {counselor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {counselor.totalSessions} sessions
                    </div>
                    <div className="flex items-center gap-1">
                      ⭐ {counselor.rating}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response time:</span>
                      <span className="font-medium">{counselor.responseTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Next available:</span>
                      <span className="font-medium text-orange-600">{counselor.nextAvailable}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    {counselor.isOnline ? (
                      <Button 
                        asChild
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      >
                        <Link to="/guidance/chat-counselor" state={{ counselor }}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Start Chat Now
                        </Link>
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Currently Offline
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Information */}
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-orange-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-orange-800">
                Need Help Choosing?
              </h3>
              <p className="text-orange-700 max-w-2xl mx-auto">
                Not sure which counselor to choose? Start with whoever's online for a quick chat, 
                or book a session with the counselor whose specialties match your needs best.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-orange-700">
                  <MessageSquare className="h-4 w-4" />
                  All conversations are confidential
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-700">
                  <Heart className="h-4 w-4" />
                  Counselors are here to help, not judge
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-700">
                  <Zap className="h-4 w-4" />
                  All services are completely free
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CounselorConnectPage;