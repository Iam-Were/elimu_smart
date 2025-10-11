import React, { useState, useEffect } from 'react';
import { AdminDataTable, type TableColumn } from '@/components/admin/AdminDataTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Plus, X } from 'lucide-react';
import { getParse } from '@/config/parse';

interface University extends Record<string, unknown> {
  id: string;
  universityId: string;
  name: string;
  type: string;
  location: string;
  website?: string;
  ranking?: number;
  accreditation?: string;
  specializations?: string[];
  founded?: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UniversitiesManagementPage: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Public',
    location: '',
    website: '',
    ranking: '',
    accreditation: '',
    specializations: '',
    founded: '',
    description: ''
  });

  // Fetch universities
  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getUniversities', {
        page: 1,
        limit: 100
      });

      setUniversities(result.universities);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const Parse = await getParse();
      const params = {
        ...formData,
        ranking: formData.ranking ? parseInt(formData.ranking) : undefined,
        founded: formData.founded ? parseInt(formData.founded) : undefined,
        specializations: formData.specializations
          ? formData.specializations.split(',').map(s => s.trim())
          : []
      };

      if (editingUniversity) {
        // Update
        await Parse.Cloud.run('updateUniversity', {
          id: editingUniversity.id,
          ...params
        });
      } else {
        // Create
        await Parse.Cloud.run('createUniversity', params);
      }

      // Reset form and refresh
      setFormData({
        name: '',
        type: 'Public',
        location: '',
        website: '',
        ranking: '',
        accreditation: '',
        specializations: '',
        founded: '',
        description: ''
      });
      setShowCreateForm(false);
      setEditingUniversity(null);
      fetchUniversities();
    } catch (error) {
      console.error('Error saving university:', error);
      alert('Failed to save university. Please try again.');
    }
  };

  // Handle edit
  const handleEdit = (university: University) => {
    setEditingUniversity(university);
    setFormData({
      name: university.name,
      type: university.type,
      location: university.location || '',
      website: university.website || '',
      ranking: university.ranking?.toString() || '',
      accreditation: university.accreditation || '',
      specializations: university.specializations?.join(', ') || '',
      founded: university.founded?.toString() || '',
      description: university.description || ''
    });
    setShowCreateForm(true);
  };

  // Handle delete
  const handleDelete = async (university: University) => {
    if (!confirm(`Are you sure you want to delete "${university.name}"?`)) {
      return;
    }

    try {
      const Parse = await getParse();
      await Parse.Cloud.run('deleteUniversity', { id: university.id });
      fetchUniversities();
    } catch (error) {
      console.error('Error deleting university:', error);
      alert('Failed to delete university. Please try again.');
    }
  };

  // Table columns
  const columns: TableColumn<University>[] = [
    {
      id: 'name',
      label: 'University Name',
      type: 'text',
      sortable: true,
      filterable: true
    },
    {
      id: 'type',
      label: 'Type',
      type: 'badge',
      sortable: true,
      filterable: true
    },
    {
      id: 'location',
      label: 'Location',
      type: 'text',
      sortable: true
    },
    {
      id: 'ranking',
      label: 'Ranking',
      type: 'number',
      sortable: true
    },
    {
      id: 'specializations',
      label: 'Specializations',
      type: 'custom',
      render: (value: unknown) => {
        const specs = value as string[] | undefined;
        if (!specs || specs.length === 0) return 'N/A';
        return (
          <div className="flex flex-wrap gap-1">
            {specs.slice(0, 2).map((spec, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            {specs.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{specs.length - 2}
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
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
                <GraduationCap className="h-8 w-8" />
              </div>
              Universities Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage Kenyan universities and institutions
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingUniversity(null);
              setFormData({
                name: '',
                type: 'Public',
                location: '',
                website: '',
                ranking: '',
                accreditation: '',
                specializations: '',
                founded: '',
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
                Add University
              </>
            )}
          </Button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900">
                {editingUniversity ? 'Edit University' : 'Create New University'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">University Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="University of Nairobi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                      <option value="Chartered">Chartered</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Nairobi, Kenya"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.ac.ke"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ranking">Ranking</Label>
                    <Input
                      id="ranking"
                      type="number"
                      value={formData.ranking}
                      onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
                      placeholder="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input
                      id="founded"
                      type="number"
                      value={formData.founded}
                      onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                      placeholder="1956"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="accreditation">Accreditation</Label>
                    <Input
                      id="accreditation"
                      value={formData.accreditation}
                      onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                      placeholder="Commission for University Education (CUE)"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                    <Input
                      id="specializations"
                      value={formData.specializations}
                      onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                      placeholder="Engineering, Medicine, Business, Law"
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
                      placeholder="Brief description of the university..."
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingUniversity(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                    {editingUniversity ? 'Update' : 'Create'} University
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        <AdminDataTable<University>
          data={universities}
          columns={columns}
          onRowEdit={handleEdit}
          onRowDelete={handleDelete}
          loading={loading}
          title="Universities"
          searchable
          exportable
          pageSize={20}
        />
      </div>
    </div>
  );
};

export default UniversitiesManagementPage;
