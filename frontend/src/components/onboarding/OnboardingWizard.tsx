import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepWelcome } from './StepWelcome';
import { StepAcademics } from './StepAcademics';
import { StepParentGuardian } from './StepParentGuardian';
import { StepCareerInterests } from './StepCareerInterests';
import { StepGoals } from './StepGoals';
import { StepComplete } from './StepComplete';
import { Progress } from '@/components/ui/progress';
import { getParse } from '@/config/parse';

interface OnboardingData {
  gradeLevel?: string;
  schoolName?: string;
  kcseSubjects?: string[];
  schoolCode?: string;
  schoolId?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  parentRelationship?: string;
  careerInterests?: string[];
  universityPreferences?: string[];
  budgetConstraints?: string;
  locationPreference?: string;
}

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedCounselor, setAssignedCounselor] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const navigate = useNavigate();

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  // Restore Parse session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const sessionToken = localStorage.getItem('parse-session-token');
      if (sessionToken) {
        try {
          const Parse = await getParse();
          const currentUser = Parse.User.current();
          if (!currentUser || currentUser.getSessionToken() !== sessionToken) {
            await Parse.User.become(sessionToken);
            console.log('✅ Parse User session restored for onboarding');
          }
        } catch (error) {
          console.error('Failed to restore Parse session:', error);
        }
      }
    };
    restoreSession();
  }, []);

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    // Merge step data
    const updatedData = { ...onboardingData, ...stepData };
    setOnboardingData(updatedData);

    // Save to backend
    try {
      const Parse = await getParse();
      const user = Parse.User.current();

      if (user) {
        await Parse.Cloud.run('saveOnboardingData', {
          userId: user.id,
          stepData
        });
      }
    } catch (error) {
      console.warn('Failed to save onboarding step:', error);
    }

    // Move to next step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      const Parse = await getParse();
      const user = Parse.User.current();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Tag student to school if they provided a valid code
      if (onboardingData.schoolCode && onboardingData.schoolId) {
        try {
          await Parse.Cloud.run('joinSchoolByCode', { code: onboardingData.schoolCode });
        } catch (schoolErr) {
          console.warn('Failed to join school, continuing:', schoolErr);
        }
      }

      // Complete onboarding (triggers trial + counselor assignment)
      const result = await Parse.Cloud.run('completeOnboarding', {
        userId: user.id,
        parentName: onboardingData.parentName,
        parentEmail: onboardingData.parentEmail,
        parentPhone: onboardingData.parentPhone,
        parentRelationship: onboardingData.parentRelationship
      });

      // Set assigned counselor info
      if (result.counselor && result.counselor.success) {
        setAssignedCounselor({
          id: result.counselor.counselorId,
          name: result.counselor.counselorName,
          email: result.counselor.counselorEmail
        });
      }

      // Show completion step
      setCurrentStep(6);

    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  const handleSkip = async () => {
    try {
      const Parse = await getParse();
      const user = Parse.User.current();

      if (user) {
        // Save current onboarding progress (non-blocking)
        await Parse.Cloud.run('saveOnboardingData', {
          userId: user.id,
          stepData: {
            ...onboardingData,
            currentStep,
            isCompleted: false,
            skippedAt: new Date().toISOString()
          }
        });

        // Mark onboarding as "completed" to allow dashboard access
        // User can resume onboarding later from dashboard prompt
        await Parse.Cloud.run('saveUserPreferences', {
          onboardingCompleted: true,
          onboardingSkipped: true
        });

        console.log('✅ Onboarding progress saved, navigating to dashboard');
      }
    } catch (error) {
      console.warn('Failed to save onboarding progress:', error);
    }

    // Navigate to dashboard after saving
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Bar */}
        {currentStep < 6 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps - 1}
              </p>
              <p className="text-sm text-gray-500">
                {Math.round(progress)}% complete
              </p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-9">
          {currentStep === 1 && (
            <StepWelcome onNext={() => handleNext({})} onSkip={handleSkip} />
          )}

          {currentStep === 2 && (
            <StepAcademics
              initialData={{
                gradeLevel: onboardingData.gradeLevel,
                schoolName: onboardingData.schoolName,
                kcseSubjects: onboardingData.kcseSubjects,
                schoolCode: onboardingData.schoolCode
              }}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <StepParentGuardian
              initialData={{
                parentName: onboardingData.parentName,
                parentEmail: onboardingData.parentEmail,
                parentPhone: onboardingData.parentPhone,
                parentRelationship: onboardingData.parentRelationship
              }}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleSkip}
            />
          )}

          {currentStep === 4 && (
            <StepCareerInterests
              initialData={{
                careerInterests: onboardingData.careerInterests
              }}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <StepGoals
              initialData={{
                universityPreferences: onboardingData.universityPreferences,
                budgetConstraints: onboardingData.budgetConstraints,
                locationPreference: onboardingData.locationPreference
              }}
              onNext={handleComplete}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === 6 && assignedCounselor && (
            <StepComplete
              counselorName={assignedCounselor.name}
              counselorEmail={assignedCounselor.email}
              onFinish={handleFinish}
            />
          )}
        </div>

        {/* Footer */}
        {currentStep < 6 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Your information is secure and will only be used to personalize your experience
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
