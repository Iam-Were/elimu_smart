import React, { useState, useEffect } from 'react';
import { AdminDataTable, type TableColumn } from '@/components/admin/AdminDataTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, X } from 'lucide-react';
import { getParse } from '@/config/parse';

interface Course extends Record<string, unknown> {
  id: string;
  courseId: string;
  title: string;
  category: string;
  level?: string;
  duration?: string;
  requirements?: string;
  cutoffPoints?: number;
  careerPathways?: string[];
  description?: string;
  isActive: boolean;
  university?: {
    id: string;
    name: string;
    type: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface University {
  id: string;
  name: string;
  type: string;
}

export const CoursesManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering',
    level: "Bachelor's Degree",
    universityId: '',
    duration: '',
    requirements: '',
    cutoffPoints: '',
    careerPathways: '',
    description: ''
  });

  // Course categories
  const categories = [
    'Engineering',
    'Medicine & Health Sciences',
    'Business & Management',
    'Law',
    'Agriculture',
    'Education',
    'Arts & Humanities',
    'Science',
    'Technology & IT',
    'Social Sciences'
  ];

  // Education levels
  const levels = [
    "Bachelor's Degree",
    "Master's Degree",
    'Diploma',
    'Certificate',
    'PhD/Doctorate'
  ];

  // Fetch universities for dropdown
  const fetchUniversities = async () => {
    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getUniversities', {
        page: 1,
        limit: 100
      });
      setUniversities(result.universities);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getCourses', {
        page: 1,
        limit: 200
      });

      setCourses(result.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
    fetchCourses();
  }, []);

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const Parse = await getParse();
      const params = {
        ...formData,
        cutoffPoints: formData.cutoffPoints ? parseInt(formData.cutoffPoints) : undefined,
        careerPathways: formData.careerPathways
          ? formData.careerPathways.split(',').map(s => s.trim())
          : []
      };

      if (editingCourse) {
        // Update
        await Parse.Cloud.run('updateCourse', {
          id: editingCourse.id,
          ...params
        });
      } else {
        // Create
        await Parse.Cloud.run('createCourse', params);
      }

      // Reset form and refresh
      setFormData({
        title: '',
        category: 'Engineering',
        level: "Bachelor's Degree",
        universityId: '',
        duration: '',
        requirements: '',
        cutoffPoints: '',
        careerPathways: '',
        description: ''
      });
      setShowCreateForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course. Please try again.');
    }
  };

  // Handle edit
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      category: course.category,
      level: course.level || "Bachelor's Degree",
      universityId: course.university?.id || '',
      duration: course.duration || '',
      requirements: course.requirements || '',
      cutoffPoints: course.cutoffPoints?.toString() || '',
      careerPathways: course.careerPathways?.join(', ') || '',
      description: course.description || ''
    });
    setShowCreateForm(true);
  };

  // Handle delete
  const handleDelete = async (course: Course) => {
    if (!confirm(`Are you sure you want to delete "${course.title}"?`)) {
      return;
    }

    try {
      const Parse = await getParse();
      await Parse.Cloud.run('deleteCourse', { id: course.id });
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    }
  };

  // Table columns
  const columns: TableColumn<Course>[] = [
    {
      id: 'title',
      label: 'Course Title',
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
      id: 'university',
      label: 'University',
      type: 'custom',
      sortable: true,
      render: (value: unknown) => {
        const uni = value as { name: string; type: string } | null | undefined;
        if (!uni) return 'N/A';
        return (
          <div>
            <div className="font-medium text-gray-900">{uni.name}</div>
            <div className="text-xs text-gray-500">{uni.type}</div>
          </div>
        );
      }
    },
    {
      id: 'level',
      label: 'Level',
      type: 'text',
      sortable: true
    },
    {
      id: 'duration',
      label: 'Duration',
      type: 'text',
      sortable: true
    },
    {
      id: 'cutoffPoints',
      label: 'Cutoff Points',
      type: 'number',
      sortable: true
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
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <BookOpen className="h-8 w-8" />
              </div>
              Courses Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage university courses and programs
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingCourse(null);
              setFormData({
                title: '',
                category: 'Engineering',
                level: "Bachelor's Degree",
                universityId: '',
                duration: '',
                requirements: '',
                cutoffPoints: '',
                careerPathways: '',
                description: ''
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
                Add Course
              </>
            )}
          </Button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Bachelor of Engineering"
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
                    <Label htmlFor="universityId">University *</Label>
                    <select
                      id="universityId"
                      value={formData.universityId}
                      onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select University</option>
                      {universities.map(uni => (
                        <option key={uni.id} value={uni.id}>
                          {uni.name} ({uni.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Education Level</Label>
                    <select
                      id="level"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {levels.map(lev => (
                        <option key={lev} value={lev}>{lev}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="4 years"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cutoffPoints">Cutoff Points (KUCCPS)</Label>
                    <Input
                      id="cutoffPoints"
                      type="number"
                      value={formData.cutoffPoints}
                      onChange={(e) => setFormData({ ...formData, cutoffPoints: e.target.value })}
                      placeholder="42"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="requirements">Entry Requirements</Label>
                    <Input
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="KCSE C+ (Plus), Mathematics B, Physics C+"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="careerPathways">Career Pathways (comma-separated)</Label>
                    <Input
                      id="careerPathways"
                      value={formData.careerPathways}
                      onChange={(e) => setFormData({ ...formData, careerPathways: e.target.value })}
                      placeholder="Civil Engineer, Structural Engineer, Architect"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Course overview and what students will learn..."
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingCourse(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                    {editingCourse ? 'Update' : 'Create'} Course
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        <AdminDataTable<Course>
          data={courses}
          columns={columns}
          onRowEdit={handleEdit}
          onRowDelete={handleDelete}
          loading={loading}
          title="Courses"
          searchable
          exportable
          pageSize={20}
        />
      </div>
    </div>
  );
};

export default CoursesManagementPage;
