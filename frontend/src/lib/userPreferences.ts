/**
 * User Preferences Service
 *
 * Manages user settings with Parse backend (replaces localStorage)
 * Provides cross-device persistence and offline fallback
 */

import { getParse } from '@/config/parse';

export interface UserPreferences {
  theme: 'orange' | 'yellow' | 'purple';
  darkMode: boolean;
  onboardingCompleted: boolean;
  dashboardCardOrder: string[];
  assessmentProgress: Record<string, unknown>;
}

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'orange',
  darkMode: false,
  onboardingCompleted: false,
  dashboardCardOrder: [],
  assessmentProgress: {}
};

/**
 * Get user preferences from Parse backend
 * Falls back to localStorage if Parse fails (offline mode)
 */
export async function getUserPreferences(): Promise<UserPreferences> {
  try {
    const Parse = getParse();
    const result = await Parse.Cloud.run('getUserPreferences');
    return result as UserPreferences;
  } catch (error) {
    console.warn('Failed to fetch preferences from backend, using localStorage fallback:', error);

    // Fallback to localStorage
    try {
      const theme = (localStorage.getItem('elimu-theme') as UserPreferences['theme']) || DEFAULT_PREFERENCES.theme;
      const darkMode = localStorage.getItem('elimu-dark-mode') === 'true';
      const onboardingCompleted = localStorage.getItem('onboarding_completed') === 'true';
      const dashboardCardOrderStr = localStorage.getItem('student-dashboard-card-order');
      const dashboardCardOrder = dashboardCardOrderStr ? JSON.parse(dashboardCardOrderStr) : [];

      return {
        theme,
        darkMode,
        onboardingCompleted,
        dashboardCardOrder,
        assessmentProgress: {}
      };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }
}

/**
 * Save complete user preferences
 */
export async function saveUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
  try {
    const Parse = getParse();
    await Parse.Cloud.run('saveUserPreferences', preferences);

    // Also save to localStorage as backup (offline mode)
    if (preferences.theme) localStorage.setItem('elimu-theme', preferences.theme);
    if (preferences.darkMode !== undefined) localStorage.setItem('elimu-dark-mode', String(preferences.darkMode));
    if (preferences.onboardingCompleted !== undefined) localStorage.setItem('onboarding_completed', String(preferences.onboardingCompleted));
    if (preferences.dashboardCardOrder) localStorage.setItem('student-dashboard-card-order', JSON.stringify(preferences.dashboardCardOrder));

  } catch (error) {
    console.warn('Failed to save preferences to backend, saved to localStorage only:', error);

    // Fallback to localStorage only
    if (preferences.theme) localStorage.setItem('elimu-theme', preferences.theme);
    if (preferences.darkMode !== undefined) localStorage.setItem('elimu-dark-mode', String(preferences.darkMode));
    if (preferences.onboardingCompleted !== undefined) localStorage.setItem('onboarding_completed', String(preferences.onboardingCompleted));
    if (preferences.dashboardCardOrder) localStorage.setItem('student-dashboard-card-order', JSON.stringify(preferences.dashboardCardOrder));
  }
}

/**
 * Update a specific preference field (more efficient than full save)
 */
export async function updateUserPreference<K extends keyof UserPreferences>(
  field: K,
  value: UserPreferences[K]
): Promise<void> {
  try {
    const Parse = getParse();
    await Parse.Cloud.run('updateUserPreference', { field, value });

    // Also update localStorage as backup
    if (field === 'theme') localStorage.setItem('elimu-theme', value as string);
    if (field === 'darkMode') localStorage.setItem('elimu-dark-mode', String(value));
    if (field === 'onboardingCompleted') localStorage.setItem('onboarding_completed', String(value));
    if (field === 'dashboardCardOrder') localStorage.setItem('student-dashboard-card-order', JSON.stringify(value));

  } catch (error) {
    console.warn(`Failed to update ${field} on backend, saved to localStorage only:`, error);

    // Fallback to localStorage only
    if (field === 'theme') localStorage.setItem('elimu-theme', value as string);
    if (field === 'darkMode') localStorage.setItem('elimu-dark-mode', String(value));
    if (field === 'onboardingCompleted') localStorage.setItem('onboarding_completed', String(value));
    if (field === 'dashboardCardOrder') localStorage.setItem('student-dashboard-card-order', JSON.stringify(value));
  }
}

/**
 * Get theme preference
 */
export async function getTheme(): Promise<UserPreferences['theme']> {
  try {
    const preferences = await getUserPreferences();
    return preferences.theme;
  } catch {
    return (localStorage.getItem('elimu-theme') as UserPreferences['theme']) || DEFAULT_PREFERENCES.theme;
  }
}

/**
 * Set theme preference
 */
export async function setTheme(theme: UserPreferences['theme']): Promise<void> {
  await updateUserPreference('theme', theme);
}

/**
 * Get dark mode preference
 */
export async function getDarkMode(): Promise<boolean> {
  try {
    const preferences = await getUserPreferences();
    return preferences.darkMode;
  } catch {
    return localStorage.getItem('elimu-dark-mode') === 'true';
  }
}

/**
 * Set dark mode preference
 */
export async function setDarkMode(enabled: boolean): Promise<void> {
  await updateUserPreference('darkMode', enabled);
}

/**
 * Get onboarding completed status
 */
export async function getOnboardingCompleted(): Promise<boolean> {
  try {
    const preferences = await getUserPreferences();
    return preferences.onboardingCompleted;
  } catch {
    return localStorage.getItem('onboarding_completed') === 'true';
  }
}

/**
 * Mark onboarding as completed
 */
export async function setOnboardingCompleted(completed: boolean): Promise<void> {
  await updateUserPreference('onboardingCompleted', completed);
}

/**
 * Get dashboard card order
 */
export async function getDashboardCardOrder(): Promise<string[]> {
  try {
    const preferences = await getUserPreferences();
    return preferences.dashboardCardOrder;
  } catch {
    const orderStr = localStorage.getItem('student-dashboard-card-order');
    return orderStr ? JSON.parse(orderStr) : [];
  }
}

/**
 * Set dashboard card order
 */
export async function setDashboardCardOrder(order: string[]): Promise<void> {
  await updateUserPreference('dashboardCardOrder', order);
}
