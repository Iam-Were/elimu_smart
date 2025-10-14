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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getParse } from '@/config/parse';
import {
  MagnifyingGlassIcon,
  ChatBubbleIcon,
  ClockIcon,
  CheckCircledIcon,
  PersonIcon,
  ExclamationTriangleIcon,
  BookmarkIcon,
} from '@radix-ui/react-icons';

interface Question {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentGrade: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'answered' | 'resolved';
  createdAt: string;
  updatedAt: string;
  responses: Response[];
  views: number;
  upvotes: number;
}

interface Response {
  id: string;
  counselorId: string;
  counselorName: string;
  content: string;
  createdAt: string;
  helpful: boolean;
}

// Mock data for questions
const mockQuestions: Question[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Sarah Wilson',
    studentEmail: 'sarah.wilson@school.edu',
    studentGrade: 'Form 4',
    title: 'Should I choose Engineering or Medicine?',
    content: 'I am really torn between pursuing Engineering and Medicine. I love both Math and Biology, and I want to help people but also love problem-solving with technology. What factors should I consider when making this decision?',
    category: 'Career Choice',
    tags: ['engineering', 'medicine', 'career-decision'],
    priority: 'high',
    status: 'pending',
    createdAt: '2024-01-18T10:30:00Z',
    updatedAt: '2024-01-18T10:30:00Z',
    responses: [],
    views: 15,
    upvotes: 8,
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'David Brown',
    studentEmail: 'david.brown@school.edu',
    studentGrade: 'Form 3',
    title: 'What business courses should I take in university?',
    content: 'I want to start my own business someday. What specific business courses would be most helpful? Should I focus on Business Administration, Economics, or something else?',
    category: 'Education Planning',
    tags: ['business', 'university', 'entrepreneurship'],
    priority: 'medium',
    status: 'pending',
    createdAt: '2024-01-17T14:20:00Z',
    updatedAt: '2024-01-17T14:20:00Z',
    responses: [],
    views: 12,
    upvotes: 5,
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Lisa Chen',
    studentEmail: 'lisa.chen@school.edu',
    studentGrade: 'Form 4',
    title: 'How to prepare for medical school applications?',
    content: 'I have decided I want to be a doctor. What should I do now to prepare for medical school applications? What grades do I need, and what activities should I focus on?',
    category: 'University Applications',
    tags: ['medicine', 'university-applications', 'preparation'],
    priority: 'medium',
    status: 'answered',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-17T11:45:00Z',
    responses: [
      {
        id: '1',
        counselorId: 'c1',
        counselorName: 'Dr. Jane Smith',
        content: 'Great question! For medical school in Kenya, you\'ll need strong grades in Biology, Chemistry, and Math. Focus on getting A- or better in these subjects. Also consider volunteering at hospitals or health centers to gain experience.',
        createdAt: '2024-01-17T11:45:00Z',
        helpful: true,
      },
    ],
    views: 25,
    upvotes: 12,
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'John Doe',
    studentEmail: 'john.doe@school.edu',
    studentGrade: 'Form 2',
    title: 'Can I become a professional athlete?',
    content: 'I love playing football and I\'m pretty good at it. My coach says I have potential. Is it realistic to pursue a career as a professional athlete? What should I do to prepare?',
    category: 'Career Exploration',
    tags: ['sports', 'athletics', 'career-planning'],
    priority: 'low',
    status: 'pending',
    createdAt: '2024-01-15T16:45:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    responses: [],
    views: 8,
    upvotes: 3,
  },
];

// Response templates
const responseTemplates = [
  {
    title: 'University Requirements',
    content: 'Thank you for your question about university requirements. For most programs in Kenya, you\'ll need to consider both your KCSE grades and KUCCPS cluster points. Here\'s what you should know...',
  },
  {
    title: 'Career Exploration',
    content: 'It\'s great that you\'re exploring different career options! When choosing a career, consider these factors: your interests, skills, values, and the job market outlook...',
  },
  {
    title: 'Subject Combinations',
    content: 'Choosing the right subject combination is crucial for your future career path. Based on your interests, here are some recommended combinations...',
  },
  {
    title: 'Follow-up Needed',
    content: 'Thanks for your question. To provide you with the most accurate guidance, I\'d like to schedule a one-on-one session to discuss your specific situation in more detail...',
  },
];

export const QuestionQueue: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [opened, setOpened] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const open = () => setOpened(true);
  const close = () => setOpened(false);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const Parse = getParse();
        const result = await Parse.Cloud.run('getStudentQuestions');

        if (result.success) {
          // Transform backend data to match UI interface
          const transformedQuestions = result.questions.map((q: {
            id: string;
            studentId: string;
            studentName: string;
            studentEmail: string;
            question: string;
            answer?: string;
            category: string;
            status: string;
            priority: string;
            askedAt: string;
          }) => ({
            id: q.id,
            studentId: q.studentId,
            studentName: q.studentName,
            studentEmail: q.studentEmail,
            studentGrade: 'Form 4',
            title: q.question.length > 60 ? q.question.substring(0, 60) + '...' : q.question,
            content: q.question,
            category: q.category,
            tags: [q.category],
            priority: q.priority as 'high' | 'medium' | 'low',
            status: q.status as 'pending' | 'answered' | 'resolved',
            createdAt: q.askedAt,
            updatedAt: q.askedAt,
            responses: q.answer ? [{
              id: '1',
              counselorId: 'current',
              counselorName: 'Counselor',
              content: q.answer,
              createdAt: new Date().toISOString(),
              helpful: true
            }] : [],
            views: 0,
            upvotes: 0,
          }));
          setQuestions(transformedQuestions);
        } else {
          console.warn('Failed to fetch questions:', result.error);
          setQuestions(mockQuestions);
        }
      } catch (error) {
        console.warn('Error fetching questions, using mock data:', error);
        setQuestions(mockQuestions);
      }
    };

    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !filterCategory || question.category === filterCategory;
    const matchesStatus = !filterStatus || question.status === filterStatus;
    const matchesTab = !activeTab || question.status === activeTab;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setAnswerText('');
    open();
  };

  const handleSendResponse = async () => {
    if (selectedQuestion && answerText.trim()) {
      try {
        const Parse = getParse();
        const result = await Parse.Cloud.run('answerQuestion', {
          questionId: selectedQuestion.id,
          answer: answerText
        });

        if (result.success) {
          // Reload questions to show updated answer
          const updated = await Parse.Cloud.run('getStudentQuestions');
          if (updated.success) {
            const transformedQuestions = updated.questions.map((q: {
              id: string;
              studentId: string;
              studentName: string;
              studentEmail: string;
              question: string;
              answer?: string;
              category: string;
              priority: string;
              status: string;
              askedAt: { iso: string };
              answeredAt?: { iso: string };
            }) => ({
              id: q.id,
              studentId: q.studentId,
              studentName: q.studentName,
              studentEmail: q.studentEmail,
              studentGrade: 'Form 4',
              title: q.question.length > 60 ? q.question.substring(0, 60) + '...' : q.question,
              content: q.question,
              category: q.category,
              tags: [q.category],
              priority: q.priority as 'high' | 'medium' | 'low',
              status: q.status as 'pending' | 'answered' | 'resolved',
              createdAt: q.askedAt.iso,
              updatedAt: q.answeredAt?.iso || q.askedAt.iso,
              responses: q.answer ? [{
                id: '1',
                counselorId: 'current',
                counselorName: 'Career Counselor',
                content: q.answer,
                createdAt: q.answeredAt?.iso || new Date().toISOString(),
                helpful: false
              }] : []
            }));
            setQuestions(transformedQuestions);
          }
          setAnswerText('');
          close();
        }
      } catch (error) {
        console.error('Error answering question:', error);
      }
    }
  };

  const handleUseTemplate = React.useCallback(() => {
    // Future implementation: template content insertion
    console.log('Template feature not yet implemented');
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getQuestionsByStatus = (status: string) => {
    return questions.filter(q => q.status === status).length;
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Student Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Respond to student questions and provide guidance
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {getQuestionsByStatus('pending')} Pending
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {getQuestionsByStatus('answered')} Answered
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                className="pl-10"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
              />
            </div>
            <Select
              value={filterCategory}
              onValueChange={setFilterCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Career Choice">Career Choice</SelectItem>
                <SelectItem value="Education Planning">Education Planning</SelectItem>
                <SelectItem value="University Applications">University Applications</SelectItem>
                <SelectItem value="Career Exploration">Career Exploration</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Question Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              Pending ({getQuestionsByStatus('pending')})
            </TabsTrigger>
            <TabsTrigger value="answered" className="flex items-center gap-2">
              <ChatBubbleIcon className="h-4 w-4" />
              Answered ({getQuestionsByStatus('answered')})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="flex items-center gap-2">
              <CheckCircledIcon className="h-4 w-4" />
              Resolved ({getQuestionsByStatus('resolved')})
            </TabsTrigger>
          </TabsList>

          {/* Questions List */}
          <TabsContent value={activeTab || 'pending'} className="mt-6">
            <div className="space-y-4">
              {filteredQuestions.length === 0 ? (
                <Alert>
                  <ChatBubbleIcon className="h-4 w-4" />
                  <AlertTitle>No questions found</AlertTitle>
                  <AlertDescription>
                    No questions match your current filters. Try adjusting your search criteria.
                  </AlertDescription>
                </Alert>
              ) : (
                filteredQuestions.map(question => (
                  <Card
                    key={question.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewQuestion(question)}
                  >
                    <div className="p-6 space-y-4">
                      {/* Question Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {question.studentName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">
                              {question.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{question.studentName} • {question.studentGrade}</span>
                              <span>•</span>
                              <span>{formatDate(question.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={question.priority === 'high' ? 'destructive' : 'secondary'}
                          >
                            {question.priority}
                          </Badge>
                          <Badge
                            variant={question.status === 'pending' ? 'default' : 'secondary'}
                          >
                            {question.status}
                          </Badge>
                          {question.priority === 'high' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <ExclamationTriangleIcon className="h-3 w-3 text-destructive" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                High Priority
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>

                      {/* Question Content Preview */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {question.content}
                      </p>

                      {/* Question Meta */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {question.category}
                          </Badge>
                          {question.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {question.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{question.tags.length - 2} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <PersonIcon className="h-3 w-3" />
                            <span>{question.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookmarkIcon className="h-3 w-3" />
                            <span>{question.upvotes} helpful</span>
                          </div>
                          {question.responses.length > 0 && (
                            <div className="flex items-center gap-1">
                              <ChatBubbleIcon className="h-3 w-3" />
                              <span>{question.responses.length} responses</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Question Detail Modal */}
        <Dialog open={opened} onOpenChange={(open) => !open && close()}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedQuestion?.title || 'Question Details'}</DialogTitle>
            </DialogHeader>
            {selectedQuestion && (
              <div className="space-y-6">
                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {selectedQuestion.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedQuestion.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedQuestion.studentGrade} • {selectedQuestion.studentEmail}
                    </p>
                  </div>
                </div>

                {/* Question Details */}
                <Card className="p-4 bg-muted/50">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge variant={selectedQuestion.status === 'pending' ? 'default' : 'secondary'}>
                        {selectedQuestion.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Badge variant={selectedQuestion.priority === 'high' ? 'destructive' : 'secondary'}>
                          {selectedQuestion.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {selectedQuestion.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm">{selectedQuestion.content}</p>
                    <div className="flex gap-2">
                      {selectedQuestion.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Existing Responses */}
                {selectedQuestion.responses.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Previous Responses</h3>
                    {selectedQuestion.responses.map(response => (
                      <Card key={response.id} className="p-4 bg-muted/50">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">{response.counselorName}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(response.createdAt)}
                            </p>
                          </div>
                          <div 
                            className="text-sm"
                            dangerouslySetInnerHTML={{ __html: response.content }} 
                          />
                        </div>
                      </Card>
                    ))}
                    <Separator />
                  </div>
                )}

                {/* Response Templates */}
                <div className="space-y-3">
                  <h3 className="font-medium">Quick Templates</h3>
                  <div className="flex gap-2 flex-wrap">
                    {responseTemplates.map((template, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => handleUseTemplate()}
                      >
                        {template.title}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Response Editor */}
                <div className="space-y-3">
                  <h3 className="font-medium">Your Response</h3>
                  <Textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Type your response here..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={close}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendResponse}
                    className="flex items-center gap-2"
                  >
                    <ChatBubbleIcon className="h-4 w-4" />
                    Send Response
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