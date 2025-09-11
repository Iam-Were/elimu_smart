import React, { useEffect } from 'react';
import StudentGuidanceCards from '../components/cards/StudentGuidanceCards';
import { ProfessionalNetworkingPreview } from '../components/professional/ProfessionalNetworkingPreview';
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
    <div className="py-8 space-y-12">
      <StudentGuidanceCards showAll={true} />
      
      {/* Professional Networking Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Development</h2>
        <ProfessionalNetworkingPreview />
      </div>
    </div>
  );
};

export default Sprint18GuidancePage;