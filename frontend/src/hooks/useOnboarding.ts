import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getOnboardingCompleted, setOnboardingCompleted } from '@/lib/userPreferences';

export const useOnboarding = () => {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      setNeedsOnboarding(false);
      return;
    }

    // Check if user has completed onboarding (from Parse backend)
    const checkOnboarding = async () => {
      try {
        const hasCompletedOnboarding = await getOnboardingCompleted();
        const isNewStudent = user.role === 'student' && !hasCompletedOnboarding;
        setNeedsOnboarding(isNewStudent);
      } catch {
        // Fallback to localStorage on error
        const hasCompletedOnboarding = localStorage.getItem('onboarding_completed') === 'true';
        const isNewStudent = user.role === 'student' && !hasCompletedOnboarding;
        setNeedsOnboarding(isNewStudent);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, [isAuthenticated, user]);

  const completeOnboarding = () => {
    setNeedsOnboarding(false);
    // Save to Parse backend (non-blocking)
    setOnboardingCompleted(true).catch(() => {
      console.warn('Onboarding status saved locally, will sync to backend when online');
    });
  };

  const skipOnboarding = () => {
    setNeedsOnboarding(false);
    // Save to Parse backend (non-blocking)
    setOnboardingCompleted(true).catch(() => {
      console.warn('Onboarding status saved locally, will sync to backend when online');
    });
  };

  const resetOnboarding = () => {
    setNeedsOnboarding(true);
    // Save to Parse backend (non-blocking)
    setOnboardingCompleted(false).catch(() => {
      console.warn('Onboarding reset saved locally, will sync to backend when online');
    });
  };

  return {
    needsOnboarding,
    isLoading,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };
};