import React, { useState, useEffect } from 'react';
import { getParse } from '../config/parse';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Edit, User, Target, Briefcase, Code, ExternalLink, Github, Globe, Camera, Shield, Calendar, Plus, Upload } from 'lucide-react';
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

interface ProjectsResponse {
  success: boolean;
  projects: ProfileProject[];
}

interface ExperienceResponse {
  success: boolean;
  experience: ProfileExperience[];
}








export const ProfilePage: React.FC = () => {
  const [projects, setProjects] = useState<ProfileProject[]>([]);
  const [experience, setExperience] = useState<ProfileExperience[]>([]);
  const [skills, setSkills] = useState<ProfileSkill[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingExperience, setLoadingExperience] = useState(true);
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


  // Load user projects from backend
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const Parse = getParse();
        const result = await Parse.Cloud.run('getUserProjects') as ProjectsResponse;
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

  // Load user experience from backend
  useEffect(() => {
    const loadExperience = async () => {
      try {
        const Parse = getParse();
        const result = await Parse.Cloud.run('getUserExperience') as ExperienceResponse;
        if (result.success && Array.isArray(result.experience) && result.experience.length > 0) {
          setExperience(result.experience);
        } else {
          setExperience([]);
        }
      } catch (error) {
        console.error('Failed to load experience:', error);
        setExperience([]);
      } finally{
        setLoadingExperience(false);
      }
    };

    loadExperience();
  }, []);

  // Load user skills from backend
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const Parse = getParse();
        const result = await Parse.Cloud.run('getUserSkills');
        if (result.success && Array.isArray(result.skills) && result.skills.length > 0) {
          setSkills(result.skills);
        } else {
          setSkills([]);
        }
      } catch (error) {
        console.error('Failed to load skills:', error);
        setSkills([]);
      }
    };

    loadSkills();
  }, []);

  // Calculate profile completion percentage
  useEffect(() => {
    if (!user) return;

    let completionScore = 0;
    const maxScore = 100;

    // Profile picture (15 points)
    if (user.profileImage) completionScore += 15;

    // Basic info (25 points)
    if (user.firstName && user.lastName) completionScore += 10;
    if (user.email) completionScore += 10;
    if (editFormData.location) completionScore += 5;

    // About/Bio (15 points)
    if (editFormData.bio && editFormData.bio.length > 50) completionScore += 15;

    // Projects (20 points)
    if (projects.length > 0) completionScore += 10;
    if (projects.length >= 2) completionScore += 10;

    // Experience (15 points)
    if (experience.length > 0) completionScore += 10;
    if (experience.length >= 2) completionScore += 5;

    // Skills (10 points)
    if (skills.length > 0) completionScore += 5;
    if (skills.length >= 5) completionScore += 5;

    setProfileCompletion(Math.min(completionScore, maxScore));
  }, [user, projects, experience, skills, editFormData]);

  // Handle form input changes
  const handleInputChange = (field: keyof typeof editFormData, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSaveProfile = async () => {
    try {
      const Parse = getParse();
      const currentUser = Parse.User.current();

      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      // Update user fields
      currentUser.set('firstName', editFormData.firstName);
      currentUser.set('lastName', editFormData.lastName);
      currentUser.set('bio', editFormData.bio);
      currentUser.set('location', editFormData.location);

      await currentUser.save();

      setIsEditDialogOpen(false);

      // Show success toast and reload to update UI
      const { toast } = await import('sonner');
      toast.success('Profile updated successfully!');

      // Reload page to reflect changes (Parse User object updated)
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Failed to save profile:', error);

      // Show error toast
      const { toast } = await import('sonner');
      toast.error('Failed to save changes');
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (imageUrl: string) => {
    try {
      const Parse = getParse();
      const currentUser = Parse.User.current();

      if (currentUser) {
        currentUser.set('profileImage', imageUrl);
        await currentUser.save();

        setShowImageUploader(false);

        // Show success toast
        const { toast } = await import('sonner');
        toast.success('Profile picture updated!');

        // Reload to update avatar across the page
        setTimeout(() => {
          window.location.reload();
        }, 500);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* LinkedIn-Style Header Card */}
        <Card className="mb-8 overflow-hidden">
          {/* Cover Photo - LinkedIn aspect ratio (1584 x 396) */}
          <div className={`h-48 bg-gradient-to-r ${getThemeColor(currentTheme)} relative group cursor-pointer`}>
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
                {/* Completion Ring (SVG Circle) */}
                <svg className="absolute inset-0 w-36 h-36 md:w-40 md:h-40 -left-2 -top-2" viewBox="0 0 144 144">
                  {/* Background circle */}
                  <circle
                    cx="72"
                    cy="72"
                    r="68"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  {/* Progress circle */}
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

                {/* Avatar */}
                <Avatar className="h-32 w-32 md:h-36 md:w-36 border-4 border-white bg-white relative z-10 shadow-lg">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className={`bg-gradient-to-br ${getThemeColor(currentTheme)} text-white text-2xl`}>
                    {(user?.firstName || 'U')[0]}{(user?.lastName || 'U')[0]}
                  </AvatarFallback>
                </Avatar>

                {/* Completion Badge */}
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
                        : 'Aspiring Software Developer | Form 4 Student | Tech Enthusiast'
                      }
                    </p>
                    <p className="text-gray-500 mt-2 flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      Nairobi, Kenya • {user?.email}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      {user?.role === 'counselor' ? '1,200+ professional connections' : '500+ connections'}
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
                    <Button className={`bg-gradient-to-r ${getThemeColor(currentTheme)} hover:opacity-90`}>
                      {user?.role === 'counselor' ? 'Available for consultation' : 'Open to work'}
                    </Button>
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
                              placeholder={user?.role === 'counselor'
                                ? 'Share your experience and approach to career counseling...'
                                : 'Tell us about yourself and your career goals...'}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProfile} className={`bg-gradient-to-r ${getThemeColor(currentTheme)} hover:opacity-90`}>
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Quick Stats - Dynamic Data */}
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
                        <div className={`text-lg font-semibold ${
                          profileCompletion >= 80 ? 'text-green-600' :
                          profileCompletion >= 50 ? 'text-amber-600' :
                          'text-orange-600'
                        }`}>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageUploader(false)}
                  className="h-8 w-8 p-0"
                >
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
                    <button
                      onClick={() => setShowImageUploader(true)}
                      className="hover:underline text-left"
                    >
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

        {/* Counselor-specific content */}
        {user?.role === 'counselor' ? (
          <div className="space-y-6">
            {/* Professional Credentials Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  Professional Credentials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-yellow-800">Licensed Career Counselor</p>
                      <p className="text-sm text-yellow-600">Kenya Association of Professional Counselors (KAPC) - License #CC-2847</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-blue-800">M.Ed. in Educational Psychology</p>
                      <p className="text-sm text-blue-600">University of Nairobi - Graduated 2016</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-green-800">Certified Career Development Facilitator</p>
                      <p className="text-sm text-green-600">National Career Development Association - 2018</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-purple-800">Adolescent Counseling Specialist</p>
                      <p className="text-sm text-purple-600">Kenya Institute of Professional Counselors - 2019</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Performance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-yellow-600" />
                  Professional Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">247</div>
                    <div className="text-sm text-gray-600">Students Guided</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">95%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">8</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">15</div>
                    <div className="text-sm text-gray-600">Certifications</div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">University Placement Success</span>
                    <span className="font-semibold text-yellow-600">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Response Time</span>
                    <span className="font-semibold text-yellow-600">2.3 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Client Satisfaction</span>
                    <span className="font-semibold text-yellow-600">4.8/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Student Profile Content */}

            <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-orange-600" />
                About
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-gray-700 mb-4">
              Aspiring software developer with hands-on experience in web development and data analysis.
              Currently pursuing secondary education while building practical skills through internships and personal projects.
              Passionate about using technology to solve real-world problems, particularly in education and data visualization.
            </p>

            <div className="flex flex-wrap gap-2">
              {['Software Development', 'Data Science', 'Web Development', 'Mobile Apps', 'AI/ML', 'Education Technology'].map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Section Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-orange-600" />
                Projects
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowAddProjectDialog(true)}
              >
                <Code className="h-4 w-4" />
                Add project
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingProjects ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading projects...
              </div>
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
                    <Badge className={project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                      {project.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
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

        {/* Experience Section Card */}
        {/* Use Accordion for Experience, Skills, and Security on mobile to reduce page length */}
        <Accordion type="multiple" defaultValue={["experience", "skills"]} className="space-y-6">
          {/* Experience Section */}
          <AccordionItem value="experience" className="border-0">
            <Card className="mb-0">
              <CardHeader>
                <AccordionTrigger className="hover:no-underline py-0">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold">Experience</span>
                    {experience.length > 0 && (
                      <Badge variant="secondary" className="ml-2">{experience.length}</Badge>
                    )}
                  </div>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent className="pt-0">
                  {loadingExperience ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading experience...
              </div>
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
                    <div className={`w-12 h-12 rounded bg-gradient-to-r ${getThemeColor(currentTheme)} flex items-center justify-center text-white flex-shrink-0`}>
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{exp.title}</h4>
                      <p className="text-gray-600">{exp.company} • {exp.type}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                      </p>
                      <p className="text-sm text-gray-700 mb-3">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {(exp.skills ?? []).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

        {/* Skills Section */}
          <AccordionItem value="skills" className="border-0">
            <Card className="mb-0">
              <CardHeader>
                <AccordionTrigger className="hover:no-underline py-0">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold">Skills</span>
                    {skills.length > 0 && (
                      <Badge variant="secondary" className="ml-2">{skills.length}</Badge>
                    )}
                  </div>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent className="pt-0">
            {skills.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-green-50/30 to-white rounded-lg border-2 border-dashed border-green-200">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <p className="font-semibold text-lg mb-2">Highlight Your Skills</p>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  Add technical and soft skills to show what you're good at
                </p>
                <Button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90"
                  onClick={() => setShowAddSkillsDialog(true)}
                >
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
              </AccordionContent>
            </Card>
          </AccordionItem>

        {/* Security Section */}
          <AccordionItem value="security" className="border-0">
            <Card className="mb-0">
              <CardHeader>
                <AccordionTrigger className="hover:no-underline py-0">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold">Privacy & Security</span>
                  </div>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-gray-500">Last updated 30 days ago</p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-factor authentication</h4>
                  <p className="text-sm text-gray-500">Add extra security to your account</p>
                </div>
                <Button variant="outline" size="sm">Set up</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Profile visibility</h4>
                  <p className="text-sm text-gray-500">Who can see your profile</p>
                </div>
                <Badge variant="outline">Public</Badge>
              </div>
            </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>



        {/* LinkedIn-Style Sidebar Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Analytics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profile views</span>
                  <span className="font-semibold">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Post impressions</span>
                  <span className="font-semibold">1,832</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Search appearances</span>
                  <span className="font-semibold">89</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                  <div className="text-left">
                    <div className="font-medium text-sm">Career Guide</div>
                    <div className="text-xs text-gray-500">Building your professional brand</div>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                  <div className="text-left">
                    <div className="font-medium text-sm">Interview Tips</div>
                    <div className="text-xs text-gray-500">Ace your next interview</div>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                  <div className="text-left">
                    <div className="font-medium text-sm">Skills Assessment</div>
                    <div className="text-xs text-gray-500">Discover your strengths</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
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
        </div>
        </>
        )}

        {/* Booking Modal */}
        {user?.role === 'counselor' && user.id && (
          <BookingModal
            counselorId={user.id}
            counselorName={`${user.firstName} ${user.lastName}`}
            isOpen={showBookingModal}
            onClose={() => setShowBookingModal(false)}
          />
        )}

        {/* Sticky Floating Action Button (FAB) - Mobile Only */}
        <div className="fixed bottom-20 right-4 z-40 md:hidden">
          {/* FAB Menu Items - Show when expanded */}
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

          {/* Main FAB Button */}
          <Button
            size="lg"
            onClick={() => setShowFABMenu(!showFABMenu)}
            className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-200 ${
              showFABMenu
                ? 'bg-gradient-to-br from-red-500 to-red-600 rotate-45'
                : 'bg-gradient-to-br from-orange-500 to-orange-600'
            }`}
            aria-label={showFABMenu ? 'Close quick actions menu' : 'Open quick actions menu'}
            aria-expanded={showFABMenu}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Add Project Dialog */}
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

      {/* Add Experience Dialog */}
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

      {/* Add Skills Dialog */}
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
    </div>
  );
};

export default ProfilePage;