import React from 'react';
import { GoalTrackingSystem } from '../../components/progress/GoalTrackingSystem';

const GoalTrackingPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <GoalTrackingSystem />
    </div>
  );
};

export default GoalTrackingPage;