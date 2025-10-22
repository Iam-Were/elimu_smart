/**
 * Unified Card Type System for Elimu Smart
 *
 * This file consolidates all card interfaces across Dashboard, Assessment, and Guidance pages.
 * Replaces duplicate interfaces in StudentDashboardCards, StudentAssessmentCards, StudentGuidanceCards.
 *
 * Design Pattern: Discriminated union types for type-safe card rendering.
 * Badge variants use shadcn's actual variant types (no 'premium' or 'free').
 */

import type { ReactNode } from 'react';

/**
 * Base Card Interface
 * Shared properties across all card types
 */
export interface BaseCard {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  iconGradient: string; // Tailwind gradient classes (e.g., "from-purple-500 to-purple-600")
  actionText: string;
  actionUrl: string;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'success' | 'warning' | 'info' | 'destructive' | 'outline';
  };
  rowSpan?: 1 | 2; // Bento grid row height
}

/**
 * Dashboard Card Interface
 * For StudentDashboard.tsx - Dynamic personalized data
 */
export interface DashboardCard extends BaseCard {
  cardType: 'dashboard'; // Discriminator
  metric?: {
    label: string;
    value: string | number;
  };
  urgency?: 'high' | 'medium' | 'low';
  lastUpdated?: string;
}

/**
 * Assessment Card Interface
 * For AssessmentPage.tsx - RIASEC, Skills, University Finder, Career Explorer, Subject Mapper
 */
export interface AssessmentCard extends BaseCard {
  cardType: 'assessment'; // Discriminator
  assessmentType: 'riasec' | 'skills' | 'university' | 'career' | 'subjects';
  duration: string; // e.g., "15 minutes", "20 minutes"
  questions: number;
  benefit: string; // Single line benefit statement
  completionStatus?: {
    completed: boolean;
    completedDate?: string;
    progress: number; // 0-100
  };
}

/**
 * Guidance Card Interface
 * For GuidancePage.tsx - Freemium services (Community Q&A, Premium Inbox, Sessions, etc.)
 */
export interface GuidanceCard extends BaseCard {
  cardType: 'guidance'; // Discriminator
  serviceType: 'community' | 'premium' | 'crisis' | 'resources' | 'booking';
  isPremium: boolean; // Show lock icon if true
  features: string[]; // Max 3 features displayed
  responseTime?: string; // e.g., "24 hours", "Instant"
  counselorCount?: number; // Number of available counselors
}

/**
 * Badge Color Mapping Guide
 *
 * Use case → Badge variant:
 * - Free services → 'success' (green)
 * - Premium services → 'warning' (yellow/gold)
 * - Standard services → 'info' (blue)
 * - Urgent/Critical → 'destructive' (red)
 * - Completed → 'success' (green)
 * - In Progress → 'secondary' (gray)
 * - New/Unstarted → 'default' (orange/primary)
 */

/**
 * Card Array Types (for props)
 */
export type CardData = DashboardCard | AssessmentCard | GuidanceCard;
export type CardVariant = 'dashboard' | 'assessment' | 'guidance';
