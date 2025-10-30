const fs = require('fs');
const mainFile = './backend/cloud/main.js';
const content = fs.readFileSync(mainFile, 'utf8');

const getAllCounselorsFunc = `
// Get all available counselors for student message selection
Parse.Cloud.define('getAllCounselors', async (request) => {
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  try {
    const User = Parse.Object.extend('_User');
    const query = new Parse.Query(User);
    query.equalTo('role', 'counselor');
    query.select(['id', 'name', 'email', 'specialty', 'bio', 'rating', 'avatar', 'online']);
    query.limit(100);

    const counselors = await query.find({ useMasterKey: true });

    // Check if user has an assigned counselor
    const assignedCounselorId = user.get('assignedCounselorId');

    return {
      counselors: counselors.map(counselor => ({
        id: counselor.id,
        name: counselor.get('name') || 'Counselor',
        title: counselor.get('specialty') || 'Career Counselor',
        rating: counselor.get('rating') || 4.5,
        specialties: [counselor.get('specialty') || 'General Guidance'],
        isOnline: counselor.get('online') === true,
        avatar: counselor.get('avatar'),
        isAssigned: counselor.id === assignedCounselorId
      })),
      assignedCounselorId: assignedCounselorId || null
    };
  } catch (error) {
    console.error('Error getting counselors:', error);
    throw new Parse.Error(Parse.Error.INTERNAL, 'Failed to load counselors');
  }
});

`;

const targetFunction = "// Get counselor's active chat sessions";
const insertIndex = content.indexOf(targetFunction);

if (insertIndex === -1) {
  console.error('Target function not found');
  process.exit(1);
}

const newContent = content.slice(0, insertIndex) + getAllCounselorsFunc + content.slice(insertIndex);
fs.writeFileSync(mainFile, newContent, 'utf8');
console.log('✅ getAllCounselors function added successfully');
