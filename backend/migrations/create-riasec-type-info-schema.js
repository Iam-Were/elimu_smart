/**
 * Create RiasecTypeInfo Schema Migration
 *
 * Migrates hardcoded personality insights from frontend to Parse Class database
 * File: backend/migrations/create-riasec-type-info-schema.js
 *
 * Run: node migrations/create-riasec-type-info-schema.js
 */

const Parse = require('parse/node');
require('dotenv').config();

// Initialize Parse with master key
Parse.initialize(process.env.APP_ID, null, process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';
Parse.masterKey = process.env.MASTER_KEY;

const RIASEC_TYPE_DATA = {
  R: {
    code: 'R',
    name: 'Realistic (Doers)',
    description: 'People who prefer working with things, tools, and objects rather than people or abstract ideas.',
    workStyle: 'Hands-on and practical, prefer working with tangible objects, machinery, and tools. Value concrete results over abstract thinking. Often work independently or in small teams on technical projects.',
    strengths: [
      'Problem-solving with tools',
      'Physical coordination',
      'Technical skills',
      'Mechanical reasoning'
    ],
    motivators: [
      'Tangible results',
      'Working with hands',
      'Outdoor activities',
      'Building things'
    ],
    teamRole: 'The Builder - brings practical solutions and technical expertise',
    famousKenyans: [
      'Mbithi Masya (Engineer)',
      'Philip Nyakiamo (Tech Innovator)',
      'James Macharia (Infrastructure)'
    ],
    learningStyle: 'Learning by doing - prefer hands-on practice over theory',
    decisionMaking: 'Practical and logical - focus on what works in real situations'
  },
  I: {
    code: 'I',
    name: 'Investigative (Thinkers)',
    description: 'People who enjoy working with ideas, data, and information. They prefer observation, research, and analysis.',
    workStyle: 'Analytical and curious, prefer working with abstract ideas, research, and data. Value intellectual challenges and problem-solving. Often work independently on complex theoretical projects.',
    strengths: [
      'Analytical thinking',
      'Research abilities',
      'Scientific reasoning',
      'Mathematical skills'
    ],
    motivators: [
      'Solving complex problems',
      'Discovery and innovation',
      'Understanding how things work',
      'Intellectual challenges'
    ],
    teamRole: 'The Analyst - brings critical thinking and research-driven insights',
    famousKenyans: [
      'Prof. Wangari Maathai (Environmental Scientist)',
      'Prof. Ruth Nita Barrow (Medical Researcher)',
      'Dr. Calestous Juma (Innovation Scholar)'
    ],
    learningStyle: 'Learning through investigation - prefer deep analysis before action',
    decisionMaking: 'Data-driven and methodical - require evidence before conclusions'
  },
  A: {
    code: 'A',
    name: 'Artistic (Creators)',
    description: 'People who value creativity, self-expression, and innovation. They prefer unstructured environments where they can create.',
    workStyle: 'Creative and expressive, prefer working with ideas, design, and artistic media. Value originality and innovation. Often work independently on creative projects with flexible deadlines.',
    strengths: [
      'Creative thinking',
      'Artistic expression',
      'Innovation',
      'Design skills'
    ],
    motivators: [
      'Self-expression',
      'Creating something new',
      'Freedom to innovate',
      'Aesthetic beauty'
    ],
    teamRole: 'The Innovator - brings fresh perspectives and creative solutions',
    famousKenyans: [
      'Lupita Nyong\'o (Actress)',
      'Eric Wainaina (Musician)',
      'Wangechi Mutu (Artist)'
    ],
    learningStyle: 'Learning through exploration - prefer creative experimentation',
    decisionMaking: 'Intuitive and imaginative - trust instincts and creative vision'
  },
  S: {
    code: 'S',
    name: 'Social (Helpers)',
    description: 'People who enjoy working with people to help, teach, or care for them. They value human connection and community.',
    workStyle: 'People-oriented and empathetic, prefer working directly with others to teach, care, or support. Value relationships and community impact. Often work in collaborative environments with frequent human interaction.',
    strengths: [
      'Interpersonal communication',
      'Empathy',
      'Teaching abilities',
      'Conflict resolution'
    ],
    motivators: [
      'Helping others',
      'Making a difference',
      'Building relationships',
      'Community impact'
    ],
    teamRole: 'The Connector - builds team cohesion and supports others',
    famousKenyans: [
      'Dr. Khama Rogo (Public Health Leader)',
      'Juliana Rotich (Social Entrepreneur)',
      'Boniface Mwangi (Social Activist)'
    ],
    learningStyle: 'Learning through collaboration - prefer group discussions and mentorship',
    decisionMaking: 'Values-based and collaborative - consider impact on people first'
  },
  E: {
    code: 'E',
    name: 'Enterprising (Persuaders)',
    description: 'People who enjoy leading, persuading, and managing others. They value status, power, and economic achievement.',
    workStyle: 'Goal-oriented and persuasive, prefer leading projects, managing teams, and driving business results. Value achievement and influence. Often work in competitive environments with clear success metrics.',
    strengths: [
      'Leadership',
      'Persuasion',
      'Strategic thinking',
      'Business acumen'
    ],
    motivators: [
      'Achievement',
      'Influence',
      'Competition',
      'Financial success'
    ],
    teamRole: 'The Leader - drives vision and motivates teams to achieve goals',
    famousKenyans: [
      'James Mwangi (Equity Bank CEO)',
      'Tabitha Karanja (Keroche Breweries)',
      'Chris Kirubi (Business Magnate)'
    ],
    learningStyle: 'Learning through action - prefer real-world application over theory',
    decisionMaking: 'Results-oriented and strategic - focus on outcomes and ROI'
  },
  C: {
    code: 'C',
    name: 'Conventional (Organizers)',
    description: 'People who prefer structure, order, and clear rules. They value accuracy, efficiency, and systematic approaches.',
    workStyle: 'Detail-oriented and organized, prefer working with data, systems, and established procedures. Value accuracy and efficiency. Often work in structured environments with clear processes and expectations.',
    strengths: [
      'Attention to detail',
      'Organization',
      'Data management',
      'Process efficiency'
    ],
    motivators: [
      'Order and structure',
      'Accuracy',
      'Clear expectations',
      'System optimization'
    ],
    teamRole: 'The Organizer - ensures quality, compliance, and systematic execution',
    famousKenyans: [
      'Betty Maina (Industry Standards)',
      'Patrick Njoroge (Central Bank Governor)',
      'Nancy Gitau (Financial Systems)'
    ],
    learningStyle: 'Learning through structure - prefer step-by-step systematic instruction',
    decisionMaking: 'Methodical and rule-based - follow proven processes and standards'
  }
};

async function createRiasecTypeInfoSchema() {
  console.log('🔧 Creating RiasecTypeInfo schema and seeding data...\n');

  try {
    // Create schema using dummy object pattern (since Schema API often fails)
    const RiasecTypeInfo = Parse.Object.extend('RiasecTypeInfo');

    // Check if data already exists
    const query = new Parse.Query(RiasecTypeInfo);
    const existingCount = await query.count({ useMasterKey: true });

    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing RiasecTypeInfo records`);
      console.log('   Delete existing records? This will re-seed all data.\n');

      // Delete existing records
      const existingRecords = await query.limit(10).find({ useMasterKey: true });
      await Parse.Object.destroyAll(existingRecords, { useMasterKey: true });
      console.log('✅ Deleted existing records\n');
    }

    // Seed all 6 RIASEC types
    const savedRecords = [];
    for (const [typeCode, typeData] of Object.entries(RIASEC_TYPE_DATA)) {
      const typeInfo = new RiasecTypeInfo();

      typeInfo.set('code', typeData.code);
      typeInfo.set('name', typeData.name);
      typeInfo.set('description', typeData.description);
      typeInfo.set('workStyle', typeData.workStyle);
      typeInfo.set('strengths', typeData.strengths);
      typeInfo.set('motivators', typeData.motivators);
      typeInfo.set('teamRole', typeData.teamRole);
      typeInfo.set('famousKenyans', typeData.famousKenyans);
      typeInfo.set('learningStyle', typeData.learningStyle);
      typeInfo.set('decisionMaking', typeData.decisionMaking);
      typeInfo.set('isActive', true); // For future deactivation if needed

      const saved = await typeInfo.save(null, { useMasterKey: true });
      savedRecords.push(saved);

      console.log(`✅ Seeded ${typeData.code} - ${typeData.name}`);
    }

    console.log(`\n🎉 Successfully created RiasecTypeInfo schema and seeded ${savedRecords.length} types`);

    // Verify data
    console.log('\n📊 Verification:');
    const verifyQuery = new Parse.Query(RiasecTypeInfo);
    verifyQuery.select(['code', 'name']);
    const all = await verifyQuery.find({ useMasterKey: true });

    all.forEach(type => {
      console.log(`   - ${type.get('code')}: ${type.get('name')}`);
    });

    console.log('\n✨ Migration complete! Frontend can now fetch personality insights from backend.');

  } catch (error) {
    console.error('❌ Error creating RiasecTypeInfo schema:', error);
    throw error;
  }
}

// Run migration
createRiasecTypeInfoSchema()
  .then(() => {
    console.log('\n👍 Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
