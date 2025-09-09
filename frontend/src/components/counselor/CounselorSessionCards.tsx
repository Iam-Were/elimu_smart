import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Video,
  User,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  PlayCircle,
  FileText,
  MessageSquare
} from 'lucide-react';

interface CounselorSession {
  id: string;
  title: string;
  studentName: string;
  studentId: string;
  type: 'individual' | 'group' | 'workshop';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'high' | 'medium' | 'low';
  date: string;
  time: string;
  duration: number;
  location: 'virtual' | 'office' | 'conference-room';
  meetingLink?: string;
  notes?: string;
  objectives: string[];
  preparationNeeded: boolean;
}

const upcomingSessions: CounselorSession[] = [
  {
    id: 'session-001',
    title: 'Career Path Discussion',
    studentName: 'Sarah Mwangi',
    studentId: 'STU-2024-001',
    type: 'individual',
    status: 'scheduled',
    priority: 'high',
    date: 'Today',
    time: '2:30 PM',
    duration: 60,
    location: 'virtual',
    meetingLink: 'https://zoom.us/j/123456789',
    objectives: ['Review KCSE results', 'Discuss university options', 'Create action plan'],
    preparationNeeded: true
  },
  {
    id: 'session-002',
    title: 'Study Skills Workshop',
    studentName: 'Group A (12 students)',
    studentId: 'GROUP-A',
    type: 'workshop',
    status: 'scheduled',
    priority: 'medium',
    date: 'Tomorrow',
    time: '10:00 AM',
    duration: 90,
    location: 'conference-room',
    objectives: ['Time management', 'Note-taking techniques', 'Exam preparation'],
    preparationNeeded: true
  },
  {
    id: 'session-003',
    title: 'University Application Review',
    studentName: 'John Kiprop',
    studentId: 'STU-2024-045',
    type: 'individual',
    status: 'scheduled',
    priority: 'high',
    date: 'Today',
    time: '4:00 PM',
    duration: 45,
    location: 'office',
    objectives: ['Review application essays', 'Check required documents', 'Submit applications'],
    preparationNeeded: false
  },
  {
    id: 'session-004',
    title: 'Career Exploration Session',
    studentName: 'Grace Akinyi',
    studentId: 'STU-2024-023',
    type: 'individual',
    status: 'in-progress',
    priority: 'medium',
    date: 'Today',
    time: '1:00 PM',
    duration: 60,
    location: 'virtual',
    meetingLink: 'https://zoom.us/j/987654321',
    objectives: ['Complete career assessment', 'Explore engineering fields', 'Plan next steps'],
    preparationNeeded: false
  },
  {
    id: 'session-005',
    title: 'Group Counseling - Stress Management',
    studentName: 'Form 4 Students (8 students)',
    studentId: 'GROUP-FORM4',
    type: 'group',
    status: 'completed',
    priority: 'medium',
    date: 'Yesterday',
    time: '11:30 AM',
    duration: 75,
    location: 'conference-room',
    objectives: ['Stress identification', 'Coping strategies', 'Support systems'],
    preparationNeeded: false,
    notes: 'Excellent participation. Follow-up individual sessions needed for 3 students.'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'in-progress':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'completed':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    case 'cancelled':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'no-show':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'scheduled':
      return <Clock className="h-4 w-4" />;
    case 'in-progress':
      return <PlayCircle className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    case 'no-show':
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'individual':
      return <User className="h-5 w-5" />;
    case 'group':
      return <Users className="h-5 w-5" />;
    case 'workshop':
      return <FileText className="h-5 w-5" />;
    default:
      return <User className="h-5 w-5" />;
  }
};

const getLocationIcon = (location: string) => {
  switch (location) {
    case 'virtual':
      return <Video className="h-4 w-4" />;
    case 'office':
      return <MapPin className="h-4 w-4" />;
    case 'conference-room':
      return <Users className="h-4 w-4" />;
    default:
      return <MapPin className="h-4 w-4" />;
  }
};

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'ring-2 ring-red-200 bg-gradient-to-br from-red-50/30 to-white';
    case 'medium':
      return 'ring-1 ring-yellow-200 bg-gradient-to-br from-yellow-50/30 to-white';
    default:
      return 'ring-1 ring-gray-200 bg-white';
  }
};

interface CounselorSessionCardsProps {
  className?: string;
  statusFilter?: 'all' | 'scheduled' | 'in-progress' | 'completed';
  showNotes?: boolean;
}

export const CounselorSessionCards: React.FC<CounselorSessionCardsProps> = ({ 
  className,
  statusFilter = 'all',
  showNotes = true
}) => {
  const filteredSessions = statusFilter === 'all' 
    ? upcomingSessions 
    : upcomingSessions.filter(session => session.status === statusFilter);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-yellow-900">
          Counseling Sessions Management
        </h2>
        <p className="text-yellow-700">
          Manage your individual sessions, group counseling, and workshops
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">6</div>
            <div className="text-sm text-blue-600">Scheduled Today</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">1</div>
            <div className="text-sm text-green-600">In Progress</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">18.5</div>
            <div className="text-sm text-yellow-600">Weekly Average</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">94%</div>
            <div className="text-sm text-purple-600">Completion Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Session Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredSessions.map((session) => (
          <Card 
            key={session.id} 
            className={`hover:shadow-lg transition-all duration-200 ${getPriorityStyles(session.priority)}`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <div className="text-white">
                      {getTypeIcon(session.type)}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg text-yellow-900">{session.title}</CardTitle>
                    <p className="text-sm text-yellow-700 font-medium">{session.studentName}</p>
                    {session.preparationNeeded && (
                      <Badge variant="outline" className="mt-1 bg-orange-50 text-orange-700 border-orange-200">
                        Prep Needed
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(session.status)}>
                  {getStatusIcon(session.status)}
                  <span className="ml-1 capitalize">{session.status.replace('-', ' ')}</span>
                </Badge>
              </div>
              <CardDescription className="text-sm text-yellow-700">
                {session.type === 'individual' ? 'Individual Counseling' : 
                 session.type === 'group' ? 'Group Counseling' : 'Workshop Session'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Session Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-yellow-700">
                    <Calendar className="h-4 w-4" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-yellow-700">
                    <Clock className="h-4 w-4" />
                    <span>{session.time} ({session.duration} min)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-yellow-700">
                    {getLocationIcon(session.location)}
                    <span className="capitalize">{session.location.replace('-', ' ')}</span>
                  </div>
                  {session.priority === 'high' && (
                    <Badge variant="destructive">High Priority</Badge>
                  )}
                </div>
              </div>

              {/* Objectives */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Session Objectives</h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  {session.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600">•</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notes (for completed sessions) */}
              {showNotes && session.notes && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Session Notes</h4>
                  <p className="text-xs text-green-700">{session.notes}</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-2">
              {session.status === 'scheduled' && (
                <>
                  {session.meetingLink ? (
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      asChild
                    >
                      <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                        <Video className="mr-2 h-4 w-4" />
                        Join Meeting
                      </a>
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              {session.status === 'in-progress' && (
                <>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Continue Session
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </>
              )}

              {session.status === 'completed' && (
                <Button 
                  variant="outline"
                  className="flex-1"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Notes
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CounselorSessionCards;