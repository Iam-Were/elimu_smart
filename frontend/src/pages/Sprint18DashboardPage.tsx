import React, { useEffect } from 'react';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import { useDynamicDashboard } from '../hooks/useDynamicDashboard';

const Sprint18DashboardPage: React.FC = () => {
  const { logActivity } = useDynamicDashboard();
  const pageLoadTime = Date.now();
  
  // Track page visit on mount
  useEffect(() => {
    logActivity('page_visit', {
      page: 'dashboard',
      section: 'student_dashboard',
      timestamp: new Date().toISOString()
    });

    // Track page duration on unmount
    return () => {
      const duration = Date.now() - pageLoadTime;
      logActivity('page_duration', {
        page: 'dashboard',
        duration: Math.round(duration / 1000), // duration in seconds
        timeSpent: duration
      });
    };
  }, [logActivity, pageLoadTime]);
  
  return (
    <div className="py-8">
      <StudentDashboard />
    </div>
  );
};

export default Sprint18DashboardPage;