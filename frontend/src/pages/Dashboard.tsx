import React from 'react';
import { 
  Target, 
  BookOpen, 
  MessageCircle, 
  ExternalLink,
  ArrowRight,
  GraduationCap,
  Code,
  Calendar,
  Search,
  FileText,
  Check,
  X,
  TrendingUp
} from 'lucide-react';
// import { useAuth } from '../hooks/useAuth'; // Removed unused import
import { useNavigate } from 'react-router-dom';

interface DashboardPageProps {
  className?: string;
}

// Mock user data - replace with real data from context/API
const mockUserData = {
  name: 'Alex Mwangi',
  profileCompletion: 85,
  assessmentProgress: 75,
  careersExplored: 12,
  counselorSessions: 3
};

// Mock applications data
const mockApplications = [
  {
    id: 1,
    title: 'University of Nairobi - Computer Science',
    description: 'Applied 2 days ago',
    status: 'pending',
    icon: GraduationCap
  },
  {
    id: 2, 
    title: 'KCA University - Software Engineering',
    description: 'Applied 1 week ago', 
    status: 'accepted',
    icon: Code
  }
];

// Mock upcoming events
const mockEvents = [
  {
    id: 1,
    title: 'Career Fair - Tech Careers',
    time: 'Tomorrow, 2:00 PM',
    type: 'event'
  },
  {
    id: 2,
    title: 'Counselor Session',
    time: 'Friday, 10:00 AM',
    type: 'session'
  }
];

const DashboardPage: React.FC<DashboardPageProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      
      {/* Enhanced Blue Hero Section matching design reference */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Discover Your Perfect Career Path
              </h1>
              <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                Use our comprehensive suite of AI-driven tools to explore careers, 
                understand your strengths, and plan your educational journey with 
                confidence.
              </p>
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold">70K+</div>
                  <div className="text-blue-200 text-sm">Career Options</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">15K+</div>
                  <div className="text-blue-200 text-sm">Students Guided</div>
                </div>
              </div>
            </div>
            
            {/* Right Image Area */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-48 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Career Assessment</div>
                    <div className="text-blue-200 text-sm">Discover your strengths</div>
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Assessment Progress</span>
                    <span className="text-white font-medium">{mockUserData.assessmentProgress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${mockUserData.assessmentProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Action Button */}
                <button 
                  onClick={() => navigate('/assessment')}
                  className="w-full mt-4 bg-white text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Continue Assessment →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Enhanced Progress Overview Card with Gradient */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-gradient-primary border border-orange-200 dark:border-gray-700 p-6 gradient-card-subtle">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 gradient-primary rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Your Progress
                  </h2>
                </div>
                <button className="inline-flex items-center text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
              
              {/* Progress Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center group">
                  <div className="h-16 w-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-gradient-primary group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gradient-primary dark:text-gray-100">
                    {mockUserData.assessmentProgress}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Assessment Complete</div>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {mockUserData.careersExplored}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Careers Explored</div>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {mockUserData.counselorSessions}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Counselor Sessions</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                  <span className="text-orange-600 font-medium">{mockUserData.profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${mockUserData.profileCompletion}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Recent Applications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Recent Applications
                </h2>
                <button className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-orange-600 transition-colors duration-200">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {mockApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        application.status === 'accepted' 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : 'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        <application.icon className={`h-5 w-5 ${
                          application.status === 'accepted' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {application.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {application.description}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      application.status === 'accepted' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {application.status === 'accepted' ? 'Accepted' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/assessment')}
                  className="w-full flex items-center justify-start px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <Target className="mr-3 h-4 w-4" />
                  Continue Assessment
                </button>
                <button 
                  onClick={() => navigate('/counselor-sessions')}
                  className="w-full flex items-center justify-start px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <Calendar className="mr-3 h-4 w-4" />
                  Book Counselor Session
                </button>
                <button 
                  onClick={() => navigate('/career-hub')}
                  className="w-full flex items-center justify-start px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <Search className="mr-3 h-4 w-4" />
                  Explore Careers
                </button>
                <button 
                  onClick={() => navigate('/kuccps-tracker')}
                  className="w-full flex items-center justify-start px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <FileText className="mr-3 h-4 w-4" />
                  Track KUCCPS Status
                </button>
              </div>
            </div>
            
            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {mockEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      event.type === 'event' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Profile Completion
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-orange-600">{mockUserData.profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${mockUserData.profileCompletion}%` }}
                  ></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Basic info completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Assessment in progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <X className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Documents not uploaded</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default DashboardPage;