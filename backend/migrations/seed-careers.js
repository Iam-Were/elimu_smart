/**
 * Migration: Seed Career Database
 *
 * Extracts career data from SubjectCareerMapper and seeds Parse Career class
 * Source: frontend/src/components/assessments/SubjectCareerMapper.tsx (466 lines)
 */

require('dotenv').config();
const Parse = require('parse/node');

const environment = process.argv[2] || 'production';

// Parse Server configuration
const parseConfig = {
  production: {
    serverURL: process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse',
    appId: process.env.APP_ID,
    masterKey: process.env.MASTER_KEY
  },
  staging: {
    serverURL: process.env.STAGING_PARSE_SERVER_URL || 'http://localhost:1338/parse',
    appId: process.env.STAGING_APP_ID || process.env.APP_ID,
    masterKey: process.env.STAGING_MASTER_KEY || process.env.MASTER_KEY
  }
};

const config = parseConfig[environment];

Parse.initialize(config.appId, null, config.masterKey);
Parse.serverURL = config.serverURL;

// Career data extracted from frontend (SubjectCareerMapper.tsx)
const CAREER_DATA = {
  'Mathematics': {
    category: 'STEM',
    careers: [
      { title: 'Data Scientist', match: 95, description: 'Use mathematical models to analyze complex data for businesses', salary: 'KSh 90,000 - 250,000', demand: 'Very High', pathway: 'Statistics/Computer Science degree', skills: ['Statistics', 'Programming', 'Research'], minClusterPoints: 72, employmentRate: 0.88, avgSalary: 170000 },
      { title: 'Software Engineer', match: 88, description: 'Design and develop software applications and systems', salary: 'KSh 80,000 - 200,000', demand: 'Very High', pathway: 'Computer Science degree', skills: ['Programming', 'Logic', 'Problem Solving'], minClusterPoints: 68, employmentRate: 0.92, avgSalary: 140000 },
      { title: 'Actuary', match: 92, description: 'Assess financial risks using mathematics and statistics', salary: 'KSh 80,000 - 200,000', demand: 'High', pathway: 'Actuarial Science degree', skills: ['Risk Analysis', 'Statistics', 'Financial Modeling'], minClusterPoints: 75, employmentRate: 0.85, avgSalary: 140000 },
      { title: 'Quantity Surveyor', match: 85, description: 'Manage construction project costs and contracts', salary: 'KSh 70,000 - 180,000', demand: 'High', pathway: 'Quantity Surveying degree', skills: ['Cost Estimation', 'Math', 'Construction Knowledge'], minClusterPoints: 60, employmentRate: 0.80, avgSalary: 125000 },
      { title: 'Financial Analyst', match: 90, description: 'Analyze financial data to guide business decisions', salary: 'KSh 65,000 - 150,000', demand: 'Very High', pathway: 'Finance/Economics degree', skills: ['Financial Modeling', 'Data Analysis', 'Excel'], minClusterPoints: 65, employmentRate: 0.87, avgSalary: 107500 }
    ]
  },
  'English': {
    category: 'Arts & Communication',
    careers: [
      { title: 'Digital Marketing Manager', match: 90, description: 'Create and manage online marketing campaigns', salary: 'KSh 60,000 - 150,000', demand: 'Very High', pathway: 'Marketing/Communications degree', skills: ['Content Creation', 'Social Media', 'Analytics'], minClusterPoints: 55, employmentRate: 0.83, avgSalary: 105000 },
      { title: 'Journalist', match: 88, description: 'Research and report news and stories for media outlets', salary: 'KSh 45,000 - 120,000', demand: 'Medium', pathway: 'Journalism/Communications degree', skills: ['Writing', 'Research', 'Interviewing'], minClusterPoints: 50, employmentRate: 0.65, avgSalary: 82500 },
      { title: 'Content Creator', match: 85, description: 'Develop engaging content for various digital platforms', salary: 'KSh 40,000 - 100,000', demand: 'High', pathway: 'Communications/Media Studies degree', skills: ['Creativity', 'Writing', 'Video Production'], minClusterPoints: 45, employmentRate: 0.75, avgSalary: 70000 },
      { title: 'Public Relations Officer', match: 87, description: 'Manage organizational reputation and communication', salary: 'KSh 50,000 - 130,000', demand: 'High', pathway: 'Communications/PR degree', skills: ['Communication', 'Crisis Management', 'Media Relations'], minClusterPoints: 52, employmentRate: 0.78, avgSalary: 90000 },
      { title: 'Copywriter', match: 83, description: 'Write persuasive content for advertising and marketing', salary: 'KSh 45,000 - 110,000', demand: 'High', pathway: 'Marketing/Communications degree', skills: ['Creative Writing', 'Persuasion', 'Marketing'], minClusterPoints: 48, employmentRate: 0.72, avgSalary: 77500 }
    ]
  },
  'Physics': {
    category: 'STEM',
    careers: [
      { title: 'Mechanical Engineer', match: 95, description: 'Design and develop mechanical systems and machinery', salary: 'KSh 70,000 - 190,000', demand: 'Very High', pathway: 'Mechanical Engineering degree', skills: ['CAD Design', 'Mechanics', 'Problem Solving'], minClusterPoints: 70, employmentRate: 0.90, avgSalary: 130000 },
      { title: 'Electrical Engineer', match: 93, description: 'Design electrical systems and equipment', salary: 'KSh 75,000 - 200,000', demand: 'Very High', pathway: 'Electrical Engineering degree', skills: ['Circuit Design', 'Electronics', 'Power Systems'], minClusterPoints: 72, employmentRate: 0.88, avgSalary: 137500 },
      { title: 'Renewable Energy Engineer', match: 90, description: 'Develop solar, wind, and sustainable energy solutions', salary: 'KSh 80,000 - 180,000', demand: 'Very High', pathway: 'Renewable Energy/Electrical Engineering degree', skills: ['Solar Systems', 'Energy Analysis', 'Sustainability'], minClusterPoints: 68, employmentRate: 0.85, avgSalary: 130000 },
      { title: 'Telecommunications Engineer', match: 88, description: 'Design and maintain communication networks', salary: 'KSh 70,000 - 170,000', demand: 'High', pathway: 'Telecommunications Engineering degree', skills: ['Network Design', 'RF Engineering', 'Systems Analysis'], minClusterPoints: 65, employmentRate: 0.82, avgSalary: 120000 }
    ]
  },
  'Chemistry': {
    category: 'STEM',
    careers: [
      { title: 'Pharmacist', match: 95, description: 'Dispense medications and provide pharmaceutical care', salary: 'KSh 80,000 - 200,000', demand: 'Very High', pathway: 'Pharmacy degree', skills: ['Drug Knowledge', 'Patient Care', 'Chemistry'], minClusterPoints: 75, employmentRate: 0.92, avgSalary: 140000 },
      { title: 'Quality Control Analyst', match: 90, description: 'Test products for quality and safety standards', salary: 'KSh 60,000 - 140,000', demand: 'High', pathway: 'Chemistry/Industrial Chemistry degree', skills: ['Lab Analysis', 'Quality Assurance', 'Attention to Detail'], minClusterPoints: 62, employmentRate: 0.85, avgSalary: 100000 },
      { title: 'Chemical Engineer', match: 92, description: 'Design chemical manufacturing processes', salary: 'KSh 85,000 - 220,000', demand: 'High', pathway: 'Chemical Engineering degree', skills: ['Process Design', 'Chemistry', 'Math'], minClusterPoints: 75, employmentRate: 0.83, avgSalary: 152500 },
      { title: 'Food Scientist', match: 85, description: 'Develop and test food products for quality and nutrition', salary: 'KSh 55,000 - 130,000', demand: 'Medium', pathway: 'Food Science/Technology degree', skills: ['Food Analysis', 'Nutrition', 'Product Development'], minClusterPoints: 58, employmentRate: 0.75, avgSalary: 92500 }
    ]
  },
  'Biology': {
    category: 'Medical & Life Sciences',
    careers: [
      { title: 'Doctor/Physician', match: 98, description: 'Diagnose and treat illnesses and injuries', salary: 'KSh 150,000 - 400,000', demand: 'Very High', pathway: 'Medicine degree (MBChB)', skills: ['Medical Knowledge', 'Diagnosis', 'Patient Care'], minClusterPoints: 84, employmentRate: 0.98, avgSalary: 275000 },
      { title: 'Nurse', match: 95, description: 'Provide patient care and medical support', salary: 'KSh 45,000 - 120,000', demand: 'Very High', pathway: 'Nursing degree/Diploma', skills: ['Patient Care', 'Medical Procedures', 'Compassion'], minClusterPoints: 50, employmentRate: 0.95, avgSalary: 82500 },
      { title: 'Biomedical Scientist', match: 93, description: 'Conduct medical research and laboratory analysis', salary: 'KSh 70,000 - 180,000', demand: 'High', pathway: 'Biomedical Sciences degree', skills: ['Lab Research', 'Analysis', 'Biology'], minClusterPoints: 72, employmentRate: 0.88, avgSalary: 125000 },
      { title: 'Veterinarian', match: 92, description: 'Diagnose and treat animal health issues', salary: 'KSh 80,000 - 200,000', demand: 'High', pathway: 'Veterinary Medicine degree', skills: ['Animal Care', 'Surgery', 'Diagnosis'], minClusterPoints: 78, employmentRate: 0.87, avgSalary: 140000 },
      { title: 'Environmental Scientist', match: 88, description: 'Study environmental issues and develop solutions', salary: 'KSh 60,000 - 150,000', demand: 'Medium', pathway: 'Environmental Science degree', skills: ['Research', 'Data Analysis', 'Conservation'], minClusterPoints: 60, employmentRate: 0.78, avgSalary: 105000 }
    ]
  },
  'Business Studies': {
    category: 'Business & Economics',
    careers: [
      { title: 'Business Analyst', match: 93, description: 'Analyze business processes and recommend improvements', salary: 'KSh 70,000 - 180,000', demand: 'Very High', pathway: 'Business Administration degree', skills: ['Data Analysis', 'Problem Solving', 'Communication'], minClusterPoints: 58, employmentRate: 0.88, avgSalary: 125000 },
      { title: 'Accountant', match: 92, description: 'Manage financial records and prepare reports', salary: 'KSh 55,000 - 150,000', demand: 'Very High', pathway: 'Accounting/CPA degree', skills: ['Accounting', 'Attention to Detail', 'Financial Analysis'], minClusterPoints: 55, employmentRate: 0.90, avgSalary: 102500 },
      { title: 'Human Resources Manager', match: 90, description: 'Manage recruitment, training, and employee relations', salary: 'KSh 65,000 - 170,000', demand: 'High', pathway: 'HR Management degree', skills: ['People Management', 'Communication', 'Conflict Resolution'], minClusterPoints: 52, employmentRate: 0.82, avgSalary: 117500 },
      { title: 'Entrepreneur/Business Owner', match: 88, description: 'Start and manage your own business ventures', salary: 'Variable (KSh 50,000+)', demand: 'High', pathway: 'Business Management degree + experience', skills: ['Leadership', 'Innovation', 'Risk Management'], minClusterPoints: 45, employmentRate: 0.70, avgSalary: 100000 },
      { title: 'Supply Chain Manager', match: 87, description: 'Coordinate logistics and supply chain operations', salary: 'KSh 70,000 - 160,000', demand: 'High', pathway: 'Supply Chain/Logistics degree', skills: ['Logistics', 'Planning', 'Negotiation'], minClusterPoints: 55, employmentRate: 0.85, avgSalary: 115000 }
    ]
  },
  'Computer Studies': {
    category: 'STEM',
    careers: [
      { title: 'Full-Stack Developer', match: 95, description: 'Build complete web applications (frontend + backend)', salary: 'KSh 80,000 - 220,000', demand: 'Very High', pathway: 'Computer Science/IT degree', skills: ['JavaScript', 'React', 'Node.js', 'Databases'], minClusterPoints: 65, employmentRate: 0.93, avgSalary: 150000 },
      { title: 'Cybersecurity Analyst', match: 93, description: 'Protect systems from cyber threats and attacks', salary: 'KSh 90,000 - 250,000', demand: 'Very High', pathway: 'Computer Science/Cybersecurity degree', skills: ['Network Security', 'Ethical Hacking', 'Risk Analysis'], minClusterPoints: 68, employmentRate: 0.90, avgSalary: 170000 },
      { title: 'Mobile App Developer', match: 92, description: 'Create applications for iOS and Android devices', salary: 'KSh 75,000 - 200,000', demand: 'Very High', pathway: 'Computer Science/Mobile Development degree', skills: ['Swift/Kotlin', 'React Native', 'UI/UX'], minClusterPoints: 63, employmentRate: 0.88, avgSalary: 137500 },
      { title: 'Cloud Engineer', match: 91, description: 'Design and manage cloud infrastructure (AWS, Azure)', salary: 'KSh 100,000 - 280,000', demand: 'Very High', pathway: 'Computer Science/IT degree', skills: ['AWS/Azure', 'DevOps', 'Networking'], minClusterPoints: 70, employmentRate: 0.92, avgSalary: 190000 },
      { title: 'IT Support Specialist', match: 85, description: 'Provide technical support and troubleshooting', salary: 'KSh 40,000 - 100,000', demand: 'High', pathway: 'IT/Computer Science diploma/degree', skills: ['Troubleshooting', 'Hardware', 'Customer Service'], minClusterPoints: 48, employmentRate: 0.85, avgSalary: 70000 }
    ]
  },
  'Agriculture': {
    category: 'Agriculture & Environment',
    careers: [
      { title: 'Agribusiness Manager', match: 92, description: 'Manage agricultural business operations and marketing', salary: 'KSh 60,000 - 160,000', demand: 'High', pathway: 'Agribusiness/Agricultural Economics degree', skills: ['Business Management', 'Marketing', 'Agriculture'], minClusterPoints: 55, employmentRate: 0.80, avgSalary: 110000 },
      { title: 'Agricultural Extension Officer', match: 90, description: 'Educate farmers on modern farming techniques', salary: 'KSh 45,000 - 110,000', demand: 'High', pathway: 'Agricultural Education/Extension degree', skills: ['Communication', 'Training', 'Agricultural Knowledge'], minClusterPoints: 48, employmentRate: 0.82, avgSalary: 77500 },
      { title: 'Horticulturist', match: 88, description: 'Specialize in growing fruits, vegetables, and flowers', salary: 'KSh 50,000 - 130,000', demand: 'Medium', pathway: 'Horticulture degree', skills: ['Plant Science', 'Crop Management', 'Pest Control'], minClusterPoints: 50, employmentRate: 0.75, avgSalary: 90000 },
      { title: 'Food Production Manager', match: 87, description: 'Oversee food processing and quality control', salary: 'KSh 65,000 - 150,000', demand: 'Medium', pathway: 'Food Technology/Agriculture degree', skills: ['Food Safety', 'Production Management', 'Quality Control'], minClusterPoints: 58, employmentRate: 0.78, avgSalary: 107500 }
    ]
  }
};

async function seedCareers() {
  console.log(`\n🌱 Seeding Career database for ${environment} environment...\n`);

  try {
    const Career = Parse.Object.extend('Career');
    let createdCount = 0;
    let updatedCount = 0;

    for (const [subject, data] of Object.entries(CAREER_DATA)) {
      console.log(`\n📚 Processing ${subject} careers...`);

      for (const careerData of data.careers) {
        // Check if career already exists
        const query = new Parse.Query(Career);
        query.equalTo('title', careerData.title);
        const existing = await query.first({ useMasterKey: true });

        let career;
        if (existing) {
          career = existing;
          updatedCount++;
          console.log(`  ↻ Updating: ${careerData.title}`);
        } else {
          career = new Career();
          createdCount++;
          console.log(`  + Creating: ${careerData.title}`);
        }

        // Set all fields
        career.set('title', careerData.title);
        career.set('category', data.category);
        career.set('relatedSubjects', [subject]); // Single subject
        career.set('matchScore', careerData.match);
        career.set('description', careerData.description);
        career.set('salaryRange', careerData.salary);
        career.set('demand', careerData.demand);
        career.set('kuccpsPathway', careerData.pathway);
        career.set('skills', careerData.skills);
        career.set('minClusterPoints', careerData.minClusterPoints || 50);
        career.set('employmentRate', careerData.employmentRate || 0.75);
        career.set('avgSalary', careerData.avgSalary || 100000);
        career.set('searchKeywords',
          `${careerData.title} ${subject} ${data.category} ${careerData.description}`.toLowerCase()
        );
        career.set('isActive', true);

        // Set public read ACL
        const acl = new Parse.ACL();
        acl.setPublicReadAccess(true);
        acl.setRoleWriteAccess('admin', true);
        career.setACL(acl);

        await career.save(null, { useMasterKey: true });
      }
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   📊 Created: ${createdCount} careers`);
    console.log(`   ↻ Updated: ${updatedCount} careers`);
    console.log(`   📁 Total: ${createdCount + updatedCount} careers`);
    console.log(`\n💡 Careers are now queryable via:`);
    console.log(`   - Parse.Cloud.run('getCareersBySubject', { subject: 'Mathematics' })`);
    console.log(`   - Parse.Cloud.run('searchCareers', { query: 'engineer' })`);

    return true;

  } catch (error) {
    console.error('❌ Error seeding careers:', error);
    throw error;
  }
}

// Run migration
seedCareers()
  .then(() => {
    console.log('\n🎉 Career database seeding completed successfully\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
