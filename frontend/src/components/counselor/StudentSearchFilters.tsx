import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search, X } from 'lucide-react';

interface StudentSearchFiltersProps {
  searchTerm: string;
  grade: string;
  school: string;
  hasAssessments: boolean | null;
  hasSubscription: boolean | null;
  careerInterest: string;
  minProfileCompletion: number;
  sortBy: 'recent' | 'name' | 'grade' | 'profileCompletion';
  onSearchTermChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onSchoolChange: (value: string) => void;
  onHasAssessmentsChange: (value: boolean | null) => void;
  onHasSubscriptionChange: (value: boolean | null) => void;
  onCareerInterestChange: (value: string) => void;
  onMinProfileCompletionChange: (value: number) => void;
  onSortByChange: (value: 'recent' | 'name' | 'grade' | 'profileCompletion') => void;
  onSearch: () => void;
  onClear: () => void;
}

export const StudentSearchFilters: React.FC<StudentSearchFiltersProps> = ({
  searchTerm,
  grade,
  school,
  hasAssessments,
  hasSubscription,
  careerInterest,
  minProfileCompletion,
  sortBy,
  onSearchTermChange,
  onGradeChange,
  onSchoolChange,
  onHasAssessmentsChange,
  onHasSubscriptionChange,
  onCareerInterestChange,
  onMinProfileCompletionChange,
  onSortByChange,
  onSearch,
  onClear,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      {/* Search Term */}
      <div className="space-y-2">
        <Label htmlFor="searchTerm">Search by Name or Email</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="searchTerm"
            placeholder="Enter student name or email..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Grade Filter */}
        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Select value={grade} onValueChange={onGradeChange}>
            <SelectTrigger id="grade">
              <SelectValue placeholder="All grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All grades</SelectItem>
              <SelectItem value="Form 1">Form 1</SelectItem>
              <SelectItem value="Form 2">Form 2</SelectItem>
              <SelectItem value="Form 3">Form 3</SelectItem>
              <SelectItem value="Form 4">Form 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* School Filter */}
        <div className="space-y-2">
          <Label htmlFor="school">School</Label>
          <Input
            id="school"
            placeholder="Enter school name..."
            value={school}
            onChange={(e) => onSchoolChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Career Interest */}
        <div className="space-y-2">
          <Label htmlFor="careerInterest">Career Interest</Label>
          <Select value={careerInterest} onValueChange={onCareerInterestChange}>
            <SelectTrigger id="careerInterest">
              <SelectValue placeholder="All interests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All interests</SelectItem>
              <SelectItem value="Realistic">Realistic (Hands-on)</SelectItem>
              <SelectItem value="Investigative">Investigative (Research)</SelectItem>
              <SelectItem value="Artistic">Artistic (Creative)</SelectItem>
              <SelectItem value="Social">Social (Helping)</SelectItem>
              <SelectItem value="Enterprising">Enterprising (Leadership)</SelectItem>
              <SelectItem value="Conventional">Conventional (Organized)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Has Assessments */}
        <div className="space-y-2">
          <Label htmlFor="hasAssessments">Assessment Status</Label>
          <Select
            value={hasAssessments === null ? 'all' : hasAssessments ? 'yes' : 'no'}
            onValueChange={(value) => onHasAssessmentsChange(value === 'all' ? null : value === 'yes')}
          >
            <SelectTrigger id="hasAssessments">
              <SelectValue placeholder="All students" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All students</SelectItem>
              <SelectItem value="yes">Completed assessments</SelectItem>
              <SelectItem value="no">No assessments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Has Subscription */}
        <div className="space-y-2">
          <Label htmlFor="hasSubscription">Subscription Status</Label>
          <Select
            value={hasSubscription === null ? 'all' : hasSubscription ? 'yes' : 'no'}
            onValueChange={(value) => onHasSubscriptionChange(value === 'all' ? null : value === 'yes')}
          >
            <SelectTrigger id="hasSubscription">
              <SelectValue placeholder="All students" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All students</SelectItem>
              <SelectItem value="yes">Premium students</SelectItem>
              <SelectItem value="no">Free students</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sortBy">Sort By</Label>
          <Select value={sortBy} onValueChange={(value) => onSortByChange(value as typeof sortBy)}>
            <SelectTrigger id="sortBy">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="grade">Grade Level</SelectItem>
              <SelectItem value="profileCompletion">Profile Completion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Profile Completion Slider */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Minimum Profile Completion</Label>
          <span className="text-sm text-gray-600">{minProfileCompletion}%</span>
        </div>
        <Slider
          value={[minProfileCompletion]}
          onValueChange={(value: number[]) => onMinProfileCompletionChange(value[0])}
          min={0}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button onClick={onSearch} className="flex-1" size="lg">
          <Search className="mr-2 h-4 w-4" />
          Search Students
        </Button>
        <Button onClick={onClear} variant="outline" size="lg">
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
