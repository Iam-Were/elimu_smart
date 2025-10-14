import React, { useState, useEffect } from 'react';
import { AdminDataTable, type TableColumn } from '@/components/admin/AdminDataTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, X } from 'lucide-react';
import { getParse } from '@/config/parse';

interface Career extends Record<string, unknown> {
  id: string;
  careerId: string;
  title: string;
  category: string;
  description: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  educationLevel?: string;
  relatedSubjects?: string[];
  keySkills?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const CareersManagementPage: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Healthcare & Medical',
    description: '',
    salaryRangeMin: '',
    salaryRangeMax: '',
    educationLevel: '',
    relatedSubjects: '',
    keySkills: ''
  });

  // Career categories (matching backend data)
  const categories = [
    'Healthcare & Medical',
    'Engineering & Technology',
    'Business & Finance',
    'Education & Training',
    'Law & Legal Services',
    'Agriculture & Environment',
    'Arts & Creative Industries',
    'Social Sciences & Humanities',
    'Science & Research',
    'Skilled Trades'
  ];

  // Fetch careers
  const fetchCareers = async () => {
    try {
      setLoading(true);
      const Parse = getParse();
      const result = await Parse.Cloud.run('getCareers', {
        page: 1,
        limit: 100
      });

      setCareers(result.careers);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const Parse = getParse();
      const params = {
        ...formData,
        salaryRangeMin: formData.salaryRangeMin ? parseInt(formData.salaryRangeMin) : undefined,
        salaryRangeMax: formData.salaryRangeMax ? parseInt(formData.salaryRangeMax) : undefined,
        relatedSubjects: formData.relatedSubjects
          ? formData.relatedSubjects.split(',').map(s => s.trim())
          : [],
        keySkills: formData.keySkills
          ? formData.keySkills.split(',').map(s => s.trim())
          : []
      };

      if (editingCareer) {
        // Update
        await Parse.Cloud.run('updateCareer', {
          id: editingCareer.id,
          ...params
        });
      } else {
        // Create
        await Parse.Cloud.run('createCareer', params);
      }

      // Reset form and refresh
      setFormData({
        title: '',
        category: 'Healthcare & Medical',
        description: '',
        salaryRangeMin: '',
        salaryRangeMax: '',
        educationLevel: '',
        relatedSubjects: '',
        keySkills: ''
      });
      setShowCreateForm(false);
      setEditingCareer(null);
      fetchCareers();
    } catch (error) {
      console.error('Error saving career:', error);
      alert('Failed to save career. Please try again.');
    }
  };

  // Handle edit
  const handleEdit = (career: Career) => {
    setEditingCareer(career);
    setFormData({
      title: career.title,
      category: career.category,
      description: career.description || '',
      salaryRangeMin: career.salaryRangeMin?.toString() || '',
      salaryRangeMax: career.salaryRangeMax?.toString() || '',
      educationLevel: career.educationLevel || '',
      relatedSubjects: career.relatedSubjects?.join(', ') || '',
      keySkills: career.keySkills?.join(', ') || ''
    });
    setShowCreateForm(true);
  };

  // Handle delete
  const handleDelete = async (career: Career) => {
    if (!confirm(`Are you sure you want to delete "${career.title}"?`)) {
      return;
    }

    try {
      const Parse = getParse();
      await Parse.Cloud.run('deleteCareer', { id: career.id });
      fetchCareers();
    } catch (error) {
      console.error('Error deleting career:', error);
      alert('Failed to delete career. Please try again.');
    }
  };

  // Table columns
  const columns: TableColumn<Career>[] = [
    {
      id: 'title',
      label: 'Career Title',
      type: 'text',
      sortable: true,
      filterable: true
    },
    {
      id: 'category',
      label: 'Category',
      type: 'badge',
      sortable: true,
      filterable: true
    },
    {
      id: 'educationLevel',
      label: 'Education Level',
      type: 'text',
      sortable: true
    },
    {
      id: 'salaryRangeMin',
      label: 'Min Salary (KES)',
      type: 'number',
      sortable: true,
      render: (value: unknown) => {
        const salary = value as number | undefined;
        if (!salary) return 'N/A';
        return `KES ${salary.toLocaleString()}`;
      }
    },
    {
      id: 'salaryRangeMax',
      label: 'Max Salary (KES)',
      type: 'number',
      sortable: true,
      render: (value: unknown) => {
        const salary = value as number | undefined;
        if (!salary) return 'N/A';
        return `KES ${salary.toLocaleString()}`;
      }
    },
    {
      id: 'relatedSubjects',
      label: 'Related Subjects',
      type: 'custom',
      render: (value: unknown) => {
        const subjects = value as string[] | undefined;
        if (!subjects || subjects.length === 0) return 'N/A';
        return (
          <div className="flex flex-wrap gap-1">
            {subjects.slice(0, 2).map((subject, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
            {subjects.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{subjects.length - 2}
              </Badge>
            )}
          </div>
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
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg">
                <Briefcase className="h-8 w-8" />
              </div>
              Careers Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage career profiles and information for Kenyan students
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingCareer(null);
              setFormData({
                title: '',
                category: 'Healthcare & Medical',
                description: '',
                salaryRangeMin: '',
                salaryRangeMax: '',
                educationLevel: '',
                relatedSubjects: '',
                keySkills: ''
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
                Add Career
              </>
            )}
          </Button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900">
                {editingCareer ? 'Edit Career' : 'Create New Career'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Career Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Medical Doctor"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">Education Level</Label>
                    <Input
                      id="educationLevel"
                      value={formData.educationLevel}
                      onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                      placeholder="Bachelor's Degree, Diploma, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salaryRangeMin">Min Salary (KES)</Label>
                    <Input
                      id="salaryRangeMin"
                      type="number"
                      value={formData.salaryRangeMin}
                      onChange={(e) => setFormData({ ...formData, salaryRangeMin: e.target.value })}
                      placeholder="50000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salaryRangeMax">Max Salary (KES)</Label>
                    <Input
                      id="salaryRangeMax"
                      type="number"
                      value={formData.salaryRangeMax}
                      onChange={(e) => setFormData({ ...formData, salaryRangeMax: e.target.value })}
                      placeholder="500000"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="relatedSubjects">Related Subjects (comma-separated)</Label>
                    <Input
                      id="relatedSubjects"
                      value={formData.relatedSubjects}
                      onChange={(e) => setFormData({ ...formData, relatedSubjects: e.target.value })}
                      placeholder="Biology, Chemistry, Physics, Mathematics"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="keySkills">Key Skills (comma-separated)</Label>
                    <Input
                      id="keySkills"
                      value={formData.keySkills}
                      onChange={(e) => setFormData({ ...formData, keySkills: e.target.value })}
                      placeholder="Critical thinking, Problem-solving, Communication"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={4}
                      placeholder="Detailed description of the career, typical responsibilities, work environment..."
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingCareer(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                    {editingCareer ? 'Update' : 'Create'} Career
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        <AdminDataTable<Career>
          data={careers}
          columns={columns}
          onRowEdit={handleEdit}
          onRowDelete={handleDelete}
          loading={loading}
          title="Careers"
          searchable
          exportable
          pageSize={20}
        />
      </div>
    </div>
  );
};

export default CareersManagementPage;
