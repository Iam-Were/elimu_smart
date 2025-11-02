/**
 * Counselor Booking API Integration
 * Provides type-safe wrappers for booking cloud functions
 */

import { getParse } from '@/config/parse';

// =============================================================================
// TYPES
// =============================================================================

export interface Counselor {
  objectId: string;
  firstName: string;
  lastName: string;
  email: string;
  specializations?: string[];
  bio?: string;
  rating?: number;
  totalSessions?: number;
}

export interface TimeSlot {
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  duration: number;  // Minutes
}

export interface AvailabilityData {
  date: string;           // YYYY-MM-DD
  dayOfWeek: number;      // 0=Sunday, 6=Saturday
  workHours: {
    start: number;        // Hour (9 = 9 AM)
    end: number;          // Hour (18 = 6 PM)
  };
  totalSlots: number;
  bookedSlots: number;
  availableSlots: TimeSlot[];
  timezone: string;
  message?: string;       // For non-workdays
}

export interface AvailableDate {
  date: string;           // YYYY-MM-DD
  dayOfWeek: number;
  slotsAvailable: number;
}

export interface BookingResult {
  success: boolean;
  bookingId: string;
  booking: {
    objectId: string;
    counselor: { objectId: string };
    student: { objectId: string };
    sessionDate: { iso: string };
    startTime: string;
    endTime: string;
    duration: number;
    sessionType: string;
    status: string;
    notes: string;
  };
  message: string;
}

export interface SessionBooking {
  objectId: string;
  counselor: {
    objectId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  student: {
    objectId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  sessionDate: { iso: string };
  startTime: string;
  endTime: string;
  duration: number;
  sessionType: 'video' | 'phone' | 'in-person';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  meetingLink?: string;
  cancelledBy?: string;
  cancelledAt?: { iso: string };
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type SessionDuration = 30 | 60 | 90;
export type SessionType = 'video' | 'phone' | 'in-person';

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Get list of available counselors
 */
export async function getAvailableCounselors(): Promise<Counselor[]> {
  const Parse = await getParse();
  const result = await Parse.Cloud.run('getAvailableCounselors');
  return result as Counselor[];
}

/**
 * Get available time slots for a counselor on a specific date
 */
export async function getCounselorAvailability(
  counselorId: string,
  date: string,
  duration: SessionDuration = 60
): Promise<AvailabilityData> {
  const Parse = await getParse();
  const result = await Parse.Cloud.run('getCounselorAvailability', {
    counselorId,
    date,
    duration
  });
  return result as AvailabilityData;
}

/**
 * Get available dates for the next 30 days
 */
export async function getCounselorAvailableDates(
  counselorId: string,
  duration: SessionDuration = 60
): Promise<AvailableDate[]> {
  const Parse = await getParse();
  const result = await Parse.Cloud.run('getCounselorAvailableDates', {
    counselorId,
    duration
  });
  return result as AvailableDate[];
}

/**
 * Book a counselor session
 */
export async function bookCounselorSession(params: {
  counselorId: string;
  date: string;
  startTime: string;
  duration: SessionDuration;
  sessionType: SessionType;
  notes?: string;
}): Promise<BookingResult> {
  const Parse = await getParse();
  const result = await Parse.Cloud.run('bookCounselorSession', params);
  return result as BookingResult;
}

/**
 * Get user's bookings (role-aware: student or counselor)
 */
export async function getMyBookings(): Promise<SessionBooking[]> {
  const Parse = await getParse();
  const result = await Parse.Cloud.run('getMyBookings');
  return result as SessionBooking[];
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  const Parse = await getParse();
  const result = await Parse.Cloud.run('cancelBooking', {
    bookingId,
    reason
  });
  return result as { success: boolean; message: string };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse date from YYYY-MM-DD
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

/**
 * Get day name from dayOfWeek number
 */
export function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
}

/**
 * Format time from HH:MM to 12-hour format
 */
export function formatTime12Hour(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Get next 7 days starting from today
 */
export function getNextWeekDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  return dates;
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}
