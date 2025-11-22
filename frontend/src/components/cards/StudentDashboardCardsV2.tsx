/**
 * StudentDashboardCards V2 - Mobile-Optimized Unified Card System
 *
 * BEFORE: 523 lines with custom card rendering logic
 * AFTER: ~100 lines using UnifiedCardGrid + useDynamicCards
 *
 * Mobile Features:
 * - WCAG AAA touch targets (48px minimum)
 * - Responsive text sizing (mobile-first)
 * - Active states for touch devices
 * - Dynamic backend-driven cards
 *
 * Dynamic Cards:
 * - Career Readiness Score (from backend calculation)
 * - University Placement (KUCCPS data)
 * - Scholarship Matches (personalized)
 * - Assessment Progress (completion tracking)
 * - Upcoming Deadlines (KUCCPS timeline)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedCardGrid } from './UnifiedCardGrid';
import { useDynamicCards } from '@/hooks/useDynamicCards';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertCircle, User, Activity, Camera, MapPin, Edit } from 'lucide-react';
import Button from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getParse } from '@/config/parse';
import { cn } from '@/lib/utils';
import UpcomingSessions from '../dashboard/UpcomingSessions';

interface ParseUserData {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  profileCompletion?: number;
  school?: string;
  grade?: string;
  location?: string;
}

interface StudentDashboardCardsV2Props {
  className?: string;
  maxCards?: number;
}

export const StudentDashboardCardsV2: React.FC<StudentDashboardCardsV2Props> = ({
  className,
  maxCards = 6
}) => {
  const navigate = useNavigate();

  // ✅ FIX #3: State for progressive disclosure
  const [expanded, setExpanded] = useState(false);

  // Use unified hook to fetch dashboard cards (returns ALL cards)
  const { cards, loading, error, refreshCards } = useDynamicCards({
    variant: 'dashboard'
  });

  // ✅ FIX: Slice cards for display in component, not in hook
  // This allows "Show More" button to know total count
  const displayedCards = expanded ? cards : cards.slice(0, maxCards);

  // Fetch dashboard data for hero section
  const { careerReadinessScore, userActivities } = useDynamicDashboard();

  // Get auth user to ensure profile photo is synced
  const { user: authUser } = useAuth();
  
  // User data state
  const [userData, setUserData] = useState<ParseUserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch Parse User data - synced with auth user profile photo
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const Parse = getParse();
        const currentUser = Parse.User.current();

        if (currentUser) {
          // Refresh user data from server to get latest profile photo
          await currentUser.fetch();
          
          const firstName = currentUser.get('firstName') || '';
          const lastName = currentUser.get('lastName') || '';
          const email = currentUser.get('email') || currentUser.get('username') || '';
          const profileImage = currentUser.get('profileImage');
          const school = currentUser.get('school') || currentUser.get('currentSchool');
          const grade = currentUser.get('grade') || currentUser.get('formLevel');
          const location = currentUser.get('location');

          // Calculate profile completion
          const fields = [
            currentUser.get('firstName'),
            currentUser.get('lastName'),
            currentUser.get('email'),
            currentUser.get('profileImage'),
            currentUser.get('phone'),
            school,
            grade
          ];
          const completedFields = fields.filter(f => f && f !== '').length;
          const profileCompletion = Math.round((completedFields / fields.length) * 100);

          setUserData({
            firstName,
            lastName,
            email,
            profileImage,
            profileCompletion,
            school,
            grade,
            location
          });
        }
      } catch (error) {
        console.warn('Failed to load Parse user data:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [authUser?.profileImage]); // Re-fetch when auth user's profile image changes

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-3 text-sm sm:text-base text-muted-foreground">Loading dashboard...</span>
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 text-sm sm:text-base mb-4">Failed to load dashboard</p>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">{error}</p>
        <Button
          onClick={refreshCards}
          className="min-h-[48px] bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Empty state
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          No dashboard data available
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Complete your profile and assessments to see personalized insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Hero Section - Simplified LinkedIn-style Profile Card */}
      <div className="mb-8">
        {/* Cover Photo - Simple gray background */}
        <div className="h-48 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative group">
          {/* Change Cover button - top right */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="absolute top-4 right-4 gap-2 bg-white/90 hover:bg-white text-gray-700 shadow-sm rounded-lg px-4 py-2"
          >
            <Camera className="h-4 w-4" />
            <span className="hidden md:inline">Change Cover</span>
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="border-0 md:border md:border-gray-200 shadow-sm mx-4 md:mx-auto max-w-4xl -mt-16 relative bg-white rounded-2xl">
          {/* Edit Pen Icon - Top Right of Card */}
          <button
            onClick={() => navigate('/profile')}
            className="absolute top-4 right-4 p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors z-10"
            title="Edit profile"
          >
            <Edit className="h-5 w-5" />
          </button>

          <CardContent className="pt-6 pb-6 px-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture - Overlapping cover */}
              <div className="relative mx-auto md:mx-0 -mt-20 md:-mt-24">
                {loadingUser ? (
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white bg-gray-100 animate-pulse shadow-lg" />
                ) : (
                  <>
                    <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white bg-white relative shadow-lg">
                      <AvatarImage src={userData?.profileImage} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-3xl md:text-4xl font-semibold">
                        {(userData?.firstName || 'U')[0]}{(userData?.lastName || 'U')[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* Camera icon - bottom right of profile photo */}
                    <button
                      onClick={() => navigate('/profile')}
                      className="absolute bottom-0 right-0 h-10 w-10 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-white hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="h-5 w-5 text-orange-600" />
                    </button>
                  </>
                )}
              </div>

              {/* Profile Info - Cleaner layout */}
              <div className="flex-1 mt-4 md:mt-16 text-center md:text-left">
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {userData?.firstName} {userData?.lastName}
                  </h1>
                  <p className="text-base text-orange-600 font-medium">
                    {userData?.grade || 'Form 4 Student'}
                  </p>
                  <p className="text-base text-gray-600">
                    {userData?.school || 'Student'}
                  </p>
                  <p className="text-gray-600 mt-2 flex items-center justify-center md:justify-start gap-1.5 text-sm">
                    <MapPin className="h-4 w-4" />
                    {userData?.location || 'Nairobi, Kenya'}
                  </p>
                </div>

                {/* Stats row below profile info */}
                {careerReadinessScore && (
                  <div className="flex flex-wrap items-center gap-4 mt-4 justify-center md:justify-start">
                    <Badge variant="outline" className="text-sm px-3 py-1.5">
                      <User className="w-3.5 h-3.5 mr-1.5" />
                      Profile {userData?.profileCompletion || 0}% complete
                    </Badge>
                    {userActivities && userActivities.length > 0 && (
                      <Badge variant="outline" className="text-sm px-3 py-1.5">
                        <Activity className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                        Active {userActivities.length} days 🔥
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-sm px-3 py-1.5 font-semibold",
                        careerReadinessScore.overall >= 70 ? "text-green-700 border-green-600 bg-green-50" :
                        careerReadinessScore.overall >= 40 ? "text-amber-700 border-amber-600 bg-amber-50" :
                        "text-red-700 border-red-600 bg-red-50"
                      )}
                    >
                      {careerReadinessScore.overall}% Career Ready
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <UpcomingSessions maxSessions={3} />

      {/* Unified Card Grid (Dynamic Backend Data) */}
      <UnifiedCardGrid
        cards={displayedCards}
        variant="dashboard"
        className={className}
        activityPrefix="dashboard_"
      />

      {/* ✅ FIX #3: Show More Button (Progressive Disclosure) */}
      {!expanded && cards.length > maxCards && (
        <div className="text-center pt-4">
          <Button
            onClick={() => setExpanded(true)}
            variant="outline"
            className="min-h-[48px] px-8"
          >
            Show {cards.length - maxCards} More Cards
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboardCardsV2;
