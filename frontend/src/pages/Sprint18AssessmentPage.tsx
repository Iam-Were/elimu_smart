import React, { useEffect } from 'react';
import StudentAssessmentCards from '../components/cards/StudentAssessmentCards';
import { useDynamicDashboard } from '../hooks/useDynamicDashboard';

const Sprint18AssessmentPage: React.FC = () => {
  const { logActivity } = useDynamicDashboard();
  const pageLoadTime = Date.now();
  
  // Track assessment page visit
  useEffect(() => {
    logActivity('page_visit', {
      page: 'assessment',
      section: 'assessment_hub',
      timestamp: new Date().toISOString()
    });

    // Track page duration on unmount
    return () => {
      const duration = Date.now() - pageLoadTime;
      logActivity('page_duration', {
        page: 'assessment',
        duration: Math.round(duration / 1000),
        timeSpent: duration
      });
    };
  }, [logActivity, pageLoadTime]);
  
  return (
    <div className="py-8">
      <StudentAssessmentCards showAll={true} />
    </div>
  );
};

export default Sprint18AssessmentPage;