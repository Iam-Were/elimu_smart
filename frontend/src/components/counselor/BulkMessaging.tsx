import { useState, useEffect } from 'react';
import { Send, Users, MessageSquare, Save, Edit2, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useMessaging } from '@/hooks/counselor/useMessaging';
import { useAssignedStudents } from '@/hooks/useAssignedStudents';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconContainer } from '@/components/ui/icon-container';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface MessageTemplate {
  id?: string;
  title: string;
  content: string;
  category?: string;
  placeholders?: string[];
}

export const BulkMessaging = () => {
  const { sendBulkMessage, createMessageTemplate, getMessageTemplates, updateMessageTemplate, deleteMessageTemplate, isLoading, error } = useMessaging();
  const { students } = useAssignedStudents();
  
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<MessageTemplate>({ title: '', content: '', category: 'general' });
  const [sendResult, setSendResult] = useState<{ success: string[]; failed: string[] } | null>(null);

  useEffect(() => {
    loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTemplates = async () => {
    try {
      const fetchedTemplates = await getMessageTemplates();
      setTemplates(fetchedTemplates);
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSendMessage = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      const result = await sendBulkMessage({
        studentIds: selectedStudents,
        message: message.trim(),
        subject: subject.trim() || undefined
      });
      setSendResult(result);
      setMessage('');
      setSubject('');
      setSelectedStudents([]);
      toast.success(`Successfully sent to ${result.success.length} student(s)`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send messages';
      toast.error(message);
    }
  };

  const handleSaveTemplate = async () => {
    if (!newTemplate.title || !newTemplate.content) {
      toast.error('Please fill in title and content');
      return;
    }

    try {
      await createMessageTemplate(newTemplate);
      setNewTemplate({ title: '', content: '', category: 'general' });
      loadTemplates();
      toast.success('Template saved successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save template';
      toast.error(message);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate?.id) return;

    try {
      await updateMessageTemplate(editingTemplate.id, {
        title: editingTemplate.title,
        content: editingTemplate.content,
        category: editingTemplate.category
      });
      setEditingTemplate(null);
      loadTemplates();
      toast.success('Template updated successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update template';
      toast.error(message);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteMessageTemplate(templateId);
      loadTemplates();
      toast.success('Template deleted');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete template';
      toast.error(message);
    }
  };

  const handleUseTemplate = (template: MessageTemplate) => {
    setMessage(template.content);
    setSubject(template.title);
    setShowTemplates(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <IconContainer variant="yellow" size="lg">
              <MessageSquare className="w-6 h-6" />
            </IconContainer>
            <div>
              <CardTitle>Bulk Messaging</CardTitle>
              <CardDescription>Send messages to multiple students at once</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {sendResult && (
            <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Successfully sent to {sendResult.success.length} student(s)
                {sendResult.failed.length > 0 && ` · Failed: ${sendResult.failed.length}`}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Selection */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold">Select Students</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                >
                  {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <Card className="max-h-96 overflow-y-auto">
                <div className="divide-y">
                  {students.map(student => (
                    <label
                      key={student.id}
                      className="flex items-center p-3 hover:bg-accent cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => handleToggleStudent(student.id)}
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </Card>

              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{selectedStudents.length} selected</span>
              </div>
            </div>

            {/* Message Composer */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Compose Message</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {showTemplates ? 'Hide Templates' : 'Use Template'}
                </Button>
              </div>

              {showTemplates && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Saved Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                    {templates.map(template => (
                      <Card key={template.id} className="hover:bg-accent transition-colors cursor-pointer">
                        <CardContent className="p-3 flex items-start justify-between">
                          <div className="flex-1" onClick={() => handleUseTemplate(template)}>
                            <p className="font-medium text-sm">{template.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.content}</p>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTemplate(template);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTemplate(template.id!);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="subject">Subject (Optional)</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Message subject..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  placeholder="Type your message here..."
                />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={isLoading || selectedStudents.length === 0 || !message.trim()}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                size="lg"
              >
                <Send className="w-5 h-5 mr-2" />
                {isLoading ? 'Sending...' : `Send to ${selectedStudents.length} Student(s)`}
              </Button>

              {/* Save as Template */}
              <Card className="border-dashed mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Save as Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="template-title">Template Title</Label>
                    <Input
                      id="template-title"
                      value={newTemplate.title}
                      onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                      placeholder="Template title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-content">Content</Label>
                    <Textarea
                      id="template-content"
                      value={newTemplate.content}
                      onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                      rows={4}
                      placeholder="Template content..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-category">Category</Label>
                    <Select
                      value={newTemplate.category}
                      onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                    >
                      <SelectTrigger id="template-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="followup">Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSaveTemplate}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Update your message template</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editingTemplate?.title || ''}
                onChange={(e) => editingTemplate && setEditingTemplate({ ...editingTemplate, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={editingTemplate?.content || ''}
                onChange={(e) => editingTemplate && setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                rows={6}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleUpdateTemplate}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
              >
                Update
              </Button>
              <Button
                onClick={() => setEditingTemplate(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
