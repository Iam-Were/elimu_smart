/**
 * Progressive Disclosure Booking Modal (Calendly-Style)
 *
 * Flow:
 * 1. Select Counselor
 * 2. Select Date & Time (Calendly-style calendar)
 * 3. Add Details & Confirm
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Video, Phone, MapPin, Star, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getAvailableCounselors,
  getCounselorAvailability,
  bookCounselorSession,
  formatDate,
  formatTime12Hour,
  getDayName,
  getNextWeekDates,
  isToday,
  type Counselor,
  type TimeSlot,
  type SessionDuration,
  type SessionType
} from '@/lib/bookingApi';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 'counselor' | 'datetime' | 'details' | 'success';

export function BookingModal({ open, onClose, onSuccess }: BookingModalProps) {
  const [step, setStep] = useState<Step>('counselor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Counselor Selection
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);

  // Step 2: Date & Time Selection
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [duration, setDuration] = useState<SessionDuration>(60);

  // Step 3: Details
  const [sessionType, setSessionType] = useState<SessionType>('video');
  const [notes, setNotes] = useState('');

  // Load counselors on mount
  useEffect(() => {
    if (open && step === 'counselor') {
      loadCounselors();
    }
  }, [open, step]);

  // Load week dates when step changes to datetime
  useEffect(() => {
    if (step === 'datetime') {
      updateWeekDates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, weekOffset]);

  // Load time slots when date or duration changes
  useEffect(() => {
    if (selectedDate && selectedCounselor) {
      loadTimeSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, duration, selectedCounselor]);

  const loadCounselors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAvailableCounselors();
      setCounselors(data);
    } catch (err) {
      setError('Failed to load counselors. Please try again.');
      console.error('Error loading counselors:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateWeekDates = () => {
    const baseDates = getNextWeekDates();
    const offsetDates = baseDates.map(date => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + (weekOffset * 7));
      return newDate;
    });
    setWeekDates(offsetDates);

    // Reset selected date if it's not in the new week
    if (selectedDate && offsetDates.every(d => d.getTime() !== selectedDate.getTime())) {
      setSelectedDate(null);
      setTimeSlots([]);
      setSelectedSlot(null);
    }
  };

  const loadTimeSlots = async () => {
    if (!selectedDate || !selectedCounselor) return;

    try {
      setLoading(true);
      setError(null);
      const dateStr = formatDate(selectedDate);
      const data = await getCounselorAvailability(selectedCounselor.objectId, dateStr, duration);

      if (data.message) {
        setTimeSlots([]);
        setError(data.message);
      } else {
        setTimeSlots(data.availableSlots);
      }
    } catch (err) {
      setError('Failed to load availability. Please try again.');
      console.error('Error loading time slots:', err);
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCounselor = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setStep('datetime');
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleContinueToDetails = () => {
    if (selectedDate && selectedSlot) {
      setStep('details');
    }
  };

  const handleBookSession = async () => {
    if (!selectedCounselor || !selectedDate || !selectedSlot) return;

    try {
      setLoading(true);
      setError(null);

      const result = await bookCounselorSession({
        counselorId: selectedCounselor.objectId,
        date: formatDate(selectedDate),
        startTime: selectedSlot.startTime,
        duration,
        sessionType,
        notes: notes.trim()
      });

      if (result.success) {
        setStep('success');
        onSuccess?.();
      }
    } catch (err) {
      setError('Failed to book session. Please try again.');
      console.error('Error booking session:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('counselor');
    setSelectedCounselor(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setTimeSlots([]);
    setWeekOffset(0);
    setDuration(60);
    setSessionType('video');
    setNotes('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleReset}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-orange-600" />
            Book Counseling Session
          </DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step === 'counselor' ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
          )}>
            1
          </div>
          <div className="w-16 h-1 bg-gray-200">
            <div className={cn(
              "h-full bg-orange-600 transition-all",
              step !== 'counselor' ? "w-full" : "w-0"
            )} />
          </div>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step === 'datetime' || step === 'details' || step === 'success' ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
          )}>
            2
          </div>
          <div className="w-16 h-1 bg-gray-200">
            <div className={cn(
              "h-full bg-orange-600 transition-all",
              step === 'details' || step === 'success' ? "w-full" : "w-0"
            )} />
          </div>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step === 'details' || step === 'success' ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
          )}>
            3
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Counselor Selection */}
        {step === 'counselor' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select a Counselor</h3>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
              </div>
            ) : (
              <div className="grid gap-4">
                {counselors.map((counselor) => (
                  <button
                    key={counselor.objectId}
                    onClick={() => handleSelectCounselor(counselor)}
                    className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-orange-600 hover:bg-orange-50 transition-all text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                      {counselor.firstName[0]}{counselor.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {counselor.firstName} {counselor.lastName}
                        </h4>
                        {counselor.rating && (
                          <div className="flex items-center gap-1 text-sm text-amber-600">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium">{counselor.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      {counselor.specializations && counselor.specializations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {counselor.specializations.map((spec, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {counselor.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2">{counselor.bio}</p>
                      )}
                      {counselor.totalSessions && (
                        <p className="text-xs text-gray-500 mt-1">
                          {counselor.totalSessions} sessions completed
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 'datetime' && selectedCounselor && (
          <div className="space-y-6">
            {/* Selected Counselor Header */}
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-lg">
                  {selectedCounselor.firstName[0]}{selectedCounselor.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedCounselor.firstName} {selectedCounselor.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{selectedCounselor.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep('counselor')}>
                Change
              </Button>
            </div>

            {/* Session Duration */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Session Duration</Label>
              <RadioGroup
                value={String(duration)}
                onValueChange={(val) => {
                  setDuration(Number(val) as SessionDuration);
                  setSelectedSlot(null);
                }}
                className="flex gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30" id="30min" />
                  <Label htmlFor="30min" className="cursor-pointer">30 min</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60" id="60min" />
                  <Label htmlFor="60min" className="cursor-pointer">1 hour</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="90" id="90min" />
                  <Label htmlFor="90min" className="cursor-pointer">1.5 hours</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Week Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                disabled={weekOffset === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Week
              </Button>
              <span className="text-sm font-medium text-gray-600">
                {weekDates[0] && weekDates[6] && (
                  `${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                )}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekOffset(weekOffset + 1)}
                disabled={weekOffset >= 4} // Max 4 weeks ahead
              >
                Next Week
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Date Selection (Calendly-style) */}
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, idx) => {
                const isSelected = selectedDate?.getTime() === date.getTime();
                const isTodayDate = isToday(date);
                const dayOfWeek = date.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    disabled={isWeekend}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all text-center",
                      isSelected && !isWeekend && "border-orange-600 bg-orange-50",
                      !isSelected && !isWeekend && "border-gray-200 hover:border-orange-300",
                      isWeekend && "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {getDayName(dayOfWeek).substring(0, 3)}
                    </div>
                    <div className={cn(
                      "text-lg font-semibold",
                      isSelected ? "text-orange-600" : "text-gray-900"
                    )}>
                      {date.getDate()}
                    </div>
                    {isTodayDate && (
                      <div className="text-xs text-orange-600 mt-1">Today</div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Available Times for {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Label>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No available time slots for this date</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                    {timeSlots.map((slot, idx) => {
                      const isSelected = selectedSlot?.startTime === slot.startTime;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectSlot(slot)}
                          className={cn(
                            "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                            isSelected
                              ? "border-orange-600 bg-orange-600 text-white"
                              : "border-gray-200 hover:border-orange-300 text-gray-700"
                          )}
                        >
                          {formatTime12Hour(slot.startTime)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Continue Button */}
            {selectedDate && selectedSlot && (
              <Button
                onClick={handleContinueToDetails}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}

        {/* Step 3: Details & Confirmation */}
        {step === 'details' && selectedCounselor && selectedDate && selectedSlot && (
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>

              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Counselor:</span>
                <span className="font-medium">{selectedCounselor.firstName} {selectedCounselor.lastName}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {formatTime12Hour(selectedSlot.startTime)} - {formatTime12Hour(selectedSlot.endTime)}
                </span>
                <Badge variant="secondary" className="ml-2">{duration} min</Badge>
              </div>
            </div>

            {/* Session Type */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Session Type</Label>
              <RadioGroup value={sessionType} onValueChange={(val) => setSessionType(val as SessionType)}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border-2 rounded-lg hover:border-orange-300 transition-all">
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-blue-600" />
                      <div>
                        <Label htmlFor="video" className="cursor-pointer font-medium">Video Call</Label>
                        <p className="text-xs text-gray-500">Online via Zoom/Google Meet</p>
                      </div>
                    </div>
                    <RadioGroupItem value="video" id="video" />
                  </div>

                  <div className="flex items-center justify-between p-3 border-2 rounded-lg hover:border-orange-300 transition-all">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <Label htmlFor="phone" className="cursor-pointer font-medium">Phone Call</Label>
                        <p className="text-xs text-gray-500">Voice call only</p>
                      </div>
                    </div>
                    <RadioGroupItem value="phone" id="phone" />
                  </div>

                  <div className="flex items-center justify-between p-3 border-2 rounded-lg hover:border-orange-300 transition-all">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <div>
                        <Label htmlFor="in-person" className="cursor-pointer font-medium">In-Person</Label>
                        <p className="text-xs text-gray-500">Meet at counselor's office</p>
                      </div>
                    </div>
                    <RadioGroupItem value="in-person" id="in-person" />
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
                Notes for Counselor (Optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What would you like to discuss? Any specific concerns or questions?"
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{notes.length}/500 characters</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('datetime')}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleBookSession}
                disabled={loading}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Session Booked!</h3>
            <p className="text-gray-600 mb-6">
              Your counseling session has been successfully scheduled.
              You'll receive a confirmation email shortly.
            </p>
            <Button onClick={handleReset} className="bg-orange-600 hover:bg-orange-700">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
