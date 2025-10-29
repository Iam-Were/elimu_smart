/**
 * Dashboard Cloud Functions - Phase 2
 *
 * Provides backend support for enhanced dashboard cards:
 * - Profile Completion tracking
 * - Next Counselor Session
 * - Career Goal Progress
 */

// ============================================
// 1. PROFILE COMPLETION CALCULATOR
// ============================================

/**
 * Calculate user profile completion percentage
 *
 * Scoring breakdown:
 * - Basic Info (20%): name, email, phone, location
 * - KCSE Results (20%): grades entered
 * - Assessments (30%): RIASEC + Skills completed
 * - Skills (15%): at least 3 skills added
 * - Projects/Experience (15%): at least 1 project or experience
 *
 * @returns {object} { percentage: 72, missingFields: [], nextStep: 'Add KCSE results', category: 'Good' }
 */
Parse.Cloud.define('calculateProfileCompletion', async (request) => {
  const user = request.user;
  if (!user) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User must be logged in');
  }

  try {
    let score = 0;
    const missingFields = [];
    let nextStep = '';

    // 1. Basic Info (20 points)
    const hasPhone = !!user.get('phone');
    const hasLocation = !!user.get('county') || !!user.get('location');
    const hasBio = !!user.get('bio');
    const hasProfileImage = !!user.get('profileImage');

    const basicInfoScore = [hasPhone, hasLocation, hasBio, hasProfileImage].filter(Boolean).length;
    score += (basicInfoScore / 4) * 20;

    if (!hasPhone) missingFields.push('Phone number');
    if (!hasLocation) missingFields.push('Location/County');
    if (!hasBio) missingFields.push('Bio/About');
    if (!hasProfileImage) missingFields.push('Profile picture');

    // 2. KCSE Results (20 points)
    const kcseResults = user.get('kcseResults') || user.get('grades');
    const hasKcse = kcseResults && Object.keys(kcseResults).length >= 7; // At least 7 subjects
    if (hasKcse) {
      score += 20;
    } else {
      missingFields.push('KCSE results (7+ subjects)');
    }

    // 3. Assessments (30 points)
    const StudentProgress = Parse.Object.extend('StudentProgress');
    const progressQuery = new Parse.Query(StudentProgress);
    progressQuery.equalTo('user', user);
    const progress = await progressQuery.first({ useMasterKey: true });

    const riasecCompleted = progress?.get('riasecCompleted') || false;
    const skillsCompleted = progress?.get('skillsCompleted') || false;

    if (riasecCompleted) score += 20;
    else missingFields.push('RIASEC Career Assessment');

    if (skillsCompleted) score += 10;
    else missingFields.push('Skills Assessment');

    // 4. Skills (15 points)
    const skills = user.get('skills') || [];
    const hasSkills = skills.length >= 3;
    if (hasSkills) {
      score += 15;
    } else {
      missingFields.push(`Skills (${skills.length}/3 minimum)`);
    }

    // 5. Projects/Experience (15 points)
    const projects = user.get('projects') || [];
    const experience = user.get('workExperience') || [];
    const hasProjectsOrExperience = projects.length >= 1 || experience.length >= 1;
    if (hasProjectsOrExperience) {
      score += 15;
    } else {
      missingFields.push('Projects or work experience');
    }

    // Determine next step (highest priority missing)
    if (!riasecCompleted) {
      nextStep = 'Complete RIASEC Career Assessment';
    } else if (!hasKcse) {
      nextStep = 'Add KCSE results';
    } else if (!skillsCompleted) {
      nextStep = 'Complete Skills Assessment';
    } else if (!hasSkills) {
      nextStep = 'Add your top 3 skills';
    } else if (!hasProjectsOrExperience) {
      nextStep = 'Add a project or experience';
    } else if (!hasPhone) {
      nextStep = 'Add phone number';
    } else {
      nextStep = 'Profile complete! 🎉';
    }

    // Category labels
    let category = 'Getting Started';
    if (score >= 80) category = 'Excellent';
    else if (score >= 60) category = 'Good';
    else if (score >= 40) category = 'Fair';

    return {
      percentage: Math.round(score),
      missingFields,
      nextStep,
      category,
      breakdown: {
        basicInfo: Math.round((basicInfoScore / 4) * 20),
        kcse: hasKcse ? 20 : 0,
        assessments: (riasecCompleted ? 20 : 0) + (skillsCompleted ? 10 : 0),
        skills: hasSkills ? 15 : 0,
        projects: hasProjectsOrExperience ? 15 : 0
      }
    };
  } catch (error) {
    console.error('❌ Calculate profile completion failed:', error);
    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      `Failed to calculate profile completion: ${error.message}`
    );
  }
});

// ============================================
// 2. NEXT COUNSELOR SESSION
// ============================================

/**
 * Get student's next scheduled counselor session
 *
 * @returns {object} { session: {...}, hoursUntil: 23, counselor: {...} } or null
 */
Parse.Cloud.define('getStudentNextSession', async (request) => {
  const user = request.user;
  if (!user) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User must be logged in');
  }

  try {
    const CounselorSession = Parse.Object.extend('CounselorSession');
    const query = new Parse.Query(CounselorSession);
    query.equalTo('studentId', user.id);
    query.greaterThan('sessionDate', new Date());
    query.include('counselor');
    query.ascending('sessionDate');
    query.limit(1);

    const session = await query.first({ useMasterKey: true });

    if (!session) {
      return { hasSession: false };
    }

    const sessionDate = session.get('sessionDate');
    const now = new Date();
    const hoursUntil = Math.ceil((sessionDate - now) / (1000 * 60 * 60));
    const daysUntil = Math.ceil(hoursUntil / 24);

    // Get counselor details
    const counselorId = session.get('counselorId');
    const counselorQuery = new Parse.Query(Parse.User);
    counselorQuery.equalTo('objectId', counselorId);
    const counselor = await counselorQuery.first({ useMasterKey: true });

    return {
      hasSession: true,
      session: {
        id: session.id,
        topic: session.get('topic') || 'Career Guidance Session',
        sessionDate: sessionDate,
        duration: session.get('duration') || 30,
        type: session.get('sessionType') || 'video',
        status: session.get('status') || 'scheduled',
        notes: session.get('notes') || ''
      },
      hoursUntil,
      daysUntil,
      counselor: {
        id: counselor?.id,
        name: counselor?.get('fullName') || counselor?.get('username'),
        email: counselor?.get('email'),
        profileImage: counselor?.get('profileImage')
      }
    };
  } catch (error) {
    console.error('❌ Get next session failed:', error);
    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      `Failed to get next session: ${error.message}`
    );
  }
});

// ============================================
// 3. CAREER GOALS SYSTEM
// ============================================

/**
 * Get user's career goals with progress tracking
 *
 * @returns {array} [{ id, goal, progress: 60, milestones: [{name, completed, date}], targetDate }]
 */
Parse.Cloud.define('getUserCareerGoals', async (request) => {
  const user = request.user;
  if (!user) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User must be logged in');
  }

  // ✅ TEMPORARY FIX: CareerGoal pointer query causing PostgreSQL errors
  // Return default template until schema/pointer issues resolved
  // TODO: Fix Parse pointer queries or migrate to different approach
  return {
    hasGoals: false,
    suggestedGoal: {
      goal: 'Set Your Career Goal',
      milestones: [
        { name: 'Complete RIASEC Assessment', completed: false },
        { name: 'Complete Skills Assessment', completed: false },
        { name: 'Complete KCSE with required grades', completed: false },
        { name: 'Apply to relevant university programs', completed: false }
      ]
    }
  };

  /* DISABLED - Causing PostgreSQL "column user does not exist" errors
  try {
    const CareerGoal = Parse.Object.extend('CareerGoal');
    const query = new Parse.Query(CareerGoal);
    query.equalTo('user', user);
    query.descending('createdAt');
    query.limit(5);

    const goals = await query.find({ useMasterKey: true });

    if (goals.length === 0) {
      return {
        hasGoals: false,
        suggestedGoal: {
          goal: 'Set Your Career Goal',
          milestones: [
            { name: 'Complete RIASEC Assessment', completed: false },
            { name: 'Complete Skills Assessment', completed: false },
            { name: 'Complete KCSE with required grades', completed: false },
            { name: 'Apply to relevant university programs', completed: false }
          ]
        }
      };
    }

    const goalsData = goals.map(goal => {
      const milestones = goal.get('milestones') || [];
      const completedCount = milestones.filter(m => m.completed).length;
      const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

      return {
        id: goal.id,
        goal: goal.get('goal'),
        description: goal.get('description'),
        progress,
        milestones,
        targetDate: goal.get('targetDate'),
        createdAt: goal.get('createdAt'),
        completedMilestones: completedCount,
        totalMilestones: milestones.length
      };
    });

    return {
      hasGoals: true,
      goals: goalsData
    };
  } catch (error) {
    console.error('❌ Get career goals failed:', error);
    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      `Failed to get career goals: ${error.message}`
    );
  }
  */
});

/**
 * Create or update a career goal
 *
 * @param {string} goal - Goal title (e.g., "Become a Software Engineer")
 * @param {string} description - Goal description
 * @param {array} milestones - [{name, completed, dueDate}]
 * @param {date} targetDate - Goal target completion date
 * @param {string} goalId - (optional) ID of existing goal to update
 */
Parse.Cloud.define('saveCareerGoal', async (request) => {
  const user = request.user;
  if (!user) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User must be logged in');
  }

  const { goal, description, milestones, targetDate, goalId } = request.params;

  if (!goal || !milestones || milestones.length === 0) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Goal and milestones are required');
  }

  try {
    const CareerGoal = Parse.Object.extend('CareerGoal');
    let careerGoal;

    if (goalId) {
      // Update existing goal
      const query = new Parse.Query(CareerGoal);
      query.equalTo('objectId', goalId);
      query.equalTo('user', user);
      careerGoal = await query.first({ useMasterKey: true });

      if (!careerGoal) {
        throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Goal not found');
      }
    } else {
      // Create new goal
      careerGoal = new CareerGoal();
      careerGoal.set('user', user);
    }

    careerGoal.set('goal', goal);
    careerGoal.set('description', description);
    careerGoal.set('milestones', milestones);
    careerGoal.set('targetDate', targetDate ? new Date(targetDate) : null);

    const ACL = new Parse.ACL(user);
    ACL.setPublicReadAccess(false);
    careerGoal.setACL(ACL);

    await careerGoal.save(null, { useMasterKey: true });

    return {
      success: true,
      goalId: careerGoal.id,
      message: goalId ? 'Goal updated successfully' : 'Goal created successfully'
    };
  } catch (error) {
    console.error('❌ Save career goal failed:', error);
    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      `Failed to save career goal: ${error.message}`
    );
  }
});

/**
 * Update milestone completion status
 *
 * @param {string} goalId - Goal ID
 * @param {number} milestoneIndex - Index of milestone to update
 * @param {boolean} completed - Completion status
 */
Parse.Cloud.define('updateMilestone', async (request) => {
  const user = request.user;
  if (!user) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User must be logged in');
  }

  const { goalId, milestoneIndex, completed } = request.params;

  if (!goalId || milestoneIndex === undefined) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'goalId and milestoneIndex are required');
  }

  try {
    const CareerGoal = Parse.Object.extend('CareerGoal');
    const query = new Parse.Query(CareerGoal);
    query.equalTo('objectId', goalId);
    query.equalTo('user', user);
    const goal = await query.first({ useMasterKey: true });

    if (!goal) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Goal not found');
    }

    const milestones = goal.get('milestones') || [];
    if (milestoneIndex >= milestones.length) {
      throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Invalid milestone index');
    }

    milestones[milestoneIndex].completed = completed;
    if (completed && !milestones[milestoneIndex].completedDate) {
      milestones[milestoneIndex].completedDate = new Date();
    }

    goal.set('milestones', milestones);
    await goal.save(null, { useMasterKey: true });

    return {
      success: true,
      message: 'Milestone updated successfully'
    };
  } catch (error) {
    console.error('❌ Update milestone failed:', error);
    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      `Failed to update milestone: ${error.message}`
    );
  }
});

console.log('✅ Dashboard Cloud Functions loaded (Profile Completion, Next Session, Career Goals)');
