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

      {/* Hero Section - Welcome Back Card with Stats */}
      <div className="mb-8">
        {/* Cover Photo - Simple gray background */}
        <div className="h-48 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative group">
          {/* Change Cover button - top right */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="absolute top-4 right-4 gap-2 bg-white/90 hover:bg-white shadow-sm rounded-lg px-4 py-2"
          >
            <Camera className="h-4 w-4" />
            <span className="hidden md:inline">Change Cover</span>
          </Button>
        </div>

        {/* Welcome Back Card */}
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
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Picture - Overlapping cover */}
              <div className="relative -mt-20 md:-mt-24 shrink-0">
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

                    {/* Camera icon - bottom-right corner of circle */}
                    <button
                      onClick={() => navigate('/profile')}
                      className="absolute bottom-1 right-1 h-9 w-9 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-white hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="h-4 w-4 text-orange-600" />
                    </button>
                  </>
                )}
              </div>

              {/* Welcome Message & Profile Info - Inline with profile picture */}
              <div className="flex-1 text-center md:text-left">
                {/* Welcome Back Message */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Welcome Back, {userData?.firstName}!
                </h1>

                <div className="space-y-1 mb-4">
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

                {/* Stats Grid */}
                {careerReadinessScore && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    {/* Profile Completion */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-900">Profile</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 mb-2">{userData?.profileCompletion || 0}%</p>
                      {/* Progress Bar */}
                      <div className="w-full bg-blue-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${userData?.profileCompletion || 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-blue-700">Complete</p>
                    </div>

                    {/* Activity Streak */}
                    {userActivities && userActivities.length > 0 && (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-orange-600" />
                          <span className="text-xs font-medium text-orange-900">Activity</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-900">{userActivities.length} days</p>
                        <p className="text-xs text-orange-700">Active Streak 🔥</p>
                      </div>
                    )}

                    {/* Career Readiness */}
                    <div className={cn(
                      "rounded-xl p-4 border",
                      careerReadinessScore.overall >= 70
                        ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                        : careerReadinessScore.overall >= 40
                        ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
                        : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className={cn(
                          "w-4 h-4",
                          careerReadinessScore.overall >= 70 ? "text-green-600" :
                          careerReadinessScore.overall >= 40 ? "text-amber-600" : "text-red-600"
                        )} />
                        <span className={cn(
                          "text-xs font-medium",
                          careerReadinessScore.overall >= 70 ? "text-green-900" :
                          careerReadinessScore.overall >= 40 ? "text-amber-900" : "text-red-900"
                        )}>Career Readiness</span>
                      </div>
                      <p className={cn(
                        "text-2xl font-bold mb-2",
                        careerReadinessScore.overall >= 70 ? "text-green-900" :
                        careerReadinessScore.overall >= 40 ? "text-amber-900" : "text-red-900"
                      )}>{careerReadinessScore.overall}%</p>
                      {/* Progress Bar */}
                      <div className={cn(
                        "w-full rounded-full h-2 mb-1",
                        careerReadinessScore.overall >= 70 ? "bg-green-200" :
                        careerReadinessScore.overall >= 40 ? "bg-amber-200" : "bg-red-200"
                      )}>
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            careerReadinessScore.overall >= 70 ? "bg-green-600" :
                            careerReadinessScore.overall >= 40 ? "bg-amber-600" : "bg-red-600"
                          )}
                          style={{ width: `${careerReadinessScore.overall}%` }}
                        />
                      </div>
                      <p className={cn(
                        "text-xs",
                        careerReadinessScore.overall >= 70 ? "text-green-700" :
                        careerReadinessScore.overall >= 40 ? "text-amber-700" : "text-red-700"
                      )}>
                        {careerReadinessScore.overall >= 70 ? "Excellent!" :
                         careerReadinessScore.overall >= 40 ? "Good Progress" : "Getting Started"}
                      </p>
                    </div>
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
