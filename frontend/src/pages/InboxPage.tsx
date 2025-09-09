import React from 'react';
import { LinkedInInbox } from '../components/inbox/LinkedInInbox';

const InboxPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">
          Connect and communicate with counselors, mentors, and peers
        </p>
      </div>
      
      <LinkedInInbox />
    </div>
  );
};

export default InboxPage;