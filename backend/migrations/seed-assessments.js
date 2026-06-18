/**
 * Assessment Data Migration Script
 * Seeds Parse database with RIASEC and Skills assessment questions
 *
 * Run: node migrations/seed-assessments.js
 */

const Parse = require('parse/node');

// Parse configuration (will be set from environment)
const initializeParse = (config) => {
  Parse.initialize(config.appId, config.javascriptKey, config.masterKey);
  Parse.serverURL = config.serverURL;
};

// RIASEC Questions Data (96 questions)
const riasecQuestions = [
  // REALISTIC Activities (IDs 1-8)
  { questionId: 1, category: 'activities', statement: 'Test the quality of parts before shipment', riasecType: 'R', kenyaContext: 'Quality control in Kenya manufacturing' },
  { questionId: 2, category: 'activities', statement: 'Lay brick or tile for building construction', riasecType: 'R', kenyaContext: 'Construction boom in Nairobi and major towns' },
  { questionId: 3, category: 'activities', statement: 'Work in geothermal or renewable energy installations', riasecType: 'R', kenyaContext: 'Olkaria geothermal project and solar farms' },
  { questionId: 4, category: 'activities', statement: 'Assemble or repair mobile phones and electronics', riasecType: 'R', kenyaContext: 'Growing tech repair sector in Kenya' },
  { questionId: 5, category: 'activities', statement: 'Drive a matatu, truck, or delivery vehicle', riasecType: 'R', kenyaContext: 'Transport and logistics sector' },
  { questionId: 6, category: 'activities', statement: 'Repair household appliances and electronics', riasecType: 'R', kenyaContext: 'Jua Kali technicians in high demand' },
  { questionId: 7, category: 'activities', statement: 'Manage fish farming or aquaculture operations', riasecType: 'R', kenyaContext: 'Growing aquaculture in Lake Victoria region' },
  { questionId: 8, category: 'activities', statement: 'Build furniture or kitchen cabinets', riasecType: 'R', kenyaContext: 'Carpentry is a well-established trade' },

  // REALISTIC Occupations (IDs 9-16)
  { questionId: 9, category: 'occupations', statement: 'Mechanical Engineer', riasecType: 'R', kenyaContext: 'High demand in manufacturing and construction' },
  { questionId: 10, category: 'occupations', statement: 'Matatu Owner/Operator or Transport Manager', riasecType: 'R', kenyaContext: 'Profitable business in Kenya transport sector' },
  { questionId: 11, category: 'occupations', statement: 'Aircraft Mechanic', riasecType: 'R', kenyaContext: 'JKIA and Wilson Airport opportunities' },
  { questionId: 12, category: 'occupations', statement: 'Carpenter or Furniture Maker', riasecType: 'R', kenyaContext: 'Thriving furniture industry' },
  { questionId: 13, category: 'occupations', statement: 'Auto Mechanic', riasecType: 'R', kenyaContext: 'Essential trade with steady income' },
  { questionId: 14, category: 'occupations', statement: 'Commercial Airline Pilot', riasecType: 'R', kenyaContext: 'Kenya Airways and regional airlines' },
  { questionId: 15, category: 'occupations', statement: 'Electrician', riasecType: 'R', kenyaContext: 'High demand with KPLC projects' },
  { questionId: 16, category: 'occupations', statement: 'Commercial Farmer or Agribusiness Manager', riasecType: 'R', kenyaContext: 'Modern agriculture is highly profitable' },

  // INVESTIGATIVE Activities (IDs 17-24)
  { questionId: 17, category: 'activities', statement: 'Study ways to reduce water pollution in rivers and lakes', riasecType: 'I', kenyaContext: 'Important for Lake Victoria and Nairobi River' },
  { questionId: 18, category: 'activities', statement: 'Develop new medicines or medical treatments', riasecType: 'I', kenyaContext: 'KEMRI research opportunities' },
  { questionId: 19, category: 'activities', statement: 'Plan and conduct research studies', riasecType: 'I', kenyaContext: 'Universities and research institutions' },
  { questionId: 20, category: 'activities', statement: 'Study Kenyan history and archaeological sites', riasecType: 'I', kenyaContext: 'National Museums of Kenya' },
  { questionId: 21, category: 'activities', statement: 'Study animal behavior in national parks', riasecType: 'I', kenyaContext: 'Wildlife conservation research' },
  { questionId: 22, category: 'activities', statement: 'Do research on plants, crops, or wildlife', riasecType: 'I', kenyaContext: 'Agricultural and conservation research' },
  { questionId: 23, category: 'activities', statement: 'Do laboratory tests to identify diseases', riasecType: 'I', kenyaContext: 'KNH, KEMRI, and hospital labs' },
  { questionId: 24, category: 'activities', statement: 'Study weather patterns and climate change', riasecType: 'I', kenyaContext: 'Kenya Meteorological Department' },

  // INVESTIGATIVE Occupations (IDs 25-32)
  { questionId: 25, category: 'occupations', statement: 'Psychologist or Mental Health Counselor', riasecType: 'I', kenyaContext: 'Growing mental health awareness' },
  { questionId: 26, category: 'occupations', statement: 'Research Scientist at KEMRI or Universities', riasecType: 'I', kenyaContext: 'Medical and agricultural research' },
  { questionId: 27, category: 'occupations', statement: 'Medical Doctor', riasecType: 'I', kenyaContext: 'High demand, competitive KUCCPS cutoff ~10.5 pts' },
  { questionId: 28, category: 'occupations', statement: 'Data Analyst or Data Scientist', riasecType: 'I', kenyaContext: 'Booming tech sector in Nairobi' },
  { questionId: 29, category: 'occupations', statement: 'Chemist or Pharmaceutical Researcher', riasecType: 'I', kenyaContext: 'Pharmaceutical industry growing' },
  { questionId: 30, category: 'occupations', statement: 'Mathematician or Statistician', riasecType: 'I', kenyaContext: 'KNBS and research institutions' },
  { questionId: 31, category: 'occupations', statement: 'Biologist or Environmental Scientist', riasecType: 'I', kenyaContext: 'Conservation and environmental projects' },
  { questionId: 32, category: 'occupations', statement: 'IT Systems Analyst or Software Developer', riasecType: 'I', kenyaContext: 'Silicon Savannah tech hub' },

  // ARTISTIC Activities (IDs 33-40)
  { questionId: 33, category: 'activities', statement: 'Conduct a musical choir', riasecType: 'A' },
  { questionId: 34, category: 'activities', statement: 'Direct a play', riasecType: 'A' },
  { questionId: 35, category: 'activities', statement: 'Design artwork for magazines', riasecType: 'A' },
  { questionId: 36, category: 'activities', statement: 'Write a song', riasecType: 'A' },
  { questionId: 37, category: 'activities', statement: 'Write books or plays', riasecType: 'A' },
  { questionId: 38, category: 'activities', statement: 'Play a musical instrument', riasecType: 'A' },
  { questionId: 39, category: 'activities', statement: 'Perform stunts for a movie or television show', riasecType: 'A' },
  { questionId: 40, category: 'activities', statement: 'Create special effects for movies', riasecType: 'A' },

  // ARTISTIC Occupations (IDs 41-48)
  { questionId: 41, category: 'occupations', statement: 'Poet or Creative Writer', riasecType: 'A', kenyaContext: 'Kenyan literature and poetry scene' },
  { questionId: 42, category: 'occupations', statement: 'Actor or Film Producer', riasecType: 'A', kenyaContext: 'Riverwood and theatre industry' },
  { questionId: 43, category: 'occupations', statement: 'Musician or Music Producer', riasecType: 'A', kenyaContext: 'Vibrant Kenyan music industry' },
  { questionId: 44, category: 'occupations', statement: 'Film Editor or Video Content Creator', riasecType: 'A', kenyaContext: 'YouTube and Riverwood opportunities' },
  { questionId: 45, category: 'occupations', statement: 'Artist or Visual Designer', riasecType: 'A', kenyaContext: 'Growing arts scene in Nairobi' },
  { questionId: 46, category: 'occupations', statement: 'Singer or Performer', riasecType: 'A', kenyaContext: 'Gospel and secular music markets' },
  { questionId: 47, category: 'occupations', statement: 'Graphic Designer or UI/UX Designer', riasecType: 'A', kenyaContext: 'Tech startups need designers' },
  { questionId: 48, category: 'occupations', statement: 'Journalist or Media Personality', riasecType: 'A', kenyaContext: 'Nation, Standard, Citizen TV opportunities' },

  // SOCIAL Activities (IDs 49-56)
  { questionId: 49, category: 'activities', statement: 'Give career guidance to people', riasecType: 'S' },
  { questionId: 50, category: 'activities', statement: 'Do volunteer work at a non-profit organization', riasecType: 'S' },
  { questionId: 51, category: 'activities', statement: 'Help people who have problems with drugs or alcohol', riasecType: 'S' },
  { questionId: 52, category: 'activities', statement: 'Teach children how to read', riasecType: 'S' },
  { questionId: 53, category: 'activities', statement: 'Work with mentally disabled children', riasecType: 'S' },
  { questionId: 54, category: 'activities', statement: 'Teach an individual an exercise routine', riasecType: 'S' },
  { questionId: 55, category: 'activities', statement: 'Help people with family-related problems', riasecType: 'S' },
  { questionId: 56, category: 'activities', statement: 'Supervise the activities of children at a camp', riasecType: 'S' },

  // SOCIAL Occupations (IDs 57-64)
  { questionId: 57, category: 'occupations', statement: 'Social Worker', riasecType: 'S' },
  { questionId: 58, category: 'occupations', statement: 'Marriage Counselor', riasecType: 'S' },
  { questionId: 59, category: 'occupations', statement: 'Teacher', riasecType: 'S' },
  { questionId: 60, category: 'occupations', statement: 'Clinical Psychologist', riasecType: 'S' },
  { questionId: 61, category: 'occupations', statement: 'Counselor', riasecType: 'S' },
  { questionId: 62, category: 'occupations', statement: 'Social Science Teacher', riasecType: 'S' },
  { questionId: 63, category: 'occupations', statement: 'Speech Therapist', riasecType: 'S' },
  { questionId: 64, category: 'occupations', statement: 'Nurse', riasecType: 'S' },

  // ENTERPRISING Activities (IDs 65-72)
  { questionId: 65, category: 'activities', statement: 'Buy and sell land', riasecType: 'E' },
  { questionId: 66, category: 'activities', statement: 'Manage a retail store', riasecType: 'E' },
  { questionId: 67, category: 'activities', statement: 'Operate a beauty salon or barber shop', riasecType: 'E' },
  { questionId: 68, category: 'activities', statement: 'Manage a department within a large company', riasecType: 'E' },
  { questionId: 69, category: 'activities', statement: 'Start your own business', riasecType: 'E' },
  { questionId: 70, category: 'activities', statement: 'Negotiate business contracts', riasecType: 'E' },
  { questionId: 71, category: 'activities', statement: 'Represent a client in a lawsuit', riasecType: 'E' },
  { questionId: 72, category: 'activities', statement: 'Market a new line of clothing', riasecType: 'E' },

  // ENTERPRISING Occupations (IDs 73-80)
  { questionId: 73, category: 'occupations', statement: 'Business Executive', riasecType: 'E' },
  { questionId: 74, category: 'occupations', statement: 'Television Producer', riasecType: 'E' },
  { questionId: 75, category: 'occupations', statement: 'Sports Promoter', riasecType: 'E' },
  { questionId: 76, category: 'occupations', statement: 'Business Owner', riasecType: 'E' },
  { questionId: 77, category: 'occupations', statement: 'Sales Manager', riasecType: 'E' },
  { questionId: 78, category: 'occupations', statement: 'Marketing Director', riasecType: 'E' },
  { questionId: 79, category: 'occupations', statement: 'Lawyer', riasecType: 'E' },
  { questionId: 80, category: 'occupations', statement: 'Political Campaign Manager', riasecType: 'E' },

  // CONVENTIONAL Activities (IDs 81-88)
  { questionId: 81, category: 'activities', statement: 'Create Excel spreadsheets for financial analysis', riasecType: 'C', kenyaContext: 'Essential skill for business and accounting' },
  { questionId: 82, category: 'activities', statement: 'Review and proofread official documents', riasecType: 'C', kenyaContext: 'Quality assurance in offices' },
  { questionId: 83, category: 'activities', statement: 'Use accounting software like QuickBooks or Sage', riasecType: 'C', kenyaContext: 'Standard in Kenyan businesses' },
  { questionId: 84, category: 'activities', statement: 'Maintain employee records and HR databases', riasecType: 'C', kenyaContext: 'HR departments in companies' },
  { questionId: 85, category: 'activities', statement: 'Analyze data and create statistical reports', riasecType: 'C', kenyaContext: 'Data analysis for decision-making' },
  { questionId: 86, category: 'activities', statement: 'Manage financial records and reconciliations', riasecType: 'C', kenyaContext: 'Banking and accounting work' },
  { questionId: 87, category: 'activities', statement: 'Process customer M-Pesa or bank transactions', riasecType: 'C', kenyaContext: 'Mobile money and banking services' },
  { questionId: 88, category: 'activities', statement: 'Track inventory and supply chain records', riasecType: 'C', kenyaContext: 'Logistics and retail management' },

  // CONVENTIONAL Occupations (IDs 89-96)
  { questionId: 89, category: 'occupations', statement: 'Accountant (CPA-K)', riasecType: 'C', kenyaContext: 'High demand, salary KSh 50K-200K' },
  { questionId: 90, category: 'occupations', statement: 'Payroll or HR Administrator', riasecType: 'C', kenyaContext: 'Essential in all companies' },
  { questionId: 91, category: 'occupations', statement: 'Executive Assistant or Office Manager', riasecType: 'C', kenyaContext: 'Professional administrative roles' },
  { questionId: 92, category: 'occupations', statement: 'Budget Analyst or Financial Planner', riasecType: 'C', kenyaContext: 'Government and corporate sectors' },
  { questionId: 93, category: 'occupations', statement: 'Accounts Clerk or Bookkeeper', riasecType: 'C', kenyaContext: 'Entry-level accounting positions' },
  { questionId: 94, category: 'occupations', statement: 'Bank Manager or Loan Officer', riasecType: 'C', kenyaContext: 'Banking sector opportunities' },
  { questionId: 95, category: 'occupations', statement: 'Credit Manager or Risk Analyst', riasecType: 'C', kenyaContext: 'Financial services sector' },
  { questionId: 96, category: 'occupations', statement: 'Retail or Supermarket Manager', riasecType: 'C', kenyaContext: 'Naivas, Carrefour, Quickmart chains' }
];

// Skills Questions Data (36 questions)
const skillsQuestions = [
  // Critical Thinking
  { questionId: 1, text: "I can analyze complex problems and break them into smaller, manageable parts", category: "Critical Thinking" },
  { questionId: 5, text: "I evaluate information from multiple sources before making decisions", category: "Critical Thinking" },
  { questionId: 9, text: "I can identify logical flaws in arguments or reasoning", category: "Critical Thinking" },
  { questionId: 13, text: "I enjoy solving puzzles and complex mental challenges", category: "Critical Thinking" },
  { questionId: 17, text: "I can synthesize information from different areas to create new understanding", category: "Critical Thinking" },
  { questionId: 21, text: "I question assumptions and look for evidence before accepting ideas", category: "Critical Thinking" },

  // Communication
  { questionId: 2, text: "I can explain complex ideas in simple terms that others understand", category: "Communication" },
  { questionId: 6, text: "I listen actively and ask clarifying questions in conversations", category: "Communication" },
  { questionId: 10, text: "I feel confident giving presentations to groups", category: "Communication" },
  { questionId: 14, text: "I can write clearly and persuasively for different audiences", category: "Communication" },
  { questionId: 18, text: "I adapt my communication style based on who I'm speaking with", category: "Communication" },
  { questionId: 22, text: "I can handle difficult conversations with tact and diplomacy", category: "Communication" },

  // Leadership
  { questionId: 3, text: "I naturally take charge when working on group projects", category: "Leadership" },
  { questionId: 7, text: "Others often come to me for guidance or advice", category: "Leadership" },
  { questionId: 11, text: "I can motivate others to work towards common goals", category: "Leadership" },
  { questionId: 15, text: "I'm comfortable making decisions when others are uncertain", category: "Leadership" },
  { questionId: 19, text: "I take responsibility for outcomes, both positive and negative", category: "Leadership" },
  { questionId: 23, text: "I can delegate tasks effectively and trust others to complete them", category: "Leadership" },

  // Technical Skills
  { questionId: 4, text: "I learn new software and technology tools quickly", category: "Technical Skills" },
  { questionId: 8, text: "I enjoy working with computers, gadgets, and technical equipment", category: "Technical Skills" },
  { questionId: 12, text: "I can troubleshoot technical problems systematically", category: "Technical Skills" },
  { questionId: 16, text: "I understand how to use data and statistics to support arguments", category: "Technical Skills" },
  { questionId: 20, text: "I'm skilled at using digital tools to organize and present information", category: "Technical Skills" },
  { questionId: 24, text: "I can follow technical instructions and procedures accurately", category: "Technical Skills" },

  // Creativity
  { questionId: 25, text: "I often come up with unique solutions to problems", category: "Creativity" },
  { questionId: 26, text: "I enjoy brainstorming and generating new ideas", category: "Creativity" },
  { questionId: 27, text: "I can see connections between seemingly unrelated concepts", category: "Creativity" },
  { questionId: 28, text: "I like to experiment with different approaches to tasks", category: "Creativity" },
  { questionId: 29, text: "I'm comfortable with ambiguity and uncertain situations", category: "Creativity" },
  { questionId: 30, text: "I can think of multiple ways to approach the same challenge", category: "Creativity" },

  // Teamwork
  { questionId: 31, text: "I work well with people from diverse backgrounds and perspectives", category: "Teamwork" },
  { questionId: 32, text: "I'm willing to compromise to reach group consensus", category: "Teamwork" },
  { questionId: 33, text: "I contribute actively to group discussions and activities", category: "Teamwork" },
  { questionId: 34, text: "I support team members when they're struggling", category: "Teamwork" },
  { questionId: 35, text: "I can manage conflicts within a team constructively", category: "Teamwork" },
  { questionId: 36, text: "I celebrate others' successes and achievements", category: "Teamwork" }
];

// Migration function
const migrateAssessments = async (config, environment = 'staging') => {
  console.log(`\n=== Elimu Smart Assessment Migration (${environment.toUpperCase()}) ===\n`);

  try {
    initializeParse(config);

    // Create RIASEC Questions
    console.log('Migrating RIASEC questions...');
    const RiasecQuestion = Parse.Object.extend('RiasecQuestion');

    for (const q of riasecQuestions) {
      const question = new RiasecQuestion();
      question.set('questionId', q.questionId);
      question.set('category', q.category);
      question.set('statement', q.statement);
      question.set('riasecType', q.riasecType);
      if (q.kenyaContext) question.set('kenyaContext', q.kenyaContext);
      question.set('isActive', true);

      await question.save(null, { useMasterKey: true });
    }
    console.log(`✓ Migrated ${riasecQuestions.length} RIASEC questions`);

    // Create Skills Questions
    console.log('Migrating Skills questions...');
    const SkillQuestion = Parse.Object.extend('SkillQuestion');

    for (const q of skillsQuestions) {
      const question = new SkillQuestion();
      question.set('questionId', q.questionId);
      question.set('text', q.text);
      question.set('category', q.category);
      question.set('isActive', true);

      await question.save(null, { useMasterKey: true });
    }
    console.log(`✓ Migrated ${skillsQuestions.length} Skills questions`);

    console.log(`\n✅ Migration completed successfully!`);
    console.log(`Total: ${riasecQuestions.length + skillsQuestions.length} questions migrated\n`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Export for use in other scripts
module.exports = { migrateAssessments, riasecQuestions, skillsQuestions };

// Run if executed directly
if (require.main === module) {
  const config = {
    appId: process.env.APP_ID || 'elimu-smart-production',
    javascriptKey: process.env.JAVASCRIPT_KEY || 'elimu-smart-js-key',
    masterKey: process.env.MASTER_KEY,
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse'
  };

  const environment = process.argv[2] || 'staging';

  migrateAssessments(config, environment)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
