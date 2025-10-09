import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSessionBooking } from '@/hooks/useSessionBooking';
import { useSubscription } from '@/hooks/useSubscription';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  Lock,
  Star,
  CheckCircle2,
  AlertCircle,
  User,
  Loader2,
} from 'lucide-react';

interface Counselor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  availableSlots: string[];
  sessionTypes: ('video' | 'phone' | 'in-person')[];
  pricing: {
    thirtyMin: number;
    sixtyMin: number;
    ninetyMin: number;
  };
}

const sampleCounselors: Counselor[] = [
  {
    id: '1',
    name: 'Sarah Njeri',
    title: 'Senior Career Counselor',
    avatar: '/avatars/sarah.jpg',
    rating: 4.9,
    reviewCount: 127,
    specialties: ['University Selection', 'KUCCPS Guidance', 'Career Planning'],
    availableSlots: ['Mon 2PM', 'Wed 10AM', 'Fri 4PM'],
    sessionTypes: ['video', 'phone', 'in-person'],
    pricing: {
      thirtyMin: 1500,
      sixtyMin: 2500,
      ninetyMin: 3500,
    },
  },
  {
    id: '2',
    name: 'James Mutua',
    title: 'Educational Psychologist',
    avatar: '/avatars/james.jpg',
    rating: 4.8,
    reviewCount: 98,
    specialties: ['Academic Stress', 'Study Skills', 'Exam Preparation'],
    availableSlots: ['Tue 11AM', 'Thu 3PM', 'Sat 9AM'],
    sessionTypes: ['video', 'phone'],
    pricing: {
      thirtyMin: 1500,
      sixtyMin: 2500,
      ninetyMin: 3500,
    },
  },
];

const BookSession: React.FC = () => {
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<30 | 60 | 90>(60);
  const [selectedType, setSelectedType] = useState<'video' | 'phone' | 'in-person'>('video');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Hooks
  const { bookSession, isBooking, error: bookingError } = useSessionBooking();
  const { userSubscription, isLoading: subscriptionLoading } = useSubscription();

  // Check if user has premium subscription
  const hasPremium = userSubscription?.status === 'active';
  const showPaywall = !subscriptionLoading && !hasPremium;

  const getSessionTypeIcon = (type: 'video' | 'phone' | 'in-person') => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
    }
  };

  const getPriceForDuration = (counselor: Counselor) => {
    switch (selectedDuration) {
      case 30: return counselor.pricing.thirtyMin;
      case 60: return counselor.pricing.sixtyMin;
      case 90: return counselor.pricing.ninetyMin;
    }
  };

  const handleBookSession = async () => {
    if (!selectedCounselor || !sessionDate || !sessionTime) {
      return;
    }

    try {
      const result = await bookSession({
        counselorId: selectedCounselor,
        sessionDate,
        sessionTime,
        sessionType: selectedType,
        duration: selectedDuration,
        notes: sessionNotes
      });

      if (result.success) {
        setBookingSuccess(true);
        // Reset form
        setSelectedCounselor(null);
        setSessionDate('');
        setSessionTime('');
        setSessionNotes('');
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'PREMIUM_REQUIRED') {
        window.location.href = '/subscription';
      }
      // Error is already set by the hook
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book a Counseling Session</h1>
        <p className="text-muted-foreground">
          Schedule 1-on-1 sessions with professional counselors. Get personalized guidance for your career journey.
        </p>
      </div>

      {/* Success Message */}
      {bookingSuccess && (
        <Alert className="mb-8 border-green-600 bg-green-50">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-900">
            <strong>Session Booked Successfully!</strong> You'll receive a confirmation email with session details shortly.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {bookingError && (
        <Alert className="mb-8 border-red-600 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-900">
            <strong>Booking Failed:</strong> {bookingError}
          </AlertDescription>
        </Alert>
      )}

      {/* Premium Feature Notice */}
      {showPaywall && (
        <Alert className="mb-8 border-orange-600 bg-orange-50">
          <Lock className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-900">
            <strong>Premium Feature:</strong> Session booking requires an active subscription or pay-per-session.
            <Button
              variant="ghost"
              className="ml-2 p-0 h-auto text-orange-700 underline"
              onClick={() => window.location.href = '/subscription'}
            >
              View Plans
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold mb-1">1. Choose Counselor</p>
                <p className="text-sm text-muted-foreground">
                  Browse profiles and select the best match for your needs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold mb-1">2. Pick Time & Type</p>
                <p className="text-sm text-muted-foreground">
                  Select session duration and format (video, phone, in-person)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold mb-1">3. Confirm & Meet</p>
                <p className="text-sm text-muted-foreground">
                  Complete payment and receive session details via email
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Counselors */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Counselors</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sampleCounselors.map((counselor) => (
            <Card
              key={counselor.id}
              className={`hover:shadow-lg transition-shadow ${
                selectedCounselor === counselor.id ? 'border-orange-600 border-2' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {counselor.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{counselor.name}</CardTitle>
                    <CardDescription className="mb-2">{counselor.title}</CardDescription>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">{counselor.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({counselor.reviewCount} reviews)
                      </span>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {counselor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Available Slots */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Next available: {counselor.availableSlots[0]}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Session Types */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Session Formats</Label>
                  <div className="flex gap-2">
                    {counselor.sessionTypes.map((type) => (
                      <Badge key={type} variant="outline" className="capitalize">
                        {getSessionTypeIcon(type)}
                        <span className="ml-1">{type}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Pricing</Label>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="font-semibold">30 min</p>
                      <p className="text-muted-foreground">KES {counselor.pricing.thirtyMin}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="font-semibold">60 min</p>
                      <p className="text-muted-foreground">KES {counselor.pricing.sixtyMin}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="font-semibold">90 min</p>
                      <p className="text-muted-foreground">KES {counselor.pricing.ninetyMin}</p>
                    </div>
                  </div>
                </div>

                {/* Select Button */}
                <Button
                  className="w-full"
                  variant={selectedCounselor === counselor.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCounselor(counselor.id)}
                >
                  {selectedCounselor === counselor.id ? 'Selected' : 'Select Counselor'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Booking Form (shown after counselor selection) */}
      {selectedCounselor && (
        <Card className="mb-8 border-orange-600">
          <CardHeader>
            <CardTitle>Complete Your Booking</CardTitle>
            <CardDescription>
              Provide session details and preferences. You'll receive confirmation via email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Duration Selection */}
              <div>
                <Label className="mb-3 block">Session Duration</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[30, 60, 90].map((duration) => (
                    <Button
                      key={duration}
                      variant={selectedDuration === duration ? 'default' : 'outline'}
                      onClick={() => setSelectedDuration(duration as 30 | 60 | 90)}
                    >
                      {duration} min
                    </Button>
                  ))}
                </div>
              </div>

              {/* Session Type */}
              <div>
                <Label className="mb-3 block">Session Format</Label>
                <div className="grid grid-cols-3 gap-3">
                  {(['video', 'phone', 'in-person'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? 'default' : 'outline'}
                      onClick={() => setSelectedType(type)}
                      className="capitalize"
                    >
                      {getSessionTypeIcon(type)}
                      <span className="ml-2">{type}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Preferred Date/Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    className="mt-2"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input
                    id="time"
                    type="time"
                    className="mt-2"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Session Focus */}
              <div>
                <Label htmlFor="focus">What would you like to discuss?</Label>
                <Textarea
                  id="focus"
                  placeholder="Briefly describe your concerns or goals for this session..."
                  rows={4}
                  className="mt-2"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                />
              </div>

              {/* Total Cost */}
              <Alert className="bg-orange-50 border-orange-200">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <AlertDescription className="text-orange-900">
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Total Cost:</strong> {selectedDuration} min {selectedType} session
                    </span>
                    <span className="text-xl font-bold">
                      KES{' '}
                      {sampleCounselors.find((c) => c.id === selectedCounselor) &&
                        getPriceForDuration(
                          sampleCounselors.find((c) => c.id === selectedCounselor)!
                        )}
                    </span>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={hasPremium ? handleBookSession : () => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.location.href = '/subscription';
                }}
                disabled={isBooking || !sessionDate || !sessionTime || subscriptionLoading}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Booking Session...
                  </>
                ) : hasPremium ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Confirm Booking
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Session Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>Before Your Session:</strong> You'll receive a confirmation email with session link/phone number
            and a pre-session questionnaire to help your counselor prepare.
          </p>
          <p>
            <strong>During Your Session:</strong> Sessions are confidential, professional, and focused on your goals.
            Come prepared with questions and be open to guidance.
          </p>
          <p>
            <strong>After Your Session:</strong> You'll receive session notes, action items, and recommended resources.
            Follow-up sessions can be booked at a discounted rate.
          </p>
          <p>
            <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before your session. Late
            cancellations forfeit 50% of the session fee.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookSession;
