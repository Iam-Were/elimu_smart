/**
 * Subscription Trial Management Functions
 * Handles 3-month premium trial for new students
 */

// Global Parse is available from main.js - no require needed

/**
 * Initialize 3-month premium trial for new student
 * Called after onboarding completion
 */
Parse.Cloud.define('initializePremiumTrial', async (request) => {
  const { userId } = request.params;

  if (!userId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'User ID is required');
  }

  try {
    // Get user and verify they are a student
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });

    if (!user) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User not found');
    }

    const role = user.get('role');
    if (role !== 'student') {
      throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Only students are eligible for trial');
    }

    // Check if user already has an active subscription or trial
    const existingSubQuery = new Parse.Query('Subscription');
    existingSubQuery.equalTo('user', user);
    existingSubQuery.equalTo('isActive', true);
    const existingSub = await existingSubQuery.first({ useMasterKey: true });

    if (existingSub) {
      throw new Parse.Error(Parse.Error.DUPLICATE_VALUE, 'User already has an active subscription');
    }

    // Create trial subscription
    const Subscription = Parse.Object.extend('Subscription');
    const trial = new Subscription();

    const now = new Date();
    const trialEndDate = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days

    trial.set('user', user);
    trial.set('plan', 'premium');
    trial.set('status', 'trial');
    trial.set('isActive', true);
    trial.set('isTrial', true);
    trial.set('trialStartDate', now);
    trial.set('trialEndDate', trialEndDate);
    trial.set('features', ['messaging', 'sessions', 'priority_support', 'advanced_assessments']);
    trial.set('autoRenew', false);

    await trial.save(null, { useMasterKey: true });

    return {
      success: true,
      trialId: trial.id,
      trialEndDate: trialEndDate.toISOString(),
      daysRemaining: 90,
      message: '3-month premium trial activated successfully'
    };

  } catch (error) {
    console.error('Error initializing trial:', error);
    throw error;
  }
});

/**
 * Check trial status for a user
 * Returns trial info and days remaining
 */
Parse.Cloud.define('checkTrialStatus', async (request) => {
  const { userId } = request.params;

  if (!userId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'User ID is required');
  }

  try {
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });

    const subQuery = new Parse.Query('Subscription');
    subQuery.equalTo('user', user);
    subQuery.equalTo('isTrial', true);
    const trial = await subQuery.first({ useMasterKey: true });

    if (!trial) {
      return {
        hasTrial: false,
        isActive: false,
        message: 'No trial found'
      };
    }

    const now = new Date();
    const endDate = trial.get('trialEndDate');
    const isActive = trial.get('isActive');
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

    return {
      hasTrial: true,
      isActive: isActive && daysRemaining > 0,
      trialStartDate: trial.get('trialStartDate').toISOString(),
      trialEndDate: endDate.toISOString(),
      daysRemaining: Math.max(0, daysRemaining),
      status: trial.get('status'),
      features: trial.get('features')
    };

  } catch (error) {
    console.error('Error checking trial status:', error);
    throw error;
  }
});

/**
 * Get trial expiry date for a user
 */
Parse.Cloud.define('getTrialExpiryDate', async (request) => {
  const { userId } = request.params;

  if (!userId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'User ID is required');
  }

  try {
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });

    const subQuery = new Parse.Query('Subscription');
    subQuery.equalTo('user', user);
    subQuery.equalTo('isTrial', true);
    subQuery.equalTo('isActive', true);
    const trial = await subQuery.first({ useMasterKey: true });

    if (!trial) {
      return null;
    }

    return {
      expiryDate: trial.get('trialEndDate').toISOString(),
      daysRemaining: Math.ceil(
        (trial.get('trialEndDate') - new Date()) / (1000 * 60 * 60 * 24)
      )
    };

  } catch (error) {
    console.error('Error getting trial expiry:', error);
    throw error;
  }
});

/**
 * Handle trial expiry (scheduled job)
 * Downgrades expired trials to free tier
 * Should be run daily via Parse Cloud Jobs
 */
Parse.Cloud.define('handleTrialExpiry', async (request) => {
  try {
    const now = new Date();

    // Find all active trials that have expired
    const expiredTrialsQuery = new Parse.Query('Subscription');
    expiredTrialsQuery.equalTo('isTrial', true);
    expiredTrialsQuery.equalTo('isActive', true);
    expiredTrialsQuery.lessThan('trialEndDate', now);

    const expiredTrials = await expiredTrialsQuery.find({ useMasterKey: true });

    if (expiredTrials.length === 0) {
      return {
        success: true,
        processed: 0,
        message: 'No expired trials found'
      };
    }

    // Deactivate each expired trial
    const updates = expiredTrials.map(trial => {
      trial.set('isActive', false);
      trial.set('status', 'expired');
      return trial.save(null, { useMasterKey: true });
    });

    await Promise.all(updates);

    // Log activity for each user
    const activityLogs = expiredTrials.map(async trial => {
      const user = trial.get('user');
      await Parse.Cloud.run('logUserActivity', {
        userId: user.id,
        activityType: 'trial_expired',
        activityData: {
          trialEndDate: trial.get('trialEndDate').toISOString(),
          trialDuration: 90
        }
      }, { useMasterKey: true });
    });

    await Promise.all(activityLogs);

    return {
      success: true,
      processed: expiredTrials.length,
      message: `Successfully expired ${expiredTrials.length} trials`
    };

  } catch (error) {
    console.error('Error handling trial expiry:', error);
    throw error;
  }
});

/**
 * Manually expire a trial (admin use)
 */
Parse.Cloud.define('expireTrial', async (request) => {
  const { userId } = request.params;
  const admin = request.user;

  if (!admin || admin.get('role') !== 'admin') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Admin access required');
  }

  if (!userId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'User ID is required');
  }

  try {
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });

    const subQuery = new Parse.Query('Subscription');
    subQuery.equalTo('user', user);
    subQuery.equalTo('isTrial', true);
    subQuery.equalTo('isActive', true);
    const trial = await subQuery.first({ useMasterKey: true });

    if (!trial) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'No active trial found');
    }

    trial.set('isActive', false);
    trial.set('status', 'expired');
    await trial.save(null, { useMasterKey: true });

    // Log activity
    await Parse.Cloud.run('logUserActivity', {
      userId: user.id,
      activityType: 'trial_manually_expired',
      activityData: {
        expiredBy: admin.id,
        expiredAt: new Date().toISOString()
      }
    }, { useMasterKey: true });

    return {
      success: true,
      message: 'Trial expired successfully'
    };

  } catch (error) {
    console.error('Error expiring trial:', error);
    throw error;
  }
});

module.exports = {
  // Export for testing if needed
  initializePremiumTrial: Parse.Cloud.define,
  checkTrialStatus: Parse.Cloud.define,
  handleTrialExpiry: Parse.Cloud.define
};
