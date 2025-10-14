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
import { Edit, User, Target, Briefcase, Code, ExternalLink, Github, Globe, Camera, Shield } from 'lucide-react';
import { ImageUploader } from '../components/common/ImageUploader';








export const ProfilePage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingExperience, setLoadingExperience] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
        const Parse = await getParse();
        const result = await Parse.Cloud.run('getUserProjects');
        if (result.success && result.projects.length > 0) {
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
        const Parse = await getParse();
        const result = await Parse.Cloud.run('getUserExperience');
        if (result.success && result.experience.length > 0) {
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

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSaveProfile = async () => {
    try {
      // Here you would typically make an API call to update the profile
      // For now, we'll just show a success message
      console.log('Saving profile:', editFormData);
      setIsEditDialogOpen(false);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (imageUrl: string) => {
    try {
      console.log('Profile image uploaded:', imageUrl);
      // The ImageUploader component already handles the upload to backend
      // The user avatar will be updated automatically on next page load
      // For immediate UI update, we could refresh user data here
      window.location.reload();
    } catch (error) {
      console.error('Failed to handle image upload:', error);
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
          {/* Cover Photo */}
          <div className={`h-32 bg-gradient-to-r ${getThemeColor(currentTheme)} relative`}>
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Section */}
          <CardContent className="relative -mt-16 pb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white bg-white">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className={`bg-gradient-to-br ${getThemeColor(currentTheme)} text-white text-2xl`}>
                    {(user?.firstName || 'U')[0]}{(user?.lastName || 'U')[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-white"
                >
                  <Camera className="h-4 w-4" />
                </Button>
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
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              value={editFormData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              value={editFormData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right">
                              Location
                            </Label>
                            <Input
                              id="location"
                              value={editFormData.location}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">
                              Bio
                            </Label>
                            <Textarea
                              id="bio"
                              value={editFormData.bio}
                              onChange={(e) => handleInputChange('bio', e.target.value)}
                              className="col-span-3"
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
                        <div className="text-lg font-semibold">3</div>
                        <div className="text-xs text-gray-500">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">2</div>
                        <div className="text-xs text-gray-500">Experiences</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">8</div>
                        <div className="text-xs text-gray-500">Skills</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">82%</div>
                        <div className="text-xs text-gray-500">Profile strength</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
            {/* Keep existing student content for non-counselor users */}

            {/* Profile Picture Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-orange-600" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  currentImage={user?.profileImage}
                  userInitials={`${user?.firstName?.[0] || 'U'}${user?.lastName?.[0] || ''}`}
                  onUploadSuccess={handleImageUpload}
                />
              </CardContent>
            </Card>

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
              <Button variant="outline" size="sm" className="gap-2">
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
              <div className="text-center py-8 text-muted-foreground">
                <Code className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium mb-1">No projects yet</p>
                <p className="text-sm">Add your first project to showcase your work</p>
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
                    {project.technologies.map((tech: string) => (
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
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-600" />
                Experience
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Add experience
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingExperience ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading experience...
              </div>
            ) : experience.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium mb-1">No experience yet</p>
                <p className="text-sm">Add your work experience, internships, or volunteer work</p>
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
                        {exp.skills.map((skill: string) => (
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
        </Card>

        {/* Skills Section Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Skills
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Target className="h-4 w-4" />
                Add skill
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {skills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium mb-1">No skills yet</p>
                <p className="text-sm">Add your technical and soft skills</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills.map((skill: any) => (
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

        {/* Security Section Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Privacy & Security
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Shield className="h-4 w-4" />
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
        </Card>



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
      </div>
    </div>
  );
};

export default ProfilePage;