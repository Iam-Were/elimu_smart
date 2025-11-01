import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  MessageCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface Question {
  id: string;
  title: string;
  category: 'career' | 'academic' | 'university' | 'personal';
  askedBy: string;
  askedDate: Date;
  views: number;
  likes: number;
  answers: number;
  hasAcceptedAnswer: boolean;
  preview: string;
  tags: string[];
}

// Sample questions - Replace with backend API
const sampleQuestions: Question[] = [
  {
    id: '1',
    title: 'Should I take Biology or Physics for Medicine?',
    category: 'academic',
    askedBy: 'Form 3 Student',
    askedDate: new Date('2025-10-05'),
    views: 234,
    likes: 45,
    answers: 8,
    hasAcceptedAnswer: true,
    preview: 'I want to study Medicine at UoN. Which is more important - Biology or Physics? I can only choose one...',
    tags: ['medicine', 'kcse', 'subjects']
  },
  {
    id: '2',
    title: 'What careers are available for Business students?',
    category: 'career',
    askedBy: 'Sarah K.',
    askedDate: new Date('2025-10-04'),
    views: 189,
    likes: 32,
    answers: 12,
    hasAcceptedAnswer: true,
    preview: "I'm doing Business, Commerce, and Economics. What career paths can I pursue after KCSE?",
    tags: ['business', 'careers', 'kuccps']
  },
  {
    id: '3',
    title: 'How do I choose between multiple university offers?',
    category: 'university',
    askedBy: 'John M.',
    askedDate: new Date('2025-10-03'),
    views: 456,
    likes: 87,
    answers: 15,
    hasAcceptedAnswer: false,
    preview: 'I got offers from UoN, JKUAT, and Strathmore for different courses. How do I decide?',
    tags: ['university', 'kuccps', 'decisions']
  },
];

const CommunityQA: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAskForm, setShowAskForm] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDetails, setQuestionDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'all', label: 'All Questions', count: 200 },
    { value: 'career', label: 'Career', count: 85 },
    { value: 'academic', label: 'Academic', count: 62 },
    { value: 'university', label: 'University', count: 43 },
    { value: 'personal', label: 'Personal', count: 10 },
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

  const handlePostQuestion = async () => {
    if (!questionTitle.trim() || !questionDetails.trim()) {
      alert('Please fill in both title and details');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Integrate with backend submitQuestion cloud function
      // await Parse.Cloud.run('submitQuestion', { title: questionTitle, question: questionDetails, category: 'career' });

      // For now, just simulate success
      console.log('Question submitted:', { title: questionTitle, details: questionDetails });
      alert('Question posted successfully! A counselor will answer soon.');

      // Reset form
      setQuestionTitle('');
      setQuestionDetails('');
      setShowAskForm(false);
    } catch (error) {
      console.error('Failed to post question:', error);
      alert('Failed to post question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Note: H1 "Guidance Center" is provided by Sprint18Layout */}
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Community Q&A</h2>
        <p className="text-muted-foreground">
          Get answers from counselors and fellow students. Over 200 questions answered.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">200+</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-sm text-muted-foreground">Answered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1.2k</p>
                <p className="text-sm text-muted-foreground">Answers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2.5hrs</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
            {cat.label} ({cat.count})
          </Button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {sampleQuestions.map((question) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {/* Stats Column */}
                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-muted-foreground">{question.answers}</p>
                    <p className="text-xs text-muted-foreground">answers</p>
                  </div>
                  {question.hasAcceptedAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>

                {/* Question Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="text-lg font-semibold flex-1">{question.title}</h3>
                    <Badge className={getCategoryColor(question.category)}>
                      {question.category}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-3 line-clamp-2">{question.preview}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Asked by {question.askedBy}</span>
                    <span>•</span>
                    <span>{question.views} views</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {question.likes}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <Button variant="outline">Load More Questions</Button>
      </div>
    </div>
  );
};

export default CommunityQA;
