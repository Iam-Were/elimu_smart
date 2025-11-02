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
  Code,
  ExternalLink,
  Github,
  Globe,
  Camera,
  Calendar,
  Plus,
  Upload,
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
import { ImageUploader } from '../components/common/ImageUploader';
import { BookingModal } from '../components/student/BookingModal';
import { AddProjectDialog } from '@/components/profile/AddProjectDialog';
import { AddExperienceDialog } from '@/components/profile/AddExperienceDialog';
import { AddSkillsDialog } from '@/components/profile/AddSkillsDialog';
import { PersonalityReportModal } from '@/components/assessments/PersonalityReportModal';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { getRiasecTypeInfo } from '@/lib/assessmentProgress';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileProject {
  id: string;
  title: string;
  type: string;
  status: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface ProfileExperience {
  id: string;
  title: string;
  company: string;
  type: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  description: string;
  achievements?: string[];
  skills?: string[];
}

interface ProfileSkill {
  name: string;
  category: string;
  level: number;
}

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

  const [projects, setProjects] = useState<ProfileProject[]>([]);
  const [experience, setExperience] = useState<ProfileExperience[]>([]);
  const [skills, setSkills] = useState<ProfileSkill[]>([]);
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [assessmentSummary, setAssessmentSummary] = useState<AssessmentSummary | null>(null);
  const [personalityInsights, setPersonalityInsights] = useState<Record<string, RiasecTypeInfo>>({});
  const [expandedAssessments, setExpandedAssessments] = useState<Set<string>>(new Set());

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingExperience, setLoadingExperience] = useState(true);
  const [loadingAssessments, setLoadingAssessments] = useState(true);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showFABMenu, setShowFABMenu] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [showAddExperienceDialog, setShowAddExperienceDialog] = useState(false);
  const [showAddSkillsDialog, setShowAddSkillsDialog] = useState(false);
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

  // Load user projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const Parse = getParse();
        const result = await Parse.Cloud.run('getUserProjects');
        if (result.success && Array.isArray(result.projects) && result.projects.length > 0) {
          setProjects(result.projects);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };
    loadProjects();
  }, []);

  // Load user experience
  useEffect(() => {
    const loadExperience = async () => {
      try {
        const Parse = getParse();
        const result = await Parse.Cloud.run('getUserExperience');
        if (result.success && Array.isArray(result.experience) && result.experience.length > 0) {
          setExperience(result.experience);
        } else {
          setExperience([]);
        }
      } catch (error) {
        console.error('Failed to load experience:', error);
        setExperience([]);
      } finally {
        setLoadingExperience(false);
      }
    };
    loadExperience();
  }, []);

  // Load user skills
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const Parse = getParse();
        const result = await Parse.Cloud.run('getUserSkills');
        if (result.success && Array.isArray(result.skills) && result.skills.length > 0) {
          setSkills(result.skills);
        }
      } catch (error) {
        console.error('Failed to load skills:', error);
      }
    };
    loadSkills();
  }, []);

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

  // Calculate profile completion
  useEffect(() => {
    if (!user) return;

    let completionScore = 0;
    if (user.profileImage) completionScore += 15;
    if (user.firstName && user.lastName) completionScore += 10;
    if (user.email) completionScore += 10;
    if (editFormData.location) completionScore += 5;
    if (editFormData.bio && editFormData.bio.length > 50) completionScore += 15;
    if (projects.length > 0) completionScore += 10;
    if (projects.length >= 2) completionScore += 10;
    if (experience.length > 0) completionScore += 10;
    if (experience.length >= 2) completionScore += 5;
    if (skills.length > 0) completionScore += 5;
    if (skills.length >= 5) completionScore += 5;

    setProfileCompletion(Math.min(completionScore, 100));
  }, [user, projects, experience, skills, editFormData]);

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
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* LinkedIn-Style Header Card */}
        <Card className="mb-8 overflow-hidden">
          {/* Cover Photo - LinkedIn aspect ratio (1584 x 396) */}
          <div className={`h-48 md:h-52 bg-gradient-to-r ${getThemeColor(currentTheme)} relative group cursor-pointer`}>
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* LinkedIn-style banner upload button - appears on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
              <Button
                size="sm"
                onClick={() => {/* Add banner upload logic */}}
                className="gap-2 bg-white hover:bg-gray-100 text-gray-900 shadow-lg rounded-full px-4 py-2 font-semibold"
              >
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Edit cover photo</span>
                <span className="sm:hidden">Edit cover</span>
              </Button>
            </div>
          </div>

          {/* Profile Section */}
          <CardContent className="relative -mt-20 md:-mt-24 pb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture with Completion Ring - LinkedIn-style */}
              <div className="relative group">
                <svg className="absolute inset-0 w-36 h-36 md:w-40 md:h-40 -left-2 -top-2" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="68" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                  <circle
                    cx="72"
                    cy="72"
                    r="68"
                    fill="none"
                    stroke={profileCompletion >= 80 ? '#10b981' : profileCompletion >= 50 ? '#f59e0b' : '#f97316'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(profileCompletion / 100) * 427} 427`}
                    transform="rotate(-90 72 72)"
                    className="transition-all duration-500"
                  />
                </svg>

                <Avatar className="h-32 w-32 md:h-36 md:w-36 border-4 border-white bg-white relative z-10 shadow-lg">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className={`bg-gradient-to-br ${getThemeColor(currentTheme)} text-white text-2xl`}>
                    {(user?.firstName || 'U')[0]}{(user?.lastName || 'U')[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20">
                  <Badge
                    className={`text-xs font-semibold px-2 py-0.5 shadow-sm ${
                      profileCompletion >= 80
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : profileCompletion >= 50
                        ? 'bg-amber-100 text-amber-700 border-amber-300'
                        : 'bg-orange-100 text-orange-700 border-orange-300'
                    }`}
                  >
                    {profileCompletion}%
                  </Badge>
                </div>

                {/* LinkedIn-style profile picture upload button - circular overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 rounded-full bg-black/40">
                  <Button
                    size="sm"
                    onClick={() => setShowImageUploader(!showImageUploader)}
                    className="h-10 w-10 p-0 rounded-full bg-white hover:bg-gray-100 shadow-lg text-gray-900"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 mt-4 md:mt-16">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-xl text-gray-600 mt-1">
                      {user?.role === 'counselor'
                        ? 'Licensed Career Counselor | M.Ed Psychology | 8+ Years Experience'
                        : (editFormData.tagline || 'Student')}
                    </p>
                    <p className="text-gray-500 mt-2 flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      {editFormData.location || 'Kenya'} • {user?.email}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {user?.role === 'counselor' && (
                      <Button
                        onClick={() => setShowBookingModal(true)}
                        className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90"
                      >
                        <Calendar className="h-4 w-4" />
                        Book Session
                      </Button>
                    )}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit profile
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

                {/* Quick Stats */}
                <div className="flex gap-6 mt-4 pt-4 border-t">
                  {user?.role === 'counselor' ? (
                    <>
                      <div className="text-center">
                        <div className="text-lg font-semibold">247</div>
                        <div className="text-xs text-gray-500">Students Guided</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">8</div>
                        <div className="text-xs text-gray-500">Years Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">15</div>
                        <div className="text-xs text-gray-500">Certifications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">95%</div>
                        <div className="text-xs text-gray-500">Success Rate</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{loadingProjects ? '...' : projects.length}</div>
                        <div className="text-xs text-gray-500">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{loadingExperience ? '...' : experience.length}</div>
                        <div className="text-xs text-gray-500">Experiences</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{skills.length}</div>
                        <div className="text-xs text-gray-500">Skills</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-lg font-semibold ${
                            profileCompletion >= 80 ? 'text-green-600' : profileCompletion >= 50 ? 'text-amber-600' : 'text-orange-600'
                          }`}
                        >
                          {profileCompletion}%
                        </div>
                        <div className="text-xs text-gray-500">Profile strength</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Uploader - Collapsible */}
        {showImageUploader && user?.role !== 'counselor' && (
          <Card className="mb-6 border-orange-200 bg-gradient-to-br from-orange-50/50 to-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-orange-600" />
                  Update Profile Picture
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowImageUploader(false)} className="h-8 w-8 p-0">
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ImageUploader
                currentImage={user?.profileImage}
                userInitials={`${user?.firstName?.[0] || 'U'}${user?.lastName?.[0] || ''}`}
                onUploadSuccess={handleImageUpload}
              />
            </CardContent>
          </Card>
        )}

        {/* Profile Completion Suggestions */}
        {profileCompletion < 100 && user?.role !== 'counselor' && (
          <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50/50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-blue-600" />
                Strengthen Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {!user?.profileImage && (
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <button onClick={() => setShowImageUploader(true)} className="hover:underline text-left">
                      Add a profile picture (+15%)
                    </button>
                  </div>
                )}
                {(!editFormData.bio || editFormData.bio.length < 50) && (
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Write an About section (+15%)</span>
                  </div>
                )}
                {projects.length === 0 && (
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Add your first project (+10%)</span>
                  </div>
                )}
                {experience.length === 0 && (
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Add work experience or internship (+10%)</span>
                  </div>
                )}
                {skills.length === 0 && (
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>List your skills (+5%)</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Complete profiles get 3x more views from counselors and opportunities
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabbed Content */}
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
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="h-4 w-4" />
                    Edit
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

            {/* Projects Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-orange-600" />
                    Projects
                  </CardTitle>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowAddProjectDialog(true)}>
                    <Plus className="h-4 w-4" />
                    Add project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingProjects ? (
                  <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-orange-50/30 to-white rounded-lg border-2 border-dashed border-orange-200">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <Code className="h-8 w-8 text-white" />
                    </div>
                    <p className="font-semibold text-lg mb-2">Showcase Your Work</p>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                      Add projects to demonstrate your skills and stand out to counselors and universities
                    </p>
                    <Button
                      onClick={() => setShowAddProjectDialog(true)}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Add Your First Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{project.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{project.type}</p>
                          </div>
                          <span className={`text-xs font-medium ${project.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                            {project.status}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{project.description}</p>

                        {/* Technologies - LinkedIn neutral pill style */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Links - LinkedIn style */}
                        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition-colors"
                            >
                              <Github className="h-4 w-4" />
                              View Code
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                    Experience
                    {experience.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {experience.length}
                      </Badge>
                    )}
                  </CardTitle>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowAddExperienceDialog(true)}>
                    <Plus className="h-4 w-4" />
                    Add experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingExperience ? (
                  <div className="text-center py-8 text-muted-foreground">Loading experience...</div>
                ) : experience.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-blue-50/30 to-white rounded-lg border-2 border-dashed border-blue-200">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    <p className="font-semibold text-lg mb-2">Build Your Experience</p>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                      Add internships, volunteer work, or part-time jobs to strengthen your profile
                    </p>
                    <Button
                      onClick={() => setShowAddExperienceDialog(true)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Add Your First Experience
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {experience.map((exp, index) => (
                      <div key={exp.id} className="relative pl-8">
                        {/* Timeline connector */}
                        {index < experience.length - 1 && (
                          <div className="absolute left-6 top-12 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                        )}
                        
                        <div className="flex gap-4">
                          {/* Company Logo Circle - LinkedIn style */}
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                              <Briefcase className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">{exp.title}</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">{exp.company}</p>
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-4">
                                {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                                {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                              </span>
                            </div>
                            
                            {/* Description */}
                            {exp.description && (
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                                {exp.description}
                              </p>
                            )}
                            
                            {/* Skills - LinkedIn neutral style */}
                            {(exp.skills ?? []).length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {(exp.skills ?? []).map((skill) => (
                                  <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    Skills
                    {skills.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {skills.length}
                      </Badge>
                    )}
                  </CardTitle>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowAddSkillsDialog(true)}>
                    <Plus className="h-4 w-4" />
                    Add skills
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {skills.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-green-50/30 to-white rounded-lg border-2 border-dashed border-green-200">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <p className="font-semibold text-lg mb-2">Highlight Your Skills</p>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                      Add technical and soft skills to show what you're good at
                    </p>
                    <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90" onClick={() => setShowAddSkillsDialog(true)}>
                      <Target className="h-4 w-4 mr-2" />
                      Add Your Skills
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map((skill) => (
                      <div key={skill.name} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                              {skill.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{skill.category}</p>
                          </div>
                          <span className="text-xs font-medium text-orange-600 dark:text-orange-400 ml-2">
                            {skill.level}%
                          </span>
                        </div>
                        
                        {/* LinkedIn-style Progress Bar */}
                        <div className="relative">
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          
                          {/* Level label */}
                          <div className="flex justify-between mt-1.5">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {skill.level >= 75 ? 'Expert' : skill.level >= 50 ? 'Advanced' : skill.level >= 25 ? 'Intermediate' : 'Beginner'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-orange-600 mb-1">{assessmentSummary.hollandCode}</div>
                          <p className="text-sm text-muted-foreground">Holland Code</p>
                          <p className="text-xs text-muted-foreground mt-1">Primary: {assessmentSummary.primaryType}</p>
                        </div>

                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-green-600 mb-1">{assessmentSummary.assessmentsCompleted}</div>
                          <p className="text-sm text-muted-foreground">Assessments Completed</p>
                        </div>

                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-lg font-semibold text-blue-600 mb-1">
                            {assessmentSummary.topCareers.length > 0 ? assessmentSummary.topCareers[0].name : 'N/A'}
                          </div>
                          <p className="text-sm text-muted-foreground">Top Career Match</p>
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
                  <div className="grid grid-cols-1 gap-4">
                    {assessments.map((assessment) => (
                      <Card key={assessment.id} className="hover:shadow-lg transition-all duration-200">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                                  <ClipboardCheck className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{assessment.title}</CardTitle>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge className="bg-green-500">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Completed
                                    </Badge>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(assessment.completedAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          {/* Enhanced RIASEC Results with Animations */}
                          {assessment.type === 'riasec' && assessment.results && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="space-y-6"
                            >
                              {/* Quick Summary with Avatar - Stagger Animation */}
                              <motion.div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Booking Modal */}
        {user?.role === 'counselor' && user.id && (
          <BookingModal
            counselorId={user.id}
            counselorName={`${user.firstName} ${user.lastName}`}
            isOpen={showBookingModal}
            onClose={() => setShowBookingModal(false)}
          />
        )}

        {/* Sticky FAB - Mobile Only */}
        <div className="fixed bottom-20 right-4 z-40 md:hidden">
          {showFABMenu && (
            <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-2">
              <Button
                size="sm"
                onClick={() => {
                  setIsEditDialogOpen(true);
                  setShowFABMenu(false);
                }}
                className="bg-white hover:bg-gray-50 text-gray-900 shadow-lg border border-gray-200 gap-2 whitespace-nowrap"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setShowAddProjectDialog(true);
                  setShowFABMenu(false);
                }}
                className="bg-white hover:bg-gray-50 text-gray-900 shadow-lg border border-gray-200 gap-2 whitespace-nowrap"
              >
                <Code className="h-4 w-4" />
                Add Project
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setShowImageUploader(true);
                  setShowFABMenu(false);
                }}
                className="bg-white hover:bg-gray-50 text-gray-900 shadow-lg border border-gray-200 gap-2 whitespace-nowrap"
              >
                <Upload className="h-4 w-4" />
                Upload Photo
              </Button>
            </div>
          )}

          <Button
            size="lg"
            onClick={() => setShowFABMenu(!showFABMenu)}
            className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-200 ${
              showFABMenu ? 'bg-gradient-to-br from-red-500 to-red-600 rotate-45' : 'bg-gradient-to-br from-orange-500 to-orange-600'
            }`}
            aria-label={showFABMenu ? 'Close quick actions menu' : 'Open quick actions menu'}
            aria-expanded={showFABMenu}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      {showAddProjectDialog && (
        <AddProjectDialog
          isOpen={showAddProjectDialog}
          onClose={() => setShowAddProjectDialog(false)}
          onSuccess={(project) => {
            setProjects([...projects, project]);
            setShowAddProjectDialog(false);
          }}
        />
      )}

      {showAddExperienceDialog && (
        <AddExperienceDialog
          isOpen={showAddExperienceDialog}
          onClose={() => setShowAddExperienceDialog(false)}
          onSuccess={(exp) => {
            setExperience([...experience, exp]);
            setShowAddExperienceDialog(false);
          }}
        />
      )}

      {showAddSkillsDialog && (
        <AddSkillsDialog
          isOpen={showAddSkillsDialog}
          onClose={() => setShowAddSkillsDialog(false)}
          onSuccess={(newSkills) => {
            setSkills([...skills, ...newSkills]);
            setShowAddSkillsDialog(false);
          }}
          existingSkills={skills}
          userRiasecType={(user as { riasecType?: string })?.riasecType}
          userProjects={projects}
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
