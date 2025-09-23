import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { getParse } from '@/config/parse';
import { MessageSquare, Send, Clock, TrendingUp } from 'lucide-react';

const QuickQuestions: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;

    setIsSubmitting(true);
    try {
      const Parse = await getParse();
      // Uses Parse function: sendMessage (to counselor Q&A channel)
      await Parse.Cloud.run('sendMessage', {
        roomId: 'qa_channel',
        content: question,
        type: 'question'
      });
      setQuestion('');
    } catch (error) {
      console.error('Question submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleQuestions = [
    {
      question: 'Can I do engineering with C+ in Math?',
      category: 'Academic',
      answers: 3,
      status: 'answered'
    },
    {
      question: 'How do I tell my parents I want to change careers?',
      category: 'Family',
      answers: 5,
      status: 'answered'
    },
    {
      question: 'What careers match my subjects?',
      category: 'Career',
      answers: 2,
      status: 'answered'
    }
  ];

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

          {/* Recent Questions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-orange-600">127</div>
                <div className="text-sm text-muted-foreground">Questions Answered</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600">4.2h</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-muted-foreground">Helpful Rate</div>
              </Card>
            </div>

            <div className="space-y-3">
              {sampleQuestions.map((q, index) => (
                <Card key={index} className="border-orange-200/50">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{q.question}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {q.category}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {q.answers} answers
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {q.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2 text-orange-600">
                      Read Answer
                    </Button>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" className="w-full gap-2">
                Load More Questions
                <TrendingUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickQuestions;