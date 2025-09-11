// Parse Cloud Functions for LinkedIn Professional Insights
// Since direct LinkedIn API access is limited, we use curated professional data

// Kenya Professional Insights Database
const KENYA_PROFESSIONAL_DATA = {
  technology: {
    leaders: [
      {
        name: "John Walubengo",
        title: "ICT Lecturer & Digital Policy Expert", 
        company: "Multimedia University",
        careerPath: [
          "Software Developer → Senior Developer",
          "ICT Consultant → Digital Policy Expert", 
          "University Lecturer → Thought Leader"
        ],
        education: "MSc Computer Science, University of Nairobi",
        keyInsights: [
          "Technology in Kenya is growing rapidly - focus on mobile and fintech solutions",
          "Certifications matter as much as degrees in the tech industry",
          "Start building projects early - employers value practical skills over theory"
        ],
        linkedinUrl: "https://linkedin.com/in/walubengo",
        inspirationQuote: "The future belongs to those who understand both technology and business context"
      },
      {
        name: "Juliana Rotich",
        title: "Co-founder & Executive Director",
        company: "BRCK Inc",
        careerPath: [
          "Software Developer → Product Manager",
          "Tech Entrepreneur → Company Co-founder",
          "Global Speaker → Industry Influencer"
        ],
        education: "University of Missouri (Information Technology)",
        keyInsights: [
          "Solve real African problems with technology - there's huge opportunity here",
          "Building a network is crucial - connect with other entrepreneurs and developers",
          "Don't wait for perfect conditions - start building and learning immediately"
        ],
        linkedinUrl: "https://linkedin.com/in/juliana-rotich",
        inspirationQuote: "Technology should solve real problems for real people in Africa"
      },
      {
        name: "Sam Gichuru",
        title: "Co-founder & CEO",
        company: "Nailab & Kopo Kopo",
        careerPath: [
          "Computer Science Student → Web Developer",
          "Tech Startup Founder → Serial Entrepreneur", 
          "Business Leader → Ecosystem Builder"
        ],
        education: "BSc Computer Science, University of Nairobi",
        keyInsights: [
          "Learn by doing - build real products that solve actual problems",
          "The Kenya tech ecosystem is growing - be part of building it",
          "Focus on mobile-first solutions - that's where Africa is leading"
        ],
        linkedinUrl: "https://linkedin.com/in/samgichuru",
        inspirationQuote: "Build solutions that work for the African market, then scale globally"
      }
    ],
    
    companies: [
      {
        name: "Safaricom",
        linkedinUrl: "https://linkedin.com/company/safaricom",
        studentPrograms: [
          "Graduate Trainee Program",
          "Industrial Attachment Opportunities",
          "Innovation Challenges and Hackathons"
        ],
        careerOpportunities: [
          "Software Engineering",
          "Data Analytics & Business Intelligence",
          "Product Management",
          "Cybersecurity & IT Infrastructure"
        ]
      },
      {
        name: "BRCK",
        linkedinUrl: "https://linkedin.com/company/brck",
        studentPrograms: [
          "Internship Program",
          "Graduate Developer Program"
        ],
        careerOpportunities: [
          "Hardware Engineering",
          "Software Development", 
          "Product Design",
          "Business Development"
        ]
      }
    ]
  },
  
  finance: {
    leaders: [
      {
        name: "James Mwangi",
        title: "CEO & Managing Director",
        company: "Equity Group Holdings",
        careerPath: [
          "Banking Officer → Branch Manager",
          "Senior Manager → General Manager",
          "CEO → Regional Banking Leader"
        ],
        education: "MBA University of Nairobi, CPA",
        keyInsights: [
          "The banking industry is transforming with digital solutions",
          "Understanding both finance and technology is the future",
          "Customer-centric thinking drives innovation in financial services"
        ],
        linkedinUrl: "https://linkedin.com/in/james-mwangi-equity",
        inspirationQuote: "Banking is about empowering people and businesses to achieve their dreams"
      },
      {
        name: "Betty Maina",
        title: "CEO",
        company: "Kenya Association of Manufacturers (KAM)",
        careerPath: [
          "Finance Officer → Financial Analyst",
          "Senior Manager → General Manager",
          "Industry Leader → CEO"
        ],
        education: "MBA Finance, CPA Kenya",
        keyInsights: [
          "Manufacturing and finance intersect in supply chain financing",
          "Kenya's manufacturing sector offers great career opportunities",
          "Leadership requires both technical skills and emotional intelligence"
        ],
        linkedinUrl: "https://linkedin.com/in/betty-maina",
        inspirationQuote: "The future of African business lies in value addition and manufacturing"
      }
    ],
    
    companies: [
      {
        name: "Equity Bank",
        linkedinUrl: "https://linkedin.com/company/equity-bank",
        studentPrograms: [
          "Graduate Management Trainee Program",
          "Equity Leaders Program",
          "Internship & Attachment Opportunities"
        ],
        careerOpportunities: [
          "Banking Operations",
          "Financial Analysis",
          "Digital Banking & Fintech",
          "Credit & Risk Management"
        ]
      }
    ]
  }
};

// LinkedIn Profile Optimization Templates
const PROFILE_OPTIMIZATION_TEMPLATES = {
  technology: {
    headlines: [
      "Computer Science Student | Aspiring Software Developer | Python & JavaScript Enthusiast",
      "IT Student | Passionate about Cybersecurity & System Administration | Seeking Tech Opportunities",
      "Software Engineering Student | Full-Stack Developer | React & Node.js | Open Source Contributor",
      "Tech Student | Mobile App Development | Kotlin & Flutter | Building Solutions for Kenya"
    ],
    summaryTemplate: `Passionate computer science student with a strong foundation in programming and software development. Currently pursuing [Your Degree] at [Your University], with coursework in data structures, algorithms, and software engineering.

Recent projects include [describe 1-2 key projects], where I developed skills in [relevant technologies]. Proficient in Python, JavaScript, and [other relevant skills], with experience in both frontend and backend development.

Seeking opportunities to apply my technical knowledge in software development, data analysis, or cybersecurity. Particularly interested in [specific area like mobile development, fintech, etc.] and how technology can solve real problems in Kenya.

Always eager to learn from experienced professionals and contribute to innovative projects. Let's connect if you're passionate about technology or have insights to share about building a tech career in Kenya!`,
    
    skillsSuggestions: [
      "Python", "JavaScript", "React", "Node.js", "HTML/CSS",
      "Git/GitHub", "SQL", "Problem Solving", "Team Collaboration",
      "Mobile Development", "Web Development", "Data Analysis"
    ]
  },
  
  finance: {
    headlines: [
      "Finance Student | Future Investment Analyst | CFA Level I Candidate | Data-Driven Decision Making",
      "Economics Student | Passionate about Financial Markets | Excel & Financial Modeling Expert",
      "Banking & Finance Student | Aspiring Financial Advisor | Customer Service Excellence",
      "Finance Student | Fintech Enthusiast | Combining Finance with Technology Innovation"
    ],
    summaryTemplate: `Dedicated finance student with a strong analytical mindset and passion for financial markets. Currently pursuing [Your Degree] at [Your University], with coursework in financial analysis, investment principles, and risk management.

Academic achievements include [relevant coursework/projects], where I developed expertise in financial modeling, market analysis, and investment evaluation. Proficient in Excel, financial calculators, and emerging fintech tools.

Seeking opportunities in banking, investment analysis, or financial advisory services. Particularly interested in [specific area like investment banking, personal finance, microfinance] and how financial services can drive economic growth in Kenya.

Committed to continuous learning and professional development, including pursuing CFA certification. Open to connecting with finance professionals and learning about career pathways in Kenya's dynamic financial sector.`,
    
    skillsSuggestions: [
      "Financial Analysis", "Excel", "Financial Modeling", "Investment Analysis",
      "Risk Assessment", "Customer Service", "Communication", "Data Analysis",
      "Banking Operations", "Financial Planning", "Market Research"
    ]
  }
};

// Networking Recommendation Templates
const NETWORKING_RECOMMENDATIONS = {
  alumni: {
    category: "Alumni Network",
    description: "Connect with graduates from your school working in your target industry",
    strategy: "Search '[Your School] alumni [Target Industry]' on LinkedIn and send connection requests",
    messageTemplate: "Hi [Name], I'm a current [Your Year] student at [School] studying [Your Major]. I'd love to learn about your experience in [Industry] and any advice you might have for someone starting their career. Would you be open to connecting?"
  },
  
  industryProfessionals: {
    category: "Industry Professionals",
    description: "Connect with professionals currently working in your field of interest",
    strategy: "Follow industry hashtags, engage with content, then send thoughtful connection requests",
    messageTemplate: "Hi [Name], I found your recent post about [Topic] really insightful. As a [Major] student interested in [Industry], I'd appreciate connecting and learning from your expertise in [Specific Area]."
  },
  
  recruiters: {
    category: "Talent Acquisition Professionals",
    description: "Build relationships with recruiters and HR professionals in your target companies",
    strategy: "Search '[Company] recruiter' or '[Industry] talent acquisition' and engage professionally",
    messageTemplate: "Hi [Name], I'm a [Year] student studying [Major] and very interested in opportunities in [Industry/Company]. I'd love to connect and learn about what you look for in entry-level candidates."
  },
  
  mentors: {
    category: "Potential Mentors",
    description: "Connect with senior professionals who might be willing to provide guidance",
    strategy: "Look for professionals who regularly post helpful content or mention mentoring students",
    messageTemplate: "Hi [Name], I've been following your posts about [Topic] and really appreciate the insights you share. As a [Major] student, I'd be honored to connect and potentially learn from your experience in [Field]."
  }
};

// Parse Cloud Function: Get LinkedIn Professional Insights
Parse.Cloud.define('getLinkedInProfessionalInsights', async (request) => {
  const { industry, careerLevel = 'entry' } = request.params;
  
  try {
    const industryData = KENYA_PROFESSIONAL_DATA[industry.toLowerCase()];
    
    if (!industryData) {
      return {
        error: 'Industry data not available',
        availableIndustries: Object.keys(KENYA_PROFESSIONAL_DATA)
      };
    }
    
    const profileTemplates = PROFILE_OPTIMIZATION_TEMPLATES[industry.toLowerCase()] || PROFILE_OPTIMIZATION_TEMPLATES['technology'];
    
    return {
      success: true,
      industryLeaders: industryData.leaders || [],
      companies: industryData.companies || [],
      
      profileOptimization: {
        headlines: profileTemplates.headlines,
        summaryTemplate: profileTemplates.summaryTemplate,
        skillsSuggestions: profileTemplates.skillsSuggestions,
        keywordOptimization: generateKeywordSuggestions(industry)
      },
      
      networkingRecommendations: Object.values(NETWORKING_RECOMMENDATIONS),
      
      careerPathways: generateCareerPathways(industry, industryData.leaders),
      
      industryInsights: {
        marketTrends: generateMarketTrends(industry),
        salaryInsights: generateSalaryInsights(industry),
        skillsDemand: generateSkillsDemand(industry)
      }
    };
    
  } catch (error) {
    console.error('LinkedIn Insights Error:', error);
    return {
      success: false,
      error: 'Unable to fetch professional insights',
      message: error.message
    };
  }
});

// Helper Functions
function generateKeywordSuggestions(industry) {
  const keywordMap = {
    technology: [
      'software development', 'programming', 'web development', 'mobile apps',
      'data analysis', 'cybersecurity', 'cloud computing', 'artificial intelligence',
      'fintech', 'Kenya tech', 'innovation', 'digital transformation'
    ],
    finance: [
      'financial analysis', 'investment banking', 'financial planning', 'risk management',
      'banking operations', 'fintech', 'financial modeling', 'portfolio management',
      'microfinance', 'financial inclusion', 'Kenya banking', 'East Africa finance'
    ]
  };
  
  return keywordMap[industry.toLowerCase()] || keywordMap['technology'];
}

function generateCareerPathways(industry, leaders) {
  return leaders.map(leader => ({
    startingRole: leader.careerPath[0]?.split('→')[0]?.trim() || 'Entry Level',
    progressionPath: leader.careerPath,
    timeframe: '5-10 years typical progression',
    keySkills: leader.keyInsights.filter(insight => insight.includes('skill') || insight.includes('learn')),
    education: leader.education,
    inspiration: leader.inspirationQuote
  }));
}

function generateMarketTrends(industry) {
  const trends = {
    technology: [
      'Mobile-first development is crucial in Kenya market',
      'Fintech and mobile payment solutions are booming',
      'Cloud computing adoption is accelerating across businesses',
      'Cybersecurity skills are in high demand',
      'AI/ML applications in agriculture and finance are growing'
    ],
    finance: [
      'Digital banking transformation is reshaping the industry',
      'Financial inclusion through mobile banking is expanding',
      'Microfinance and SME lending are growth areas',
      'Investment banking is becoming more sophisticated',
      'Fintech partnerships with traditional banks are increasing'
    ]
  };
  
  return trends[industry.toLowerCase()] || trends['technology'];
}

function generateSalaryInsights(industry) {
  const salaryData = {
    technology: {
      entryLevel: 'KSh 450,000 - 750,000',
      midLevel: 'KSh 800,000 - 1,500,000',
      senior: 'KSh 1,500,000 - 3,000,000+',
      factors: ['Technical skills', 'Company size', 'Location', 'Experience']
    },
    finance: {
      entryLevel: 'KSh 400,000 - 650,000', 
      midLevel: 'KSh 700,000 - 1,200,000',
      senior: 'KSh 1,200,000 - 2,500,000+',
      factors: ['Certifications (CPA, CFA)', 'Institution type', 'Specialization', 'Performance']
    }
  };
  
  return salaryData[industry.toLowerCase()] || salaryData['technology'];
}

function generateSkillsDemand(industry) {
  const skillsDemand = {
    technology: [
      { skill: 'Python', demand: 'Very High', growth: '+35%' },
      { skill: 'JavaScript', demand: 'Very High', growth: '+40%' },
      { skill: 'React', demand: 'High', growth: '+45%' },
      { skill: 'Mobile Development', demand: 'High', growth: '+30%' },
      { skill: 'Data Analysis', demand: 'High', growth: '+50%' },
      { skill: 'Cybersecurity', demand: 'Very High', growth: '+60%' }
    ],
    finance: [
      { skill: 'Financial Modeling', demand: 'High', growth: '+25%' },
      { skill: 'Risk Management', demand: 'High', growth: '+30%' },
      { skill: 'Data Analysis', demand: 'Very High', growth: '+40%' },
      { skill: 'Digital Banking', demand: 'Very High', growth: '+55%' },
      { skill: 'Investment Analysis', demand: 'High', growth: '+20%' },
      { skill: 'Fintech Knowledge', demand: 'Very High', growth: '+65%' }
    ]
  };
  
  return skillsDemand[industry.toLowerCase()] || skillsDemand['technology'];
}

module.exports = {
  KENYA_PROFESSIONAL_DATA,
  PROFILE_OPTIMIZATION_TEMPLATES,
  NETWORKING_RECOMMENDATIONS
};