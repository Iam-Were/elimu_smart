# Sprint 20: Themed User Experience & Profile Builder Excellence
*AI-Driven Career Guidance Platform - Comprehensive User Journey Enhancement*

## 🎯 Sprint Overview
**Duration:** 15 Days  
**Focus:** Comprehensive profile builder system with themed user experience, checkpoint progression, and role-specific navigation excellence using ShadCN optimization.

**Token Optimization Strategy:** ShadCN-first approach achieving 75% development token reduction (4000→1000 tokens per component).

---

## 🚀 Key Deliverables

### 1. **Student Profile Builder System**
*LinkedIn-Inspired Competence Showcase - Professional Visual Layout*

Professional profile system inspired by LinkedIn's design patterns, focusing on **visual competence demonstration** with header banners, clean layouts, and achievement showcases.

#### **1.1 LinkedIn-Style Profile Header**
*Professional visual identity with banner and profile picture*

```typescript
interface StudentProfileHeader {
  // LINKEDIN-STYLE BANNER SECTION
  headerBanner: {
    bannerImage: string;                              // Custom header image (optional)
    bannerType: 'Academic' | 'Career Interest' | 'Personal Brand' | 'Achievement' | 'Default';
    bannerTemplates: HeaderTemplate[];               // Pre-designed templates students can choose
    customBanner: boolean;                           // Allow upload of personal banner
  };

  // PROFILE PICTURE & BASIC INFO (LinkedIn layout)
  profileSection: {
    profilePicture: string;                          // Professional profile photo
    studentName: string;
    currentLevel: 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4' | 'University Student';
    school: string;
    location: string;
    
    // LinkedIn-style headline
    professionalHeadline: string;                     // e.g., "Aspiring Engineer | Mathematics Excellence | Student Leader"
    
    // Quick stats (LinkedIn connections style)
    profileStats: {
      achievementCount: number;                       // Total achievements earned
      skillsValidated: number;                        // Skills with evidence
      projectsCompleted: number;                      // Portfolio projects
      mentorConnections: number;                      // Professional connections
    };
  };

  // LINKEDIN-STYLE ACTION BUTTONS
  profileActions: {
    messageButton: boolean;                          // Contact student (for counselors)
    shareProfileButton: boolean;                     // Share profile link
    downloadResumeButton: boolean;                   // Generate resume from profile
    recommendationButton: boolean;                   // Leave recommendation
  };
}

interface HeaderTemplate {
  templateId: string;
  name: string;
  category: 'Academic Excellence' | 'STEM Focus' | 'Arts & Creative' | 
           'Leadership' | 'Community Service' | 'Innovation' | 'Sports';
  imageUrl: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  overlayText?: string;                              // Optional inspirational text
}

// Pre-designed banner templates with Elimu Smart color themes
const studentBannerTemplates: HeaderTemplate[] = [
  {
    templateId: 'academic_excellence',
    name: 'Academic Excellence',
    category: 'Academic Excellence',
    imageUrl: '/banners/academic-excellence.jpg',
    colorScheme: {
      primary: 'text-orange-500',     // Elimu Smart Orange
      secondary: 'text-orange-400',   // Lighter orange
      accent: 'text-white'            // White text
    },
    overlayText: 'Pursuing Excellence in Learning'
  },
  {
    templateId: 'stem_innovator',
    name: 'STEM Innovator',
    category: 'STEM Focus',
    imageUrl: '/banners/stem-focus.jpg',
    colorScheme: {
      primary: 'text-orange-500',     // Elimu Smart Orange
      secondary: 'text-blue-600',     // Blue accent for STEM
      accent: 'text-white'
    },
    overlayText: 'Building Tomorrow Through Science & Technology'
  },
  {
    templateId: 'creative_expression',
    name: 'Creative Expression',
    category: 'Arts & Creative',
    imageUrl: '/banners/arts-creative.jpg',
    colorScheme: {
      primary: 'text-orange-500',     // Elimu Smart Orange
      secondary: 'text-pink-500',     // Pink creative accent
      accent: 'text-white'
    },
    overlayText: 'Expressing Ideas Through Art & Innovation'
  },
  {
    templateId: 'student_leader',
    name: 'Student Leader',
    category: 'Leadership',
    imageUrl: '/banners/leadership.jpg',
    colorScheme: {
      primary: 'text-orange-500',     // Elimu Smart Orange
      secondary: 'text-green-600',    // Green leadership accent
      accent: 'text-white'
    },
    overlayText: 'Leading Change, Inspiring Others'
  }
];

// Counselor banner templates with professional yellow theme
const counselorBannerTemplates: HeaderTemplate[] = [
  {
    templateId: 'student_success',
    name: 'Student Success Focus',
    category: 'Professional Excellence',
    imageUrl: '/banners/counselor-student-success.jpg',
    colorScheme: {
      primary: 'text-yellow-500',     // Elimu Smart Yellow
      secondary: 'text-yellow-400',   // Lighter yellow
      accent: 'text-gray-700'         // Dark gray text
    },
    overlayText: 'Empowering Students to Achieve Their Dreams'
  },
  {
    templateId: 'career_guidance',
    name: 'Career Guidance Expert',
    category: 'Professional Excellence',
    imageUrl: '/banners/counselor-career-guidance.jpg',
    colorScheme: {
      primary: 'text-yellow-500',     // Elimu Smart Yellow
      secondary: 'text-cyan-600',     // Teal professional accent
      accent: 'text-white'
    },
    overlayText: 'Guiding Students Toward Bright Futures'
  },
  {
    templateId: 'mental_health_advocate',
    name: 'Mental Health Advocate',
    category: 'Professional Excellence',
    imageUrl: '/banners/counselor-mental-health.jpg',
    colorScheme: {
      primary: 'text-yellow-500',     // Elimu Smart Yellow
      secondary: 'text-emerald-500',  // Green caring accent
      accent: 'text-white'
    },
    overlayText: 'Supporting Student Wellbeing & Growth'
  }
];
```
```

#### **1.2 LinkedIn-Style Information Cards**
*Professional information display with visual hierarchy*

```typescript
interface StudentProfileLayout {
  // ABOUT SECTION (LinkedIn About equivalent)
  aboutSection: {
    professionalSummary: string;                     // 2-3 sentences about themselves
    currentFocus: string[];                          // What they're working on now
    aspirations: string[];                           // Future goals and dreams
    personalValues: string[];                        // What drives them
  };

  // ACADEMIC EXPERIENCE (LinkedIn Experience equivalent)
  academicExperience: {
    currentEducation: {
      institution: string;
      level: string;
      startDate: Date;
      currentGPA?: number;
      majorSubjects: string[];
      achievements: string[];
    };
    
    academicHighlights: AcademicCard[];              // Key academic accomplishments
    subjectExpertise: SubjectCard[];                 // Best subjects with evidence
  };

  // SKILLS SECTION (LinkedIn Skills equivalent)
  skillsShowcase: {
    coreSkills: SkillWithEndorsement[];              // Skills with validation
    developingSkills: DevelopingSkill[];             // Skills they're building
    skillsWantToLearn: string[];                     // Future skill goals
  };

  // EXPERIENCE & ACTIVITIES (LinkedIn Experience equivalent)
  experiencePortfolio: {
    leadershipRoles: LeadershipCard[];               // Student government, club leadership
    workExperience: WorkCard[];                      // Jobs, internships, work shadowing
    volunteerWork: VolunteerCard[];                  // Community service
    projectPortfolio: ProjectCard[];                 // Personal and academic projects
  };

  // ACCOMPLISHMENTS (LinkedIn Accomplishments equivalent)
  accomplishmentsSection: {
    awards: AwardCard[];                             // Recognition received
    certifications: CertificationCard[];            // Courses completed, certificates earned
    publications: PublicationCard[];                // Articles, research, creative work
    competitions: CompetitionCard[];                 // Contests, competitions participated
  };

  // RECOMMENDATIONS (LinkedIn Recommendations equivalent)
  recommendationsSection: {
    receivedRecommendations: Recommendation[];       // From teachers, counselors, mentors
    pendingRequests: RecommendationRequest[];       // Requested but not yet received
    canRequestFrom: RecommendationSource[];         // Suggested people to ask
  };
}

interface SkillWithEndorsement {
  skill: string;
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  endorsements: Endorsement[];                       // Teacher/counselor validations
  evidenceExamples: string[];                        // How they've demonstrated this skill
  lastUpdated: Date;
}

interface AcademicCard {
  subject: string;
  achievement: string;
  timeframe: string;
  evidence: string;
  grade?: string;
  recognitionReceived?: string;
}
```

#### **1.3 LinkedIn-Style Activity Feed**
*Professional activity showcase and engagement*

```typescript
interface StudentActivityFeed {
  // ACTIVITY UPDATES (LinkedIn feed style)
  recentActivity: {
    achievements: ActivityPost[];                    // Recent accomplishments
    skillUpdates: ActivityPost[];                    // New skills learned
    projectShares: ActivityPost[];                   // Projects completed
    goalProgress: ActivityPost[];                    // Goal milestones reached
  };

  // ENGAGEMENT FEATURES
  socialFeatures: {
    profileViews: number;                           // Who's viewed their profile
    searchAppearances: number;                      // How often they appear in searches
    engagementRate: number;                         // Likes, comments on their updates
  };

  // NETWORK BUILDING
  professionalNetwork: {
    counselorConnections: CounselorConnection[];     // Connected guidance counselors
    teacherConnections: TeacherConnection[];        // Connected teachers
    mentorConnections: MentorConnection[];          // Industry mentors
    peerConnections: PeerConnection[];              // Fellow students
  };
}

interface ActivityPost {
  postId: string;
  type: 'Achievement' | 'Skill Update' | 'Project Share' | 'Goal Progress' | 'Recognition';
  title: string;
  description: string;
  datePosted: Date;
  attachments?: Attachment[];                       // Images, documents, links
  engagement: {
    likes: number;
    comments: Comment[];
    shares: number;
  };
  visibility: 'Public' | 'Connections Only' | 'Private';
}
```

#### **1.4 LinkedIn-Inspired ShadCN Components**
*Professional layout components following LinkedIn's design patterns with Elimu Smart color themes*

```typescript
// LinkedIn-Style Profile Header Component with Student Theme
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, MessageCircle, Share2, Download, Star } from "lucide-react"

interface LinkedInStyleHeaderProps {
  bannerImage: string;
  profileImage: string;
  studentName: string;
  headline: string;
  school: string;
  location: string;
  stats: ProfileStats;
  isOwnProfile: boolean;
  userRole: 'student' | 'counselor' | 'admin';
}

export const LinkedInStyleHeader: React.FC<LinkedInStyleHeaderProps> = ({
  bannerImage,
  profileImage,
  studentName,
  headline,
  school,
  location,
  stats,
  isOwnProfile,
  userRole
}) => {
  // Theme-based styling using Tailwind colors
  const getThemeColors = () => {
    switch (userRole) {
      case 'student':
        return {
          primary: 'bg-orange-500',
          primaryHover: 'hover:bg-orange-600',
          primaryText: 'text-orange-500',
          primaryBg: 'bg-orange-50',
          primaryBorder: 'border-orange-200',
          gradient: 'from-orange-500 via-orange-400 to-amber-400'
        };
      case 'counselor':
        return {
          primary: 'bg-yellow-500',
          primaryHover: 'hover:bg-yellow-600',
          primaryText: 'text-yellow-600',
          primaryBg: 'bg-yellow-50',
          primaryBorder: 'border-yellow-200',
          gradient: 'from-yellow-400 via-yellow-500 to-amber-500'
        };
      default:
        return {
          primary: 'bg-violet-500',
          primaryHover: 'hover:bg-violet-600',
          primaryText: 'text-violet-500',
          primaryBg: 'bg-violet-50',
          primaryBorder: 'border-violet-200',
          gradient: 'from-violet-500 via-purple-500 to-indigo-500'
        };
    }
  };

  const theme = getThemeColors();

  return (
    <Card className="w-full overflow-hidden border border-gray-200 shadow-lg">
      {/* LinkedIn-style Banner with Elimu Smart Theme */}
      <div className={`relative h-48 bg-gradient-to-r ${theme.gradient}`}>
        {bannerImage && (
          <img 
            src={bannerImage} 
            alt="Profile banner" 
            className="w-full h-full object-cover"
          />
        )}
        {isOwnProfile && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700"
          >
            <Camera className="h-4 w-4 mr-2" />
            Edit Banner
          </Button>
        )}
        
        {/* Profile Picture positioned over banner (LinkedIn style) */}
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <Avatar className="h-32 w-32 ring-4 ring-white shadow-lg">
              <AvatarImage src={profileImage} alt={studentName} />
              <AvatarFallback className={`text-2xl ${theme.primary} text-white font-bold`}>
                {studentName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <Button 
                size="sm" 
                variant="secondary" 
                className={`absolute -bottom-2 -right-2 rounded-full p-2 bg-white shadow-lg hover:shadow-xl ${theme.primaryHover}`}
              >
                <Camera className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Information (LinkedIn layout with theme colors) */}
      <CardContent className="pt-20 pb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{studentName}</h1>
            <p className={`text-lg font-medium mt-1 ${theme.primaryText}`}>{headline}</p>
            <p className="text-sm text-gray-600 mt-2">{school} • {location}</p>
            
            {/* LinkedIn-style stats with theme colors */}
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <span className={`${theme.primaryText} hover:underline cursor-pointer font-semibold transition-colors`}>
                {stats.achievementCount} achievements
              </span>
              <span className={`${theme.primaryText} hover:underline cursor-pointer font-semibold transition-colors`}>
                {stats.skillsValidated} skills validated
              </span>
              <span className={`${theme.primaryText} hover:underline cursor-pointer font-semibold transition-colors`}>
                {stats.mentorConnections} connections
              </span>
            </div>
          </div>

          {/* LinkedIn-style action buttons with theme colors */}
          <div className="flex gap-2 mt-4 md:mt-0">
            {!isOwnProfile && (
              <>
                <Button className={`${theme.primary} ${theme.primaryHover} text-white shadow-lg hover:shadow-xl transition-all`} size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${theme.primaryBorder} ${theme.primaryText} hover:${theme.primaryBg} transition-all`}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Recommend
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              size="sm"
              className={`${theme.primaryBorder} ${theme.primaryText} hover:${theme.primaryBg} transition-all`}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={`${theme.primaryBorder} ${theme.primaryText} hover:${theme.primaryBg} transition-all`}
            >
              <Download className="h-4 w-4 mr-2" />
              Resume
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// LinkedIn-Style Information Card Component with Theme Colors
interface LinkedInInfoCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  editMode?: boolean;
  onEdit?: () => void;
  userRole: 'student' | 'counselor' | 'admin';
}

export const LinkedInInfoCard: React.FC<LinkedInInfoCardProps> = ({
  title,
  icon,
  children,
  editMode = false,
  onEdit,
  userRole
}) => {
  const getThemeColors = () => {
    switch (userRole) {
      case 'student':
        return {
          primaryText: 'text-orange-500',
          primaryBg: 'bg-orange-50',
          primaryBorder: 'border-orange-200'
        };
      case 'counselor':
        return {
          primaryText: 'text-yellow-600',
          primaryBg: 'bg-yellow-50',
          primaryBorder: 'border-yellow-200'
        };
      default:
        return {
          primaryText: 'text-violet-500',
          primaryBg: 'bg-violet-50',
          primaryBorder: 'border-violet-200'
        };
    }
  };

  const theme = getThemeColors();

  return (
    <Card className={`w-full mb-4 border ${theme.primaryBorder} ${theme.primaryBg} shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-semibold flex items-center gap-2 ${theme.primaryText}`}>
            {icon}
            {title}
          </h3>
          {editMode && onEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
              className={`${theme.primaryText} hover:${theme.primaryBg} transition-colors`}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
};

// LinkedIn-Style Experience Card with Theme Colors
interface ExperienceCardProps {
  experience: {
    title: string;
    organization: string;
    duration: string;
    description: string;
    skills: string[];
    achievements?: string[];
  };
  userRole: 'student' | 'counselor' | 'admin';
  showLogo?: boolean;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  userRole,
  showLogo = true
}) => {
  const getThemeColors = () => {
    switch (userRole) {
      case 'student':
        return {
          primary: 'bg-orange-500',
          primaryText: 'text-orange-500',
          primaryBg: 'bg-orange-50',
          primaryLight: 'bg-orange-100'
        };
      case 'counselor':
        return {
          primary: 'bg-yellow-500',
          primaryText: 'text-yellow-600',
          primaryBg: 'bg-yellow-50',
          primaryLight: 'bg-yellow-100'
        };
      default:
        return {
          primary: 'bg-violet-500',
          primaryText: 'text-violet-500',
          primaryBg: 'bg-violet-50',
          primaryLight: 'bg-violet-100'
        };
    }
  };

  const theme = getThemeColors();

  return (
    <div className="flex gap-4 p-4 border-b last:border-b-0">
      {showLogo && (
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarFallback className={`${theme.primaryBg} ${theme.primaryText} font-semibold`}>
            {experience.organization.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{experience.title}</h4>
        <p className={`font-medium ${theme.primaryText}`}>{experience.organization}</p>
        <p className="text-sm text-gray-500 mb-2">{experience.duration}</p>
        
        <p className="text-sm text-gray-600 mb-3">{experience.description}</p>
        
        {experience.achievements && experience.achievements.length > 0 && (
          <div className={`mb-3 p-3 rounded-lg ${theme.primaryLight} border border-opacity-20`}>
            <p className={`text-sm font-medium mb-1 ${theme.primaryText}`}>Key Achievements:</p>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
              {experience.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1">
          {experience.skills.map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={`text-xs ${theme.primaryBg} ${theme.primaryText} border-0 hover:${theme.primaryLight} transition-colors`}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
```

#### **1.3 Visual Competence Dashboard**
*Automated portfolio generation showcasing student achievements*

```typescript
interface CompetenceDashboard {
  // STRENGTH RADAR CHART (Auto-generated)
  strengthsVisualization: {
    academicStrengths: RadarPoint[];                  // Academic skills mapped visually
    personalStrengths: RadarPoint[];                  // Personal characteristics
    futureReadiness: RadarPoint[];                    // Career preparation skills
    growthAreas: RadarPoint[];                       // Areas they're developing
  };

  // ACHIEVEMENT TIMELINE (Auto-populated)
  accomplishmentTimeline: {
    academicMilestones: Milestone[];                  // Grade improvements, awards
    experienceMilestones: Milestone[];                // Activities, projects, work
    personalGrowthMilestones: Milestone[];            // Challenges overcome, skills gained
    futurePlanning: Milestone[];                      // Goals set and achieved
  };

  // COMPETENCE SUMMARY CARDS (System-generated)
  competenceSummary: {
    academicProfile: {
      title: "Academic Achiever";
      highlights: string[];                           // Top 3 academic strengths
      growthStory: string;                           // Brief improvement narrative
    };
    
    characterProfile: {
      title: "Personal Strengths";
      highlights: string[];                           // Top 3 personal strengths
      evidenceExamples: string[];                     // How they've demonstrated these
    };
    
    preparednessProfile: {
      title: "Future Ready";
      highlights: string[];                           // Career exploration activities
      nextSteps: string[];                           // Planned development actions
    };
  };

  // SHAREABLE PORTFOLIO (One-click generation)
  portfolioExport: {
    counselorView: StudentSummary;                    // Formatted for counselor review
    teacherView: StudentSummary;                      // Formatted for teacher reference
    applicationView: StudentSummary;                  // Formatted for college/job applications
    parentView: StudentSummary;                       // Formatted for family sharing
  };
}

interface RadarPoint {
  skill: string;
  level: number;                                      // 1-5 scale
  evidence: string;                                   // Supporting example
  trend: 'improving' | 'stable' | 'developing';
}

interface Milestone {
  date: Date;
  category: 'Academic' | 'Personal' | 'Experience' | 'Goal';
  title: string;
  description: string;
  impact: string;                                     // What this meant for their growth
}
```

#### **1.4 Implementation-Friendly Components**
*Simple, reusable components for easy development*

```typescript
// ShadCN Optimized Student Competence Card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, TrendingUp, Target } from "lucide-react"

interface StudentCompetenceCardProps {
  type: 'academic' | 'personal' | 'experience';
  title: string;
  highlights: string[];
  evidence: string;
  trend: 'improving' | 'stable' | 'excellent';
}

export const StudentCompetenceCard: React.FC<StudentCompetenceCardProps> = ({
  type,
  title,
  highlights,
  evidence,
  trend
}) => {
  const getIcon = () => {
    switch (type) {
      case 'academic':
        return <Star className="h-5 w-5 text-blue-500" />;
      case 'personal':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'experience':
        return <Target className="h-5 w-5 text-purple-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'excellent':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getIcon()}
            {title}
          </CardTitle>
          <Badge variant="outline" className={getTrendColor()}>
            {trend}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Strengths:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">Evidence:</p>
            <p className="text-sm text-gray-600 mt-1">{evidence}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Simple Achievement Display Component
interface AchievementDisplayProps {
  achievements: Achievement[];
  viewMode: 'student' | 'counselor' | 'parent';
}

export const AchievementDisplay: React.FC<AchievementDisplayProps> = ({
  achievements,
  viewMode
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {achievements.map((achievement, index) => (
        <Card key={index} className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-sm">{achievement.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {achievement.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-2">{achievement.description}</p>
            {viewMode === 'counselor' && (
              <p className="text-xs text-blue-600 mt-2 font-medium">
                Impact: {achievement.impact}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Quick Input Form Component
interface QuickInputFormProps {
  fields: FormField[];
  onSubmit: (data: FormData) => void;
  title: string;
  estimatedTime: string;
}

export const QuickInputForm: React.FC<QuickInputFormProps> = ({
  fields,
  onSubmit,
  title,
  estimatedTime
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-500">Estimated time: {estimatedTime}</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          {fields.map((field, index) => (
            <QuickInputField key={index} field={field} />
          ))}
          <Button onClick={() => onSubmit()} className="w-full">
            Save & Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
```

**Implementation Benefits:**
- **Reusable components** reduce development time
- **Simple data structures** easy to implement
- **Visual feedback** keeps students engaged
- **Mobile-responsive** design patterns
- **Minimal API calls** for better performance
```

### 2. **Guidance Counselor Profile Builder System**
*LinkedIn-Inspired Professional Service Provider Profile*

Professional counselor profile following LinkedIn's design patterns with streamlined setup based on **International Association for Educational and Vocational Guidance (IAEVG)** and **American School Counselor Association (ASCA)** standards.

#### **2.1 LinkedIn-Style Counselor Header**
*Professional service provider identity with banner and credentials*

```typescript
interface CounselorProfileHeader {
  // LINKEDIN-STYLE PROFESSIONAL BANNER
  professionalBanner: {
    bannerImage: string;                              // Professional header image
    bannerType: 'School Pride' | 'Professional Growth' | 'Student Success' | 'Counseling Excellence' | 'Custom';
    bannerTemplates: ProfessionalTemplate[];         // Pre-designed professional templates
    schoolBranding: boolean;                         // Option to include school colors/logo
  };

  // PROFESSIONAL PROFILE SECTION (LinkedIn layout)
  professionalIdentity: {
    profilePicture: string;                          // Professional headshot
    fullName: string;
    professionalTitle: string;                       // e.g., "Licensed School Counselor"
    currentInstitution: string;
    location: string;
    
    // LinkedIn-style professional headline
    professionalHeadline: string;                     // e.g., "Empowering Students | College & Career Guidance | Mental Health Advocate"
    
    // Professional credibility indicators
    professionalStats: {
      yearsExperience: number;                       // Professional experience
      studentsServed: number;                        // Total students helped (lifetime)
      successRate: number;                          // Student goal achievement rate
      professionalConnections: number;               // Network size
    };
    
    // Credential badges (LinkedIn certification style)
    credentialBadges: CredentialBadge[];             // Visual display of certifications
  };

  // LINKEDIN-STYLE PROFESSIONAL ACTIONS
  professionalActions: {
    connectButton: boolean;                          // Professional networking
    recommendationButton: boolean;                   // Professional recommendations
    scheduleConsultationButton: boolean;             // Book appointment
    shareProfileButton: boolean;                     // Share professional profile
  };
}

interface CredentialBadge {
  badgeId: string;
  credentialType: 'License' | 'Certification' | 'Degree' | 'Training' | 'Membership';
  name: string;
  issuingOrganization: string;
  verificationStatus: 'Verified' | 'Pending' | 'Expired';
  displayPriority: number;                          // Order of display
  badgeIcon: string;                               // Visual badge representation
}
```

#### **2.2 LinkedIn-Style Professional Information Cards**
*Streamlined professional showcase with visual hierarchy*

```typescript
interface CounselorProfessionalLayout {
  // ABOUT SECTION (LinkedIn About equivalent)
  professionalAbout: {
    missionStatement: string;                        // 2-3 sentences about their approach
    specializations: string[];                       // Key areas of expertise
    counselingPhilosophy: string;                    // Brief philosophy statement
    professionalValues: string[];                   // Core professional values
  };

  // PROFESSIONAL EXPERIENCE (LinkedIn Experience equivalent)
  professionalExperience: {
    currentPosition: {
      title: string;
      institution: string;
      startDate: Date;
      responsibilities: string[];
      studentPopulation: StudentPopulationInfo;
      keyAchievements: string[];
    };
    
    previousPositions: ProfessionalPosition[];      // Career history
    counselingSpecialties: SpecialtyCard[];         // Areas of expertise with evidence
  };

  // CREDENTIALS & CERTIFICATIONS (LinkedIn Licenses & Certifications)
  credentialsShowcase: {
    primaryLicense: LicenseCard;                    // Main professional license
    additionalCertifications: CertificationCard[];  // Additional credentials
    continuingEducation: EducationCard[];          // Recent training and development
    professionalMemberships: MembershipCard[];     // Professional organizations
  };

  // STUDENT IMPACT & OUTCOMES (Professional Results)
  impactShowcase: {
    studentSuccessMetrics: ImpactMetric[];          // Quantified student outcomes
    programImplementations: ProgramCard[];         // Programs developed/implemented
    professionalContributions: ContributionCard[]; // Articles, presentations, research
  };

  // PROFESSIONAL NETWORK (LinkedIn Connections equivalent)
  professionalNetwork: {
    colleagueConnections: ColleagueConnection[];    // Fellow counselors and educators
    studentConnections: StudentConnection[];       // Current and former students
    mentorshipRoles: MentorshipCard[];             // Mentoring activities
    communityPartners: PartnerConnection[];       // External professional partners
  };

  // RECOMMENDATIONS (LinkedIn Recommendations)
  professionalRecommendations: {
    receivedRecommendations: ProfessionalRecommendation[];  // From supervisors, colleagues
    studentTestimonials: StudentTestimonial[];              // Student success stories
    parentFeedback: ParentFeedback[];                       // Parent appreciation
    pendingRequests: RecommendationRequest[];               // Requested testimonials
  };
}

interface LicenseCard {
  licenseType: string;
  licenseNumber: string;
  issuingAuthority: string;
  issueDate: Date;
  expirationDate: Date;
  verificationLink?: string;
  renewalStatus: 'Current' | 'Renewal Due' | 'Expired';
}

interface ImpactMetric {
  metricName: string;
  value: number;
  unit: string;
  timeframe: string;
  context: string;                                 // Brief explanation of significance
  trendDirection: 'Improving' | 'Stable' | 'Excellent';
}
```

#### **2.3 LinkedIn-Style Counselor Components**
*Professional counselor profile components with Elimu Smart counselor theme (text-yellow-500)*

```typescript
// LinkedIn-Style Counselor Header Component with Counselor Theme
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare, Share2, Award, Users, TrendingUp, Camera, Edit } from "lucide-react"

interface LinkedInStyleCounselorHeaderProps {
  bannerImage: string;
  profileImage: string;
  counselorName: string;
  professionalTitle: string;
  institution: string;
  location: string;
  headline: string;
  stats: CounselorStats;
  credentials: CredentialBadge[];
  isOwnProfile: boolean;
}

export const LinkedInStyleCounselorHeader: React.FC<LinkedInStyleCounselorHeaderProps> = ({
  bannerImage,
  profileImage,
  counselorName,
  professionalTitle,
  institution,
  location,
  headline,
  stats,
  credentials,
  isOwnProfile
}) => {
  // Counselor Theme Colors (Yellow/Gold) using Tailwind
  const counselorTheme = {
    primary: 'bg-yellow-500',
    primaryHover: 'hover:bg-yellow-600',
    primaryText: 'text-yellow-600',
    primaryBg: 'bg-yellow-50',
    primaryBorder: 'border-yellow-200',
    primaryLight: 'bg-yellow-100',
    gradient: 'from-yellow-400 via-yellow-500 to-amber-500'
  };

  return (
    <Card className="w-full overflow-hidden border border-gray-200 shadow-lg">
      {/* Professional Banner with Counselor Theme */}
      <div className={`relative h-48 bg-gradient-to-r ${counselorTheme.gradient}`}>
        {bannerImage && (
          <img 
            src={bannerImage} 
            alt="Professional banner" 
            className="w-full h-full object-cover"
          />
        )}
        {isOwnProfile && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700"
          >
            <Camera className="h-4 w-4 mr-2" />
            Edit Banner
          </Button>
        )}
        
        {/* Profile Picture positioned over banner */}
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <Avatar className="h-32 w-32 ring-4 ring-white shadow-lg">
              <AvatarImage src={profileImage} alt={counselorName} />
              <AvatarFallback className={`text-2xl ${counselorTheme.primary} text-white font-semibold`}>
                {counselorName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <Button 
                size="sm" 
                variant="secondary" 
                className={`absolute -bottom-2 -right-2 rounded-full p-2 bg-white shadow-md ${counselorTheme.primaryHover}`}
              >
                <Camera className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Professional Information with Counselor Theme */}
      <CardContent className="pt-20 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{counselorName}</h1>
              <Award className={`h-5 w-5 ${counselorTheme.primaryText}`} />
            </div>
            <p className="text-lg text-gray-700">{professionalTitle}</p>
            <p className={`text-lg font-medium ${counselorTheme.primaryText}`}>{headline}</p>
            <p className="text-sm text-gray-600 mt-2">{institution} • {location}</p>
            
            {/* Professional Credentials (LinkedIn-style badges with counselor theme) */}
            <div className="flex flex-wrap gap-2 mt-3">
              {credentials.slice(0, 3).map((credential, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={`${counselorTheme.primaryBg} ${counselorTheme.primaryText} ${counselorTheme.primaryBorder} border`}
                >
                  {credential.name}
                </Badge>
              ))}
            </div>
            
            {/* Professional Impact Stats with counselor theme */}
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className={`h-4 w-4 ${counselorTheme.primaryText}`} />
                <span className={`${counselorTheme.primaryText} hover:underline cursor-pointer font-medium`}>
                  {stats.studentsServed}+ students served
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className={`h-4 w-4 ${counselorTheme.primaryText}`} />
                <span className={`${counselorTheme.primaryText} hover:underline cursor-pointer font-medium`}>
                  {stats.successRate}% success rate
                </span>
              </div>
              <span className={`${counselorTheme.primaryText} hover:underline cursor-pointer font-medium`}>
                {stats.yearsExperience} years experience
              </span>
            </div>
          </div>

          {/* Professional Action Buttons with counselor theme */}
          <div className="flex gap-2 mt-4 lg:mt-0">
            {!isOwnProfile && (
              <>
                <Button className={`${counselorTheme.primary} ${counselorTheme.primaryHover} text-white`} size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${counselorTheme.primaryBorder} ${counselorTheme.primaryText} hover:${counselorTheme.primaryBg}`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              size="sm"
              className={`${counselorTheme.primaryBorder} ${counselorTheme.primaryText} hover:${counselorTheme.primaryBg}`}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// LinkedIn-Style Professional Experience Card with Counselor Theme
interface ProfessionalExperienceCardProps {
  position: {
    title: string;
    institution: string;
    duration: string;
    description: string;
    achievements: string[];
    studentImpact: string;
    specializations: string[];
  };
}

export const ProfessionalExperienceCard: React.FC<ProfessionalExperienceCardProps> = ({
  position
}) => {
  // Counselor Theme Colors using Tailwind
  const counselorTheme = {
    primaryText: 'text-yellow-500',
    primaryBg: 'bg-yellow-50',
    primaryLight: 'bg-yellow-100',
    impactBg: 'bg-yellow-100',
    impactText: 'text-yellow-700'
  };

  return (
    <div className="flex gap-4 p-4 border-b last:border-b-0">
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarFallback className={`${counselorTheme.primaryBg} ${counselorTheme.primaryText} font-semibold`}>
          {position.institution.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{position.title}</h4>
        <p className={`font-medium ${counselorTheme.primaryText}`}>{position.institution}</p>
        <p className="text-sm text-gray-500 mb-2">{position.duration}</p>
        
        <p className="text-sm text-gray-600 mb-3">{position.description}</p>
        
        {/* Student Impact Highlight with counselor theme */}
        <div className={`p-3 rounded-lg mb-3 ${counselorTheme.impactBg}`}>
          <p className={`text-sm font-medium mb-1 ${counselorTheme.impactText}`}>Student Impact:</p>
          <p className={`text-sm ${counselorTheme.impactText}`}>{position.studentImpact}</p>
        </div>
        
        {/* Key Achievements */}
        {position.achievements.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Key Achievements:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              {position.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Specializations with counselor theme */}
        <div className="flex flex-wrap gap-1">
          {position.specializations.map((spec, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={`text-xs ${counselorTheme.primaryBg} ${counselorTheme.primaryText} border-0`}
            >
              {spec}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

// LinkedIn-Style Student Impact Dashboard with Counselor Theme
interface StudentImpactDashboardProps {
  impactMetrics: ImpactMetric[];
  testimonials: StudentTestimonial[];
  timeframe: string;
}

export const StudentImpactDashboard: React.FC<StudentImpactDashboardProps> = ({
  impactMetrics,
  testimonials,
  timeframe
}) => {
  // Counselor Theme Colors using Tailwind
  const counselorTheme = {
    primary: 'bg-yellow-500',
    primaryText: 'text-yellow-500',
    primaryBg: 'bg-yellow-50',
    primaryBorder: 'border-yellow-200',
    successBg: 'bg-yellow-100',
    successText: 'text-yellow-700',
    successBorder: 'border-yellow-300'
  };

  return (
    <div className="space-y-6">
      {/* Impact Metrics Grid with counselor theme */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {impactMetrics.map((metric, index) => (
          <Card key={index} className={`p-4 text-center ${counselorTheme.primaryBg} ${counselorTheme.primaryBorder} border`}>
            <div className={`text-2xl font-bold ${counselorTheme.primaryText}`}>
              {metric.value}{metric.unit}
            </div>
            <div className="text-sm text-gray-700 font-medium">{metric.metricName}</div>
            <div className="text-xs text-gray-500 mt-1">{timeframe}</div>
          </Card>
        ))}
      </div>

      {/* Student Success Stories with counselor theme */}
      <div className="space-y-4">
        <h4 className={`font-semibold text-gray-900 flex items-center gap-2`}>
          <TrendingUp className={`h-5 w-5 ${counselorTheme.primaryText}`} />
          Recent Student Success Stories
        </h4>
        {testimonials.slice(0, 3).map((testimonial, index) => (
          <Card key={index} className={`p-4 ${counselorTheme.successBg} ${counselorTheme.successBorder} border`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 ${counselorTheme.primaryBg} rounded-full flex items-center justify-center`}>
                  <span className={`text-sm font-medium ${counselorTheme.primaryText}`}>
                    {testimonial.studentInitials}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className={`text-sm italic ${counselorTheme.successText}`}>"{testimonial.feedback}"</p>
                <p className={`text-xs mt-2 font-medium ${counselorTheme.primaryText}`}>
                  {testimonial.outcome} • {testimonial.timeframe}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Skills Section with Counselor Theme
interface CounselorSkillsSectionProps {
  skills: SkillWithEndorsement[];
  canEndorse: boolean;
  onEndorse?: (skillId: string) => void;
}

export const CounselorSkillsSection: React.FC<CounselorSkillsSectionProps> = ({
  skills,
  canEndorse,
  onEndorse
}) => {
  // Counselor Theme Colors using Tailwind
  const counselorTheme = {
    primaryText: 'text-yellow-500',
    primaryBg: 'bg-yellow-50',
    primaryBorder: 'border-yellow-200',
    primary: 'bg-yellow-500',
    primaryHover: 'hover:bg-yellow-600'
  };

  return (
    <div className="space-y-4">
      {skills.map((skill, index) => (
        <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${counselorTheme.primaryBg}`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">{skill.skill}</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${counselorTheme.primaryText} ${counselorTheme.primaryBorder} border`}
              >
                {skill.proficiencyLevel}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {skill.evidenceExamples[0]}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className={counselorTheme.primaryText}>{skill.endorsements.length} endorsements</span>
              {skill.endorsements.length > 0 && (
                <div className="flex -space-x-1">
                  {skill.endorsements.slice(0, 3).map((endorsement, idx) => (
                    <Avatar key={idx} className="h-6 w-6 ring-2 ring-white">
                      <AvatarFallback className={`text-xs ${counselorTheme.primaryBg} ${counselorTheme.primaryText}`}>
                        {endorsement.endorserName.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {canEndorse && onEndorse && (
            <Button 
              variant="outline" 
              size="sm" 
              className={`${counselorTheme.primaryBorder} ${counselorTheme.primaryText} hover:${counselorTheme.primaryBg}`}
              onClick={() => onEndorse(skill.skill)}
            >
              <Award className="h-3 w-3 mr-1" />
              Endorse
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
```
```

#### **2.3 Professional Standards & Continuous Learning Section**
*International Standards Compliance - Simple Verification System*

```typescript
interface ProfessionalStandardsProfile {
  // ETHICAL COMPLIANCE (One-time setup with annual verification)
  ethicalStandards: {
    primaryGuidelines: 'ASCA Ethical Standards' | 'ACA Code of Ethics' | 'IAEVG Guidelines' | 
                      'Kenya Counselling and Psychology Board' | 'Local Professional Standards';
    lastEthicsTraining: {
      completionDate: Date;
      provider: string;
      certificateUploaded: boolean;
    };
    mandatoryReporting: {
      acknowledgedRequirements: boolean;
      lastTrainingDate: Date;
      localLawsUnderstood: boolean;
    };
  };

  // PROFESSIONAL DEVELOPMENT (Smart tracking with minimal input)
  continuingEducation: {
    annualRequirement: number;           // Auto-filled based on license requirements
    currentProgress: number;             // Auto-calculated from uploaded certificates
    upcomingDeadline: Date;             // Auto-calculated from license renewal
    
    // Simple upload system for certificates
    recentTraining: {
      title: string;
      provider: string;
      hoursCompleted: number;
      completionDate: Date;
      certificateUploaded: boolean;
    }[];
    
    // Professional interests for development recommendations
    developmentInterests: {
      skillAreas: ('Crisis Intervention' | 'Trauma-Informed Care' | 'Cultural Competency' | 
                  'Technology Integration' | 'Assessment & Testing' | 'Group Facilitation' | 
                  'Parent Engagement' | 'Career Development' | 'Mental Health' | 
                  'Special Needs Support')[];
      learningPreferences: ('Online Courses' | 'Workshops' | 'Conferences' | 
                           'Mentoring' | 'Certification Programs' | 'Research Projects')[];
    };
  };

  // CULTURAL COMPETENCY & INCLUSIVITY (International best practices)
  culturalCompetency: {
    selfAssessment: {
      completed: boolean;
      lastUpdateDate: Date;
      strengthAreas: string[];
      growthAreas: string[];
    };
    
    diversityExperience: {
      languagesSpoken: Language[];
      culturalBackgrounds: CulturalBackground[];
      specialPopulations: SpecialPopulation[];
      inclusivityTraining: TrainingRecord[];
    };
    
    // Simple bias awareness check
    biasAwareness: {
      acknowledgedImplicitBias: boolean;
      lastBiasTrainingDate: Date;
      culturalHumilityPractices: string[]; // Brief list of practices they use
    };
  };

  // TECHNOLOGY & INNOVATION (Modern counseling practices)
  technologyProficiency: {
    platformComfort: {
      counselingPlatforms: PlatformProficiency[];
      assessmentTools: DigitalTool[];
      communicationSystems: CommunicationTool[];
    };
    
    digitalEthics: {
      confidentialityTraining: boolean;
      telehealth: boolean;
      socialMediaPolicies: boolean;
    };
  };
}

// Simplified supporting interfaces
interface Language {
  language: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
  useInCounseling: boolean;
}

interface CulturalBackground {
  background: string;
  personalExperience: boolean;
  professionalExperience: boolean;
  comfortLevel: 'Learning' | 'Comfortable' | 'Highly Experienced';
}

interface SpecialPopulation {
  population: 'LGBTQ+ Youth' | 'Students with Disabilities' | 'Refugee/Immigrant Students' | 
             'First-Generation College Students' | 'Students in Foster Care' | 
             'Homeless Students' | 'Students with Mental Health Challenges' | 
             'Gifted Students' | 'At-Risk Students';
  experienceLevel: 'New' | 'Some Experience' | 'Experienced' | 'Specialist';
}
```

**Streamlined Features:**
- **One-time setup** with annual verification prompts
- **Auto-populated requirements** based on location and license
- **Certificate upload system** rather than manual tracking
- **Smart recommendations** for professional development
- **Cultural competency self-assessment** with growth planning
- **Technology readiness** evaluation for modern counseling practices

#### **2.4 Quick Profile Setup Wizard**
*Professional counselors can complete their profile in under 15 minutes*

```typescript
interface QuickSetupWizard {
  // STEP 1: Essential Information (3 minutes)
  basicCredentials: {
    importOptions: ('Upload Resume' | 'LinkedIn Import' | 'Manual Entry');
    requiredFields: ['Primary Degree', 'License Type', 'Years Experience', 'Current Position'];
    autoValidation: boolean; // System checks license numbers against databases
  };

  // STEP 2: Service Specializations (4 minutes)
  serviceSetup: {
    smartSuggestions: boolean; // Based on education and experience
    maxSelections: 5; // Prevents overwhelming choices
    canModifyLater: boolean;
    prePopulatedFromCV: boolean;
  };

  // STEP 3: Professional Standards (5 minutes)
  standardsCompliance: {
    locationBasedRequirements: boolean; // Auto-fills local requirements
    uploadCertificates: boolean; // Drag-and-drop interface
    ethicsAcknowledgment: boolean; // One-click acknowledgment
  };

  // STEP 4: Working Preferences (3 minutes)
  workingStyle: {
    counselingApproach: string; // Single selection
    sessionPreferences: string[]; // Multiple selection
    communicationStyle: string; // Single selection
  };

  // OPTIONAL SECTIONS (Can be completed later)
  optionalSections: {
    culturalCompetency: boolean;
    technologyProficiency: boolean;
    professionalDevelopmentGoals: boolean;
    mentorshipInterests: boolean;
  };
}
```

**User Experience Enhancements:**
- **Progress indicator** showing completion percentage
- **Save and continue later** functionality
- **Smart field validation** with helpful error messages
- **Auto-save** every 30 seconds
- **Mobile-friendly** interface for completion on any device
- **Import from existing profiles** (LinkedIn, CV, other platforms)

**International Standards Alignment:**
- **ASCA National Model** compliance for US counselors
- **IAEVG International Competencies** for global standards
- **Local regulatory requirements** auto-populated by location
- **Ethical guidelines** acknowledgment with annual renewal
- **Cultural competency** standards for diverse student populations
```

---

## 🎨 Themed Navigation & User Experience Architecture

### 3. **Role-Based Navigation Hub System**

#### **3.1 Student Navigation Hub**
**Theme Color:** Elimu Smart Orange (text-orange-500) - Energy, Growth, Opportunity
**Supporting Colors:** Light Orange (text-orange-400), Orange Accent (text-orange-600)

```typescript
interface StudentNavigationHub {
  mainSections: {
    dashboard: {
      title: "My Journey Dashboard";
      description: "Track your progress and discover opportunities";
      quickActions: ["View Progress", "Explore Careers", "Check Assignments"];
      widgets: ["Progress Overview", "Recommended Actions", "Upcoming Deadlines"];
    };
    careerIntelligence: {
      title: "Career Intelligence";
      description: "AI-powered career discovery and planning";
      subsections: ["Career Explorer", "Skill Mapper", "Industry Insights", "Job Market Trends"];
      tools: ["Personality Assessment", "Interest Inventory", "Skills Gap Analysis"];
    };
    universityJourney: {
      title: "University Journey";
      description: "Navigate your path to higher education";
      subsections: ["University Explorer", "Application Tracker", "Scholarship Finder"];
      resources: ["Application Guides", "Essay Support", "Interview Prep"];
    };
    skillDevelopment: {
      title: "Skill Development";
      description: "Build the skills employers want";
      subsections: ["Learning Paths", "Certification Tracker", "Project Portfolio"];
      features: ["Skill Assessments", "Learning Recommendations", "Progress Tracking"];
    };
    supportNetwork: {
      title: "Support Network";
      description: "Connect with mentors and counselors";
      subsections: ["My Counselor", "Peer Groups", "Mentor Network"];
      communication: ["Messages", "Appointments", "Group Discussions"];
    };
    portfolioBuilder: {
      title: "Portfolio Builder";
      description: "Showcase your achievements and projects";
      subsections: ["Academic Portfolio", "Project Showcase", "Achievement Gallery"];
      tools: ["Portfolio Templates", "Sharing Options", "Feedback Collection"];
    };
  };
}
```

#### **3.2 Counselor Navigation Hub**
**Theme Color:** Elimu Smart Yellow (text-yellow-500) - Wisdom, Guidance, Support
**Supporting Colors:** Light Yellow (text-yellow-400), Yellow Accent (text-yellow-600)

```typescript
interface CounselorNavigationHub {
  mainSections: {
    dashboard: {
      title: "Counselor Command Center";
      description: "Manage students and track outcomes";
      quickActions: ["Student Alerts", "Schedule Review", "Data Insights"];
      widgets: ["Caseload Overview", "Priority Students", "Success Metrics"];
    };
    studentManagement: {
      title: "Student Management";
      description: "Comprehensive student support system";
      subsections: ["Active Caseload", "Student Profiles", "Intervention Tracker"];
      tools: ["Assessment Tools", "Progress Monitoring", "Goal Setting"];
    };
    programManagement: {
      title: "Program Management";
      description: "Design and implement guidance programs";
      subsections: ["Program Library", "Curriculum Builder", "Outcome Tracking"];
      resources: ["Best Practices", "Research Base", "Implementation Guides"];
    };
    dataAnalytics: {
      title: "Data & Analytics";
      description: "Evidence-based decision making";
      subsections: ["Student Outcomes", "Program Effectiveness", "Trend Analysis"];
      reports: ["Impact Reports", "Progress Dashboards", "Predictive Analytics"];
    };
    professionalDevelopment: {
      title: "Professional Development";
      description: "Enhance your counseling effectiveness";
      subsections: ["Training Center", "Research Library", "Certification Tracker"];
      features: ["Skill Development", "Knowledge Base", "Peer Collaboration"];
    };
    resourceCenter: {
      title: "Resource Center";
      description: "Tools and materials for effective counseling";
      subsections: ["Assessment Library", "Intervention Toolkit", "Reference Materials"];
      collections: ["Career Resources", "Academic Support", "Crisis Intervention"];
    };
  };
}
```

#### **3.3 Admin Navigation Hub**
**Theme Color:** Elimu Smart Violet (text-violet-500) - Authority, Analytics, Innovation
**Supporting Colors:** Light Violet (text-violet-400), Purple Accent (text-purple-600)

```typescript
interface AdminNavigationHub {
  mainSections: {
    analyticsCenter: {
      title: "Analytics Command Center";
      description: "Real-time insights and performance analytics";
      quickActions: ["View System Health", "Generate Reports", "Monitor User Activity"];
      widgets: ["Platform Metrics", "User Engagement", "Performance Trends"];
    };
    userManagement: {
      title: "User Management";
      description: "Comprehensive user administration and oversight";
      subsections: ["Student Management", "Counselor Management", "Role Assignment", "Access Control"];
      tools: ["Bulk Operations", "User Analytics", "Permission Management"];
    };
    systemGovernance: {
      title: "System Governance";
      description: "Platform configuration and policy management";
      subsections: ["Platform Settings", "Security Policies", "Content Moderation"];
      resources: ["System Logs", "Audit Trails", "Compliance Reports"];
    };
    contentManagement: {
      title: "Content & Resources";
      description: "Manage educational content and platform resources";
      subsections: ["Content Library", "Assessment Bank", "Resource Curation"];
      features: ["Content Approval", "Quality Assurance", "Version Control"];
    };
    institutionalInsights: {
      title: "Institutional Intelligence";
      description: "School and regional performance analytics";
      subsections: ["School Comparisons", "Regional Trends", "Impact Assessment"];
      reports: ["Academic Performance", "Career Outcomes", "System Utilization"];
    };
  };
}
```

### **3.4 LinkedIn-Style Admin Components**
*Executive admin profile components with Elimu Smart admin theme (text-violet-500)*

```typescript
// LinkedIn-Style Admin Header Component with Admin Theme
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, BarChart3, Settings, TrendingUp } from "lucide-react"

interface AdminProfile {
  adminId: string;
  name: string;
  position: string;
  institution: string;
  region: string;
  profileImage?: string;
  bannerImage?: string;
  adminLevel: 'Regional' | 'National' | 'Institutional' | 'Super Admin';
  specializations: string[];
  managedUsers: number;
  platformTenure: string;
  certifications: AdminCertification[];
  systemResponsibilities: string[];
  keyMetrics: AdminMetrics;
}

interface AdminMetrics {
  totalUsersManaged: number;
  systemUptimePercent: number;
  avgResponseTime: string;
  policiesImplemented: number;
  auditCompliance: number;
  dataInsightsGenerated: number;
}

export const LinkedInStyleAdminHeader: React.FC<{ profile: AdminProfile }> = ({
  profile
}) => {
  // Admin Theme Colors using Tailwind
  const adminTheme = {
    primary: 'bg-violet-500',
    primaryHover: 'hover:bg-violet-600',
    primaryText: 'text-violet-600',
    primaryBg: 'bg-violet-50',
    primaryBorder: 'border-violet-200',
    primaryLight: 'bg-violet-100',
    gradient: 'from-violet-500 via-violet-400 to-purple-500'
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="relative">
        {/* LinkedIn-style banner with admin gradient */}
        <div className={`h-48 bg-gradient-to-r ${adminTheme.gradient} relative overflow-hidden`}>
          {profile.bannerImage ? (
            <img 
              src={profile.bannerImage} 
              alt="Admin banner" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 opacity-90" />
          )}
          
          {/* Admin level indicator */}
          <div className="absolute top-4 right-4">
            <Badge className={`${adminTheme.primary} text-white font-semibold px-3 py-1`}>
              <Shield className="h-4 w-4 mr-1" />
              {profile.adminLevel}
            </Badge>
          </div>
        </div>
        
        {/* Profile picture positioned over banner - LinkedIn style */}
        <div className="absolute -bottom-16 left-6">
          <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
            <AvatarImage src={profile.profileImage} alt={profile.name} />
            <AvatarFallback className={`text-2xl font-bold ${adminTheme.primaryBg} ${adminTheme.primaryText}`}>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <CardContent className="pt-20 pb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h1>
            <p className="text-lg text-gray-700 mb-1">{profile.position}</p>
            <p className={`text-md font-medium ${adminTheme.primaryText} mb-2`}>
              {profile.institution} • {profile.region}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Managing {profile.managedUsers.toLocaleString()} users • {profile.platformTenure} with Elimu Smart
            </p>
            
            {/* Admin specializations */}
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.specializations.map((spec, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={`${adminTheme.primaryText} ${adminTheme.primaryBorder} border`}
                >
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
            <Button className={`${adminTheme.primary} ${adminTheme.primaryHover} text-white`} size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
        
        {/* Key admin metrics - LinkedIn info cards style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className={`p-3 rounded-lg ${adminTheme.primaryBg}`}>
            <div className="flex items-center gap-2 mb-1">
              <Users className={`h-4 w-4 ${adminTheme.primaryText}`} />
              <span className="text-sm font-medium text-gray-700">Users Managed</span>
            </div>
            <p className={`text-lg font-bold ${adminTheme.primaryText}`}>
              {profile.keyMetrics.totalUsersManaged.toLocaleString()}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${adminTheme.primaryBg}`}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`h-4 w-4 ${adminTheme.primaryText}`} />
              <span className="text-sm font-medium text-gray-700">System Uptime</span>
            </div>
            <p className={`text-lg font-bold ${adminTheme.primaryText}`}>
              {profile.keyMetrics.systemUptimePercent}%
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${adminTheme.primaryBg}`}>
            <div className="flex items-center gap-2 mb-1">
              <Shield className={`h-4 w-4 ${adminTheme.primaryText}`} />
              <span className="text-sm font-medium text-gray-700">Compliance</span>
            </div>
            <p className={`text-lg font-bold ${adminTheme.primaryText}`}>
              {profile.keyMetrics.auditCompliance}%
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${adminTheme.primaryBg}`}>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className={`h-4 w-4 ${adminTheme.primaryText}`} />
              <span className="text-sm font-medium text-gray-700">Insights Generated</span>
            </div>
            <p className={`text-lg font-bold ${adminTheme.primaryText}`}>
              {profile.keyMetrics.dataInsightsGenerated}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

#### **3.5 Admin System Responsibility Cards**
*LinkedIn-style responsibility management with admin theming*

```typescript
interface SystemResponsibility {
  responsibilityId: string;
  title: string;
  department: string;
  scope: 'Regional' | 'National' | 'Institutional';
  description: string;
  keyTasks: string[];
  impactMetrics: ResponsibilityMetrics;
  collaborators: AdminCollaborator[];
  systemsManaged: string[];
  duration: string;
}

interface ResponsibilityMetrics {
  usersImpacted: number;
  systemsOptimized: number;
  policyImplementations: number;
  complianceScore: number;
  efficiencyGains: string;
}

export const AdminResponsibilityCard: React.FC<{
  responsibility: SystemResponsibility
}> = ({
  responsibility
}) => {
  // Admin Theme Colors using Tailwind
  const adminTheme = {
    primaryText: 'text-violet-500',
    primaryBg: 'bg-violet-50',
    primaryLight: 'bg-violet-100',
    impactBg: 'bg-violet-100',
    impactText: 'text-violet-700'
  };

  return (
    <div className="flex gap-4 p-4 border-b last:border-b-0">
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarFallback className={`${adminTheme.primaryBg} ${adminTheme.primaryText} font-semibold`}>
          <Shield className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{responsibility.title}</h4>
        <p className={`font-medium ${adminTheme.primaryText}`}>{responsibility.department}</p>
        <p className="text-sm text-gray-500 mb-2">{responsibility.duration} • {responsibility.scope}</p>
        
        <p className="text-sm text-gray-600 mb-3">{responsibility.description}</p>
        
        {/* System Impact Highlight with admin theme */}
        <div className={`p-3 rounded-lg mb-3 ${adminTheme.impactBg}`}>
          <p className={`text-sm font-medium mb-1 ${adminTheme.impactText}`}>System Impact:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span className={adminTheme.impactText}>
              Users Impacted: {responsibility.impactMetrics.usersImpacted.toLocaleString()}
            </span>
            <span className={adminTheme.impactText}>
              Compliance: {responsibility.impactMetrics.complianceScore}%
            </span>
            <span className={adminTheme.impactText}>
              Systems Optimized: {responsibility.impactMetrics.systemsOptimized}
            </span>
            <span className={adminTheme.impactText}>
              Efficiency Gains: {responsibility.impactMetrics.efficiencyGains}
            </span>
          </div>
        </div>
        
        {/* Key Responsibilities */}
        {responsibility.keyTasks.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Key Responsibilities:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              {responsibility.keyTasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Systems Managed with admin theme */}
        <div className="flex flex-wrap gap-1">
          {responsibility.systemsManaged.map((system, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={`text-xs ${adminTheme.primaryBg} ${adminTheme.primaryText}`}
            >
              {system}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
```

#### **3.6 Admin Banner Templates**
*Executive-level banner templates with violet/purple gradients*

```typescript
// Admin banner templates with professional violet theme
const adminBannerTemplates: HeaderTemplate[] = [
  {
    templateId: 'system_governance',
    name: 'System Governance Leader',
    category: 'Executive Leadership',
    imageUrl: '/banners/admin-system-governance.jpg',
    colorScheme: {
      primary: 'text-violet-500',     // Elimu Smart Violet
      secondary: 'text-purple-600',   // Purple authority accent
      accent: 'text-white'
    },
    overlayText: 'Leading Digital Transformation in Education'
  },
  {
    templateId: 'data_analytics',
    name: 'Data Analytics Director',
    category: 'Executive Leadership',
    imageUrl: '/banners/admin-analytics.jpg',
    colorScheme: {
      primary: 'text-violet-500',     // Elimu Smart Violet
      secondary: 'text-indigo-600',   // Indigo analytics accent
      accent: 'text-white'
    },
    overlayText: 'Driving Insights for Educational Excellence'
  },
  {
    templateId: 'innovation_catalyst',
    name: 'Innovation Catalyst',
    category: 'Executive Leadership',
    imageUrl: '/banners/admin-innovation.jpg',
    colorScheme: {
      primary: 'text-violet-500',     // Elimu Smart Violet
      secondary: 'text-blue-600',     // Blue innovation accent
      accent: 'text-white'
    },
    overlayText: 'Innovating the Future of Education Technology'
  }
];
```

#### **3.7 Admin Analytics Dashboard Cards**
*LinkedIn-style analytics components with admin theming*

```typescript
interface AdminAnalyticsCard {
  metricId: string;
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  timeframe: string;
  description: string;
  drilldownActions: string[];
}

export const AdminMetricsCard: React.FC<{
  metrics: AdminAnalyticsCard[]
}> = ({
  metrics
}) => {
  // Admin Theme Colors using Tailwind
  const adminTheme = {
    primary: 'bg-violet-500',
    primaryText: 'text-violet-500',
    primaryBg: 'bg-violet-50',
    primaryBorder: 'border-violet-200',
    successBg: 'bg-violet-100',
    successText: 'text-violet-700',
    successBorder: 'border-violet-300'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className={`p-4 ${adminTheme.primaryBg} ${adminTheme.successBorder} border`}>
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-medium text-gray-700">{metric.title}</h4>
            <div className={`flex items-center gap-1 text-xs ${
              metric.trend === 'up' ? 'text-green-600' : 
              metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {metric.trend === 'up' && <TrendingUp className="h-3 w-3" />}
              {metric.trend === 'down' && <TrendingDown className="h-3 w-3" />}
              {metric.change}
            </div>
          </div>
          
          <div className={`text-2xl font-bold mb-1 ${adminTheme.primaryText}`}>
            {metric.value}
          </div>
          
          <p className="text-xs text-gray-600 mb-3">{metric.description}</p>
          <p className="text-xs text-gray-500">{metric.timeframe}</p>
          
          {/* Quick actions */}
          <div className="flex gap-1 mt-3">
            {metric.drilldownActions.slice(0, 2).map((action, idx) => (
              <Button 
                key={idx}
                variant="outline" 
                size="sm"
                className={`text-xs ${adminTheme.primaryText} ${adminTheme.primaryBorder} border`}
              >
                {action}
              </Button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
```

#### **3.8 Admin Certification & Skills Display**
*Professional admin qualifications with LinkedIn-style endorsements*

```typescript
interface AdminCertification {
  certificationId: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  skillsValidated: string[];
  verificationStatus: 'Verified' | 'Pending' | 'Expired';
  endorsements: AdminEndorsement[];
}

interface AdminSkillCategory {
  category: string;
  skills: AdminSkill[];
}

interface AdminSkill {
  skill: string;
  proficiencyLevel: 'Expert' | 'Advanced' | 'Intermediate';
  yearsExperience: number;
  systemsUsed: string[];
  endorsements: AdminEndorsement[];
  validationProjects: string[];
}

export const AdminSkillsSection: React.FC<{
  skillCategories: AdminSkillCategory[];
  onEndorse: (skillId: string) => void;
}> = ({
  skillCategories,
  onEndorse
}) => {
  // Admin Theme Colors using Tailwind
  const adminTheme = {
    primaryText: 'text-violet-500',
    primaryBg: 'bg-violet-50',
    primaryBorder: 'border-violet-200',
    primary: 'bg-violet-500',
    primaryHover: 'hover:bg-violet-600'
  };

  return (
    <div className="space-y-6">
      {skillCategories.map((category, catIndex) => (
        <div key={catIndex}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{category.category}</h3>
          <div className="space-y-4">
            {category.skills.map((skill, skillIndex) => (
              <div key={skillIndex} className={`flex items-center justify-between p-3 rounded-lg ${adminTheme.primaryBg}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{skill.skill}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${adminTheme.primaryText} ${adminTheme.primaryBorder} border`}
                    >
                      {skill.proficiencyLevel}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {skill.yearsExperience}+ years
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Systems: {skill.systemsUsed.join(', ')}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={adminTheme.primaryText}>{skill.endorsements.length} endorsements</span>
                    {skill.endorsements.length > 0 && (
                      <span>• Latest: {skill.endorsements[0]?.endorserName}</span>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEndorse(skill.skill)}
                  className={`${adminTheme.primaryText} ${adminTheme.primaryBorder} border`}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Endorse
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## 📊 Checkpoint Progression System

### 4. **Student Journey Checkpoints**

#### **4.1 Academic Progression Checkpoints**
```typescript
interface AcademicCheckpoint {
  checkpointId: string;
  level: 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4' | 'University';
  title: string;
  description: string;
  requirements: CheckpointRequirement[];
  rewards: CheckpointReward[];
  unlocks: string[];
  estimatedTimeToComplete: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
}

const academicCheckpoints: AcademicCheckpoint[] = [
  {
    checkpointId: "form1_foundation",
    level: "Form 1",
    title: "Foundation Builder",
    description: "Master fundamental subjects and establish study habits",
    requirements: [
      { type: "grade_average", subject: "Mathematics", minimum: 70 },
      { type: "grade_average", subject: "English", minimum: 70 },
      { type: "grade_average", subject: "Kiswahili", minimum: 70 },
      { type: "study_habits", completed: true },
      { type: "goal_setting", completed: true }
    ],
    rewards: [
      { type: "badge", name: "Foundation Master", points: 100 },
      { type: "unlock", feature: "Advanced Study Tools" },
      { type: "recognition", level: "Bronze Academic Achievement" }
    ],
    unlocks: ["subject_specialization_explorer", "advanced_goal_setting"],
    estimatedTimeToComplete: "1 academic term",
    difficultyLevel: 2
  },
  {
    checkpointId: "form2_explorer",
    level: "Form 2",
    title: "Subject Explorer",
    description: "Explore diverse subjects and identify strengths",
    requirements: [
      { type: "subject_exploration", minimumSubjects: 8 },
      { type: "interest_assessment", completed: true },
      { type: "extracurricular_participation", minimum: 2 },
      { type: "peer_collaboration", projectsCompleted: 3 }
    ],
    rewards: [
      { type: "badge", name: "Knowledge Explorer", points: 150 },
      { type: "unlock", feature: "Career Interest Mapper" },
      { type: "mentorship", access: "Subject Specialists" }
    ],
    unlocks: ["career_exploration_tools", "specialist_subject_tracks"],
    estimatedTimeToComplete: "1.5 academic terms",
    difficultyLevel: 3
  }
];
```

#### **4.2 Career Discovery Checkpoints**
```typescript
interface CareerDiscoveryCheckpoint {
  checkpointId: string;
  category: 'Interest' | 'Skills' | 'Values' | 'Experience' | 'Planning';
  title: string;
  description: string;
  activities: CheckpointActivity[];
  assessments: Assessment[];
  outcomes: LearningOutcome[];
  prerequisites: string[];
  followUpActions: FollowUpAction[];
}

const careerDiscoveryCheckpoints: CareerDiscoveryCheckpoint[] = [
  {
    checkpointId: "interest_discovery",
    category: "Interest",
    title: "Career Interest Explorer",
    description: "Discover and validate your career interests through systematic exploration",
    activities: [
      {
        type: "assessment",
        name: "Holland Interest Inventory",
        duration: "20 minutes",
        description: "Identify your primary interest areas using the RIASEC model"
      },
      {
        type: "exploration",
        name: "Career Field Investigation",
        duration: "2 hours",
        description: "Research 3 career fields aligned with your interests"
      },
      {
        type: "interview",
        name: "Professional Conversations",
        duration: "1 hour",
        description: "Conduct informational interviews with professionals"
      }
    ],
    assessments: [
      { name: "Interest Inventory", weight: 40 },
      { name: "Research Quality", weight: 30 },
      { name: "Professional Interview", weight: 30 }
    ],
    outcomes: [
      "Identified top 3 career interest areas",
      "Understand daily work in chosen fields",
      "Connected with industry professionals",
      "Developed career exploration skills"
    ],
    prerequisites: ["profile_completion", "academic_foundation"],
    followUpActions: [
      { action: "Skills Gap Analysis", timeline: "Within 2 weeks" },
      { action: "Experience Planning", timeline: "Within 1 month" },
      { action: "Mentor Matching", timeline: "Within 3 weeks" }
    ]
  }
];
```

### 5. **Counselor Impact Checkpoints**

#### **5.1 Professional Development Checkpoints**
```typescript
interface CounselorCheckpoint {
  checkpointId: string;
  competencyArea: 'Assessment' | 'Intervention' | 'Program Management' | 'Data Analysis' | 'Professional Leadership';
  title: string;
  description: string;
  proficiencyLevel: 'Developing' | 'Proficient' | 'Advanced' | 'Expert';
  requirements: ProfessionalRequirement[];
  evidence: EvidenceRequirement[];
  studentImpactMetrics: ImpactMetric[];
  professionalGrowth: GrowthIndicator[];
}

const counselorCheckpoints: CounselorCheckpoint[] = [
  {
    checkpointId: "data_driven_counselor",
    competencyArea: "Data Analysis",
    title: "Data-Driven Counseling Expert",
    description: "Master the use of data to inform counseling decisions and measure student outcomes",
    proficiencyLevel: "Advanced",
    requirements: [
      {
        type: "training_completion",
        program: "Advanced Data Analysis in School Counseling",
        hours: 40,
        certification: true
      },
      {
        type: "practical_application",
        description: "Implement data-driven interventions with 15+ students",
        timeline: "6 months",
        successCriteria: "Measurable improvement in 80% of cases"
      },
      {
        type: "program_evaluation",
        description: "Design and evaluate counseling program effectiveness",
        scope: "School-wide program",
        metrics: ["participation rates", "outcome measures", "satisfaction scores"]
      }
    ],
    evidence: [
      { type: "portfolio", items: ["Data analysis reports", "Intervention plans", "Outcome summaries"] },
      { type: "presentation", audience: "Professional peers", topic: "Data-driven counseling outcomes" },
      { type: "peer_review", reviewers: 3, focus: "Professional competency" }
    ],
    studentImpactMetrics: [
      { metric: "Academic improvement", target: "20% increase in student goal achievement" },
      { metric: "Engagement increase", target: "30% improvement in counseling session attendance" },
      { metric: "Early intervention", target: "50% reduction in crisis interventions through predictive data" }
    ],
    professionalGrowth: [
      { area: "Data literacy", growth: "Expert level proficiency" },
      { area: "Evidence-based practice", growth: "Research-informed decision making" },
      { area: "Professional leadership", growth: "Mentor to developing counselors" }
    ]
  }
];
```

---

## 🏆 Badge & Gamification System

### 6. **Student Achievement Badges**

#### **6.1 Academic Excellence Badges**
```typescript
interface AchievementBadge {
  badgeId: string;
  category: 'Academic' | 'Career' | 'Personal' | 'Leadership' | 'Service';
  name: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  points: number;
  requirements: BadgeRequirement[];
  rewards: BadgeReward[];
  displayProperties: BadgeDisplay;
}

const studentBadges: AchievementBadge[] = [
  {
    badgeId: "academic_excellence_gold",
    category: "Academic",
    name: "Academic Excellence Gold",
    description: "Maintain exceptional academic performance across all subjects",
    icon: "🏆",
    rarity: "Epic",
    points: 500,
    requirements: [
      { type: "gpa_maintenance", value: 3.8, duration: "1 full academic year" },
      { type: "subject_mastery", subjects: ["Mathematics", "English", "Sciences"], level: "Advanced" },
      { type: "leadership_demonstration", activities: 2, role: "Academic peer tutor" }
    ],
    rewards: [
      { type: "recognition", level: "School-wide announcement" },
      { type: "privilege", access: "Advanced learning resources" },
      { type: "mentorship", opportunity: "University student mentor" },
      { type: "scholarship", eligibility: "Academic excellence programs" }
    ],
    displayProperties: {
      backgroundColor: "bg-yellow-300",
      borderColor: "border-yellow-600",
      animation: "shimmer",
      displayOrder: 1
    }
  },
  {
    badgeId: "career_pioneer",
    category: "Career",
    name: "Career Pioneer",
    description: "Complete comprehensive career exploration and planning",
    icon: "🗺️",
    rarity: "Rare",
    points: 300,
    requirements: [
      { type: "career_assessments", completed: 5, validated: true },
      { type: "industry_exploration", sectors: 3, depth: "Professional interviews" },
      { type: "skill_development", plan: "Created and following 6-month plan" },
      { type: "experience_gain", hours: 40, type: "Work experience or shadowing" }
    ],
    rewards: [
      { type: "certification", document: "Career Readiness Certificate" },
      { type: "network_access", level: "Industry professional network" },
      { type: "resources", access: "Premium career planning tools" }
    ],
    displayProperties: {
      backgroundColor: "bg-blue-600",
      borderColor: "border-blue-800",
      animation: "pulse",
      displayOrder: 2
    }
  }
];
```

#### **6.2 Progressive Badge Series**
```typescript
interface BadgeSeries {
  seriesId: string;
  name: string;
  description: string;
  badges: ProgressiveBadge[];
  completionReward: SeriesReward;
}

interface ProgressiveBadge {
  level: number;
  name: string;
  requirement: string;
  points: number;
  icon: string;
}

const progressiveBadgeSeries: BadgeSeries[] = [
  {
    seriesId: "goal_achiever_series",
    name: "Goal Achiever Series",
    description: "Progressive recognition for consistent goal achievement",
    badges: [
      {
        level: 1,
        name: "Goal Setter",
        requirement: "Set and achieve 3 personal goals",
        points: 50,
        icon: "🎯"
      },
      {
        level: 2,
        name: "Goal Crusher",
        requirement: "Set and achieve 10 personal goals",
        points: 100,
        icon: "💥"
      },
      {
        level: 3,
        name: "Goal Master",
        requirement: "Set and achieve 25 personal goals with 90% success rate",
        points: 200,
        icon: "⭐"
      },
      {
        level: 4,
        name: "Goal Legend",
        requirement: "Mentor 5 other students in goal achievement",
        points: 400,
        icon: "👑"
      }
    ],
    completionReward: {
      type: "special_recognition",
      title: "Goal Achievement Ambassador",
      privileges: ["Goal-setting workshop leadership", "Peer mentoring authorization"],
      certificateAwarded: true
    }
  }
];
```

---

## 🔧 ShadCN Component Implementation Strategy

### 7. **Token Optimization Through ShadCN Components**

#### **7.1 Profile Builder Components**
**Traditional Approach:** 4000 tokens per component  
**ShadCN Optimized:** 1000 tokens per component (75% reduction)

```typescript
// ShadCN Optimized Counselor Quick Setup Component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle, Clock } from "lucide-react"

interface CounselorQuickSetupProps {
  currentStep: number;
  totalSteps: number;
  completionPercentage: number;
  onStepComplete: (stepData: StepData) => void;
  onImportResume: () => void;
}

export const CounselorQuickSetup: React.FC<CounselorQuickSetupProps> = ({
  currentStep,
  totalSteps,
  completionPercentage,
  onStepComplete,
  onImportResume
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Professional Profile Setup</CardTitle>
            <CardDescription>Complete your profile in under 15 minutes</CardDescription>
          </div>
          <Badge variant="outline">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>
        <Progress value={completionPercentage} className="w-full" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentStep === 1 && (
            <EssentialCredentialsStep 
              onImportResume={onImportResume}
              onComplete={onStepComplete}
            />
          )}
          {currentStep === 2 && (
            <ServiceSpecializationStep onComplete={onStepComplete} />
          )}
          {currentStep === 3 && (
            <StandardsComplianceStep onComplete={onStepComplete} />
          )}
          {currentStep === 4 && (
            <WorkingPreferencesStep onComplete={onStepComplete} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Essential Credentials Step Component
const EssentialCredentialsStep: React.FC<EssentialCredentialsStepProps> = ({
  onImportResume,
  onComplete
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-6">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <Button onClick={onImportResume} variant="outline">
            Import from LinkedIn/Resume
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            Or fill out manually below
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Primary Degree</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select your degree field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="counseling-psychology">Counseling Psychology</SelectItem>
              <SelectItem value="school-counseling">School Counseling</SelectItem>
              <SelectItem value="clinical-psychology">Clinical Psychology</SelectItem>
              <SelectItem value="social-work">Social Work</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium">Professional License</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select license type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lpc">Licensed Professional Counselor</SelectItem>
              <SelectItem value="school-counselor">School Counselor License</SelectItem>
              <SelectItem value="mft">Marriage Family Therapist</SelectItem>
              <SelectItem value="lcsw">Clinical Social Worker</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button onClick={() => onComplete()} className="w-full">
        Continue to Specializations
      </Button>
    </div>
  );
};
```

**Student Profile Components (Simplified)**
```typescript
// ShadCN Optimized Student Profile Section Component
interface StudentProfileSectionProps {
  title: string;
  description: string;
  completionPercentage: number;
  sections: ProfileSubSection[];
  isOptional?: boolean;
}

export const StudentProfileSection: React.FC<StudentProfileSectionProps> = ({
  title,
  description,
  completionPercentage,
  sections,
  isOptional = false
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              {title}
              {isOptional && <Badge variant="secondary">Optional</Badge>}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {completionPercentage === 100 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Clock className="h-5 w-5 text-yellow-500" />
            )}
            <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
              {completionPercentage}% Complete
            </Badge>
          </div>
        </div>
        <Progress value={completionPercentage} className="w-full" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <ProfileSubSectionCard 
              key={section.id} 
              section={section}
              canSkip={isOptional}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
```

#### **7.2 Checkpoint Progress Components**
```typescript
// ShadCN Optimized Checkpoint Component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Clock } from "lucide-react"

interface CheckpointCardProps {
  checkpoint: Checkpoint;
  status: 'completed' | 'in-progress' | 'locked';
  progress: number;
  onClick: (checkpointId: string) => void;
}

export const CheckpointCard: React.FC<CheckpointCardProps> = ({
  checkpoint,
  status,
  progress,
  onClick
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        status === 'locked' ? 'opacity-50' : ''
      }`}
      onClick={() => status !== 'locked' && onClick(checkpoint.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{checkpoint.title}</CardTitle>
          {getStatusIcon()}
        </div>
        <Badge variant="outline" className="w-fit">
          {checkpoint.category}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{checkpoint.description}</p>
        {status !== 'locked' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

#### **7.3 Badge Display Components**
```typescript
// ShadCN Optimized Badge Gallery Component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BadgeGalleryProps {
  badges: AchievementBadge[];
  earnedBadges: string[];
  categories: string[];
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({
  badges,
  earnedBadges,
  categories
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Achievement Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {badges
                  .filter(badge => badge.category === category)
                  .map((badge) => (
                    <BadgeCard 
                      key={badge.badgeId}
                      badge={badge}
                      earned={earnedBadges.includes(badge.badgeId)}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
```

---

## 📈 Value Delivery Assessment

### 8. **Measurable Outcomes by User Type**

#### **8.1 Student Value Delivery**
```typescript
interface StudentValueMetrics {
  engagementMetrics: {
    profileCompletionRate: number; // Target: 90%
    checkpointProgressionRate: number; // Target: 85%
    sessionDuration: number; // Target: 25+ minutes
    returnVisitFrequency: number; // Target: 3+ times per week
  };
  academicOutcomes: {
    goalAchievementRate: number; // Target: 80%
    gradeImprovement: number; // Target: 15% increase
    subjectMasteryProgression: number; // Target: 2+ levels per term
    universityReadinessScore: number; // Target: 85+
  };
  careerReadiness: {
    careerExplorationDepth: number; // Target: 5+ industries explored
    skillDevelopmentProgress: number; // Target: 10+ skills developed
    experienceAccumulation: number; // Target: 100+ hours
    mentorshipConnections: number; // Target: 3+ mentors
  };
  satisfactionMetrics: {
    platformUtilityRating: number; // Target: 4.5+/5
    recommendationLikelihood: number; // Target: 9+/10 NPS
    perceivedValueDelivery: number; // Target: 90%+ positive
    supportQualityRating: number; // Target: 4.7+/5
  };
}
```

#### **8.2 Counselor Value Delivery**
```typescript
interface CounselorValueMetrics {
  efficiencyGains: {
    caseloadManagementTime: number; // Target: 30% reduction
    reportGenerationTime: number; // Target: 50% reduction
    studentProgressTracking: number; // Target: 40% improvement
    interventionPlanningTime: number; // Target: 25% reduction
  };
  studentOutcomes: {
    studentGoalAchievement: number; // Target: 85% student success rate
    earlyInterventionSuccess: number; // Target: 70% prevention rate
    parentEngagementRate: number; // Target: 80% participation
    collegeReadinessImprovement: number; // Target: 25% increase
  };
  professionalDevelopment: {
    competencyGrowth: number; // Target: 20% annual improvement
    evidenceBasedPracticeAdoption: number; // Target: 95% implementation
    collaborationEffectiveness: number; // Target: 90% peer rating
    leadershipCapabilityGrowth: number; // Target: 15% annual increase
  };
  systemImpact: {
    programEffectivenessImprovement: number; // Target: 30% outcome improvement
    dataDrivenDecisionMaking: number; // Target: 95% decisions backed by data
    schoolwideInitiativeSuccess: number; // Target: 80% successful implementation
    professionalRecognition: number; // Target: Regional recognition
  };
}
```

---

## 🚀 Implementation Roadmap

### 9. **15-Day Sprint Execution Plan**

#### **Days 1-3: Foundation & Architecture**
- **Day 1:** ShadCN component library setup and theme integration
- **Day 2:** TypeScript interfaces and data models implementation
- **Day 3:** Basic profile builder structure and navigation framework

#### **Days 4-6: Student Competence Showcase System**
- **Day 4:** Quick competence builder wizard with dropdown selections
- **Day 5:** Visual dashboard and achievement timeline generation
- **Day 6:** Shareable portfolio system and competence cards

#### **Days 7-9: Counselor Professional Profile System**
- **Day 7:** Quick setup wizard with credential import functionality
- **Day 8:** Automated impact tracking and service delivery metrics
- **Day 9:** Professional standards compliance and development tracking

#### **Days 10-12: Checkpoint & Badge System**
- **Day 10:** Checkpoint progression logic and UI components
- **Day 11:** Badge system implementation and gamification
- **Day 12:** Progress tracking and achievement notifications

#### **Days 13-15: Integration & Testing**
- **Day 13:** Theme integration and role-based navigation
- **Day 14:** Data integration and API connections
- **Day 15:** Testing, optimization, and documentation

---

## 🎯 Success Criteria

### 10. **Sprint Completion Metrics**

#### **Technical Success Criteria**
- ✅ 100% ShadCN component integration (75% token savings achieved)
- ✅ Complete TypeScript interface implementation
- ✅ Responsive design across all device types
- ✅ Role-based theming fully functional
- ✅ Real-time progress tracking operational

#### **User Experience Success Criteria**
- ✅ Profile completion rate >90% for both user types
- ✅ Navigation efficiency improvement >40%
- ✅ User satisfaction rating >4.5/5
- ✅ Checkpoint engagement rate >85%
- ✅ Badge earning rate >70%

#### **Value Delivery Success Criteria**
- ✅ Student goal achievement improvement >20%
- ✅ Counselor efficiency gains >30%
- ✅ Platform engagement increase >50%
- ✅ User retention improvement >40%
- ✅ Professional development progress >15%

---

## 📋 Next Steps Post-Sprint

### 11. **Continuous Improvement Plan**

#### **Advanced Features Pipeline**
1. **AI-Powered Recommendations:** Intelligent suggestions based on profile data
2. **Predictive Analytics:** Early warning systems for academic and career risks
3. **Advanced Collaboration Tools:** Enhanced peer-to-peer and mentor connections
4. **Mobile Application:** Native mobile experience for on-the-go access
5. **Integration Ecosystem:** Connections with external educational and career platforms

#### **Optimization Opportunities**
1. **Performance Enhancement:** Further optimization of load times and responsiveness
2. **Accessibility Improvements:** Enhanced support for users with disabilities
3. **Internationalization:** Multi-language support for diverse user base
4. **Advanced Analytics:** Deeper insights into user behavior and outcomes
5. **Automation Enhancement:** Increased automation of routine tasks and processes

This comprehensive Sprint 20 plan establishes a robust foundation for themed user experience excellence while delivering significant value to both students and guidance counselors through optimized profile builder systems and engaging checkpoint progression.
