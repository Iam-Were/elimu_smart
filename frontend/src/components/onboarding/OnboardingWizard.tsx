import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  GraduationCap,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OnboardingData {
  personalInfo: {
    preferredName: string;
    currentForm: string;
    school: string;
  };
  interests: string[];
  goals: {
    shortTerm: string;
    longTerm: string;
    priority: string;
  };
  careerAreas: string[];
  completed: boolean;
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const interestOptions = [
  { id: 'science', label: 'Science & Technology', icon: '🔬' },
  { id: 'business', label: 'Business & Finance', icon: '💼' },
  { id: 'creative', label: 'Creative Arts & Design', icon: '🎨' },
  { id: 'healthcare', label: 'Healthcare & Medicine', icon: '🏥' },
  { id: 'education', label: 'Teaching & Education', icon: '📚' },
  { id: 'engineering', label: 'Engineering & Tech', icon: '⚙️' },
  { id: 'social', label: 'Social Work & Community', icon: '🤝' },
  { id: 'sports', label: 'Sports & Fitness', icon: '⚽' },
  { id: 'law', label: 'Law & Government', icon: '⚖️' },
  { id: 'media', label: 'Media & Communications', icon: '📺' },
];

const careerAreaOptions = [
  { id: 'stem', label: 'STEM Fields', description: 'Science, Technology, Engineering, Math' },
  { id: 'business', label: 'Business & Entrepreneurship', description: 'Finance, Marketing, Management' },
  { id: 'healthcare', label: 'Healthcare & Medicine', description: 'Doctors, Nurses, Medical Research' },
  { id: 'creative', label: 'Creative Industries', description: 'Design, Media, Entertainment' },
  { id: 'social', label: 'Social Impact', description: 'Education, Social Work, NGOs' },
  { id: 'trades', label: 'Skilled Trades', description: 'Technical, Crafts, Practical Skills' },
];

const goalOptions = [
  { id: 'university', label: 'Get into my dream university', description: 'Focus on university applications and requirements' },
  { id: 'career', label: 'Discover my perfect career', description: 'Explore career options and find the right fit' },
  { id: 'grades', label: 'Improve my academic performance', description: 'Better study habits and subject mastery' },
  { id: 'skills', label: 'Build job-ready skills', description: 'Practical skills for the workplace' },
  { id: 'confidence', label: 'Gain confidence about my future', description: 'Reduce anxiety and build clarity' },
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {
      preferredName: '',
      currentForm: '',
      school: '',
    },
    interests: [],
    goals: {
      shortTerm: '',
      longTerm: '',
      priority: '',
    },
    careerAreas: [],
    completed: false,
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      const completedData = { ...onboardingData, completed: true };
      setOnboardingData(completedData);
      onComplete(completedData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setOnboardingData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const toggleInterest = (interestId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const updateGoal = (field: string, value: string) => {
    setOnboardingData(prev => ({
      ...prev,
      goals: { ...prev.goals, [field]: value }
    }));
  };

  const toggleCareerArea = (areaId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      careerAreas: prev.careerAreas.includes(areaId)
        ? prev.careerAreas.filter(id => id !== areaId)
        : [...prev.careerAreas, areaId]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.personalInfo.preferredName.trim() !== '' && 
               onboardingData.personalInfo.currentForm !== '';
      case 2:
        return onboardingData.interests.length >= 3;
      case 3:
        return onboardingData.goals.priority !== '';
      case 4:
        return onboardingData.careerAreas.length >= 2;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Welcome to Elimu Smart! 👋</h2>
              <p className="text-muted-foreground">
                Let's get to know you better so we can provide personalized guidance for your career journey
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="preferredName">What should we call you?</Label>
                <Input
                  id="preferredName"
                  placeholder="Your preferred name"
                  value={onboardingData.personalInfo.preferredName}
                  onChange={(e) => updatePersonalInfo('preferredName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Which form are you in?</Label>
                <RadioGroup 
                  value={onboardingData.personalInfo.currentForm} 
                  onValueChange={(value) => updatePersonalInfo('currentForm', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="form3" id="form3" />
                    <Label htmlFor="form3">Form 3</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="form4" id="form4" />
                    <Label htmlFor="form4">Form 4</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="graduate" id="graduate" />
                    <Label htmlFor="graduate">Recently graduated</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School name (optional)</Label>
                <Input
                  id="school"
                  placeholder="Your school name"
                  value={onboardingData.personalInfo.school}
                  onChange={(e) => updatePersonalInfo('school', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">What interests you? ✨</h2>
              <p className="text-muted-foreground">
                Select at least 3 areas that genuinely interest you. This helps us understand your preferences better.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {interestOptions.map((interest) => (
                <Card
                  key={interest.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    onboardingData.interests.includes(interest.id)
                      ? "ring-2 ring-orange-500 bg-orange-50"
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => toggleInterest(interest.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{interest.icon}</div>
                    <div className="text-sm font-medium">{interest.label}</div>
                    {onboardingData.interests.includes(interest.id) && (
                      <CheckCircle2 className="h-4 w-4 text-orange-600 mx-auto mt-2" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Badge variant="secondary">
                {onboardingData.interests.length} selected (minimum 3)
              </Badge>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">What's your main goal? 🎯</h2>
              <p className="text-muted-foreground">
                Choose your most important goal right now. We'll help you create a plan to achieve it.
              </p>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <RadioGroup 
                value={onboardingData.goals.priority} 
                onValueChange={(value) => updateGoal('priority', value)}
              >
                {goalOptions.map((goal) => (
                  <Card
                    key={goal.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      onboardingData.goals.priority === goal.id
                        ? "ring-2 ring-orange-500 bg-orange-50"
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => updateGoal('priority', goal.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value={goal.id} id={goal.id} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={goal.id} className="font-medium cursor-pointer">
                            {goal.label}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {goal.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Which career areas appeal to you? 🚀</h2>
              <p className="text-muted-foreground">
                Select at least 2 career areas you'd like to explore. We'll help you discover specific opportunities in these fields.
              </p>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              {careerAreaOptions.map((area) => (
                <Card
                  key={area.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    onboardingData.careerAreas.includes(area.id)
                      ? "ring-2 ring-orange-500 bg-orange-50"
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => toggleCareerArea(area.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={onboardingData.careerAreas.includes(area.id)}
                        onChange={() => toggleCareerArea(area.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{area.label}</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {area.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Badge variant="secondary">
                {onboardingData.careerAreas.length} selected (minimum 2)
              </Badge>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip for now
            </Button>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>

        <CardContent className="px-6 pb-6">
          {renderStep()}
        </CardContent>

        <div className="flex items-center justify-between p-6 border-t">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            {currentStep === totalSteps ? (
              <>
                Complete Setup
                <CheckCircle2 className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingWizard;