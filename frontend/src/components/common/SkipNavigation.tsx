import React from 'react';

/**
 * SkipNavigation Component
 * Allows keyboard users to skip directly to main content
 * WCAG 2.1 AA Requirement: 2.4.1 Bypass Blocks
 */
export const SkipNavigation: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="skip-to-main fixed top-0 left-0 z-[9999] -translate-y-full focus:translate-y-0 
                 bg-orange-600 text-white font-semibold px-6 py-3 rounded-br-lg 
                 shadow-lg transition-transform duration-200 
                 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
    >
      Skip to main content
    </a>
  );
};

export default SkipNavigation;
