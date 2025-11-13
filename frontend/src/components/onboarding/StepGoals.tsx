import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, ChevronLeft, Loader2 } from 'lucide-react';

interface StepGoalsProps {
  initialData: {
    universityPreferences?: string[];
    budgetConstraints?: string;
    locationPreference?: string;
  };
  onNext: (data: {
    universityPreferences: string[];
    budgetConstraints: string;
    locationPreference: string;
  }) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const POPULAR_UNIVERSITIES = [
  'University of Nairobi',
  'Kenyatta University',
  'Moi University',
  'Egerton University',
  'JKUAT',
  'Strathmore University',
  'United States International University (USIU)',
  'Catholic University of Eastern Africa',
  'Daystar University',
  'KCA University',
  'Technical University of Kenya',
  'Multimedia University of Kenya'
];

const LOCATIONS = [
  { value: 'any', label: 'Any location in Kenya' },
  { value: 'nairobi', label: 'Nairobi' },
  { value: 'mombasa', label: 'Mombasa' },
  { value: 'kisumu', label: 'Kisumu' },
  { value: 'nakuru', label: 'Nakuru' },
  { value: 'eldoret', label: 'Eldoret' },
  { value: 'thika', label: 'Thika' }
];

export function StepGoals({ initialData, onNext, onBack, isSubmitting }: StepGoalsProps) {
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>(
    initialData.universityPreferences || []
  );
  const [budgetConstraints, setBudgetConstraints] = useState(
    initialData.budgetConstraints || ''
  );
  const [locationPreference, setLocationPreference] = useState(
    initialData.locationPreference || 'any'
  );

  const toggleUniversity = (university: string) => {
    if (selectedUniversities.includes(university)) {
      setSelectedUniversities(selectedUniversities.filter(u => u !== university));
    } else {
      if (selectedUniversities.length < 5) {
        setSelectedUniversities([...selectedUniversities, university]);
      }
    }
  };

  const handleSubmit = () => {
    if (!budgetConstraints) {
      alert('Please select your budget constraints');
      return;
    }

    onNext({
      universityPreferences: selectedUniversities,
      budgetConstraints,
      locationPreference
    });
  };

  return (
    <div>
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <Target className="w-8 h-8 text-white" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Your Goals & Preferences
      </h2>

      <p className="text-gray-600 mb-8">
        Help us recommend the best universities and programs for you
      </p>

      <div className="space-y-8 mb-8">
        {/* Dream Universities */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Dream Universities (Select up to 5)
          </Label>
          <p className="text-sm text-gray-500 mb-4">
            Selected: {selectedUniversities.length}/5 (Optional)
          </p>

          <div className="grid md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-4 border rounded-lg bg-gray-50">
            {POPULAR_UNIVERSITIES.map((university) => {
              const isSelected = selectedUniversities.includes(university);
              const isDisabled = !isSelected && selectedUniversities.length >= 5;

              return (
                <div
                  key={university}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-orange-100 border-2 border-orange-500'
                      : isDisabled
                      ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                      : 'bg-white border border-gray-200 hover:border-orange-300 cursor-pointer'
                  }`}
                  onClick={() => !isDisabled && toggleUniversity(university)}
                >
                  <Checkbox
                    id={university}
                    checked={isSelected}
                    disabled={isDisabled}
                    className="w-5 h-5"
                  />
                  <label
                    htmlFor={university}
                    className={`text-sm font-medium cursor-pointer ${
                      isSelected ? 'text-orange-700' : 'text-gray-700'
                    }`}
                  >
                    {university}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Constraints */}
        <div>
          <Label htmlFor="budget" className="text-base font-semibold mb-3 block">
            Budget Constraints <span className="text-red-500">*</span>
          </Label>
          <Select value={budgetConstraints} onValueChange={setBudgetConstraints}>
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="Select your budget situation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no_constraints">
                No constraints - Can afford any university
              </SelectItem>
              <SelectItem value="moderate">
                Moderate - Prefer affordable options
              </SelectItem>
              <SelectItem value="need_scholarship">
                Need scholarship or financial aid
              </SelectItem>
              <SelectItem value="government_only">
                Government-funded programs only (HELB)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Preference */}
        <div>
          <Label htmlFor="location" className="text-base font-semibold mb-3 block">
            Location Preference
          </Label>
          <Select value={locationPreference} onValueChange={setLocationPreference}>
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-8">
        <p className="text-sm text-green-900">
          <span className="font-semibold">Almost there!</span> After this step, we'll activate your 3-month premium trial and match you with a counselor.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!budgetConstraints || isSubmitting}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Setting up your account...
            </>
          ) : (
            'Complete Setup'
          )}
        </Button>
      </div>
    </div>
  );
}
