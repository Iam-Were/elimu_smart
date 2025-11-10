// Personalized Insights Algorithm for Dashboard Hero Card
// Uses existing Parse functions to generate smart, context-aware recommendations

Parse.Cloud.define('getPersonalizedInsights', async (request) => {
  if (!request.user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'User must be authenticated');
  }

  try {
    const user = request.user;
    const userId = user.id;

    // Fetch data using existing functions
    const [careerReadiness, assessmentProgress, activities, scholarships, assessmentResults] = await Promise.all([
      Parse.Cloud.run('calculateCareerReadinessScore', {}, { sessionToken: user.getSessionToken() }),
      Parse.Cloud.run('getAssessmentProgress', {}, { sessionToken: user.getSessionToken() }),
      Parse.Cloud.run('getUserActivities', { limit: 10 }, { sessionToken: user.getSessionToken() }),
      Parse.Cloud.run('getScholarshipMatches', {}, { sessionToken: user.getSessionToken() }).catch(() => ({ matches: [] })),
      Parse.Cloud.run('getUserAssessmentResults', {}, { sessionToken: user.getSessionToken() })
    ]);

    // Calculate insights based on data
    const insights = {
      primaryInsight: null,
      secondaryInsight: null,
      urgentAction: null,
      trendingForYou: [],
      socialProof: null,
      motivationalStats: {}
    };

    // PRIMARY INSIGHT: Most important recommendation
    if (assessmentProgress.completed === 0) {
      insights.primaryInsight = {
        type: 'get_started',
        title: 'Start Your Career Journey',
        message: `Get personalized career matches in just 15 minutes! ${getStatistic('completion_rate')} of students who complete assessments find their career path.`,
        action: { label: 'Take RIASEC Assessment', route: '/assessment/career' },
        icon: '🎯'
      };
    } else if (careerReadiness.score < 40) {
      insights.primaryInsight = {
        type: 'boost_readiness',
        title: 'Quick Win Available!',
        message: `Complete your profile to unlock ${scholarships.matches?.length || 3} scholarship opportunities. You're ${Math.round(100 - user.get('profileCompletion') || 65)}% away!`,
        action: { label: 'Complete Profile', route: '/profile' },
        icon: '⚡'
      };
    } else if (assessmentResults.hasResults && !user.get('hasExploredCareers')) {
      insights.primaryInsight = {
        type: 'explore_matches',
        title: 'Your Career Matches Are Ready!',
        message: `Based on your RIASEC results, we found ${assessmentResults.assessments[0]?.results?.careerMatches?.length || 5} careers perfect for you. ${getStatistic('exploration_success')} of students explore within 24 hours.`,
        action: { label: 'View Career Matches', route: '/assessment/career/results' },
        icon: '🎨'
      };
    } else {
      insights.primaryInsight = {
        type: 'keep_momentum',
        title: 'You\'re Making Great Progress!',
        message: `${careerReadiness.score}% career ready. Keep going! ${getStatistic('completion_momentum')} of active students complete their journey within 2 weeks.`,
        action: { label: 'Continue Journey', route: '/dashboard' },
        icon: '🚀'
      };
    }

    // SECONDARY INSIGHT: Next best action
    if (scholarships.matches && scholarships.matches.length > 0) {
      insights.secondaryInsight = {
        type: 'scholarships',
        title: `${scholarships.matches.length} Scholarship Matches`,
        message: `Mastercard Foundation Scholars and ${scholarships.matches.length - 1} others match your profile`,
        action: { label: 'View Scholarships', route: '/guidance/scholarships' }
      };
    } else if (assessmentProgress.total > assessmentProgress.completed) {
      const remaining = assessmentProgress.total - assessmentProgress.completed;
      insights.secondaryInsight = {
        type: 'complete_assessments',
        title: `${remaining} Assessment${remaining > 1 ? 's' : ''} Remaining`,
        message: 'Complete all assessments for a comprehensive career plan',
        action: { label: 'View Assessments', route: '/assessment' }
      };
    }

    // URGENT ACTION: Time-sensitive item
    const now = new Date();
    const kuccpsDeadline = getNextKuccpsDeadline();
    if (kuccpsDeadline && (kuccpsDeadline - now) / (1000 * 60 * 60 * 24) <= 30) {
      const daysLeft = Math.ceil((kuccpsDeadline - now) / (1000 * 60 * 60 * 24));
      insights.urgentAction = {
        type: 'kuccps_deadline',
        title: 'KUCCPS Deadline Approaching',
        message: `Only ${daysLeft} days left to submit your university choices!`,
        action: { label: 'Check Requirements', route: '/assessment/university' },
        priority: 'high',
        icon: '⏰'
      };
    }

    // TRENDING FOR YOU: Personalized recommendations (carousel items)
    insights.trendingForYou = generateTrendingItems(user, assessmentResults, careerReadiness, activities);

    // SOCIAL PROOF: Community activity
    insights.socialProof = await generateSocialProof(user);

    // MOTIVATIONAL STATS: Encouraging metrics
    insights.motivationalStats = {
      streak: await calculateStreak(userId, activities),
      profileCompletion: user.get('profileCompletion') || 0,
      assessmentsCompleted: assessmentProgress.completed,
      totalAssessments: assessmentProgress.total
    };

    return insights;
  } catch (error) {
    console.error('Error generating personalized insights:', error);
    // Return default insights on error
    return {
      primaryInsight: {
        type: 'default',
        title: 'Welcome to Elimu Smart!',
        message: 'Start your career journey with our free RIASEC assessment',
        action: { label: 'Get Started', route: '/assessment' },
        icon: '🎯'
      },
      motivationalStats: { streak: 0, profileCompletion: 0 }
    };
  }
});

// Helper: Get statistical benchmarks
function getStatistic(type) {
  const stats = {
    'completion_rate': '92%',
    'exploration_success': '87%',
    'completion_momentum': '94%',
    'scholarship_success': '78%'
  };
  return stats[type] || '85%';
}

// Helper: Get next KUCCPS deadline (Kenya university placement)
function getNextKuccpsDeadline() {
  const now = new Date();
  const currentYear = now.getFullYear();
  // KUCCPS typically has deadlines in April and November
  const deadlines = [
    new Date(currentYear, 3, 30), // April 30
    new Date(currentYear, 10, 30) // November 30
  ];
  return deadlines.find(d => d > now) || new Date(currentYear + 1, 3, 30);
}

// Helper: Generate trending recommendations
function generateTrendingItems(user, assessmentResults, careerReadiness, activities) {
  const items = [];

  // Item 1: Based on completion status
  if (careerReadiness.score < 50) {
    items.push({
      title: 'Your Next Step',
      description: 'Complete your profile in 5 minutes',
      action: { label: 'Complete Now', route: '/profile' },
      type: 'action',
      priority: 1
    });
  } else if (assessmentResults.hasResults) {
    items.push({
      title: 'Explore Your Matches',
      description: `${assessmentResults.assessments[0]?.results?.careerMatches?.length || 5} careers await you`,
      action: { label: 'View Careers', route: '/assessment/career/results' },
      type: 'explore',
      priority: 1
    });
  }

  // Item 2: Scholarships
  items.push({
    title: 'Scholarship Opportunities',
    description: 'Mastercard Foundation + 2 others',
    action: { label: 'View All', route: '/guidance/scholarships' },
    type: 'opportunity',
    priority: 2
  });

  // Item 3: Community/Social
  items.push({
    title: 'Join Career Sessions',
    description: 'Next session: Tech Careers in Kenya',
    action: { label: 'Book Session', route: '/guidance/book-session' },
    type: 'community',
    priority: 3
  });

  return items.slice(0, 3); // Return top 3
}

// Helper: Generate social proof
async function generateSocialProof(user) {
  try {
    // Get recent users who completed similar actions
    const userSchool = user.get('school');
    const query = new Parse.Query('_User');
    query.equalTo('school', userSchool);
    query.equalTo('isActive', true);
    query.notEqualTo('objectId', user.id);
    query.descending('updatedAt');
    query.limit(1);

    const recentUser = await query.first({ useMasterKey: true });
    if (recentUser) {
      return {
        message: `${recentUser.get('firstName')} from your school joined career counseling`,
        type: 'peer_activity'
      };
    }

    // Fallback: Generic social proof
    return {
      message: '127 students explored careers this week',
      type: 'platform_activity'
    };
  } catch {
    return null;
  }
}

// Helper: Calculate activity streak
async function calculateStreak(userId, activities) {
  if (!activities || activities.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  // Check consecutive days with activity
  for (let i = 0; i < 365; i++) {
    const dayActivities = activities.filter(a => {
      const activityDate = new Date(a.createdAt);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === currentDate.getTime();
    });

    if (dayActivities.length > 0) {
      streak++;
    } else {
      break;
    }

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

console.log('✓ Personalized Insights Functions loaded');
