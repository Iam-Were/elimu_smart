/**
 * Counselor Booking System - Cloud Functions
 *
 * Features:
 * - Progressive disclosure booking flow
 * - Calendly-style availability display
 * - Intelligent slot calculation (9-hour workday)
 * - Real-time availability checking
 * - Booking conflict prevention
 *
 * Workflow:
 * 1. Student selects counselor → getCounselorAvailability()
 * 2. System shows available dates/times (Calendly-style)
 * 3. Student selects slot → bookSession()
 * 4. System confirms booking → sendBookingConfirmation()
 *
 * NOTE: Uses global Parse object from main.js (no local require needed)
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const WORK_HOURS = {
  start: 9,  // 9:00 AM
  end: 18,   // 6:00 PM (9-hour workday)
  workdays: [1, 2, 3, 4, 5], // Monday to Friday (0 = Sunday, 6 = Saturday)
};

const SESSION_DURATIONS = {
  short: 30,     // 30 minutes
  standard: 60,  // 1 hour
  extended: 90,  // 1.5 hours
};

const BUFFER_TIME = 15; // 15-minute buffer between sessions

// =============================================================================
// SCHEMA INITIALIZATION
// =============================================================================

/**
 * Initialize Counselor Booking Schema
 * Creates CounselorAvailability and SessionBooking tables
 */
Parse.Cloud.define('initializeCounselorBookingSchema', async () => {
  try {
    console.log('🚀 Starting Counselor Booking schema initialization...');

    // Get a real counselor user to use as pointer reference
    const counselorQuery = new Parse.Query(Parse.User);
    counselorQuery.equalTo('role', 'counselor');
    const counselor = await counselorQuery.first({ useMasterKey: true });

    if (!counselor) {
      throw new Error('No counselor found. Please create a counselor user first.');
    }

    // Get a real student user to use as pointer reference
    const studentQuery = new Parse.Query(Parse.User);
    studentQuery.equalTo('role', 'student');
    const student = await studentQuery.first({ useMasterKey: true });

    if (!student) {
      throw new Error('No student found. Please create a student user first.');
    }

    // 1. Create CounselorAvailability table
    console.log('1️⃣ Creating CounselorAvailability table...');
    const AvailabilityClass = Parse.Object.extend('CounselorAvailability');
    const dummyAvailability = new AvailabilityClass();

    dummyAvailability.set('counselor', counselor); // Pointer to real counselor
    dummyAvailability.set('dayOfWeek', 1); // 0=Sunday, 6=Saturday
    dummyAvailability.set('startTime', '09:00'); // HH:MM format
    dummyAvailability.set('endTime', '18:00');
    dummyAvailability.set('isRecurring', true); // Weekly recurring
    dummyAvailability.set('specificDate', null); // For one-off availability
    dummyAvailability.set('isActive', true);
    dummyAvailability.set('timezone', 'Africa/Nairobi');
    dummyAvailability.set('isDeleted', true); // Mark as deleted

    await dummyAvailability.save(null, { useMasterKey: true });
    console.log('✅ CounselorAvailability table created');

    // 2. Create SessionBooking table
    console.log('2️⃣ Creating SessionBooking table...');
    const BookingClass = Parse.Object.extend('SessionBooking');
    const dummyBooking = new BookingClass();

    dummyBooking.set('counselor', counselor); // Pointer to real counselor
    dummyBooking.set('student', student); // Pointer to real student
    dummyBooking.set('sessionDate', new Date());
    dummyBooking.set('startTime', '10:00');
    dummyBooking.set('endTime', '11:00');
    dummyBooking.set('duration', 60); // Minutes
    dummyBooking.set('sessionType', 'video'); // video, phone, in-person
    dummyBooking.set('status', 'pending'); // pending, confirmed, completed, cancelled
    dummyBooking.set('notes', 'Schema initialization dummy');
    dummyBooking.set('meetingLink', null); // Zoom/Google Meet link
    dummyBooking.set('cancelledBy', null); // User objectId if cancelled
    dummyBooking.set('cancelledAt', null);
    dummyBooking.set('cancellationReason', null);
    dummyBooking.set('isDeleted', true);

    await dummyBooking.save(null, { useMasterKey: true });
    console.log('✅ SessionBooking table created');

    console.log('✅ Counselor Booking schema initialization complete!');

    return {
      success: true,
      message: 'Counselor Booking schema initialized successfully',
      tables: ['CounselorAvailability', 'SessionBooking']
    };
  } catch (error) {
    console.error('❌ Schema initialization failed:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Schema initialization failed: ${error.message}`);
  }
});

// =============================================================================
// AVAILABILITY FUNCTIONS
// =============================================================================

/**
 * Get available counselors with their specializations
 * Returns list of counselors for student to choose from
 */
Parse.Cloud.define('getAvailableCounselors', async (request) => {
  try {
    const query = new Parse.Query(Parse.User);
    query.equalTo('role', 'counselor');
    query.equalTo('isActive', true);
    query.select('firstName', 'lastName', 'email', 'specializations', 'bio', 'rating', 'totalSessions');

    const counselors = await query.find({ useMasterKey: true });

    return counselors.map(c => c.toJSON());
  } catch (error) {
    console.error('Error fetching counselors:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to fetch counselors');
  }
});

/**
 * Calculate available time slots for a counselor on a specific date
 * Calendly-style: Shows only available slots based on bookings
 *
 * @param {string} counselorId - Counselor's objectId
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} duration - Session duration in minutes (30, 60, or 90)
 * @returns {Array} Available time slots with start/end times
 */
Parse.Cloud.define('getCounselorAvailability', async (request) => {
  const { counselorId, date, duration = 60 } = request.params;

  if (!counselorId || !date) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'counselorId and date are required');
  }

  try {
    const sessionDate = new Date(date);
    const dayOfWeek = sessionDate.getDay();

    // Check if it's a workday
    if (!WORK_HOURS.workdays.includes(dayOfWeek)) {
      return {
        date,
        dayOfWeek,
        availableSlots: [],
        message: 'Counselor does not work on this day'
      };
    }

    // Get counselor's availability settings (if customized)
    const AvailabilityClass = Parse.Object.extend('CounselorAvailability');
    const availQuery = new Parse.Query(AvailabilityClass);
    availQuery.equalTo('counselor', { __type: 'Pointer', className: '_User', objectId: counselorId });
    availQuery.equalTo('dayOfWeek', dayOfWeek);
    availQuery.equalTo('isActive', true);
    availQuery.equalTo('isDeleted', false);

    const availability = await availQuery.first({ useMasterKey: true });

    // Use counselor's custom hours or default work hours
    const workStart = availability ? parseInt(availability.get('startTime').split(':')[0]) : WORK_HOURS.start;
    const workEnd = availability ? parseInt(availability.get('endTime').split(':')[0]) : WORK_HOURS.end;

    // Get existing bookings for this counselor on this date
    const BookingClass = Parse.Object.extend('SessionBooking');
    const bookingQuery = new Parse.Query(BookingClass);
    bookingQuery.equalTo('counselor', { __type: 'Pointer', className: '_User', objectId: counselorId });

    // Query for bookings on the specific date
    const startOfDay = new Date(sessionDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(sessionDate);
    endOfDay.setHours(23, 59, 59, 999);

    bookingQuery.greaterThanOrEqualTo('sessionDate', startOfDay);
    bookingQuery.lessThanOrEqualTo('sessionDate', endOfDay);
    bookingQuery.notEqualTo('status', 'cancelled');
    bookingQuery.notEqualTo('isDeleted', true);

    const existingBookings = await bookingQuery.find({ useMasterKey: true });

    // Convert bookings to time slots
    const bookedSlots = existingBookings.map(booking => ({
      start: booking.get('startTime'),
      end: booking.get('endTime'),
      duration: booking.get('duration')
    }));

    // Generate all possible time slots
    const allSlots = [];
    for (let hour = workStart; hour < workEnd; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endHour = hour + Math.floor((minute + duration) / 60);
        const endMinute = (minute + duration) % 60;
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

        // Check if slot ends before work hours end
        if (endHour < workEnd || (endHour === workEnd && endMinute === 0)) {
          allSlots.push({ startTime, endTime, duration });
        }
      }
    }

    // Filter out booked slots and add buffer
    const availableSlots = allSlots.filter(slot => {
      return !bookedSlots.some(booked => {
        // Check for time overlap (with buffer)
        const slotStart = timeToMinutes(slot.startTime);
        const slotEnd = timeToMinutes(slot.endTime);
        const bookedStart = timeToMinutes(booked.start);
        const bookedEnd = timeToMinutes(booked.end) + BUFFER_TIME;

        return (slotStart >= bookedStart && slotStart < bookedEnd) ||
               (slotEnd > bookedStart && slotEnd <= bookedEnd) ||
               (slotStart <= bookedStart && slotEnd >= bookedEnd);
      });
    });

    // Don't show slots in the past
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredSlots = sessionDate.getTime() === today.getTime()
      ? availableSlots.filter(slot => {
          const slotTime = timeToMinutes(slot.startTime);
          const currentTime = now.getHours() * 60 + now.getMinutes();
          return slotTime > currentTime + BUFFER_TIME;
        })
      : availableSlots;

    return {
      date,
      dayOfWeek,
      workHours: { start: workStart, end: workEnd },
      totalSlots: allSlots.length,
      bookedSlots: bookedSlots.length,
      availableSlots: filteredSlots,
      timezone: 'Africa/Nairobi'
    };
  } catch (error) {
    console.error('Error calculating availability:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to calculate availability');
  }
});

// Helper: Convert time string to minutes since midnight
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Get available dates for the next 30 days
 * Shows which days have at least one available slot
 */
Parse.Cloud.define('getCounselorAvailableDates', async (request) => {
  const { counselorId, duration = 60 } = request.params;

  if (!counselorId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'counselorId is required');
  }

  try {
    const availableDates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check next 30 days
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);

      const dayOfWeek = checkDate.getDay();

      // Skip non-workdays
      if (!WORK_HOURS.workdays.includes(dayOfWeek)) {
        continue;
      }

      const dateStr = checkDate.toISOString().split('T')[0];

      // Get availability for this date
      const availability = await Parse.Cloud.run('getCounselorAvailability', {
        counselorId,
        date: dateStr,
        duration
      }, { useMasterKey: true });

      if (availability.availableSlots.length > 0) {
        availableDates.push({
          date: dateStr,
          dayOfWeek,
          slotsAvailable: availability.availableSlots.length
        });
      }
    }

    return availableDates;
  } catch (error) {
    console.error('Error getting available dates:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get available dates');
  }
});

// =============================================================================
// BOOKING FUNCTIONS
// =============================================================================

/**
 * Book a session with a counselor
 * Validates availability and creates booking
 */
Parse.Cloud.define('bookCounselorSession', async (request) => {
  const { counselorId, date, startTime, duration, sessionType, notes } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  if (!counselorId || !date || !startTime || !duration || !sessionType) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Missing required parameters');
  }

  try {
    // Re-check availability to prevent double-booking
    const availability = await Parse.Cloud.run('getCounselorAvailability', {
      counselorId,
      date,
      duration
    }, { useMasterKey: true });

    const requestedSlot = availability.availableSlots.find(slot => slot.startTime === startTime);

    if (!requestedSlot) {
      throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'This time slot is no longer available');
    }

    // Create booking
    const BookingClass = Parse.Object.extend('SessionBooking');
    const booking = new BookingClass();

    booking.set('counselor', { __type: 'Pointer', className: '_User', objectId: counselorId });
    booking.set('student', user);
    booking.set('sessionDate', new Date(date));
    booking.set('startTime', startTime);
    booking.set('endTime', requestedSlot.endTime);
    booking.set('duration', duration);
    booking.set('sessionType', sessionType);
    booking.set('status', 'pending');
    booking.set('notes', notes || '');
    booking.set('isDeleted', false);

    const savedBooking = await booking.save(null, { useMasterKey: true });

    // TODO: Send confirmation email to both student and counselor

    return {
      success: true,
      bookingId: savedBooking.id,
      booking: savedBooking.toJSON(),
      message: 'Session booked successfully'
    };
  } catch (error) {
    console.error('Error booking session:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, error.message || 'Failed to book session');
  }
});

/**
 * Get user's upcoming bookings
 */
Parse.Cloud.define('getMyBookings', async (request) => {
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  try {
    const BookingClass = Parse.Object.extend('SessionBooking');
    const query = new Parse.Query(BookingClass);

    // Check user role to determine query
    const role = user.get('role');
    if (role === 'counselor') {
      query.equalTo('counselor', user);
    } else {
      query.equalTo('student', user);
    }

    query.greaterThanOrEqualTo('sessionDate', new Date());
    query.notEqualTo('isDeleted', true);
    query.descending('sessionDate');
    query.include('counselor');
    query.include('student');

    const bookings = await query.find({ useMasterKey: true });

    return bookings.map(b => b.toJSON());
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to fetch bookings');
  }
});

/**
 * Cancel a booking
 */
Parse.Cloud.define('cancelBooking', async (request) => {
  const { bookingId, reason } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  if (!bookingId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'bookingId is required');
  }

  try {
    const BookingClass = Parse.Object.extend('SessionBooking');
    const query = new Parse.Query(BookingClass);
    const booking = await query.get(bookingId, { useMasterKey: true });

    // Verify user has permission to cancel
    const studentId = booking.get('student').id;
    const counselorId = booking.get('counselor').id;

    if (user.id !== studentId && user.id !== counselorId) {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'You do not have permission to cancel this booking');
    }

    booking.set('status', 'cancelled');
    booking.set('cancelledBy', user.id);
    booking.set('cancelledAt', new Date());
    booking.set('cancellationReason', reason || 'No reason provided');

    await booking.save(null, { useMasterKey: true });

    return {
      success: true,
      message: 'Booking cancelled successfully'
    };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, error.message || 'Failed to cancel booking');
  }
});
