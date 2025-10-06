/**
 * Seed Users Cloud Function
 * Creates demo users for testing
 */

const demoUsers = [
  {
    username: 'student@elimu.com',
    email: 'student@elimu.com',
    password: 'student',
    firstName: 'Alex',
    lastName: 'Mwangi',
    role: 'student',
    isActive: true
  },
  {
    username: 'sarah.counselor@elimu.com',
    email: 'sarah.counselor@elimu.com',
    password: 'counselor2024',
    firstName: 'Sarah',
    lastName: 'Njeri',
    role: 'counselor',
    isActive: true
  },
  {
    username: 'james.coach@elimu.com',
    email: 'james.coach@elimu.com',
    password: 'coach2024',
    firstName: 'James',
    lastName: 'Mutua',
    role: 'counselor',
    isActive: true
  },
  {
    username: 'counselor@elimu.com',
    email: 'counselor@elimu.com',
    password: 'counselor',
    firstName: 'Demo',
    lastName: 'Counselor',
    role: 'counselor',
    isActive: true
  },
  {
    username: 'mike.platform@elimu.com',
    email: 'mike.platform@elimu.com',
    password: 'platform2024',
    firstName: 'Mike',
    lastName: 'Kamau',
    role: 'admin',
    adminRoleType: 'platform',
    isActive: true
  },
  {
    username: 'linda.operations@elimu.com',
    email: 'linda.operations@elimu.com',
    password: 'operations2024',
    firstName: 'Linda',
    lastName: 'Wambui',
    role: 'admin',
    adminRoleType: 'operations',
    isActive: true
  },
  {
    username: 'peter.safety@elimu.com',
    email: 'peter.safety@elimu.com',
    password: 'safety2024',
    firstName: 'Peter',
    lastName: 'Otieno',
    role: 'admin',
    adminRoleType: 'provider_safety',
    isActive: true
  },
  {
    username: 'admin@elimu.com',
    email: 'admin@elimu.com',
    password: 'admin',
    firstName: 'Demo',
    lastName: 'Admin',
    role: 'admin',
    isActive: true
  }
];

Parse.Cloud.define('seedDemoUsers', async (request) => {
  // Only allow with master key
  if (!request.master) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Master key required');
  }

  const results = {
    created: [],
    existing: [],
    errors: []
  };

  for (const userData of demoUsers) {
    try {
      // Check if user already exists
      const existingUserQuery = new Parse.Query(Parse.User);
      existingUserQuery.equalTo('email', userData.email);
      const existingUser = await existingUserQuery.first({ useMasterKey: true });

      if (existingUser) {
        results.existing.push(userData.email);
        continue;
      }

      // Create new user
      const user = new Parse.User();
      user.set('username', userData.username);
      user.set('email', userData.email);
      user.set('password', userData.password);
      user.set('firstName', userData.firstName);
      user.set('lastName', userData.lastName);
      user.set('role', userData.role);
      user.set('isActive', userData.isActive);

      if (userData.adminRoleType) {
        user.set('adminRoleType', userData.adminRoleType);
      }

      await user.signUp(null, { useMasterKey: true });
      results.created.push(userData.email);

    } catch (error) {
      results.errors.push({
        email: userData.email,
        error: error.message
      });
    }
  }

  return {
    success: true,
    created: results.created.length,
    existing: results.existing.length,
    errors: results.errors.length,
    details: results
  };
});

console.log('✓ Seed Users Cloud Function loaded');
