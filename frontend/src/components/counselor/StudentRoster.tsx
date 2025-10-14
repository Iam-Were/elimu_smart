import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { getParse } from '@/config/parse';
import {
  MagnifyingGlassIcon,
  PersonIcon,
  ChatBubbleIcon,
  CalendarIcon,
  Pencil1Icon,
  EyeOpenIcon,
  StarIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  school: string;
  assignedDate: string;
  lastInteraction: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'on-hold';
  profileCompletion: number;
  assessmentsCompleted: number;
  totalAssessments: number;
  careerMatches: number;
  notes: string;
  interests: string[];
  topCareers: string[];
}

// Mock data for students
const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@school.edu',
    grade: 'Form 4',
    school: 'Nairobi High School',
    assignedDate: '2024-01-15',
    lastInteraction: '2024-01-18',
    priority: 'high',
    status: 'active',
    profileCompletion: 85,
    assessmentsCompleted: 3,
    totalAssessments: 4,
    careerMatches: 15,
    notes: 'Interested in STEM careers, particularly engineering. Needs guidance on university applications.',
    interests: ['Mathematics', 'Physics', 'Technology'],
    topCareers: ['Software Engineer', 'Civil Engineer', 'Data Scientist'],
  },
  {
    id: '2',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@school.edu',
    grade: 'Form 3',
    school: 'Mombasa Secondary',
    assignedDate: '2024-01-10',
    lastInteraction: '2024-01-17',
    priority: 'medium',
    status: 'active',
    profileCompletion: 60,
    assessmentsCompleted: 2,
    totalAssessments: 4,
    careerMatches: 8,
    notes: 'Exploring business and commerce careers. Good leadership potential.',
    interests: ['Business', 'Leadership', 'Communication'],
    topCareers: ['Business Manager', 'Marketing Specialist', 'Entrepreneur'],
  },
  {
    id: '3',
    firstName: 'Lisa',
    lastName: 'Chen',
    email: 'lisa.chen@school.edu',
    grade: 'Form 4',
    school: 'Kisumu Girls School',
    assignedDate: '2024-01-08',
    lastInteraction: '2024-01-16',
    priority: 'low',
    status: 'completed',
    profileCompletion: 100,
    assessmentsCompleted: 4,
    totalAssessments: 4,
    careerMatches: 20,
    notes: 'Successfully completed career planning. Ready for university applications.',
    interests: ['Healthcare', 'Biology', 'Community Service'],
    topCareers: ['Doctor', 'Nurse', 'Public Health Officer'],
  },
  {
    id: '4',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@school.edu',
    grade: 'Form 2',
    school: 'Eldoret Boys High',
    assignedDate: '2024-01-20',
    lastInteraction: '2024-01-20',
    priority: 'medium',
    status: 'active',
    profileCompletion: 30,
    assessmentsCompleted: 1,
    totalAssessments: 4,
    careerMatches: 5,
    notes: 'New student, just started career exploration journey.',
    interests: ['Sports', 'Physical Education'],
    topCareers: ['Sports Coach', 'Physical Therapist', 'Fitness Trainer'],
  },
];

export const StudentRoster: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [opened, setOpened] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Fetch assigned students from database
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const Parse = getParse();
        const result = await Parse.Cloud.run('getAssignedStudents');

        if (result.success) {
          setStudents(result.students);
        } else {
          console.warn('Failed to fetch students:', result.error);
          // Fallback to mock data
          setStudents(mockStudents);
        }
      } catch (error) {
        console.warn('Error fetching students, using mock data:', error);
        setStudents(mockStudents);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.school.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || student.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setNewNote('');
    setOpened(true);
  };

  const handleAddNote = () => {
    if (selectedStudent && newNote.trim()) {
      // In a real app, this would update the database
      console.log(`Adding note for ${selectedStudent.firstName}: ${newNote}`);
      setNewNote('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">
              Student Management
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage and track your assigned students
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {filteredStudents.length} Students
          </Badge>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary" className="w-full">
                <PersonIcon className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Loading students...</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && filteredStudents.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center space-y-2">
              <PersonIcon className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No students assigned yet</p>
            </CardContent>
          </Card>
        )}

        {/* Students Grid */}
        {!loading && filteredStudents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Student Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {student.firstName[0]}{student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {student.grade} • {student.school}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={student.priority === 'high' ? 'destructive' : 
                                student.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {student.priority}
                      </Badge>
                      <Badge
                        variant={student.status === 'active' ? 'default' : 
                                student.status === 'completed' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {student.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Profile Completion</span>
                      <span className="text-xs font-medium text-primary">
                        {student.profileCompletion}%
                      </span>
                    </div>
                    <Progress value={student.profileCompletion} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center space-y-1">
                      <p className="text-xs text-muted-foreground">Assessments</p>
                      <p className="font-medium text-sm text-primary">
                        {student.assessmentsCompleted}/{student.totalAssessments}
                      </p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs text-muted-foreground">Career Matches</p>
                      <p className="font-medium text-sm text-primary">
                        {student.careerMatches}
                      </p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs text-muted-foreground">Last Contact</p>
                      <p className="font-medium text-xs text-primary">
                        {formatDate(student.lastInteraction)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewStudent(student)}
                          >
                            <EyeOpenIcon className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm">
                            <ChatBubbleIcon className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send Message</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm">
                            <CalendarIcon className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Schedule Session</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Pencil1Icon className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add Note</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {student.priority === 'high' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <ExclamationTriangleIcon className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>High Priority Student</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Student Detail Modal */}
        <Dialog open={opened} onOpenChange={setOpened}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedStudent
                  ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
                  : 'Student Details'}
              </DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-6">
                {/* Student Info */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-medium">
                        {selectedStudent.firstName} {selectedStudent.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedStudent.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedStudent.grade} • {selectedStudent.school}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={selectedStudent.priority === 'high' ? 'destructive' : 'secondary'}>
                      {selectedStudent.priority} priority
                    </Badge>
                    <Badge variant={selectedStudent.status === 'active' ? 'default' : 'secondary'}>
                      {selectedStudent.status}
                    </Badge>
                  </div>
                </div>

                {/* Progress Overview */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center space-y-1">
                        <p className="text-xs text-muted-foreground">Profile</p>
                        <p className="font-medium text-primary">
                          {selectedStudent.profileCompletion}%
                        </p>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs text-muted-foreground">Assessments</p>
                        <p className="font-medium text-primary">
                          {selectedStudent.assessmentsCompleted}/{selectedStudent.totalAssessments}
                        </p>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs text-muted-foreground">Career Matches</p>
                        <p className="font-medium text-primary">
                          {selectedStudent.careerMatches}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interests */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Top Career Matches */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Top Career Matches</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.topCareers.map((career, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        <StarIcon className="w-3 h-3" />
                        {career}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedStudent.notes}
                  </p>
                </div>

                {/* Add Note */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Add New Note</h4>
                  <Textarea
                    placeholder="Add a note about this student..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="w-full"
                  >
                    Add Note
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="gap-2">
                    <ChatBubbleIcon className="w-4 h-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Schedule Session
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};