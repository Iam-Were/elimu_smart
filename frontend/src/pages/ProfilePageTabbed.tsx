import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getParse } from '../config/parse';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Edit,
  User,
  Target,
  Briefcase,
  Globe,
  Camera,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  Loader2,
  Download,
  Share2,
  Trophy,
  CheckCircle2,
  Activity,
  Brain,
  ChevronDown,
  Sparkles,
  Users,
  BookOpen,
  Lightbulb,
  Target as TargetIcon,
  Award
} from 'lucide-react';
import { ProfilePhotoUploadDialog } from '../components/common/ProfilePhotoUploadDialog';
import { BookingModal } from '../components/student/BookingModal';
import { PersonalityReportModal } from '@/components/assessments/PersonalityReportModal';
import { RiasecResultsCard } from '@/components/assessments/RiasecResultsCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { getRiasecTypeInfo } from '@/lib/assessmentProgress';
import { motion, AnimatePresence } from 'framer-motion';

interface AssessmentResult {
  id: string;
  type: string;
  title: string;
  completedAt: Date;
  results: {
    hollandCode?: string;
    primaryType?: string;
    scores?: Record<string, number>;
    careerMatches?: Array<{ name: string; compatibility: number }>;
  };
}

interface AssessmentSummary {
  hollandCode: string | null;
  primaryType: string | null;
  topCareers: Array<{ name: string }>;
  assessmentsCompleted: number;
}

interface RiasecTypeInfo {
  code: string;
  name: string;
  description: string;
  workStyle: string;
  strengths: string[];
  motivators: string[];
  teamRole: string;
  famousKenyans: string[];
  learningStyle: string;
  decisionMaking: string;
}

export const ProfilePageTabbed: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'about';

  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [assessmentSummary, setAssessmentSummary] = useState<AssessmentSummary | null>(null);
  const [personalityInsights, setPersonalityInsights] = useState<Record<string, RiasecTypeInfo>>({});
  const [expandedAssessments, setExpandedAssessments] = useState<Set<string>>(new Set());

  const [loadingAssessments, setLoadingAssessments] = useState(true);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [personalityModalOpen, setPersonalityModalOpen] = useState(false);
  const [selectedPersonalityType, setSelectedPersonalityType] = useState<{
    type: string;
    hollandCode?: string;
    scores?: Record<string, number>;
  } | null>(null);

  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    tagline: '',
    careerInterests: [] as string[],
  });

  const { user } = useAuth();
  const { currentTheme } = useThemeContext();

  // Initialize edit form with user data
  useEffect(() => {
    if (user) {
      setEditFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: '',
        location: 'Nairobi, Kenya',
        tagline: '',
        careerInterests: [],
      });
    }
  }, [user]);

  // Load assessment results
  useEffect(() => {
    const fetchAssessmentResults = async () => {
      try {
        const Parse = getParse();
        const result = await Parse.Cloud.run('getUserAssessmentResults', {});

        if (result.success && result.hasResults) {
          setAssessments(result.assessments || []);
          setAssessmentSummary(result.summary);
        }
      } catch (error) {
        console.error('Failed to fetch assessment results:', error);
      } finally {
        setLoadingAssessments(false);
      }
    };
    fetchAssessmentResults();
  }, []);

  // Fetch personality insights from backend
  useEffect(() => {
    const fetchPersonalityInsights = async () => {
      try {
        const response = await getRiasecTypeInfo();
        if (response.types) {
          const insightsMap: Record<string, RiasecTypeInfo> = {};
          response.types.forEach((type: RiasecTypeInfo) => {
            insightsMap[type.code] = type;
          });
          setPersonalityInsights(insightsMap);
          console.log('✅ Loaded personality insights for all 6 RIASEC types');
        }
      } catch (error) {
        console.warn('Failed to load personality insights:', error);
      }
    };

    fetchPersonalityInsights();
  }, [assessments]);

  const handleInputChange = (field: keyof typeof editFormData, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const Parse = getParse();
      const currentUser = Parse.User.current();

      if (!currentUser) throw new Error('Not authenticated');

      currentUser.set('firstName', editFormData.firstName);
      currentUser.set('lastName', editFormData.lastName);
      currentUser.set('bio', editFormData.bio);
      currentUser.set('location', editFormData.location);

      await currentUser.save();
      setIsEditDialogOpen(false);

      const { toast } = await import('sonner');
      toast.success('Profile updated successfully!');

      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error('Failed to save profile:', error);
      const { toast } = await import('sonner');
      toast.error('Failed to save changes');
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    try {
      const Parse = getParse();
      const currentUser = Parse.User.current();

      if (currentUser) {
        currentUser.set('profileImage', imageUrl);
        await currentUser.save();
        setShowImageUploader(false);

        const { toast } = await import('sonner');
        toast.success('Profile picture updated!');

        setTimeout(() => window.location.reload(), 500);
      }
    } catch (error) {
      console.error('Failed to update profile image:', error);
      const { toast } = await import('sonner');
      toast.error('Failed to update profile picture');
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'student': return 'from-orange-500 to-orange-600';
      case 'counselor': return 'from-yellow-500 to-yellow-600';
      case 'admin': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate avatar for RIASEC personality type
  const generateAvatar = (typeCode: string) => {
    const avatar = createAvatar(avataaars, {
      seed: `riasec-${typeCode}`,
      backgroundColor: ['transparent'],
      // Customize based on personality type
      ...(typeCode === 'R' && { accessories: ['prescription01'], clothing: ['hoodie'] }),
      ...(typeCode === 'I' && { accessories: ['prescription02'], clothing: ['shirtCrewNeck'] }),
      ...(typeCode === 'A' && { accessories: ['prescription01'], clothing: ['graphicShirt'] }),
      ...(typeCode === 'S' && { accessories: [], clothing: ['blazerAndShirt'] }),
      ...(typeCode === 'E' && { accessories: ['sunglasses'], clothing: ['blazerAndSweater'] }),
      ...(typeCode === 'C' && { accessories: ['prescription02'], clothing: ['shirtVNeck'] }),
    });
    return avatar.toDataUri();
  };

  // Prepare radar chart data for RIASEC scores
  const prepareRadarData = (scores: Record<string, number>) => {
    return [
      { type: 'R', score: scores.R || 0, fullMark: 20 },
      { type: 'I', score: scores.I || 0, fullMark: 20 },
      { type: 'A', score: scores.A || 0, fullMark: 20 },
      { type: 'S', score: scores.S || 0, fullMark: 20 },
      { type: 'E', score: scores.E || 0, fullMark: 20 },
      { type: 'C', score: scores.C || 0, fullMark: 20 },
    ];
  };

  // Toggle expanded state for assessment insights
  const toggleExpanded = (assessmentId: string) => {
    setExpandedAssessments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assessmentId)) {
        newSet.delete(assessmentId);
      } else {
        newSet.add(assessmentId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* LinkedIn-Style Hero Section */}
      <div className="mb-8">
        {/* Cover Photo - LinkedIn dimensions: 192px mobile, 320px desktop */}
        <div className={`h-48 md:h-80 bg-gradient-to-r ${getThemeColor(currentTheme)} relative group cursor-pointer`}>
          <div className="absolute inset-0 bg-black/10"></div>

          {/* Edit cover button - desktop only */}
          <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
            <Button
              size="sm"
              onClick={() => {/* Add banner upload logic */}}
              className="gap-2 bg-white hover:bg-gray-100 text-gray-900 shadow-lg rounded-full px-4 py-2 font-semibold"
            >
              <Camera className="h-5 w-5" />
              Edit
            </Button>
          </div>
        </div>

        {/* Profile Card - LinkedIn style: subtle shadow, clean borders */}
        <Card className="border-0 md:border md:border-gray-200 shadow-sm mx-4 md:mx-auto max-w-4xl -mt-20 md:-mt-28 relative bg-white">
          <CardContent className="pt-24 md:pt-8 pb-6 px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Profile Picture - LinkedIn standard: 152px (h-38 w-38) */}
              <div className="relative group mx-auto md:mx-0 -mt-2 md:mt-0">
                <Avatar className="h-38 w-38 border-4 border-background bg-background relative z-10 shadow-md">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className={`bg-gradient-to-br ${getThemeColor(currentTheme)} text-white text-3xl font-semibold`}>
                    {(user?.firstName || 'U')[0]}{(user?.lastName || 'U')[0]}
                  </AvatarFallback>
                </Avatar>

                {/* Camera overlay - LinkedIn pattern */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 rounded-full bg-black/50 cursor-pointer">
                  <Button
                    size="sm"
                    onClick={() => setShowImageUploader(!showImageUploader)}
                    className="h-10 w-10 p-0 rounded-full bg-white hover:bg-gray-100 shadow-lg text-gray-900"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Profile Info - Centered on mobile */}
              <div className="flex-1 mt-4 md:mt-16 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mt-1">
                      {user?.role === 'counselor'
                        ? 'Licensed Career Counselor | M.Ed Psychology | 8+ Years Experience'
                        : (editFormData.tagline || 'Student')}
                    </p>
                    <p className="text-gray-500 mt-2 flex items-center justify-center md:justify-start gap-1 text-sm md:text-base">
                      <Globe className="h-4 w-4" />
                      {editFormData.location || 'Kenya'} • {user?.email}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-center md:justify-start">
                    {user?.role === 'counselor' && (
                      <Button
                        onClick={() => setShowBookingModal(true)}
                        className="h-12 gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90"
                      >
                        <Calendar className="h-5 w-5" />
                        Book Session
                      </Button>
                    )}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-12 w-12 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-muted-foreground/20 hover:border-muted-foreground/40"
                          title="Edit profile"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={editFormData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              placeholder="Enter your first name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={editFormData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              placeholder="Enter your last name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={editFormData.location}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              placeholder="e.g., Nairobi, Kenya"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bio">
                              About
                              <span className="text-xs text-muted-foreground ml-2">
                                ({editFormData.bio.length}/200 characters)
                              </span>
                            </Label>
                            <Textarea
                              id="bio"
                              value={editFormData.bio}
                              onChange={(e) => handleInputChange('bio', e.target.value)}
                              className="min-h-[100px]"
                              maxLength={200}
                              placeholder={
                                user?.role === 'counselor'
                                  ? 'Share your experience and approach to career counseling...'
                                  : 'Tell us about yourself and your career goals...'
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveProfile}
                            className={`bg-gradient-to-r ${getThemeColor(currentTheme)} hover:opacity-90`}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Quick Stats - LinkedIn style: subtle border, only show non-zero values */}
                <div className="flex gap-6 mt-4 pt-4 border-t border-border/10">
                  {user?.role === 'counselor' ? (
                    <>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">247</div>
                        <div className="text-xs text-gray-600">Students Guided</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">8</div>
                        <div className="text-xs text-gray-600">Years Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">15</div>
                        <div className="text-xs text-gray-600">Certifications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">95%</div>
                        <div className="text-xs text-gray-600">Success Rate</div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Always show assessments count */}
                      {assessments.length > 0 && (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{assessments.length}</div>
                          <div className="text-xs text-gray-600">Assessment{assessments.length !== 1 ? 's' : ''}</div>
                        </div>
                      )}

                      {/* Show career matches if exists */}
                      {assessmentSummary?.topCareers && assessmentSummary.topCareers.length > 0 && (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{assessmentSummary.topCareers.length}</div>
                          <div className="text-xs text-gray-600">Career Match{assessmentSummary.topCareers.length !== 1 ? 'es' : ''}</div>
                        </div>
                      )}

                      {/* Show personality traits count from Holland Code */}
                      {assessmentSummary?.hollandCode && (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{assessmentSummary.hollandCode.split('').length}</div>
                          <div className="text-xs text-gray-600">Personality Type{assessmentSummary.hollandCode.split('').length !== 1 ? 's' : ''}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LinkedIn-Style Photo Upload Dialog */}
        <ProfilePhotoUploadDialog
          open={showImageUploader}
          onOpenChange={setShowImageUploader}
          currentImage={user?.profileImage}
          userInitials={`${user?.firstName?.[0] || 'U'}${user?.lastName?.[0] || ''}`}
          onUploadSuccess={handleImageUpload}
        />
      </div>

      {/* Tabbed Content - Contained with padding */}
      <div className="container max-w-4xl mx-auto px-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setSearchParams({ tab: value })}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="about" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="assessments" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Assessments
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-600" />
                    About
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Edit</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editFormData.bio ? (
                  <>
                    <p className="text-sm leading-relaxed text-gray-700 mb-4">
                      {editFormData.bio}
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8 bg-gradient-to-br from-orange-50/30 to-white rounded-lg border-2 border-dashed border-orange-200">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-base mb-2">Tell us about yourself</p>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                      Add a bio to help counselors and universities understand your goals and interests
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {editFormData.careerInterests && editFormData.careerInterests.length > 0 ? (
                    editFormData.careerInterests.map((interest: string) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No career interests added yet. Complete assessments to discover your interests.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Featured Assessments Section */}
            {assessments.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-orange-600" />
                    Featured Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assessments.slice(0, 3).map((assessment) => (
                      <div
                        key={assessment.id}
                        className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                        onClick={() => setSearchParams({ tab: 'assessments' })}
                      >
                        {/* Gradient Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 mb-4 ${
                          assessment.type === 'riasec'
                            ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                            : assessment.type === 'skills'
                            ? 'bg-gradient-to-br from-green-500 to-green-600'
                            : assessment.type === 'career'
                            ? 'bg-gradient-to-br from-amber-500 to-amber-600'
                            : 'bg-gradient-to-br from-blue-500 to-blue-600'
                        }`}>
                          {assessment.type === 'riasec' ? (
                            <Brain className="w-6 h-6 text-white" />
                          ) : assessment.type === 'skills' ? (
                            <Target className="w-6 h-6 text-white" />
                          ) : assessment.type === 'career' ? (
                            <Briefcase className="w-6 h-6 text-white" />
                          ) : (
                            <ClipboardCheck className="w-6 h-6 text-white" />
                          )}
                        </div>

                        {/* Assessment Title */}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
                          {assessment.title}
                        </h3>

                        {/* Completion Badge */}
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-green-500 text-white text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(assessment.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        {/* Results Preview */}
                        {assessment.type === 'riasec' && assessment.results?.hollandCode && (
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Holland Code:</span>{' '}
                            <span className="text-orange-600 dark:text-orange-400 font-bold">
                              {assessment.results.hollandCode}
                            </span>
                          </div>
                        )}
                        {assessment.type === 'skills' && assessment.results?.scores && (
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Top Skill:</span>{' '}
                            <span className="text-green-600 dark:text-green-400">
                              {Object.entries(assessment.results.scores)
                                .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'N/A'}
                            </span>
                          </div>
                        )}

                        {/* View Details Link */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                          <span className="text-sm font-medium text-orange-600 dark:text-orange-400 group-hover:underline flex items-center gap-1">
                            View Details
                            <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View All Link */}
                  {assessments.length > 3 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setSearchParams({ tab: 'assessments' })}
                        className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 hover:underline"
                      >
                        View all {assessments.length} assessments →
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-6">
            {loadingAssessments ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <span className="ml-3 text-muted-foreground">Loading your assessment results...</span>
              </div>
            ) : (
              <>
                {/* Summary Card */}
                {assessmentSummary && assessmentSummary.hollandCode && (
                  <Card className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 border-orange-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-orange-600" />
                        Your Career Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                        <div className="text-center p-2 sm:p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-xl sm:text-3xl font-bold text-orange-600 mb-0.5 sm:mb-1">{assessmentSummary.hollandCode}</div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Holland Code</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Primary: {assessmentSummary.primaryType}</p>
                        </div>

                        <div className="text-center p-2 sm:p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-xl sm:text-3xl font-bold text-green-600 mb-0.5 sm:mb-1">{assessmentSummary.assessmentsCompleted}</div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Assessments Completed</p>
                        </div>

                        <div className="text-center p-2 sm:p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-sm sm:text-lg font-semibold text-blue-600 mb-0.5 sm:mb-1 line-clamp-1">
                            {assessmentSummary.topCareers.length > 0 ? assessmentSummary.topCareers[0].name : 'N/A'}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Top Career Match</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Assessment List */}
                {assessments.length === 0 ? (
                  <Card>
                    <CardContent className="pt-12 pb-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Target className="h-16 w-16 text-muted-foreground/50" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">No Assessments Completed Yet</h3>
                          <p className="text-muted-foreground mb-6">
                            Start your career journey by completing assessments to discover your strengths and interests.
                          </p>
                          <Button
                            onClick={() => {
                              window.location.href = '/assessment';
                            }}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <ClipboardCheck className="mr-2 h-4 w-4" />
                            Start Assessment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:gap-4">
                    {assessments.map((assessment) => (
                      <Card key={assessment.id} className="hover:shadow-lg transition-all duration-200">
                        <CardHeader className="p-3 sm:p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                                  <ClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-sm sm:text-lg">{assessment.title}</CardTitle>
                                  <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                                    <Badge className="bg-green-500 text-[10px] sm:text-xs px-1 sm:px-2">
                                      <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                                      Completed
                                    </Badge>
                                    <span className="text-[10px] sm:text-sm text-muted-foreground flex items-center gap-0.5 sm:gap-1">
                                      <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                      {formatDate(assessment.completedAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          {/* Rich RIASEC Results Card (16 Personalities Style) */}
                          {assessment.type === 'riasec' && assessment.results && (
                            <RiasecResultsCard
                              primaryType={assessment.results.primaryType || ''}
                              hollandCode={assessment.results.hollandCode || ''}
                              scores={assessment.results.scores || {}}
                              onLearnMore={() => {
                                setSelectedPersonalityType({
                                  type: assessment.results.primaryType || '',
                                  hollandCode: assessment.results.hollandCode || '',
                                  scores: assessment.results.scores || {},
                                });
                                setPersonalityModalOpen(true);
                              }}
                            />
                          )}

                          {/* Other assessment types (skills, career, university) */}
                          {assessment.type !== 'riasec' && assessment.results && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="space-y-6"
                            >
                              {/* Quick Summary with Avatar - Stagger Animation */}
                              <motion.div
                                className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                  hidden: {},
                                  visible: {
                                    transition: {
                                      staggerChildren: 0.15
                                    }
                                  }
                                }}
                              >
                                <motion.div
                                  variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                  }}
                                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:shadow-lg transition-shadow cursor-pointer group"
                                >
                                  <motion.img
                                    src={generateAvatar(assessment.results.primaryType || '')}
                                    alt={`${assessment.results.primaryType} personality avatar`}
                                    className="w-16 h-16 rounded-full bg-white p-1"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                  />
                                  <div className="font-['Inter']">
                                    <p className="text-xs text-muted-foreground">Primary Type</p>
                                    <p className="text-lg font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{assessment.results.primaryType}</p>
                                    {personalityInsights[assessment.results.primaryType || ''] && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        {personalityInsights[assessment.results.primaryType || ''].name}
                                      </p>
                                    )}
                                  </div>
                                </motion.div>

                                <motion.div
                                  variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                  }}
                                  className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-lg transition-shadow cursor-pointer font-['Plus_Jakarta_Sans']"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <p className="text-xs text-muted-foreground mb-1">Holland Code</p>
                                  <p className="text-2xl font-bold text-blue-600">{assessment.results.hollandCode}</p>
                                </motion.div>

                                <motion.div
                                  variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                  }}
                                  className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-lg transition-shadow cursor-pointer font-['Inter']"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <p className="text-xs text-muted-foreground mb-1">Top Career Match</p>
                                  <p className="text-sm font-semibold text-green-600">
                                    {assessment.results.careerMatches?.[0]?.name || 'See results below'}
                                  </p>
                                  {assessment.results.careerMatches?.[0]?.compatibility && (
                                    <motion.p
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.5, type: "spring" }}
                                      className="text-xs text-gray-600 mt-1"
                                    >
                                      {assessment.results.careerMatches[0].compatibility.toFixed(1)}% match
                                    </motion.p>
                                  )}
                                </motion.div>
                              </motion.div>

                              {/* Animated Radar Chart & Progress Bars */}
                              {assessment.results.scores && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3, duration: 0.5 }}
                                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm"
                                >
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-base font-bold flex items-center gap-2 font-['Plus_Jakarta_Sans']">
                                      <Trophy className="h-5 w-5 text-orange-600" />
                                      Your Personality Profile
                                    </h4>
                                    <Button
                                      onClick={() => {
                                        setSelectedPersonalityType({
                                          type: assessment.results.primaryType || '',
                                          hollandCode: assessment.results.hollandCode || '',
                                          scores: assessment.results.scores || {},
                                        });
                                        setPersonalityModalOpen(true);
                                      }}
                                      size="sm"
                                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md"
                                    >
                                      <Brain className="h-4 w-4 mr-2" />
                                      Learn More
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                                    {/* Radar Chart with entrance animation */}
                                    <motion.div
                                      initial={{ opacity: 0, rotate: -10 }}
                                      animate={{ opacity: 1, rotate: 0 }}
                                      transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                                    >
                                      <ResponsiveContainer width="100%" height={300}>
                                        <RadarChart data={prepareRadarData(assessment.results.scores)}>
                                          <PolarGrid stroke="#e2e8f0" strokeWidth={1.5} />
                                          <PolarAngleAxis dataKey="type" tick={{ fill: '#475569', fontSize: 13, fontWeight: 600, fontFamily: 'Inter' }} />
                                          <PolarRadiusAxis angle={90} domain={[0, 20]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                          <Radar name="Your Scores" dataKey="score" stroke="#f97316" strokeWidth={2} fill="#f97316" fillOpacity={0.7} />
                                          <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500 }} />
                                        </RadarChart>
                                      </ResponsiveContainer>
                                    </motion.div>

                                    {/* Animated Progress Bars */}
                                    <motion.div
                                      className="space-y-3"
                                      initial="hidden"
                                      animate="visible"
                                      variants={{
                                        hidden: {},
                                        visible: {
                                          transition: {
                                            staggerChildren: 0.1,
                                            delayChildren: 0.6
                                          }
                                        }
                                      }}
                                    >
                                      {Object.entries(assessment.results.scores)
                                        .sort(([, a], [, b]) => (b as number) - (a as number))
                                        .map(([type, score], index) => {
                                          const percentage = (((score as number) / 20) * 100).toFixed(1);
                                          const colors: Record<string, string> = {
                                            R: 'from-red-500 to-rose-600',
                                            I: 'from-blue-500 to-indigo-600',
                                            A: 'from-purple-500 to-violet-600',
                                            S: 'from-green-500 to-emerald-600',
                                            E: 'from-yellow-500 to-amber-600',
                                            C: 'from-gray-500 to-slate-600'
                                          };
                                          const names: Record<string, string> = {
                                            R: 'Realistic',
                                            I: 'Investigative',
                                            A: 'Artistic',
                                            S: 'Social',
                                            E: 'Enterprising',
                                            C: 'Conventional'
                                          };
                                          return (
                                            <motion.div
                                              key={type}
                                              variants={{
                                                hidden: { opacity: 0, x: -20 },
                                                visible: { opacity: 1, x: 0 }
                                              }}
                                              className="group"
                                            >
                                              <div className="flex justify-between mb-1.5">
                                                <span className="text-sm font-semibold text-gray-700 font-['Inter'] group-hover:text-gray-900 transition-colors">
                                                  {type} - {names[type]}
                                                </span>
                                                <span className="text-sm font-bold text-gray-600 font-['Plus_Jakarta_Sans']">{score}/20</span>
                                              </div>
                                              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                  initial={{ width: 0 }}
                                                  animate={{ width: `${percentage}%` }}
                                                  transition={{ delay: 0.8 + index * 0.1, duration: 1, ease: "easeOut" }}
                                                  className={`h-full bg-gradient-to-r ${colors[type]} rounded-full`}
                                                  whileHover={{ opacity: 0.9 }}
                                                />
                                              </div>
                                            </motion.div>
                                          );
                                        })}
                                    </motion.div>
                                  </div>
                                </motion.div>
                              )}

                              {/* Expandable Personality Insights with Animation */}
                              {assessment.results.primaryType && personalityInsights[assessment.results.primaryType] && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 1.5 }}
                                >
                                  <Collapsible open={expandedAssessments.has(assessment.id)}>
                                    <CollapsibleTrigger
                                      onClick={() => toggleExpanded(assessment.id)}
                                      className="w-full"
                                    >
                                      <motion.div
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:shadow-md cursor-pointer"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Brain className="h-5 w-5 text-purple-600" />
                                          <span className="font-bold text-purple-900 font-['Plus_Jakarta_Sans']">Personality Insights</span>
                                        </div>
                                        <motion.div
                                          animate={{ rotate: expandedAssessments.has(assessment.id) ? 180 : 0 }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          <ChevronDown className="h-5 w-5 text-purple-600" />
                                        </motion.div>
                                      </motion.div>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                      <AnimatePresence>
                                        {expandedAssessments.has(assessment.id) && (
                                          <motion.div
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            variants={{
                                              hidden: { opacity: 0, height: 0 },
                                              visible: {
                                                opacity: 1,
                                                height: "auto",
                                                transition: {
                                                  staggerChildren: 0.1,
                                                  delayChildren: 0.1
                                                }
                                              }
                                            }}
                                            className="mt-4 space-y-4 p-5 border border-purple-100 rounded-lg bg-white shadow-sm"
                                          >
                                            {(() => {
                                              const typeInfo = personalityInsights[assessment.results.primaryType || ''];
                                              return (
                                                <>
                                                  {/* Work Style */}
                                                  <motion.div
                                                    variants={{
                                                      hidden: { opacity: 0, x: -20 },
                                                      visible: { opacity: 1, x: 0 }
                                                    }}
                                                  >
                                                    <h5 className="text-sm font-bold mb-2 flex items-center gap-2 font-['Plus_Jakarta_Sans']">
                                                      <Briefcase className="h-4 w-4 text-blue-600" />
                                                      Your Work Style
                                                    </h5>
                                                    <p className="text-sm text-gray-700 leading-relaxed font-['Inter']">{typeInfo.workStyle}</p>
                                                  </motion.div>

                                                  {/* Strengths */}
                                                  <motion.div
                                                    variants={{
                                                      hidden: { opacity: 0, x: -20 },
                                                      visible: { opacity: 1, x: 0 }
                                                    }}
                                                  >
                                                    <h5 className="text-sm font-bold mb-2 flex items-center gap-2 font-['Plus_Jakarta_Sans']">
                                                      <Award className="h-4 w-4 text-green-600" />
                                                      Top Strengths
                                                    </h5>
                                                    <ul className="space-y-1.5">
                                                      {typeInfo.strengths.map((strength, idx) => (
                                                        <motion.li
                                                          key={idx}
                                                          initial={{ opacity: 0, x: -10 }}
                                                          animate={{ opacity: 1, x: 0 }}
                                                          transition={{ delay: 0.2 + idx * 0.05 }}
                                                          className="text-sm text-gray-700 flex items-start gap-2 font-['Inter']"
                                                        >
                                                          <span className="text-green-600 mt-0.5 text-base">•</span>
                                                          {strength}
                                                        </motion.li>
                                                      ))}
                                                    </ul>
                                                  </motion.div>

                                            {/* Motivators */}
                                            <div>
                                              <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                                <Lightbulb className="h-4 w-4 text-yellow-600" />
                                                What Motivates You
                                              </h5>
                                              <ul className="space-y-1">
                                                {typeInfo.motivators.map((motivator, idx) => (
                                                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                                    <span className="text-yellow-600 mt-0.5">•</span>
                                                    {motivator}
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>

                                            {/* Learning Style */}
                                            <div>
                                              <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-indigo-600" />
                                                Learning Style
                                              </h5>
                                              <p className="text-sm text-gray-700">{typeInfo.learningStyle}</p>
                                            </div>

                                            {/* Decision Making */}
                                            <div>
                                              <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                                <TargetIcon className="h-4 w-4 text-red-600" />
                                                Decision Making Approach
                                              </h5>
                                              <p className="text-sm text-gray-700">{typeInfo.decisionMaking}</p>
                                            </div>

                                            {/* Team Role */}
                                            <div>
                                              <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                                <Users className="h-4 w-4 text-purple-600" />
                                                Team Role
                                              </h5>
                                              <p className="text-sm text-gray-700">{typeInfo.teamRole}</p>
                                            </div>

                                            {/* Famous Kenyans */}
                                            <div>
                                              <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                                <Sparkles className="h-4 w-4 text-amber-600" />
                                                Successful Kenyans with {assessment.results.primaryType}-Type
                                              </h5>
                                              <ul className="space-y-1">
                                                {typeInfo.famousKenyans.map((kenyan, idx) => (
                                                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                                    <span className="text-amber-600 mt-0.5">•</span>
                                                    {kenyan}
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                                                                          </>
                                        );
                                      })()}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </motion.div>
                              )}

                              {/* Career Matches Section */}
                              {assessment.results.careerMatches && assessment.results.careerMatches.length > 0 && (
                                <div className="p-4 bg-green-50 rounded-lg">
                                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <Target className="h-4 w-4 text-green-600" />
                                    Top Career Matches
                                  </h4>
                                  <div className="space-y-2">
                                    {assessment.results.careerMatches.slice(0, 3).map((match, idx) => (
                                      <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                        <div>
                                          <p className="text-sm font-semibold text-gray-900">{idx + 1}. {match.name}</p>
                                          {match.compatibility && (
                                            <p className="text-xs text-gray-600">{match.compatibility.toFixed(1)}% compatibility</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons with Animation */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2 }}
                                className="flex gap-3"
                              >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button variant="outline" size="sm" className="font-['Inter']">
                                    <Download className="mr-2 h-3 w-3" />
                                    Download PDF
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button variant="outline" size="sm" className="font-['Inter']">
                                    <Share2 className="mr-2 h-3 w-3" />
                                    Share
                                  </Button>
                                </motion.div>
                              </motion.div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Call to Action */}
                {assessments.length > 0 && (
                  <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Want to explore more about yourself?</h3>
                          <p className="text-sm text-muted-foreground">
                            Take additional assessments to refine your career path and discover new opportunities.
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            window.location.href = '/assessment';
                          }}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          More Assessments
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                  Career Readiness Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-5xl font-bold text-orange-600 mb-2">--</div>
                  <p className="text-muted-foreground">Coming Soon</p>
                  <p className="text-sm text-gray-500 mt-2">Complete assessments to unlock your career readiness score</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-orange-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Completed Skills Assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Updated project: School Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Connected with 5 new people</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Modal */}
      {user?.role === 'counselor' && user.id && (
        <BookingModal
          counselorId={user.id}
          counselorName={`${user.firstName} ${user.lastName}`}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      {/* Personality Report Modal */}
      {selectedPersonalityType && (
        <PersonalityReportModal
          open={personalityModalOpen}
          onOpenChange={setPersonalityModalOpen}
          riasecType={selectedPersonalityType.type}
          hollandCode={selectedPersonalityType.hollandCode}
          scores={selectedPersonalityType.scores}
        />
      )}
    </div>
  );
};

export default ProfilePageTabbed;
