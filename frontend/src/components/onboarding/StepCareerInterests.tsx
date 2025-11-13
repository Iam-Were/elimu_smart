import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, ChevronLeft } from 'lucide-react';

interface StepCareerInterestsProps {
  initialData: {
    careerInterests?: string[];
  };
  onNext: (data: { careerInterests: string[] }) => void;
  onBack: () => void;
}

const CAREER_CATEGORIES = [
  {
    code: 'R',
    name: 'Realistic',
    description: 'Hands-on work, building, fixing things',
    examples: 'Engineering, Agriculture, Aviation, Construction',
    icon: '🔧',
    color: 'from-green-500 to-green-600'
  },
  {
    code: 'I',
    name: 'Investigative',
    description: 'Research, analysis, problem-solving',
    examples: 'Medicine, Science, Data Analysis, Research',
    icon: '🔬',
    color: 'from-blue-500 to-blue-600'
  },
  {
    code: 'A',
    name: 'Artistic',
    description: 'Creative expression, design, arts',
    examples: 'Graphic Design, Music, Writing, Media',
    icon: '🎨',
    color: 'from-purple-500 to-purple-600'
  },
  {
    code: 'S',
    name: 'Social',
    description: 'Helping others, teaching, counseling',
    examples: 'Teaching, Nursing, Social Work, Psychology',
    icon: '🤝',
    color: 'from-pink-500 to-pink-600'
  },
  {
    code: 'E',
    name: 'Enterprising',
    description: 'Leadership, business, persuasion',
    examples: 'Business, Law, Sales, Management',
    icon: '💼',
    color: 'from-orange-500 to-orange-600'
  },
  {
    code: 'C',
    name: 'Conventional',
    description: 'Organization, data management, structure',
    examples: 'Accounting, Administration, Banking, IT',
    icon: '📊',
    color: 'from-indigo-500 to-indigo-600'
  }
];

export function StepCareerInterests({ initialData, onNext, onBack }: StepCareerInterestsProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData.careerInterests || []
  );

  const toggleCategory = (code: string) => {
    if (selectedCategories.includes(code)) {
      setSelectedCategories(selectedCategories.filter(c => c !== code));
    } else {
      if (selectedCategories.length < 3) {
        setSelectedCategories([...selectedCategories, code]);
      }
    }
  };

  const handleSubmit = () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least 1 career interest');
      return;
    }

    onNext({
      careerInterests: selectedCategories
    });
  };

  return (
    <div>
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <Lightbulb className="w-8 h-8 text-white" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        What Interests You?
      </h2>

      <p className="text-gray-600 mb-2">
        Select up to 3 career categories that appeal to you most
      </p>

      <p className="text-sm text-orange-600 font-medium mb-8">
        Selected: {selectedCategories.length}/3
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {CAREER_CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category.code);
          const isDisabled = !isSelected && selectedCategories.length >= 3;

          return (
            <div
              key={category.code}
              onClick={() => !isDisabled && toggleCategory(category.code)}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                  : isDisabled
                  ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow bg-gradient-to-br ${
                    isSelected ? category.color : 'from-gray-200 to-gray-300'
                  }`}
                >
                  {category.icon}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {category.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold">Examples:</span> {category.examples}
                  </p>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-8">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Tip:</span> Choose categories that genuinely interest you, not just what others expect.
          You'll take a full assessment later to get more detailed career matches.
        </p>
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
          disabled={selectedCategories.length === 0}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
