import React, { useEffect } from 'react';
import StudentGuidanceCards from '../components/cards/StudentGuidanceCards';
import { useDynamicDashboard } from '../hooks/useDynamicDashboard';

const Sprint18GuidancePage: React.FC = () => {
  const { logActivity } = useDynamicDashboard();
  const pageLoadTime = Date.now();
  
  // Track guidance page visit
  useEffect(() => {
    logActivity('page_visit', {
      page: 'guidance',
      section: 'guidance_hub',
      timestamp: new Date().toISOString()
    });

    // Track page duration on unmount
    return () => {
      const duration = Date.now() - pageLoadTime;
      logActivity('page_duration', {
        page: 'guidance',
        duration: Math.round(duration / 1000),
        timeSpent: duration
      });
    };
  }, [logActivity, pageLoadTime]);
  
  return (
    <div className="py-8">
      <StudentGuidanceCards showAll={true} />
    </div>
  );
};

export default Sprint18GuidancePage;