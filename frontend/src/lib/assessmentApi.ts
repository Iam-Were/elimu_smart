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

export interface RiasecType {
  code: string;
  name: string;
  description: string;
  kenyaCareers: string[];
  kuccpsPathways: string[];
}

export interface RiasecCareerInfo {
  types?: RiasecType[];
  career?: string;
  riasecType?: RiasecType;
  relatedCareers?: string[];
  pathways?: string[];
}

/**
 * Get RIASEC career information by Holland Code or career name
 */
export const getRiasecCareerInfo = async (params: {
  hollandCode?: string;
  careerName?: string;
}): Promise<RiasecCareerInfo> => {
  try {
    const Parse = await getParse();
    const result = await Parse.Cloud.run('getRiasecCareerInfo', params);
    return result as RiasecCareerInfo;
  } catch (error) {
    console.error('Failed to fetch RIASEC career info:', error);
    throw new Error('Failed to load RIASEC career information. Please try again.');
  }
};

export interface CareerFitAnalysis {
  career: string;
  eligible: boolean;
  clusterPointsRequired: number;
  studentClusterPoints: number;
  gap: number;
  competitiveness: number;
  employmentRate: number;
  averageSalary: number;
  kuccpsCode: string;
}

export interface SubjectCareerFitResult {
  careers: CareerFitAnalysis[];
  message?: string;
  alternativePathways?: string[];
}

/**
 * Analyze subject-career fit based on KCSE subjects and grades
 */
export const analyzeSubjectCareerFit = async (params: {
  subjects: string[];
  grades: Record<string, string>;
}): Promise<SubjectCareerFitResult> => {
  try {
    const Parse = await getParse();
    const result = await Parse.Cloud.run('analyzeSubjectCareerFit', params);
    return result as SubjectCareerFitResult;
  } catch (error) {
    console.error('Failed to analyze subject-career fit:', error);
    throw new Error('Failed to analyze career compatibility. Please try again.');
  }
};

/**
 * Get assessment questions with optional randomization
 */
export const getAssessmentQuestions = async (params?: {
  assessmentType?: string;
  questionCount?: number;
  randomize?: boolean;
}): Promise<RiasecQuestion[]> => {
  try {
    const Parse = await getParse();
    const result = await Parse.Cloud.run('getAssessmentQuestions', params || {});
    return result as RiasecQuestion[];
  } catch (error) {
    console.error('Failed to fetch assessment questions:', error);
    throw new Error('Failed to load assessment questions. Please try again.');
  }
};
