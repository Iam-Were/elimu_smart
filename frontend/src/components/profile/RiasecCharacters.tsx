import React from 'react';

// RIASEC Character SVG Components

export const RealisticCharacter: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hard hat */}
    <ellipse cx="100" cy="60" rx="45" ry="15" fill="#3B82F6" />
    <rect x="60" y="60" width="80" height="20" fill="#60A5FA" rx="5" />

    {/* Head */}
    <circle cx="100" cy="90" r="35" fill="#FED7AA" />

    {/* Body - work vest */}
    <rect x="70" y="115" width="60" height="50" fill="#FB923C" rx="8" />
    <rect x="75" y="120" width="10" height="40" fill="#FDBA74" />
    <rect x="115" y="120" width="10" height="40" fill="#FDBA74" />

    {/* Arms holding wrench */}
    <rect x="45" y="130" width="25" height="15" fill="#FED7AA" rx="7" />
    <rect x="130" y="130" width="25" height="15" fill="#FED7AA" rx="7" />

    {/* Wrench tool */}
    <rect x="35" y="140" width="30" height="8" fill="#94A3B8" rx="4" />
    <circle cx="35" cy="144" r="6" fill="#64748B" />
  </svg>
);

export const InvestigativeCharacter: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="100" cy="70" r="35" fill="#FED7AA" />

    {/* Glasses */}
    <circle cx="85" cy="70" r="10" fill="none" stroke="#1E293B" strokeWidth="2" />
    <circle cx="115" cy="70" r="10" fill="none" stroke="#1E293B" strokeWidth="2" />
    <line x1="95" y1="70" x2="105" y2="70" stroke="#1E293B" strokeWidth="2" />

    {/* Lab coat */}
    <path d="M 70 100 L 70 165 L 130 165 L 130 100 Z" fill="#EFF6FF" />
    <rect x="95" y="100" width="10" height="65" fill="#BFDBFE" />

    {/* Microscope */}
    <circle cx="140" cy="130" r="8" fill="#8B5CF6" />
    <rect x="138" y="138" width="4" height="25" fill="#7C3AED" />
    <ellipse cx="140" cy="163" rx="15" ry="5" fill="#6D28D9" />
  </svg>
);

export const ArtisticCharacter: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="100" cy="70" r="35" fill="#FED7AA" />

    {/* Beret hat */}
    <ellipse cx="100" cy="45" rx="40" ry="12" fill="#EC4899" />
    <circle cx="100" cy="45" r="8" fill="#DB2777" />

    {/* Body - smock */}
    <path d="M 70 100 L 70 165 L 130 165 L 130 100 Z" fill="#FDE68A" />

    {/* Palette */}
    <ellipse cx="140" cy="130" rx="20" ry="15" fill="#F59E0B" />
    <circle cx="135" cy="125" r="4" fill="#EF4444" />
    <circle cx="145" cy="125" r="4" fill="#3B82F6" />
    <circle cx="140" cy="135" r="4" fill="#10B981" />

    {/* Paintbrush */}
    <rect x="50" y="125" width="6" height="35" fill="#78350F" rx="3" />
    <path d="M 50 125 L 53 115 L 56 125 Z" fill="#F59E0B" />
  </svg>
);

export const SocialCharacter: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="100" cy="70" r="35" fill="#FED7AA" />

    {/* Smile */}
    <path d="M 85 75 Q 100 85 115 75" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />

    {/* Eyes */}
    <circle cx="90" cy="65" r="3" fill="#1E293B" />
    <circle cx="110" cy="65" r="3" fill="#1E293B" />

    {/* Body - caring gesture */}
    <path d="M 70 100 L 70 165 L 130 165 L 130 100 Z" fill="#10B981" />

    {/* Arms in welcoming pose */}
    <ellipse cx="55" cy="120" rx="15" ry="8" fill="#FED7AA" transform="rotate(-20 55 120)" />
    <ellipse cx="145" cy="120" rx="15" ry="8" fill="#FED7AA" transform="rotate(20 145 120)" />

    {/* Heart symbol */}
    <path d="M 100 145 L 90 135 Q 85 130 90 125 Q 95 120 100 125 Q 105 120 110 125 Q 115 130 110 135 Z" fill="#F87171" />
  </svg>
);

export const EnterprisingCharacter: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="100" cy="70" r="35" fill="#FED7AA" />

    {/* Confident expression */}
    <circle cx="90" cy="65" r="3" fill="#1E293B" />
    <circle cx="110" cy="65" r="3" fill="#1E293B" />
    <path d="M 85 75 L 115 75" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

    {/* Suit jacket */}
    <path d="M 70 100 L 70 165 L 95 165 L 95 100 Z" fill="#1E293B" />
    <path d="M 105 100 L 105 165 L 130 165 L 130 100 Z" fill="#1E293B" />

    {/* Shirt and tie */}
    <rect x="95" y="100" width="10" height="65" fill="#DBEAFE" />
    <path d="M 100 105 L 95 120 L 100 165 L 105 120 Z" fill="#EF4444" />

    {/* Chart/graph prop */}
    <rect x="135" y="120" width="25" height="35" fill="#FFF7ED" stroke="#FB923C" strokeWidth="2" />
    <polyline points="140,150 145,140 150,145 155,135" stroke="#10B981" strokeWidth="2" fill="none" />
  </svg>
);

export const ConventionalCharacter: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="100" cy="70" r="35" fill="#FED7AA" />

    {/* Glasses */}
    <rect x="80" y="65" width="18" height="12" fill="none" stroke="#1E293B" strokeWidth="2" rx="2" />
    <rect x="102" y="65" width="18" height="12" fill="none" stroke="#1E293B" strokeWidth="2" rx="2" />

    {/* Business attire */}
    <path d="M 70 100 L 70 165 L 130 165 L 130 100 Z" fill="#334155" />
    <rect x="95" y="100" width="10" height="65" fill="#E0E7FF" />

    {/* Clipboard */}
    <rect x="135" y="115" width="20" height="30" fill="#F3F4F6" stroke="#6B7280" strokeWidth="2" rx="2" />
    <line x1="140" y1="125" x2="150" y2="125" stroke="#6B7280" strokeWidth="1.5" />
    <line x1="140" y1="130" x2="150" y2="130" stroke="#6B7280" strokeWidth="1.5" />
    <line x1="140" y1="135" x2="150" y2="135" stroke="#6B7280" strokeWidth="1.5" />

    {/* Clip top */}
    <rect x="142" y="112" width="6" height="4" fill="#64748B" rx="1" />
  </svg>
);

// Character mapper
// eslint-disable-next-line react-refresh/only-export-components
export const getRiasecCharacter = (type: string): React.ComponentType<{ className?: string }> => {
  const typeUpper = type.toUpperCase();
  switch (typeUpper) {
    case 'R':
      return RealisticCharacter;
    case 'I':
      return InvestigativeCharacter;
    case 'A':
      return ArtisticCharacter;
    case 'S':
      return SocialCharacter;
    case 'E':
      return EnterprisingCharacter;
    case 'C':
      return ConventionalCharacter;
    default:
      return RealisticCharacter;
  }
};

// Character metadata
// eslint-disable-next-line react-refresh/only-export-components
export const RIASEC_METADATA = {
  R: {
    name: 'Realistic',
    title: 'The Builder',
    tagline: 'Hands-on problem solvers who work with tools and machines',
    color: 'from-blue-500 to-blue-600'
  },
  I: {
    name: 'Investigative',
    title: 'The Thinker',
    tagline: 'Analytical minds who explore ideas and solve complex problems',
    color: 'from-purple-500 to-purple-600'
  },
  A: {
    name: 'Artistic',
    title: 'The Creator',
    tagline: 'Imaginative spirits who express themselves through creativity',
    color: 'from-pink-500 to-pink-600'
  },
  S: {
    name: 'Social',
    title: 'The Helper',
    tagline: 'Caring individuals who support and empower others',
    color: 'from-green-500 to-green-600'
  },
  E: {
    name: 'Enterprising',
    title: 'The Leader',
    tagline: 'Ambitious go-getters who influence and persuade',
    color: 'from-orange-500 to-orange-600'
  },
  C: {
    name: 'Conventional',
    title: 'The Organizer',
    tagline: 'Detail-oriented planners who bring order and structure',
    color: 'from-slate-500 to-slate-600'
  }
};
