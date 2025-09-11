# CareerJet API Integration Strategy - Elimu Smart Platform

## Executive Summary

**Objective:** Integrate real job market data from CareerJet API to enhance student user journey with live employment opportunities, salary insights, and career market trends for Kenya-specific career guidance.

**Implementation Timeline:** 2-3 weeks development + 1 week testing
**Expected Impact:** 40% increase in student engagement with realistic career planning

---

## 1. CareerJet API Analysis

### API Capabilities
- **Job Search**: Real-time job listings with location, salary, and requirements
- **Geographic Coverage**: Kenya job market with Nairobi, Mombasa, Nakuru focus
- **Industry Sectors**: Technology, Healthcare, Education, Finance, Agriculture
- **Data Freshness**: Daily updates with new opportunities
- **Free Tier**: 1000 requests/day sufficient for MVP testing

### Technical Specifications
```javascript
// CareerJet API Endpoint Structure
const CAREERJET_BASE_URL = 'https://public-api.careerjet.com/search';

// Request Parameters
{
  keywords: 'software developer',
  location: 'nairobi kenya',
  sort: 'salary',
  start_num: 0,
  pagesize: 20,
  contractperiod: 'permanent',
  contracttype: 'full'
}

// Response Data Structure
{
  type: "JOBS",
  jobs: [
    {
      jobid: "123456789",
      jobtitle: "Software Developer",
      company: "Safaricom Ltd",
      locations: "Nairobi, Kenya",
      salary: "KSh 800,000 - 1,200,000",
      date: "2025-09-01",
      url: "https://careerjet.com/jobad/123456789",
      site: "BrighterMonday",
      description: "We are seeking a talented software developer..."
    }
  ],
  pages: 5,
  hits: 87
}
```

---

## 2. Student User Journey Enhancement Strategy

### 2.1 Real Job Market Visualization Integration

#### Enhanced Dashboard Cards
```typescript
// NEW: Real Job Market Insights Card
interface JobMarketCard {
  title: "Live Job Opportunities";
  data: {
    totalJobs: 1247;           // Live count from CareerJet
    averageSalary: "KSh 650,000"; // Calculated from recent postings
    topIndustries: ["Technology", "Finance", "Healthcare"];
    demandTrend: "+15%";       // Month-over-month growth
  };
  urgency: "high";             // Job market is competitive
  actionText: "Explore Current Opportunities";
  actionLink: "/career-market";
}

// ENHANCED: Career Discovery Card with Real Data
interface EnhancedCareerCard {
  personalityMatch: "INTJ - Architect";
  liveJobCount: 342;          // Real jobs matching personality
  averageSalary: "KSh 850,000";
  growthProjection: "+23%";   // Based on job posting trends
  topEmployers: ["Safaricom", "Equity Bank", "NCBA"];
}
```

#### New Route: Career Market Explorer (`/career-market`)
```typescript
// Comprehensive job market analysis page
interface CareerMarketPage {
  sections: [
    {
      name: "Current Opportunities";
      content: "Live job listings filtered by career interests";
      dataSource: "CareerJet API real-time";
    },
    {
      name: "Salary Insights"; 
      content: "Entry-level to senior compensation ranges";
      dataSource: "CareerJet salary data aggregation";
    },
    {
      name: "Industry Trends";
      content: "Which sectors are hiring the most";
      dataSource: "CareerJet posting frequency analysis";
    },
    {
      name: "Skills Demand";
      content: "Most requested skills in job descriptions";
      dataSource: "CareerJet job description text analysis";
    }
  ];
}
```

### 2.2 Assessment Integration Enhancement

#### Skills Assessment with Market Validation
```typescript
// ENHANCED: Skills Assessment Cards with Real Market Data
interface MarketValidatedSkillsAssessment {
  assessmentQuestions: {
    "How proficient are you with Python?": {
      userResponse: "Intermediate";
      marketDemand: {
        jobCount: 156;           // Live Python jobs
        averageSalary: "KSh 750,000";
        demandLevel: "Very High"; // Based on job posting frequency
        improvementImpact: "+25% salary potential with advanced skills";
      };
    };
  };
  
  results: {
    marketAlignment: "78%";     // How well skills match current demand
    salaryProjection: "KSh 680,000 - 920,000";
    recommendedUpskilling: [
      "JavaScript (134 current job openings)",
      "React.js (89 current job openings)",
      "Node.js (67 current job openings)"
    ];
  };
}
```

#### Career Path Validation
```typescript
// NEW: Real Market Career Path Analysis
interface CareerPathValidation {
  chosenCareer: "Software Developer";
  marketReality: {
    currentOpenings: 234;
    entryLevelJobs: 78;        // Perfect for students
    experienceRequired: "0-2 years for 45% of positions";
    topRequirements: ["Python", "JavaScript", "Problem Solving"];
    realSalaryRange: "KSh 450,000 - 1,800,000";
    careerGrowth: "Senior Dev (3-5 years): KSh 1,200,000+";
  };
  
  actionPlan: [
    "Complete coding bootcamp (3-6 months)",
    "Build portfolio with 3-5 projects", 
    "Apply to junior positions at SMEs",
    "Target companies: Andela, iHub, BRCK"
  ];
}
```

### 2.3 Guidance Enhancement with Real Opportunities

#### Counselor Integration with Market Data
```typescript
// ENHANCED: Counselor guidance with live job intelligence
interface MarketInformedGuidance {
  counselorTools: {
    liveJobInsights: {
      "What jobs are actually available for my interests?";
      "Are my salary expectations realistic?";
      "Which companies are actively hiring?";
      "What skills do I need to develop first?";
    };
    
    marketDataDashboard: {
      studentCareerMatch: "Software Development";
      currentMarketState: {
        jobAvailability: "High demand (200+ openings)";
        salaryTrends: "Growing +12% year-over-year";
        skillsGap: "React.js, Cloud computing";
        immediateOpportunities: 23; // Entry-level positions
      };
    };
  };
}
```

---

## 3. Technical Implementation Architecture

### 3.1 Backend Integration (Parse Cloud Functions)

#### CareerJet API Service
```javascript
// Parse Cloud Function: CareerJet Integration
Parse.Cloud.define('fetchJobMarketData', async (request) => {
  const { keywords, location = 'nairobi kenya', limit = 20 } = request.params;
  
  try {
    const careerjetResponse = await axios.get('https://public-api.careerjet.com/search', {
      params: {
        keywords,
        location,
        sort: 'date',
        start_num: 0,
        pagesize: limit,
        contractperiod: 'permanent'
      }
    });
    
    // Process and enhance data
    const processedJobs = careerjetResponse.data.jobs.map(job => ({
      id: job.jobid,
      title: job.jobtitle,
      company: job.company,
      location: job.locations,
      salary: parseSalary(job.salary), // Extract numeric salary range
      description: job.description,
      requirements: extractRequirements(job.description),
      postedDate: new Date(job.date),
      url: job.url,
      source: job.site
    }));
    
    return {
      jobs: processedJobs,
      totalResults: careerjetResponse.data.hits,
      marketInsights: {
        averageSalary: calculateAverageSalary(processedJobs),
        topRequirements: extractTopSkills(processedJobs),
        demandLevel: categorizeDemand(processedJobs.length)
      }
    };
  } catch (error) {
    console.error('CareerJet API Error:', error);
    return { error: 'Unable to fetch current job data' };
  }
});

// Utility Functions
function parseSalary(salaryString) {
  const numbers = salaryString.match(/[\d,]+/g);
  if (numbers && numbers.length >= 2) {
    return {
      min: parseInt(numbers[0].replace(/,/g, '')),
      max: parseInt(numbers[1].replace(/,/g, '')),
      currency: 'KSh'
    };
  }
  return null;
}

function extractRequirements(description) {
  const skillKeywords = [
    'python', 'javascript', 'react', 'node.js', 'sql',
    'microsoft office', 'communication skills', 'teamwork'
  ];
  
  return skillKeywords.filter(skill => 
    description.toLowerCase().includes(skill)
  );
}
```

#### Market Analytics Engine
```javascript
// Parse Cloud Function: Job Market Analytics
Parse.Cloud.define('getCareerMarketAnalytics', async (request) => {
  const { careerField, timeframe = '30days' } = request.params;
  
  try {
    // Fetch recent job data for trend analysis
    const recentJobs = await fetchCareerJetHistory(careerField, timeframe);
    
    const analytics = {
      demandTrend: calculateDemandTrend(recentJobs),
      salaryTrend: calculateSalaryTrend(recentJobs),
      skillsInDemand: extractTrendingSkills(recentJobs),
      topEmployers: getTopEmployers(recentJobs),
      entryLevelOpportunities: filterEntryLevel(recentJobs).length,
      industryGrowth: calculateIndustryGrowth(recentJobs)
    };
    
    return { success: true, analytics };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

### 3.2 Frontend Integration

#### Enhanced useDynamicDashboard Hook
```typescript
// Add CareerJet integration to existing dynamic dashboard
interface MarketEnhancedDashboard extends DashboardData {
  jobMarketData: {
    liveOpportunities: JobOpportunity[];
    marketInsights: MarketInsights;
    careerPathValidation: CareerPathData;
    salaryBenchmarks: SalaryData[];
  };
}

export const useDynamicDashboard = () => {
  // Existing dashboard logic...
  
  // NEW: Job market data integration
  const getJobMarketData = async (): Promise<JobMarketData | null> => {
    try {
      const userProfile = await Parse.Cloud.run('getUserCareerProfile');
      const result = await Parse.Cloud.run('fetchJobMarketData', {
        keywords: userProfile.interestedCareers.join(' OR '),
        location: 'nairobi kenya'
      });
      
      return {
        liveOpportunities: result.jobs || [],
        marketInsights: result.marketInsights || {},
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Failed to fetch job market data:', error);
      return null;
    }
  };
  
  // Enhanced dashboard loading
  const loadEnhancedDashboard = async () => {
    const [
      dashboardData,
      jobMarketData
    ] = await Promise.all([
      loadDashboardData(), // Existing function
      getJobMarketData()   // New CareerJet integration
    ]);
    
    setDashboardData({
      ...dashboardData,
      jobMarketData
    });
  };
};
```

#### New Components for Job Market Integration

```typescript
// Component: LiveJobOpportunities.tsx
interface LiveJobOpportunitiesProps {
  userInterests: string[];
  location?: string;
  limit?: number;
}

export const LiveJobOpportunities: React.FC<LiveJobOpportunitiesProps> = ({
  userInterests,
  location = 'nairobi kenya',
  limit = 10
}) => {
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await Parse.Cloud.run('fetchJobMarketData', {
          keywords: userInterests.join(' OR '),
          location,
          limit
        });
        setJobs(result.jobs || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [userInterests, location, limit]);
  
  if (loading) return <JobLoadingSkeleton />;
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-orange-800">
        Current Opportunities in Your Field
      </h3>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

// Component: MarketInsightsDashboard.tsx  
export const MarketInsightsDashboard: React.FC = () => {
  const { jobMarketData } = useDynamicDashboard();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <InsightCard
        title="Live Job Count"
        value={jobMarketData?.liveOpportunities.length || 0}
        trend="+12% this month"
        icon={<TrendingUp />}
      />
      <InsightCard  
        title="Average Salary"
        value={jobMarketData?.marketInsights.averageSalary}
        trend="KSh 50,000 above last quarter"
        icon={<DollarSign />}
      />
      <InsightCard
        title="Top Skills Needed"
        value={jobMarketData?.marketInsights.topRequirements?.length || 0}
        subtitle="skills in high demand"
        icon={<Award />}
      />
    </div>
  );
};
```

---

## 4. Student UX Navigation Flow After Implementation

### Enhanced Student Journey Map

#### Login → Dashboard (Enhanced with Real Data)
```
1. Student Login (student@elimu.com)
   ↓
2. Enhanced Dashboard
   ├── Career Readiness: 67% (algorithm-calculated)
   ├── Live Job Market: 1,247 opportunities available
   ├── University Placement: 15 programs match your grades  
   ├── Market Salary Insights: KSh 450K-850K for your interests
   └── Next Steps: "Explore 23 entry-level positions in tech"
```

#### Assessment → Real Market Validation
```
3. Career Assessment
   ├── Personality Test → Results with job market alignment
   ├── Skills Assessment → Validated against current job requirements
   ├── Subject Mapping → Real university course requirements
   └── Market Reality Check: "Your skills match 78% of current openings"
```

#### Guidance → Live Opportunity Counseling
```
4. Career Guidance
   ├── Find a Coach → Counselors with real market data access
   ├── Live Job Exploration → 234 software developer positions
   ├── Salary Negotiation Prep → Based on current market rates  
   └── Application Strategy → Target companies actively hiring
```

#### New Route: Career Market Explorer
```
5. /career-market (NEW)
   ├── Current Opportunities → Live job listings
   ├── Salary Benchmarks → Real compensation data
   ├── Industry Trends → Which sectors are growing
   ├── Skills Gap Analysis → What to learn next
   └── Company Insights → Who's hiring entry-level
```

### Navigation Flow Diagram
```
Student Login
     │
     ▼
Enhanced Dashboard (Real Data)
     │
     ├─► Assessment (Market-Validated)
     │        │
     │        ├─► Personality + Job Market Fit
     │        ├─► Skills + Current Demand  
     │        └─► Results + Salary Projections
     │
     ├─► Guidance (Live Market Intel)
     │        │  
     │        ├─► Counselor + Market Data
     │        ├─► Live Job Exploration
     │        └─► Application Strategy
     │
     └─► Career Market Explorer (NEW)
              │
              ├─► Live Job Listings
              ├─► Salary Insights  
              ├─► Industry Trends
              └─► Next Steps Planning
```

---

## 5. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up CareerJet API credentials and testing environment
- [ ] Implement basic Parse Cloud Functions for job data fetching
- [ ] Create job market data interfaces and TypeScript types
- [ ] Build basic job listing component with loading states

### Phase 2: Dashboard Integration (Week 2)
- [ ] Enhance useDynamicDashboard hook with CareerJet integration
- [ ] Add real job market data to StudentDashboardCards
- [ ] Implement market insights calculations and analytics
- [ ] Create new /career-market route with comprehensive job explorer

### Phase 3: Assessment Enhancement (Week 3)
- [ ] Integrate job market data into skills assessments
- [ ] Add salary projections to career discovery results  
- [ ] Implement market-validated career path recommendations
- [ ] Build skills gap analysis with real job requirements

### Phase 4: Testing & Optimization (Week 4)
- [ ] Comprehensive testing of API integration and error handling
- [ ] Performance optimization for job data loading
- [ ] User experience testing with real students
- [ ] Final polishing and production deployment

---

## 6. Success Metrics & KPIs

### User Engagement Metrics
- **Dashboard Interaction**: +40% increase in dashboard card clicks
- **Assessment Completion**: +25% improvement in full assessment completion
- **Time on Platform**: +60% increase in average session duration
- **Feature Discovery**: +80% of users explore new career market section

### Educational Impact Metrics
- **Career Clarity**: 90% of students report clearer career understanding
- **Realistic Expectations**: 85% develop appropriate salary expectations
- **Skill Development**: 70% identify specific skills to develop
- **Job Application Readiness**: 60% feel more prepared for job search

### Platform Performance
- **API Response Time**: <500ms for job data queries
- **Data Freshness**: Daily updates with 95% uptime
- **Error Handling**: Graceful fallbacks for API unavailability
- **Mobile Performance**: Optimized for mobile job searching

This CareerJet API integration strategy transforms Elimu Smart from static career guidance into a dynamic, market-informed platform that provides students with real-time insights into Kenya's job market, enabling more informed career decisions and better preparation for their professional futures.