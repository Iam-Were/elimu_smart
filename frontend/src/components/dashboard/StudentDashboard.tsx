import React, { useState, useEffect } from 'react';

import { Target, AlertCircle, Clock, CheckCircle, Sparkles, User, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Button from '@/components/ui/button';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';
import { getParse } from '@/config/parse';
import { cn } from '@/lib/utils';
import UrgentActions from './UrgentActions';
import ProgressMetrics from './ProgressMetrics';
import ActivityTimeline from './ActivityTimeline';

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

      {/* Hero KPI - Enhanced Career Readiness Score */}
      <Card className="overflow-hidden border-l-4 border-orange-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50/50 to-white pb-4 border-b">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Enhanced Profile Picture */}
              <div className="flex-shrink-0 relative">
                {loadingUser ? (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-orange-300 bg-orange-100 animate-pulse shadow-lg" />
                ) : (
                  <img
                    src={userData?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.firstName || 'Student')}&background=f97316&color=fff&size=160`}
                    alt="Student profile"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-orange-300 object-cover shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.firstName || 'Student')}&background=f97316&color=fff&size=160`;
                    }}
                  />
                )}
              </div>

              {/* Enhanced Welcome Message with Last Activity */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 truncate">
                  Welcome back, {userData?.firstName || 'Student'}! 👋
                </h1>
                {lastActivity ? (
                  <p className="text-sm sm:text-base text-slate-600 truncate leading-tight">{lastActivity}</p>
                ) : (
                  <p className="text-sm sm:text-base text-slate-600">Ready to continue your career journey?</p>
                )}
              </div>
            </div>

            {/* Status Badge */}
            {careerReadinessScore && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs sm:text-sm px-3 py-1.5 flex-shrink-0 font-semibold",
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
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Skeleton className="w-36 h-36 sm:w-44 sm:h-44 rounded-full flex-shrink-0" />
              <div className="flex-1 w-full grid grid-cols-2 gap-3 sm:gap-4">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
            </div>
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

        {/* NEW: Footer with Quick Stats */}
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

      {/* Main Dashboard Section - Tabbed Layout */}
      <div className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Overview Tab - Urgent Actions */}
          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Target className="h-6 w-6 text-orange-600" />
                Your Career Journey
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Track progress, explore careers, and get personalized guidance
              </p>
            </div>

            {/* Urgent Actions */}
            <UrgentActions maxItems={5} />
          </TabsContent>

          {/* Activity Tab - Timeline */}
          <TabsContent value="activity" className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Clock className="h-6 w-6 text-orange-600" />
                Recent Activity
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Your recent actions and engagement history
              </p>
            </div>
            <ActivityTimeline maxItems={10} />
          </TabsContent>

          {/* Progress Tab - Metrics */}
          <TabsContent value="progress" className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Sparkles className="h-6 w-6 text-orange-600" />
                Progress Metrics
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Track your career readiness and development
              </p>
            </div>
            <ProgressMetrics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;