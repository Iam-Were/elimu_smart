/**
 * Enhance RIASEC Personality Types with 16-Personality Style Characteristics
 *
 * Adds creative personality type names, detailed characteristics, and top 3 career matches
 * Similar to 16 Personalities (Architect, Commander, etc.)
 *
 * Run: node migrations/enhance-riasec-personality-types.js
 */

const Parse = require('parse/node');
require('dotenv').config();

// Initialize Parse
Parse.initialize(process.env.APP_ID, null, process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';
Parse.masterKey = process.env.MASTER_KEY;

const ENHANCED_RIASEC_DATA = {
  R: {
    code: 'R',
    name: 'Realistic',
    personalityTypeName: 'The Craftsman', // 16-personality style name
    tagline: 'Practical builders who create with their hands',
    description: 'Hands-on problem solvers who excel at working with tools, machinery, and physical tasks. They prefer tangible results over abstract concepts.',

    // Core characteristics
    coreTraits: [
      'Practical and hands-on',
      'Mechanically inclined',
      'Physically coordinated',
      'Independent worker',
      'Results-oriented'
    ],

    strengths: [
      'Technical expertise',
      'Problem-solving with tools',
      'Mechanical reasoning',
      'Spatial awareness',
      'Physical stamina'
    ],

    challenges: [
      'May struggle with abstract theory',
      'Prefer action over planning',
      'Less comfortable in social settings',
      'Can be impatient with bureaucracy'
    ],

    workStyle: 'Prefer hands-on work with tangible objects, machinery, and tools. Value concrete results and practical solutions. Often work independently or in small technical teams.',

    idealEnvironment: 'Structured environments with clear tasks, access to tools and equipment, minimal desk work, and opportunities for physical activity.',

    motivators: [
      'Building and creating things',
      'Seeing tangible results',
      'Working outdoors',
      'Using specialized equipment',
      'Solving practical problems'
    ],

    learningStyle: 'Learning by doing - prefer hands-on practice, demonstrations, and real-world application over lectures.',

    decisionMaking: 'Practical and logical - focus on what works in real situations, value efficiency and proven methods.',

    teamRole: 'The Builder - brings technical expertise and practical solutions to challenges',

    // Top 3 career matches with percentages (based on compatibility research)
    top3CareerMatches: [
      {
        career: 'Mechanical Engineer',
        compatibility: 95.0,
        reason: 'Perfect blend of hands-on work, technical problem-solving, and creating tangible solutions',
        kenyaOpportunities: 'JKUAT, UoN Engineering programs; Kenya Railways, manufacturing sector'
      },
      {
        career: 'Automotive Technician',
        compatibility: 92.0,
        reason: 'Direct hands-on work with machinery, diagnostic problem-solving, and practical skill application',
        kenyaOpportunities: 'Technical training colleges; Toyota Kenya, General Motors EA, auto repair businesses'
      },
      {
        career: 'Construction Manager',
        compatibility: 88.0,
        reason: 'Combines practical building knowledge with project oversight and tangible results',
        kenyaOpportunities: 'TU-K construction management; China Roads, ARM Cement, private contractors'
      }
    ],

    famousKenyans: [
      'Philip Nyakiamo (Tech Innovator & Engineer)',
      'Mbithi Masya (Infrastructure Engineer)',
      'James Macharia (Cabinet Secretary for Infrastructure)'
    ],

    developmentTips: [
      'Balance hands-on skills with theoretical knowledge',
      'Develop communication skills for team collaboration',
      'Stay updated with new tools and technologies',
      'Consider certifications in specialized areas'
    ],

    avatarSuggestions: {
      style: 'Professional with tools/equipment',
      colors: ['#ef4444', '#dc2626'], // Red gradient (existing color scheme)
      attributes: ['focused expression', 'technical gear', 'builder aesthetic']
    }
  },

  I: {
    code: 'I',
    name: 'Investigative',
    personalityTypeName: 'The Analyst',
    tagline: 'Curious minds who solve complex problems through research',
    description: 'Analytical thinkers who excel at research, data analysis, and solving complex intellectual challenges. They value logic, precision, and discovery.',

    coreTraits: [
      'Analytical and logical',
      'Intellectually curious',
      'Detail-oriented',
      'Research-driven',
      'Independent thinker'
    ],

    strengths: [
      'Critical thinking',
      'Scientific reasoning',
      'Data analysis',
      'Mathematical skills',
      'Research methodology'
    ],

    challenges: [
      'May overthink decisions',
      'Can be impatient with non-logical arguments',
      'Prefer working alone',
      'May neglect practical application'
    ],

    workStyle: 'Prefer working with abstract ideas, research, and data. Value intellectual challenges and methodical problem-solving. Often work independently on complex projects.',

    idealEnvironment: 'Quiet spaces for deep thinking, access to research resources, minimal interruptions, intellectually stimulating colleagues.',

    motivators: [
      'Solving complex problems',
      'Making new discoveries',
      'Understanding how things work',
      'Intellectual challenges',
      'Contributing to knowledge'
    ],

    learningStyle: 'Learning through investigation - prefer deep analysis, research, and understanding theory before application.',

    decisionMaking: 'Data-driven and methodical - require evidence and logical reasoning before reaching conclusions.',

    teamRole: 'The Analyst - brings critical thinking, research expertise, and data-driven insights',

    top3CareerMatches: [
      {
        career: 'Software Developer',
        compatibility: 96.0,
        reason: 'Perfect match for analytical thinking, problem-solving, and logical system design',
        kenyaOpportunities: 'Strathmore, JKUAT, UoN Computer Science; Safaricom, Andela, tech startups'
      },
      {
        career: 'Data Scientist',
        compatibility: 94.0,
        reason: 'Combines research, statistical analysis, and discovering insights from complex data',
        kenyaOpportunities: 'UoN Data Science; banks, telcos, research institutions, KEMRI'
      },
      {
        career: 'Medical Doctor',
        compatibility: 90.0,
        reason: 'Requires analytical diagnosis, research-based treatment, and continuous learning',
        kenyaOpportunities: 'UoN, Moi University Medicine; Kenyatta Hospital, Aga Khan, private practice'
      }
    ],

    famousKenyans: [
      'Prof. Wangari Maathai (Nobel Laureate, Environmental Scientist)',
      'Dr. Calestous Juma (Innovation Scholar)',
      'Prof. Ruth Nita Barrow (Medical Researcher)'
    ],

    developmentTips: [
      'Balance analysis with action and decision-making',
      'Practice communicating complex ideas simply',
      'Collaborate with diverse thinkers',
      'Apply research to real-world problems'
    ],

    avatarSuggestions: {
      style: 'Intellectual/professional with glasses',
      colors: ['#3b82f6', '#2563eb'], // Blue gradient
      attributes: ['thoughtful expression', 'lab coat or professional attire', 'analytical aesthetic']
    }
  },

  A: {
    code: 'A',
    name: 'Artistic',
    personalityTypeName: 'The Innovator',
    tagline: 'Creative visionaries who bring ideas to life',
    description: 'Creative individuals who thrive on self-expression, innovation, and aesthetic beauty. They excel in unstructured environments where imagination leads.',

    coreTraits: [
      'Creative and imaginative',
      'Expressive',
      'Original thinker',
      'Aesthetic-minded',
      'Non-conformist'
    ],

    strengths: [
      'Creative problem-solving',
      'Artistic expression',
      'Innovation',
      'Design thinking',
      'Visual communication'
    ],

    challenges: [
      'May resist structure and routine',
      'Can be perfectionistic',
      'Sensitive to criticism',
      'May struggle with deadlines'
    ],

    workStyle: 'Prefer working with ideas, design, and artistic media. Value originality and creative freedom. Often work independently with flexible schedules.',

    idealEnvironment: 'Creative spaces with artistic freedom, flexible schedules, inspiring surroundings, minimal rigid structure.',

    motivators: [
      'Self-expression',
      'Creating something new',
      'Aesthetic beauty',
      'Innovation',
      'Recognition for creativity'
    ],

    learningStyle: 'Learning through exploration - prefer creative experimentation, visual methods, and freedom to discover.',

    decisionMaking: 'Intuitive and imaginative - trust instincts, creative vision, and aesthetic judgment.',

    teamRole: 'The Innovator - brings fresh perspectives, creative solutions, and innovative thinking',

    top3CareerMatches: [
      {
        career: 'UI/UX Designer',
        compatibility: 97.0,
        reason: 'Perfect blend of creativity, user-centered thinking, and digital innovation',
        kenyaOpportunities: 'Design schools; tech companies, Safaricom, creative agencies, freelance'
      },
      {
        career: 'Graphic Designer',
        compatibility: 95.0,
        reason: 'Direct creative expression through visual communication and brand storytelling',
        kenyaOpportunities: 'Multimedia University; advertising agencies, media houses, corporate brands'
      },
      {
        career: 'Architect',
        compatibility: 91.0,
        reason: 'Combines artistic vision with functional design and spatial creativity',
        kenyaOpportunities: 'UoN, JKUAT Architecture; architectural firms, real estate developers'
      }
    ],

    famousKenyans: [
      'Lupita Nyong\'o (Academy Award-winning Actress)',
      'Eric Wainaina (Musician & Creative Director)',
      'Wangechi Mutu (Internationally Acclaimed Artist)'
    ],

    developmentTips: [
      'Balance creativity with business acumen',
      'Learn to work within constraints',
      'Accept constructive criticism',
      'Build portfolio and online presence'
    ],

    avatarSuggestions: {
      style: 'Artistic/creative with unique flair',
      colors: ['#a855f7', '#9333ea'], // Purple gradient
      attributes: ['creative expression', 'artistic accessories', 'unique style']
    }
  },

  S: {
    code: 'S',
    name: 'Social',
    personalityTypeName: 'The Advocate',
    tagline: 'Compassionate helpers who uplift communities',
    description: 'People-oriented individuals who excel at helping, teaching, and caring for others. They value human connection and making a positive impact.',

    coreTraits: [
      'Empathetic and caring',
      'People-oriented',
      'Excellent communicator',
      'Team player',
      'Service-minded'
    ],

    strengths: [
      'Interpersonal communication',
      'Empathy and compassion',
      'Teaching and mentoring',
      'Conflict resolution',
      'Active listening'
    ],

    challenges: [
      'May prioritize others over self',
      'Can take criticism personally',
      'May avoid necessary confrontation',
      'Risk of burnout from helping'
    ],

    workStyle: 'Prefer working directly with people to teach, care, or support. Value relationships and community impact. Thrive in collaborative environments.',

    idealEnvironment: 'Collaborative spaces with frequent interaction, supportive team culture, opportunities to help others, positive atmosphere.',

    motivators: [
      'Helping others',
      'Making a difference',
      'Building relationships',
      'Community impact',
      'Personal growth of others'
    ],

    learningStyle: 'Learning through collaboration - prefer group discussions, mentorship, and social interaction.',

    decisionMaking: 'Values-based and collaborative - consider impact on people first, seek consensus.',

    teamRole: 'The Advocate - builds team cohesion, supports members, and champions others\' needs',

    top3CareerMatches: [
      {
        career: 'Teacher',
        compatibility: 96.0,
        reason: 'Perfect alignment with helping others learn, mentoring, and shaping young minds',
        kenyaOpportunities: 'Kenyatta, Moi, Egerton Education; TSC, private schools, tutoring centers'
      },
      {
        career: 'Counselor',
        compatibility: 94.0,
        reason: 'Direct people support, empathy-driven work, and helping others overcome challenges',
        kenyaOpportunities: 'Daystar, Kenyatta Counseling Psychology; schools, NGOs, hospitals'
      },
      {
        career: 'Nurse',
        compatibility: 92.0,
        reason: 'Combines caring for others, healthcare knowledge, and patient advocacy',
        kenyaOpportunities: 'UoN, KMTC Nursing; hospitals, clinics, community health programs'
      }
    ],

    famousKenyans: [
      'Dr. Khama Rogo (Public Health Leader)',
      'Juliana Rotich (Social Entrepreneur & Humanitarian)',
      'Boniface Mwangi (Social Activist)'
    ],

    developmentTips: [
      'Set healthy boundaries to avoid burnout',
      'Develop assertiveness skills',
      'Balance helping others with self-care',
      'Learn to accept appreciation'
    ],

    avatarSuggestions: {
      style: 'Warm and approachable',
      colors: ['#10b981', '#059669'], // Green gradient
      attributes: ['friendly smile', 'welcoming posture', 'caring aesthetic']
    }
  },

  E: {
    code: 'E',
    name: 'Enterprising',
    personalityTypeName: 'The Commander',
    tagline: 'Ambitious leaders who drive change and results',
    description: 'Goal-oriented leaders who excel at persuading, managing, and achieving business success. They value influence, achievement, and tangible results.',

    coreTraits: [
      'Confident and assertive',
      'Natural leader',
      'Persuasive',
      'Competitive',
      'Goal-driven'
    ],

    strengths: [
      'Leadership and influence',
      'Strategic thinking',
      'Business acumen',
      'Negotiation skills',
      'Risk-taking ability'
    ],

    challenges: [
      'May be overly competitive',
      'Can prioritize results over people',
      'May resist following others',
      'Can be impatient with slow progress'
    ],

    workStyle: 'Prefer leading projects, managing teams, and driving business results. Value achievement and influence. Thrive in competitive environments.',

    idealEnvironment: 'Fast-paced settings with clear metrics, leadership opportunities, autonomy to make decisions, competitive atmosphere.',

    motivators: [
      'Achievement and success',
      'Influence and status',
      'Financial rewards',
      'Competition',
      'Recognition'
    ],

    learningStyle: 'Learning through action - prefer real-world application, case studies, and immediate implementation.',

    decisionMaking: 'Results-oriented and strategic - focus on outcomes, ROI, and competitive advantage.',

    teamRole: 'The Commander - drives vision, motivates teams, and leads toward ambitious goals',

    top3CareerMatches: [
      {
        career: 'Business Owner/Entrepreneur',
        compatibility: 98.0,
        reason: 'Ultimate expression of leadership, risk-taking, and driving business success',
        kenyaOpportunities: 'Strathmore, UoN Business; startup ecosystem, SME sector, franchising'
      },
      {
        career: 'Sales Manager',
        compatibility: 95.0,
        reason: 'Combines persuasion, competition, and achieving measurable results',
        kenyaOpportunities: 'Business schools; retail, real estate, insurance, tech sales, FMCG'
      },
      {
        career: 'Marketing Director',
        compatibility: 92.0,
        reason: 'Strategic thinking, brand influence, and driving business growth through campaigns',
        kenyaOpportunities: 'UoN, Strathmore Marketing; agencies, corporate brands, digital marketing'
      }
    ],

    famousKenyans: [
      'James Mwangi (Equity Bank Group CEO)',
      'Tabitha Karanja (Keroche Breweries Founder)',
      'Chris Kirubi (Business Magnate - Legacy)'
    ],

    developmentTips: [
      'Balance ambition with empathy',
      'Listen to team input',
      'Develop emotional intelligence',
      'Learn from failures quickly'
    ],

    avatarSuggestions: {
      style: 'Professional and confident',
      colors: ['#eab308', '#ca8a04'], // Yellow/amber gradient
      attributes: ['confident posture', 'business attire', 'leadership aesthetic']
    }
  },

  C: {
    code: 'C',
    name: 'Conventional',
    personalityTypeName: 'The Coordinator',
    tagline: 'Detail-oriented organizers who ensure precision and order',
    description: 'Organized individuals who excel at structure, data management, and systematic approaches. They value accuracy, efficiency, and clear processes.',

    coreTraits: [
      'Detail-oriented',
      'Organized and systematic',
      'Reliable',
      'Process-focused',
      'Quality-conscious'
    ],

    strengths: [
      'Attention to detail',
      'Organization skills',
      'Data management',
      'Process efficiency',
      'Quality assurance'
    ],

    challenges: [
      'May resist change',
      'Can be overly cautious',
      'May struggle with ambiguity',
      'Can be inflexible with rules'
    ],

    workStyle: 'Prefer working with data, systems, and established procedures. Value accuracy and efficiency. Thrive in structured environments with clear expectations.',

    idealEnvironment: 'Well-organized spaces with clear processes, defined roles, consistent routines, predictable schedules.',

    motivators: [
      'Order and structure',
      'Accuracy and precision',
      'Clear expectations',
      'System optimization',
      'Quality standards'
    ],

    learningStyle: 'Learning through structure - prefer step-by-step systematic instruction, manuals, and clear guidelines.',

    decisionMaking: 'Methodical and rule-based - follow proven processes, standards, and established best practices.',

    teamRole: 'The Coordinator - ensures quality, compliance, systematic execution, and organizational efficiency',

    top3CareerMatches: [
      {
        career: 'Accountant',
        compatibility: 97.0,
        reason: 'Perfect match for detail work, numerical precision, and systematic financial management',
        kenyaOpportunities: 'Strathmore, UoN Accounting; CPA-K, audit firms, banks, corporate finance'
      },
      {
        career: 'Bank Manager',
        compatibility: 93.0,
        reason: 'Combines organizational skills, financial systems, and procedural management',
        kenyaOpportunities: 'Banking qualifications; KCB, Equity, Co-op Bank, microfinance institutions'
      },
      {
        career: 'Data Analyst',
        compatibility: 90.0,
        reason: 'Detail-oriented data work, systematic analysis, and quality assurance',
        kenyaOpportunities: 'Data analysis programs; banks, telcos, research firms, government agencies'
      }
    ],

    famousKenyans: [
      'Betty Maina (Industry & Trade - Standards Expert)',
      'Patrick Njoroge (Former CBK Governor - Financial Systems)',
      'Nancy Gitau (Financial Systems & Compliance)'
    ],

    developmentTips: [
      'Embrace calculated risks',
      'Balance rules with flexibility',
      'Develop adaptability skills',
      'Learn to delegate details'
    ],

    avatarSuggestions: {
      style: 'Professional and precise',
      colors: ['#6b7280', '#4b5563'], // Gray gradient
      attributes: ['neat appearance', 'professional attire', 'organized aesthetic']
    }
  }
};

async function enhanceRiasecTypes() {
  console.log('🚀 Enhancing RIASEC Personality Types with 16-Personality Style Data...\n');

  try {
    const RiasecTypeInfo = Parse.Object.extend('RiasecTypeInfo');

    // Update each type
    for (const [typeCode, typeData] of Object.entries(ENHANCED_RIASEC_DATA)) {
      const query = new Parse.Query(RiasecTypeInfo);
      query.equalTo('code', typeCode);

      let typeInfo = await query.first({ useMasterKey: true });

      if (!typeInfo) {
        console.log(`⚠️  ${typeCode} not found, creating new record...`);
        typeInfo = new RiasecTypeInfo();
        typeInfo.set('code', typeCode);
      }

      // Update all fields
      typeInfo.set('name', typeData.name);
      typeInfo.set('personalityTypeName', typeData.personalityTypeName);
      typeInfo.set('tagline', typeData.tagline);
      typeInfo.set('description', typeData.description);
      typeInfo.set('coreTraits', typeData.coreTraits);
      typeInfo.set('strengths', typeData.strengths);
      typeInfo.set('challenges', typeData.challenges);
      typeInfo.set('workStyle', typeData.workStyle);
      typeInfo.set('idealEnvironment', typeData.idealEnvironment);
      typeInfo.set('motivators', typeData.motivators);
      typeInfo.set('learningStyle', typeData.learningStyle);
      typeInfo.set('decisionMaking', typeData.decisionMaking);
      typeInfo.set('teamRole', typeData.teamRole);
      typeInfo.set('top3CareerMatches', typeData.top3CareerMatches);
      typeInfo.set('famousKenyans', typeData.famousKenyans);
      typeInfo.set('developmentTips', typeData.developmentTips);
      typeInfo.set('avatarSuggestions', typeData.avatarSuggestions);
      typeInfo.set('isActive', true);

      await typeInfo.save(null, { useMasterKey: true });

      console.log(`✅ Enhanced ${typeCode} - "${typeData.personalityTypeName}"`);
      console.log(`   Top Career: ${typeData.top3CareerMatches[0].career} (${typeData.top3CareerMatches[0].compatibility}%)`);
    }

    console.log('\n🎉 Successfully enhanced all RIASEC personality types!');

    // Verification
    console.log('\n📊 Verification - 16-Personality Style Names:');
    const verifyQuery = new Parse.Query(RiasecTypeInfo);
    verifyQuery.select(['code', 'personalityTypeName', 'tagline']);
    const all = await verifyQuery.find({ useMasterKey: true });

    all.forEach(type => {
      console.log(`   ${type.get('code')} - "${type.get('personalityTypeName')}" - ${type.get('tagline')}`);
    });

    console.log('\n✨ Migration complete! Use Cloud Function "getRiasecTypeInfo" to fetch personality data.');

  } catch (error) {
    console.error('❌ Error enhancing RIASEC types:', error);
    throw error;
  }
}

// Run migration
enhanceRiasecTypes()
  .then(() => {
    console.log('\n👍 Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
