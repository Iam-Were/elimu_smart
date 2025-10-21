import React, { useState, useEffect } from 'react';

import { ArrowRight, Target, AlertCircle, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Button from '@/components/ui/button';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';
import { getParse } from '@/config/parse';
import { cn } from '@/lib/utils';
import { useAriaLive } from '@/hooks/useAccessibility';

interface ParseUserData {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  profileCompletion?: number;
}

const StudentDashboard: React.FC = () => {
  const { careerReadinessScore, kuccpsTimeline, loading, userActivities } = useDynamicDashboard();
  const [userData, setUserData] = useState<ParseUserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [lastActivity, setLastActivity] = useState<string>('');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState('');

  // Announce changes to screen readers
  useAriaLive(announceMessage, 'polite');

  // Fetch Parse User data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const Parse = getParse();
        const currentUser = Parse.User.current();

        if (currentUser) {
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

          // Update localStorage for backward compatibility
          localStorage.setItem('user-name', `${firstName} ${lastName}`.trim() || 'Student');
          if (profileImage) {
            localStorage.setItem('user-avatar', profileImage);
          }
        }
      } catch (error) {
        console.warn('Failed to load Parse user data:', error);
        // Fallback to localStorage
        const name = localStorage.getItem('user-name') || 'Student';
        setUserData({
          firstName: name.split(' ')[0],
          lastName: name.split(' ')[1] || '',
          email: localStorage.getItem('user-email') || '',
          profileImage: localStorage.getItem('user-avatar') || undefined
        });
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

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

      // Map activity type to human-readable text
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

  // Mock urgent items (would come from backend in production)
  const urgentItems = [];

  // Add KUCCPS deadline if approaching
  if (kuccpsTimeline && kuccpsTimeline.daysRemaining > 0 && kuccpsTimeline.daysRemaining <= 30) {
    urgentItems.push({
      id: 'kuccps-deadline',
      title: `KUCCPS Application: ${kuccpsTimeline.daysRemaining} days left`,
      description: kuccpsTimeline.nextDeadline,
      actionText: 'Apply Now',
      actionLink: '/assessment',
      type: 'deadline' as const
    });
  }

  // Add incomplete assessments if readiness is low
  if (careerReadinessScore && careerReadinessScore.breakdown.assessmentCompletion < 50) {
    urgentItems.push({
      id: 'complete-assessments',
      title: 'Complete your career assessments',
      description: 'Boost your readiness score by completing at least 3 assessments',
      actionText: 'Start Assessment',
      actionLink: '/assessment',
      type: 'action' as const
    });
  }

  // Determine if user is new (low readiness score)
  const isNewUser = !loading && (!careerReadinessScore || careerReadinessScore.overall < 30);

  return (
    <div className="space-y-6 sm:space-y-8 pb-6 sm:pb-8 px-4 sm:px-0">

      {/* Hero KPI - Compact Career Readiness Score */}
      <Card className="border-orange-200 bg-gradient-to-br from-white to-orange-50/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Compact Profile Picture */}
              <div className="flex-shrink-0 relative">
                {loadingUser ? (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-orange-200 bg-orange-100 animate-pulse" />
                ) : (
                  <img
                    src={userData?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.firstName || 'Student')}&background=f97316&color=fff&size=100`}
                    alt="Student profile"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-orange-200 object-cover shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.firstName || 'Student')}&background=f97316&color=fff&size=100`;
                    }}
                  />
                )}
              </div>

              {/* Welcome Message with Last Activity */}
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 mb-0.5 truncate">
                  Welcome back, {userData?.firstName || 'Student'}! 👋
                </h1>
                {lastActivity ? (
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{lastActivity}</p>
                ) : (
                  <p className="text-xs sm:text-sm text-muted-foreground">Ready to continue your career journey?</p>
                )}
              </div>
            </div>

            {/* Compact Score Display */}
            {careerReadinessScore && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">Career Readiness</p>
                  <p className="text-2xl font-bold text-orange-600">{careerReadinessScore.overall}%</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs px-2 py-1",
                    careerReadinessScore.overall >= 70 ? "text-green-600 border-green-600 bg-green-50" :
                    careerReadinessScore.overall >= 40 ? "text-amber-600 border-amber-600 bg-amber-50" :
                    "text-red-600 border-red-600 bg-red-50"
                  )}
                >
                  {careerReadinessScore.overall >= 70 ? "On Track" :
                   careerReadinessScore.overall >= 40 ? "Building Up" : "Getting Started"}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground text-sm">Loading your progress...</div>
          ) : careerReadinessScore ? (
            <div className="flex flex-col sm:flex-row items-stretch gap-4">
              {/* Left: Big score + ring */}
              <div className="flex-shrink-0 w-full sm:w-48 lg:w-56 bg-white rounded-lg p-3 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {/* SVG circular progress ring */}
                    <svg className="w-28 h-28 sm:w-32 sm:h-32" viewBox="0 0 36 36" aria-hidden>
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

                    {/* Center large percentage (accessible) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-orange-600">{careerReadinessScore.overall}%</div>
                        <div className="text-xs text-muted-foreground">Readiness</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Summary and toggle for breakdown */}
              <div className="flex-1 bg-white rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Career Readiness Overview</h3>
                    <p className="text-xs text-muted-foreground mt-1">A snapshot of your progress. Tap "View breakdown" to see detailed metrics.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowBreakdown(!showBreakdown);
                        setAnnounceMessage(
                          showBreakdown 
                            ? 'Career readiness breakdown collapsed' 
                            : 'Career readiness breakdown expanded, showing 4 progress metrics'
                        );
                      }}
                      aria-expanded={showBreakdown}
                      aria-controls="readiness-breakdown"
                      className="text-sm inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-50 border border-orange-100 hover:bg-orange-100 text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      {showBreakdown ? 'Hide breakdown' : 'View breakdown'}
                      <ArrowRight className="h-4 w-4 transform rotate-90" />
                    </button>
                  </div>
                </div>

                {/* Collapsible breakdown - hidden by default on mobile */}
                <div id="readiness-breakdown" className={`mt-3 transition-all duration-200 ${showBreakdown ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`} aria-hidden={!showBreakdown}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Assessments</span>
                        <span className="font-bold text-slate-800">{careerReadinessScore.breakdown.assessmentCompletion}%</span>
                      </div>
                      <Progress value={careerReadinessScore.breakdown.assessmentCompletion} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Research</span>
                        <span className="font-bold text-slate-800">{careerReadinessScore.breakdown.careerResearch}%</span>
                      </div>
                      <Progress value={careerReadinessScore.breakdown.careerResearch} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Exploration</span>
                        <span className="font-bold text-slate-800">{careerReadinessScore.breakdown.courseExploration}%</span>
                      </div>
                      <Progress value={careerReadinessScore.breakdown.courseExploration} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Actions</span>
                        <span className="font-bold text-slate-800">{careerReadinessScore.breakdown.actionsTaken}%</span>
                      </div>
                      <Progress value={careerReadinessScore.breakdown.actionsTaken} className="h-1.5" />
                    </div>
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
      </Card>

      {/* Urgent Actions Banner */}
      {urgentItems.length > 0 && (
        <Card className="border-orange-300 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg font-bold text-orange-800">Action Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3 flex-1">
                    {item.type === 'deadline' ? (
                      <Clock className="h-5 w-5 text-orange-600 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 flex-shrink-0 ml-3"
                    onClick={() => window.location.href = item.actionLink}
                  >
                    {item.actionText}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Wins Section for New Users */}
      {isNewUser && (
        <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg font-bold text-purple-800">Start Here - Quick Wins</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Complete these 3 steps to unlock your full dashboard</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition-colors cursor-pointer"
                   onClick={() => window.location.href = '/assessment'}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">Take RIASEC Test</h3>
                </div>
                <p className="text-sm text-muted-foreground">15 min personality assessment</p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition-colors cursor-pointer"
                   onClick={() => window.location.href = '/assessment'}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">Find Your Course</h3>
                </div>
                <p className="text-sm text-muted-foreground">Explore Kenya universities</p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition-colors cursor-pointer"
                   onClick={() => window.location.href = '/guidance'}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">Talk to Counselor</h3>
                </div>
                <p className="text-sm text-muted-foreground">Get expert guidance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Section - Grouped with Clear Hierarchy */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="h-6 w-6 text-orange-600" />
              Your Career Journey
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track progress, explore careers, and get personalized guidance
            </p>
          </div>
        </div>

{/* TODO: Add UrgentActions component here (Task 1.3) */}      {/* TODO: Add ProgressMetrics component here (Task 1.4) */}      {/* TODO: Add ActivityTimeline in tab (Task 1.2) */}
      </div>
    </div>
  );
};

export default StudentDashboard;