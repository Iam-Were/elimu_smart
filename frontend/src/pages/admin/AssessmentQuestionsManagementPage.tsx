import React, { useState, useEffect } from 'react';
import { AdminDataTable, type TableColumn } from '@/components/admin/AdminDataTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Plus, X } from 'lucide-react';
import { getParse } from '@/config/parse';

interface AssessmentQuestion extends Record<string, unknown> {
  id: string;
  type: 'riasec' | 'skills';
  questionId: number;
  category: string;
  statement?: string; // RIASEC only
  text?: string; // Skills only
  riasecType?: string; // RIASEC only (R/I/A/S/E/C)
  kenyaContext?: string; // RIASEC only
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const AssessmentQuestionsManagementPage: React.FC = () => {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'riasec' | 'skills'>('all');

  // Form state
  const [formData, setFormData] = useState({
    type: 'riasec' as 'riasec' | 'skills',
    category: '',
    statement: '',
    text: '',
    riasecType: 'R',
    kenyaContext: ''
  });

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getAssessmentQuestions', {
        page: 1,
        limit: 200,
        type: filterType === 'all' ? undefined : filterType
      });

      setQuestions(result.questions);
    } catch (error) {
      console.error('Error fetching assessment questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filterType]);

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const Parse = await getParse();
      const params = {
        ...formData,
        questionId: editingQuestion?.questionId
      };

      if (editingQuestion) {
        // Update
        await Parse.Cloud.run('updateAssessmentQuestion', {
          id: editingQuestion.id,
          type: editingQuestion.type,
          ...params
        });
      } else {
        // Create
        await Parse.Cloud.run('createAssessmentQuestion', params);
      }

      // Reset form and refresh
      setFormData({
        type: 'riasec',
        category: '',
        statement: '',
        text: '',
        riasecType: 'R',
        kenyaContext: ''
      });
      setShowCreateForm(false);
      setEditingQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question. Please try again.');
    }
  };

  // Handle edit
  const handleEdit = (question: AssessmentQuestion) => {
    setEditingQuestion(question);
    setFormData({
      type: question.type,
      category: question.category || '',
      statement: question.statement || '',
      text: question.text || '',
      riasecType: question.riasecType || 'R',
      kenyaContext: question.kenyaContext || ''
    });
    setShowCreateForm(true);
  };

  // Handle delete
  const handleDelete = async (question: AssessmentQuestion) => {
    if (!confirm(`Are you sure you want to delete this question?`)) {
      return;
    }

    try {
      const Parse = await getParse();
      await Parse.Cloud.run('deleteAssessmentQuestion', {
        id: question.id,
        type: question.type
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question. Please try again.');
    }
  };

  // Table columns
  const columns: TableColumn<AssessmentQuestion>[] = [
    {
      id: 'questionId',
      label: 'ID',
      type: 'number',
      sortable: true
    },
    {
      id: 'type',
      label: 'Type',
      type: 'badge',
      sortable: true,
      filterable: true
    },
    {
      id: 'category',
      label: 'Category',
      type: 'text',
      sortable: true,
      filterable: true
    },
    {
      id: 'statement',
      label: 'Question',
      type: 'custom',
      render: (value: unknown, row: AssessmentQuestion) => {
        const text = row.type === 'riasec' ? row.statement : row.text;
        return (
          <div className="max-w-md truncate" title={text as string}>
            {text}
          </div>
        );
      }
    },
    {
      id: 'riasecType',
      label: 'RIASEC',
      type: 'custom',
      render: (value: unknown, row: AssessmentQuestion) => {
        if (row.type !== 'riasec') return <span className="text-gray-400">N/A</span>;
        return (
          <Badge variant="secondary" className="text-xs">
            {row.riasecType}
          </Badge>
        );
      }
    },
    {
      id: 'isActive',
      label: 'Status',
      type: 'boolean',
      sortable: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <ClipboardList className="h-8 w-8" />
              </div>
              Assessment Questions Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage RIASEC and Skills assessment questions
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingQuestion(null);
              setFormData({
                type: 'riasec',
                category: '',
                statement: '',
                text: '',
                riasecType: 'R',
                kenyaContext: ''
              });
              setShowCreateForm(!showCreateForm);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {showCreateForm ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </>
            )}
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterType('all')}
            size="sm"
          >
            All Questions
          </Button>
          <Button
            variant={filterType === 'riasec' ? 'default' : 'outline'}
            onClick={() => setFilterType('riasec')}
            size="sm"
          >
            RIASEC (96)
          </Button>
          <Button
            variant={filterType === 'skills' ? 'default' : 'outline'}
            onClick={() => setFilterType('skills')}
            size="sm"
          >
            Skills (36)
          </Button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900">
                {editingQuestion ? 'Edit Question' : 'Create New Question'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Question Type *</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'riasec' | 'skills' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                      disabled={!!editingQuestion}
                    >
                      <option value="riasec">RIASEC (Career Interest)</option>
                      <option value="skills">Skills Assessment</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      placeholder={formData.type === 'riasec' ? 'activities, skills, occupations' : 'technical, communication, leadership'}
                    />
                  </div>

                  {formData.type === 'riasec' ? (
                    <>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="statement">Statement *</Label>
                        <Input
                          id="statement"
                          value={formData.statement}
                          onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                          required
                          placeholder="Test the quality of parts before shipment"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="riasecType">RIASEC Type *</Label>
                        <select
                          id="riasecType"
                          value={formData.riasecType}
                          onChange={(e) => setFormData({ ...formData, riasecType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="R">R - Realistic (Doers)</option>
                          <option value="I">I - Investigative (Thinkers)</option>
                          <option value="A">A - Artistic (Creators)</option>
                          <option value="S">S - Social (Helpers)</option>
                          <option value="E">E - Enterprising (Persuaders)</option>
                          <option value="C">C - Conventional (Organizers)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kenyaContext">Kenya Context</Label>
                        <Input
                          id="kenyaContext"
                          value={formData.kenyaContext}
                          onChange={(e) => setFormData({ ...formData, kenyaContext: e.target.value })}
                          placeholder="Quality control in Kenya manufacturing"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="text">Question Text *</Label>
                      <Input
                        id="text"
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        required
                        placeholder="I can troubleshoot technical problems effectively"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingQuestion(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                    {editingQuestion ? 'Update' : 'Create'} Question
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        <AdminDataTable<AssessmentQuestion>
          data={questions}
          columns={columns}
          onRowEdit={handleEdit}
          onRowDelete={handleDelete}
          loading={loading}
          title="Assessment Questions"
          searchable
          exportable
          pageSize={20}
        />
      </div>
    </div>
  );
};

export default AssessmentQuestionsManagementPage;
