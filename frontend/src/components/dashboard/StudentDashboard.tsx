import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Heart, TrendingUp, AlertCircle, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Button from '@/components/ui/button';
import StudentDashboardCards from '../cards/StudentDashboardCards';
import StudentAssessmentCards from '../cards/StudentAssessmentCards';
import StudentGuidanceCards from '../cards/StudentGuidanceCards';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';
import { getParse } from '@/config/parse';
import { cn } from '@/lib/utils';

interface ParseUserData {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  profileCompletion?: number;
}

const StudentDashboard: React.FC = () => {
  const { careerReadinessScore, kuccpsTimeline, loading } = useDynamicDashboard();
  const [userData, setUserData] = useState<ParseUserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

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

      {/* Hero KPI - Career Readiness Score with Profile */}
      <Card className="border-orange-200 bg-gradient-to-br from-white to-orange-50/30">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Profile Picture with completion indicator */}
              <div className="flex-shrink-0 relative">
                {loadingUser ? (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-orange-200 bg-orange-100 animate-pulse" />
                ) : (
                  <>
                    <img
                      src={userData?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.firstName || 'Student')}&background=f97316&color=fff&size=150`}
                      alt="Student profile"
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-orange-200 object-cover shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.firstName || 'Student')}&background=f97316&color=fff&size=150`;
                      }}
                    />
                    {/* Profile completion indicator */}
                    {userData?.profileCompletion !== undefined && userData.profileCompletion < 100 && (
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                        <div className="relative w-8 h-8">
                          <svg className="w-8 h-8 transform -rotate-90">
                            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-200" />
                            <circle
                              cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent"
                              strokeDasharray={`${2 * Math.PI * 14}`}
                              strokeDashoffset={`${2 * Math.PI * 14 * (1 - userData.profileCompletion / 100)}`}
                              className="text-orange-500 transition-all duration-500"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-orange-600">{userData.profileCompletion}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Welcome Message & Score */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
                  Welcome back, {userData?.firstName || 'Student'}! 👋
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">Career Readiness Score</CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground">Your preparation for university success</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            {careerReadinessScore && (
              <Badge
                variant="outline"
                className={cn(
                  "text-sm px-3 py-1 flex-shrink-0",
                  careerReadinessScore.overall >= 70 ? "text-green-600 border-green-600" :
                  careerReadinessScore.overall >= 40 ? "text-amber-600 border-amber-600" :
                  "text-red-600 border-red-600"
                )}
              >
                {careerReadinessScore.overall >= 70 ? "On Track" :
                 careerReadinessScore.overall >= 40 ? "Building Up" : "Getting Started"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading your progress...</div>
          ) : careerReadinessScore ? (
            <div className="space-y-6">
              {/* Main Score Circle */}
              <div className="flex items-center gap-8">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-orange-100"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - careerReadinessScore.overall / 100)}`}
                      className="text-orange-500 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600">{careerReadinessScore.overall}%</div>
                    </div>
                  </div>
                </div>

                {/* Component Breakdown */}
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Assessment Completion</span>
                      <span className="font-semibold text-slate-800">{careerReadinessScore.breakdown.assessmentCompletion}%</span>
                    </div>
                    <Progress value={careerReadinessScore.breakdown.assessmentCompletion} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Career Research</span>
                      <span className="font-semibold text-slate-800">{careerReadinessScore.breakdown.careerResearch}%</span>
                    </div>
                    <Progress value={careerReadinessScore.breakdown.careerResearch} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Course Exploration</span>
                      <span className="font-semibold text-slate-800">{careerReadinessScore.breakdown.courseExploration}%</span>
                    </div>
                    <Progress value={careerReadinessScore.breakdown.courseExploration} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Actions Taken</span>
                      <span className="font-semibold text-slate-800">{careerReadinessScore.breakdown.actionsTaken}%</span>
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

      {/* Main Dashboard Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-700">Your Progress Overview</h2>
        <StudentDashboardCards />
      </div>

      {/* Assessment Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Career Assessments</h2>
              <p className="text-muted-foreground">Discover your perfect career path</p>
            </div>
          </div>
          <Button asChild variant="secondary" className="hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300">
            <Link to="/assessment">
              View All Assessments
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <StudentAssessmentCards maxCards={3} />
      </div>

      {/* Guidance Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Guidance & Support</h2>
              <p className="text-muted-foreground">Get help with your academic and career journey</p>
            </div>
          </div>
          <Button asChild variant="secondary" className="hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300">
            <Link to="/guidance">
              View All Services
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <StudentGuidanceCards maxCards={3} />
      </div>
    </div>
  );
};

export default StudentDashboard;