import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getParse } from '@/config/parse';
import {
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  VideoIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons';

interface Session {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentGrade: string;
  title: string;
  description: string;
  type: 'individual' | 'group' | 'virtual' | 'phone';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledAt: Date;
  duration: number; // minutes
  location: string;
  notes: string;
  outcomes: string[];
  nextSteps: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for sessions
const mockSessions: Session[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Sarah Wilson',
    studentEmail: 'sarah.wilson@school.edu',
    studentGrade: 'Form 4',
    title: 'Career Guidance - Engineering vs Medicine',
    description: 'Discuss career options, requirements, and help student make informed decision',
    type: 'individual',
    status: 'scheduled',
    scheduledAt: new Date('2024-01-19T14:00:00'),
    duration: 60,
    location: 'Counseling Office Room 201',
    notes: 'Student is torn between engineering and medicine. Prepare KUCCPS requirements for both fields.',
    outcomes: [],
    nextSteps: [],
    createdAt: new Date('2024-01-18T10:30:00'),
    updatedAt: new Date('2024-01-18T10:30:00'),
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'David Brown',
    studentEmail: 'david.brown@school.edu',
    studentGrade: 'Form 3',
    title: 'Business Career Planning Session',
    description: 'Explore business career options and university programs',
    type: 'virtual',
    status: 'scheduled',
    scheduledAt: new Date('2024-01-20T10:00:00'),
    duration: 45,
    location: 'Zoom Meeting',
    notes: 'Student interested in entrepreneurship. Discuss business programs and practical experience opportunities.',
    outcomes: [],
    nextSteps: [],
    createdAt: new Date('2024-01-17T14:20:00'),
    updatedAt: new Date('2024-01-17T14:20:00'),
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Lisa Chen',
    studentEmail: 'lisa.chen@school.edu',
    studentGrade: 'Form 4',
    title: 'Medical School Application Review',
    description: 'Review university applications and prepare for interviews',
    type: 'individual',
    status: 'completed',
    scheduledAt: new Date('2024-01-17T11:00:00'),
    duration: 90,
    location: 'Counseling Office Room 201',
    notes: 'Reviewed application essays and practiced interview questions.',
    outcomes: [
      'Improved personal statement',
      'Gained confidence in interview skills',
      'Clarified university preferences'
    ],
    nextSteps: [
      'Submit university applications by February 1st',
      'Schedule mock interview sessions',
      'Research scholarship opportunities'
    ],
    createdAt: new Date('2024-01-16T09:15:00'),
    updatedAt: new Date('2024-01-17T12:30:00'),
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'John Doe',
    studentEmail: 'john.doe@school.edu',
    studentGrade: 'Form 2',
    title: 'Sports Career Exploration',
    description: 'Discuss professional sports career possibilities and alternatives',
    type: 'individual',
    status: 'scheduled',
    scheduledAt: new Date('2024-01-21T15:30:00'),
    duration: 45,
    location: 'Counseling Office Room 203',
    notes: 'Student passionate about football. Need to discuss realistic expectations and backup plans.',
    outcomes: [],
    nextSteps: [],
    createdAt: new Date('2024-01-15T16:45:00'),
    updatedAt: new Date('2024-01-15T16:45:00'),
  },
];

export const SessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    studentName: '',
    title: '',
    description: '',
    type: 'individual',
    scheduledDate: new Date(),
    scheduledTime: '10:00',
    duration: 60,
    location: '',
    notes: '',
  });

  // Fetch sessions from database
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const Parse = await getParse();
        const result = await Parse.Cloud.run('getPendingSessionRequests');

        if (result.success) {
          // Transform backend data to match frontend interface
          const transformedSessions = result.sessions.map((s: {
            id: string;
            studentId: string;
            studentName: string;
            sessionType: string;
            status: string;
            scheduledAt: string;
            topic: string;
            duration: number;
          }) => ({
            id: s.id,
            studentId: s.studentId,
            studentName: s.studentName,
            studentEmail: `${s.studentName.toLowerCase().replace(' ', '.')}@school.edu`,
            studentGrade: 'Form 4',
            title: s.topic || 'Career Counseling Session',
            description: s.topic || 'Counseling session',
            type: s.sessionType === 'career' ? 'individual' : s.sessionType as Session['type'],
            status: s.status as Session['status'],
            scheduledAt: new Date(s.scheduledAt),
            duration: s.duration || 60,
            location: 'Counseling Office',
            notes: '',
            outcomes: [],
            nextSteps: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
          setSessions(transformedSessions);
        } else {
          console.warn('Failed to fetch sessions:', result.error);
          setSessions(mockSessions);
        }
      } catch (error) {
        console.warn('Error fetching sessions, using mock data:', error);
        setSessions(mockSessions);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesStatus = !filterStatus || session.status === filterStatus;
    const matchesType = !filterType || session.type === filterType;
    return matchesStatus && matchesType;
  });

  const handleOpenForm = (session?: Session) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        studentName: session.studentName,
        title: session.title,
        description: session.description,
        type: session.type,
        scheduledDate: session.scheduledAt,
        scheduledTime: session.scheduledAt.toTimeString().slice(0, 5),
        duration: session.duration,
        location: session.location,
        notes: session.notes,
      });
    } else {
      setEditingSession(null);
      setFormData({
        studentName: '',
        title: '',
        description: '',
        type: 'individual',
        scheduledDate: new Date(),
        scheduledTime: '10:00',
        duration: 60,
        location: '',
        notes: '',
      });
    }
    open();
  };

  const handleSaveSession = () => {
    const [hours, minutes] = formData.scheduledTime.split(':').map(Number);
    const scheduledAt = new Date(formData.scheduledDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    if (editingSession) {
      // Update existing session
      const updatedSessions = sessions.map(s =>
        s.id === editingSession.id
          ? {
              ...s,
              title: formData.title,
              description: formData.description,
              type: formData.type as Session['type'],
              scheduledAt,
              duration: formData.duration,
              location: formData.location,
              notes: formData.notes,
              updatedAt: new Date(),
            }
          : s
      );
      setSessions(updatedSessions);
    } else {
      // Create new session
      const newSession: Session = {
        id: Date.now().toString(),
        studentId: '1', // In real app, this would be selected
        studentName: formData.studentName,
        studentEmail: 'student@school.edu',
        studentGrade: 'Form 4',
        title: formData.title,
        description: formData.description,
        type: formData.type as Session['type'],
        status: 'scheduled',
        scheduledAt,
        duration: formData.duration,
        location: formData.location,
        notes: formData.notes,
        outcomes: [],
        nextSteps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSessions([...sessions, newSession]);
    }
    close();
  };

  const handleCompleteSession = (sessionId: string) => {
    // In a real app, this would open a completion form
    const updatedSessions = sessions.map(s =>
      s.id === sessionId
        ? { ...s, status: 'completed' as const, updatedAt: new Date() }
        : s
    );
    setSessions(updatedSessions);
  };

  const handleCancelSession = (sessionId: string) => {
    const updatedSessions = sessions.map(s =>
      s.id === sessionId
        ? { ...s, status: 'cancelled' as const, updatedAt: new Date() }
        : s
    );
    setSessions(updatedSessions);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSessionsByStatus = (status: string) => {
    return sessions.filter(s => s.status === status).length;
  };

  const getTodaySessions = () => {
    const today = new Date();
    return sessions.filter(s => {
      const sessionDate = new Date(s.scheduledAt);
      return sessionDate.toDateString() === today.toDateString() && s.status === 'scheduled';
    });
  };


  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Session Management
            </h1>
            <p className="text-lg text-muted-foreground">
              Schedule and manage counseling sessions with students
            </p>
          </div>
          <Button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Schedule Session
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xs text-muted-foreground">Today's Sessions</p>
              <h2 className="text-2xl font-bold text-primary">
                {getTodaySessions().length}
              </h2>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xs text-muted-foreground">Scheduled</p>
              <h2 className="text-2xl font-bold text-primary">
                {getSessionsByStatus('scheduled')}
              </h2>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xs text-muted-foreground">Completed</p>
              <h2 className="text-2xl font-bold text-primary">
                {getSessionsByStatus('completed')}
              </h2>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xs text-muted-foreground">This Week</p>
              <h2 className="text-2xl font-bold text-primary">
                {sessions.filter(s => {
                  const sessionDate = new Date(s.scheduledAt);
                  const today = new Date();
                  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                  const weekEnd = new Date(today.setDate(today.getDate() + 6));
                  return sessionDate >= weekStart && sessionDate <= weekEnd;
                }).length}
              </h2>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex gap-4">
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger className="min-w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="min-w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Today's Sessions Alert */}
        {getTodaySessions().length > 0 && (
          <Alert>
            <CalendarIcon className="h-4 w-4" />
            <AlertTitle>You have {getTodaySessions().length} session(s) scheduled for today</AlertTitle>
            <AlertDescription>
              <div className="space-y-1">
                {getTodaySessions().map(session => (
                  <p key={session.id} className="text-sm">
                    • {formatTime(session.scheduledAt)} - {session.studentName} ({session.title})
                  </p>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Loading sessions...</p>
          </Card>
        )}

        {/* Sessions List */}
        {!loading && (
          <div className="space-y-4">
            {filteredSessions.length === 0 ? (
              <Alert>
                <CalendarIcon className="h-4 w-4" />
                <AlertTitle>No sessions found</AlertTitle>
                <AlertDescription>
                  {sessions.length === 0
                    ? 'No sessions scheduled yet. Click "Schedule Session" to create one.'
                    : 'No sessions match your current filters. Try adjusting your search criteria.'}
                </AlertDescription>
              </Alert>
            ) : (
              filteredSessions.map(session => (
              <Card
                key={session.id}
                className="hover:shadow-md transition-shadow"
              >
                <div className="p-6 space-y-4">
                  {/* Session Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {session.studentName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{session.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{session.studentName} • {session.studentGrade}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {session.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={session.status === 'scheduled' ? 'default' : 'secondary'}
                      >
                        {session.status}
                      </Badge>
                      <Badge variant="outline">
                        {session.type}
                      </Badge>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(session.scheduledAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{formatTime(session.scheduledAt)} ({session.duration}min)</span>
                      </div>
                      {session.location && (
                        <div className="flex items-center gap-1">
                          <VideoIcon className="h-4 w-4" />
                          <span className="truncate max-w-[200px]">{session.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {session.status === 'scheduled' && (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCompleteSession(session.id)}
                                >
                                  <CheckCircledIcon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Mark as Complete</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleOpenForm(session)}
                                >
                                  <Pencil1Icon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Session</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCancelSession(session.id)}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Cancel Session</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
            )}
          </div>
        )}

        {/* Session Form Modal */}
        <Dialog open={opened} onOpenChange={(open) => !open && close()}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSession ? 'Edit Session' : 'Schedule New Session'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter student name"
                value={formData.studentName}
                onChange={e => setFormData({ ...formData, studentName: e.target.value })}
              />
              
              <Input
                placeholder="Enter session title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              
              <Textarea
                placeholder="Enter session description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={formData.type}
                  onValueChange={value => setFormData({ ...formData, type: value || 'individual' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Session Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={formData.duration.toString()}
                  onValueChange={value => setFormData({ ...formData, duration: parseInt(value || '60') })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={formData.scheduledDate.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: new Date(e.target.value) })}
                />
                
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, scheduledTime: e.target.value })}
                />
              </div>
              
              <Input
                placeholder="Enter location or meeting link"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
              
              <Textarea
                placeholder="Enter any additional notes"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={close}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSession}>
                  {editingSession ? 'Update Session' : 'Schedule Session'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};