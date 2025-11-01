import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getParse } from '@/config/parse';
import {
  Search,
  Plus,
  MessageCircle,
  ArrowBigUp,
  Send,
} from 'lucide-react';

interface Answer {
  id: string;
  answer: string;
  answeredBy: string;
  answeredByName: string;
  answeredAt: Date;
  upvotes: number;
  isCounselor: boolean;
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

  // Load questions from backend
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const Parse = await getParse();
        const result = await Parse.Cloud.run('getAllQuestions', {
          category: selectedCategory === 'all' ? undefined : selectedCategory
        });

        const formattedQuestions: Question[] = result.map((q: {
          id: string;
          get: (field: string) => unknown;
        }) => ({
          id: q.id,
          title: q.get('title') as string,
          question: q.get('question') as string,
          category: q.get('category') as string || 'general',
          askedBy: q.get('askedBy') as string,
          askedByName: q.get('askedByName') as string || 'Anonymous',
          createdAt: new Date(q.get('createdAt') as string),
          answers: (q.get('answers') as Answer[]) || [],
          upvotes: (q.get('upvotes') as number) || 0,
        }));

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
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
        category: selectedCategory === 'all' ? undefined : selectedCategory
      });

      const formattedQuestions: Question[] = result.map((q: {
        id: string;
        get: (field: string) => unknown;
      }) => ({
        id: q.id,
        title: q.get('title') as string,
        question: q.get('question') as string,
        category: q.get('category') as string || 'general',
        askedBy: q.get('askedBy') as string,
        askedByName: q.get('askedByName') as string || 'Anonymous',
        createdAt: new Date(q.get('createdAt') as string),
        answers: (q.get('answers') as Answer[]) || [],
        upvotes: (q.get('upvotes') as number) || 0,
      }));

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Failed to reload questions:', error);
    }
  };

  const handlePostQuestion = async () => {
    if (!questionTitle.trim() || !questionDetails.trim()) {
      alert('Please fill in both title and details');
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

      alert('Question posted successfully!');
      setQuestionTitle('');
      setQuestionDetails('');
      setShowAskForm(false);
      await reloadQuestions();
    } catch (error) {
      console.error('Failed to post question:', error);
      alert('Failed to post question. Please try again.');
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

      setReplyText({ ...replyText, [questionId]: '' });
      await reloadQuestions();
    } catch (error) {
      console.error('Failed to post reply:', error);
      alert('Failed to post reply. Please try again.');
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

  const handleUpvoteAnswer = async (questionId: string, answerId: string) => {
    try {
      const Parse = await getParse();
      await Parse.Cloud.run('upvoteAnswer', { questionId, answerId });
      await reloadQuestions();
    } catch (error) {
      console.error('Failed to upvote answer:', error);
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
                    onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
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
                          <h3 className="text-lg font-semibold flex-1">{question.title}</h3>
                          <Badge className={getCategoryColor(question.category)}>
                            {question.category}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground mb-3">{question.question}</p>

                        {/* Meta Info */}
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
                                onClick={() => handleUpvoteAnswer(question.id, answer.id)}
                              >
                                <ArrowBigUp className="h-5 w-5 text-gray-600 hover:text-orange-600" />
                              </button>
                              <span className="text-xs font-semibold">{answer.upvotes || 0}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-800 mb-2">{answer.answer}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className={answer.isCounselor ? 'text-blue-600 font-semibold' : 'font-medium'}>
                                  {answer.answeredByName}
                                  {answer.isCounselor && (
                                    <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700">
                                      Counselor
                                    </Badge>
                                  )}
                                </span>
                                <span>•</span>
                                <span>{new Date(answer.answeredAt).toLocaleDateString()}</span>
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
    </div>
  );
};

export default CommunityQA;
