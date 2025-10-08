/**
 * Assessment Progress API
 * Manages RIASEC assessment lifecycle: start, save responses, complete, resume
 */

import { getParse } from '@/config/parse';

export interface AssessmentStartResult {
  assessmentId: string;
  status: 'started';
  totalQuestions: number;
  currentQuestion: number;
}

export interface SaveResponseResult {
  success: boolean;
  currentQuestion: number;
  totalResponses: number;
}

export interface RiasecScores {
  R: number; // Realistic
  I: number; // Investigative
  A: number; // Artistic
  S: number; // Social
  E: number; // Enterprising
  C: number; // Conventional
}

export interface CareerMatch {
  career: string;
  compatibility: number;
  kuccpsPathway: string;
  reasonsForMatch: string[];
}

export interface DevelopmentArea {
  type: string;
  score: number;
  recommendations: string[];
}

export interface AssessmentResults {
  scores: RiasecScores;
  hollandCode: string;
  primaryType: string;
  careerMatches: CareerMatch[];
  developmentAreas: DevelopmentArea[];
  completedAt: string;
  version: string;
}

export interface CompleteAssessmentResult {
  success: boolean;
  results: AssessmentResults;
  assessmentId: string;
}

export interface ResumeAssessmentResult {
  assessment: {
    id: string;
    currentQuestion: number;
    totalQuestions: number;
    responses: string[];
    startedAt: Date;
  } | null;
}

export interface QuestionData {
  questionNumber: number;
  riasecType: string;
  category: string;
}

/**
 * Start a new RIASEC assessment
 */
export async function startRiasecAssessment(): Promise<AssessmentStartResult> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('startRiasecAssessment');
    return result;
  } catch (error) {
    console.error('Failed to start RIASEC assessment:', error);
    throw error;
  }
}

/**
 * Save a single RIASEC question response
 */
export async function saveRiasecResponse(
  assessmentId: string,
  questionId: string,
  response: number,
  questionData: QuestionData
): Promise<SaveResponseResult> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('saveRiasecResponse', {
      assessmentId,
      questionId,
      response,
      questionData
    });
    return result;
  } catch (error) {
    console.error('Failed to save RIASEC response:', error);
    throw error;
  }
}

/**
 * Complete RIASEC assessment and calculate results
 */
export async function completeRiasecAssessment(
  assessmentId: string
): Promise<CompleteAssessmentResult> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('completeRiasecAssessment', {
      assessmentId
    });
    return result;
  } catch (error) {
    console.error('Failed to complete RIASEC assessment:', error);
    throw error;
  }
}

/**
 * Resume an in-progress RIASEC assessment
 */
export async function resumeRiasecAssessment(): Promise<ResumeAssessmentResult> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('resumeRiasecAssessment');
    return result;
  } catch (error) {
    console.error('Failed to resume RIASEC assessment:', error);
    throw error;
  }
}

/**
 * Get RIASEC assessment results
 */
export async function getRiasecResults(assessmentId?: string) {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('getRiasecResults', {
      assessmentId
    });
    return result;
  } catch (error) {
    console.error('Failed to get RIASEC results:', error);
    throw error;
  }
}

/**
 * Get user's RIASEC assessment history
 */
export async function getRiasecHistory() {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('getRiasecHistory');
    return result;
  } catch (error) {
    console.error('Failed to get RIASEC history:', error);
    throw error;
  }
}
