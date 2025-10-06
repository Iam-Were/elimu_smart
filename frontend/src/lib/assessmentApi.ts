/**
 * Assessment API Service
 * Fetches assessment questions from Parse Cloud Functions
 */

import getParse from './parse';

export interface RiasecQuestion {
  id: number;
  category: 'activities' | 'occupations';
  statement: string;
  riasecType: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  kenyaContext?: string;
}

export interface SkillQuestion {
  id: number;
  text: string;
  category: string;
}

/**
 * Fetch RIASEC assessment questions from Parse Cloud Function
 */
export const getRiasecQuestions = async (): Promise<RiasecQuestion[]> => {
  try {
    const Parse = await getParse();
    const result = await Parse.Cloud.run('getRiasecQuestions');
    return result as RiasecQuestion[];
  } catch (error) {
    console.error('Failed to fetch RIASEC questions from API:', error);
    throw new Error('Failed to load RIASEC questions. Please try again.');
  }
};

/**
 * Fetch Skills assessment questions from Parse Cloud Function
 */
export const getSkillsQuestions = async (): Promise<SkillQuestion[]> => {
  try {
    const Parse = await getParse();
    const result = await Parse.Cloud.run('getSkillsQuestions');
    return result as SkillQuestion[];
  } catch (error) {
    console.error('Failed to fetch Skills questions from API:', error);
    throw new Error('Failed to load Skills questions. Please try again.');
  }
};

/**
 * Save assessment result to Parse Cloud Function
 */
export const saveAssessmentResult = async (
  assessmentType: string,
  responses: Record<string, unknown>,
  scores: Record<string, unknown>,
  results: Record<string, unknown>
): Promise<{ success: boolean; resultId: string }> => {
  try {
    const Parse = await getParse();
    const result = await Parse.Cloud.run('saveAssessmentResult', {
      assessmentType,
      responses,
      scores,
      results
    });
    return result as { success: boolean; resultId: string };
  } catch (error) {
    console.error('Failed to save assessment result:', error);
    throw new Error('Failed to save assessment result. Please try again.');
  }
};

/**
 * Get user's assessment history from Parse Cloud Function
 */
export const getUserAssessments = async (
  assessmentType?: string
): Promise<Array<{
  id: string;
  assessmentType: string;
  completedAt: Date;
  scores: Record<string, unknown>;
  results: Record<string, unknown>;
}>> => {
  try {
    const Parse = await getParse();
    const result = await Parse.Cloud.run('getUserAssessments', {
      assessmentType
    });
    return result as Array<{
      id: string;
      assessmentType: string;
      completedAt: Date;
      scores: Record<string, unknown>;
      results: Record<string, unknown>;
    }>;
  } catch (error) {
    console.error('Failed to fetch user assessments:', error);
    throw new Error('Failed to load assessment history. Please try again.');
  }
};
