import React, { useState, useEffect } from 'react';
import { Send, Users, MessageSquare, Save, Edit2, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useMessaging } from '../../hooks/counselor/useMessaging';
import { useAssignedStudents } from '../../hooks/counselor/useAssignedStudents';

interface MessageTemplate {
  id?: string;
  title: string;
  content: string;
  category?: string;
  placeholders?: string[];
}

export const BulkMessaging: React.FC = () => {
  const { sendBulkMessage, createMessageTemplate, getMessageTemplates, updateMessageTemplate, deleteMessageTemplate, isLoading, error } = useMessaging();
  const { students } = useAssignedStudents();
  
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<MessageTemplate>({ title: '', content: '', category: 'general' });
  const [sendResult, setSendResult] = useState<{ success: any[]; failed: any[] } | null>(null);

  useEffect(() => {
    loadTemplates();
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
      alert('Please select at least one student');
      return;
    }
    if (!message.trim()) {
      alert('Please enter a message');
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
    } catch (err: any) {
      alert(`Failed to send messages: ${err.message}`);
    }
  };

  const handleSaveTemplate = async () => {
    if (!newTemplate.title || !newTemplate.content) {
      alert('Please fill in title and content');
      return;
    }

    try {
      await createMessageTemplate(newTemplate);
      setNewTemplate({ title: '', content: '', category: 'general' });
      loadTemplates();
      alert('Template saved successfully!');
    } catch (err: any) {
      alert(`Failed to save template: ${err.message}`);
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
      alert('Template updated successfully!');
    } catch (err: any) {
      alert(`Failed to update template: ${err.message}`);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await deleteMessageTemplate(templateId);
      loadTemplates();
    } catch (err: any) {
      alert(`Failed to delete template: ${err.message}`);
    }
  };

  const handleUseTemplate = (template: MessageTemplate) => {
    setMessage(template.content);
    setSubject(template.title);
    setShowTemplates(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-800">Bulk Messaging</h2>
          </div>
          <p className="text-gray-600 mt-2">Send messages to multiple students at once</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {sendResult && (
          <div className="p-4 bg-green-50 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="font-semibold text-green-800">Messages Sent!</p>
            </div>
            <p className="text-sm text-green-700">Successfully sent to {sendResult.success.length} student(s)</p>
            {sendResult.failed.length > 0 && (
              <p className="text-sm text-red-600 mt-1">Failed to send to {sendResult.failed.length} student(s)</p>
            )}
          </div>
        )}

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Selection */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Select Students</h3>
              <button
                onClick={handleSelectAll}
                className="text-sm text-yellow-600 hover:text-yellow-700"
              >
                {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {students.map(student => (
                <label
                  key={student.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleToggleStudent(student.id)}
                    className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{selectedStudents.length} selected</span>
            </div>
          </div>

          {/* Message Composer */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Compose Message</h3>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                {showTemplates ? 'Hide Templates' : 'Use Template'}
              </button>
            </div>

            {showTemplates && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-800 mb-3">Saved Templates</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {templates.map(template => (
                    <div key={template.id} className="bg-white p-3 rounded border border-gray-200 flex items-start justify-between">
                      <div className="flex-1 cursor-pointer" onClick={() => handleUseTemplate(template)}>
                        <p className="font-medium text-gray-800 text-sm">{template.title}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.content}</p>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => setEditingTemplate(template)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id!)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject (Optional)</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Message subject..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                placeholder="Type your message here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 resize-none"
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={isLoading || selectedStudents.length === 0 || !message.trim()}
              className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {isLoading ? 'Sending...' : `Send to ${selectedStudents.length} Student(s)`}
            </button>

            {/* Save as Template */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-800 mb-3">Save as Template</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                  placeholder="Template title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                />
                <textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  rows={4}
                  placeholder="Template content..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 resize-none"
                />
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="general">General</option>
                  <option value="reminder">Reminder</option>
                  <option value="announcement">Announcement</option>
                  <option value="followup">Follow-up</option>
                </select>
                <button
                  onClick={handleSaveTemplate}
                  disabled={isLoading}
                  className="w-full bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Template</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editingTemplate.title}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
              <textarea
                value={editingTemplate.content}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateTemplate}
                  className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
