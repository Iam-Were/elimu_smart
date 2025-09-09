import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

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

    // Check if user is a new student who hasn't completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    const isNewStudent = user.role === 'student' && !hasCompletedOnboarding;
    
    // For demo purposes, new students show onboarding unless they've completed it
    setNeedsOnboarding(isNewStudent);
    setIsLoading(false);
  }, [isAuthenticated, user]);

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setNeedsOnboarding(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setNeedsOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding_completed');
    setNeedsOnboarding(true);
  };

  return {
    needsOnboarding,
    isLoading,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };
};