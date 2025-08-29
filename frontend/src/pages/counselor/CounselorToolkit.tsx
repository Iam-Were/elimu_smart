import React from 'react';
import { 
  MessageCircle, 
  Users, 
  Calendar,
  BarChart3,
  FileText,
  BookOpen,
  Target,
  Clock,
  UserCheck,
  Lightbulb,
  Heart,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CounselorToolkit: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Counselor Golden Hero Section */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Career Counselor Toolkit
              </h1>
              <p className="text-yellow-100 mb-6 text-lg leading-relaxed">
                Professional counseling tools designed to help you guide students 
                effectively through their career discovery journey and educational planning.
              </p>
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold">2,500+</div>
                  <div className="text-yellow-200 text-sm">Students Counseled</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-yellow-200 text-sm">Success Rate</div>
                </div>
              </div>
            </div>
            
            {/* Right Dashboard Preview */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-48 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Active Sessions</div>
                    <div className="text-yellow-200 text-sm">12 students today</div>
                  </div>
                </div>
                
                {/* Session Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200 text-sm">Today's Progress</span>
                    <span className="text-white font-medium">8/12</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: '67%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200 text-sm">Pending Questions</span>
                    <span className="text-white font-medium text-sm">23</span>
                  </div>
                </div>
                
                {/* Quick Action Button */}
                <button 
                  onClick={() => navigate('/counselor/sessions')}
                  className="w-full mt-4 bg-white text-yellow-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  View Sessions →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Counselor Tools Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="h-4 w-4" />
            <span>Counseling Tools</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Professional Counseling Resources
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools to support your counseling practice and help students 
            make informed decisions about their educational and career futures.
          </p>
        </div>
        
        {/* Primary Counselor Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Student Management */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Student Management</h3>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Comprehensive student profiles, progress tracking, and case management 
                tools for effective counseling workflows.
              </p>
              
              <div className="space-y-2 mb-6 text-left w-full">
                <div className="text-xs text-gray-500 text-center mb-3">Features:</div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Student Profiles</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Progress Tracking</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Case Notes</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 mb-6 bg-yellow-50 py-2 px-3 rounded-lg">
                👨‍🎓 2,500+ Active Students
              </div>
              
              <button 
                onClick={() => navigate('/counselor/students')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Manage Students →
              </button>
            </div>
          </div>
          
          {/* Session Scheduling */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Session Management</h3>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Schedule, manage, and track counseling sessions with integrated 
                calendar and automated reminder systems.
              </p>
              
              <div className="space-y-2 mb-6 text-left w-full">
                <div className="text-xs text-gray-500 text-center mb-3">Capabilities:</div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Appointment Booking</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Calendar Integration</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Automated Reminders</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 mb-6 bg-blue-50 py-2 px-3 rounded-lg">
                📅 Smart Scheduling
              </div>
              
              <button 
                onClick={() => navigate('/counselor/sessions')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Schedule Sessions →
              </button>
            </div>
          </div>
          
          {/* Q&A Management */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Q&A Management</h3>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Manage student questions, provide expert answers, and build a 
                knowledge base for common career guidance topics.
              </p>
              
              <div className="space-y-2 mb-6 text-left w-full">
                <div className="text-xs text-gray-500 text-center mb-3">Tools:</div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Question Queue</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Expert Responses</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Knowledge Base</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 mb-6 bg-green-50 py-2 px-3 rounded-lg">
                💬 Live Q&A Support
              </div>
              
              <button 
                onClick={() => navigate('/counselor/questions')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Answer Questions →
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Counselor Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Analytics Dashboard */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Counseling Analytics</h4>
              <p className="text-sm text-gray-600 mb-4">Track your counseling impact and effectiveness</p>
              <button 
                onClick={() => navigate('/counselor/analytics')}
                className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
              >
                View Analytics →
              </button>
            </div>
          </div>

          {/* Group Sessions */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <UserCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Group Sessions</h4>
              <p className="text-sm text-gray-600 mb-4">Organize and manage group counseling sessions</p>
              <button 
                onClick={() => navigate('/counselor/group-sessions')}
                className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
              >
                Manage Groups →
              </button>
            </div>
          </div>

          {/* Resource Library */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Resource Library</h4>
              <p className="text-sm text-gray-600 mb-4">Access counseling resources and materials</p>
              <button 
                onClick={() => navigate('/counselor/resources')}
                className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
              >
                Browse Resources →
              </button>
            </div>
          </div>

          {/* Assessment Tools */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Assessment Tools</h4>
              <p className="text-sm text-gray-600 mb-4">Career assessment and evaluation tools</p>
              <button 
                onClick={() => navigate('/counselor/assessments')}
                className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
              >
                Access Tools →
              </button>
            </div>
          </div>

        </div>

        {/* Counseling Insights Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Counseling Impact & Insights
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key metrics and insights about your counseling effectiveness, student progress, 
              and impact on career decision-making.
            </p>
          </div>
          
          {/* Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sessions This Month</h4>
              <div className="text-2xl font-bold text-yellow-600 mb-1">127</div>
              <p className="text-sm text-gray-600">+15% from last month</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Success Rate</h4>
              <div className="text-2xl font-bold text-green-600 mb-1">94%</div>
              <p className="text-sm text-gray-600">Students satisfied</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Avg. Session Time</h4>
              <div className="text-2xl font-bold text-blue-600 mb-1">45m</div>
              <p className="text-sm text-gray-600">Optimal duration</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Q&A Responses</h4>
              <div className="text-2xl font-bold text-purple-600 mb-1">89</div>
              <p className="text-sm text-gray-600">Questions answered</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Support More Students?</h3>
            <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
              Access your comprehensive counseling dashboard to manage sessions, track student progress, and make a lasting impact.
            </p>
            <button 
              onClick={() => navigate('/counselor/sessions')}
              className="bg-white text-yellow-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Start Counseling Session →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorToolkit;