import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getParse } from '@/config/parse';
import { MessageSquare, Send, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Question {
  id: string;
  question: string;
  answer?: string;
  category: string;
  status: 'pending' | 'answered';
  askedAt: Date;
  answeredAt?: Date;
}

const QuickQuestions: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myQuestions, setMyQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Load student's previous questions
  useEffect(() => {
    const loadMyQuestions = async () => {
      try {
        const Parse = await getParse();
        const result = await Parse.Cloud.run('getMyQuestions');

        if (result.success) {
          setMyQuestions(result.questions);
        }
      } catch (error) {
        console.warn('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMyQuestions();
  }, []);

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('submitQuestion', {
        question: question.trim(),
        category: category || undefined
      });

      if (result.success) {
        setQuestion('');
        setCategory('');
        setSuccessMessage(result.message);

        // Reload questions to show new one
        const updatedResult = await Parse.Cloud.run('getMyQuestions');
        if (updatedResult.success) {
          setMyQuestions(updatedResult.questions);
        }
      }
    } catch (error) {
      console.error('Question submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">Ask Quick Questions</h1>
          <p className="text-muted-foreground">Get expert answers within 4-6 hours</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ask Question */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                Ask Your Question
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {successMessage && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="What's on your mind?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                onClick={handleSubmitQuestion}
                disabled={!question.trim() || isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Question'}
                <Send className="h-4 w-4 ml-2" />
              </Button>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Answers in 4-6 hours
              </div>
            </CardContent>
          </Card>

          {/* My Questions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {myQuestions.filter(q => q.status === 'answered').length}
                </div>
                <div className="text-sm text-muted-foreground">Questions Answered</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {myQuestions.filter(q => q.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">{myQuestions.length}</div>
                <div className="text-sm text-muted-foreground">Total Asked</div>
              </Card>
            </div>

            {loading ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Loading your questions...</p>
              </Card>
            ) : myQuestions.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You haven't asked any questions yet. Submit your first question above!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {myQuestions.map((q) => (
                  <Card key={q.id} className="border-orange-200/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium mb-2">{q.question}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {q.category}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(q.askedAt).toLocaleDateString()}
                            </span>
                          </div>
                          {q.answer && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-sm text-green-900">{q.answer}</p>
                              <p className="text-xs text-green-600 mt-1">
                                Answered {q.answeredAt ? new Date(q.answeredAt).toLocaleDateString() : ''}
                              </p>
                            </div>
                          )}
                        </div>
                        <Badge
                          className={q.status === 'answered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                        >
                          {q.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickQuestions;