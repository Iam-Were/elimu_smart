import React, { useState } from 'react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAssignedStudents } from '@/hooks/useAssignedStudents';
import { useStudentManagement } from '@/hooks/counselor/useStudentManagement';
import type { Student } from '@/hooks/useAssignedStudents';
import {
  MagnifyingGlassIcon,
  PersonIcon,
  ChatBubbleIcon,
  CalendarIcon,
  Pencil1Icon,
  EyeOpenIcon,
  ExclamationTriangleIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { Loader2, AlertTriangle, FileText, Target } from 'lucide-react';

export const StudentRoster: React.FC = () => {
  const { students: allStudents, isLoading, error, refetch } = useAssignedStudents();
  const {
    updateStudentPriority,
    addStudentNote,
    getStudentAssessmentResults,
    getStudentNotes,
    isLoading: managementLoading
  } = useStudentManagement();
  
  const [students, setStudents] = React.useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAssignment, setFilterAssignment] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [opened, setOpened] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [studentNotes, setStudentNotes] = useState<Array<{
    id: string;
    content: string;
    createdAt: string | Date;
    tags?: string[];
  }>>([]);
  const [assessmentResults, setAssessmentResults] = useState<{
    summary: {
      hollandCode?: string;
      primaryType?: string;
      assessmentsCompleted: number;
      profileCompletion: number;
    };
  } | null>(null);

  // Update local students when hook data changes
  React.useEffect(() => {
    if (allStudents) {
      setStudents(allStudents);
    }
  }, [allStudents]);

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.school.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = filterPriority === 'all' || student.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;

    // Filter by assignment status
    const matchesAssignment =
      filterAssignment === 'all' ||
      (filterAssignment === 'assigned' && student.isAssignedToMe) ||
      (filterAssignment === 'unassigned' && !student.assignedCounselor) ||
      (filterAssignment === 'others' && student.assignedCounselor && !student.isAssignedToMe);

    return matchesSearch && matchesPriority && matchesStatus && matchesAssignment;
  });

  const handleViewStudent = async (student: Student) => {
    setSelectedStudent(student);
    setNewNote('');
    setOpened(true);
    
    // Load student notes and assessments
    try {
      const [notes, assessments] = await Promise.all([
        getStudentNotes(student.id),
        getStudentAssessmentResults(student.id)
      ]);
      setStudentNotes(notes.notes || []);
      setAssessmentResults(assessments);
    } catch (error) {
      console.error('Failed to load student data:', error);
    }
  };

  const handleAddNote = async () => {
    if (selectedStudent && newNote.trim()) {
      try {
        await addStudentNote({
          studentId: selectedStudent.id,
          note: newNote,
          isPrivate: true,
          tags: ['counseling', 'follow-up']
        });
        setNewNote('');
        // Reload notes
        const notes = await getStudentNotes(selectedStudent.id);
        setStudentNotes(notes.notes || []);
      } catch (error) {
        console.error('Failed to add note:', error);
      }
    }
  };

  const handlePriorityChange = async (student: Student, priority: 'low' | 'medium' | 'high' | 'urgent') => {
    try {
      await updateStudentPriority({
        studentId: student.id,
        priority,
        reason: `Priority updated to ${priority}`
      });
      
      // Update local state
      setStudents(students.map(s => 
        s.id === student.id ? { ...s, priority } : s
      ));
      
      // Refetch to ensure consistency
      await refetch();
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterAssignment} onValueChange={setFilterAssignment}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by assignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="assigned">Assigned to Me</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="others">Assigned to Others</SelectItem>
                </SelectContent>
              </Select>
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
        {isLoading && (
          <Card>
            <CardContent className="pt-6 text-center flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-yellow-600" />
              <p className="text-muted-foreground">Loading students...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error Loading Students</AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p>{error.message}</p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="flex items-center gap-2"
              >
                <ReloadIcon className="h-4 w-4" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredStudents.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center space-y-2">
              <PersonIcon className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                {students.length === 0
                  ? 'No students assigned yet'
                  : 'No students match your current filters'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Students Grid */}
        {!isLoading && !error && filteredStudents.length > 0 && (
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
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm">
                          {student.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {student.grade} • {student.school}
                        </p>
                        {student.assignedCounselor && (
                          <p className="text-xs text-muted-foreground">
                            {student.isAssignedToMe ? (
                              <span className="text-green-600 font-medium">Assigned to you</span>
                            ) : (
                              <span>Assigned to {student.assignedCounselor.name}</span>
                            )}
                          </p>
                        )}
                        {!student.assignedCounselor && (
                          <p className="text-xs text-orange-600 font-medium">Unassigned</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge
                        variant={
                          student.priority === 'urgent' ? 'destructive' :
                          student.priority === 'high' ? 'destructive' :
                          student.priority === 'medium' ? 'default' : 'secondary'
                        }
                        className={`text-xs ${
                          student.priority === 'urgent' ? 'bg-red-600 hover:bg-red-700' :
                          student.priority === 'high' ? 'bg-orange-500 hover:bg-orange-600' : ''
                        }`}
                      >
                        {student.priority === 'urgent' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {student.priority}
                      </Badge>
                      <Badge
                        variant={student.status === 'active' ? 'default' : 
                                student.status === 'pending' ? 'outline' : 'secondary'}
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
                        {student.assessments}
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
                        {student.lastContact ? formatDate(student.lastContact) : 'Never'}
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
                  ? selectedStudent.name
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
                        {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-medium">
                        {selectedStudent.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedStudent.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedStudent.grade} • {selectedStudent.school}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Priority Management Buttons */}
                    <div className="flex gap-1">
                      {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                        <Button
                          key={priority}
                          size="sm"
                          variant={selectedStudent.priority === priority ? 'default' : 'outline'}
                          onClick={() => handlePriorityChange(selectedStudent, priority)}
                          disabled={managementLoading}
                          className={
                            priority === 'urgent'
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : priority === 'high'
                              ? 'bg-orange-500 hover:bg-orange-600 text-white'
                              : ''
                          }
                        >
                          {priority}
                        </Button>
                      ))}
                    </div>
                    <Badge variant={selectedStudent.status === 'active' ? 'default' : 'secondary'}>
                      {selectedStudent.status}
                    </Badge>
                  </div>
                </div>

                {/* Assessment Results */}
                {assessmentResults && assessmentResults.summary && (
                  <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold">Assessment Summary</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Holland Code:</span>
                          <span className="font-medium">{assessmentResults.summary.hollandCode || 'Not completed'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Primary Type:</span>
                          <span className="font-medium">{assessmentResults.summary.primaryType || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Assessments Completed:</span>
                          <span className="font-medium">{assessmentResults.summary.assessmentsCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Profile Completion:</span>
                          <span className="font-medium">{assessmentResults.summary.profileCompletion}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                          {selectedStudent.assessments}
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

                {/* Previous Notes */}
                {studentNotes.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <h4 className="font-medium text-sm">Previous Notes ({studentNotes.length})</h4>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {studentNotes.slice(0, 5).map((note) => (
                        <Card key={note.id} className="bg-slate-50 dark:bg-slate-900">
                          <CardContent className="p-3">
                            <p className="text-sm">{note.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-muted-foreground">
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                              {note.tags && note.tags.length > 0 && (
                                <div className="flex gap-1">
                                  {note.tags.map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Note */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Add New Note</h4>
                  <Textarea
                    placeholder="Add a private note about this student..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || managementLoading}
                    className="w-full"
                  >
                    {managementLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Add Note
                      </>
                    )}
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