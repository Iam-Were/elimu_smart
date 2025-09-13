// Shared utility types to reduce any usage across codebase

export type UserRole = 'student' | 'counselor' | 'admin';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GenericRecord {
  [key: string]: unknown;
}

export interface ParseObject {
  objectId: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface CloudFunctionParams {
  [key: string]: unknown;
}

export interface StorageValue {
  [key: string]: unknown;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  userId: string;
  metadata?: GenericRecord;
}

export interface ChatEvent {
  type: string;
  data: GenericRecord;
  timestamp: string;
}

export interface EmailStatistics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
}
