import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, Github, ExternalLink, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { getParse } from '@/config/parse';

interface ProjectFormData {
  title: string;
  type: string;
  status: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
}

interface ProfileProject {
  id: string;
  title: string;
  type: string;
  status: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  startDate?: string;
  endDate?: string;
}

interface AddProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: ProfileProject) => void;
}

export const AddProjectDialog: React.FC<AddProjectDialogProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    type: 'Personal Project',
    status: 'In Progress',
    description: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    startDate: '',
    endDate: '',
    isOngoing: true
  });

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(tech => tech !== techToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('addUserProject', {
        title: formData.title,
        type: formData.type,
        status: formData.status,
        description: formData.description,
        technologies: formData.technologies,
        githubUrl: formData.githubUrl || undefined,
        liveUrl: formData.liveUrl || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.isOngoing ? undefined : (formData.endDate || undefined)
      });

      if (result.success) {
        toast.success('Project added successfully!');
        onSuccess(result.project);
        onClose();
        // Reset form
        setFormData({
          title: '',
          type: 'Personal Project',
          status: 'In Progress',
          description: '',
          technologies: [],
          githubUrl: '',
          liveUrl: '',
          startDate: '',
          endDate: '',
          isOngoing: true
        });
      } else {
        throw new Error(result.message || 'Failed to add project');
      }
    } catch (error) {
      console.error('Failed to add project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>
            Showcase your work to stand out to counselors and universities
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Title */}
          <div>
            <Label htmlFor="title">
              Project Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Student Management System"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-1.5"
            />
          </div>

          {/* Type and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal Project">Personal Project</SelectItem>
                  <SelectItem value="School Project">School Project</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Hackathon">Hackathon</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what you built, what you learned, and the impact..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Focus on the problem you solved and skills you gained
            </p>
          </div>

          {/* Technologies (Tags Input) */}
          <div>
            <Label htmlFor="technologies">Technologies Used</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="technologies"
                placeholder="Type and press Enter (e.g., React, Python)"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTech}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Technology Badges */}
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.technologies.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 flex items-center gap-1"
                  >
                    {tech}
                    <button
                      type="button"
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      onClick={() => handleRemoveTech(tech)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* GitHub and Live URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
              <div className="relative mt-1.5">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="githubUrl"
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="liveUrl">Live Demo URL (Optional)</Label>
              <div className="relative mt-1.5">
                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="liveUrl"
                  type="url"
                  placeholder="https://myproject.com"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date (Optional)</Label>
              <Input
                id="startDate"
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="endDate">
                {formData.isOngoing ? 'Ongoing' : 'End Date (Optional)'}
              </Label>
              <Input
                id="endDate"
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={formData.isOngoing}
                className="mt-1.5"
              />
              <label className="flex items-center gap-2 mt-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.isOngoing}
                  onChange={(e) => setFormData({ ...formData, isOngoing: e.target.checked })}
                  className="rounded"
                />
                <span className="text-gray-600">Currently working on this</span>
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || !formData.description.trim() || saving}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
