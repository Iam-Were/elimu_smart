import React, { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Target, Sparkles, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { getParse } from '@/config/parse';
import { cn } from '@/lib/utils';

interface ProfileSkill {
  name: string;
  category: string;
  level: number;
}

interface AddSkillsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (skills: ProfileSkill[]) => void;
  existingSkills: ProfileSkill[];
  userRiasecType?: string;
  userProjects?: Array<{ technologies: string[] }>;
}

const SKILL_CATEGORIES = [
  'Technical Skills',
  'Communication',
  'Leadership',
  'Critical Thinking',
  'Creativity',
  'Teamwork',
  'Problem Solving',
  'Time Management',
  'Research',
  'Other'
];

const SKILL_LEVELS = [
  { value: 25, label: 'Beginner' },
  { value: 50, label: 'Intermediate' },
  { value: 75, label: 'Advanced' },
  { value: 100, label: 'Expert' }
];

export const AddSkillsDialog: React.FC<AddSkillsDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  existingSkills,
  userRiasecType,
  userProjects
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [manualSkill, setManualSkill] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<ProfileSkill[]>([]);

  // Load AI-suggested skills based on RIASEC and projects
  useEffect(() => {
    const loadSuggestions = async () => {
      if (!isOpen) return;

      setLoading(true);
      try {
        const Parse = await getParse();

        // Extract technologies from projects
        const technologies = userProjects?.flatMap(p => p.technologies || []) || [];

        // Call backend for AI suggestions
        const result = await Parse.Cloud.run('suggestSkills', {
          riasecType: userRiasecType,
          projectTechnologies: technologies,
          existingSkills: existingSkills.map(s => s.name)
        });

        if (result.success && result.suggestions) {
          setSuggestedSkills(result.suggestions);
        } else {
          // Fallback to hardcoded suggestions if backend fails
          const fallbackSuggestions = getFallbackSuggestions(userRiasecType, technologies);
          setSuggestedSkills(fallbackSuggestions);
        }
      } catch (error) {
        console.error('Failed to load skill suggestions:', error);
        // Use fallback suggestions
        const technologies = userProjects?.flatMap(p => p.technologies || []) || [];
        const fallbackSuggestions = getFallbackSuggestions(userRiasecType, technologies);
        setSuggestedSkills(fallbackSuggestions);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
    // getFallbackSuggestions is defined below but stable (doesn't change between renders)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userRiasecType, userProjects, existingSkills]);

  const getFallbackSuggestions = (riasecType?: string, technologies: string[] = []): string[] => {
    const suggestions = new Set<string>();

    // Add technologies from projects
    technologies.forEach(tech => suggestions.add(tech));

    // Add RIASEC-based suggestions
    const riasecSkills: Record<string, string[]> = {
      'R': ['Problem Solving', 'Attention to Detail', 'Technical Skills', 'Manual Dexterity'],
      'I': ['Research', 'Critical Thinking', 'Data Analysis', 'Problem Solving'],
      'A': ['Creativity', 'Design', 'Communication', 'Innovation'],
      'S': ['Communication', 'Empathy', 'Teamwork', 'Leadership'],
      'E': ['Leadership', 'Public Speaking', 'Negotiation', 'Project Management'],
      'C': ['Organization', 'Attention to Detail', 'Time Management', 'Data Entry']
    };

    if (riasecType && riasecSkills[riasecType]) {
      riasecSkills[riasecType].forEach(skill => suggestions.add(skill));
    }

    // Add common student skills
    ['Communication', 'Teamwork', 'Time Management', 'Critical Thinking'].forEach(s => suggestions.add(s));

    // Filter out existing skills
    const existingNames = existingSkills.map(s => s.name.toLowerCase());
    return Array.from(suggestions).filter(s => !existingNames.includes(s.toLowerCase())).slice(0, 12);
  };

  const handleAddSuggestion = (skillName: string) => {
    if (selectedSkills.some(s => s.name === skillName)) {
      toast.info('Skill already added');
      return;
    }

    const category = categorizeSkill(skillName);
    const newSkill: ProfileSkill = {
      name: skillName,
      category,
      level: 50 // Default to intermediate
    };

    setSelectedSkills([...selectedSkills, newSkill]);
  };

  const handleAddManual = () => {
    if (!manualSkill.trim()) return;

    if (selectedSkills.some(s => s.name.toLowerCase() === manualSkill.toLowerCase())) {
      toast.info('Skill already added');
      return;
    }

    const category = categorizeSkill(manualSkill);
    const newSkill: ProfileSkill = {
      name: manualSkill.trim(),
      category,
      level: 50
    };

    setSelectedSkills([...selectedSkills, newSkill]);
    setManualSkill('');
  };

  const categorizeSkill = (skillName: string): string => {
    const tech = ['React', 'Python', 'JavaScript', 'Java', 'HTML', 'CSS', 'SQL', 'Git'];
    const comm = ['Communication', 'Public Speaking', 'Presentation', 'Writing'];
    const lead = ['Leadership', 'Management', 'Delegation', 'Mentoring'];
    const creative = ['Design', 'Creativity', 'Innovation', 'Art'];

    if (tech.some(t => skillName.toLowerCase().includes(t.toLowerCase()))) return 'Technical Skills';
    if (comm.some(t => skillName.toLowerCase().includes(t.toLowerCase()))) return 'Communication';
    if (lead.some(t => skillName.toLowerCase().includes(t.toLowerCase()))) return 'Leadership';
    if (creative.some(t => skillName.toLowerCase().includes(t.toLowerCase()))) return 'Creativity';

    return 'Other';
  };

  const handleRemoveSkill = (skillName: string) => {
    setSelectedSkills(selectedSkills.filter(s => s.name !== skillName));
  };

  const handleUpdateLevel = (skillName: string, level: number) => {
    setSelectedSkills(selectedSkills.map(s =>
      s.name === skillName ? { ...s, level } : s
    ));
  };

  const handleUpdateCategory = (skillName: string, category: string) => {
    setSelectedSkills(selectedSkills.map(s =>
      s.name === skillName ? { ...s, category } : s
    ));
  };

  const handleSave = async () => {
    if (selectedSkills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }

    setSaving(true);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('addUserSkills', {
        skills: selectedSkills
      });

      if (result.success) {
        toast.success(`Added ${selectedSkills.length} skill(s) successfully!`);
        onSuccess(selectedSkills);
        onClose();
        setSelectedSkills([]);
      } else {
        throw new Error(result.message || 'Failed to add skills');
      }
    } catch (error) {
      console.error('Failed to add skills:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add skills');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Add Skills
          </DialogTitle>
          <DialogDescription>
            Highlight your technical and soft skills. AI-powered suggestions based on your profile.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            <span className="ml-3 text-sm text-gray-600">Analyzing your profile...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* AI Suggestions */}
            {suggestedSkills.length > 0 && (
              <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50/50 to-white">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  <Label className="font-semibold text-green-900">AI-Powered Suggestions</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((skill) => (
                    <Button
                      key={skill}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "border-green-300 hover:bg-green-50 hover:border-green-500",
                        selectedSkills.some(s => s.name === skill) && "bg-green-100 border-green-500"
                      )}
                      onClick={() => handleAddSuggestion(skill)}
                      disabled={selectedSkills.some(s => s.name === skill)}
                    >
                      {selectedSkills.some(s => s.name === skill) ? (
                        <>✓ {skill}</>
                      ) : (
                        <><Plus className="h-3 w-3 mr-1" /> {skill}</>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Add */}
            <div>
              <Label>Add Custom Skill</Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  placeholder="e.g., Microsoft Excel, Photography..."
                  value={manualSkill}
                  onChange={(e) => setManualSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddManual();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddManual}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Selected Skills */}
            {selectedSkills.length > 0 && (
              <div>
                <Label className="mb-3 block">Selected Skills ({selectedSkills.length})</Label>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {selectedSkills.map((skill) => (
                    <div key={skill.name} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="font-medium">{skill.name}</div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                          onClick={() => handleRemoveSkill(skill.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs mb-1">Category</Label>
                          <Select
                            value={skill.category}
                            onValueChange={(value) => handleUpdateCategory(skill.name, value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SKILL_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs mb-1">Level</Label>
                          <Select
                            value={skill.level.toString()}
                            onValueChange={(value) => handleUpdateLevel(skill.name, parseInt(value))}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SKILL_LEVELS.map((level) => (
                                <SelectItem key={level.value} value={level.value.toString()}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Visual Level Indicator */}
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={selectedSkills.length === 0 || saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Target className="mr-2 h-4 w-4" />
                Add {selectedSkills.length} Skill{selectedSkills.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
