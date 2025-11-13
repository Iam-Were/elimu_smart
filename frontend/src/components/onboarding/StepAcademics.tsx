import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { GraduationCap, ChevronLeft } from 'lucide-react';

interface StepAcademicsProps {
  initialData: {
    gradeLevel?: string;
    schoolName?: string;
    kcseSubjects?: string[];
  };
  onNext: (data: { gradeLevel: string; schoolName: string; kcseSubjects: string[] }) => void;
  onBack: () => void;
}

const KCSE_SUBJECTS = [
  'English',
  'Kiswahili',
  'Mathematics',
  'Biology',
  'Chemistry',
  'Physics',
  'Geography',
  'History',
  'CRE',
  'IRE',
  'HRE',
  'Business Studies',
  'Agriculture',
  'Home Science',
  'Computer Studies',
  'French',
  'German',
  'Arabic',
  'Music',
  'Art & Design'
];

export function StepAcademics({ initialData, onNext, onBack }: StepAcademicsProps) {
  const [gradeLevel, setGradeLevel] = useState(initialData.gradeLevel || '');
  const [schoolName, setSchoolName] = useState(initialData.schoolName || '');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    initialData.kcseSubjects || []
  );

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      if (selectedSubjects.length < 8) {
        setSelectedSubjects([...selectedSubjects, subject]);
      }
    }
  };

  const handleSubmit = () => {
    if (!gradeLevel || !schoolName) {
      alert('Please fill in all required fields');
      return;
    }

    if (selectedSubjects.length < 3) {
      alert('Please select at least 3 KCSE subjects');
      return;
    }

    onNext({
      gradeLevel,
      schoolName,
      kcseSubjects: selectedSubjects
    });
  };

  return (
    <div>
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <GraduationCap className="w-8 h-8 text-white" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Your Academic Profile
      </h2>

      <p className="text-gray-600 mb-8">
        Help us understand your educational background
      </p>

      <div className="space-y-6 mb-8">
        {/* Grade Level */}
        <div>
          <Label htmlFor="gradeLevel" className="text-base font-semibold mb-3 block">
            Current Form <span className="text-red-500">*</span>
          </Label>
          <Select value={gradeLevel} onValueChange={setGradeLevel}>
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="Select your form" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Form 1">Form 1</SelectItem>
              <SelectItem value="Form 2">Form 2</SelectItem>
              <SelectItem value="Form 3">Form 3</SelectItem>
              <SelectItem value="Form 4">Form 4</SelectItem>
              <SelectItem value="Graduate">Graduate/Alumni</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* School Name */}
        <div>
          <Label htmlFor="schoolName" className="text-base font-semibold mb-3 block">
            School Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="schoolName"
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="e.g., Alliance High School"
            className="w-full h-12 text-base"
          />
        </div>

        {/* KCSE Subjects */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            KCSE Subjects (Select up to 8) <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-500 mb-4">
            Selected: {selectedSubjects.length}/8
          </p>

          <div className="grid md:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-4 border rounded-lg bg-gray-50">
            {KCSE_SUBJECTS.map((subject) => {
              const isSelected = selectedSubjects.includes(subject);
              const isDisabled = !isSelected && selectedSubjects.length >= 8;

              return (
                <div
                  key={subject}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-orange-100 border-2 border-orange-500'
                      : isDisabled
                      ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                      : 'bg-white border border-gray-200 hover:border-orange-300 cursor-pointer'
                  }`}
                  onClick={() => !isDisabled && toggleSubject(subject)}
                >
                  <Checkbox
                    id={subject}
                    checked={isSelected}
                    disabled={isDisabled}
                    className="w-5 h-5"
                  />
                  <label
                    htmlFor={subject}
                    className={`text-sm font-medium cursor-pointer ${
                      isSelected ? 'text-orange-700' : 'text-gray-700'
                    }`}
                  >
                    {subject}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!gradeLevel || !schoolName || selectedSubjects.length < 3}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
