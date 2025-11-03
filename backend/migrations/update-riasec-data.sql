-- Update RIASEC Personality Types with Enhanced 16Personalities-Style Data
-- Run: psql -U postgres -d elimu_smart_production < update-riasec-data.sql

-- R - The Craftsman
UPDATE "RiasecTypeInfo" SET
  "personalityTypeName" = 'The Craftsman',
  "tagline" = 'Practical builders who create with their hands',
  "coreTraits" = ARRAY['Practical and hands-on', 'Mechanically inclined', 'Physically coordinated', 'Independent worker', 'Results-oriented'],
  "challenges" = ARRAY['May struggle with abstract theory', 'Prefer action over planning', 'Less comfortable in social settings', 'Can be impatient with bureaucracy'],
  "idealEnvironment" = 'Structured environments with clear tasks, access to tools and equipment, minimal desk work, and opportunities for physical activity.',
  "developmentTips" = ARRAY['Balance hands-on skills with theoretical knowledge', 'Develop communication skills for team collaboration', 'Stay updated with new tools and technologies', 'Consider certifications in specialized areas']
WHERE code = 'R';

-- I - The Analyst
UPDATE "RiasecTypeInfo" SET
  "personalityTypeName" = 'The Analyst',
  "tagline" = 'Curious minds who solve complex problems through research',
  "coreTraits" = ARRAY['Analytical and logical', 'Intellectually curious', 'Detail-oriented', 'Research-driven', 'Independent thinker'],
  "challenges" = ARRAY['May overthink decisions', 'Can be impatient with non-logical arguments', 'Prefer working alone', 'May neglect practical application'],
  "idealEnvironment" = 'Quiet spaces for deep thinking, access to research resources, minimal interruptions, intellectually stimulating colleagues.',
  "developmentTips" = ARRAY['Balance analysis with action and decision-making', 'Practice communicating complex ideas simply', 'Collaborate with diverse thinkers', 'Apply research to real-world problems']
WHERE code = 'I';

-- A - The Innovator
UPDATE "RiasecTypeInfo" SET
  "personalityTypeName" = 'The Innovator',
  "tagline" = 'Creative visionaries who bring ideas to life',
  "coreTraits" = ARRAY['Creative and imaginative', 'Expressive', 'Original thinker', 'Aesthetic-minded', 'Non-conformist'],
  "challenges" = ARRAY['May resist structure and routine', 'Can be perfectionistic', 'Sensitive to criticism', 'May struggle with deadlines'],
  "idealEnvironment" = 'Creative spaces with artistic freedom, flexible schedules, inspiring surroundings, minimal rigid structure.',
  "developmentTips" = ARRAY['Balance creativity with business acumen', 'Learn to work within constraints', 'Accept constructive criticism', 'Build portfolio and online presence']
WHERE code = 'A';

-- S - The Advocate
UPDATE "RiasecTypeInfo" SET
  "personalityTypeName" = 'The Advocate',
  "tagline" = 'Compassionate helpers who uplift communities',
  "coreTraits" = ARRAY['Empathetic and caring', 'People-oriented', 'Excellent communicator', 'Team player', 'Service-minded'],
  "challenges" = ARRAY['May prioritize others over self', 'Can take criticism personally', 'May avoid necessary confrontation', 'Risk of burnout from helping'],
  "idealEnvironment" = 'Collaborative spaces with frequent interaction, supportive team culture, opportunities to help others, positive atmosphere.',
  "developmentTips" = ARRAY['Set healthy boundaries to avoid burnout', 'Develop assertiveness skills', 'Balance helping others with self-care', 'Learn to accept appreciation']
WHERE code = 'S';

-- E - The Commander
UPDATE "RiasecTypeInfo" SET
  "personalityTypeName" = 'The Commander',
  "tagline" = 'Ambitious leaders who drive change and results',
  "coreTraits" = ARRAY['Confident and assertive', 'Natural leader', 'Persuasive', 'Competitive', 'Goal-driven'],
  "challenges" = ARRAY['May be overly competitive', 'Can prioritize results over people', 'May resist following others', 'Can be impatient with slow progress'],
  "idealEnvironment" = 'Fast-paced settings with clear metrics, leadership opportunities, autonomy to make decisions, competitive atmosphere.',
  "developmentTips" = ARRAY['Balance ambition with empathy', 'Listen to team input', 'Develop emotional intelligence', 'Learn from failures quickly']
WHERE code = 'E';

-- C - The Coordinator
UPDATE "RiasecTypeInfo" SET
  "personalityTypeName" = 'The Coordinator',
  "tagline" = 'Detail-oriented organizers who ensure precision and order',
  "coreTraits" = ARRAY['Detail-oriented', 'Organized and systematic', 'Reliable', 'Process-focused', 'Quality-conscious'],
  "challenges" = ARRAY['May resist change', 'Can be overly cautious', 'May struggle with ambiguity', 'Can be inflexible with rules'],
  "idealEnvironment" = 'Well-organized spaces with clear processes, defined roles, consistent routines, predictable schedules.',
  "developmentTips" = ARRAY['Embrace calculated risks', 'Balance rules with flexibility', 'Develop adaptability skills', 'Learn to delegate details']
WHERE code = 'C';
