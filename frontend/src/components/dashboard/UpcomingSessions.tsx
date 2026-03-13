import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Phone, MapPin, User, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { getMyBookings, type SessionBooking, formatTime12Hour } from '@/lib/bookingApi';
import { cn } from '@/lib/utils';

interface UpcomingSessionsProps {
  className?: string;
  maxSessions?: number;
}

export const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({
  className,
  maxSessions = 3
}) => {
  const [bookings, setBookings] = useState<SessionBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const allBookings = await getMyBookings();

      // Filter upcoming sessions (not cancelled or completed)
      const upcoming = allBookings
        .filter(b =>
          (b.status === 'pending' || b.status === 'confirmed') &&
          new Date(b.sessionDate.iso) >= new Date()
        )
        .sort((a, b) =>
          new Date(a.sessionDate.iso).getTime() - new Date(b.sessionDate.iso).getTime()
        )
        .slice(0, maxSessions);

      setBookings(upcoming);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-700';
      case 'phone': return 'bg-green-100 text-green-700';
      case 'in-person': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-orange-300 mx-auto mb-3" />
            <p className="text-base font-medium text-gray-700 mb-1">No sessions booked yet</p>
            <p className="text-sm text-gray-500 mb-4">Your counselor is ready when you are — book your first session today.</p>
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => window.location.href = '/guidance'}
            >
              Book a Session
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Sessions ({bookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.objectId}
              className="p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50/30 transition-colors"
            >
              {/* Header: Date and Status */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <Clock className="h-4 w-4 text-orange-600" />
                  {formatDate(booking.sessionDate.iso)}
                </div>
                {getStatusBadge(booking.status)}
              </div>

              {/* Time and Type */}
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm text-gray-600">
                  {formatTime12Hour(booking.startTime)} - {formatTime12Hour(booking.endTime)}
                </span>
                <Badge className={cn("text-xs", getSessionTypeColor(booking.sessionType))}>
                  <span className="flex items-center gap-1">
                    {getSessionTypeIcon(booking.sessionType)}
                    {booking.sessionType}
                  </span>
                </Badge>
              </div>

              {/* Counselor Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {booking.counselor.firstName} {booking.counselor.lastName}
              </div>

              {/* Meeting Link (if video session and confirmed) */}
              {booking.sessionType === 'video' && booking.status === 'confirmed' && booking.meetingLink && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                    onClick={() => window.open(booking.meetingLink, '_blank')}
                  >
                    <Video className="h-3 w-3 mr-1" />
                    Join Video Call
                  </Button>
                </div>
              )}

              {/* Notes (if any) */}
              {booking.notes && (
                <p className="text-xs text-gray-500 mt-2 italic line-clamp-2">
                  {booking.notes}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        {bookings.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.location.href = '/sessions'}
            >
              View All Sessions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingSessions;
