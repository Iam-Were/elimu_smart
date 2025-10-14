/**
 * Certification API
 * Manages external learning platform certifications
 */

import { getParse } from '@/config/parse';

export interface Certification {
  id: string;
  name: string;
  provider: string;
  status: 'In Progress' | 'Completed' | 'Not Started';
  progress: number;
  credentialUrl?: string;
  completedDate?: Date;
  expectedCompletion?: Date;
  platform?: string;
  skills?: string[];
}

/**
 * Sync external certification progress
 */
export async function syncExternalCertification(params: {
  platform: string;
  externalId: string;
  name: string;
  provider: string;
  status: 'In Progress' | 'Completed' | 'Not Started';
  progress?: number;
  credentialUrl?: string;
  completedDate?: string;
}): Promise<{ success: boolean; certification: Certification }> {
  const Parse = getParse();

  try {
    const result = await Parse.Cloud.run('syncExternalCertification', params);
    return result;
  } catch (error) {
    console.error('Failed to sync external certification:', error);
    throw error;
  }
}

/**
 * Connect external learning platform
 */
export async function connectLearningPlatform(params: {
  platform: string;
  accessToken: string;
  refreshToken?: string;
}): Promise<{ success: boolean; message: string }> {
  const Parse = getParse();

  try {
    const result = await Parse.Cloud.run('connectLearningPlatform', params);
    return result;
  } catch (error) {
    console.error('Failed to connect learning platform:', error);
    throw error;
  }
}
