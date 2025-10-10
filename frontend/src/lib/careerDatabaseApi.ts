/**
 * Career Database API
 * Functions for querying the Career database (Parse Class)
 * Replaces hardcoded SubjectCareerMapper data
 */

import { getParse } from '@/config/parse';

export interface CareerData {
  id: string;
  title: string;
  category: string;
  matchScore?: number;
  description: string;
  salaryRange?: string;
  demand?: 'High' | 'Medium' | 'Low';
  kuccpsPathway?: string;
  skills?: string[];
  minClusterPoints?: number;
  employmentRate?: number;
  avgSalary?: number;
  relatedSubjects?: string[];
  subjectCombinations?: string[][];
  alternativePathways?: string[];
  kuccpsCode?: string;
}

/**
 * Get careers by subject
 * Replaces frontend SUBJECT_CAREERS lookup
 */
export async function getCareersBySubject(subject: string): Promise<CareerData[]> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('getCareersBySubject', { subject });
    return result as CareerData[];
  } catch (error) {
    console.error('Failed to get careers by subject:', error);
    throw error;
  }
}

/**
 * Search careers by keyword with optional filters
 */
export async function searchCareers(params: {
  query: string;
  category?: string;
  minSalary?: number;
  demand?: 'High' | 'Medium' | 'Low';
}): Promise<CareerData[]> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('searchCareers', params);
    return result as CareerData[];
  } catch (error) {
    console.error('Failed to search careers:', error);
    throw error;
  }
}

/**
 * Get all career categories
 */
export async function getCareerCategories(): Promise<string[]> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('getCareerCategories');
    return result as string[];
  } catch (error) {
    console.error('Failed to get career categories:', error);
    throw error;
  }
}

/**
 * Get career details by ID
 */
export async function getCareerById(careerId: string): Promise<CareerData> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('getCareerById', { careerId });
    return result as CareerData;
  } catch (error) {
    console.error('Failed to get career by ID:', error);
    throw error;
  }
}

/**
 * Get top careers across all subjects
 */
export async function getTopCareers(params?: {
  limit?: number;
  category?: string;
}): Promise<CareerData[]> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('getTopCareers', params || {});
    return result as CareerData[];
  } catch (error) {
    console.error('Failed to get top careers:', error);
    throw error;
  }
}
