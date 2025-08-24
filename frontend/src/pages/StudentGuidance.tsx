import React from 'react';
import { 
  Target, 
  BookOpen, 
  MessageCircle,
  TrendingUp,
  GraduationCap,
  Award,
  Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentGuidance: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
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
                    <span className="text-white font-medium">75%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
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

      {/* AI-Powered Career Discovery Tools Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Brain className="h-4 w-4" />
<span>Student Guidance</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Career Discovery Tool
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our advanced tools use artificial intelligence to provide personalized career 
            guidance tailored specifically for Kenyan students.
          </p>
        </div>
        
        {/* Tools Grid - Matching Design Reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Tool 1 - Career Exploration Quiz */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group text-center">
            <div className="flex flex-col items-center">
              {/* Icon with background */}
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Exploration Quiz</h3>
              
              {/* Description */}
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Take our comprehensive assessment to identify career paths that match your 
                interests, skills, and personality.
              </p>
              
              {/* Features List */}
              <div className="space-y-2 mb-6 text-left w-full">
                <div className="text-xs text-gray-500 text-center mb-3">What you'll discover:</div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">Personality Analysis</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">Interest Mapping</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">Career Matching</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="text-center text-sm text-gray-500 mb-6 bg-orange-50 py-2 px-3 rounded-lg">
                📊 15 minutes • Interactive
              </div>
              
              {/* Action Button */}
              <button 
                onClick={() => navigate('/assessment')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Take Assessment →
              </button>
            </div>
          </div>
          
          {/* Tool 2 - Subject-to-Career Mapper */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group text-center">
            <div className="flex flex-col items-center">
              {/* Icon with background */}
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <BookOpen className="h-8 w-8 text-teal-600" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Subject-to-Career Mapper</h3>
              
              {/* Description */}
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                See how your current subjects align with various career opportunities 
                and discover connections to exciting career paths in the Kenyan job market.
              </p>
              
              {/* Features List */}
              <div className="space-y-2 mb-6 text-left w-full">
                <div className="text-xs text-gray-500 text-center mb-3">What you'll discover:</div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700">Subject Strengths</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700">Career Pathways</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700">Education Routes</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="text-center text-sm text-gray-500 mb-6 bg-teal-50 py-2 px-3 rounded-lg">
                🔗 Explore Connections
              </div>
              
              {/* Action Button */}
              <button 
                onClick={() => navigate('/subject-mapper')}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Explore Connections →
              </button>
            </div>
          </div>
          
          {/* Tool 3 - Ask a Career Counselor */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group text-center">
            <div className="flex flex-col items-center">
              {/* Icon with background */}
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ask a Career Counselor</h3>
              
              {/* Description */}
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Get personalized advice from experienced career counselors who understand 
                the Kenyan education system and job market.
              </p>
              
              {/* Features List */}
              <div className="space-y-2 mb-6 text-left w-full">
                <div className="text-xs text-gray-500 text-center mb-3">What you'll get:</div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Expert Guidance</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Personalized Advice</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Study Strategies</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="text-center text-sm text-gray-500 mb-6 bg-blue-50 py-2 px-3 rounded-lg">
                💬 Real-time Support
              </div>
              
              {/* Action Button */}
              <button 
                onClick={() => navigate('/counselor')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Ask Question →
              </button>
            </div>
          </div>
        </div>

        {/* Additional Resources Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Career Information & Resources
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive information about careers, education pathways, and essential skills 
              for success in the Kenyan job market.
            </p>
          </div>
          
          {/* Resource Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Career Spotlight</h4>
              <p className="text-sm text-gray-600 mb-4">
                Discover in-depth profiles of careers relevant to Kenyan students.
              </p>
              <div className="text-xs text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full inline-block">
                Preview: Featured Software Engineer, Doctor, Teacher
              </div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Pathways to Success</h4>
              <p className="text-sm text-gray-600 mb-4">
                Learn about different educational routes after secondary school.
              </p>
              <div className="text-xs text-purple-700 bg-purple-100 px-3 py-1 rounded-full inline-block">
                Preview: University, TVET, Entrepreneurship, International Study
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Skills for the Future</h4>
              <p className="text-sm text-gray-600 mb-4">
                Essential skills that will be valuable in tomorrow's job market.
              </p>
              <div className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block">
                Preview: Digital Literacy, Communication, Critical Thinking
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Career Journey?</h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Take the first step towards discovering your ideal career path with our comprehensive assessment.
            </p>
            <button 
              onClick={() => navigate('/assessment')}
              className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Start Career Assessment Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGuidance;