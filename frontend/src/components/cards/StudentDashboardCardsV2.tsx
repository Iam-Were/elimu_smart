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
import { UnifiedCardGrid } from './UnifiedCardGrid';
import { useDynamicCards } from '@/hooks/useDynamicCards';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertCircle, User, Activity } from 'lucide-react';
import Button from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getParse } from '@/config/parse';
import { cn } from '@/lib/utils';

interface ParseUserData {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  profileCompletion?: number;
}

interface StudentDashboardCardsV2Props {
  className?: string;
  maxCards?: number;
}

export const StudentDashboardCardsV2: React.FC<StudentDashboardCardsV2Props> = ({
  className,
  maxCards = 6
}) => {
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
  const [lastActivity, setLastActivity] = useState<string>('');

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

          // Calculate profile completion
          const fields = [
            currentUser.get('firstName'),
            currentUser.get('lastName'),
            currentUser.get('email'),
            currentUser.get('profileImage'),
            currentUser.get('phone'),
            currentUser.get('school'),
            currentUser.get('grade')
          ];
          const completedFields = fields.filter(f => f && f !== '').length;
          const profileCompletion = Math.round((completedFields / fields.length) * 100);

          setUserData({
            firstName,
            lastName,
            email,
            profileImage,
            profileCompletion
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

  // Calculate last activity
  useEffect(() => {
    if (userActivities && userActivities.length > 0) {
      const mostRecent = userActivities[0];
      const activityDate = new Date(mostRecent.timestamp);
      const now = new Date();
      const diffMs = now.getTime() - activityDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let timeAgo = '';
      if (diffMins < 1) {
        timeAgo = 'just now';
      } else if (diffMins < 60) {
        timeAgo = `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      } else if (diffDays < 7) {
        timeAgo = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
      } else {
        timeAgo = activityDate.toLocaleDateString();
      }

      const activityTypeMap: Record<string, string> = {
        'career_assessment_click': 'working on Career Discovery',
        'subject_mapping_click': 'mapping subjects to careers',
        'skills_assessment_click': 'discovering your strengths',
        'course_finder_click': 'exploring university courses',
        'career_exploration_click': 'researching careers',
        'profile_update': 'updating your profile',
        'guidance_request': 'seeking counselor guidance'
      };

      const activityText = activityTypeMap[mostRecent.activityType] || 'exploring the platform';
      setLastActivity(`Last active ${timeAgo}: ${activityText}`);
    }
  }, [userActivities]);

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

      {/* Hero KPI - Compact Welcome Card with Profile Photo Sync */}
      <Card className="overflow-hidden border-l-4 border-orange-500 shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
        <CardHeader className="bg-gradient-to-r from-orange-50/50 to-white pb-3 pt-4 border-b">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Profile Picture - Same size as profile page (h-32 w-32) */}
            <div className="flex-shrink-0">
              {loadingUser ? (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-orange-300 bg-orange-100 animate-pulse shadow-md" />
              ) : (
                <img
                  src={userData?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.firstName || 'Student')}&background=f97316&color=fff&size=128`}
                  alt="Profile"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-orange-300 object-cover shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.firstName || 'Student')}&background=f97316&color=fff&size=128`;
                  }}
                />
              )}
            </div>

            {/* Compact Welcome Message - Emphasized */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                Welcome back, {userData?.firstName || 'Student'}! 👋
              </h1>
              {lastActivity ? (
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">{lastActivity}</p>
              ) : (
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">Ready to continue your career journey?</p>
              )}
            </div>

            {/* Status Badge - Compact */}
            {careerReadinessScore && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs px-2.5 py-1 flex-shrink-0 font-semibold hidden sm:flex",
                  careerReadinessScore.overall >= 70 ? "text-green-700 border-green-600 bg-green-50" :
                  careerReadinessScore.overall >= 40 ? "text-amber-700 border-amber-600 bg-amber-50" :
                  "text-red-700 border-red-600 bg-red-50"
                )}
              >
                {careerReadinessScore.overall >= 70 ? "On Track" :
                 careerReadinessScore.overall >= 40 ? "Building Up" : "Getting Started"}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-4">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground text-sm">Loading your progress...</div>
          ) : careerReadinessScore ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Enhanced Progress Ring - Larger & More Prominent */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <svg className="w-36 h-36 sm:w-44 sm:h-44" viewBox="0 0 36 36" aria-hidden>
                    <defs>
                      <linearGradient id="grad1" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#fb923c" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                    <path
                      className="circle-bg"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="2.8"
                    />
                    <path
                      className="circle"
                      stroke="url(#grad1)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeDasharray={`${careerReadinessScore.overall}, 100`}
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                    />
                  </svg>

                  {/* Enhanced Center Display */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl font-bold text-orange-600 tracking-tight">
                        {careerReadinessScore.overall}%
                      </div>
                      <div className="text-sm sm:text-base text-slate-600 font-medium mt-1">Ready</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Always Visible 4 Metrics - 2x2 Grid */}
              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Metric 1: Assessments */}
                  <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-slate-200 hover:border-orange-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Assessments</span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-900">
                        {careerReadinessScore.breakdown.assessmentCompletion}%
                      </span>
                    </div>
                    <Progress value={careerReadinessScore.breakdown.assessmentCompletion} className="h-2" />
                  </div>

                  {/* Metric 2: Research */}
                  <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-slate-200 hover:border-orange-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Research</span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-900">
                        {careerReadinessScore.breakdown.careerResearch}%
                      </span>
                    </div>
                    <Progress value={careerReadinessScore.breakdown.careerResearch} className="h-2" />
                  </div>

                  {/* Metric 3: Exploration */}
                  <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-slate-200 hover:border-orange-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Exploration</span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-900">
                        {careerReadinessScore.breakdown.courseExploration}%
                      </span>
                    </div>
                    <Progress value={careerReadinessScore.breakdown.courseExploration} className="h-2" />
                  </div>

                  {/* Metric 4: Actions */}
                  <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-slate-200 hover:border-orange-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Actions</span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-900">
                        {careerReadinessScore.breakdown.actionsTaken}%
                      </span>
                    </div>
                    <Progress value={careerReadinessScore.breakdown.actionsTaken} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Complete assessments to see your readiness score</p>
              <Button onClick={() => window.location.href = '/assessment'} className="bg-orange-600 hover:bg-orange-700">
                Start Your First Assessment
              </Button>
            </div>
          )}
        </CardContent>

        {/* Footer with Quick Stats */}
        {careerReadinessScore && (
          <CardFooter className="bg-slate-50/80 border-t border-slate-200 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:gap-0">
              {/* Profile Completion */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="w-4 h-4" />
                <span>Profile: <strong className="text-slate-900">{userData?.profileCompletion || 0}%</strong> complete</span>
              </div>
              
              {/* Activity Streak */}
              {userActivities && userActivities.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Activity className="w-4 h-4 text-orange-500" />
                  <span>Active <strong className="text-slate-900">{userActivities.length}</strong> days 🔥</span>
                </div>
              )}
              
              {/* CTA Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = '/dashboard?tab=progress'}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-semibold"
              >
                View Full Details →
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

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
