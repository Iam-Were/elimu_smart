/**
 * Gamification Hook
 * Manages user achievements and certifications
 */

import { useState, useCallback, useEffect } from 'react';
import { getParse } from '@/config/parse';
import { useAuth } from './useAuth';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  earned: boolean;
  earnedDate?: Date;
  iconType: string;
}

export interface Certification {
  id: string;
  name: string;
  provider: string;
  status: 'in_progress' | 'completed';
  progress: number;
  credentialUrl?: string;
  completedDate?: Date;
  expectedCompletion?: Date;
  platform: string;
  skills: string[];
}

export interface GamificationState {
  achievements: Achievement[];
  certifications: Certification[];
  isLoading: boolean;
  error?: string;
}

export const useGamification = () => {
  const { user } = useAuth();
  const [state, setState] = useState<GamificationState>({
    achievements: [],
    certifications: [],
    isLoading: false,
    error: undefined
  });

  /**
   * Get user's achievements
   */
  const getUserAchievements = useCallback(async () => {
    if (!user) return [];

    setState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getUserAchievements');

      const achievements = result.achievements.map((ach: Record<string, unknown>) => ({
        id: ach.id as string,
        title: ach.title as string,
        description: ach.description as string,
        category: ach.category as string,
        earned: ach.earned as boolean,
        earnedDate: ach.earnedDate ? new Date(ach.earnedDate as string) : undefined,
        iconType: ach.iconType as string
      }));

      setState(prev => ({
        ...prev,
        achievements,
        isLoading: false
      }));

      return achievements;
    } catch (error) {
      console.error('Failed to get achievements:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load achievements',
        isLoading: false
      }));
      return [];
    }
  }, [user]);

  /**
   * Add achievement badge to user
   */
  const addAchievementBadge = useCallback(async (achievementType: string, data?: Record<string, unknown>) => {
    if (!user) return null;

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('addAchievementBadge', {
        achievementType,
        data
      });

      // Reload achievements after adding
      await getUserAchievements();

      return result.achievement as Achievement;
    } catch (error) {
      console.error('Failed to add achievement:', error);
      return null;
    }
  }, [user, getUserAchievements]);

  /**
   * Get user's certifications
   */
  const getUserCertifications = useCallback(async () => {
    if (!user) return [];

    setState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getUserCertifications');

      const certifications = result.certifications.map((cert: Record<string, unknown>) => ({
        id: cert.id as string,
        name: cert.name as string,
        provider: cert.provider as string,
        status: cert.status as 'in_progress' | 'completed',
        progress: cert.progress as number,
        credentialUrl: cert.credentialUrl as string | undefined,
        completedDate: cert.completedDate ? new Date(cert.completedDate as string) : undefined,
        expectedCompletion: cert.expectedCompletion ? new Date(cert.expectedCompletion as string) : undefined,
        platform: cert.platform as string,
        skills: (cert.skills || []) as string[]
      }));

      setState(prev => ({
        ...prev,
        certifications,
        isLoading: false
      }));

      return certifications;
    } catch (error) {
      console.error('Failed to get certifications:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load certifications',
        isLoading: false
      }));
      return [];
    }
  }, [user]);

  /**
   * Load all gamification data on mount
   */
  useEffect(() => {
    if (user) {
      getUserAchievements();
      getUserCertifications();
    }
  }, [user, getUserAchievements, getUserCertifications]);

  return {
    achievements: state.achievements,
    certifications: state.certifications,
    isLoading: state.isLoading,
    error: state.error,
    getUserAchievements,
    addAchievementBadge,
    getUserCertifications
  };
};
