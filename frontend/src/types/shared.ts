// Shared utility types to eliminate 'any' usage across the codebase
// Following CLAUDE.md systematic approach for type safety

// Generic utility types
export type GenericRecord = Record<string, unknown>;
export type GenericApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Parse API types
export interface ParseApiParams {
  where?: GenericRecord;
  limit?: number;
  skip?: number;
  order?: string;
  include?: string[];
}

export interface ParseObjectData {
  objectId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// Cloud function types
export interface CloudFunctionParams {
  [key: string]: unknown;
}

export interface CloudFunctionResponse<T = unknown> {
  result: T;
}

// Email service types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables?: string[];
}

export interface EmailStatistics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
}

// Chat types
export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  type: 'text' | 'file' | 'system';
  metadata?: GenericRecord;
}

export interface ChatEvent {
  type: string;
  payload: GenericRecord;
  timestamp: Date;
}

// Icon intelligence types
export interface IconMetadata {
  name: string;
  category: string;
  tags: string[];
  usage: string;
}

export interface IconMapping {
  [key: string]: {
    icon: React.ComponentType;
    metadata: IconMetadata;
  };
}

// Local storage types
export interface StorageItem<T = unknown> {
  value: T;
  timestamp: number;
  expiry?: number;
}

export interface StorageOptions {
  prefix?: string;
  encrypt?: boolean;
  expire?: number;
}

// User role types (aligned with existing User interface)
export type UserRole = 'student' | 'counselor' | 'admin';

// API error types
export interface ApiError {
  code: string;
  message: string;
  details?: GenericRecord;
}

// Form types
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

// Component prop types for settings
export interface SettingsComponentProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    [key: string]: unknown;
  };
  profileImage?: string | null;
}

// Parse User types
export interface ParseUser {
  objectId?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  sessionToken?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// Assessment types  
export interface AssessmentData {
  objectId?: string;
  userId: string;
  assessmentType: string;
  results: GenericRecord;
  timestamp: string;
  score?: number;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Progress tracking types
export interface ProgressData {
  objectId?: string;
  userId?: string;
  courseId?: string;
  lessonId?: string;
  completedAt?: string;
  progress?: number;
  timeSpent?: number;
  updatedAt?: string;
  [key: string]: unknown;
}

// Parse Object interface for consistent typing
export interface ParseObject {
  id: string;
  get: (key: string) => unknown;
  set: (key: string, value: unknown) => void;
  save?: () => Promise<void>;
  destroy?: () => Promise<void>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Simplified Parse-like object for API responses
export interface ParseLike {
  id: string;
  get: (key: string) => unknown;
  createdAt?: Date;
  updatedAt?: Date;
}

// Parse User specific interface
export interface ParseUserLike {
  id?: string;
  get: (key: string) => unknown;
  createdAt?: Date;
  updatedAt?: Date;
}

// Scholarship data types
export interface ScholarshipData {
  id?: string;
  name: string;
  deadline: string;
  amount: number;
  requirements: string[];
  description?: string;
  provider?: string;
}

// Activity tracking types
export interface ActivityData {
  type: string;
  description: string;
  sentAt: Date;
  userId?: string;
  metadata?: GenericRecord;
}

// Assessment result types
export interface AssessmentResults {
  matchScore?: string;
  recommendedPath?: string;
  strengths?: string;
  score?: number;
  completedAt?: string;
}

// Icon configuration types
export interface IconConfig {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean; 'aria-label'?: string }>;
  size?: string;
  containerClass?: string;
  semantic?: string;
  description?: string;
  hoverEffect?: string;
  animation?: string;
  ariaLabel?: string;
}

export interface IconIntelligenceCategory {
  [key: string]: IconConfig;
}
