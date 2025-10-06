/**
 * User Preferences Cloud Functions
 *
 * Manages user settings stored in Parse instead of localStorage
 * Enables cross-device persistence and backend analytics
 */

// Get user preferences
Parse.Cloud.define('getUserPreferences', async (request) => {
  const { user } = request;

  if (!user) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'User must be authenticated');
  }

  try {
    const query = new Parse.Query('UserPreferences');
    query.equalTo('user', user);

    let preferences = await query.first({ useMasterKey: true });

    // If no preferences exist, return defaults
    if (!preferences) {
      return {
        theme: 'orange', // Default student theme
        darkMode: false,
        onboardingCompleted: false,
        dashboardCardOrder: [],
        assessmentProgress: {}
      };
    }

    return {
      theme: preferences.get('theme') || 'orange',
      darkMode: preferences.get('darkMode') || false,
      onboardingCompleted: preferences.get('onboardingCompleted') || false,
      dashboardCardOrder: preferences.get('dashboardCardOrder') || [],
      assessmentProgress: preferences.get('assessmentProgress') || {}
    };

  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to fetch preferences');
  }
});

// Save or update user preferences
Parse.Cloud.define('saveUserPreferences', async (request) => {
  const { user, params } = request;

  if (!user) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'User must be authenticated');
  }

  const { theme, darkMode, onboardingCompleted, dashboardCardOrder, assessmentProgress } = params;

  try {
    const query = new Parse.Query('UserPreferences');
    query.equalTo('user', user);

    let preferences = await query.first({ useMasterKey: true });

    // Create new preferences if none exist
    if (!preferences) {
      const UserPreferences = Parse.Object.extend('UserPreferences');
      preferences = new UserPreferences();
      preferences.set('user', user);

      // Set ACL: only the user can read/write their preferences
      const acl = new Parse.ACL(user);
      acl.setPublicReadAccess(false);
      acl.setPublicWriteAccess(false);
      preferences.setACL(acl);
    }

    // Update fields (only set if provided)
    if (theme !== undefined) preferences.set('theme', theme);
    if (darkMode !== undefined) preferences.set('darkMode', darkMode);
    if (onboardingCompleted !== undefined) preferences.set('onboardingCompleted', onboardingCompleted);
    if (dashboardCardOrder !== undefined) preferences.set('dashboardCardOrder', dashboardCardOrder);
    if (assessmentProgress !== undefined) preferences.set('assessmentProgress', assessmentProgress);

    await preferences.save(null, { useMasterKey: true });

    return {
      success: true,
      message: 'Preferences saved successfully',
      preferences: {
        theme: preferences.get('theme'),
        darkMode: preferences.get('darkMode'),
        onboardingCompleted: preferences.get('onboardingCompleted'),
        dashboardCardOrder: preferences.get('dashboardCardOrder'),
        assessmentProgress: preferences.get('assessmentProgress')
      }
    };

  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to save preferences');
  }
});

// Update specific preference field (partial update)
Parse.Cloud.define('updateUserPreference', async (request) => {
  const { user, params } = request;

  if (!user) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'User must be authenticated');
  }

  const { field, value } = params;

  if (!field) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Field name is required');
  }

  const allowedFields = ['theme', 'darkMode', 'onboardingCompleted', 'dashboardCardOrder', 'assessmentProgress'];
  if (!allowedFields.includes(field)) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, `Invalid field: ${field}`);
  }

  try {
    const query = new Parse.Query('UserPreferences');
    query.equalTo('user', user);

    let preferences = await query.first({ useMasterKey: true });

    // Create new preferences if none exist
    if (!preferences) {
      const UserPreferences = Parse.Object.extend('UserPreferences');
      preferences = new UserPreferences();
      preferences.set('user', user);

      const acl = new Parse.ACL(user);
      acl.setPublicReadAccess(false);
      acl.setPublicWriteAccess(false);
      preferences.setACL(acl);
    }

    // Update specific field
    preferences.set(field, value);
    await preferences.save(null, { useMasterKey: true });

    return {
      success: true,
      message: `${field} updated successfully`,
      value: preferences.get(field)
    };

  } catch (error) {
    console.error(`Error updating preference field ${field}:`, error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to update ${field}`);
  }
});

console.log('✅ User Preferences Cloud Functions loaded');
