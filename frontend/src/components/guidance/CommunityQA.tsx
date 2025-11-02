import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getParse } from '@/config/parse';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  MessageCircle,
  ArrowBigUp,
  Send,
  CheckCircle2,
  ShieldCheck,
  Pin,
  Trash2,
} from 'lucide-react';

interface Answer {
  id: string;
  answer: string;
  answeredBy: string;
  answeredByName: string;
  answeredAt: Date;
  upvotes: number;
  isCounselor: boolean;
  isBestAnswer?: boolean;
  isVerified?: boolean;
}

// Serialized Parse Object from backend API
interface SerializedQuestion {
  objectId: string;
  title: string;
  question: string;
  category: string;
  askedBy?: string; // Optional - may not be in response
  askedByName: string;
  createdAt: string;
  upvotes: number;
  hasBestAnswer: boolean;
  isPinned: boolean;
}

interface SerializedAnswer {
  objectId: string;
  answer: string;
  answeredBy: string;
  answeredByName: string;
  createdAt: string;
  upvotes: number;
  isCounselor: boolean;
  isBestAnswer: boolean;
  isVerified: boolean;
}

interface Question {
  id: string;
  title: string;
  question: string;
  category: string;
  askedBy: string;
  askedByName: string;
  createdAt: Date;
  answers: Answer[];
  upvotes: number;
  hasBestAnswer?: boolean;
  isPinned?: boolean;
}

const CommunityQA: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAskForm, setShowAskForm] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDetails, setQuestionDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [submittingReply, setSubmittingReply] = useState<Record<string, boolean>>({});
  const [isCounselor, setIsCounselor] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<{ type: 'question' | 'answer'; id: string; questionId?: string } | null>(null);
  const [deleteReason, setDeleteReason] = useState('');

  // Check if current user is counselor
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const Parse = await getParse();
        const currentUser = Parse.User.current();
        if (currentUser) {
          const role = currentUser.get('role');
          setIsCounselor(role === 'counselor');
        }
      } catch (error) {
        console.error('Failed to check user role:', error);
      }
    };

    checkUserRole();
  }, []);

  // Load questions from backend
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const Parse = await getParse();
        const result = await Parse.Cloud.run('getAllQuestions', {
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          page: 0,
          limit: 20
        });

        // Backend returns { questions, total, page, hasMore }
        // Questions are serialized JSON objects, not Parse Objects
        console.log('[DEBUG] Raw API result:', result);
        console.log('[DEBUG] First question raw:', result.questions?.[0]);

        const formattedQuestions: Question[] = result.questions.map((q: SerializedQuestion) => {
          const formatted = {
            id: q.objectId,
            title: q.title,
            question: q.question,
            category: q.category || 'general',
            askedBy: q.askedBy || '',
            askedByName: q.askedByName || 'Anonymous',
            createdAt: new Date(q.createdAt),
            answers: [], // Loaded separately when expanded
            upvotes: q.upvotes || 0,
            hasBestAnswer: q.hasBestAnswer || false,
            isPinned: q.isPinned || false,
          };
          console.log('[DEBUG] Formatted question:', formatted);
          return formatted;
        });

        console.log('[DEBUG] Setting questions state:', formattedQuestions);
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
        toast.error('Failed to load questions', {
          description: 'Please refresh the page to try again'
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [selectedCategory]);

  const reloadQuestions = async () => {
    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getAllQuestions', {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        page: 0,
        limit: 20
      });

      const formattedQuestions: Question[] = result.questions.map((q: SerializedQuestion) => ({
        id: q.objectId,
        title: q.title,
        question: q.question,
        category: q.category || 'general',
        askedBy: q.askedBy || '',
        askedByName: q.askedByName || 'Anonymous',
        createdAt: new Date(q.createdAt),
        answers: [], // Loaded separately
        upvotes: q.upvotes || 0,
        hasBestAnswer: q.hasBestAnswer || false,
        isPinned: q.isPinned || false,
      }));

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Failed to reload questions:', error);
    }
  };

  const handlePostQuestion = async () => {
    if (!questionTitle.trim() || !questionDetails.trim()) {
      toast.error('Please fill in both title and details', {
        description: 'Both title and details are required'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const Parse = await getParse();
      await Parse.Cloud.run('submitQuestion', {
        title: questionTitle,
        question: questionDetails,
        category: selectedCategory === 'all' ? 'general' : selectedCategory
      });

      toast.success('Question posted successfully!', {
        description: 'Your question is now visible to the community'
      });
      setQuestionTitle('');
      setQuestionDetails('');
      setShowAskForm(false);
      await reloadQuestions();
    } catch (error) {
      console.error('Failed to post question:', error);
      toast.error('Failed to post question', {
        description: 'Please check your input and try again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostReply = async (questionId: string) => {
    const reply = replyText[questionId]?.trim();
    if (!reply) return;

    setSubmittingReply({ ...submittingReply, [questionId]: true });
    try {
      const Parse = await getParse();
      await Parse.Cloud.run('answerQuestion', {
        questionId,
        answer: reply
      });

      toast.success('Reply posted successfully!');
      setReplyText({ ...replyText, [questionId]: '' });

      // Reload answers for this question
      await loadAnswers(questionId);
    } catch (error) {
      console.error('Failed to post reply:', error);
      toast.error('Failed to post reply', {
        description: 'Please check your reply and try again'
      });
    } finally {
      setSubmittingReply({ ...submittingReply, [questionId]: false });
    }
  };

  const handleUpvoteQuestion = async (questionId: string) => {
    try {
      const Parse = await getParse();
      await Parse.Cloud.run('upvoteQuestion', { questionId });
      await reloadQuestions();
    } catch (error) {
      console.error('Failed to upvote question:', error);
    }
  };

  const handleUpvoteAnswer = async (answerId: string) => {
    try {
      const Parse = await getParse();
      await Parse.Cloud.run('upvoteAnswer', { answerId });

      // Reload answers for current expanded question
      if (expandedQuestion) {
        await loadAnswers(expandedQuestion);
      }
    } catch (error) {
      console.error('Failed to upvote answer:', error);
    }
  };

  const loadAnswers = async (questionId: string) => {
    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getQuestionAnswers', {
        questionId,
        page: 0,
        limit: 50
      });

      // Backend returns { answers, total }
      // Answers are serialized JSON objects, not Parse Objects
      const formattedAnswers: Answer[] = result.answers.map((a: SerializedAnswer) => ({
        id: a.objectId,
        answer: a.answer,
        answeredBy: a.answeredBy,
        answeredByName: a.answeredByName || 'Anonymous',
        answeredAt: new Date(a.createdAt),
        upvotes: a.upvotes || 0,
        isCounselor: a.isCounselor || false,
        isBestAnswer: a.isBestAnswer || false,
        isVerified: a.isVerified || false,
      }));

      // Update answers for this specific question
      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.id === questionId
            ? { ...q, answers: formattedAnswers }
            : q
        )
      );
    } catch (error) {
      console.error('Failed to load answers:', error);
    }
  };

  const handleExpandQuestion = async (questionId: string) => {
    const isExpanded = expandedQuestion === questionId;

    if (isExpanded) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(questionId);
      // Load answers when expanding
      await loadAnswers(questionId);
    }
  };

  // Moderation functions (counselor only)
  const handleMarkBestAnswer = async (questionId: string, answerId: string) => {
    try {
      const Parse = await getParse();
      await Parse.Cloud.run('markBestAnswer', { questionId, answerId });
      toast.success('Marked as best answer');
      await loadAnswers(questionId);
      await reloadQuestions();
    } catch (error) {
      console.error('Failed to mark best answer:', error);
      toast.error('Failed to mark best answer');
    }
  };

  const handleVerifyAnswer = async (answerId: string) => {
    try {
      const Parse = await getParse();
      await Parse.Cloud.run('verifyAnswer', { answerId });
      toast.success('Answer verified');
      if (expandedQuestion) {
        await loadAnswers(expandedQuestion);
      }
    } catch (error) {
      console.error('Failed to verify answer:', error);
      toast.error('Failed to verify answer');
    }
  };

  const handlePinQuestion = async (questionId: string) => {
    try {
      const Parse = await getParse();
      await Parse.Cloud.run('pinQuestion', { questionId });
      toast.success('Question pinned');
      await reloadQuestions();
    } catch (error) {
      console.error('Failed to pin question:', error);
      toast.error('Failed to pin question');
    }
  };

  const handleDeleteQuestion = async (questionId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for deletion');
      return;
    }

    try {
      const Parse = await getParse();
      await Parse.Cloud.run('deleteQuestion', { questionId, reason });
      toast.success('Question deleted');
      setShowDeleteDialog(null);
      setDeleteReason('');
      await reloadQuestions();
    } catch (error) {
      console.error('Failed to delete question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleDeleteAnswer = async (answerId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for deletion');
      return;
    }

    try {
      const Parse = await getParse();
      await Parse.Cloud.run('deleteAnswer', { answerId, reason });
      toast.success('Answer deleted');
      setShowDeleteDialog(null);
      setDeleteReason('');
      if (expandedQuestion) {
        await loadAnswers(expandedQuestion);
      }
    } catch (error) {
      console.error('Failed to delete answer:', error);
      toast.error('Failed to delete answer');
    }
  };

  const categories = [
    { value: 'all', label: 'All Questions' },
    { value: 'career', label: 'Career' },
    { value: 'academic', label: 'Academic' },
    { value: 'university', label: 'University' },
    { value: 'personal', label: 'Personal' },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'career': return 'bg-purple-100 text-purple-700';
      case 'academic': return 'bg-blue-100 text-blue-700';
      case 'university': return 'bg-green-100 text-green-700';
      case 'personal': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredQuestions = questions.filter(q =>
    searchTerm === '' ||
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Community Forum</h2>
        <p className="text-muted-foreground">
          Ask questions, share experiences, get advice from counselors and fellow students
        </p>
      </div>

      {/* Search and Ask Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => setShowAskForm(!showAskForm)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ask Question
        </Button>
      </div>

      {/* Ask Question Form */}
      {showAskForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
            <CardDescription>
              Be specific and include details. Counselors typically respond within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Question title (e.g., 'What careers are available for...')"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                disabled={isSubmitting}
              />
              <Textarea
                placeholder="Provide details: your grade level, subjects, concerns..."
                rows={5}
                value={questionDetails}
                onChange={(e) => setQuestionDetails(e.target.value)}
                disabled={isSubmitting}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handlePostQuestion}
                  disabled={isSubmitting || !questionTitle.trim() || !questionDetails.trim()}
                >
                  {isSubmitting ? 'Posting...' : 'Post Question'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAskForm(false);
                    setQuestionTitle('');
                    setQuestionDetails('');
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No questions yet. Be the first to ask!
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map((question) => {
            const isExpanded = expandedQuestion === question.id;
            return (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  {/* Question Header */}
                  <div
                    className="cursor-pointer"
                    onClick={() => handleExpandQuestion(question.id)}
                  >
                    <div className="flex gap-4 mb-3">
                      {/* Upvote Column */}
                      <div className="flex flex-col items-center gap-1">
                        <button
                          className="hover:bg-orange-100 p-1 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvoteQuestion(question.id);
                          }}
                        >
                          <ArrowBigUp className="h-6 w-6 text-gray-600 hover:text-orange-600" />
                        </button>
                        <span className="text-sm font-semibold">{question.upvotes}</span>
                      </div>

                      {/* Question Content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <h3 className="text-lg font-semibold flex-1 flex items-center gap-2">
                            {question.isPinned && (
                              <Pin className="h-4 w-4 text-orange-600" fill="currentColor" />
                            )}
                            {question.title}
                          </h3>
                          <div className="flex gap-2">
                            {question.hasBestAnswer && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                ✓ Answered
                              </Badge>
                            )}
                            <Badge className={getCategoryColor(question.category)}>
                              {question.category}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-3">{question.question}</p>

                        {/* Meta Info and Moderation */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="font-medium text-orange-600">{question.askedByName}</span>
                            <span>•</span>
                            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {question.answers.length} replies
                            </span>
                          </div>

                          {/* Counselor Moderation Buttons */}
                          {isCounselor && (
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2"
                                onClick={() => handlePinQuestion(question.id)}
                                title={question.isPinned ? "Unpin question" : "Pin question"}
                              >
                                <Pin className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setShowDeleteDialog({ type: 'question', id: question.id })}
                                title="Delete question"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Replies Section */}
                  {isExpanded && (
                    <div className="ml-10 mt-4 space-y-4 border-l-2 border-gray-200 pl-4">
                      {/* Existing Replies */}
                      {question.answers.map((answer) => (
                        <div key={answer.id} className="py-3 border-b border-gray-100 last:border-0">
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center gap-1">
                              <button
                                className="hover:bg-orange-100 p-1 rounded transition-colors self-start"
                                onClick={() => handleUpvoteAnswer(answer.id)}
                              >
                                <ArrowBigUp className="h-5 w-5 text-gray-600 hover:text-orange-600" />
                              </button>
                              <span className="text-xs font-semibold">{answer.upvotes || 0}</span>
                            </div>
                            <div className="flex-1">
                              {/* Best Answer Badge */}
                              {answer.isBestAnswer && (
                                <div className="mb-2 flex items-center gap-1 text-sm font-semibold text-green-600">
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span>Best Answer</span>
                                </div>
                              )}

                              <p className="text-gray-800 mb-2">{answer.answer}</p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className={answer.isCounselor ? 'text-blue-600 font-semibold' : 'font-medium'}>
                                    {answer.answeredByName}
                                    {answer.isCounselor && (
                                      <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700">
                                        Counselor
                                      </Badge>
                                    )}
                                    {answer.isVerified && (
                                      <Badge variant="outline" className="ml-2 text-xs bg-purple-50 text-purple-700">
                                        <ShieldCheck className="h-3 w-3 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                  </span>
                                  <span>•</span>
                                  <span>{new Date(answer.answeredAt).toLocaleDateString()}</span>
                                </div>

                                {/* Counselor Moderation for Answers */}
                                {isCounselor && (
                                  <div className="flex gap-1">
                                    {!answer.isBestAnswer && !question.hasBestAnswer && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={() => handleMarkBestAnswer(question.id, answer.id)}
                                        title="Mark as best answer"
                                      >
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Best
                                      </Button>
                                    )}
                                    {!answer.isVerified && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                        onClick={() => handleVerifyAnswer(answer.id)}
                                        title="Verify answer"
                                      >
                                        <ShieldCheck className="h-3 w-3 mr-1" />
                                        Verify
                                      </Button>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => setShowDeleteDialog({ type: 'answer', id: answer.id, questionId: question.id })}
                                      title="Delete answer"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Reply Form */}
                      <div className="pt-4">
                        <Textarea
                          placeholder="Write your reply..."
                          rows={3}
                          value={replyText[question.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [question.id]: e.target.value })}
                          disabled={submittingReply[question.id]}
                          className="mb-2"
                        />
                        <Button
                          size="sm"
                          onClick={() => handlePostReply(question.id)}
                          disabled={!replyText[question.id]?.trim() || submittingReply[question.id]}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {submittingReply[question.id] ? 'Posting...' : 'Post Reply'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog !== null} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {showDeleteDialog?.type === 'question' ? 'Question' : 'Answer'}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for deletion. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Enter reason for deletion (required)..."
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            rows={3}
            className="mt-2"
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(null);
                setDeleteReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (showDeleteDialog) {
                  if (showDeleteDialog.type === 'question') {
                    handleDeleteQuestion(showDeleteDialog.id, deleteReason);
                  } else {
                    handleDeleteAnswer(showDeleteDialog.id, deleteReason);
                  }
                }
              }}
              disabled={!deleteReason.trim()}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityQA;
