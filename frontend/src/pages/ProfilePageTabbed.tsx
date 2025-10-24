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
  Activity
} from 'lucide-react';
import { ImageUploader } from '../components/common/ImageUploader';
import { BookingModal } from '../components/student/BookingModal';
import { AddProjectDialog } from '@/components/profile/AddProjectDialog';
import { AddExperienceDialog } from '@/components/profile/AddExperienceDialog';
import { AddSkillsDialog } from '@/components/profile/AddSkillsDialog';

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

export const ProfilePageTabbed: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'about';

  const [projects, setProjects] = useState<ProfileProject[]>([]);
  const [experience, setExperience] = useState<ProfileExperience[]>([]);
  const [skills, setSkills] = useState<ProfileSkill[]>([]);
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [assessmentSummary, setAssessmentSummary] = useState<AssessmentSummary | null>(null);

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

  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* LinkedIn-Style Header Card */}
        <Card className="mb-8 overflow-hidden">
          {/* Cover Photo */}
          <div className={`h-32 bg-gradient-to-r ${getThemeColor(currentTheme)} relative`}>
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Section */}
          <CardContent className="relative -mt-16 pb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture with Completion Ring */}
              <div className="relative group">
                <svg className="absolute inset-0 w-36 h-36 -left-2 -top-2" viewBox="0 0 144 144">
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

                <Avatar className="h-32 w-32 border-4 border-white bg-white relative z-10">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className={`bg-gradient-to-br ${getThemeColor(currentTheme)} text-white text-2xl`}>
                    {(user?.firstName || 'U')[0]}{(user?.lastName || 'U')[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20">
                  <Badge
                    className={`text-xs font-semibold px-2 py-0.5 ${
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

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  <Button
                    size="sm"
                    onClick={() => setShowImageUploader(!showImageUploader)}
                    className="h-10 w-10 p-0 rounded-full bg-white hover:bg-white shadow-lg"
                  >
                    <Camera className="h-5 w-5 text-gray-700" />
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
                        : 'Aspiring Software Developer | Form 4 Student | Tech Enthusiast'}
                    </p>
                    <p className="text-gray-500 mt-2 flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      Nairobi, Kenya • {user?.email}
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
                <p className="text-sm leading-relaxed text-gray-700 mb-4">
                  {editFormData.bio ||
                    'Aspiring software developer with hands-on experience in web development and data analysis. Currently pursuing secondary education while building practical skills through internships and personal projects. Passionate about using technology to solve real-world problems, particularly in education and data visualization.'}
                </p>

                <div className="flex flex-wrap gap-2">
                  {['Software Development', 'Data Science', 'Web Development', 'Mobile Apps', 'AI/ML', 'Education Technology'].map(
                    (interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    )
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
                      <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{project.title}</h4>
                            <p className="text-sm text-gray-600">{project.type}</p>
                          </div>
                          <Badge
                            className={
                              project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-700 mb-3">{project.description}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          {project.githubUrl && (
                            <Button variant="outline" size="sm" className="gap-1">
                              <Github className="h-3 w-3" /> Code
                            </Button>
                          )}
                          {project.liveUrl && (
                            <Button variant="outline" size="sm" className="gap-1">
                              <ExternalLink className="h-3 w-3" /> Live Demo
                            </Button>
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
                  <div className="space-y-6">
                    {experience.map((exp) => (
                      <div key={exp.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded bg-gradient-to-r ${getThemeColor(currentTheme)} flex items-center justify-center text-white flex-shrink-0`}
                          >
                            <Briefcase className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{exp.title}</h4>
                            <p className="text-gray-600">
                              {exp.company} • {exp.type}
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                              {new Date(exp.startDate).toLocaleDateString()} -{' '}
                              {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                            </p>
                            <p className="text-sm text-gray-700 mb-3">{exp.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {(exp.skills ?? []).map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
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
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {skills.map((skill) => (
                      <div key={skill.name} className="p-3 border rounded-lg text-center hover:shadow-md transition-shadow">
                        <div className="font-medium text-sm mb-2">{skill.name}</div>
                        <div className="text-xs text-gray-500 mb-2">{skill.category}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                          <div
                            className={`bg-gradient-to-r ${getThemeColor(currentTheme)} h-2 rounded-full`}
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600">{skill.level}%</div>
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
                          {/* RIASEC Results Preview */}
                          {assessment.type === 'riasec' && assessment.results && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Holland Code</p>
                                <p className="text-lg font-bold text-orange-600">{assessment.results.hollandCode}</p>
                              </div>

                              <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Primary Type</p>
                                <p className="text-sm font-semibold text-blue-600">{assessment.results.primaryType}</p>
                              </div>

                              <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg col-span-2">
                                <p className="text-xs text-muted-foreground mb-1">Top Career Match</p>
                                <p className="text-sm font-semibold text-green-600 truncate">
                                  {assessment.results.careerMatches?.[0]?.name || 'N/A'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-4">
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-3 w-3" />
                              Download PDF
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="mr-2 h-3 w-3" />
                              Share
                            </Button>
                          </div>
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
          userRiasecType={(user as any)?.riasecType}
          userProjects={projects}
        />
      )}
    </div>
  );
};

export default ProfilePageTabbed;
