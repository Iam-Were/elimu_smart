import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAssignedStudents } from '@/hooks/useAssignedStudents';
import { useStudentManagement } from '@/hooks/counselor/useStudentManagement';
import { useSessionBooking } from '@/hooks/useSessionBooking';
import type { Student } from '@/hooks/useAssignedStudents';
import {
  PersonIcon,
  ChatBubbleIcon,
  CalendarIcon,
  EyeOpenIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { Loader2, FileText, Target, CheckCircle2, Circle } from 'lucide-react';

export const StudentRoster: React.FC = () => {
  const navigate = useNavigate();
  const { students: allStudents, isLoading, error, refetch } = useAssignedStudents();
  const {
    updateStudentPriority,
    addStudentNote,
    getStudentAssessmentResults,
    getStudentNotes,
    isLoading: managementLoading
  } = useStudentManagement();
  const { isBooking } = useSessionBooking();
  
  const [students, setStudents] = React.useState<Student[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAssignment, setFilterAssignment] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [opened, setOpened] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [studentToBook, setStudentToBook] = useState<Student | null>(null);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [studentNotes, setStudentNotes] = useState<Array<{
    id: string;
    content: string;
    createdAt: string | Date;
    tags?: string[];
  }>>([]);
  const [recentNotes, setRecentNotes] = useState<Record<string, string>>({});
  const [assessmentResults, setAssessmentResults] = useState<Array<{
    type: string;
    completedAt: Date;
  }>>([]);

  // Update local students when hook data changes
  React.useEffect(() => {
    if (allStudents) {
      setStudents(allStudents);
    }
  }, [allStudents]);

  const filteredStudents = students.filter(student => {
    const matchesPriority = filterPriority === 'all' || student.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;

    // Filter by assignment status
    const matchesAssignment =
      filterAssignment === 'all' ||
      (filterAssignment === 'assigned' && student.isAssignedToMe) ||
      (filterAssignment === 'unassigned' && !student.assignedCounselor) ||
      (filterAssignment === 'others' && student.assignedCounselor && !student.isAssignedToMe);

    return matchesPriority && matchesStatus && matchesAssignment;
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

      // Handle assessments - could be an array or an object with results
      if (Array.isArray(assessments)) {
        setAssessmentResults(assessments);
      } else if (assessments?.results && Array.isArray(assessments.results)) {
        setAssessmentResults(assessments.results);
      } else {
        setAssessmentResults([]);
      }
    } catch (error) {
      console.error('Failed to load student data:', error);
      setAssessmentResults([]);
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

  const handleAddStudentNote = async (studentId: string, noteText: string) => {
    try {
      await addStudentNote({
        studentId,
        note: noteText,
        isPrivate: true,
        tags: ['quick-note']
      });

      // Update recent notes display
      setRecentNotes(prev => ({
        ...prev,
        [studentId]: noteText
      }));
    } catch (error) {
      console.warn('Failed to save quick note:', error);
      // Gracefully fail - don't block user
    }
  };

  // Load recent notes for all students
  React.useEffect(() => {
    const loadRecentNotes = async () => {
      const notes: Record<string, string> = {};

      for (const student of students.slice(0, 10)) { // Load for first 10 students
        try {
          const studentNotesData = await getStudentNotes(student.id);
          const recentNote = studentNotesData.notes?.[0];
          if (recentNote) {
            notes[student.id] = recentNote.content;
          }
        } catch {
          // Silently skip
        }
      }

      setRecentNotes(notes);
    };

    if (students.length > 0) {
      loadRecentNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students.length]); // Only reload when student count changes

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

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
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
              <Button variant="secondary" className="w-full" onClick={() => setAddStudentModalOpen(true)}>
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

        {/* Students List - Contact Card Style */}
        {!isLoading && !error && filteredStudents.length > 0 && (
          <div className="space-y-4">
            {filteredStudents.map(student => (
            <Card key={student.id} className="hover:shadow-lg transition-all group relative overflow-hidden">
              <CardContent className="p-0">
                {/* Priority Banner */}
                {(student.priority === 'urgent' || student.priority === 'high') && (
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    student.priority === 'urgent' ? 'bg-red-600' : 'bg-orange-500'
                  }`} />
                )}

                <div className="p-4 sm:p-6">
                  {/* Horizontal Layout for List View */}
                  <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

                    {/* Left Section: Student Info */}
                    <div className="flex items-start gap-4 lg:min-w-[300px]">
                      {/* Large Profile Photo */}
                      <Avatar className="h-16 w-16 ring-2 ring-yellow-400 flex-shrink-0">
                        {student.profileImage && (
                          <img
                            src={student.profileImage}
                            alt={student.name}
                            className="object-cover w-full h-full"
                          />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xl font-bold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Student Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="font-semibold text-base">
                            {student.name}
                          </h3>
                          <Badge
                            variant={
                              student.priority === 'urgent' ? 'destructive' :
                              student.priority === 'high' ? 'destructive' :
                              'secondary'
                            }
                            className={`text-xs ${
                              student.priority === 'urgent' ? 'bg-red-600' :
                              student.priority === 'high' ? 'bg-orange-500' : ''
                            }`}
                          >
                            {student.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {student.grade} • {student.school}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className={`h-2 w-2 rounded-full ${student.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {student.status === 'active' ? 'Active' : student.status}
                          </span>
                          <span>Last: {student.lastContact ? formatDate(student.lastContact) : 'Never'}</span>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="text-muted-foreground">
                            <FileText className="h-3 w-3 inline mr-1" />
                            {student.assessments}
                          </span>
                          <span className="text-muted-foreground">
                            <Target className="h-3 w-3 inline mr-1" />
                            {student.careerMatches}
                          </span>
                        </div>

                        {/* Profile Completion Progress Bar */}
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Profile Completion</span>
                            <span className="text-yellow-700 font-medium">{student.profileCompletion}%</span>
                          </div>
                          <Progress value={student.profileCompletion} className="h-2" />
                        </div>

                        {/* Assessment Completion Badges */}
                        <div className="mt-3 space-y-1">
                          <p className="text-xs text-muted-foreground mb-1.5">Assessments</p>
                          <div className="flex flex-wrap gap-1.5">
                            {['riasec', 'skills', 'university', 'career', 'subjects'].map((assessmentType) => {
                              const isCompleted = student.completedAssessments?.includes(assessmentType);
                              return (
                                <div
                                  key={assessmentType}
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-colors ${
                                    isCompleted
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500'
                                  }`}
                                  title={`${assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)} Assessment ${isCompleted ? 'Completed' : 'Not Started'}`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <Circle className="h-3 w-3" />
                                  )}
                                  <span className="capitalize">{assessmentType}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Middle Section: Quick Note */}
                    <div className="flex-1 min-w-0">
                      <Textarea
                        placeholder="Add quick note (auto-saves on blur)..."
                        className="min-h-[80px] text-sm resize-none w-full"
                        onBlur={(e) => {
                          if (e.target.value.trim()) {
                            handleAddStudentNote(student.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      {recentNotes[student.id] ? (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                          <p className="text-muted-foreground font-medium mb-1">Recent note:</p>
                          <p className="line-clamp-2">{recentNotes[student.id]}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">
                          No recent notes
                        </p>
                      )}
                    </div>

                    {/* Right Section: Actions */}
                    <div className="flex lg:flex-col gap-2 lg:min-w-[120px]">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate(`/inbox?studentId=${student.id}`)}
                      >
                        <ChatBubbleIcon className="h-3 w-3 mr-1.5" />
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setStudentToBook(student);
                          setBookingModalOpen(true);
                        }}
                      >
                        <CalendarIcon className="h-3 w-3 mr-1.5" />
                        Book
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewStudent(student)}
                      >
                        <EyeOpenIcon className="h-3 w-3 mr-1.5" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Student Detail Modal */}
        <Dialog open={opened} onOpenChange={setOpened}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedStudent && (
              <div className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {selectedStudent.profileImage && (
                        <img
                          src={selectedStudent.profileImage}
                          alt={selectedStudent.name}
                          className="object-cover w-full h-full"
                        />
                      )}
                      <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                        {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {selectedStudent.name}
                  </DialogTitle>
                </DialogHeader>

                {/* Student Notes History */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Counseling Notes
                  </h4>
                  {studentNotes.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {studentNotes.map((note) => (
                        <Card key={note.id} className="p-3 bg-muted/30">
                          <p className="text-sm">{note.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(note.createdAt)}
                          </p>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No notes yet</p>
                  )}

                  {/* Add New Note */}
                  <div className="space-y-2 pt-2 border-t">
                    <Textarea
                      placeholder="Add new note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                      Add Note
                    </Button>
                  </div>
                </div>

                {/* Assessment Results */}
                {assessmentResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Assessment Results
                    </h4>
                    <div className="space-y-2">
                      {assessmentResults.map((result, idx) => (
                        <Card key={idx} className="p-3">
                          <p className="text-sm font-medium">{result.type}</p>
                          <p className="text-xs text-muted-foreground">
                            Completed: {formatDate(result.completedAt)}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

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

        {/* Session Booking Modal */}
        <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book Session with {studentToBook?.name}</DialogTitle>
            </DialogHeader>
            {studentToBook && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Type</label>
                  <Select defaultValue="video">
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="in-person">In Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-md"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (Optional)</label>
                  <Textarea placeholder="Add any notes about this session..." className="min-h-[80px]" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setBookingModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button disabled={isBooking}>
                    {isBooking ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Booking...
                      </>
                    ) : (
                      'Book Session'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Student Modal */}
        <Dialog open={addStudentModalOpen} onOpenChange={setAddStudentModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Student Email *</label>
                <Input
                  type="email"
                  placeholder="student@example.com"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Student must have an existing account on the platform
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Textarea
                  placeholder="Add any notes about this student assignment..."
                  className="min-h-[80px]"
                />
              </div>
              <Alert>
                <AlertDescription>
                  The student will be notified via email once added to your roster.
                </AlertDescription>
              </Alert>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setAddStudentModalOpen(false)}>
                  Cancel
                </Button>
                <Button>
                  Add Student
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};