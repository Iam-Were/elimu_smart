/**
 * Admin Utilities API
 * Admin-only functions for schema initialization, cache management, and data seeding
 */

import { getParse } from '@/config/parse';

/**
 * Initialize RIASEC assessment schema (Admin only)
 */
export async function initializeRiasecSchema(): Promise<{
  success: boolean;
  message: string;
  schemas: string[];
}> {
  const Parse = getParse();

  try {
    const result = await Parse.Cloud.run('initializeRiasecSchema');
    return result;
  } catch (error) {
    console.error('Failed to initialize RIASEC schema:', error);
    throw error;
  }
}

/**
 * Initialize Student-Counselor schema (Admin only)
 */
export async function initializeStudentCounselorSchema(): Promise<{
  success: boolean;
  message: string;
  schemas: string[];
}> {
  const Parse = getParse();

  try {
    const result = await Parse.Cloud.run('initializeStudentCounselorSchema');
    return result;
  } catch (error) {
    console.error('Failed to initialize Student-Counselor schema:', error);
    throw error;
  }
}

/**
 * Seed RIASEC database with questions (Admin only)
 */
export async function seedRiasecData(params: {
  questions: Array<{
    id: number;
    category: string;
    statement: string;
    riasecType: string;
    kenyaContext?: string;
  }>;
  riasecTypes: Record<string, unknown>;
}): Promise<{
  success: boolean;
  message: string;
  questionsSaved: number;
  typesSaved: number;
  totalQuestions: number;
}> {
  const Parse = getParse();

  try {
    const result = await Parse.Cloud.run('seedRiasecData', params);
    return result;
  } catch (error) {
    console.error('Failed to seed RIASEC data:', error);
    throw error;
  }
}

/**
 * Get cache statistics (Admin only)
 */
export async function getCacheStats(): Promise<{
  totalKeys: number;
  totalSize: number;
  hitRate: number;
  entries: Array<{
    key: string;
    size: number;
    expiresAt: Date;
  }>;
}> {
  const Parse = getParse();

  try {
    const result = await Parse.Cloud.run('getCacheStats');
    return result;
  } catch (error) {
    console.error('Failed to get cache stats:', error);
    throw error;
  }
}

/**
 * Clear expired cache entries (Admin only)
 */
export async function clearExpiredCache(): Promise<{
  success: boolean;
  entriesCleared: number;
}> {
  const Parse = getParse();

  try {
    const result = await Parse.Cloud.run('clearExpiredCache');
    return result;
  } catch (error) {
    console.error('Failed to clear expired cache:', error);
    throw error;
  }
}

/**
 * Clear all cache entries (Admin only)
 */
export async function clearAllCache(): Promise<{
  success: boolean;
  entriesCleared: number;
}> {
  const Parse = getParse();

  try {
    const result = await Parse.Cloud.run('clearAllCache');
    return result;
  } catch (error) {
    console.error('Failed to clear all cache:', error);
    throw error;
  }
}
