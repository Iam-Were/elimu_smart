/**
 * Student Onboarding Workflow Functions
 * Handles onboarding data collection and completion
 */

// Global Parse is available from main.js - no require needed

/**
 * Save onboarding data for a student
 * Stores academic profile, career interests, and preferences
 */
Parse.Cloud.define('saveOnboardingData', async (request) => {
  const { userId, stepData } = request.params;
  const requestingUser = request.user;

  if (!requestingUser || requestingUser.id !== userId) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Can only save own onboarding data');
  }

  if (!userId || !stepData) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'User ID and step data are required');
  }

  try {
    // Get or create OnboardingData record
    const OnboardingData = Parse.Object.extend('OnboardingData');

    const existingQuery = new Parse.Query(OnboardingData);
    existingQuery.equalTo('user', requestingUser);
    let onboardingData = await existingQuery.first({ useMasterKey: true });

    if (!onboardingData) {
      onboardingData = new OnboardingData();
      onboardingData.set('user', requestingUser);
      onboardingData.set('createdAt', new Date());
    }

    // Merge step data with existing data
    const currentData = onboardingData.get('data') || {};
    const mergedData = { ...currentData, ...stepData };

    onboardingData.set('data', mergedData);
    onboardingData.set('lastUpdated', new Date());

    // Track completion progress
    const requiredFields = ['gradeLevel', 'schoolName', 'kcseSubjects', 'careerInterests', 'goals'];
    const completedFields = requiredFields.filter(field => mergedData[field]);
    const progressPercentage = Math.round((completedFields.length / requiredFields.length) * 100);

    onboardingData.set('progressPercentage', progressPercentage);
    onboardingData.set('completedFields', completedFields);

    await onboardingData.save(null, { useMasterKey: true });

    return {
      success: true,
      onboardingId: onboardingData.id,
      progressPercentage,
      completedFields,
      message: 'Onboarding data saved successfully'
    };

  } catch (error) {
    console.error('Error saving onboarding data:', error);
    throw error;
  }
});

/**
 * Complete student onboarding
 * Triggers trial activation and counselor assignment
 */
Parse.Cloud.define('completeOnboarding', async (request) => {
  const { userId } = request.params;
  const requestingUser = request.user;

  if (!requestingUser || requestingUser.id !== userId) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Can only complete own onboarding');
  }

  if (!userId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'User ID is required');
  }

  try {
    // Get user
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });

    if (user.get('role') !== 'student') {
      throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Only students can complete onboarding');
    }

    // Check if onboarding already completed (query directly to avoid session issues)
    const UserPreferences = Parse.Object.extend('UserPreferences');
    const prefsQuery = new Parse.Query(UserPreferences);
    prefsQuery.equalTo('user', user);
    let userPrefs = await prefsQuery.first({ useMasterKey: true });

    if (userPrefs && userPrefs.get('onboardingCompleted')) {
      throw new Parse.Error(Parse.Error.DUPLICATE_VALUE, 'Onboarding already completed');
    }

    // Mark onboarding as completed in UserPreferences (create if doesn't exist)
    if (!userPrefs) {
      userPrefs = new UserPreferences();
      userPrefs.set('user', user);
    }
    userPrefs.set('onboardingCompleted', true);
    await userPrefs.save(null, { useMasterKey: true });

    // Update OnboardingData record
    const OnboardingData = Parse.Object.extend('OnboardingData');
    const onboardingQuery = new Parse.Query(OnboardingData);
    onboardingQuery.equalTo('user', user);
    const onboardingData = await onboardingQuery.first({ useMasterKey: true });

    if (onboardingData) {
      onboardingData.set('completedAt', new Date());
      onboardingData.set('progressPercentage', 100);
      await onboardingData.save(null, { useMasterKey: true });

      // Copy schoolName from onboarding data to _User for billing/analytics
      const data = onboardingData.get('data') || {};
      if (data.schoolName && !user.get('schoolName')) {
        user.set('schoolName', data.schoolName);
        await user.save(null, { useMasterKey: true });
      }
    }

    // Initialize 3-month premium trial
    let trialResult;
    try {
      trialResult = await Parse.Cloud.run('initializePremiumTrial', { userId }, { useMasterKey: true });
    } catch (error) {
      console.error('Error initializing trial:', error);
      trialResult = { success: false, error: error.message };
    }

    // Auto-assign counselor (round-robin)
    let counselorResult;
    try {
      counselorResult = await Parse.Cloud.run('autoAssignCounselor', { studentId: userId }, { useMasterKey: true });
    } catch (error) {
      console.error('Error assigning counselor:', error);
      counselorResult = { success: false, error: error.message };
    }

    // Log activity
    await Parse.Cloud.run('logUserActivity', {
      userId,
      activityType: 'onboarding_completed',
      activityData: {
        completedAt: new Date().toISOString(),
        trialActivated: trialResult.success,
        counselorAssigned: counselorResult.success,
        counselorId: counselorResult.counselorId || null
      }
    }, { useMasterKey: true });

    // Send welcome email (existing function)
    try {
      await Parse.Cloud.run('sendWelcomeEmail', { userId }, { useMasterKey: true });
    } catch (error) {
      console.warn('Welcome email failed:', error);
    }

    return {
      success: true,
      onboardingCompleted: true,
      trial: trialResult,
      counselor: counselorResult,
      message: 'Onboarding completed successfully'
    };

  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
});

/**
 * Get onboarding progress for a student
 */
Parse.Cloud.define('getOnboardingProgress', async (request) => {
  const { userId } = request.params;
  const requestingUser = request.user;

  if (!requestingUser || requestingUser.id !== userId) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Can only view own onboarding progress');
  }

  if (!userId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'User ID is required');
  }

  try {
    // Check completion status from UserPreferences
    const preferences = await Parse.Cloud.run('getUserPreferences', { userId }, { useMasterKey: true });

    // Get OnboardingData record
    const OnboardingData = Parse.Object.extend('OnboardingData');
    const onboardingQuery = new Parse.Query(OnboardingData);
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });
    onboardingQuery.equalTo('user', user);
    const onboardingData = await onboardingQuery.first({ useMasterKey: true });

    if (!onboardingData) {
      return {
        isCompleted: preferences.onboardingCompleted || false,
        progressPercentage: 0,
        completedFields: [],
        data: {},
        message: 'No onboarding data found'
      };
    }

    return {
      isCompleted: preferences.onboardingCompleted || false,
      progressPercentage: onboardingData.get('progressPercentage') || 0,
      completedFields: onboardingData.get('completedFields') || [],
      data: onboardingData.get('data') || {},
      completedAt: onboardingData.get('completedAt') || null,
      lastUpdated: onboardingData.get('lastUpdated') || null
    };

  } catch (error) {
    console.error('Error getting onboarding progress:', error);
    throw error;
  }
});

/**
 * Get onboarding data for a student (admin use)
 */
Parse.Cloud.define('getStudentOnboardingData', async (request) => {
  const { studentId } = request.params;
  const requestingUser = request.user;

  if (!requestingUser) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  const role = requestingUser.get('role');
  if (role !== 'admin' && role !== 'counselor') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Admin or counselor access required');
  }

  if (!studentId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Student ID is required');
  }

  try {
    const studentQuery = new Parse.Query(Parse.User);
    const student = await studentQuery.get(studentId, { useMasterKey: true });

    const OnboardingData = Parse.Object.extend('OnboardingData');
    const onboardingQuery = new Parse.Query(OnboardingData);
    onboardingQuery.equalTo('user', student);
    const onboardingData = await onboardingQuery.first({ useMasterKey: true });

    if (!onboardingData) {
      return {
        studentId,
        studentName: `${student.get('firstName')} ${student.get('lastName')}`,
        hasOnboardingData: false,
        message: 'No onboarding data found'
      };
    }

    return {
      studentId,
      studentName: `${student.get('firstName')} ${student.get('lastName')}`,
      studentEmail: student.get('email'),
      hasOnboardingData: true,
      data: onboardingData.get('data'),
      progressPercentage: onboardingData.get('progressPercentage'),
      completedAt: onboardingData.get('completedAt'),
      createdAt: onboardingData.get('createdAt'),
      lastUpdated: onboardingData.get('lastUpdated')
    };

  } catch (error) {
    console.error('Error getting student onboarding data:', error);
    throw error;
  }
});

/**
 * Reset onboarding (admin use only)
 */
Parse.Cloud.define('resetOnboarding', async (request) => {
  const { userId } = request.params;
  const requestingUser = request.user;

  if (!requestingUser) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  const role = requestingUser.get('role');
  if (role !== 'admin') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Admin access required');
  }

  if (!userId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'User ID is required');
  }

  try {
    // Reset onboarding completion flag
    await Parse.Cloud.run('updateUserPreference', {
      userId,
      key: 'onboardingCompleted',
      value: false
    }, { useMasterKey: true });

    // Delete OnboardingData record
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });

    const OnboardingData = Parse.Object.extend('OnboardingData');
    const onboardingQuery = new Parse.Query(OnboardingData);
    onboardingQuery.equalTo('user', user);
    const onboardingData = await onboardingQuery.first({ useMasterKey: true });

    if (onboardingData) {
      await onboardingData.destroy({ useMasterKey: true });
    }

    // Log activity
    await Parse.Cloud.run('logUserActivity', {
      userId,
      activityType: 'onboarding_reset',
      activityData: {
        resetBy: requestingUser.id,
        resetAt: new Date().toISOString()
      }
    }, { useMasterKey: true });

    return {
      success: true,
      message: 'Onboarding reset successfully'
    };

  } catch (error) {
    console.error('Error resetting onboarding:', error);
    throw error;
  }
});

module.exports = {
  // Export for testing if needed
  saveOnboardingData: Parse.Cloud.define,
  completeOnboarding: Parse.Cloud.define,
  getOnboardingProgress: Parse.Cloud.define
};
