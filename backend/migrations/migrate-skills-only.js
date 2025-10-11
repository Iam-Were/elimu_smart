/**
 * Skills Questions Migration Script
 * Migrates only Skills questions to production database
 * (RIASEC already migrated with 96 questions)
 */

const Parse = require('parse/node');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize Parse for production
Parse.initialize(
  process.env.APP_ID || 'elimu-smart-production',
  'javascript_key_2024',
  process.env.MASTER_KEY || 'ElImuSmartMasterKey2024Secure'
);
Parse.serverURL = 'http://localhost:1337/parse';

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

async function migrateSkills() {
  console.log('🚀 Starting Skills Questions Migration...\n');
  console.log('📍 Parse Server: http://localhost:1337/parse');
  console.log(`📦 App ID: ${process.env.APP_ID}\n`);

  try {
    // Check if skills questions already exist
    const SkillQuestion = Parse.Object.extend('SkillQuestion');
    const checkQuery = new Parse.Query(SkillQuestion);
    const existingCount = await checkQuery.count({ useMasterKey: true });

    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing Skills questions`);
      console.log('   Skipping migration to avoid duplicates\n');
      return;
    }

    console.log('📊 Migrating Skills questions...');
    let created = 0;
    let skipped = 0;

    for (const q of skillsQuestions) {
      // Check if question already exists by questionId
      const checkQuery = new Parse.Query(SkillQuestion);
      checkQuery.equalTo('questionId', q.questionId);
      const existing = await checkQuery.first({ useMasterKey: true });

      if (existing) {
        skipped++;
        continue;
      }

      const question = new SkillQuestion();
      question.set('questionId', q.questionId);
      question.set('text', q.text);
      question.set('category', q.category);
      question.set('isActive', true);

      await question.save(null, { useMasterKey: true });
      created++;

      if ((created + skipped) % 6 === 0) {
        console.log(`   ✓ Processed ${created + skipped}/${skillsQuestions.length} questions (${created} new, ${skipped} existing)...`);
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   Created: ${created} new questions`);
    console.log(`   Skipped: ${skipped} existing questions`);

    console.log(`\n✅ Migration Complete!`);
    console.log(`   Created: ${created} Skills questions`);
    console.log(`   Categories: 6 (Critical Thinking, Communication, Leadership, Technical Skills, Creativity, Teamwork)`);

    // Verify migration
    const verifyQuery = new Parse.Query(SkillQuestion);
    const finalCount = await verifyQuery.count({ useMasterKey: true });
    console.log(`\n🔍 Verification: ${finalCount} questions in database`);

    if (finalCount === skillsQuestions.length) {
      console.log('✅ All questions migrated successfully!\n');
    } else {
      console.log(`⚠️  Expected ${skillsQuestions.length}, found ${finalCount}\n`);
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    throw error;
  }
}

// Run migration
if (require.main === module) {
  migrateSkills()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { migrateSkills, skillsQuestions };
