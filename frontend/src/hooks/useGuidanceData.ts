import { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';

interface SessionBooking {
  id: string;
  date: Date;
  duration: number;
  type: string;
  counselor?: {
    name: string;
    avatar?: string;
  };
  status: 'upcoming' | 'past' | 'cancelled';
}

interface GuidanceData {
  upcomingSessionsCount: number;
  pastSessionsCount: number;
  unreadMessagesCount: number;
  nextAvailableSlot?: string;
  upcomingSessions: SessionBooking[];
  pastSessions: SessionBooking[];
}

export const useGuidanceData = () => {
  const [data, setData] = useState<GuidanceData>({
    upcomingSessionsCount: 0,
    pastSessionsCount: 0,
    unreadMessagesCount: 0,
    upcomingSessions: [],
    pastSessions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuidanceData = async () => {
      try {
        setLoading(true);
        const Parse = await getParse();
        const currentUser = Parse.User.current();

        if (!currentUser) {
          setError('Please log in to view your guidance data');
          return;
        }

        // Fetch pending session requests (bookings)
        const sessionsData = await Parse.Cloud.run('getPendingSessionRequests', {
          userId: currentUser.id
        }).catch(() => ({ upcoming: [], past: [] }));

        // Fetch inbox conversations for message count
        const inboxData = await Parse.Cloud.run('getInboxConversations', {
          userId: currentUser.id
        }).catch(() => ({ conversations: [], unreadCount: 0 }));

        // Process sessions data
        const now = new Date();
        const upcomingSessions: SessionBooking[] = [];
        const pastSessions: SessionBooking[] = [];

        if (sessionsData.sessions && Array.isArray(sessionsData.sessions)) {
          sessionsData.sessions.forEach((session: unknown) => {
            const sessionObj = session as {
              id: string;
              sessionDate: Date | string;
              duration: number;
              sessionType: string;
              counselorName?: string;
              status?: string;
            };

            const sessionDate = typeof sessionObj.sessionDate === 'string'
              ? new Date(sessionObj.sessionDate)
              : sessionObj.sessionDate;

            const booking: SessionBooking = {
              id: sessionObj.id,
              date: sessionDate,
              duration: sessionObj.duration || 60,
              type: sessionObj.sessionType || 'video',
              counselor: sessionObj.counselorName ? { name: sessionObj.counselorName } : undefined,
              status: sessionDate >= now ? 'upcoming' : 'past'
            };

            if (sessionDate >= now) {
              upcomingSessions.push(booking);
            } else {
              pastSessions.push(booking);
            }
          });
        }

        // Sort sessions by date
        upcomingSessions.sort((a, b) => a.date.getTime() - b.date.getTime());
        pastSessions.sort((a, b) => b.date.getTime() - a.date.getTime());

        // Get next available slot (if upcoming sessions exist)
        const nextSlot = upcomingSessions.length > 0
          ? upcomingSessions[0].date.toLocaleString('en-KE', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })
          : undefined;

        setData({
          upcomingSessionsCount: upcomingSessions.length,
          pastSessionsCount: pastSessions.length,
          unreadMessagesCount: inboxData.unreadCount || 0,
          nextAvailableSlot: nextSlot,
          upcomingSessions,
          pastSessions
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching guidance data:', err);
        setError('Failed to load guidance data');
      } finally {
        setLoading(false);
      }
    };

    fetchGuidanceData();
  }, []);

  const refetch = async () => {
    setLoading(true);
    // Re-run the fetch logic
    const fetchGuidanceData = async () => {
      try {
        const Parse = await getParse();
        const currentUser = Parse.User.current();
        if (!currentUser) return;

        const sessionsData = await Parse.Cloud.run('getPendingSessionRequests', {
          userId: currentUser.id
        }).catch(() => ({ upcoming: [], past: [] }));

        const inboxData = await Parse.Cloud.run('getInboxConversations', {
          userId: currentUser.id
        }).catch(() => ({ conversations: [], unreadCount: 0 }));

        const now = new Date();
        const upcomingSessions: SessionBooking[] = [];
        const pastSessions: SessionBooking[] = [];

        if (sessionsData.sessions && Array.isArray(sessionsData.sessions)) {
          sessionsData.sessions.forEach((session: unknown) => {
            const sessionObj = session as {
              id: string;
              sessionDate: Date | string;
              duration: number;
              sessionType: string;
              counselorName?: string;
            };

            const sessionDate = typeof sessionObj.sessionDate === 'string'
              ? new Date(sessionObj.sessionDate)
              : sessionObj.sessionDate;

            const booking: SessionBooking = {
              id: sessionObj.id,
              date: sessionDate,
              duration: sessionObj.duration || 60,
              type: sessionObj.sessionType || 'video',
              counselor: sessionObj.counselorName ? { name: sessionObj.counselorName } : undefined,
              status: sessionDate >= now ? 'upcoming' : 'past'
            };

            if (sessionDate >= now) {
              upcomingSessions.push(booking);
            } else {
              pastSessions.push(booking);
            }
          });
        }

        upcomingSessions.sort((a, b) => a.date.getTime() - b.date.getTime());
        pastSessions.sort((a, b) => b.date.getTime() - a.date.getTime());

        const nextSlot = upcomingSessions.length > 0
          ? upcomingSessions[0].date.toLocaleString('en-KE', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })
          : undefined;

        setData({
          upcomingSessionsCount: upcomingSessions.length,
          pastSessionsCount: pastSessions.length,
          unreadMessagesCount: inboxData.unreadCount || 0,
          nextAvailableSlot: nextSlot,
          upcomingSessions,
          pastSessions
        });
      } catch (err) {
        console.error('Error refetching guidance data:', err);
      } finally {
        setLoading(false);
      }
    };

    await fetchGuidanceData();
  };

  return { ...data, loading, error, refetch };
};
