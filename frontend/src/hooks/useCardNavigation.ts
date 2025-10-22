/**
 * useCardNavigation Hook
 *
 * Centralized navigation and activity logging for all card clicks.
 * Replaces duplicate navigation logic in StudentDashboardCards, StudentAssessmentCards, StudentGuidanceCards.
 *
 * Pattern: Non-blocking activity logging + reliable navigation (Button + onClick pattern).
 *
 * @param activityPrefix - Namespace for activity logs (e.g., "dashboard_", "assessment_", "guidance_")
 */

import { useNavigate } from 'react-router-dom';
import { getParse } from '@/config/parse';

interface UseCardNavigationOptions {
  activityPrefix?: string;
  onNavigate?: (cardId: string, url: string) => void; // Optional callback
}

interface CardClickParams {
  cardId: string;
  actionUrl: string;
  cardTitle: string;
}

export const useCardNavigation = (options: UseCardNavigationOptions = {}) => {
  const navigate = useNavigate();
  const { activityPrefix = '', onNavigate } = options;

  /**
   * Log user activity to Parse backend (non-blocking)
   * Falls back silently if logging fails
   */
  const logActivity = async (cardId: string, cardTitle: string): Promise<void> => {
    try {
      const Parse = await getParse();
      const currentUser = Parse.User.current();

      if (!currentUser) {
        console.warn('[useCardNavigation] No user logged in, skipping activity log');
        return;
      }

      await Parse.Cloud.run('logUserActivity', {
        userId: currentUser.id,
        activityType: `${activityPrefix}card_click`,
        activityDescription: `Clicked card: ${cardTitle}`,
        metadata: {
          cardId,
          cardTitle,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      // Non-blocking: Don't throw, just log warning
      console.warn('[useCardNavigation] Activity logging failed:', error);
    }
  };

  /**
   * Handle card click: Log activity (non-blocking) + Navigate
   *
   * @param cardId - Unique card identifier
   * @param actionUrl - Navigation destination
   * @param cardTitle - Card title for activity log
   */
  const handleCardClick = (cardId: string, actionUrl: string, cardTitle: string): void => {
    // 1. Log activity asynchronously (non-blocking)
    logActivity(cardId, cardTitle).catch(() => {
      // Silent catch - already handled in logActivity
    });

    // 2. Execute optional callback
    if (onNavigate) {
      try {
        onNavigate(cardId, actionUrl);
      } catch (error) {
        console.warn('[useCardNavigation] onNavigate callback failed:', error);
      }
    }

    // 3. Navigate immediately (never blocked by logging)
    navigate(actionUrl);
  };

  /**
   * Variant: Handle click with custom params object
   */
  const handleCardClickFromParams = ({ cardId, actionUrl, cardTitle }: CardClickParams): void => {
    handleCardClick(cardId, actionUrl, cardTitle);
  };

  return {
    handleCardClick,
    handleCardClickFromParams,
    logActivity // Exposed for manual logging if needed
  };
};
