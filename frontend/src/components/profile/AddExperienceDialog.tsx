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
import { Loader2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { getParse } from '@/config/parse';

interface ExperienceFormData {
  title: string;
  company: string;
  type: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ProfileExperience {
  id: string;
  title: string;
  company: string;
  type: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  description: string;
}

interface AddExperienceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (experience: ProfileExperience) => void;
}

export const AddExperienceDialog: React.FC<AddExperienceDialogProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ExperienceFormData>({
    title: '',
    company: '',
    type: 'Internship',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.company.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.startDate) {
      toast.error('Please select a start date');
      return;
    }

    if (!formData.current && !formData.endDate) {
      toast.error('Please select an end date or mark as current position');
      return;
    }

    setSaving(true);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('addUserExperience', {
        title: formData.title,
        company: formData.company,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.current ? null : formData.endDate,
        current: formData.current,
        description: formData.description
      });

      if (result.success) {
        toast.success('Experience added successfully!');
        onSuccess(result.experience);
        onClose();
        // Reset form
        setFormData({
          title: '',
          company: '',
          type: 'Internship',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        });
      } else {
        throw new Error(result.message || 'Failed to add experience');
      }
    } catch (error) {
      console.error('Failed to add experience:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add experience');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Experience</DialogTitle>
          <DialogDescription>
            Add internships, volunteer work, or part-time jobs to strengthen your profile
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Title */}
          <div>
            <Label htmlFor="title">
              Job Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Software Engineering Intern"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-1.5"
            />
          </div>

          {/* Company/Organization */}
          <div>
            <Label htmlFor="company">
              Company/Organization <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company"
              placeholder="e.g., Safaricom PLC"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              className="mt-1.5"
            />
          </div>

          {/* Experience Type */}
          <div>
            <Label htmlFor="type">Experience Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Volunteer">Volunteer</SelectItem>
                <SelectItem value="Leadership">Leadership Role</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="endDate">
                {formData.current ? 'Present' : 'End Date'}
                {!formData.current && <span className="text-red-500"> *</span>}
              </Label>
              <Input
                id="endDate"
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={formData.current}
                required={!formData.current}
                className="mt-1.5"
              />
              <label className="flex items-center gap-2 mt-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                  className="rounded"
                />
                <span className="text-gray-600">I currently work here</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your responsibilities, achievements, and skills gained..."
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Use bullet points to highlight key achievements and responsibilities
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.title.trim() ||
                !formData.company.trim() ||
                !formData.description.trim() ||
                !formData.startDate ||
                (!formData.current && !formData.endDate) ||
                saving
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Add Experience
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
