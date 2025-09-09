import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StudentDashboardCards from '../cards/StudentDashboardCards';
import StudentAssessmentCards from '../cards/StudentAssessmentCards';
import StudentGuidanceCards from '../cards/StudentGuidanceCards';

const StudentDashboard: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8 pb-6 sm:pb-8 px-4 sm:px-0">
      
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Welcome to Your Dashboard</h1>
        <p className="text-muted-foreground">Track your academic progress and career development</p>
      </div>

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
          <Button asChild variant="outline" className="hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300">
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
          <Button asChild variant="outline" className="hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300">
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