// Enhanced localStorage-based backend for local development
// Provides persistent data storage without requiring external services

import type { ParseUser, AssessmentData, ProgressData, GenericRecord } from '../types/shared';

interface StoredData {
  users: Record<string, ParseUser>;
  sessions: Record<string, GenericRecord>;
  assessments: Record<string, AssessmentData>;
  progress: Record<string, ProgressData>;
}

const STORAGE_KEY = 'elimu-smart-data';

class LocalStorageBackend {
  private data: StoredData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): StoredData {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        console.warn('Invalid stored data, using defaults');
      }
    }
    
    return {
      users: {},
      sessions: {},
      assessments: {},
      progress: {}
    };
  }

  private saveData(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  // User management
  saveUser(user: ParseUser): void {
    if (user.objectId) {
      this.data.users[user.objectId] = user;
      this.saveData();
    }
  }

  getUser(id: string): ParseUser | null {
    return this.data.users[id] || null;
  }

  // Assessment data
  saveAssessment(userId: string, assessmentType: string, results: GenericRecord): void {
    const key = `${userId}-${assessmentType}`;
    this.data.assessments[key] = {
      userId,
      assessmentType,
      results,
      timestamp: new Date().toISOString()
    };
    this.saveData();
  }

  getAssessments(userId: string): AssessmentData[] {
    return Object.values(this.data.assessments).filter(
      (assessment) => assessment.userId === userId
    );
  }

  // Progress tracking
  updateProgress(userId: string, progressData: ProgressData): void {
    this.data.progress[userId] = {
      ...(this.data.progress[userId] || {}),
      ...progressData,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
  }

  getProgress(userId: string): ProgressData {
    return this.data.progress[userId] || {};
  }

  // Export/import for backup
  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonData: string): void {
    try {
      this.data = JSON.parse(jsonData);
      this.saveData();
    } catch {
      throw new Error('Invalid JSON data for import');
    }
  }

  // Clear all data (for testing)
  clearAll(): void {
    this.data = {
      users: {},
      sessions: {},
      assessments: {},
      progress: {}
    };
    this.saveData();
  }
}

export const localBackend = new LocalStorageBackend();
export default localBackend;