import { useState, useEffect, useRef } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, ChevronLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getParse } from '@/config/parse';

interface StepAcademicsProps {
  initialData: {
    gradeLevel?: string;
    schoolName?: string;
    kcseSubjects?: string[];
    schoolCode?: string;
  };
  onNext: (data: {
    gradeLevel: string;
    schoolName: string;
    kcseSubjects: string[];
    schoolCode?: string;
    schoolId?: string;
  }) => void;
  onBack: () => void;
}

const KCSE_SUBJECTS = [
  'English', 'Kiswahili', 'Mathematics', 'Biology', 'Chemistry', 'Physics',
  'Geography', 'History', 'CRE', 'IRE', 'HRE', 'Business Studies',
  'Agriculture', 'Home Science', 'Computer Studies', 'French', 'German',
  'Arabic', 'Music', 'Art & Design'
];

export function StepAcademics({ initialData, onNext, onBack }: StepAcademicsProps) {
  const [gradeLevel, setGradeLevel] = useState(initialData.gradeLevel || '');
  const [schoolName, setSchoolName] = useState(initialData.schoolName || '');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(initialData.kcseSubjects || []);
  const [schoolCode, setSchoolCode] = useState(initialData.schoolCode || '');
  const [schoolLookup, setSchoolLookup] = useState<{ found: boolean; name?: string; id?: string } | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced school code lookup
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const code = schoolCode.trim().toUpperCase();
    if (code.length < 6) { setSchoolLookup(null); return; }

    debounceRef.current = setTimeout(async () => {
      setLookingUp(true);
      try {
        const Parse = getParse();
        const result = await Parse.Cloud.run('getSchoolByCode', { code });
        setSchoolLookup(result.found ? { found: true, name: result.name, id: result.schoolId } : { found: false });
      } catch {
        setSchoolLookup(null);
      } finally {
        setLookingUp(false);
      }
    }, 600);
  }, [schoolCode]);

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
      kcseSubjects: selectedSubjects,
      ...(schoolCode && schoolLookup?.found ? { schoolCode: schoolCode.trim().toUpperCase(), schoolId: schoolLookup.id } : {}),
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

        {/* School Code (optional — for schools on the platform) */}
        <div>
          <Label htmlFor="schoolCode" className="text-base font-semibold mb-1 block">
            School Code
            <span className="text-sm font-normal text-muted-foreground ml-2">(optional)</span>
          </Label>
          <p className="text-xs text-muted-foreground mb-3">
            If your school has partnered with Elimu Smart, enter the code your teacher gave you.
          </p>
          <div className="relative">
            <Input
              id="schoolCode"
              type="text"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
              placeholder="e.g., ALLI23"
              className="w-full h-12 text-base uppercase pr-10"
              maxLength={10}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {lookingUp && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
              {!lookingUp && schoolLookup?.found && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {!lookingUp && schoolLookup?.found === false && <AlertCircle className="h-5 w-5 text-orange-500" />}
            </div>
          </div>

          {schoolLookup?.found && schoolLookup.name && (
            <Alert className="mt-2 bg-green-50 border-green-200 py-2">
              <AlertDescription className="text-green-800 text-sm">
                <CheckCircle2 className="h-4 w-4 inline mr-1" />
                Found: <strong>{schoolLookup.name}</strong>
              </AlertDescription>
            </Alert>
          )}
          {schoolLookup?.found === false && (
            <Alert className="mt-2 bg-orange-50 border-orange-200 py-2">
              <AlertDescription className="text-orange-800 text-sm">
                Code not found. You can still continue without it.
              </AlertDescription>
            </Alert>
          )}
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
