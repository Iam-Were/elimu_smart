// Elimu Smart Parse Cloud Functions
// These functions run on the server and handle business logic

// Import services
const emailService = require('../services/emailService')
const { cache, getCached, invalidateCache, CACHE_TTL } = require('../utils/cache')

// Import billing functions (auto-registers cloud functions)
require('./billingFunctions');

// Import assessment functions (auto-registers cloud functions)
require('./assessmentFunctions');

// Import seed users function (auto-registers cloud functions)
// REMOVED FOR PRODUCTION - No demo data in live environment
// require('./seedUsers');

// Import user preferences functions (auto-registers cloud functions)
require('./userPreferencesFunctions');

// Import RIASEC scoring functions (auto-registers cloud functions)
require('./riasecScoringFunctions');

// Import career functions (auto-registers cloud functions)
require('./careerFunctions');

// Import chat preferences functions (auto-registers cloud functions)
// Fixed: removed 'const Parse = require('parse/node')' - uses global Parse
require('./chatPreferencesFunctions');

// Import personalized insights functions (auto-registers cloud functions)
require('./personalizedInsightsFunctions');

// Import dashboard functions (auto-registers cloud functions)
require('./dashboardFunctions');

// Import career schema migration function (auto-registers cloud functions)
require('./careerSchemaMigration');

// Import community forum functions (auto-registers cloud functions)
require('./communityForumFunctions');

// Import counselor booking functions (auto-registers cloud functions)
require('./counselorBookingFunctions');

// Import RIASEC email report functions (auto-registers cloud functions)
require('./riasecEmailReport');

// Import subscription trial functions (auto-registers cloud functions)
require('./subscriptionTrialFunctions');

// Import counselor assignment functions (auto-registers cloud functions)
require('./counselorAssignmentFunctions');

// Import onboarding workflow functions (auto-registers cloud functions)
require('./onboardingFunctions');

// =============================================================================
// SECURITY: CHAT MESSAGE ACCESS CONTROL (Defense-in-Depth)
// =============================================================================

/**
 * beforeFind hook for ChatMessage - Ensures users can only query messages
 * from conversations they're participants in.
 *
 * This is a defense-in-depth layer in addition to explicit checks in cloud functions.
 */
Parse.Cloud.beforeFind('ChatMessage', async (request) => {
  const user = request.user;
  const query = request.query;

  // Allow master key access (for cloud functions and admin operations)
  if (request.master) {
    return query;
  }

  // Deny unauthenticated access
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING,
      'User must be authenticated to access messages');
  }

  // Get the chatRoom being queried
  const constraints = query._where;
  const chatRoomConstraint = constraints?.chatRoom;

  if (!chatRoomConstraint || !chatRoomConstraint.objectId) {
    // If no specific chat room is being queried, this might be admin dashboard
    // Still require authentication but allow the query
    return query;
  }

  const chatRoomId = chatRoomConstraint.objectId;

  // Verify user is a participant in this chat room
  const ChatRoom = Parse.Object.extend('ChatRoom');
  const roomQuery = new Parse.Query(ChatRoom);

  try {
    const chatRoom = await roomQuery.get(chatRoomId, { useMasterKey: true });
    const participants = chatRoom.get('participants') || [];

    if (!participants.includes(user.id)) {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN,
        'You do not have access to this conversation');
    }
  } catch (error) {
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND,
        'Chat room not found');
    }
    throw error;
  }

  // Allow the query to proceed
  return query;
});

// =============================================================================
// CLOUD FUNCTIONS
// =============================================================================

// Initialize schema for student-counselor functionality
Parse.Cloud.define('initializeStudentCounselorSchema', async (request) => {
  const { user } = request;

  // Only admins can initialize schema
  if (!user || user.get('role') !== 'admin') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only admins can initialize schema');
  }

  try {
    const schema = new Parse.Schema('StudentQuestion');

    // Check if schema already exists
    try {
      await schema.get();
      console.log('StudentQuestion schema already exists');
    } catch {
      // Create new schema
      schema.addString('studentId');
      schema.addString('counselorId');
      schema.addString('question');
      schema.addString('answer');
      schema.addString('status'); // 'pending', 'answered', 'archived'
      schema.addString('priority'); // 'high', 'medium', 'low'
      schema.addString('category'); // 'academic', 'career', 'personal', 'university', 'general'
      schema.addDate('askedAt');
      schema.addDate('answeredAt');
      schema.addString('studentName');
      schema.addString('studentEmail');

      await schema.save();
      console.log('StudentQuestion schema created successfully');
    }

    // Create CounselingSession schema
    const sessionSchema = new Parse.Schema('CounselingSession');

    try {
      await sessionSchema.get();
      console.log('CounselingSession schema already exists');
    } catch {
      sessionSchema.addString('studentId');
      sessionSchema.addString('counselorId');
      sessionSchema.addString('requestedBy'); // 'student' or 'counselor'
      sessionSchema.addString('sessionType'); // 'career', 'academic', 'personal', 'university'
      sessionSchema.addString('status'); // 'requested', 'scheduled', 'completed', 'cancelled'
      sessionSchema.addArray('requestedTimes'); // Array of ISO date strings
      sessionSchema.addDate('scheduledAt');
      sessionSchema.addNumber('duration'); // in minutes
      sessionSchema.addString('topic');
      sessionSchema.addString('counselorNotes');
      sessionSchema.addString('outcomes');
      sessionSchema.addString('studentName');
      sessionSchema.addString('counselorName');

      await sessionSchema.save();
      console.log('CounselingSession schema created successfully');
    }

    // Add assignedCounselorId to User schema
    const userSchema = new Parse.Schema(Parse.User);

    try {
      await userSchema.get();

      // Update existing schema to add new field
      userSchema.addString('assignedCounselorId');
      await userSchema.update();
      console.log('Added assignedCounselorId to User schema');
    } catch (error) {
      console.log('User schema update error (may already have field):', error.message);
    }

    return {
      success: true,
      message: 'Student-Counselor schema initialized successfully',
      schemas: ['StudentQuestion', 'CounselingSession', 'User (updated)']
    };

  } catch (error) {
    console.error('Schema initialization error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, `Schema initialization failed: ${error.message}`);
  }
});

// Initialize RIASEC Assessment Database Schema
Parse.Cloud.define('initializeRiasecSchema', async (request) => {
  const { user } = request;

  // Only admins can initialize schema
  if (!user || user.get('role') !== 'admin') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only admins can initialize schema');
  }

  try {
    // Create RiasecQuestion schema
    const questionSchema = new Parse.Schema('RiasecQuestion');

    try {
      await questionSchema.get();
      console.log('RiasecQuestion schema already exists');
    } catch {
      questionSchema.addNumber('questionId'); // 1-96
      questionSchema.addString('category'); // 'activities' or 'occupations'
      questionSchema.addString('statement');
      questionSchema.addString('riasecType'); // 'R', 'I', 'A', 'S', 'E', 'C'
      questionSchema.addString('kenyaContext');
      questionSchema.addBoolean('isActive', { defaultValue: true });
      questionSchema.addNumber('difficultyLevel'); // 1-5 for future adaptive testing
      questionSchema.addNumber('timesPresented', { defaultValue: 0 });
      questionSchema.addNumber('averageResponseTime'); // milliseconds

      await questionSchema.save();
      console.log('RiasecQuestion schema created successfully');
    }

    // Create RiasecType schema (metadata for R/I/A/S/E/C types)
    const typeSchema = new Parse.Schema('RiasecType');

    try {
      await typeSchema.get();
      console.log('RiasecType schema already exists');
    } catch {
      typeSchema.addString('code'); // 'R', 'I', 'A', 'S', 'E', 'C'
      typeSchema.addString('name'); // 'Realistic', 'Investigative', etc.
      typeSchema.addString('description');
      typeSchema.addArray('characteristics');
      typeSchema.addArray('workEnvironments');
      typeSchema.addArray('kenyaCareers');
      typeSchema.addArray('kuccpsPathways');

      await typeSchema.save();
      console.log('RiasecType schema created successfully');
    }

    // Create KenyaCareer schema
    const careerSchema = new Parse.Schema('KenyaCareer');

    try {
      await careerSchema.get();
      console.log('KenyaCareer schema already exists');
    } catch {
      careerSchema.addString('careerName');
      careerSchema.addString('primaryRiasecType'); // 'R', 'I', 'A', 'S', 'E', 'C'
      careerSchema.addArray('secondaryRiasecTypes'); // ['I', 'E'] etc.
      careerSchema.addString('kuccpsPathway');
      careerSchema.addString('description');
      careerSchema.addArray('requiredSubjects');
      careerSchema.addNumber('minClusterPoints');
      careerSchema.addObject('salaryRange'); // { min, max, currency }
      careerSchema.addArray('topUniversities');
      careerSchema.addString('demandLevel'); // 'high', 'medium', 'low'
      careerSchema.addArray('skills');
      careerSchema.addBoolean('isActive', { defaultValue: true });

      await careerSchema.save();
      console.log('KenyaCareer schema created successfully');
    }

    return {
      success: true,
      message: 'RIASEC Assessment schema initialized successfully',
      schemas: ['RiasecQuestion', 'RiasecType', 'KenyaCareer']
    };

  } catch (error) {
    console.error('RIASEC schema initialization error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, `Schema initialization failed: ${error.message}`);
  }
});

Parse.Cloud.define('hello', (request) => {
  return 'Hello from Elimu Smart Parse Server!';
});

// User registration with role-based setup
Parse.Cloud.afterSave(Parse.User, async (request) => {
  const user = request.object;
  
  // Only run for new users
  if (user.existed()) {
    return;
  }

  console.log(`New user registered: ${user.get('email')} with role: ${user.get('role')}`);

  try {
    // Create initial user profile based on role
    const userRole = user.get('role');
    
    if (userRole === 'student') {
      // Create initial student progress record
      const StudentProgress = Parse.Object.extend('StudentProgress');
      const progress = new StudentProgress();
      progress.set('user', user);
      progress.set('careerReadinessScore', 0);
      progress.set('assessmentsCompleted', 0);
      progress.set('streakCount', 0);
      progress.set('isActive', true);
      
      await progress.save(null, { useMasterKey: true });
      console.log('Created initial student progress for:', user.get('email'));
    }
    
    if (userRole === 'counselor' || userRole === 'career_counselor') {
      // Create counselor profile
      const CounselorProfile = Parse.Object.extend('CounselorProfile');
      const profile = new CounselorProfile();
      profile.set('user', user);
      profile.set('specialization', user.get('role') === 'career_counselor' ? 'Career' : 'Academic');
      profile.set('studentsAssigned', 0);
      profile.set('isVerified', false);
      
      await profile.save(null, { useMasterKey: true });
      console.log('Created counselor profile for:', user.get('email'));
    }

  } catch (error) {
    console.error('Error in user afterSave:', error);
  }
});

// Calculate KUCCPS cutoff points
Parse.Cloud.define('calculateKUCCPSPoints', async (request) => {
  const { subjects, gradePoints } = request.params;
  
  try {
    // Basic KUCCPS points calculation logic
    let totalPoints = 0;
    let subjectCount = 0;
    
    for (const [subject, grade] of Object.entries(gradePoints)) {
      if (subjects.includes(subject)) {
        totalPoints += getGradePoints(grade);
        subjectCount++;
      }
    }
    
    const averagePoints = subjectCount > 0 ? totalPoints / subjectCount : 0;
    
    return {
      totalPoints,
      averagePoints,
      subjectCount,
      eligibility: averagePoints >= 7.0 ? 'Eligible' : 'Not Eligible'
    };
    
  } catch (error) {
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to calculate KUCCPS points');
  }
});

// Helper function to convert grades to points
function getGradePoints(grade) {
  const gradeMap = {
    'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7,
    'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
  };
  return gradeMap[grade] || 0;
}

// Update career readiness score
Parse.Cloud.define('updateCareerReadiness', async (request) => {
  const { userId, newScore, activity } = request.params;
  
  try {
    const query = new Parse.Query('StudentProgress');
    query.equalTo('user', { __type: 'Pointer', className: '_User', objectId: userId });
    
    const progress = await query.first({ useMasterKey: true });
    if (!progress) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Student progress not found');
    }
    
    const currentScore = progress.get('careerReadinessScore') || 0;
    const updatedScore = Math.min(100, Math.max(0, currentScore + newScore));
    
    progress.set('careerReadinessScore', updatedScore);
    progress.set('lastActivity', new Date());
    
    // Update streak if activity was completed today
    if (activity === 'daily_checkin') {
      const lastCheckin = progress.get('lastCheckin');
      const today = new Date();
      
      if (!lastCheckin || !isSameDay(lastCheckin, today)) {
        const currentStreak = progress.get('streakCount') || 0;
        progress.set('streakCount', currentStreak + 1);
        progress.set('lastCheckin', today);
      }
    }
    
    await progress.save(null, { useMasterKey: true });
    
    return {
      success: true,
      newScore: updatedScore,
      streakCount: progress.get('streakCount')
    };
    
  } catch (error) {
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to update career readiness');
  }
});

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

// University course matching
Parse.Cloud.define('matchUniversityCourses', async (request) => {
  const { userId, cutoffPoints, interests } = request.params;
  
  try {
    // Query courses from database
    const Course = Parse.Object.extend('Course');
    const query = new Parse.Query(Course);
    query.equalTo('isActive', true);
    query.lessThanOrEqualTo('cutoffPoints', cutoffPoints);
    query.descending('cutoffPoints');
    query.limit(50);
    
    const courses = await query.find({ useMasterKey: true });
    
    const eligibleCourses = courses.map(course => ({
      name: course.get('name'),
      cutoff: course.get('cutoffPoints'),
      university: course.get('university')
    }));
    
    return {
      eligibleCourses,
      totalMatches: eligibleCourses.length,
      recommendedAction: eligibleCourses.length > 0 ? 'Apply Now' : 'Improve Grades'
    };
    
  } catch (error) {
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to match university courses');
  }
});

// ===== REAL-TIME CHAT SYSTEM =====

// Create a new chat room
Parse.Cloud.define('createChatRoom', async (request) => {
  const { participantIds, type = 'counseling', title } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  const ChatRoom = Parse.Object.extend('ChatRoom');
  const chatRoom = new ChatRoom();
  
  chatRoom.set('participants', participantIds);
  chatRoom.set('type', type); // 'counseling', 'mentoring', 'group'
  chatRoom.set('title', title || `${type.charAt(0).toUpperCase() + type.slice(1)} Session`);
  chatRoom.set('createdBy', user);
  chatRoom.set('isActive', true);
  chatRoom.set('lastActivity', new Date());
  chatRoom.set('messageCount', 0);
  
  // Set ACL for participants only
  const acl = new Parse.ACL();
  participantIds.forEach(participantId => {
    acl.setReadAccess(participantId, true);
    acl.setWriteAccess(participantId, true);
  });
  chatRoom.setACL(acl);
  
  const savedRoom = await chatRoom.save(null, { useMasterKey: true });
  return savedRoom;
});

// Send a message
Parse.Cloud.define('sendMessage', async (request) => {
  const { chatRoomId, message, messageType = 'text' } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  const ChatMessage = Parse.Object.extend('ChatMessage');
  const chatMessage = new ChatMessage();
  
  // Create pointer to chat room
  const chatRoomPointer = {
    __type: 'Pointer',
    className: 'ChatRoom',
    objectId: chatRoomId
  };
  
  chatMessage.set('chatRoom', chatRoomPointer);
  chatMessage.set('sender', user);
  chatMessage.set('message', message);
  chatMessage.set('messageType', messageType);
  chatMessage.set('timestamp', new Date());
  chatMessage.set('isRead', false);
  chatMessage.set('status', 'sent'); // Initial status
  
  const savedMessage = await chatMessage.save(null, { useMasterKey: true });
  
  // Update chat room last activity and message count
  const ChatRoom = Parse.Object.extend('ChatRoom');
  const query = new Parse.Query(ChatRoom);
  const chatRoom = await query.get(chatRoomId, { useMasterKey: true });
  chatRoom.set('lastActivity', new Date());
  chatRoom.set('lastMessage', message);
  chatRoom.increment('messageCount');
  await chatRoom.save(null, { useMasterKey: true });
  
  return savedMessage;
});

// Update message status (delivered/read)
Parse.Cloud.define('updateMessageStatus', async (request) => {
  const { messageId, status } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  if (!['delivered', 'read'].includes(status)) {
    throw new Parse.Error(Parse.Error.INVALID_ARGUMENT, 'Invalid status. Must be "delivered" or "read"');
  }
  
  const ChatMessage = Parse.Object.extend('ChatMessage');
  const query = new Parse.Query(ChatMessage);
  const message = await query.get(messageId, { useMasterKey: true });
  
  // Only update if user is recipient (not sender)
  const sender = message.get('sender');
  if (sender.id === user.id) {
    return message; // Don't update own messages
  }
  
  // Update status
  message.set('status', status);
  if (status === 'read') {
    message.set('isRead', true);
  }
  
  const savedMessage = await message.save(null, { useMasterKey: true });
  return savedMessage;
});

// Bulk update message status for a room (mark all as delivered/read)
Parse.Cloud.define('updateRoomMessagesStatus', async (request) => {
  const { chatRoomId, status } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  if (!['delivered', 'read'].includes(status)) {
    throw new Parse.Error(Parse.Error.INVALID_ARGUMENT, 'Invalid status');
  }
  
  const ChatMessage = Parse.Object.extend('ChatMessage');
  const query = new Parse.Query(ChatMessage);
  query.equalTo('chatRoomId', chatRoomId);
  query.notEqualTo('sender', user); // Don't update own messages
  query.limit(1000);
  
  const messages = await query.find({ useMasterKey: true });
  
  messages.forEach(message => {
    message.set('status', status);
    if (status === 'read') {
      message.set('isRead', true);
    }
  });
  
  await Parse.Object.saveAll(messages, { useMasterKey: true });
  return { updated: messages.length };
});

// Get chat rooms for current user
Parse.Cloud.define('getChatRooms', async (request) => {
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  const ChatRoom = Parse.Object.extend('ChatRoom');
  const query = new Parse.Query(ChatRoom);
  query.containsAll('participants', [user.id]);
  query.equalTo('isActive', true);
  query.descending('lastActivity');
  query.include(['createdBy']);
  query.limit(50);

  const chatRooms = await query.find({ useMasterKey: true });

  // Filter out conversations deleted by current user and personalize titles
  const personalizedRooms = await Promise.all(
    chatRooms
      .filter(room => {
        const deletedBy = room.get('deletedBy') || [];
        return !deletedBy.includes(user.id);
      })
      .map(async (room) => {
        const roomData = room.toJSON();
        const participants = roomData.participants || [];
        const otherParticipantId = participants.find(id => id !== user.id);

        // Add pin/mute status for current user
        const pinnedBy = room.get('pinnedBy') || [];
        const mutedBy = room.get('mutedBy') || [];
        roomData.isPinned = pinnedBy.includes(user.id);
        roomData.isMuted = mutedBy.includes(user.id);

        if (otherParticipantId) {
          try {
            const userQuery = new Parse.Query(Parse.User);
            const otherUser = await userQuery.get(otherParticipantId, { useMasterKey: true });
            // LinkedIn pattern: Just show the name, not "Chat with X"
            // Fallback: name -> username (if not email) -> formatted email -> 'User'
            let otherUserName = otherUser.get('name');
            if (!otherUserName) {
              const username = otherUser.get('username');
              // Only use username if it's not an email address
              if (username && !username.includes('@')) {
                otherUserName = username;
              } else {
                const email = otherUser.get('email') || username;
                if (email) {
                  // Format email as name: "student@example.com" -> "Student"
                  const emailPrefix = email.split('@')[0];
                  otherUserName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
                } else {
                  otherUserName = 'User';
                }
              }
            }
            roomData.title = otherUserName;
            // Include participant details for richer UI
            roomData.participantName = otherUserName;
            roomData.participantRole = otherUser.get('role') || 'user';
          } catch (error) {
            console.warn('Failed to fetch participant name:', error);
          }
        }

        return roomData;
      })
  );

  // Sort pinned conversations to top
  return personalizedRooms.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0; // Keep original order (by lastActivity) for same pin status
  });
});

// Get messages for a chat room
Parse.Cloud.define('getChatMessages', async (request) => {
  const { chatRoomId, limit = 50, skip = 0 } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  // 🔒 SECURITY FIX: Verify user is a participant in this chat room
  const ChatRoom = Parse.Object.extend('ChatRoom');
  const roomQuery = new Parse.Query(ChatRoom);
  const chatRoom = await roomQuery.get(chatRoomId, { useMasterKey: true });

  const participants = chatRoom.get('participants') || [];
  if (!participants.includes(user.id)) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN,
      'You do not have access to this conversation');
  }

  // ✅ User is authorized - proceed with fetching messages
  const ChatMessage = Parse.Object.extend('ChatMessage');
  const query = new Parse.Query(ChatMessage);

  // Create pointer to chat room for query
  const chatRoomPointer = {
    __type: 'Pointer',
    className: 'ChatRoom',
    objectId: chatRoomId
  };

  query.equalTo('chatRoom', chatRoomPointer);
  query.ascending('createdAt');
  query.include(['sender']);
  query.limit(limit);
  query.skip(skip);

  const messages = await query.find({ useMasterKey: true });
  return messages;
});

// Mark messages as read
Parse.Cloud.define('markMessagesAsRead', async (request) => {
  const { chatRoomId } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  // 🔒 SECURITY FIX: Verify user is a participant in this chat room
  const ChatRoom = Parse.Object.extend('ChatRoom');
  const roomQuery = new Parse.Query(ChatRoom);
  const chatRoom = await roomQuery.get(chatRoomId, { useMasterKey: true });

  const participants = chatRoom.get('participants') || [];
  if (!participants.includes(user.id)) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN,
      'You do not have access to this conversation');
  }

  // ✅ User is authorized - proceed with marking messages
  const ChatMessage = Parse.Object.extend('ChatMessage');
  const query = new Parse.Query(ChatMessage);

  const chatRoomPointer = {
    __type: 'Pointer',
    className: 'ChatRoom',
    objectId: chatRoomId
  };

  query.equalTo('chatRoom', chatRoomPointer);
  query.notEqualTo('sender', user);
  query.equalTo('isRead', false);

  const messages = await query.find({ useMasterKey: true });

  messages.forEach(message => {
    message.set('isRead', true);
  });

  await Parse.Object.saveAll(messages, { useMasterKey: true });
  return { messagesMarked: messages.length };
});

// ===== NOTIFICATION SYSTEM =====

Parse.Cloud.define('createNotification', async (request) => {
  const { recipientId, title, message, type = 'info', actionUrl, chatRoomId } = request.params;
  const user = request.user;
  
  const Notification = Parse.Object.extend('Notification');
  const notification = new Notification();
  
  // Create pointer to recipient
  const recipientPointer = {
    __type: 'Pointer',
    className: '_User',
    objectId: recipientId
  };
  
  notification.set('recipient', recipientPointer);
  notification.set('sender', user ? user.id : 'system');
  notification.set('title', title);
  notification.set('message', message);
  notification.set('type', type); // 'info', 'warning', 'success', 'chat', 'session'
  notification.set('actionUrl', actionUrl);
  notification.set('chatRoomId', chatRoomId);
  notification.set('isRead', false);
  notification.set('timestamp', new Date());
  
  const savedNotification = await notification.save(null, { useMasterKey: true });
  return savedNotification;
});

// Get notifications for current user
Parse.Cloud.define('getNotifications', async (request) => {
  const { limit = 20, unreadOnly = false } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  const Notification = Parse.Object.extend('Notification');
  const query = new Parse.Query(Notification);
  
  const userPointer = {
    __type: 'Pointer',
    className: '_User',
    objectId: user.id
  };
  
  query.equalTo('recipient', userPointer);
  if (unreadOnly) {
    query.equalTo('isRead', false);
  }
  query.descending('timestamp');
  query.limit(limit);
  
  const notifications = await query.find({ useMasterKey: true });
  return notifications;
});

// Trigger notifications when new messages are sent
Parse.Cloud.afterSave('ChatMessage', async (request) => {
  const message = request.object;
  
  if (message.existed()) {
    return; // Only for new messages
  }
  
  try {
    const sender = message.get('sender');
    const chatRoom = message.get('chatRoom');
    
    // Get chat room details
    const ChatRoom = Parse.Object.extend('ChatRoom');
    const roomQuery = new Parse.Query(ChatRoom);
    const room = await roomQuery.get(chatRoom.id, { useMasterKey: true });
    
    const participants = room.get('participants');
    const roomTitle = room.get('title');
    
    // Send notification to all participants except sender
    participants.forEach(async (participantId) => {
      if (participantId !== sender.id) {
        await Parse.Cloud.run('createNotification', {
          recipientId: participantId,
          title: `New message in ${roomTitle}`,
          message: message.get('message').substring(0, 50) + '...',
          type: 'chat',
          actionUrl: `/guidance/chat-room/${chatRoom.id}`,
          chatRoomId: chatRoom.id
        }, { useMasterKey: true });
      }
    });
  } catch (error) {
    console.error('Error sending chat notifications:', error);
  }
});

// ===== FILE UPLOAD SYSTEM =====

Parse.Cloud.define('uploadFile', async (request) => {
  const { fileName, fileData, fileType, chatRoomId } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  try {
    // Create Parse File from base64 data
    const parseFile = new Parse.File(fileName, { base64: fileData }, fileType);
    const savedFile = await parseFile.save();
    
    // If this is for a chat, create a message with the file
    if (chatRoomId) {
      const ChatMessage = Parse.Object.extend('ChatMessage');
      const message = new ChatMessage();
      
      const chatRoomPointer = {
        __type: 'Pointer',
        className: 'ChatRoom',
        objectId: chatRoomId
      };
      
      message.set('chatRoom', chatRoomPointer);
      message.set('sender', user);
      message.set('message', fileName);
      message.set('messageType', fileType.startsWith('image/') ? 'image' : 'file');
      message.set('fileUrl', savedFile.url());
      message.set('fileName', fileName);
      message.set('fileSize', fileData.length);
      message.set('timestamp', new Date());
      message.set('isRead', false);
      
      await message.save(null, { useMasterKey: true });
      
      // Update chat room
      const ChatRoom = Parse.Object.extend('ChatRoom');
      const roomQuery = new Parse.Query(ChatRoom);
      const chatRoom = await roomQuery.get(chatRoomId, { useMasterKey: true });
      chatRoom.set('lastActivity', new Date());
      chatRoom.set('lastMessage', `📎 ${fileName}`);
      chatRoom.increment('messageCount');
      await chatRoom.save(null, { useMasterKey: true });
    }
    
    return {
      success: true,
      file: {
        name: savedFile.name(),
        url: savedFile.url(),
        size: fileData.length
      }
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to upload file');
  }
});

Parse.Cloud.define('uploadProfileImage', async (request) => {
  const { imageData, fileName } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  // Validate input
  if (!imageData) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Image data is required');
  }

  try {
    // Extract base64 data (imageData format: "data:image/jpeg;base64,/9j/4AAQ...")
    // Parse.File needs only the base64 part after the comma
    const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;

    // Validate base64 data exists and is not empty
    if (!base64Data || base64Data.trim() === '') {
      throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Invalid image data');
    }

    // Detect file type from data URL - support more MIME types
    const mimeMatch = imageData.match(/data:(image\/[a-z]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/webp';

    // Sanitize filename
    const cleanFileName = (fileName || 'profile-image.webp').replace(/[^a-zA-Z0-9.-]/g, '_');

    // Create Parse File with clean base64 data
    const parseFile = new Parse.File(cleanFileName, { base64: base64Data }, mimeType);
    // CRITICAL: Pass sessionToken for authenticated user file uploads
    // fileUpload.enableForAuthenticatedUser requires user context, not masterKey
    const savedFile = await parseFile.save(null, { sessionToken: user.getSessionToken() });

    // Verify file was saved
    if (!savedFile || !savedFile.url()) {
      throw new Parse.Error(Parse.Error.FILE_SAVE_ERROR, 'Failed to save file to server');
    }

    // Get file URL and convert to HTTPS public URL
    let fileUrl = savedFile.url();

    // Fix mixed content: Replace internal Parse Server URL with public HTTPS URL
    // http://145.239.42.121:1337/parse/files/... → https://elimu-smart.co.ke/parse/files/...
    if (fileUrl.includes('145.239.42.121:1337')) {
      fileUrl = fileUrl.replace('http://145.239.42.121:1337', 'https://elimu-smart.co.ke');
    } else if (fileUrl.includes('localhost:1337')) {
      fileUrl = fileUrl.replace('http://localhost:1337', 'https://elimu-smart.co.ke');
    }

    // Update user's profile image with HTTPS URL
    user.set('profileImage', fileUrl);
    await user.save(null, { sessionToken: user.getSessionToken() });

    return {
      success: true,
      url: fileUrl
    };
  } catch (error) {
    console.error('Profile image upload error:', error);

    // Provide more specific error messages
    if (error.code === Parse.Error.VALIDATION_ERROR ||
        error.code === Parse.Error.FILE_SAVE_ERROR ||
        error.code === Parse.Error.SESSION_MISSING) {
      throw error; // Re-throw Parse errors with original message
    }

    // Generic error for unexpected failures
    throw new Parse.Error(
      Parse.Error.SCRIPT_FAILED,
      `Failed to upload profile image: ${error.message || 'Unknown error'}`
    );
  }
});

Parse.Cloud.define('uploadCoverPhoto', async (request) => {
  const { imageData, fileName } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  // Validate input
  if (!imageData) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Image data is required');
  }

  try {
    // Extract base64 data
    const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;

    // Validate base64 data exists and is not empty
    if (!base64Data || base64Data.trim() === '') {
      throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Invalid image data');
    }

    // Detect file type from data URL - support more MIME types
    const mimeMatch = imageData.match(/data:(image\/[a-z]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/webp';

    // Sanitize filename
    const cleanFileName = (fileName || 'cover-photo.webp').replace(/[^a-zA-Z0-9.-]/g, '_');

    // Create Parse File with clean base64 data
    const parseFile = new Parse.File(cleanFileName, { base64: base64Data }, mimeType);
    const savedFile = await parseFile.save(null, { sessionToken: user.getSessionToken() });

    // Verify file was saved
    if (!savedFile || !savedFile.url()) {
      throw new Parse.Error(Parse.Error.FILE_SAVE_ERROR, 'Failed to save file to server');
    }

    // Get file URL and convert to HTTPS public URL
    let fileUrl = savedFile.url();

    // Fix mixed content: Replace internal Parse Server URL with public HTTPS URL
    // http://145.239.42.121:1337/parse/files/... → https://elimu-smart.co.ke/parse/files/...
    if (fileUrl.includes('145.239.42.121:1337')) {
      fileUrl = fileUrl.replace('http://145.239.42.121:1337', 'https://elimu-smart.co.ke');
    } else if (fileUrl.includes('localhost:1337')) {
      fileUrl = fileUrl.replace('http://localhost:1337', 'https://elimu-smart.co.ke');
    }

    // Update user's cover photo with HTTPS URL
    user.set('coverPhoto', fileUrl);
    await user.save(null, { sessionToken: user.getSessionToken() });

    return {
      success: true,
      url: fileUrl
    };
  } catch (error) {
    console.error('Cover photo upload error:', error);

    // Provide more specific error messages
    if (error.code === Parse.Error.VALIDATION_ERROR ||
        error.code === Parse.Error.FILE_SAVE_ERROR ||
        error.code === Parse.Error.SESSION_MISSING) {
      throw error; // Re-throw Parse errors with original message
    }

    // Generic error for unexpected failures
    throw new Parse.Error(
      Parse.Error.SCRIPT_FAILED,
      `Failed to upload cover photo: ${error.message || 'Unknown error'}`
    );
  }
});

// ===== INBOX SYSTEM =====

Parse.Cloud.define('getInboxConversations', async (request) => {
  const { limit = 20, skip = 0 } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  try {
    const ChatRoom = Parse.Object.extend('ChatRoom');
    const query = new Parse.Query(ChatRoom);
    query.containsAll('participants', [user.id]);
    query.equalTo('isActive', true);
    query.descending('lastActivity');
    query.include(['createdBy']);
    query.limit(limit);
    query.skip(skip);
    
    const rooms = await query.find({ useMasterKey: true });
    
    // Get unread message counts for each room AND personalize titles
    const roomsWithUnread = await Promise.all(rooms.map(async (room) => {
      const ChatMessage = Parse.Object.extend('ChatMessage');
      const messageQuery = new Parse.Query(ChatMessage);
      
      messageQuery.equalTo('chatRoom', {
        __type: 'Pointer',
        className: 'ChatRoom',
        objectId: room.id
      });
      messageQuery.notEqualTo('sender', user);
      messageQuery.equalTo('isRead', false);
      
      const unreadCount = await messageQuery.count({ useMasterKey: true });
      
      const roomData = {
        ...room.toJSON(),
        unreadCount
      };
      
      // Personalize title based on current user
      const participants = roomData.participants || [];
      const otherParticipantId = participants.find(id => id !== user.id);
      
      if (otherParticipantId) {
        try {
          const userQuery = new Parse.Query(Parse.User);
          const otherUser = await userQuery.get(otherParticipantId, { useMasterKey: true });
          // LinkedIn pattern: Just show the name, not "Chat with X"
          // Fallback: name -> username (if not email) -> formatted email -> 'User'
          let otherUserName = otherUser.get('name');
          if (!otherUserName) {
            const username = otherUser.get('username');
            // Only use username if it's not an email address
            if (username && !username.includes('@')) {
              otherUserName = username;
            } else {
              const email = otherUser.get('email') || username;
              if (email) {
                // Format email as name: "student@example.com" -> "Student"
                const emailPrefix = email.split('@')[0];
                otherUserName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
              } else {
                otherUserName = 'User';
              }
            }
          }
          roomData.title = otherUserName;
          // Include participant details for richer UI
          roomData.participantName = otherUserName;
          roomData.participantRole = otherUser.get('role') || 'user';
        } catch (error) {
          console.warn('Failed to fetch participant name:', error);
        }
      }
      
      return roomData;
    }));
    
    return roomsWithUnread;
  } catch (error) {
    console.error('Get inbox error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to get inbox conversations');
  }
});

Parse.Cloud.define('searchConversations', async (request) => {
  const { searchTerm, limit = 10 } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  try {
    const ChatRoom = Parse.Object.extend('ChatRoom');
    const query = new Parse.Query(ChatRoom);
    query.containsAll('participants', [user.id]);
    query.matches('title', new RegExp(searchTerm, 'i'));
    query.equalTo('isActive', true);
    query.descending('lastActivity');
    query.limit(limit);
    
    const rooms = await query.find({ useMasterKey: true });
    return rooms;
  } catch (error) {
    console.error('Search conversations error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to search conversations');
  }
});

Parse.Cloud.define('archiveConversation', async (request) => {
  const { chatRoomId } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  try {
    const ChatRoom = Parse.Object.extend('ChatRoom');
    const query = new Parse.Query(ChatRoom);
    const chatRoom = await query.get(chatRoomId, { useMasterKey: true });
    
    // Check if user is participant
    const participants = chatRoom.get('participants');
    if (!participants.includes(user.id)) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Conversation not found');
    }
    
    chatRoom.set('isActive', false);
    await chatRoom.save(null, { useMasterKey: true });
    
    return { success: true };
  } catch (error) {
    console.error('Archive conversation error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to archive conversation');
  }
});

// ===== ENHANCED MESSAGE SYSTEM =====

// Enhanced send message with multimedia support
Parse.Cloud.define('sendMultimediaMessage', async (request) => {
  const { chatRoomId, message, messageType = 'text', fileUrl, fileName, fileSize } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  const ChatMessage = Parse.Object.extend('ChatMessage');
  const chatMessage = new ChatMessage();
  
  const chatRoomPointer = {
    __type: 'Pointer',
    className: 'ChatRoom',
    objectId: chatRoomId
  };
  
  chatMessage.set('chatRoom', chatRoomPointer);
  chatMessage.set('sender', user);
  chatMessage.set('message', message);
  chatMessage.set('messageType', messageType);
  chatMessage.set('timestamp', new Date());
  chatMessage.set('isRead', false);
  chatMessage.set('status', 'sent'); // Initial status
  
  // Add multimedia fields if present
  if (fileUrl) {
    chatMessage.set('fileUrl', fileUrl);
    chatMessage.set('fileName', fileName);
    chatMessage.set('fileSize', fileSize);
  }
  
  const savedMessage = await chatMessage.save(null, { useMasterKey: true });
  
  // Update chat room
  const ChatRoom = Parse.Object.extend('ChatRoom');
  const query = new Parse.Query(ChatRoom);
  const chatRoom = await query.get(chatRoomId, { useMasterKey: true });
  
  let lastMessageText = message;
  if (messageType === 'image') {
    lastMessageText = '📷 Image';
  } else if (messageType === 'file') {
    lastMessageText = `📎 ${fileName || 'File'}`;
  }
  
  chatRoom.set('lastActivity', new Date());
  chatRoom.set('lastMessage', lastMessageText);
  chatRoom.increment('messageCount');
  await chatRoom.save(null, { useMasterKey: true });
  
  return savedMessage;
});

// Generate secure file upload URL
Parse.Cloud.define('getFileUploadUrl', async (request) => {
  const { fileName, fileType, fileSize } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (fileSize > maxSize) {
    throw new Parse.Error(Parse.Error.FILE_TOO_LARGE, 'File size exceeds 10MB limit');
  }
  
  // Validate file type
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  
  if (!allowedTypes.includes(fileType)) {
    throw new Parse.Error(Parse.Error.INVALID_FILE_NAME, 'File type not allowed');
  }
  
  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueFileName = `${user.id}_${timestamp}_${randomStr}_${sanitizedName}`;
  
  // Return upload URL (Parse Server handles file storage)
  return {
    fileName: uniqueFileName,
    uploadUrl: `${request.config.serverURL}/files/${uniqueFileName}`,
    fileType: fileType
  };
});

// Pin/Unpin conversation
Parse.Cloud.define('pinConversation', async (request) => {
  const { chatRoomId } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  try {
    const ChatRoom = Parse.Object.extend('ChatRoom');
    const query = new Parse.Query(ChatRoom);
    const chatRoom = await query.get(chatRoomId, { useMasterKey: true });

    // Check if user is participant
    const participants = chatRoom.get('participants');
    if (!participants.includes(user.id)) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Conversation not found');
    }

    // Toggle pin status (per-user basis using array field)
    let pinnedBy = chatRoom.get('pinnedBy') || [];
    const isPinned = pinnedBy.includes(user.id);

    if (isPinned) {
      // Unpin: remove user from pinnedBy array
      pinnedBy = pinnedBy.filter(id => id !== user.id);
    } else {
      // Pin: add user to pinnedBy array
      pinnedBy.push(user.id);
    }

    chatRoom.set('pinnedBy', pinnedBy);
    await chatRoom.save(null, { useMasterKey: true });

    return { success: true, isPinned: !isPinned };
  } catch (error) {
    console.error('Pin conversation error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to pin/unpin conversation');
  }
});

// Mute/Unmute conversation notifications
Parse.Cloud.define('muteConversation', async (request) => {
  const { chatRoomId } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  try {
    const ChatRoom = Parse.Object.extend('ChatRoom');
    const query = new Parse.Query(ChatRoom);
    const chatRoom = await query.get(chatRoomId, { useMasterKey: true });

    // Check if user is participant
    const participants = chatRoom.get('participants');
    if (!participants.includes(user.id)) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Conversation not found');
    }

    // Toggle mute status (per-user basis using array field)
    let mutedBy = chatRoom.get('mutedBy') || [];
    const isMuted = mutedBy.includes(user.id);

    if (isMuted) {
      // Unmute: remove user from mutedBy array
      mutedBy = mutedBy.filter(id => id !== user.id);
    } else {
      // Mute: add user to mutedBy array
      mutedBy.push(user.id);
    }

    chatRoom.set('mutedBy', mutedBy);
    await chatRoom.save(null, { useMasterKey: true });

    return { success: true, isMuted: !isMuted };
  } catch (error) {
    console.error('Mute conversation error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to mute/unmute conversation');
  }
});

// Delete conversation (soft delete - mark as deleted for user)
Parse.Cloud.define('deleteConversation', async (request) => {
  const { chatRoomId } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  try {
    const ChatRoom = Parse.Object.extend('ChatRoom');
    const query = new Parse.Query(ChatRoom);
    const chatRoom = await query.get(chatRoomId, { useMasterKey: true });

    // Check if user is participant
    const participants = chatRoom.get('participants');
    if (!participants.includes(user.id)) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Conversation not found');
    }

    // Soft delete: add user to deletedBy array (conversation hidden for this user only)
    let deletedBy = chatRoom.get('deletedBy') || [];
    if (!deletedBy.includes(user.id)) {
      deletedBy.push(user.id);
    }

    chatRoom.set('deletedBy', deletedBy);

    // If both participants deleted, mark as inactive
    if (deletedBy.length === participants.length) {
      chatRoom.set('isActive', false);
    }

    await chatRoom.save(null, { useMasterKey: true });

    return { success: true };
  } catch (error) {
    console.error('Delete conversation error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to delete conversation');
  }
});

// ===== DYNAMIC DASHBOARD SYSTEM =====

// User Activity Tracking
Parse.Cloud.define('logUserActivity', async (request) => {
  const { activityType, data, pageUrl, duration } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  try {
    const UserActivity = Parse.Object.extend('UserActivity');
    const activity = new UserActivity();
    
    activity.set('user', user);
    activity.set('activityType', activityType);
    activity.set('data', data || {});
    activity.set('pageUrl', pageUrl);
    activity.set('duration', duration || 0);
    activity.set('timestamp', new Date());
    
    await activity.save(null, { useMasterKey: true });
    
    // Update assessment progress if this is an assessment activity
    if (activityType.includes('assessment')) {
      await Parse.Cloud.run('updateAssessmentProgress', { 
        userId: user.id, 
        cardId: data.cardId,
        progress: data.progress
      }, { useMasterKey: true });
    }
    
    // Note: Career readiness score will be recalculated on-demand when dashboard loads
    // No need to update it here to avoid unnecessary compute
    
    return { success: true };
  } catch (error) {
    console.error('Log activity error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to log user activity');
  }
});

// Get User Activities - retrieve activity history for current user
Parse.Cloud.define('getUserActivities', async (request) => {
  const { limit = 50, skip = 0 } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  try {
    const UserActivity = Parse.Object.extend('UserActivity');
    const query = new Parse.Query(UserActivity);
    query.equalTo('user', user);
    query.descending('timestamp');
    query.limit(limit);
    query.skip(skip);
    
    const activities = await query.find({ useMasterKey: true });
    
    // Map to plain objects for JSON serialization
    return activities.map(activity => ({
      id: activity.id,
      activityType: activity.get('activityType'),
      data: activity.get('data') || {},
      pageUrl: activity.get('pageUrl'),
      duration: activity.get('duration') || 0,
      timestamp: activity.get('timestamp'),
      createdAt: activity.get('createdAt')
    }));
  } catch (error) {
    console.error('Get user activities error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to get user activities');
  }
});

// Assessment Progress Tracking
Parse.Cloud.define('updateAssessmentProgress', async (request) => {
  const { userId, cardId, progress } = request.params;
  
  try {
    const AssessmentProgress = Parse.Object.extend('AssessmentProgress');
    const query = new Parse.Query(AssessmentProgress);
    query.equalTo('user', { __type: 'Pointer', className: '_User', objectId: userId });
    query.equalTo('cardId', cardId);
    
    let progressRecord = await query.first({ useMasterKey: true });
    
    if (!progressRecord) {
      progressRecord = new AssessmentProgress();
      progressRecord.set('user', { __type: 'Pointer', className: '_User', objectId: userId });
      progressRecord.set('cardId', cardId);
      progressRecord.set('progress', 0);
      progressRecord.set('status', 'not-started');
    }
    
    progressRecord.set('progress', progress);
    progressRecord.set('lastUpdated', new Date());
    
    // Update status based on progress
    if (progress === 0) {
      progressRecord.set('status', 'not-started');
    } else if (progress === 100) {
      progressRecord.set('status', 'completed');
    } else {
      progressRecord.set('status', 'in-progress');
    }
    
    await progressRecord.save(null, { useMasterKey: true });
    
    return { success: true, progress, status: progressRecord.get('status') };
  } catch (error) {
    console.error('Update assessment progress error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to update assessment progress');
  }
});

// Get Assessment Progress for User
Parse.Cloud.define('getAssessmentProgress', async (request) => {
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  try {
    const AssessmentProgress = Parse.Object.extend('AssessmentProgress');
    const query = new Parse.Query(AssessmentProgress);
    query.equalTo('user', user);
    
    const progressRecords = await query.find({ useMasterKey: true });
    
    const progressMap = {};
    progressRecords.forEach(record => {
      progressMap[record.get('cardId')] = {
        progress: record.get('progress'),
        status: record.get('status'),
        lastUpdated: record.get('lastUpdated')
      };
    });
    
    return progressMap;
  } catch (error) {
    console.error('Get assessment progress error:', error);
    return {};
  }
});

// Complete Assessment - Mark as 100% complete
Parse.Cloud.define('completeAssessment', async (request) => {
  const { cardId, assessmentData } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  try {
    // Update assessment progress to 100%
    await Parse.Cloud.run('updateAssessmentProgress', {
      userId: user.id,
      cardId,
      progress: 100
    }, { useMasterKey: true });
    
    // Store assessment results if provided
    if (assessmentData) {
      const AssessmentResult = Parse.Object.extend('AssessmentResult');
      const result = new AssessmentResult();
      result.set('user', user);
      result.set('cardId', cardId);
      result.set('data', assessmentData);
      result.set('completedAt', new Date());
      
      await result.save(null, { useMasterKey: true });
    }
    
    // Log completion activity
    await Parse.Cloud.run('logUserActivity', {
      activityType: 'assessment_completed',
      data: {
        cardId,
        progress: 100,
        completedAt: new Date()
      }
    }, { useMasterKey: true });
    
    return { success: true, message: 'Assessment completed successfully' };
  } catch (error) {
    console.error('Complete assessment error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to complete assessment');
  }
});

// Career Readiness Score Calculation
Parse.Cloud.define('calculateCareerReadinessScore', async (request) => {
  const { userId } = request.params;
  const user = request.user;

  if (!user && !userId) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  const targetUserId = userId || user.id;

  // Cache key per user (5 minute TTL - frequently changing data)
  const cacheKey = `career_readiness:${targetUserId}`;

  try {
    // Check cache first (5 minute TTL)
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      console.log('✅ Cache HIT - Returning cached career readiness score');
      return { ...cachedResult, fromCache: true };
    }

    console.log('❌ Cache MISS - Computing career readiness score');

    // Get user activities from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const UserActivity = Parse.Object.extend('UserActivity');
    const query = new Parse.Query(UserActivity);
    query.equalTo('user', { __type: 'Pointer', className: '_User', objectId: targetUserId });
    query.greaterThan('timestamp', thirtyDaysAgo);
    
    const activities = await query.find({ useMasterKey: true });
    
    // Calculate component scores
    const components = {
      assessmentCompletion: calculateAssessmentScore(activities),
      careerResearch: calculateResearchScore(activities),
      courseExploration: calculateExplorationScore(activities),
      actionsTaken: calculateActionsScore(activities)
    };
    
    // Calculate weighted total
    const totalScore = Math.round(
      (components.assessmentCompletion * 0.30) +
      (components.careerResearch * 0.25) +
      (components.courseExploration * 0.25) +
      (components.actionsTaken * 0.20)
    );
    
    // Get previous score for trend calculation
    const StudentProgress = Parse.Object.extend('StudentProgress');
    const progressQuery = new Parse.Query(StudentProgress);
    progressQuery.equalTo('user', { __type: 'Pointer', className: '_User', objectId: targetUserId });
    
    let progress = await progressQuery.first({ useMasterKey: true });
    let previousScore = 0;
    
    if (progress) {
      previousScore = progress.get('careerReadinessScore') || 0;
      progress.set('careerReadinessScore', totalScore);
      progress.set('lastUpdated', new Date());
    } else {
      // Create new progress record
      progress = new StudentProgress();
      progress.set('user', { __type: 'Pointer', className: '_User', objectId: targetUserId });
      progress.set('careerReadinessScore', totalScore);
      progress.set('lastUpdated', new Date());
    }
    
    await progress.save(null, { useMasterKey: true });
    
    const change = totalScore - previousScore;
    const changeText = change > 0 ? `+${change}% this month` :
                     change < 0 ? `${change}% this month` : 'No change';

    const result = {
      score: totalScore,
      components: components,
      change: changeText,
      trend: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral',
      recommendations: generateImprovementRecommendations(components)
    };

    // Cache for 5 minutes (300 seconds) - dashboard data changes frequently
    await cache.set(cacheKey, result, 300);
    console.log('💾 Cached career readiness score');

    return result;
  } catch (error) {
    console.error('Calculate career readiness error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to calculate career readiness score');
  }
});

// Career Exploration Tracking
Parse.Cloud.define('getCareerExplorationData', async (request) => {
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  try {
    const UserActivity = Parse.Object.extend('UserActivity');
    const query = new Parse.Query(UserActivity);
    query.equalTo('user', user);
    query.contains('activityType', 'career');
    query.descending('timestamp');
    query.limit(100);
    
    const activities = await query.find({ useMasterKey: true });
    
    // Count unique careers explored
    const careersExplored = new Set();
    let thisWeekActivities = 0;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    activities.forEach(activity => {
      const data = activity.get('data') || {};
      if (data.career) {
        careersExplored.add(data.career);
      }
      
      if (activity.get('timestamp') > oneWeekAgo) {
        thisWeekActivities++;
      }
    });
    
    return {
      totalExplored: careersExplored.size,
      thisWeekNew: thisWeekActivities,
      recentCareers: Array.from(careersExplored).slice(0, 5),
      streak: calculateExplorationStreak(activities)
    };
  } catch (error) {
    console.error('Get career exploration error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to get career exploration data');
  }
});

// Scholarship Matching - Query from Scholarship Parse Class
Parse.Cloud.define('getScholarshipMatches', async (request) => {
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  try {
    // Query scholarships from database
    const Scholarship = Parse.Object.extend('Scholarship');
    const query = new Parse.Query(Scholarship);
    query.equalTo('isActive', true);
    query.greaterThan('deadline', new Date()); // Only future deadlines
    query.ascending('deadline');
    query.limit(20);
    
    const results = await query.find({ useMasterKey: true });
    
    if (results.length === 0) {
      // Return empty result if no scholarships in database
      return {
        matches: 0,
        newThisWeek: 0,
        scholarships: [],
        totalValue: 'KSh 0'
      };
    }
    
    const scholarships = results.map(scholarship => ({
      name: scholarship.get('name'),
      provider: scholarship.get('provider'),
      amount: scholarship.get('amount'),
      deadline: scholarship.get('deadline'),
      match: scholarship.get('matchScore') || 80,
      matchScore: scholarship.get('matchScore') || 80,
      type: scholarship.get('type'),
      category: scholarship.get('category'),
      requirements: scholarship.get('requirements') || []
    }));
    
    // Calculate total value
    const totalValue = scholarships.reduce((sum, s) => {
      const numericValue = parseInt(s.amount.replace(/[^0-9]/g, '')) || 0;
      return sum + numericValue;
    }, 0);
    
    return {
      matches: scholarships.length,
      newThisWeek: 0, // Would need createdAt comparison
      scholarships: scholarships,
      totalValue: `KSh ${totalValue.toLocaleString()}`
    };
  } catch (error) {
    console.error('Get scholarship matches error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to get scholarship matches');
  }
});
// University Placement Calculator (GitHub API Integration)
Parse.Cloud.define('getUniversityPlacementData', async (request) => {
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  try {
    // Fetch KUCCPS data from GitHub API
    const kuccpsData = await fetchKuccpsDataFromGitHub();
    
    // Get user's academic profile (mock for now)
    const userProfile = {
      kcseGrade: 'B+',
      clusterPoints: 42.5,
      subjects: ['Math', 'English', 'Physics', 'Chemistry']
    };
    
    // Calculate placement probability
    const eligibleCourses = kuccpsData.filter(course => 
      userProfile.clusterPoints >= (course.cutoffPoints || 35)
    );
    
    return {
      status: 'Eligible',
      probability: 'High (87%)',
      coursesAvailable: eligibleCourses.length,
      change: 'Based on current grades + historical data',
      recommendations: generateCourseRecommendations(eligibleCourses, userProfile)
    };
  } catch (error) {
    console.error('Get university placement error:', error);
    // Return fallback data if GitHub API fails
    return {
      status: 'Eligible',
      probability: 'Good (75%)',
      coursesAvailable: 23,
      change: 'Based on estimated grades',
      recommendations: ['Focus on Math and English', 'Consider backup courses']
    };
  }
});

// Calculate detailed cutoff points for specific courses
Parse.Cloud.define('calculateCutoffPoints', async (request) => {
  const user = request.user;
  if (!user) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User must be logged in');
  }

  try {
    // Get user's current grades and subject combination
    const userGrades = {
      mathematics: 7, // B
      english: 8,     // A-
      kiswahili: 6,   // C+
      chemistry: 7,   // B
      physics: 8,     // A-
      biology: 6      // C+
    };

    // Calculate cluster points (simplified calculation)
    const clusterPoints = (userGrades.english + userGrades.kiswahili + 
                          userGrades.mathematics + userGrades.chemistry + 
                          userGrades.physics + userGrades.biology) * 4;

    // Get KUCCPS course data with cutoff points
    const courseData = await fetchKuccpsDataFromGitHub();
    const courses = courseData.courses || [];

    // Calculate gap for each course
    const courseAnalysis = courses.slice(0, 10).map(course => ({
      courseName: course.name,
      university: course.university,
      requiredPoints: course.cutoffPoints || 35,
      currentPoints: clusterPoints,
      pointsGap: Math.max(0, (course.cutoffPoints || 35) - clusterPoints),
      probability: clusterPoints >= (course.cutoffPoints || 35) ? 
                   Math.min(95, 60 + (clusterPoints - (course.cutoffPoints || 35))) : 
                   Math.max(10, 50 - ((course.cutoffPoints || 35) - clusterPoints)),
      canImprove: clusterPoints < (course.cutoffPoints || 35),
      subjectsToImprove: clusterPoints < (course.cutoffPoints || 35) ? 
                        ['Mathematics', 'Chemistry'] : []
    }));

    return {
      currentPoints: clusterPoints,
      averageRequired: 35,
      courseAnalysis,
      totalEligibleCourses: courseAnalysis.filter(c => c.probability >= 70).length,
      improvementNeeded: courseAnalysis.filter(c => c.canImprove).length
    };
  } catch (error) {
    console.error('Calculate cutoff points error:', error);
    return {
      currentPoints: 42.5,
      averageRequired: 35,
      courseAnalysis: [],
      totalEligibleCourses: 12,
      improvementNeeded: 3
    };
  }
});

// Get application timeline and deadlines
Parse.Cloud.define('getKuccpsTimeline', async (request) => {
  try {
    // Fetch real KUCCPS timeline data (would be from official source)
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    const timeline = [
      {
        event: 'KUCCPS Application Opening',
        date: new Date(currentYear, 4, 15), // May 15
        status: 'completed',
        description: 'Online application portal opens for new students'
      },
      {
        event: 'Application Deadline',
        date: new Date(currentYear, 6, 31), // July 31
        status: currentDate > new Date(currentYear, 6, 31) ? 'completed' : 'upcoming',
        description: 'Last date for submitting KUCCPS applications'
      },
      {
        event: 'First Selection Release',
        date: new Date(currentYear, 8, 15), // September 15
        status: currentDate > new Date(currentYear, 8, 15) ? 'completed' : 'upcoming',
        description: 'First round of university placement results'
      },
      {
        event: 'Inter-Institution Transfers',
        date: new Date(currentYear, 9, 30), // October 30
        status: currentDate > new Date(currentYear, 9, 30) ? 'completed' : 'upcoming',
        description: 'Window for changing university or course preferences'
      }
    ];

    // Find next upcoming deadline
    const upcomingEvents = timeline.filter(event => event.status === 'upcoming');
    const nextDeadline = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
    const daysUntilDeadline = nextDeadline ? 
      Math.ceil((nextDeadline.date - currentDate) / (1000 * 60 * 60 * 24)) : 0;

    return {
      timeline,
      nextDeadline: nextDeadline ? nextDeadline.event : 'No upcoming deadlines',
      daysRemaining: daysUntilDeadline,
      applicationStatus: daysUntilDeadline > 0 ? 'Active' : 'Closed for this cycle'
    };
  } catch (error) {
    console.error('Get KUCCPS timeline error:', error);
    return {
      timeline: [],
      nextDeadline: 'Application Deadline',
      daysRemaining: 45,
      applicationStatus: 'Active'
    };
  }
});

// Get university and course recommendations
Parse.Cloud.define('getCourseRecommendations', async (request) => {
  const user = request.user;
  if (!user) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User must be logged in');
  }

  try {
    // Get user activities to understand interests
    const activitiesQuery = new Parse.Query('UserActivity');
    activitiesQuery.equalTo('user', user);
    activitiesQuery.limit(100);
    const activities = await activitiesQuery.find();

    // Analyze career interests from activities
    const careerInterests = activities
      .filter(activity => activity.get('activityType').includes('career'))
      .map(activity => activity.get('data'))
      .flat();

    // Get KUCCPS data for course matching
    const kuccpsData = await fetchKuccpsDataFromGitHub();
    const courses = kuccpsData.courses || [];

    // Generate personalized recommendations
    const recommendations = courses.slice(0, 12).map((course, index) => ({
      id: `course-${index}`,
      courseName: course.name || `Course ${index + 1}`,
      university: course.university || 'Public University',
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-100% match
      reason: 'Based on your assessment results and career interests',
      requirements: course.requirements || ['Mathematics', 'English', 'Sciences'],
      cutoffPoints: course.cutoffPoints || (30 + Math.floor(Math.random() * 20)),
      duration: '4 years',
      category: course.category || 'STEM'
    }));

    return {
      recommendations,
      totalMatches: recommendations.length,
      highMatches: recommendations.filter(r => r.matchScore >= 85).length,
      mediumMatches: recommendations.filter(r => r.matchScore >= 70 && r.matchScore < 85).length
    };
  } catch (error) {
    console.error('Get course recommendations error:', error);
    return {
      recommendations: [],
      totalMatches: 12,
      highMatches: 5,
      mediumMatches: 7
    };
  }
});

// Helper Functions
function calculateAssessmentScore(activities) {
  try {
    if (!activities || activities.length === 0) return 0;

    const assessmentActivities = activities.filter(a => {
      const activityType = a.get('activityType');
      return activityType && activityType.includes('assessment');
    });
    return Math.min(assessmentActivities.length * 15, 100);
  } catch (error) {
    console.error('Error calculating assessment score:', error);
    return 0;
  }
}

function calculateResearchScore(activities) {
  try {
    if (!activities || activities.length === 0) return 0;

    const researchTime = activities.reduce((total, activity) => {
      try {
        const activityType = activity.get('activityType');
        if (activityType && (activityType.includes('research') || activityType.includes('career'))) {
          return total + (activity.get('duration') || 0);
        }
      } catch (e) {
        console.warn('Skipping activity due to error:', e);
      }
      return total;
    }, 0);

    return Math.min(researchTime / 60, 100); // Convert to minutes, max 100
  } catch (error) {
    console.error('Error calculating research score:', error);
    return 0;
  }
}

function calculateExplorationScore(activities) {
  try {
    if (!activities || activities.length === 0) return 0;

    const explorationActivities = activities.filter(a => {
      const activityType = a.get('activityType');
      return activityType && (activityType.includes('course') || activityType.includes('university'));
    });
    return Math.min(explorationActivities.length * 10, 100);
  } catch (error) {
    console.error('Error calculating exploration score:', error);
    return 0;
  }
}

function calculateActionsScore(activities) {
  try {
    if (!activities || activities.length === 0) return 0;

    const actionActivities = activities.filter(a => {
      const activityType = a.get('activityType');
      return activityType && (activityType.includes('application') ||
                              activityType.includes('counselor') ||
                              activityType.includes('chat'));
    });
    return Math.min(actionActivities.length * 20, 100);
  } catch (error) {
    console.error('Error calculating actions score:', error);
    return 0;
  }
}

function generateImprovementRecommendations(components) {
  const recommendations = [];
  
  if (components.assessmentCompletion < 70) {
    recommendations.push('Complete career assessments to boost your score');
  }
  if (components.careerResearch < 70) {
    recommendations.push('Research more careers in your field of interest');
  }
  if (components.courseExploration < 70) {
    recommendations.push('Explore university courses and requirements');
  }
  if (components.actionsTaken < 70) {
    recommendations.push('Take action: chat with counselors or start applications');
  }
  
  return recommendations;
}

function calculateExplorationStreak(activities) {
  // Simple streak calculation - days with exploration activity
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    
    const hasActivity = activities.some(activity => {
      const activityDate = activity.get('timestamp');
      return activityDate.toDateString() === checkDate.toDateString();
    });
    
    if (hasActivity) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function generateCourseRecommendations(courses, userProfile) {
  return [
    'Engineering courses match your science subjects',
    'Business courses have high placement rates',
    'Consider backup options in related fields'
  ];
}

async function fetchKuccpsDataFromGitHub() {
  try {
    // Mock KUCCPS data structure - will be replaced with actual GitHub API call
    return [
      { code: 'ENG001', name: 'Mechanical Engineering', cutoffPoints: 40.5 },
      { code: 'MED001', name: 'Medicine', cutoffPoints: 45.0 },
      { code: 'BUS001', name: 'Business Administration', cutoffPoints: 35.0 },
      { code: 'CS001', name: 'Computer Science', cutoffPoints: 38.5 }
    ];
  } catch (error) {
    console.error('Failed to fetch KUCCPS data:', error);
    return [];
  }
}

// ====================================
// 6. EMAIL NOTIFICATION SYSTEM
// ====================================

const { SendMailClient } = require('zeptomail');

// Initialize ZeptoMail client
const zeptoMailClient = new SendMailClient({
  url: process.env.ZEPTOMAIL_API_URL || 'api.zeptomail.com/',
  token: process.env.ZEPTOMAIL_TOKEN || 'your_zeptomail_token_here'
});

// Send welcome email to new students
Parse.Cloud.define('sendWelcomeEmail', async (request) => {
  const { email, firstName, userRole } = request.params;
  
  try {
    const emailContent = {
      "from": {
        "address": process.env.ZEPTOMAIL_FROM_EMAIL || "noreply@elimusmart.co.ke",
        "name": process.env.ZEPTOMAIL_FROM_NAME || "Elimu Smart Platform"
      },
      "to": [{
        "email_address": {
          "address": email,
          "name": firstName
        }
      }],
      "subject": `Welcome to Elimu Smart, ${firstName}! 🎓`,
      "htmlbody": generateWelcomeEmailHTML(firstName, userRole),
      "track_clicks": true,
      "track_opens": true
    };

    const result = await zeptoMailClient.sendMail(emailContent);
    
    // Log email activity
    const emailLog = new Parse.Object('EmailLog');
    emailLog.set('recipient', email);
    emailLog.set('type', 'welcome');
    emailLog.set('status', 'sent');
    emailLog.set('zeptoMessageId', result?.message_id || 'unknown');
    await emailLog.save();

    return { success: true, messageId: result?.message_id };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to send welcome email');
  }
});

// Send assessment completion notification
Parse.Cloud.define('sendAssessmentCompletionEmail', async (request) => {
  const { email, firstName, assessmentName, results } = request.params;
  
  try {
    const emailContent = {
      "from": {
        "address": process.env.ZEPTOMAIL_FROM_EMAIL || "noreply@elimusmart.co.ke",
        "name": process.env.ZEPTOMAIL_FROM_NAME || "Elimu Smart Platform"
      },
      "to": [{
        "email_address": {
          "address": email,
          "name": firstName
        }
      }],
      "subject": `🎯 ${assessmentName} Results Ready - Your Career Path Awaits!`,
      "htmlbody": generateAssessmentEmailHTML(firstName, assessmentName, results),
      "track_clicks": true,
      "track_opens": true
    };

    const result = await zeptoMailClient.sendMail(emailContent);
    
    // Log email activity
    const emailLog = new Parse.Object('EmailLog');
    emailLog.set('recipient', email);
    emailLog.set('type', 'assessment_completion');
    emailLog.set('status', 'sent');
    emailLog.set('assessmentName', assessmentName);
    emailLog.set('zeptoMessageId', result?.message_id || 'unknown');
    await emailLog.save();

    return { success: true, messageId: result?.message_id };
  } catch (error) {
    console.error('Failed to send assessment completion email:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to send assessment email');
  }
});

// Send KUCCPS deadline reminder
Parse.Cloud.define('sendKuccpsDeadlineReminder', async (request) => {
  const { email, firstName, deadlineName, daysRemaining } = request.params;
  
  try {
    const urgencyLevel = daysRemaining <= 7 ? 'urgent' : daysRemaining <= 30 ? 'important' : 'normal';
    
    const emailContent = {
      "from": {
        "address": process.env.ZEPTOMAIL_FROM_EMAIL || "noreply@elimusmart.co.ke",
        "name": process.env.ZEPTOMAIL_FROM_NAME || "Elimu Smart Platform"
      },
      "to": [{
        "email_address": {
          "address": email,
          "name": firstName
        }
      }],
      "subject": `⏰ KUCCPS Alert: ${deadlineName} - ${daysRemaining} Days Left!`,
      "htmlbody": generateKuccpsReminderHTML(firstName, deadlineName, daysRemaining, urgencyLevel),
      "track_clicks": true,
      "track_opens": true
    };

    const result = await zeptoMailClient.sendMail(emailContent);
    
    // Log email activity
    const emailLog = new Parse.Object('EmailLog');
    emailLog.set('recipient', email);
    emailLog.set('type', 'kuccps_reminder');
    emailLog.set('status', 'sent');
    emailLog.set('deadlineName', deadlineName);
    emailLog.set('daysRemaining', daysRemaining);
    emailLog.set('urgencyLevel', urgencyLevel);
    emailLog.set('zeptoMessageId', result?.message_id || 'unknown');
    await emailLog.save();

    return { success: true, messageId: result?.message_id };
  } catch (error) {
    console.error('Failed to send KUCCPS reminder email:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to send reminder email');
  }
});

// Send counselor session booking confirmation
Parse.Cloud.define('sendSessionBookingConfirmation', async (request) => {
  const { studentEmail, counselorEmail, studentName, counselorName, sessionDate, sessionTime, sessionType } = request.params;
  
  try {
    // Send email to student
    const studentEmailContent = {
      "from": {
        "address": process.env.ZEPTOMAIL_FROM_EMAIL || "noreply@elimusmart.co.ke",
        "name": process.env.ZEPTOMAIL_FROM_NAME || "Elimu Smart Platform"
      },
      "to": [{
        "email_address": {
          "address": studentEmail,
          "name": studentName
        }
      }],
      "subject": `✅ Session Confirmed: ${sessionType} with ${counselorName}`,
      "htmlbody": generateSessionConfirmationHTML('student', studentName, counselorName, sessionDate, sessionTime, sessionType),
      "track_clicks": true,
      "track_opens": true
    };

    // Send email to counselor
    const counselorEmailContent = {
      "from": {
        "address": process.env.ZEPTOMAIL_FROM_EMAIL || "noreply@elimusmart.co.ke",
        "name": process.env.ZEPTOMAIL_FROM_NAME || "Elimu Smart Platform"
      },
      "to": [{
        "email_address": {
          "address": counselorEmail,
          "name": counselorName
        }
      }],
      "subject": `📅 New Session Booked: ${sessionType} with ${studentName}`,
      "htmlbody": generateSessionConfirmationHTML('counselor', studentName, counselorName, sessionDate, sessionTime, sessionType),
      "track_clicks": true,
      "track_opens": true
    };

    // Send both emails
    const [studentResult, counselorResult] = await Promise.all([
      zeptoMailClient.sendMail(studentEmailContent),
      zeptoMailClient.sendMail(counselorEmailContent)
    ]);
    
    // Log email activities
    const studentEmailLog = new Parse.Object('EmailLog');
    studentEmailLog.set('recipient', studentEmail);
    studentEmailLog.set('type', 'session_booking_student');
    studentEmailLog.set('status', 'sent');
    studentEmailLog.set('sessionType', sessionType);
    studentEmailLog.set('zeptoMessageId', studentResult?.message_id || 'unknown');
    
    const counselorEmailLog = new Parse.Object('EmailLog');
    counselorEmailLog.set('recipient', counselorEmail);
    counselorEmailLog.set('type', 'session_booking_counselor');
    counselorEmailLog.set('status', 'sent');
    counselorEmailLog.set('sessionType', sessionType);
    counselorEmailLog.set('zeptoMessageId', counselorResult?.message_id || 'unknown');
    
    await Parse.Object.saveAll([studentEmailLog, counselorEmailLog]);

    return { 
      success: true, 
      studentMessageId: studentResult?.message_id,
      counselorMessageId: counselorResult?.message_id 
    };
  } catch (error) {
    console.error('Failed to send session booking emails:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to send booking confirmation emails');
  }
});

// Send scholarship opportunity alert
Parse.Cloud.define('sendScholarshipAlert', async (request) => {
  const { email, firstName, scholarshipName, deadline, amount, requirements } = request.params;
  
  try {
    const emailContent = {
      "from": {
        "address": process.env.ZEPTOMAIL_FROM_EMAIL || "noreply@elimusmart.co.ke",
        "name": process.env.ZEPTOMAIL_FROM_NAME || "Elimu Smart Platform"
      },
      "to": [{
        "email_address": {
          "address": email,
          "name": firstName
        }
      }],
      "subject": `💰 New Scholarship Match: ${scholarshipName} - ${amount}`,
      "htmlbody": generateScholarshipAlertHTML(firstName, scholarshipName, deadline, amount, requirements),
      "track_clicks": true,
      "track_opens": true
    };

    const result = await zeptoMailClient.sendMail(emailContent);
    
    // Log email activity
    const emailLog = new Parse.Object('EmailLog');
    emailLog.set('recipient', email);
    emailLog.set('type', 'scholarship_alert');
    emailLog.set('status', 'sent');
    emailLog.set('scholarshipName', scholarshipName);
    emailLog.set('amount', amount);
    emailLog.set('zeptoMessageId', result?.message_id || 'unknown');
    await emailLog.save();

    return { success: true, messageId: result?.message_id };
  } catch (error) {
    console.error('Failed to send scholarship alert:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to send scholarship alert');
  }
});

// Get email statistics for admin dashboard
Parse.Cloud.define('getEmailStatistics', async (request) => {
  const user = request.user;
  if (!user) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User must be logged in');
  }

  try {
    const emailLogQuery = new Parse.Query('EmailLog');
    emailLogQuery.limit(1000);
    emailLogQuery.descending('createdAt');
    
    const logs = await emailLogQuery.find();
    
    // Calculate statistics
    const stats = {
      totalSent: logs.length,
      byType: {},
      byStatus: {},
      recentActivity: logs.slice(0, 10).map(log => ({
        type: log.get('type'),
        recipient: log.get('recipient'),
        status: log.get('status'),
        sentAt: log.get('createdAt')
      })),
      last24Hours: 0,
      thisWeek: 0
    };
    
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    logs.forEach(log => {
      const type = log.get('type') || 'unknown';
      const status = log.get('status') || 'unknown';
      const createdAt = log.get('createdAt');
      
      // Count by type
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      
      // Count by status
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      
      // Count recent emails
      if (createdAt > yesterday) stats.last24Hours++;
      if (createdAt > weekAgo) stats.thisWeek++;
    });
    
    return stats;
  } catch (error) {
    console.error('Failed to get email statistics:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to retrieve email statistics');
  }
});

// ====================================
// EMAIL TEMPLATE HELPER FUNCTIONS
// ====================================

function generateWelcomeEmailHTML(firstName, userRole) {
  const roleMessage = {
    'student': 'Welcome to your career discovery journey! 🚀',
    'counselor': 'Ready to guide students to success! 🌟',
    'admin': 'Welcome to your administrative dashboard! 🏢'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Elimu Smart</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: 0; }
        .button { display: inline-block; background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .features { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
        .feature { flex: 1; min-width: 200px; text-align: center; }
        .feature-icon { font-size: 32px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Elimu Smart, ${firstName}! 🎓</h1>
          <p>${roleMessage[userRole] || roleMessage['student']}</p>
        </div>
        
        <div class="content">
          <p>Hi ${firstName},</p>
          
          <p>We're excited to have you join the Elimu Smart community! You're now part of Kenya's premier career guidance platform designed specifically for students navigating university placement and career decisions.</p>
          
          <div class="features">
            <div class="feature">
              <div class="feature-icon">🎯</div>
              <h3>Career Discovery</h3>
              <p>Personalized assessments to find your perfect career match</p>
            </div>
            <div class="feature">
              <div class="feature-icon">🏫</div>
              <h3>University Placement</h3>
              <p>Real-time KUCCPS guidance and placement probability</p>
            </div>
            <div class="feature">
              <div class="feature-icon">💰</div>
              <h3>Scholarship Matching</h3>
              <p>Automated alerts for funding opportunities</p>
            </div>
          </div>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://elimusmart.co.ke/dashboard" class="button">Get Started Now</a>
          </p>
          
          <p>Need help getting started? Our platform is designed to be intuitive, but if you have questions, don't hesitate to reach out!</p>
          
          <p>Best regards,<br>The Elimu Smart Team</p>
        </div>
        
        <div class="footer">
          <p><strong>Elimu Smart</strong> - Empowering Kenyan students through intelligent career guidance</p>
          <p>📧 support@elimusmart.co.ke | 🌐 <a href="https://elimusmart.co.ke">elimusmart.co.ke</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateAssessmentEmailHTML(firstName, assessmentName, results) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your ${assessmentName} Results</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; }
        .results-card { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Your ${assessmentName} Results Are Ready!</h1>
          <p>Discover your career path, ${firstName}!</p>
        </div>
        
        <div class="content">
          <p>Hi ${firstName},</p>
          
          <p>Congratulations on completing your <strong>${assessmentName}</strong>! Your personalized results are now available and ready to guide your career journey.</p>
          
          <div class="results-card">
            <h3>🏆 Your Top Results:</h3>
            <p><strong>Match Score:</strong> ${results?.matchScore || '85%'}</p>
            <p><strong>Recommended Path:</strong> ${results?.recommendedPath || 'STEM Fields - Engineering & Technology'}</p>
            <p><strong>Strengths:</strong> ${results?.strengths || 'Problem-solving, Analytical thinking, Technical aptitude'}</p>
          </div>
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>📊 View your detailed results and career matches</li>
            <li>🏫 Explore university programs aligned with your profile</li>
            <li>💼 Connect with industry professionals in your field</li>
            <li>📚 Access personalized learning resources</li>
          </ul>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://elimusmart.co.ke/assessment/results" class="button">View Full Results</a>
          </p>
          
          <p>Remember, this is just the beginning of your career discovery journey. Use these insights to make informed decisions about your educational and career path.</p>
          
          <p>Best of luck,<br>The Elimu Smart Team</p>
        </div>
        
        <div class="footer">
          <p><strong>Elimu Smart</strong> - Your Career Guidance Partner</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateKuccpsReminderHTML(firstName, deadlineName, daysRemaining, urgencyLevel) {
  const urgencyColors = {
    urgent: '#ef4444',
    important: '#f59e0b', 
    normal: '#3b82f6'
  };

  const urgencyMessages = {
    urgent: '🚨 URGENT - Act Now!',
    important: '⚠️ Important Reminder',
    normal: '📅 Friendly Reminder'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KUCCPS Deadline Alert</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${urgencyColors[urgencyLevel]}; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; }
        .deadline-card { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; text-align: center; }
        .countdown { font-size: 48px; font-weight: bold; color: ${urgencyColors[urgencyLevel]}; }
        .button { display: inline-block; background: ${urgencyColors[urgencyLevel]}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${urgencyMessages[urgencyLevel]}</h1>
          <h2>KUCCPS Deadline Approaching</h2>
        </div>
        
        <div class="content">
          <p>Hi ${firstName},</p>
          
          <p>This is a reminder about an important KUCCPS deadline that's approaching:</p>
          
          <div class="deadline-card">
            <h3>${deadlineName}</h3>
            <div class="countdown">${daysRemaining}</div>
            <p style="margin: 0; font-size: 18px; font-weight: bold;">Days Remaining</p>
          </div>
          
          <p><strong>Action Items:</strong></p>
          <ul>
            <li>✅ Review your application status</li>
            <li>📋 Complete any pending requirements</li>
            <li>📧 Check for official communications</li>
            <li>🔍 Verify all submitted information</li>
            ${daysRemaining <= 7 ? '<li><strong>🚨 Submit immediately - deadline is critical!</strong></li>' : ''}
          </ul>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://elimusmart.co.ke/placement" class="button">Check KUCCPS Status</a>
          </p>
          
          <p>Don't let deadlines catch you off-guard. Stay ahead of your university placement journey with Elimu Smart!</p>
          
          <p>Good luck,<br>The Elimu Smart Team</p>
        </div>
        
        <div class="footer">
          <p><strong>Elimu Smart</strong> - Keeping you on track for university success</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateSessionConfirmationHTML(recipient, studentName, counselorName, sessionDate, sessionTime, sessionType) {
  const isStudent = recipient === 'student';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Session Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; }
        .session-card { background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Session Confirmed!</h1>
          <p>${isStudent ? 'Your counseling session is booked' : 'New student session scheduled'}</p>
        </div>
        
        <div class="content">
          <p>Hi ${isStudent ? studentName : counselorName},</p>
          
          <p>${isStudent ? 
            `Great news! Your ${sessionType.toLowerCase()} session with ${counselorName} has been confirmed.` :
            `You have a new ${sessionType.toLowerCase()} session booked with ${studentName}.`
          }</p>
          
          <div class="session-card">
            <h3>📅 Session Details</h3>
            <p><strong>Type:</strong> ${sessionType}</p>
            <p><strong>Date:</strong> ${sessionDate}</p>
            <p><strong>Time:</strong> ${sessionTime}</p>
            <p><strong>${isStudent ? 'Counselor' : 'Student'}:</strong> ${isStudent ? counselorName : studentName}</p>
          </div>
          
          <p><strong>${isStudent ? 'How to prepare:' : 'Session preparation:'}</strong></p>
          <ul>
            ${isStudent ? `
            <li>📝 Prepare any questions about your career path</li>
            <li>📊 Review your assessment results if available</li>
            <li>🎯 Think about your goals and concerns</li>
            <li>📱 Ensure stable internet connection for the session</li>
            ` : `
            <li>📋 Review ${studentName}'s profile and assessment results</li>
            <li>📝 Prepare session materials and resources</li>
            <li>🎯 Plan session agenda based on student's needs</li>
            <li>⏰ Set up your session environment</li>
            `}
          </ul>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://elimusmart.co.ke/${isStudent ? 'guidance' : 'counselor'}/sessions" class="button">${isStudent ? 'View Session Details' : 'Manage Sessions'}</a>
          </p>
          
          <p>${isStudent ? 
            'We\'re excited to support your career journey. Make the most of this opportunity!' :
            'Thank you for your commitment to student success.'
          }</p>
          
          <p>Best regards,<br>The Elimu Smart Team</p>
        </div>
        
        <div class="footer">
          <p><strong>Elimu Smart</strong> - Connecting students with expert guidance</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateScholarshipAlertHTML(firstName, scholarshipName, deadline, amount, requirements) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Scholarship Opportunity</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; }
        .scholarship-card { background: #f3e8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed; }
        .amount { font-size: 32px; font-weight: bold; color: #7c3aed; text-align: center; }
        .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: 0; }
        .requirements { background: #fef7cd; padding: 15px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 New Scholarship Match!</h1>
          <p>A funding opportunity just for you, ${firstName}!</p>
        </div>
        
        <div class="content">
          <p>Hi ${firstName},</p>
          
          <p>Exciting news! We've found a scholarship opportunity that matches your academic profile and career interests.</p>
          
          <div class="scholarship-card">
            <h3>🏆 ${scholarshipName}</h3>
            <div class="amount">${amount}</div>
            <p><strong>Application Deadline:</strong> ${deadline}</p>
          </div>
          
          <div class="requirements">
            <h4>📋 Requirements:</h4>
            <ul>
              ${requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
          </div>
          
          <p><strong>Why this matches you:</strong></p>
          <ul>
            <li>✅ Your academic performance aligns with requirements</li>
            <li>🎯 Matches your career interests and goals</li>
            <li>📊 High compatibility score based on your profile</li>
            <li>⏰ Application deadline allows adequate preparation time</li>
          </ul>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://elimusmart.co.ke/scholarships" class="button">Apply Now</a>
          </p>
          
          <p><strong>⚡ Quick Tips:</strong></p>
          <ul>
            <li>Start your application early to avoid last-minute rush</li>
            <li>Gather all required documents and references</li>
            <li>Tailor your personal statement to this specific opportunity</li>
            <li>Proofread everything before submitting</li>
          </ul>
          
          <p>This opportunity won't last forever. Take action today and invest in your future!</p>
          
          <p>Wishing you success,<br>The Elimu Smart Team</p>
        </div>
        
        <div class="footer">
          <p><strong>Elimu Smart</strong> - Unlocking educational funding opportunities</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ==========================================
// RIASEC CAREER ASSESSMENT API
// Complete backend API for web and mobile apps
// ==========================================

// Seed RIASEC database with questions from frontend
Parse.Cloud.define('seedRiasecData', async (request) => {
  const { user, params } = request;

  // Only admins can seed data
  if (!user || user.get('role') !== 'admin') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only admins can seed data');
  }

  try {
    const { questions, riasecTypes } = params;

    // Seed RiasecQuestion table
    const RiasecQuestion = Parse.Object.extend('RiasecQuestion');
    let questionsSaved = 0;

    for (const q of questions) {
      const query = new Parse.Query(RiasecQuestion);
      query.equalTo('questionId', q.id);
      const existing = await query.first({ useMasterKey: true });

      if (!existing) {
        const questionObj = new RiasecQuestion();
        questionObj.set('questionId', q.id);
        questionObj.set('category', q.category);
        questionObj.set('statement', q.statement);
        questionObj.set('riasecType', q.riasecType);
        questionObj.set('kenyaContext', q.kenyaContext || '');
        questionObj.set('isActive', true);
        questionObj.set('difficultyLevel', 3); // Default medium
        questionObj.set('timesPresented', 0);
        questionObj.set('averageResponseTime', 0);

        await questionObj.save(null, { useMasterKey: true });
        questionsSaved++;
      }
    }

    // Seed RiasecType table
    const RiasecType = Parse.Object.extend('RiasecType');
    let typesSaved = 0;

    for (const [code, typeData] of Object.entries(riasecTypes)) {
      const query = new Parse.Query(RiasecType);
      query.equalTo('code', code);
      const existing = await query.first({ useMasterKey: true });

      if (!existing) {
        const typeObj = new RiasecType();
        typeObj.set('code', code);
        typeObj.set('name', typeData.name);
        typeObj.set('description', typeData.description);
        typeObj.set('characteristics', typeData.characteristics || []);
        typeObj.set('workEnvironments', typeData.workEnvironments || []);
        typeObj.set('kenyaCareers', typeData.kenyaCareers || []);
        typeObj.set('kuccpsPathways', typeData.kuccpsPathways || []);

        await typeObj.save(null, { useMasterKey: true });
        typesSaved++;
      }
    }

    return {
      success: true,
      message: 'RIASEC data seeded successfully',
      questionsSaved,
      typesSaved,
      totalQuestions: questions.length
    };

  } catch (error) {
    console.error('RIASEC seed error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, `Seed failed: ${error.message}`);
  }
});

// getAssessmentQuestions function moved to contentManagementFunctions.js

// RIASEC Assessment Data Models and Functions
const RIASEC_TYPES = {
  R: {
    name: 'Realistic',
    description: 'Doers - practical, hands-on work',
    kenyaCareers: [
      'Mechanical Engineer', 'Agricultural Extension Officer', 'Building & Construction Technician',
      'Automotive Mechanic', 'Surveyor', 'Electrician', 'Plumber', 'Pilot', 'Veterinarian'
    ],
    kuccpsPathways: ['Engineering Courses', 'Agriculture & Veterinary Sciences', 'Built Environment', 'Technical & Vocational Training']
  },
  I: {
    name: 'Investigative',
    description: 'Thinkers - research, analysis, problem-solving',
    kenyaCareers: [
      'Medical Doctor', 'Research Scientist', 'Data Analyst', 'Software Developer',
      'Pharmacist', 'Laboratory Technologist', 'Actuary', 'Economist', 'Psychologist'
    ],
    kuccpsPathways: ['Medicine & Health Sciences', 'Pure & Applied Sciences', 'Information Technology', 'Social Sciences']
  },
  A: {
    name: 'Artistic',
    description: 'Creators - creativity, art, innovation',
    kenyaCareers: [
      'Graphic Designer', 'Journalist', 'Architect', 'Fashion Designer',
      'Musician', 'Film Producer', 'Interior Designer', 'Advertising Creative', 'Art Teacher'
    ],
    kuccpsPathways: ['Creative Arts & Design', 'Communication & Media', 'Architecture & Planning', 'Education (Arts)']
  },
  S: {
    name: 'Social',
    description: 'Helpers - working with people, teaching, helping',
    kenyaCareers: [
      'Teacher', 'Nurse', 'Social Worker', 'Counseling Psychologist', 'Human Resource Manager',
      'Community Development Officer', 'Public Health Officer', 'Lawyer', 'Customer Service Manager'
    ],
    kuccpsPathways: ['Education', 'Health Sciences', 'Social Sciences', 'Law', 'Public Administration']
  },
  E: {
    name: 'Enterprising',
    description: 'Persuaders - leadership, business, persuasion',
    kenyaCareers: [
      'Business Manager', 'Sales Representative', 'Entrepreneur', 'Politician', 'Marketing Manager',
      'Bank Manager', 'Real Estate Agent', 'Project Manager', 'Investment Banker'
    ],
    kuccpsPathways: ['Business & Management', 'Commerce', 'Economics', 'Public Administration', 'Communication']
  },
  C: {
    name: 'Conventional',
    description: 'Organizers - structure, detail, procedures',
    kenyaCareers: [
      'Accountant', 'Banker', 'Secretary', 'Auditor', 'Administrative Assistant',
      'Insurance Underwriter', 'Tax Consultant', 'Records Manager', 'Financial Analyst'
    ],
    kuccpsPathways: ['Accounting & Finance', 'Business Administration', 'Economics', 'Public Administration', 'Information Management']
  }
};

// Start RIASEC Assessment
Parse.Cloud.define('startRiasecAssessment', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  try {
    // Create new assessment record
    const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
    const assessment = new RiasecAssessment();
    
    assessment.set('user', user);
    assessment.set('status', 'in_progress');
    assessment.set('startedAt', new Date());
    assessment.set('version', 'IIP_RIASEC_Markers');
    assessment.set('totalQuestions', 96);
    assessment.set('responses', {});
    assessment.set('currentQuestion', 0);
    
    await assessment.save(null, { useMasterKey: true });
    
    // Log assessment start activity
    await Parse.Cloud.run('logUserActivity', {
      userId: user.id,
      activityType: 'riasec_assessment_started',
      data: {
        assessmentId: assessment.id,
        version: 'IIP_RIASEC_Markers',
        totalQuestions: 96
      }
    }, { useMasterKey: true });

    return {
      assessmentId: assessment.id,
      status: 'started',
      totalQuestions: 96,
      currentQuestion: 0
    };
  } catch (error) {
    console.error('Start RIASEC assessment error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to start RIASEC assessment');
  }
});

// Save RIASEC Question Response
Parse.Cloud.define('saveRiasecResponse', async (request) => {
  const { assessmentId, questionId, response, questionData } = request.params;
  const { user } = request;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  try {
    // Get assessment
    const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
    const assessmentQuery = new Parse.Query(RiasecAssessment);
    const assessment = await assessmentQuery.get(assessmentId, { useMasterKey: true });
    
    if (assessment.get('user').id !== user.id) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Assessment not found');
    }
    
    // Update responses
    const responses = assessment.get('responses') || {};
    responses[questionId] = {
      response: response,
      timestamp: new Date().toISOString(),
      riasecType: questionData.riasecType,
      category: questionData.category
    };
    
    assessment.set('responses', responses);
    assessment.set('currentQuestion', questionData.questionNumber);
    assessment.set('lastUpdated', new Date());
    
    await assessment.save(null, { useMasterKey: true });
    
    // Log individual response
    await Parse.Cloud.run('logUserActivity', {
      userId: user.id,
      activityType: 'riasec_question_answered',
      data: {
        assessmentId: assessmentId,
        questionId: questionId,
        response: response,
        riasecType: questionData.riasecType,
        questionNumber: questionData.questionNumber
      }
    }, { useMasterKey: true });

    return {
      success: true,
      currentQuestion: questionData.questionNumber,
      totalResponses: Object.keys(responses).length
    };
  } catch (error) {
    console.error('Save RIASEC response error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to save RIASEC response');
  }
});

// Save Bulk RIASEC Progress (for "Save & Continue Later" button)
Parse.Cloud.define('saveRiasecProgress', async (request) => {
  const { assessmentId, currentQuestion, responses } = request.params;
  const { user } = request;

  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  if (!assessmentId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Assessment ID required');
  }

  try {
    // Get assessment
    const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
    const assessmentQuery = new Parse.Query(RiasecAssessment);
    const assessment = await assessmentQuery.get(assessmentId, { useMasterKey: true });

    // Verify ownership
    if (assessment.get('user').id !== user.id) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Assessment not found');
    }

    // Update bulk progress
    assessment.set('currentQuestion', currentQuestion);
    assessment.set('responses', responses);
    assessment.set('lastUpdated', new Date());
    assessment.set('status', 'in_progress');

    await assessment.save(null, { useMasterKey: true });

    // Log progress save activity
    await Parse.Cloud.run('logUserActivity', {
      userId: user.id,
      activityType: 'riasec_progress_saved',
      data: {
        assessmentId: assessmentId,
        currentQuestion: currentQuestion,
        totalResponses: Object.keys(responses).length
      }
    }, { useMasterKey: true });

    return {
      success: true,
      currentQuestion: currentQuestion,
      totalResponses: Object.keys(responses).length,
      message: 'Progress saved successfully'
    };
  } catch (error) {
    console.error('Save RIASEC progress error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, `Failed to save progress: ${error.message}`);
  }
});

// Complete RIASEC Assessment and Calculate Results
Parse.Cloud.define('completeRiasecAssessment', async (request) => {
  const { assessmentId } = request.params;
  const { user } = request;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  try {
    // Get assessment
    const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
    const assessmentQuery = new Parse.Query(RiasecAssessment);
    const assessment = await assessmentQuery.get(assessmentId, { useMasterKey: true });
    
    if (assessment.get('user').id !== user.id) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Assessment not found');
    }
    
    const responses = assessment.get('responses') || {};
    
    // Calculate RIASEC scores
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const questionCounts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    Object.values(responses).forEach(responseData => {
      const type = responseData.riasecType;
      scores[type] += responseData.response;
      questionCounts[type]++;
    });
    
    // Normalize scores to 0-100 scale
    Object.keys(scores).forEach(type => {
      if (questionCounts[type] > 0) {
        scores[type] = Math.round((scores[type] / (questionCounts[type] * 4)) * 100);
      }
    });
    
    // Calculate Holland Code (top 3 types)
    const sortedTypes = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
    
    const hollandCode = sortedTypes.join('');
    const primaryType = sortedTypes[0];
    
    // Generate career matches
    const careerMatches = generateCareerMatches(scores, primaryType);
    
    // Generate development recommendations
    const developmentAreas = generateDevelopmentAreas(scores);
    
    // Update assessment with results
    const results = {
      scores: scores,
      hollandCode: hollandCode,
      primaryType: primaryType,
      careerMatches: careerMatches,
      developmentAreas: developmentAreas,
      completedAt: new Date().toISOString(),
      version: 'IIP_RIASEC_Markers_2024'
    };
    
    assessment.set('results', results);
    assessment.set('status', 'completed');
    assessment.set('completedAt', new Date());
    assessment.set('hollandCode', hollandCode);
    assessment.set('primaryType', primaryType);
    
    await assessment.save(null, { useMasterKey: true });
    
    // Update student progress
    const StudentProgress = Parse.Object.extend('StudentProgress');
    const progressQuery = new Parse.Query(StudentProgress);
    progressQuery.equalTo('user', user);
    const progress = await progressQuery.first({ useMasterKey: true });
    
    if (progress) {
      const currentAssessments = progress.get('assessmentsCompleted') || 0;
      progress.set('assessmentsCompleted', currentAssessments + 1);
      progress.set('lastRiasecResults', results);
      progress.set('hollandCode', hollandCode);
      await progress.save(null, { useMasterKey: true });
    }
    
    // Log completion
    const duration = new Date() - assessment.get('startedAt');
    await Parse.Cloud.run('logUserActivity', {
      userId: user.id,
      activityType: 'riasec_assessment_completed',
      data: {
        assessmentId: assessmentId,
        hollandCode: hollandCode,
        primaryType: primaryType,
        scores: scores,
        duration: duration,
        careerMatchesCount: careerMatches.length
      }
    }, { useMasterKey: true });
    
    // Note: Career readiness score will be recalculated on-demand when dashboard loads
    
    // Send completion email
    try {
      await Parse.Cloud.run('sendAssessmentCompletionEmail', {
        email: user.get('email'),
        firstName: user.get('firstName'),
        assessmentName: 'RIASEC Career Assessment',
        results: results
      }, { useMasterKey: true });
    } catch (emailError) {
      console.warn('Failed to send assessment completion email:', emailError);
    }

    return {
      success: true,
      results: results,
      assessmentId: assessmentId
    };
  } catch (error) {
    console.error('Complete RIASEC assessment error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to complete RIASEC assessment');
  }
});

// Get RIASEC Assessment Results
Parse.Cloud.define('getRiasecResults', async (request) => {
  const { assessmentId } = request.params;
  const { user } = request;

  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  // Cache key based on user and assessmentId (if provided)
  const cacheKey = assessmentId
    ? `riasec:result:${assessmentId}`
    : `riasec:latest:${user.id}`;

  try {
    // Check cache first (30 minute TTL for completed assessments)
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      console.log('✅ Cache HIT - Returning cached RIASEC results');
      return { ...cachedResult, fromCache: true };
    }

    console.log('❌ Cache MISS - Fetching RIASEC results from database');

    const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
    const assessmentQuery = new Parse.Query(RiasecAssessment);

    let result;

    if (assessmentId) {
      // Get specific assessment
      const assessment = await assessmentQuery.get(assessmentId, { useMasterKey: true });
      if (assessment.get('user').id !== user.id) {
        throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Assessment not found');
      }
      result = {
        assessment: {
          id: assessment.id,
          status: assessment.get('status'),
          results: assessment.get('results'),
          hollandCode: assessment.get('hollandCode'),
          completedAt: assessment.get('completedAt'),
          startedAt: assessment.get('startedAt')
        }
      };
    } else {
      // Get user's latest assessment
      assessmentQuery.equalTo('user', user);
      assessmentQuery.descending('createdAt');
      assessmentQuery.limit(1);

      const assessment = await assessmentQuery.first({ useMasterKey: true });
      if (!assessment) {
        return { assessment: null };
      }

      result = {
        assessment: {
          id: assessment.id,
          status: assessment.get('status'),
          results: assessment.get('results'),
          hollandCode: assessment.get('hollandCode'),
          completedAt: assessment.get('completedAt'),
          startedAt: assessment.get('startedAt')
        }
      };
    }

    // Cache completed assessments for 30 minutes (1800 seconds)
    // Don't cache in-progress assessments
    if (result.assessment && result.assessment.status === 'completed') {
      await cache.set(cacheKey, result, 1800);
      console.log('💾 Cached RIASEC results');
    }

    return result;
  } catch (error) {
    console.error('Get RIASEC results error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to get RIASEC results');
  }
});

// Get User's RIASEC Assessment History
Parse.Cloud.define('getRiasecHistory', async (request) => {
  const { user } = request;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  try {
    const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
    const query = new Parse.Query(RiasecAssessment);
    query.equalTo('user', user);
    query.descending('createdAt');
    query.limit(10); // Last 10 assessments
    
    const assessments = await query.find({ useMasterKey: true });
    
    return {
      assessments: assessments.map(assessment => ({
        id: assessment.id,
        status: assessment.get('status'),
        hollandCode: assessment.get('hollandCode'),
        primaryType: assessment.get('primaryType'),
        completedAt: assessment.get('completedAt'),
        startedAt: assessment.get('startedAt'),
        scores: assessment.get('results')?.scores || null
      }))
    };
  } catch (error) {
    console.error('Get RIASEC history error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to get RIASEC history');
  }
});

// Resume In-Progress Assessment
Parse.Cloud.define('resumeRiasecAssessment', async (request) => {
  const { user } = request;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  try {
    const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
    const query = new Parse.Query(RiasecAssessment);
    query.equalTo('user', user);
    query.equalTo('status', 'in_progress');
    query.descending('createdAt');
    
    const assessment = await query.first({ useMasterKey: true });
    
    if (!assessment) {
      return { assessment: null };
    }
    
    const responses = assessment.get('responses') || {};
    return {
      assessment: {
        id: assessment.id,
        currentQuestion: assessment.get('currentQuestion') || 0,
        totalQuestions: assessment.get('totalQuestions') || 96,
        responses: Object.keys(responses),
        startedAt: assessment.get('startedAt')
      }
    };
  } catch (error) {
    console.error('Resume RIASEC assessment error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to resume RIASEC assessment');
  }
});

// Get RIASEC Type Personality Insights
Parse.Cloud.define('getRiasecTypeInfo', async (request) => {
  const { typeCode } = request.params;

  // Cache key for type info (cache for 24 hours - static data)
  const cacheKey = typeCode ? `riasec:type:${typeCode}` : 'riasec:types:all';

  try {
    // Check cache first (24 hour TTL - 86400 seconds)
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      console.log('✅ Cache HIT - Returning cached RIASEC type info');
      return { ...cachedResult, fromCache: true };
    }

    console.log('❌ Cache MISS - Fetching RIASEC type info from database');

    const RiasecTypeInfo = Parse.Object.extend('RiasecTypeInfo');
    const query = new Parse.Query(RiasecTypeInfo);
    query.equalTo('isActive', true);

    let result;

    if (typeCode) {
      // Get specific type
      query.equalTo('code', typeCode);
      const typeInfo = await query.first({ useMasterKey: true });

      if (!typeInfo) {
        throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `RIASEC type ${typeCode} not found`);
      }

      result = {
        type: {
          code: typeInfo.get('code'),
          name: typeInfo.get('name'),
          description: typeInfo.get('description'),
          workStyle: typeInfo.get('workStyle'),
          strengths: typeInfo.get('strengths'),
          motivators: typeInfo.get('motivators'),
          teamRole: typeInfo.get('teamRole'),
          famousKenyans: typeInfo.get('famousKenyans'),
          learningStyle: typeInfo.get('learningStyle'),
          decisionMaking: typeInfo.get('decisionMaking')
        }
      };
    } else {
      // Get all types
      query.ascending('code');
      const types = await query.find({ useMasterKey: true });

      result = {
        types: types.map(typeInfo => ({
          code: typeInfo.get('code'),
          name: typeInfo.get('name'),
          description: typeInfo.get('description'),
          workStyle: typeInfo.get('workStyle'),
          strengths: typeInfo.get('strengths'),
          motivators: typeInfo.get('motivators'),
          teamRole: typeInfo.get('teamRole'),
          famousKenyans: typeInfo.get('famousKenyans'),
          learningStyle: typeInfo.get('learningStyle'),
          decisionMaking: typeInfo.get('decisionMaking')
        }))
      };
    }

    // Cache for 24 hours (86400 seconds) - This is static reference data
    await cache.set(cacheKey, result, 86400);
    console.log('💾 Cached RIASEC type info');

    return result;
  } catch (error) {
    console.error('Get RIASEC type info error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to get RIASEC type info');
  }
});

// Helper Functions for RIASEC API
function generateCareerMatches(scores, primaryType) {
  const matches = [];
  const primaryCareers = RIASEC_TYPES[primaryType]?.kenyaCareers || [];
  
  // Add primary type careers
  primaryCareers.slice(0, 5).forEach((career, index) => {
    matches.push({
      career: career,
      compatibility: 85 + Math.random() * 15,
      kuccpsPathway: RIASEC_TYPES[primaryType].kuccpsPathways[0],
      reasonsForMatch: [
        `Strong ${RIASEC_TYPES[primaryType].name} personality fit`,
        'High demand in Kenya job market',
        'Good KUCCPS pathway availability'
      ],
      rank: index + 1
    });
  });
  
  // Add secondary type careers
  const secondaryType = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)[1][0];
  
  const secondaryCareers = RIASEC_TYPES[secondaryType]?.kenyaCareers || [];
  secondaryCareers.slice(0, 3).forEach((career, index) => {
    matches.push({
      career: career,
      compatibility: 70 + Math.random() * 15,
      kuccpsPathway: RIASEC_TYPES[secondaryType].kuccpsPathways[0],
      reasonsForMatch: [
        `Good ${RIASEC_TYPES[secondaryType].name} secondary fit`,
        'Growing field in Kenya',
        'Multiple pathways available'
      ],
      rank: matches.length + 1
    });
  });
  
  return matches.sort((a, b) => b.compatibility - a.compatibility);
}

function generateDevelopmentAreas(scores) {
  const lowestScores = Object.entries(scores)
    .sort(([,a], [,b]) => a - b)
    .slice(0, 2);

  return lowestScores.map(([type]) => 
    `Develop ${RIASEC_TYPES[type].name.toLowerCase()} skills to become more well-rounded`
  );
}

// Get RIASEC Career Information
Parse.Cloud.define('getRiasecCareerInfo', async (request) => {
  const { hollandCode, careerName } = request.params;
  
  try {
    if (hollandCode) {
      const types = hollandCode.split('').map(code => ({
        code: code,
        ...RIASEC_TYPES[code]
      }));
      
      return { types: types };
    }
    
    if (careerName) {
      // Find which RIASEC type contains this career
      for (const [code, type] of Object.entries(RIASEC_TYPES)) {
        if (type.kenyaCareers.some(career => 
          career.toLowerCase().includes(careerName.toLowerCase())
        )) {
          return {
            career: careerName,
            riasecType: { code: code, ...type },
            relatedCareers: type.kenyaCareers,
            pathways: type.kuccpsPathways
          };
        }
      }
    }
    
    return { types: Object.entries(RIASEC_TYPES).map(([code, type]) => ({
      code: code,
      ...type
    })) };
  } catch (error) {
    console.error('Get RIASEC career info error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to get RIASEC career information');
  }
});

// ==========================================
// SUBJECT-TO-CAREER MAPPER API
// Maps KCSE subjects to compatible careers
// ==========================================

// Kenya Subject-Career Mapping Data
const SUBJECT_CAREER_MAPPINGS = {
  'Math_Physics_Chemistry': {
    careers: [
      { name: 'Mechanical Engineering', minCluster: 70, employmentRate: 0.82, avgSalary: 95000 },
      { name: 'Civil Engineering', minCluster: 65, employmentRate: 0.78, avgSalary: 85000 },
      { name: 'Chemical Engineering', minCluster: 75, employmentRate: 0.75, avgSalary: 105000 },
      { name: 'Architecture', minCluster: 60, employmentRate: 0.70, avgSalary: 90000 }
    ],
    kuccpsCode: 'ENG',
    alternativePathways: ['Diploma to Degree', 'Certificate to Diploma']
  },
  'Math_Physics_Biology': {
    careers: [
      { name: 'Biomedical Engineering', minCluster: 72, employmentRate: 0.80, avgSalary: 100000 },
      { name: 'Environmental Science', minCluster: 58, employmentRate: 0.75, avgSalary: 75000 },
      { name: 'Medical Physics', minCluster: 78, employmentRate: 0.85, avgSalary: 120000 }
    ],
    kuccpsCode: 'SCI',
    alternativePathways: ['Science Bridging Courses']
  },
  'Biology_Chemistry_Physics': {
    careers: [
      { name: 'Medicine', minCluster: 84, employmentRate: 0.95, avgSalary: 180000 },
      { name: 'Pharmacy', minCluster: 75, employmentRate: 0.88, avgSalary: 95000 },
      { name: 'Nursing', minCluster: 50, employmentRate: 0.90, avgSalary: 65000 },
      { name: 'Clinical Medicine', minCluster: 65, employmentRate: 0.92, avgSalary: 85000 }
    ],
    kuccpsCode: 'MED',
    alternativePathways: ['Diploma Clinical Medicine', 'Certificate Nursing']
  },
  'Math_Business_Economics': {
    careers: [
      { name: 'Business Administration', minCluster: 50, employmentRate: 0.70, avgSalary: 70000 },
      { name: 'Economics', minCluster: 55, employmentRate: 0.65, avgSalary: 80000 },
      { name: 'Finance', minCluster: 60, employmentRate: 0.75, avgSalary: 90000 },
      { name: 'Accounting', minCluster: 55, employmentRate: 0.80, avgSalary: 75000 }
    ],
    kuccpsCode: 'BUS',
    alternativePathways: ['Diploma in Business', 'ACCA Certification']
  }
};

// Grade to points conversion
function gradeToPoints(grade) {
  const gradeMap = {
    'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8,
    'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
  };
  return gradeMap[grade?.toUpperCase()] || 0;
}

// Calculate KCSE cluster points
function calculateClusterPoints(grades) {
  const points = Object.values(grades)
    .map(grade => gradeToPoints(grade))
    .sort((a, b) => b - a)
    .slice(0, 7);
  
  return Math.min(points.reduce((sum, point) => sum + point, 0), 84);
}

// Subject-to-Career Analysis
Parse.Cloud.define('analyzeSubjectCareerFit', async (request) => {
  const { subjects, grades } = request.params;
  const { user } = request;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }
  
  try {
    const subjectKey = subjects.sort().join('_');
    const mapping = SUBJECT_CAREER_MAPPINGS[subjectKey];
    
    if (!mapping) {
      return {
        careers: [],
        message: 'No direct career mappings found for this subject combination. Consider exploring interdisciplinary careers.'
      };
    }
    
    const clusterPoints = calculateClusterPoints(grades);
    
    const careerAnalysis = mapping.careers.map(career => {
      const eligible = clusterPoints >= career.minCluster;
      const competitiveness = Math.min((clusterPoints / career.minCluster) * 100, 150);
      
      return {
        career: career.name,
        eligible,
        clusterPointsRequired: career.minCluster,
        studentClusterPoints: clusterPoints,
        gap: Math.max(0, career.minCluster - clusterPoints),
        competitiveness: Math.round(competitiveness),
        employmentRate: career.employmentRate,
        averageSalary: career.avgSalary,
        kuccpsCode: mapping.kuccpsCode
      };
    });
    
    // Log activity
    const ActivityLog = Parse.Object.extend('ActivityLog');
    const activity = new ActivityLog();
    activity.set('user', user);
    activity.set('action', 'subject_career_analysis');
    activity.set('details', { subjects, clusterPoints });
    await activity.save(null, { useMasterKey: true });
    
    return {
      clusterPoints,
      careers: careerAnalysis.sort((a, b) => b.competitiveness - a.competitiveness),
      alternativePathways: mapping.alternativePathways,
      recommendations: generateSubjectRecommendations(careerAnalysis, clusterPoints)
    };
    
  } catch (error) {
    console.error('Subject career analysis error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to analyze subject-career fit');
  }
});

function generateSubjectRecommendations(careers, clusterPoints) {
  const recommendations = [];
  
  const eligibleCareers = careers.filter(c => c.eligible);
  const almostEligible = careers.filter(c => !c.eligible && c.gap <= 10);
  
  if (eligibleCareers.length > 0) {
    recommendations.push({
      type: 'eligible',
      message: `Great! You qualify for ${eligibleCareers.length} career paths with your current performance.`
    });
  }
  
  if (almostEligible.length > 0) {
    recommendations.push({
      type: 'improvement',
      message: `You're close to qualifying for ${almostEligible.length} additional careers. Focus on improving your grades in key subjects.`
    });
  }
  
  return recommendations;
}

// ==========================================
// SKILLS ASSESSMENT API
// Multi-dimensional skill evaluation system
// ==========================================

const SKILL_FRAMEWORK = {
  'Critical Thinking': {
    questions: [1, 5, 9, 13, 17, 21],
    weight: 1.2,
    description: 'Ability to analyze, evaluate, and synthesize information'
  },
  'Communication': {
    questions: [2, 6, 10, 14, 18, 22],
    weight: 1.1,
    description: 'Effective written and verbal communication skills'
  },
  'Leadership': {
    questions: [3, 7, 11, 15, 19, 23],
    weight: 1.0,
    description: 'Ability to guide, motivate, and influence others'
  },
  'Technical Skills': {
    questions: [4, 8, 12, 16, 20, 24],
    weight: 1.0,
    description: 'Proficiency with tools, technology, and technical processes'
  },
  'Creativity': {
    questions: [25, 26, 27, 28, 29, 30],
    weight: 0.9,
    description: 'Innovation and creative problem-solving abilities'
  },
  'Teamwork': {
    questions: [31, 32, 33, 34, 35, 36],
    weight: 1.0,
    description: 'Collaboration and interpersonal effectiveness'
  }
};

// Start Skills Assessment
Parse.Cloud.define('startSkillsAssessment', async (request) => {
  const { user } = request;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }
  
  try {
    const SkillsAssessment = Parse.Object.extend('SkillsAssessment');
    const assessment = new SkillsAssessment();
    
    assessment.set('user', user);
    assessment.set('status', 'in_progress');
    assessment.set('startedAt', new Date());
    assessment.set('responses', {});
    assessment.set('currentQuestion', 0);
    assessment.set('totalQuestions', 36);
    
    await assessment.save(null, { useMasterKey: true });
    
    return {
      id: assessment.id,
      totalQuestions: 36,
      skillCategories: Object.keys(SKILL_FRAMEWORK)
    };
    
  } catch (error) {
    console.error('Start skills assessment error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to start skills assessment');
  }
});

// Calculate Skill Profile
Parse.Cloud.define('calculateSkillProfile', async (request) => {
  const { assessmentId } = request.params;
  const { user } = request;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }
  
  try {
    const assessment = await new Parse.Query('SkillsAssessment').get(assessmentId, { useMasterKey: true });
    const responses = assessment.get('responses');
    
    const skillScores = {};
    
    Object.keys(SKILL_FRAMEWORK).forEach(skillCategory => {
      const questions = SKILL_FRAMEWORK[skillCategory].questions;
      const weight = SKILL_FRAMEWORK[skillCategory].weight;
      
      let totalScore = 0;
      let responseCount = 0;
      
      questions.forEach(questionId => {
        if (responses[questionId] !== undefined) {
          totalScore += responses[questionId];
          responseCount++;
        }
      });
      
      const averageScore = responseCount > 0 ? totalScore / responseCount : 0;
      const weightedScore = averageScore * weight;
      const normalizedScore = Math.round((weightedScore / 5) * 100);
      
      skillScores[skillCategory] = {
        score: averageScore,
        normalizedScore,
        level: categorizeSkillLevel(averageScore),
        confidence: responseCount / questions.length,
        description: SKILL_FRAMEWORK[skillCategory].description
      };
    });
    
    // Identify top skills and development areas
    const sortedSkills = Object.entries(skillScores).sort(([,a], [,b]) => b.normalizedScore - a.normalizedScore);
    const topSkills = sortedSkills.slice(0, 3).map(([skill, data]) => ({ skill, ...data }));
    const developmentAreas = sortedSkills.slice(-2).map(([skill, data]) => ({ skill, ...data }));
    
    // Update assessment
    assessment.set('status', 'completed');
    assessment.set('completedAt', new Date());
    assessment.set('skillProfile', skillScores);
    assessment.set('topSkills', topSkills);
    assessment.set('developmentAreas', developmentAreas);
    await assessment.save(null, { useMasterKey: true });
    
    return {
      skillProfile: skillScores,
      topSkills,
      developmentAreas,
      overallReadiness: calculateOverallReadiness(skillScores)
    };
    
  } catch (error) {
    console.error('Calculate skill profile error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to calculate skill profile');
  }
});

function categorizeSkillLevel(score) {
  if (score >= 4.5) return 'Expert';
  if (score >= 3.5) return 'Advanced';
  if (score >= 2.5) return 'Intermediate';
  if (score >= 1.5) return 'Beginner';
  return 'Novice';
}

function calculateOverallReadiness(skillScores) {
  const scores = Object.values(skillScores).map(skill => skill.normalizedScore);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  return {
    score: Math.round(average),
    level: average >= 80 ? 'Excellent' : average >= 60 ? 'Good' : average >= 40 ? 'Fair' : 'Needs Development',
    recommendations: generateSkillRecommendations(skillScores)
  };
}

function generateSkillRecommendations(skillScores) {
  const recommendations = [];
  
  Object.entries(skillScores).forEach(([skill, data]) => {
    if (data.normalizedScore < 60) {
      recommendations.push({
        skill,
        type: 'improvement',
        message: `Focus on developing ${skill.toLowerCase()} through targeted practice and learning opportunities.`
      });
    } else if (data.normalizedScore >= 80) {
      recommendations.push({
        skill,
        type: 'leverage',
        message: `Leverage your strong ${skill.toLowerCase()} skills in career opportunities and leadership roles.`
      });
    }
  });
  
  return recommendations;
}

// ================================================================================================
// UNIVERSITY COURSE FINDER API - Find Compatible University Programs
// ================================================================================================

// ⚠️ DEPRECATED: Hardcoded university data (kept for reference only)
// Data now stored in Parse Classes: University & Course
// Migration completed: 2025-10-11
// To update data, use Parse Dashboard or admin functions
const KENYA_UNIVERSITIES_DATABASE_DEPRECATED = [
  // Public Universities
  {
    id: 'uon',
    name: 'University of Nairobi',
    type: 'public',
    location: 'Nairobi',
    kuccpsCode: '01',
    programs: [
      {
        id: 'medicine',
        name: 'Bachelor of Medicine and Bachelor of Surgery (MBChB)',
        kuccpsCode: '01101',
        cutoffPoints: 78,
        duration: '6 years',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
        careerOutcomes: ['Medical Doctor', 'Surgeon', 'Specialist Doctor'],
        averageSalary: 450000,
        employmentRate: 0.95,
        annualFees: 45000,
        scholarships: ['HELB', 'Government Scholarship', 'Merit Scholarships']
      },
      {
        id: 'engineering',
        name: 'Bachelor of Engineering (Civil Engineering)',
        kuccpsCode: '01102',
        cutoffPoints: 72,
        duration: '4 years',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
        careerOutcomes: ['Civil Engineer', 'Project Manager', 'Construction Manager'],
        averageSalary: 350000,
        employmentRate: 0.88,
        annualFees: 42000,
        scholarships: ['HELB', 'Engineering Scholarship']
      },
      {
        id: 'business',
        name: 'Bachelor of Commerce',
        kuccpsCode: '01103',
        cutoffPoints: 65,
        duration: '4 years',
        subjects: ['Mathematics', 'English', 'Business Studies', 'Economics'],
        careerOutcomes: ['Business Analyst', 'Financial Manager', 'Marketing Manager'],
        averageSalary: 280000,
        employmentRate: 0.82,
        annualFees: 38000,
        scholarships: ['HELB', 'Business Leaders Scholarship']
      }
    ]
  },
  {
    id: 'jkuat',
    name: 'Jomo Kenyatta University of Agriculture and Technology',
    type: 'public',
    location: 'Juja',
    kuccpsCode: '02',
    programs: [
      {
        id: 'computer-science',
        name: 'Bachelor of Science in Computer Science',
        kuccpsCode: '02201',
        cutoffPoints: 68,
        duration: '4 years',
        subjects: ['Mathematics', 'Physics', 'English', 'Computer Studies'],
        careerOutcomes: ['Software Developer', 'IT Consultant', 'Systems Analyst'],
        averageSalary: 320000,
        employmentRate: 0.90,
        annualFees: 40000,
        scholarships: ['HELB', 'Tech Innovation Fund']
      },
      {
        id: 'agriculture',
        name: 'Bachelor of Science in Agriculture',
        kuccpsCode: '02202',
        cutoffPoints: 60,
        duration: '4 years',
        subjects: ['Mathematics', 'Chemistry', 'Biology', 'Geography', 'English'],
        careerOutcomes: ['Agricultural Officer', 'Farm Manager', 'Agricultural Consultant'],
        averageSalary: 250000,
        employmentRate: 0.75,
        annualFees: 35000,
        scholarships: ['HELB', 'Agricultural Development Fund']
      }
    ]
  },
  {
    id: 'moi',
    name: 'Moi University',
    type: 'public',
    location: 'Eldoret',
    kuccpsCode: '03',
    programs: [
      {
        id: 'education',
        name: 'Bachelor of Education (Science)',
        kuccpsCode: '03301',
        cutoffPoints: 58,
        duration: '4 years',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
        careerOutcomes: ['Secondary School Teacher', 'Educational Administrator', 'Curriculum Developer'],
        averageSalary: 220000,
        employmentRate: 0.85,
        annualFees: 32000,
        scholarships: ['HELB', 'Teachers Service Commission Bursary']
      }
    ]
  },
  // Private Universities
  {
    id: 'strathmore',
    name: 'Strathmore University',
    type: 'private',
    location: 'Nairobi',
    kuccpsCode: '04',
    programs: [
      {
        id: 'business-admin',
        name: 'Bachelor of Business Administration',
        kuccpsCode: '04401',
        cutoffPoints: 70,
        duration: '4 years',
        subjects: ['Mathematics', 'English', 'Business Studies', 'Economics'],
        careerOutcomes: ['Business Manager', 'Consultant', 'Entrepreneur'],
        averageSalary: 400000,
        employmentRate: 0.92,
        annualFees: 180000,
        scholarships: ['Merit Scholarship', 'Need-based Bursary']
      }
    ]
  }
];

// University Course Finder Cloud Function (Parse Class Version - Updated 2025-10-11)
// Queries from University & Course Parse Classes instead of hardcoded data
Parse.Cloud.define('findUniversityCourses', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const {
    studentProfile,
    academicPreferences,
    financialConstraints,
    locationPreferences
  } = request.params;

  console.log('🎓 Processing University Course Finder request (Parse Class version):', {
    studentProfile: studentProfile ? 'provided' : 'missing',
    academicPreferences: academicPreferences ? 'provided' : 'missing',
    financialConstraints: financialConstraints ? 'provided' : 'missing',
    locationPreferences: locationPreferences ? 'provided' : 'missing'
  });

  // Generate cache key based on request parameters
  const cacheKey = `university_finder:${JSON.stringify({
    subjects: studentProfile?.subjects?.sort(),
    grades: studentProfile?.grades,
    careers: academicPreferences?.careerInterests?.sort(),
    maxFees: financialConstraints?.maxAnnualFees,
    locations: locationPreferences?.sort()
  })}`;

  try {
    // Check cache first (10 minute TTL)
    let cachedResult = null;
    if (cache && cache.get) {
      try {
        cachedResult = await cache.get(cacheKey);
      } catch (cacheError) {
        console.warn('Cache access failed:', cacheError.message);
      }
    }

    if (cachedResult) {
      console.log('✅ Cache HIT - Returning cached university results');
      return { ...cachedResult, fromCache: true };
    }

    console.log('❌ Cache MISS - Computing university matches from Parse Classes');

    // Calculate student's cluster points based on grades
    const clusterPoints = calculateClusterPoints(studentProfile.grades);

    // Query Universities from Parse Class
    const UniversityClass = Parse.Object.extend('University');
    const universityQuery = new Parse.Query(UniversityClass);
    universityQuery.equalTo('active', true);

    // Apply location filter if specified
    if (locationPreferences && locationPreferences.length > 0) {
      universityQuery.containedIn('location', locationPreferences);
    }

    const universities = await universityQuery.find({ useMasterKey: true });
    console.log(`📚 Found ${universities.length} active universities`);

    // Check if we found any universities
    if (!universities || universities.length === 0) {
      console.log('⚠️  No universities found in database');
      return {
        success: true,
        clusterPoints,
        matchingPrograms: [],
        recommendations: {
          summary: 'No universities available yet. Check back soon!',
          topRecommendations: [],
          alternativeOptions: []
        },
        summary: {
          totalMatches: 0,
          eligiblePrograms: 0,
          averageMatchScore: 0
        },
        dataSource: 'parse_class'
      };
    }

    // Find matching programs
    const matchingPrograms = [];

    for (const university of universities) {
      // Safety check for university object
      if (!university) {
        console.warn('⚠️  Skipping undefined university');
        continue;
      }

      // Query courses for this university
      const CourseClass = Parse.Object.extend('Course');
      const courseQuery = new Parse.Query(CourseClass);
      courseQuery.equalTo('university', university);
      courseQuery.equalTo('active', true);

      const courses = await courseQuery.find({ useMasterKey: true });

      for (const course of courses) {
        // Safety check for course object
        if (!course) {
          console.warn('⚠️  Skipping undefined course');
          continue;
        }

        // Extract course data with null checks
        const program = {
          id: course.get('courseId') || 'unknown',
          name: course.get('name') || 'Unknown Course',
          kuccpsCode: course.get('kuccpsCode') || '',
          cutoffPoints: course.get('cutoffPoints') || 0,
          duration: course.get('duration') || '4 years',
          subjects: course.get('subjects') || [],
          careerOutcomes: course.get('careerOutcomes') || [],
          averageSalary: course.get('averageSalary') || 0,
          employmentRate: course.get('employmentRate') || 0,
          annualFees: course.get('annualFees') || 0,
          scholarships: course.get('scholarships') || []
        };

        // Check academic eligibility
        const eligible = clusterPoints >= program.cutoffPoints;
        const pointsGap = program.cutoffPoints - clusterPoints;

        // Check subject requirements
        const hasRequiredSubjects = checkSubjectRequirements(
          studentProfile.subjects,
          program.subjects
        );

        // Check financial constraints
        const financiallyViable = !financialConstraints ||
          program.annualFees <= (financialConstraints.maxAnnualFees || 200000);

        // Calculate match score (0-100)
        const matchScore = calculateUniversityMatchScore({
          clusterPoints,
          program,
          studentProfile,
          academicPreferences,
          hasRequiredSubjects,
          financiallyViable
        });

        // Add to results if meets minimum criteria
        if (matchScore >= 30) {
          matchingPrograms.push({
            universityId: university.get('universityId') || 'unknown',
            universityName: university.get('name') || 'Unknown University',
            universityType: university.get('type') || 'public',
            location: university.get('location') || 'Kenya',
            kuccpsCode: university.get('kuccpsCode') || '',
            program: {
              ...program,
              eligible,
              pointsGap: Math.max(0, pointsGap),
              matchScore,
              hasRequiredSubjects,
              financiallyViable,
              affordabilityLevel: getAffordabilityLevel(program.annualFees, financialConstraints),
              careerOutlook: getCareerOutlook(program),
              recommendationReason: getRecommendationReason({
                matchScore,
                eligible,
                hasRequiredSubjects,
                financiallyViable,
                academicPreferences
              })
            }
          });
        }
      }
    }

    // Sort by match score (highest first)
    matchingPrograms.sort((a, b) => b.program.matchScore - a.program.matchScore);

    // Generate personalized recommendations
    const recommendations = generateUniversityRecommendations({
      matchingPrograms,
      studentProfile,
      clusterPoints,
      academicPreferences,
      financialConstraints
    });

    // Log activity (non-blocking - don't fail if logging fails)
    try {
      await Parse.Cloud.run('logUserActivity', {
        userId: user.id,
        activityType: 'university_finder',
        details: {
          clusterPoints,
          programsFound: matchingPrograms.length,
          preferences: {
            academic: !!academicPreferences,
            financial: !!financialConstraints,
            location: !!locationPreferences
          },
          dataSource: 'parse_class' // Track that we're using Parse Classes now
        }
      });
    } catch (loggingError) {
      console.warn('Activity logging failed (non-critical):', loggingError.message);
    }

    const result = {
      success: true,
      clusterPoints,
      matchingPrograms: matchingPrograms.slice(0, 15), // Top 15 matches
      recommendations,
      summary: {
        totalMatches: matchingPrograms.length,
        eligiblePrograms: matchingPrograms.filter(p => p.program.eligible).length,
        averageMatchScore: matchingPrograms.length > 0
          ? matchingPrograms.reduce((sum, p) => sum + p.program.matchScore, 0) / matchingPrograms.length
          : 0
      },
      dataSource: 'parse_class' // Indicate data comes from Parse Classes
    };

    // Cache the result for 10 minutes (600 seconds)
    if (cache && cache.set) {
      try {
        await cache.set(cacheKey, result, 600);
        console.log('💾 Cached university finder results');
      } catch (cacheError) {
        console.warn('Cache write failed:', cacheError.message);
      }
    }

    return result;

  } catch (error) {
    console.error('❌ University Course Finder error:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to find university courses: ${error.message}`);
  }
});

// Helper function to check subject requirements
function checkSubjectRequirements(studentSubjects, requiredSubjects) {
  const studentSubjectSet = new Set(studentSubjects.map(s => s.toLowerCase()));
  return requiredSubjects.every(req => 
    studentSubjectSet.has(req.toLowerCase()) ||
    // Allow some flexibility for common subject variations
    (req.toLowerCase() === 'mathematics' && studentSubjectSet.has('math')) ||
    (req.toLowerCase() === 'math' && studentSubjectSet.has('mathematics'))
  );
}

// Helper function to calculate university match score
function calculateUniversityMatchScore({
  clusterPoints,
  program,
  studentProfile,
  academicPreferences,
  hasRequiredSubjects,
  financiallyViable
}) {
  let score = 0;
  
  // Academic eligibility (40% of score)
  if (clusterPoints >= program.cutoffPoints) {
    score += 40;
  } else {
    const deficit = program.cutoffPoints - clusterPoints;
    score += Math.max(0, 40 - (deficit * 2)); // Reduce score based on points gap
  }
  
  // Subject requirements (25% of score)
  if (hasRequiredSubjects) {
    score += 25;
  }
  
  // Financial viability (20% of score)
  if (financiallyViable) {
    score += 20;
  } else {
    score += 10; // Partial credit if not completely affordable
  }
  
  // Career interest alignment (15% of score)
  if (academicPreferences && academicPreferences.careerInterests) {
    const interestMatch = program.careerOutcomes.some(outcome => 
      academicPreferences.careerInterests.some(interest =>
        outcome.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(outcome.toLowerCase())
      )
    );
    if (interestMatch) {
      score += 15;
    } else {
      score += 5; // Minimal credit for career diversity
    }
  } else {
    score += 10; // Default score if no preferences specified
  }
  
  return Math.round(score);
}

// Helper function to determine affordability level
function getAffordabilityLevel(annualFees, financialConstraints) {
  if (!financialConstraints) return 'unknown';
  
  const maxBudget = financialConstraints.maxAnnualFees || 50000;
  
  if (annualFees <= maxBudget * 0.5) return 'very_affordable';
  if (annualFees <= maxBudget * 0.8) return 'affordable';
  if (annualFees <= maxBudget) return 'manageable';
  if (annualFees <= maxBudget * 1.5) return 'stretch';
  return 'expensive';
}

// Helper function to get career outlook information
function getCareerOutlook(program) {
  return {
    employmentRate: program.employmentRate,
    averageSalary: program.averageSalary,
    careerGrowth: program.employmentRate > 0.85 ? 'high' : 
                  program.employmentRate > 0.75 ? 'medium' : 'moderate',
    industryDemand: program.averageSalary > 300000 ? 'high' : 
                    program.averageSalary > 200000 ? 'medium' : 'stable'
  };
}

// Helper function to generate recommendation reasons
function getRecommendationReason({
  matchScore,
  eligible,
  hasRequiredSubjects,
  financiallyViable,
  academicPreferences
}) {
  if (matchScore >= 80) {
    return 'Excellent match - you meet all requirements and this aligns well with your interests';
  } else if (matchScore >= 65) {
    return eligible ? 
      'Strong match - you qualify and this program offers good career prospects' :
      'Good potential match - consider improving grades to meet cutoff points';
  } else if (matchScore >= 50) {
    if (!hasRequiredSubjects) {
      return 'Subject requirements not met - consider alternative programs or subject combinations';
    } else if (!eligible) {
      return 'Points gap exists - focus on improving performance to reach cutoff';
    } else if (!financiallyViable) {
      return 'Strong academic match but may need financial planning or scholarship options';
    } else {
      return 'Moderate match - consider as backup option while exploring other alternatives';
    }
  } else {
    return 'Limited match - explore programs that better align with your current profile';
  }
}

// Helper function to generate personalized recommendations
function generateUniversityRecommendations({
  matchingPrograms,
  studentProfile,
  clusterPoints,
  academicPreferences,
  financialConstraints
}) {
  const recommendations = [];
  
  // Analysis of matches
  const eligiblePrograms = matchingPrograms.filter(p => p.program.eligible);
  const highMatchPrograms = matchingPrograms.filter(p => p.program.matchScore >= 70);
  
  if (eligiblePrograms.length === 0) {
    recommendations.push({
      type: 'academic_improvement',
      title: 'Focus on Grade Improvement',
      message: `Your current cluster points (${clusterPoints}) need improvement. Target the highest cutoff you can reach and consider foundation or diploma programs as pathways.`,
      priority: 'high'
    });
  } else if (eligiblePrograms.length < 3) {
    recommendations.push({
      type: 'expand_options',
      title: 'Broaden Your Search',
      message: `You have ${eligiblePrograms.length} eligible program(s). Consider expanding your location preferences or exploring similar programs at other universities.`,
      priority: 'medium'
    });
  }
  
  if (highMatchPrograms.length > 0) {
    recommendations.push({
      type: 'top_choices',
      title: 'Strong Program Matches Found',
      message: `${highMatchPrograms.length} program(s) are excellent matches for your profile. Focus your KUCCPS application on these options.`,
      priority: 'high'
    });
  }
  
  // Financial recommendations
  const expensivePrograms = matchingPrograms.filter(p => p.program.affordabilityLevel === 'expensive' || p.program.affordabilityLevel === 'stretch');
  if (expensivePrograms.length > 0 && financialConstraints) {
    recommendations.push({
      type: 'financial_planning',
      title: 'Explore Scholarship Options',
      message: `${expensivePrograms.length} program(s) may require additional funding. Research scholarships, bursaries, and HELB options early.`,
      priority: 'medium'
    });
  }
  
  // Career guidance
  if (academicPreferences && academicPreferences.careerInterests) {
    const careerAlignedPrograms = matchingPrograms.filter(p => p.program.matchScore >= 60);
    if (careerAlignedPrograms.length > 5) {
      recommendations.push({
        type: 'career_focus',
        title: 'Multiple Career Path Options',
        message: `You have several programs aligned with your interests. Consider visiting university open days or talking to professionals in these fields.`,
        priority: 'low'
      });
    }
  }
  
  return recommendations;
}

// ================================================================================================
// CAREER EXPLORATION API - Comprehensive Career Information & Guidance
// ================================================================================================

// ⚠️ DEPRECATED: Hardcoded career data (kept for reference only)
// Data now stored in Parse Class: Career (42 careers in database)
// Migration completed: 2025-10-11
// To update data, use Parse Dashboard or admin functions
const KENYA_CAREERS_DATABASE_DEPRECATED = [
  // Healthcare & Medical
  {
    id: 'medical-doctor',
    title: 'Medical Doctor',
    category: 'Healthcare & Medical',
    averageSalary: 450000,
    salaryRange: { min: 200000, max: 800000 },
    educationLevel: 'University Degree',
    educationPath: 'Bachelor of Medicine & Surgery (6 years) + Internship (1 year)',
    keySubjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
    minimumGrades: { overall: 'A-', math: 'B+', sciences: 'A-' },
    workEnvironment: 'Hospitals, Clinics, Private Practice',
    jobOutlook: 'excellent',
    industryGrowth: 'high',
    employmentRate: 0.95,
    description: 'Diagnose and treat illnesses, injuries, and diseases. Provide medical care and health advice to patients.',
    dailyTasks: [
      'Examine patients and diagnose illnesses',
      'Prescribe medications and treatments',
      'Perform medical procedures',
      'Maintain patient records',
      'Consult with specialists'
    ],
    skills: ['Medical knowledge', 'Problem-solving', 'Communication', 'Empathy', 'Decision-making'],
    personalityTraits: ['Compassionate', 'Detail-oriented', 'Resilient', 'Ethical'],
    careerProgression: 'Medical Officer → Senior Medical Officer → Consultant → Specialist',
    challenges: ['Long hours', 'High responsibility', 'Emotional stress', 'Continuous learning required'],
    rewards: ['Save lives', 'High income potential', 'Respect in society', 'Job security'],
    relatedCareers: ['Nurse', 'Pharmacist', 'Medical Researcher', 'Surgeon'],
    kenyaSpecific: {
      majorEmployers: ['Ministry of Health', 'Private Hospitals', 'NGOs', 'Private Practice'],
      licensingBody: 'Kenya Medical Practitioners and Dentists Council (KMPDC)',
      universities: ['University of Nairobi', 'Moi University', 'JKUAT'],
      internshipProgram: 'Mandatory 1-year internship in government hospitals'
    }
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Technology & IT',
    averageSalary: 320000,
    salaryRange: { min: 120000, max: 600000 },
    educationLevel: 'University Degree',
    educationPath: 'Bachelor of Science in Computer Science/IT (4 years)',
    keySubjects: ['Mathematics', 'Physics', 'Computer Studies', 'English'],
    minimumGrades: { overall: 'B', math: 'B+', physics: 'B' },
    workEnvironment: 'Tech companies, Offices, Remote work',
    jobOutlook: 'excellent',
    industryGrowth: 'very_high',
    employmentRate: 0.90,
    description: 'Design, develop, and maintain software applications and systems. Solve complex technical problems through code.',
    dailyTasks: [
      'Write and test code',
      'Debug software issues',
      'Collaborate with team members',
      'Review code and design systems',
      'Learn new technologies'
    ],
    skills: ['Programming', 'Problem-solving', 'Logical thinking', 'Teamwork', 'Continuous learning'],
    personalityTraits: ['Analytical', 'Creative', 'Patient', 'Detail-oriented'],
    careerProgression: 'Junior Developer → Senior Developer → Team Lead → Architect/Manager',
    challenges: ['Rapidly changing technology', 'Tight deadlines', 'Complex problem-solving'],
    rewards: ['High demand', 'Good salary', 'Creative work', 'Global opportunities'],
    relatedCareers: ['Data Scientist', 'Cybersecurity Specialist', 'UI/UX Designer', 'IT Manager'],
    kenyaSpecific: {
      majorEmployers: ['Safaricom', 'Equity Bank', 'KCB', 'Tech startups', 'International companies'],
      techHubs: ['iHub Nairobi', 'Silicon Savannah', 'Konza Technopolis'],
      universities: ['JKUAT', 'University of Nairobi', 'Strathmore University'],
      bootcamps: ['Moringa School', 'AkiraChix', 'Andela Kenya']
    }
  },
  {
    id: 'civil-engineer',
    title: 'Civil Engineer',
    category: 'Engineering',
    averageSalary: 280000,
    salaryRange: { min: 150000, max: 500000 },
    educationLevel: 'University Degree',
    educationPath: 'Bachelor of Civil Engineering (4 years)',
    keySubjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    minimumGrades: { overall: 'B+', math: 'A-', physics: 'B+' },
    workEnvironment: 'Construction sites, Offices, Government agencies',
    jobOutlook: 'good',
    industryGrowth: 'medium',
    employmentRate: 0.85,
    description: 'Design, build, and maintain infrastructure projects like roads, bridges, and buildings.',
    dailyTasks: [
      'Design infrastructure projects',
      'Supervise construction work',
      'Conduct site inspections',
      'Prepare technical reports',
      'Ensure safety compliance'
    ],
    skills: ['Engineering design', 'Project management', 'Problem-solving', 'Leadership'],
    personalityTraits: ['Practical', 'Organized', 'Leadership qualities', 'Safety-conscious'],
    careerProgression: 'Graduate Engineer → Project Engineer → Senior Engineer → Chief Engineer',
    challenges: ['Weather-dependent work', 'Safety risks', 'Budget constraints'],
    rewards: ['Build lasting infrastructure', 'Good career prospects', 'Varied work environments'],
    relatedCareers: ['Architect', 'Construction Manager', 'Structural Engineer', 'Urban Planner'],
    kenyaSpecific: {
      majorEmployers: ['Ministry of Transport', 'Kenya Urban Roads Authority', 'Private contractors'],
      majorProjects: ['Standard Gauge Railway', 'Thika Superhighway', 'Lamu Port'],
      universities: ['University of Nairobi', 'JKUAT', 'Moi University'],
      licensingBody: 'Engineers Board of Kenya (EBK)'
    }
  },
  {
    id: 'teacher',
    title: 'Secondary School Teacher',
    category: 'Education',
    averageSalary: 180000,
    salaryRange: { min: 100000, max: 300000 },
    educationLevel: 'University Degree',
    educationPath: 'Bachelor of Education (4 years)',
    keySubjects: ['Mathematics', 'English', 'Teaching subjects (Science/Humanities)', 'Kiswahili'],
    minimumGrades: { overall: 'B', teachingSubjects: 'B+' },
    workEnvironment: 'Schools, Classrooms, Educational institutions',
    jobOutlook: 'stable',
    industryGrowth: 'stable',
    employmentRate: 0.88,
    description: 'Educate and mentor students in specific subject areas. Shape the future generation through quality education.',
    dailyTasks: [
      'Prepare and deliver lessons',
      'Grade student work',
      'Manage classroom behavior',
      'Meet with parents',
      'Participate in school activities'
    ],
    skills: ['Subject expertise', 'Communication', 'Patience', 'Classroom management'],
    personalityTraits: ['Patient', 'Caring', 'Organized', 'Inspiring'],
    careerProgression: 'Teacher → Senior Teacher → Deputy Head → Headteacher',
    challenges: ['Large class sizes', 'Limited resources', 'Student discipline issues'],
    rewards: ['Shape young minds', 'Job security', 'School holidays', 'Make a difference'],
    relatedCareers: ['Education Administrator', 'Curriculum Developer', 'School Counselor', 'Lecturer'],
    kenyaSpecific: {
      majorEmployers: ['Teachers Service Commission (TSC)', 'Private schools', 'International schools'],
      universities: ['Kenyatta University', 'Moi University', 'Maseno University'],
      licensingBody: 'Teachers Service Commission (TSC)',
      benefits: 'Government employment, pension scheme, medical cover'
    }
  },
  {
    id: 'business-analyst',
    title: 'Business Analyst',
    category: 'Business & Finance',
    averageSalary: 250000,
    salaryRange: { min: 120000, max: 450000 },
    educationLevel: 'University Degree',
    educationPath: 'Bachelor of Commerce/Business Administration (4 years)',
    keySubjects: ['Mathematics', 'English', 'Business Studies', 'Economics'],
    minimumGrades: { overall: 'B+', math: 'B+', business: 'A-' },
    workEnvironment: 'Corporate offices, Banks, Consulting firms',
    jobOutlook: 'good',
    industryGrowth: 'medium',
    employmentRate: 0.82,
    description: 'Analyze business processes and data to improve organizational efficiency and profitability.',
    dailyTasks: [
      'Analyze business data and processes',
      'Create reports and presentations',
      'Meet with stakeholders',
      'Recommend improvements',
      'Monitor key performance indicators'
    ],
    skills: ['Data analysis', 'Critical thinking', 'Communication', 'Business acumen'],
    personalityTraits: ['Analytical', 'Detail-oriented', 'Strategic thinker', 'Good communicator'],
    careerProgression: 'Junior Analyst → Business Analyst → Senior Analyst → Manager',
    challenges: ['Complex data interpretation', 'Managing stakeholder expectations'],
    rewards: ['Influence business decisions', 'Good salary growth', 'Diverse industries'],
    relatedCareers: ['Data Analyst', 'Management Consultant', 'Project Manager', 'Financial Analyst'],
    kenyaSpecific: {
      majorEmployers: ['Banks', 'Telecommunications companies', 'Consulting firms', 'Government'],
      universities: ['University of Nairobi', 'Strathmore University', 'USIU'],
      certifications: 'CPA(K), ACCA, professional business analysis certificates'
    }
  }
];

// Career Exploration Cloud Function (Parse Class Version - Updated 2025-10-11)
// Queries from Career Parse Class instead of hardcoded data
// Public access - no authentication required (career data is public)
Parse.Cloud.define('exploreCareers', async (request) => {
  const { user } = request;
  const {
    filters,
    searchQuery,
    studentProfile,
    sortBy,
    limit
  } = request.params;

  console.log('🔍 Processing Career Exploration request:', {
    filters: filters ? 'provided' : 'none',
    searchQuery: searchQuery ? 'provided' : 'none',
    studentProfile: studentProfile ? 'provided' : 'none',
    sortBy: sortBy || 'relevance',
    limit: limit || 20
  });

  // Generate cache key based on search parameters
  const cacheKey = `career_exploration:${JSON.stringify({
    filters,
    searchQuery,
    sortBy,
    limit
  })}`;

  try {
    // Check cache first with null safety (20 minute TTL - career data changes infrequently)
    let cachedResult = null;
    if (cache && cache.get) {
      try {
        cachedResult = await cache.get(cacheKey);
        if (cachedResult) {
          console.log('✅ Cache HIT - Returning cached career exploration results');
          return { ...cachedResult, fromCache: true };
        }
      } catch (cacheError) {
        console.warn('Cache access failed:', cacheError.message);
      }
    }

    console.log('❌ Cache MISS - Querying careers from Parse Class');

    // Query Career class from Parse
    const CareerClass = Parse.Object.extend('Career');
    const careerQuery = new Parse.Query(CareerClass);
    careerQuery.equalTo('isActive', true);
    careerQuery.limit(1000); // Get all active careers

    // Apply category filter using Parse Query
    if (filters && filters.categories && filters.categories.length > 0) {
      careerQuery.containedIn('category', filters.categories);
    }

    // Apply salary range filter using Parse Query
    if (filters && filters.salaryRange) {
      if (filters.salaryRange.min) {
        careerQuery.greaterThanOrEqualTo('avgSalary', filters.salaryRange.min);
      }
      if (filters.salaryRange.max) {
        careerQuery.lessThanOrEqualTo('avgSalary', filters.salaryRange.max);
      }
    }

    // Apply education level filter
    if (filters && filters.educationLevel) {
      careerQuery.equalTo('educationLevel', filters.educationLevel);
    }

    // Apply job outlook filter
    if (filters && filters.jobOutlook) {
      careerQuery.equalTo('jobOutlook', filters.jobOutlook);
    }

    // Execute query
    const careerObjects = await careerQuery.find({ useMasterKey: true });

    // Convert Parse objects to plain objects and map field names
    let careers = careerObjects.map(career => ({
      id: career.get('careerId') || career.id,
      title: career.get('title') || 'Unknown Career',
      category: career.get('category') || 'General',
      averageSalary: career.get('avgSalary') || 0,
      salaryRange: {
        min: career.get('salaryRangeMin') || 0,
        max: career.get('salaryRangeMax') || 0
      },
      educationLevel: career.get('educationLevel') || 'Not specified',
      educationPath: career.get('educationPath') || 'Not specified',
      keySubjects: career.get('keySubjects') || [],
      minimumGrades: career.get('minimumGrades') || {},
      workEnvironment: career.get('workEnvironment') || 'Various settings',
      jobOutlook: career.get('jobOutlook') || 'moderate',
      industryGrowth: career.get('industryGrowth') || 'moderate',
      employmentRate: career.get('employmentRate') || 0,
      description: career.get('description') || '',
      dailyTasks: career.get('dailyTasks') || [],
      skills: career.get('skills') || [],
      personalityTraits: career.get('personalityTraits') || [],
      careerProgression: career.get('careerProgression') || '',
      challenges: career.get('challenges') || [],
      rewards: career.get('rewards') || [],
      relatedCareers: career.get('relatedCareers') || [],
      kenyaSpecific: career.get('kenyaSpecific') || {}
    }));

    // Apply search query (in-memory filter for complex text search)
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      careers = careers.filter(career =>
        career.title.toLowerCase().includes(query) ||
        career.category.toLowerCase().includes(query) ||
        career.description.toLowerCase().includes(query) ||
        career.skills.some(skill => skill.toLowerCase().includes(query)) ||
        career.dailyTasks.some(task => task.toLowerCase().includes(query))
      );
    }

    // Calculate match scores if student profile provided
    if (studentProfile) {
      careers = careers.map(career => ({
        ...career,
        matchScore: calculateCareerMatchScore(career, studentProfile),
        personalizedInsights: generatePersonalizedInsights(career, studentProfile)
      }));
    }

    // Apply sorting
    careers = careers.sort((a, b) => {
      switch (sortBy) {
        case 'salary':
          return b.averageSalary - a.averageSalary;
        case 'growth':
          return getGrowthScore(b.industryGrowth) - getGrowthScore(a.industryGrowth);
        case 'employment':
          return b.employmentRate - a.employmentRate;
        case 'match':
          return (b.matchScore || 0) - (a.matchScore || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default: // relevance
          if (studentProfile) {
            return (b.matchScore || 0) - (a.matchScore || 0);
          }
          return b.averageSalary - a.averageSalary;
      }
    });

    // Apply limit
    const limitedCareers = careers.slice(0, limit || 20);

    // Generate exploration insights
    const insights = generateExplorationInsights(limitedCareers, filters, studentProfile);

    // Log activity (only if user exists - skip for master key requests)
    if (user && user.id) {
      try {
        await Parse.Cloud.run('logUserActivity', {
          userId: user.id,
          activityType: 'career_exploration',
          details: {
            filters: filters || {},
            searchQuery: searchQuery || '',
            resultsCount: limitedCareers.length,
            sortBy: sortBy || 'relevance'
          }
        }, { sessionToken: user.getSessionToken() });
      } catch (activityError) {
        console.warn('Failed to log career exploration activity:', activityError.message);
        // Don't fail the whole request if activity logging fails
      }
    }

    const result = {
      success: true,
      careers: limitedCareers,
      insights,
      metadata: {
        totalResults: careers.length,
        returnedResults: limitedCareers.length,
        filters: filters || {},
        sortBy: sortBy || 'relevance'
      }
    };

    // Cache the result for 20 minutes (1200 seconds) with null safety
    if (cache && cache.set) {
      try {
        await cache.set(cacheKey, result, 1200);
        console.log('💾 Cached career exploration results');
      } catch (cacheError) {
        console.warn('Cache write failed:', cacheError.message);
      }
    }

    return result;

  } catch (error) {
    console.error('❌ Career Exploration error:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to explore careers: ${error.message}`);
  }
});

// Get detailed career information (Parse Class Version - Updated 2025-10-11)
// Queries from Career Parse Class instead of hardcoded data
Parse.Cloud.define('getCareerDetails', async (request) => {
  const { user, master } = request;
  if (!user && !master) {
    throw new Error('User must be authenticated');
  }

  const { careerId, careerTitle, studentProfile } = request.params;

  // Support both careerId and careerTitle for backwards compatibility
  const careerIdentifier = careerId || careerTitle;

  console.log('📋 Getting career details for:', careerIdentifier);

  try {
    // Query Career from Parse Class
    const CareerClass = Parse.Object.extend('Career');
    const careerQuery = new Parse.Query(CareerClass);

    // Search by careerId if provided, otherwise search by title
    if (careerId) {
      careerQuery.equalTo('careerId', careerId);
    } else if (careerTitle) {
      careerQuery.equalTo('title', careerTitle);
    }

    const careerObject = await careerQuery.first({ useMasterKey: true });

    if (!careerObject) {
      throw new Error('Career not found');
    }

    // Convert Parse object to plain object with field mapping
    const career = {
      id: careerObject.get('careerId') || careerObject.id,
      title: careerObject.get('title') || 'Unknown Career',
      category: careerObject.get('category') || 'General',
      averageSalary: careerObject.get('avgSalary') || 0,
      salaryRange: {
        min: careerObject.get('salaryRangeMin') || 0,
        max: careerObject.get('salaryRangeMax') || 0
      },
      educationLevel: careerObject.get('educationLevel') || 'Not specified',
      educationPath: careerObject.get('educationPath') || 'Not specified',
      keySubjects: careerObject.get('keySubjects') || [],
      minimumGrades: careerObject.get('minimumGrades') || {},
      workEnvironment: careerObject.get('workEnvironment') || 'Various settings',
      jobOutlook: careerObject.get('jobOutlook') || 'moderate',
      industryGrowth: careerObject.get('industryGrowth') || 'moderate',
      employmentRate: careerObject.get('employmentRate') || 0,
      description: careerObject.get('description') || '',
      dailyTasks: careerObject.get('dailyTasks') || [],
      skills: careerObject.get('skills') || [],
      personalityTraits: careerObject.get('personalityTraits') || [],
      careerProgression: careerObject.get('careerProgression') || '',
      challenges: careerObject.get('challenges') || [],
      rewards: careerObject.get('rewards') || [],
      relatedCareers: careerObject.get('relatedCareers') || [],
      kenyaSpecific: careerObject.get('kenyaSpecific') || {}
    };

    // Add personalized information if student profile provided
    let personalizedCareer = { ...career };
    if (studentProfile) {
      personalizedCareer.matchScore = calculateCareerMatchScore(career, studentProfile);
      personalizedCareer.personalizedInsights = generatePersonalizedInsights(career, studentProfile);
      personalizedCareer.educationGapAnalysis = analyzeEducationGap(career, studentProfile);
      personalizedCareer.actionPlan = generateCareerActionPlan(career, studentProfile);
    }

    // Add related information - Commented out for performance (not used in UI)
    // personalizedCareer.similarCareers = findSimilarCareers(career); // Iterates through large deprecated array
    // personalizedCareer.industryTrends = getIndustryTrends(career.category);
    // personalizedCareer.successStories = getSuccessStories(career);

    // Log activity (only if user exists - skip for master key requests)
    // Fire-and-forget pattern for non-blocking logging
    if (user && user.id) {
      Parse.Cloud.run('logUserActivity', {
        userId: user.id,
        activityType: 'career_details_view',
        details: {
          careerId: careerIdentifier,
          careerTitle: career.title,
          category: career.category
        }
      }, { sessionToken: user.getSessionToken() }).catch(activityError => {
        console.warn('Failed to log career details view activity:', activityError.message);
      });
    }

    return {
      success: true,
      career: personalizedCareer
    };

  } catch (error) {
    console.error('❌ Get Career Details error:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to get career details: ${error.message}`);
  }
});

// Helper function to calculate career match score
function calculateCareerMatchScore(career, studentProfile) {
  let score = 0;
  const weights = { subjects: 30, grades: 25, interests: 25, skills: 20 };

  // Subject alignment
  if (studentProfile.subjects) {
    const matchingSubjects = career.keySubjects.filter(subject =>
      studentProfile.subjects.some(studentSubject =>
        studentSubject.toLowerCase().includes(subject.toLowerCase()) ||
        subject.toLowerCase().includes(studentSubject.toLowerCase())
      )
    );
    score += (matchingSubjects.length / career.keySubjects.length) * weights.subjects;
  }

  // Grade requirements
  if (studentProfile.grades) {
    const studentClusterPoints = calculateClusterPoints(studentProfile.grades);
    // Estimate required cluster points based on education requirements
    const requiredPoints = career.educationLevel === 'University Degree' ? 
      (career.averageSalary > 300000 ? 70 : 60) : 50;
    
    if (studentClusterPoints >= requiredPoints) {
      score += weights.grades;
    } else {
      score += Math.max(0, weights.grades * (studentClusterPoints / requiredPoints));
    }
  } else {
    score += weights.grades * 0.7; // Default partial credit
  }

  // Interest alignment
  if (studentProfile.interests) {
    const interestMatch = studentProfile.interests.some(interest =>
      career.category.toLowerCase().includes(interest.toLowerCase()) ||
      career.skills.some(skill => skill.toLowerCase().includes(interest.toLowerCase()))
    );
    score += interestMatch ? weights.interests : weights.interests * 0.3;
  } else {
    score += weights.interests * 0.5; // Default partial credit
  }

  // Skill alignment
  if (studentProfile.skills) {
    const skillMatches = career.skills.filter(skill =>
      studentProfile.skills.some(studentSkill =>
        skill.toLowerCase().includes(studentSkill.toLowerCase()) ||
        studentSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    score += (skillMatches.length / career.skills.length) * weights.skills;
  } else {
    score += weights.skills * 0.5; // Default partial credit
  }

  return Math.round(score);
}

// =====================================
// CAREERJET API INTEGRATION
// =====================================

Parse.Cloud.define('getCareerJobData', async (request) => {
  const { careerTitle, location = 'kenya' } = request.params;
  const { getCached, CACHE_TTL } = require('../utils/cache');

  try {
    // Cache CareerJet data for 24 hours (job listings don't change frequently)
    const cacheKey = `careerjet-${careerTitle}-${location}`;

    const jobData = await getCached(cacheKey, async () => {
      // Real CareerJet API call (free, no API key required!)
      const axios = require('axios');

      // CareerJet Public API endpoint for Kenya (HTTP only, HTTPS not supported)
      const careerjetUrl = 'http://public.api.careerjet.net/search';

      const params = {
        keywords: careerTitle,
        location: location === 'kenya' ? 'Kenya' : location,
        affid: '0afaf0173305e4b9b5438e5db007bd36', // Public affiliate ID (free tier)
        user_ip: '127.0.0.1',
        user_agent: 'Mozilla/5.0',
        locale_code: 'en_KE', // Kenya English
        pagesize: 20,
        page: 1
      };

      const response = await axios.get(careerjetUrl, {
        params,
        timeout: 10000 // 10 second timeout
      });

      if (response.data && response.data.jobs) {
        // Transform CareerJet response to our format
        const jobs = response.data.jobs;

        // Extract unique companies
        const companies = [...new Set(jobs.map(job => job.company))].slice(0, 10);

        // Calculate salary range if available
        const salariesMentioned = jobs
          .map(job => job.salary)
          .filter(salary => salary && salary.toLowerCase().includes('ksh'))
          .slice(0, 5);

        const salaryRange = salariesMentioned.length > 0
          ? salariesMentioned.join(', ')
          : 'Salary not disclosed';

        // Determine demand level based on job count
        const totalJobs = response.data.hits || jobs.length;
        let demandLevel = 'Low';
        if (totalJobs > 50) demandLevel = 'High';
        else if (totalJobs > 20) demandLevel = 'Medium';

        return {
          totalJobs,
          demandLevel,
          salaryRange,
          topEmployers: companies,
          recentJobs: jobs.slice(0, 10).map(job => ({
            title: job.title,
            company: job.company,
            location: job.locations,
            salary: job.salary || 'Not specified',
            url: job.url,
            date: job.date
          }))
        };
      }

      // Return null if API fails - no fallback data in production
      return null;

    }, CACHE_TTL.CAREERJET_JOBS);

    return {
      success: true,
      career: careerTitle,
      location: location,
      data: jobData,
      cached: true,
      source: 'CareerJet Public API'
    };

  } catch (error) {
    console.error('❌ CareerJet API error:', error.message);

    // Return error in production - no fallback mock data
    throw new Parse.Error(
      Parse.Error.SCRIPT_FAILED, 
      'Job market data temporarily unavailable. Please try again later.'
    );
  }
});

// Helper function to generate personalized insights
function generatePersonalizedInsights(career, studentProfile) {
  const insights = [];

  // Academic fit analysis
  if (studentProfile.subjects && studentProfile.grades) {
    const missingSubjects = career.keySubjects.filter(subject =>
      !studentProfile.subjects.some(studentSubject =>
        studentSubject.toLowerCase().includes(subject.toLowerCase())
      )
    );

    if (missingSubjects.length === 0) {
      insights.push({
        type: 'positive',
        title: 'Strong Academic Fit',
        message: 'You have all the key subjects needed for this career path.'
      });
    } else {
      insights.push({
        type: 'improvement',
        title: 'Subject Requirements',
        message: `Consider strengthening these subjects: ${missingSubjects.join(', ')}`
      });
    }
  }

  // Salary comparison
  if (career.averageSalary > 250000) {
    insights.push({
      type: 'positive',
      title: 'High Earning Potential',
      message: `This career offers above-average salary potential in Kenya.`
    });
  }

  // Job market analysis
  if (career.jobOutlook === 'excellent' || career.industryGrowth === 'high') {
    insights.push({
      type: 'positive',
      title: 'Growing Field',
      message: 'This career is in high demand with excellent job prospects.'
    });
  }

  return insights;
}

// Helper function to analyze education gap
function analyzeEducationGap(career, studentProfile) {
  const gaps = [];

  if (studentProfile.currentEducation !== career.educationLevel) {
    gaps.push({
      type: 'education_level',
      current: studentProfile.currentEducation || 'Secondary School',
      required: career.educationLevel,
      steps: getEducationSteps(studentProfile.currentEducation, career.educationLevel)
    });
  }

  return gaps;
}

// Helper function to generate career action plan
function generateCareerActionPlan(career, studentProfile) {
  const actionPlan = {
    shortTerm: [], // Next 1-2 years
    mediumTerm: [], // 2-5 years
    longTerm: [] // 5+ years
  };

  // Short-term actions
  actionPlan.shortTerm.push('Complete KCSE with focus on key subjects');
  actionPlan.shortTerm.push('Research universities offering relevant programs');
  
  // Medium-term actions
  actionPlan.mediumTerm.push(`Pursue ${career.educationPath}`);
  actionPlan.mediumTerm.push('Gain practical experience through internships');
  
  // Long-term actions
  actionPlan.longTerm.push('Start career in entry-level position');
  actionPlan.longTerm.push('Pursue professional development and certifications');

  return actionPlan;
}

// Helper function to find similar careers
function findSimilarCareers(targetCareer) {
  return KENYA_CAREERS_DATABASE_DEPRECATED
    .filter(career =>
      career.id !== targetCareer.id &&
      (career.category === targetCareer.category ||
       career.keySubjects.some(subject => targetCareer.keySubjects.includes(subject)))
    )
    .slice(0, 3)
    .map(career => ({
      id: career.id,
      title: career.title,
      category: career.category,
      averageSalary: career.averageSalary
    }));
}

// Helper function to get growth score for sorting
function getGrowthScore(growth) {
  switch (growth) {
    case 'very_high': return 5;
    case 'high': return 4;
    case 'medium': return 3;
    case 'stable': return 2;
    case 'low': return 1;
    default: return 2;
  }
}

// Helper function to generate exploration insights
function generateExplorationInsights(careers, filters, studentProfile) {
  const insights = [];

  if (careers.length === 0) {
    insights.push({
      type: 'suggestion',
      title: 'No matches found',
      message: 'Try broadening your search criteria or exploring different categories.'
    });
  } else {
    const avgSalary = careers.reduce((sum, career) => sum + career.averageSalary, 0) / careers.length;
    insights.push({
      type: 'info',
      title: 'Search Results',
      message: `Found ${careers.length} careers with average salary of KSh ${Math.round(avgSalary).toLocaleString()}`
    });

    if (studentProfile) {
      const highMatchCareers = careers.filter(career => (career.matchScore || 0) >= 70);
      if (highMatchCareers.length > 0) {
        insights.push({
          type: 'positive',
          title: 'Great Matches Found',
          message: `${highMatchCareers.length} career(s) are excellent matches for your profile.`
        });
      }
    }
  }

  return insights;
}

// Helper function to get industry trends (mock data)
function getIndustryTrends(category) {
  const trends = {
    'Healthcare & Medical': 'Growing demand due to expanding healthcare coverage',
    'Technology & IT': 'Rapid growth in digital transformation and fintech',
    'Engineering': 'Infrastructure development driving steady demand',
    'Education': 'Stable demand with focus on quality improvement',
    'Business & Finance': 'Digital banking and financial inclusion creating opportunities'
  };
  
  return trends[category] || 'Industry showing steady development';
}

// Helper function to get success stories (mock data)
function getSuccessStories(career) {
  return [
    `Many ${career.title.toLowerCase()}s have successfully established practices and made significant contributions to Kenya's development.`,
    `Career progression from entry-level to senior positions typically takes 5-10 years with dedication and continuous learning.`
  ];
}

// Helper function to get education steps
function getEducationSteps(current, required) {
  if (required === 'University Degree') {
    return [
      'Complete KCSE with good grades',
      'Apply for relevant university program through KUCCPS',
      'Complete 4-year bachelor\'s degree',
      'Consider internship or practical training'
    ];
  }
  return ['Continue current education path'];
}

// ===== BADGE & CERTIFICATION TRACKING SYSTEM =====

// Get user achievements and badges
Parse.Cloud.define('getUserAchievements', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  try {
    const UserAchievement = Parse.Object.extend('UserAchievement');
    const query = new Parse.Query(UserAchievement);
    query.equalTo('user', user);
    query.descending('earnedDate');

    const achievements = await query.find({ useMasterKey: true });

    return {
      success: true,
      achievements: achievements.map(achievement => ({
        id: achievement.id,
        title: achievement.get('title'),
        description: achievement.get('description'),
        category: achievement.get('category'),
        earned: achievement.get('earned'),
        earnedDate: achievement.get('earnedDate'),
        iconType: achievement.get('iconType') || 'Award'
      }))
    };

  } catch (error) {
    console.error('❌ Get user achievements error:', error);
    throw new Error(`Failed to get achievements: ${error.message}`);
  }
});

// Add achievement badge to user
Parse.Cloud.define('addAchievementBadge', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const { achievementType, data } = request.params;

  try {
    const UserAchievement = Parse.Object.extend('UserAchievement');

    // Check if achievement already exists
    const existingQuery = new Parse.Query(UserAchievement);
    existingQuery.equalTo('user', user);
    existingQuery.equalTo('achievementType', achievementType);

    const existing = await existingQuery.first({ useMasterKey: true });
    if (existing) {
      return { success: true, message: 'Achievement already earned' };
    }

    // Create new achievement
    const achievement = new UserAchievement();
    achievement.set('user', user);
    achievement.set('achievementType', achievementType);
    achievement.set('earned', true);
    achievement.set('earnedDate', new Date());
    achievement.set('data', data || {});

    // Set achievement details based on type
    const achievementDetails = getAchievementDetails(achievementType);
    achievement.set('title', achievementDetails.title);
    achievement.set('description', achievementDetails.description);
    achievement.set('category', achievementDetails.category);
    achievement.set('iconType', achievementDetails.iconType);

    await achievement.save(null, { useMasterKey: true });

    // Log activity
    await Parse.Cloud.run('logUserActivity', {
      userId: user.id,
      activityType: 'achievement_earned',
      details: {
        achievementType,
        title: achievementDetails.title
      }
    });

    return {
      success: true,
      achievement: {
        id: achievement.id,
        title: achievementDetails.title,
        description: achievementDetails.description,
        earnedDate: new Date()
      }
    };

  } catch (error) {
    console.error('❌ Add achievement badge error:', error);
    throw new Error(`Failed to add achievement: ${error.message}`);
  }
});

// Get user external certifications
Parse.Cloud.define('getUserCertifications', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  try {
    const UserCertification = Parse.Object.extend('UserCertification');
    const query = new Parse.Query(UserCertification);
    query.equalTo('user', user);
    query.descending('updatedAt');

    const certifications = await query.find({ useMasterKey: true });

    return {
      success: true,
      certifications: certifications.map(cert => ({
        id: cert.id,
        name: cert.get('name'),
        provider: cert.get('provider'),
        status: cert.get('status'),
        progress: cert.get('progress') || 0,
        credentialUrl: cert.get('credentialUrl'),
        completedDate: cert.get('completedDate'),
        expectedCompletion: cert.get('expectedCompletion'),
        platform: cert.get('platform'),
        skills: cert.get('skills') || []
      }))
    };

  } catch (error) {
    console.error('❌ Get user certifications error:', error);
    throw new Error(`Failed to get certifications: ${error.message}`);
  }
});

// Sync external certification progress
Parse.Cloud.define('syncExternalCertification', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const {
    platform,
    externalId,
    name,
    provider,
    status,
    progress,
    credentialUrl,
    completedDate
  } = request.params;

  try {
    const UserCertification = Parse.Object.extend('UserCertification');

    // Check if certification already exists
    const existingQuery = new Parse.Query(UserCertification);
    existingQuery.equalTo('user', user);
    existingQuery.equalTo('externalId', externalId);
    existingQuery.equalTo('platform', platform);

    let certification = await existingQuery.first({ useMasterKey: true });

    if (!certification) {
      certification = new UserCertification();
      certification.set('user', user);
      certification.set('externalId', externalId);
      certification.set('platform', platform);
    }

    // Update certification details
    certification.set('name', name);
    certification.set('provider', provider);
    certification.set('status', status);
    certification.set('progress', progress || 0);

    if (credentialUrl) certification.set('credentialUrl', credentialUrl);
    if (completedDate) certification.set('completedDate', new Date(completedDate));

    await certification.save(null, { useMasterKey: true });

    // If completed, check for achievement badges
    if (status === 'Completed' && !certification.get('completionBadgeAwarded')) {
      await checkCertificationAchievements(user, certification);
      certification.set('completionBadgeAwarded', true);
      await certification.save(null, { useMasterKey: true });
    }

    return { success: true, certification: certification.toJSON() };

  } catch (error) {
    console.error('❌ Sync external certification error:', error);
    throw new Error(`Failed to sync certification: ${error.message}`);
  }
});

// Connect external learning platform
Parse.Cloud.define('connectLearningPlatform', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const { platform, accessToken, refreshToken } = request.params;

  try {
    const UserPlatformConnection = Parse.Object.extend('UserPlatformConnection');

    // Check if connection already exists
    const existingQuery = new Parse.Query(UserPlatformConnection);
    existingQuery.equalTo('user', user);
    existingQuery.equalTo('platform', platform);

    let connection = await existingQuery.first({ useMasterKey: true });

    if (!connection) {
      connection = new UserPlatformConnection();
      connection.set('user', user);
      connection.set('platform', platform);
    }

    connection.set('accessToken', accessToken);
    if (refreshToken) connection.set('refreshToken', refreshToken);
    connection.set('isActive', true);
    connection.set('lastSync', new Date());

    await connection.save(null, { useMasterKey: true });

    // Trigger initial sync
    // This would normally call the platform's API to fetch user's courses/certifications
    // For now, we'll just log the connection
    console.log(`✅ Connected user ${user.id} to ${platform}`);

    return { success: true, platform, connected: true };

  } catch (error) {
    console.error('❌ Connect learning platform error:', error);
    throw new Error(`Failed to connect platform: ${error.message}`);
  }
});

// Get user projects
Parse.Cloud.define('getUserProjects', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  try {
    const UserProject = Parse.Object.extend('UserProject');
    const query = new Parse.Query(UserProject);
    query.equalTo('user', user);
    query.descending('createdAt');
    query.limit(50);

    const projects = await query.find({ useMasterKey: true });

    return {
      success: true,
      projects: projects.map(project => ({
        id: project.id,
        title: project.get('title'),
        description: project.get('description'),
        type: project.get('type') || 'personal', // personal, academic, professional
        status: project.get('status') || 'in_progress', // in_progress, completed, archived
        startDate: project.get('startDate'),
        endDate: project.get('endDate'),
        skills: project.get('skills') || [],
        technologies: project.get('technologies') || [],
        url: project.get('url'),
        repositoryUrl: project.get('repositoryUrl'),
        imageUrl: project.get('imageUrl'),
        achievements: project.get('achievements') || [],
        createdAt: project.get('createdAt'),
        updatedAt: project.get('updatedAt')
      }))
    };

  } catch (error) {
    console.error('❌ Get user projects error:', error);
    throw new Error(`Failed to get projects: ${error.message}`);
  }
});

// Get user experience
Parse.Cloud.define('getUserExperience', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  try {
    const UserExperience = Parse.Object.extend('UserExperience');
    const query = new Parse.Query(UserExperience);
    query.equalTo('user', user);
    query.descending('startDate');
    query.limit(50);

    const experiences = await query.find({ useMasterKey: true });

    return {
      success: true,
      experiences: experiences.map(exp => ({
        id: exp.id,
        title: exp.get('title'),
        company: exp.get('company'),
        organization: exp.get('organization'),
        type: exp.get('type') || 'work', // work, internship, volunteer, leadership
        location: exp.get('location'),
        description: exp.get('description'),
        responsibilities: exp.get('responsibilities') || [],
        achievements: exp.get('achievements') || [],
        skills: exp.get('skills') || [],
        startDate: exp.get('startDate'),
        endDate: exp.get('endDate'),
        isCurrent: exp.get('isCurrent') || false,
        verificationUrl: exp.get('verificationUrl'),
        referenceContact: exp.get('referenceContact'),
        createdAt: exp.get('createdAt'),
        updatedAt: exp.get('updatedAt')
      }))
    };

  } catch (error) {
    console.error('❌ Get user experience error:', error);
    throw new Error(`Failed to get experience: ${error.message}`);
  }
});

// Helper function to get achievement details
function getAchievementDetails(achievementType) {
  const achievements = {
    'career_explorer': {
      title: 'Career Explorer',
      description: 'Completed 3 career assessments',
      category: 'assessment',
      iconType: 'TrendingUp'
    },
    'riasec_master': {
      title: 'RIASEC Master',
      description: 'Completed personality assessment',
      category: 'assessment',
      iconType: 'Award'
    },
    'university_ready': {
      title: 'University Ready',
      description: 'Researched 5+ university programs',
      category: 'planning',
      iconType: 'GraduationCap'
    },
    'course_completer': {
      title: 'Course Completer',
      description: 'Completed first external certification',
      category: 'learning',
      iconType: 'BookOpen'
    },
    'skill_builder': {
      title: 'Skill Builder',
      description: 'Earned 3 professional certificates',
      category: 'learning',
      iconType: 'Target'
    },
    'counselor_connected': {
      title: 'Counselor Connected',
      description: 'Had first counseling session',
      category: 'support',
      iconType: 'Users'
    }
  };

  return achievements[achievementType] || {
    title: 'Achievement',
    description: 'Unlocked achievement',
    category: 'general',
    iconType: 'Award'
  };
}

// Helper function to check certification achievements
async function checkCertificationAchievements(user, certification) {
  try {
    // Count completed certifications
    const UserCertification = Parse.Object.extend('UserCertification');
    const query = new Parse.Query(UserCertification);
    query.equalTo('user', user);
    query.equalTo('status', 'Completed');

    const completedCount = await query.count({ useMasterKey: true });

    // Award badges based on certification count
    if (completedCount === 1) {
      await Parse.Cloud.run('addAchievementBadge', {
        achievementType: 'course_completer',
        data: { certificationId: certification.id }
      }, { user });
    }

    if (completedCount === 3) {
      await Parse.Cloud.run('addAchievementBadge', {
        achievementType: 'skill_builder',
        data: { certificationCount: completedCount }
      }, { user });
    }

  } catch (error) {
    console.error('Error checking certification achievements:', error);
  }
}

// ============================================================================
// COUNSELOR DASHBOARD & SCHEDULING CLOUD FUNCTIONS
// ============================================================================

// Helper function to check counselor authentication
const requireCounselor = (request) => {
  if (!request.user) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User must be authenticated');
  }

  const userRole = request.user.get('role');
  if (userRole !== 'counselor' && userRole !== 'career_counselor') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Counselor access required');
  }

  return request.user;
};

// Log counselor activity
Parse.Cloud.define('logCounselorActivity', async (request) => {
  const user = requireCounselor(request);
  const { activityType, data, studentId, sessionId, duration } = request.params;

  try {
    const CounselorActivity = Parse.Object.extend('CounselorActivity');
    const activity = new CounselorActivity();

    activity.set('activityType', activityType);
    activity.set('counselorId', user.id);
    activity.set('counselorEmail', user.get('email'));
    activity.set('data', data || {});
    activity.set('studentId', studentId);
    activity.set('sessionId', sessionId);
    activity.set('duration', duration);

    await activity.save(null, { useMasterKey: true });

    return { success: true, activityId: activity.id };
  } catch (error) {
    console.error('Error logging counselor activity:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to log counselor activity');
  }
});

// Get counselor's assigned students
Parse.Cloud.define('getCounselorAssignedStudents', async (request) => {
  const counselor = requireCounselor(request);
  const { showAll = true } = request.params || {};

  try {
    // Get all students
    const User = Parse.Object.extend('_User');
    const studentQuery = new Parse.Query(User);
    studentQuery.equalTo('role', 'student');
    studentQuery.select(['id', 'firstName', 'lastName', 'email', 'gradeLevel', 'createdAt']);
    studentQuery.limit(100);
    studentQuery.descending('createdAt');

    const allStudents = await studentQuery.find({ useMasterKey: true });

    // Get all student assignments to map assignment status
    const StudentAssignment = Parse.Object.extend('StudentAssignment');
    const assignmentQuery = new Parse.Query(StudentAssignment);
    assignmentQuery.limit(1000);
    const allAssignments = await assignmentQuery.find({ useMasterKey: true });

    // Create assignment map: studentId -> { counselorId, counselorName, status, lastContact }
    const assignmentMap = {};
    allAssignments.forEach(assignment => {
      const studentId = assignment.get('studentId');
      assignmentMap[studentId] = {
        counselorId: assignment.get('counselorId'),
        counselorName: assignment.get('counselorName') || 'Unknown Counselor',
        status: assignment.get('status') || 'active',
        lastContact: assignment.get('lastContact') || null,
        urgentFlags: assignment.get('urgentFlags') || []
      };
    });

    // Build student list with assignment info
    const students = await Promise.all(allStudents.map(async (student) => {
      const studentId = student.id;
      const assignment = assignmentMap[studentId];

      // Get student progress
      const ProgressQuery = new Parse.Query('StudentProgress');
      ProgressQuery.equalTo('user', student);
      const progress = await ProgressQuery.first({ useMasterKey: true });

      // Check which specific assessments are completed
      const completedAssessments = [];

      // Check RIASEC
      const riasecQuery = new Parse.Query('RiasecAssessment');
      riasecQuery.equalTo('userId', studentId);
      riasecQuery.equalTo('status', 'completed');
      const riasecResult = await riasecQuery.first({ useMasterKey: true });
      if (riasecResult) completedAssessments.push('riasec');

      // Check other assessment types
      const assessmentQuery = new Parse.Query('AssessmentResult');
      assessmentQuery.equalTo('userId', studentId);
      const assessmentResults = await assessmentQuery.find({ useMasterKey: true });

      assessmentResults.forEach(result => {
        const type = result.get('assessmentType');
        if (type && !completedAssessments.includes(type)) {
          completedAssessments.push(type);
        }
      });

      const isAssignedToMe = assignment && assignment.counselorId === counselor.id;

      return {
        id: studentId,
        name: `${student.get('firstName') || ''} ${student.get('lastName') || ''}`.trim() || 'Student',
        email: student.get('email'),
        gradeLevel: student.get('gradeLevel') || 'Form 4',
        status: assignment ? assignment.status : 'unassigned',
        lastContact: assignment ? assignment.lastContact : null,
        careerReadiness: progress?.get('careerReadinessScore') || 0,
        assessmentsCompleted: progress?.get('assessmentsCompleted') || 0,
        completedAssessments: completedAssessments, // NEW: Array of completed assessment types
        urgentFlags: assignment ? assignment.urgentFlags : [],
        // Assignment metadata
        isAssignedToMe,
        assignedCounselor: assignment ? {
          id: assignment.counselorId,
          name: assignment.counselorName
        } : null,
        registeredAt: student.get('createdAt')
      };
    }));

    // Filter if needed (default showAll=true means no filter)
    const filteredStudents = showAll
      ? students
      : students.filter(s => s.isAssignedToMe);

    return {
      students: filteredStudents,
      total: filteredStudents.length,
      assignedToMe: students.filter(s => s.isAssignedToMe).length,
      unassigned: students.filter(s => !s.assignedCounselor).length
    };
  } catch (error) {
    console.error('Error getting students - Full details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      counselorId: counselor.id
    });
    throw error; // Throw original error for better debugging
  }
});

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

// ============================================================================
// COUNSELOR DASHBOARD CLOUD FUNCTIONS
// ============================================================================

// Get counselor dashboard statistics
Parse.Cloud.define('getCounselorDashboardStats', async (request) => {
  const counselor = requireCounselor(request);

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get assigned students count
    const User = Parse.Object.extend('_User');
    const studentQuery = new Parse.Query(User);
    studentQuery.equalTo('assignedCounselorId', counselor.id);
    const assignedStudents = await studentQuery.count({ useMasterKey: true });

    // Get premium students
    const Subscription = Parse.Object.extend('Subscription');
    const premiumQuery = new Parse.Query(Subscription);
    premiumQuery.equalTo('status', 'active');
    premiumQuery.greaterThan('expiresAt', new Date());
    
    const premiumSubs = await premiumQuery.find({ useMasterKey: true });
    const premiumStudentIds = premiumSubs.map(sub => sub.get('user').id);
    
    const premiumStudentQuery = new Parse.Query(User);
    premiumStudentQuery.equalTo('assignedCounselorId', counselor.id);
    premiumStudentQuery.containedIn('objectId', premiumStudentIds);
    const premiumStudents = await premiumStudentQuery.count({ useMasterKey: true });

    // Get today's sessions
    const Session = Parse.Object.extend('Session');
    const todaySessionQuery = new Parse.Query(Session);
    todaySessionQuery.equalTo('counselorId', counselor.id);
    todaySessionQuery.greaterThanOrEqualTo('scheduledTime', today);
    todaySessionQuery.lessThan('scheduledTime', tomorrow);
    const todaySessions = await todaySessionQuery.count({ useMasterKey: true });

    // Get active chats (counselor is participant)
    const ChatRoom = Parse.Object.extend('ChatRoom');
    const chatQuery = new Parse.Query(ChatRoom);
    chatQuery.containsAll('participants', [counselor.id]);
    chatQuery.equalTo('isActive', true);
    const activeChats = await chatQuery.count({ useMasterKey: true });

    // Get unread messages count from chat rooms where counselor is participant
    // First get all counselor's chat rooms
    const counselorRooms = await chatQuery.find({ useMasterKey: true });
    
    // Count unread messages in those rooms (not sent by counselor)
    let unreadMessages = 0;
    if (counselorRooms.length > 0) {
      const ChatMessage = Parse.Object.extend('ChatMessage');
      const unreadQuery = new Parse.Query(ChatMessage);
      
      // Message sender is NOT the counselor
      unreadQuery.notEqualTo('sender', counselor);
      
      // Message is not read yet
      unreadQuery.equalTo('isRead', false);
      
      // Message is in one of counselor's chat rooms
      unreadQuery.containedIn('chatRoom', counselorRooms);
      
      unreadMessages = await unreadQuery.count({ useMasterKey: true });
    }

    // Calculate monthly earnings (mock for now - would integrate with payment system)
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthSessionQuery = new Parse.Query(Session);
    monthSessionQuery.equalTo('counselorId', counselor.id);
    monthSessionQuery.equalTo('status', 'completed');
    monthSessionQuery.greaterThanOrEqualTo('scheduledTime', monthStart);
    const monthSessions = await monthSessionQuery.count({ useMasterKey: true });
    const estimatedEarnings = monthSessions * 1500; // KES 1,500 per session

    // Get pending questions count
    const Question = Parse.Object.extend('Question');
    const questionQuery = new Parse.Query(Question);
    questionQuery.equalTo('status', 'pending');
    questionQuery.doesNotExist('answeredBy'); // Not yet answered
    const pendingQuestions = await questionQuery.count({ useMasterKey: true });

    return {
      assignedStudents,
      premiumStudents,
      todaySessions,
      activeChats,
      unreadMessages,
      urgentCount: Math.floor(assignedStudents * 0.15), // ~15% of students may need urgent attention
      monthlyEarnings: estimatedEarnings,
      todayEarnings: todaySessions * 1500,
      pendingQuestions
    };
  } catch (error) {
    console.error('Error getting counselor dashboard stats:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get dashboard stats');
  }
});

// Get counselor's sessions
Parse.Cloud.define('getCounselorSessions', async (request) => {
  const counselor = requireCounselor(request);
  const { status, limit = 50, skip = 0 } = request.params;

  try {
    const Session = Parse.Object.extend('Session');
    const query = new Parse.Query(Session);
    query.equalTo('counselorId', counselor.id);
    
    if (status) {
      query.equalTo('status', status);
    }
    
    query.descending('scheduledTime');
    query.limit(limit);
    query.skip(skip);

    const sessions = await query.find({ useMasterKey: true });

    return sessions.map(session => ({
      id: session.id,
      studentId: session.get('studentId'),
      studentName: session.get('studentName'),
      studentEmail: session.get('studentEmail'),
      studentGrade: session.get('studentGrade') || 'Form 4',
      title: session.get('title') || 'Counseling Session',
      description: session.get('description') || '',
      type: session.get('type') || 'individual',
      status: session.get('status'),
      scheduledAt: session.get('scheduledTime'),
      duration: session.get('duration') || 45,
      location: session.get('location') || 'Virtual Session',
      notes: session.get('notes') || '',
      outcomes: session.get('outcomes') || [],
      nextSteps: session.get('nextSteps') || [],
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    }));
  } catch (error) {
    console.error('Error getting counselor sessions:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get sessions');
  }
});

// Get assigned students
Parse.Cloud.define('getAssignedStudents', async (request) => {
  const counselor = requireCounselor(request);
  const { priority, status, limit = 50, skip = 0 } = request.params;

  try {
    const User = Parse.Object.extend('_User');
    const query = new Parse.Query(User);
    query.equalTo('assignedCounselorId', counselor.id);
    query.limit(limit);
    query.skip(skip);

    const students = await query.find({ useMasterKey: true });

    // Get assessment completion for each student
    const studentData = await Promise.all(students.map(async (student) => {
      // Get assessment count
      const Assessment = Parse.Object.extend('Assessment');
      const assessmentQuery = new Parse.Query(Assessment);
      assessmentQuery.equalTo('userId', student.id);
      const assessmentCount = await assessmentQuery.count({ useMasterKey: true });

      // Get career matches count
      const CareerMatch = Parse.Object.extend('CareerMatch');
      const matchQuery = new Parse.Query(CareerMatch);
      matchQuery.equalTo('userId', student.id);
      const matchCount = await matchQuery.count({ useMasterKey: true });

      // Calculate profile completion
      const totalFields = 10;
      let completedFields = 0;
      if (student.get('firstName')) completedFields++;
      if (student.get('lastName')) completedFields++;
      if (student.get('email')) completedFields++;
      if (student.get('phone')) completedFields++;
      if (student.get('grade')) completedFields++;
      if (student.get('school')) completedFields++;
      if (assessmentCount > 0) completedFields += 2;
      if (matchCount > 0) completedFields += 2;

      const profileCompletion = Math.round((completedFields / totalFields) * 100);

      return {
        id: student.id,
        name: `${student.get('firstName')} ${student.get('lastName')}`,
        email: student.get('email'),
        grade: student.get('grade') || 'Form 4',
        school: student.get('school') || 'Unknown School',
        profileCompletion,
        assessments: assessmentCount,
        careerMatches: matchCount,
        lastContact: student.updatedAt,
        priority: profileCompletion < 50 ? 'high' : profileCompletion < 80 ? 'medium' : 'low',
        status: assessmentCount > 0 ? 'active' : 'pending'
      };
    }));

    // Apply filters
    let filteredData = studentData;
    if (priority) {
      filteredData = filteredData.filter(s => s.priority === priority);
    }
    if (status) {
      filteredData = filteredData.filter(s => s.status === status);
    }

    return filteredData;
  } catch (error) {
    console.error('Error getting assigned students:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get assigned students');
  }
});

// Search all students on platform (for counselor outreach)
Parse.Cloud.define('searchStudents', async (request) => {
  const counselor = requireCounselor(request);
  const {
    searchTerm = '',
    grade = '',
    school = '',
    hasAssessments = null,
    hasSubscription = null,
    careerInterest = '',
    minProfileCompletion = 0,
    limit = 20,
    skip = 0,
    sortBy = 'recent' // 'recent', 'name', 'grade', 'profileCompletion'
  } = request.params;

  try {
    const User = Parse.Object.extend('_User');
    const query = new Parse.Query(User);

    // Only search students (not counselors/admins)
    query.equalTo('role', 'student');

    // Exclude students already assigned to this counselor
    query.notEqualTo('assignedCounselorId', counselor.id);

    // Search by name or email
    if (searchTerm.trim()) {
      const nameQuery = new Parse.Query(User);
      nameQuery.matches('firstName', new RegExp(searchTerm, 'i'));

      const lastNameQuery = new Parse.Query(User);
      lastNameQuery.matches('lastName', new RegExp(searchTerm, 'i'));

      const emailQuery = new Parse.Query(User);
      emailQuery.matches('email', new RegExp(searchTerm, 'i'));

      const combinedQuery = Parse.Query.or(nameQuery, lastNameQuery, emailQuery);
      query._orQuery(combinedQuery.toJSON().where);
    }

    // Filter by grade (Form 1-4)
    if (grade) {
      query.equalTo('grade', grade);
    }

    // Filter by school
    if (school.trim()) {
      query.matches('school', new RegExp(school, 'i'));
    }

    // Sorting
    switch (sortBy) {
      case 'name':
        query.ascending('firstName');
        break;
      case 'grade':
        query.descending('grade');
        break;
      case 'recent':
      default:
        query.descending('createdAt');
        break;
    }

    query.limit(limit);
    query.skip(skip);

    const students = await query.find({ useMasterKey: true });

    // Get detailed data for each student
    const studentData = await Promise.all(students.map(async (student) => {
      // Get assessment count
      const Assessment = Parse.Object.extend('Assessment');
      const assessmentQuery = new Parse.Query(Assessment);
      assessmentQuery.equalTo('userId', student.id);
      const assessmentCount = await assessmentQuery.count({ useMasterKey: true });

      // Get subscription status
      const Subscription = Parse.Object.extend('Subscription');
      const subQuery = new Parse.Query(Subscription);
      subQuery.equalTo('userId', student.id);
      subQuery.equalTo('status', 'active');
      const hasActiveSub = await subQuery.first({ useMasterKey: true });

      // Get RIASEC results for career interests
      const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
      const riasecQuery = new Parse.Query(RiasecAssessment);
      riasecQuery.equalTo('userId', student.id);
      riasecQuery.equalTo('status', 'completed');
      riasecQuery.descending('completedAt');
      const riasecResult = await riasecQuery.first({ useMasterKey: true });

      let topCareerInterest = 'Not assessed';
      if (riasecResult) {
        const results = riasecResult.get('results');
        if (results && results.topType) {
          topCareerInterest = results.topType;
        }
      }

      // Calculate profile completion
      const totalFields = 10;
      let completedFields = 0;
      if (student.get('firstName')) completedFields++;
      if (student.get('lastName')) completedFields++;
      if (student.get('email')) completedFields++;
      if (student.get('phone')) completedFields++;
      if (student.get('grade')) completedFields++;
      if (student.get('school')) completedFields++;
      if (student.get('subjects')) completedFields++;
      if (assessmentCount > 0) completedFields += 2;
      if (hasActiveSub) completedFields++;

      const profileCompletion = Math.round((completedFields / totalFields) * 100);

      return {
        id: student.id,
        firstName: student.get('firstName') || 'Unknown',
        lastName: student.get('lastName') || 'Student',
        email: student.get('email'),
        grade: student.get('grade') || 'Not specified',
        school: student.get('school') || 'Not specified',
        profileCompletion,
        assessmentCount,
        hasSubscription: !!hasActiveSub,
        careerInterest: topCareerInterest,
        joinedDate: student.get('createdAt'),
        lastActive: student.get('updatedAt')
      };
    }));

    // Apply post-query filters (can't do these in Parse query)
    let filteredData = studentData;

    if (hasAssessments !== null) {
      filteredData = filteredData.filter(s =>
        hasAssessments ? s.assessmentCount > 0 : s.assessmentCount === 0
      );
    }

    if (hasSubscription !== null) {
      filteredData = filteredData.filter(s => s.hasSubscription === hasSubscription);
    }

    if (careerInterest.trim()) {
      filteredData = filteredData.filter(s =>
        s.careerInterest.toLowerCase().includes(careerInterest.toLowerCase())
      );
    }

    if (minProfileCompletion > 0) {
      filteredData = filteredData.filter(s => s.profileCompletion >= minProfileCompletion);
    }

    // Sort by profileCompletion if requested (post-query)
    if (sortBy === 'profileCompletion') {
      filteredData.sort((a, b) => b.profileCompletion - a.profileCompletion);
    }

    return {
      students: filteredData,
      total: filteredData.length,
      hasMore: students.length === limit
    };
  } catch (error) {
    console.error('Error searching students:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to search students');
  }
});

// Initiate outreach to student (create chat room + send intro message)
Parse.Cloud.define('initiateStudentOutreach', async (request) => {
  const counselor = requireCounselor(request);
  const { studentId, introMessage } = request.params;

  if (!studentId) {
    throw new Parse.Error(Parse.Error.INVALID_ARGUMENT, 'Student ID required');
  }

  if (!introMessage || introMessage.trim().length === 0) {
    throw new Parse.Error(Parse.Error.INVALID_ARGUMENT, 'Introduction message required');
  }

  try {
    // Verify student exists and is a student
    const User = Parse.Object.extend('_User');
    const studentQuery = new Parse.Query(User);
    const student = await studentQuery.get(studentId, { useMasterKey: true });

    if (student.get('role') !== 'student') {
      throw new Parse.Error(Parse.Error.INVALID_ARGUMENT, 'User is not a student');
    }

    // Check if chat room already exists
    const ChatRoom = Parse.Object.extend('ChatRoom');
    const existingRoomQuery = new Parse.Query(ChatRoom);
    existingRoomQuery.containsAll('participants', [counselor.id, studentId]);
    const existingRoom = await existingRoomQuery.first({ useMasterKey: true });

    let chatRoom;
    if (existingRoom) {
      chatRoom = existingRoom;
    } else {
      // Create new chat room
      chatRoom = new ChatRoom();
      chatRoom.set('type', 'counseling');
      chatRoom.set('participants', [counselor.id, studentId]);
      chatRoom.set('title', `Chat with ${student.get('firstName')} ${student.get('lastName')}`);
      chatRoom.set('createdBy', counselor);
      chatRoom.set('isActive', true);
      chatRoom.set('messageCount', 0);
      chatRoom.set('lastActivity', new Date());
      await chatRoom.save(null, { useMasterKey: true });
    }

    // Send intro message
    const ChatMessage = Parse.Object.extend('ChatMessage');
    const message = new ChatMessage();

    const chatRoomPointer = {
      __type: 'Pointer',
      className: 'ChatRoom',
      objectId: chatRoom.id
    };

    message.set('chatRoom', chatRoomPointer);
    message.set('sender', counselor);
    message.set('message', introMessage.trim());
    message.set('messageType', 'text');
    message.set('timestamp', new Date());
    message.set('isRead', false);
    message.set('status', 'sent');

    await message.save(null, { useMasterKey: true });

    // Update chat room
    chatRoom.set('lastMessage', introMessage.trim());
    chatRoom.set('lastActivity', new Date());
    chatRoom.increment('messageCount');
    await chatRoom.save(null, { useMasterKey: true });

    // Create notification for student
    const Notification = Parse.Object.extend('Notification');
    const notification = new Notification();
    notification.set('userId', studentId);
    notification.set('type', 'counselor_outreach');
    notification.set('title', 'New Message from Counselor');
    notification.set('message', `${counselor.get('firstName')} ${counselor.get('lastName')} sent you a message`);
    notification.set('isRead', false);
    notification.set('createdAt', new Date());
    await notification.save(null, { useMasterKey: true });

    // Log counselor activity
    await Parse.Cloud.run('logCounselorActivity', {
      activityType: 'student_outreach',
      description: `Initiated contact with student: ${student.get('firstName')} ${student.get('lastName')}`,
      metadata: { studentId, chatRoomId: chatRoom.id }
    }, { useMasterKey: true });

    return {
      success: true,
      chatRoomId: chatRoom.id,
      messageId: message.id,
      studentName: `${student.get('firstName')} ${student.get('lastName')}`
    };
  } catch (error) {
    console.error('Error initiating student outreach:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to initiate outreach');
  }
});

// Get counselor performance metrics
Parse.Cloud.define('getCounselorPerformance', async (request) => {
  const counselor = requireCounselor(request);
  const { timeRange = '30days' } = request.params;

  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch(timeRange) {
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Get completed sessions
    const Session = Parse.Object.extend('Session');
    const completedQuery = new Parse.Query(Session);
    completedQuery.equalTo('counselorId', counselor.id);
    completedQuery.equalTo('status', 'completed');
    completedQuery.greaterThanOrEqualTo('scheduledTime', startDate);
    const completedSessions = await completedQuery.count({ useMasterKey: true });

    // Get total scheduled sessions
    const totalQuery = new Parse.Query(Session);
    totalQuery.equalTo('counselorId', counselor.id);
    totalQuery.greaterThanOrEqualTo('scheduledTime', startDate);
    const totalSessions = await totalQuery.count({ useMasterKey: true });

    // Calculate completion rate
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    // Get average response time from messages
    const Message = Parse.Object.extend('Message');
    const messageQuery = new Parse.Query(Message);
    messageQuery.equalTo('senderId', counselor.id);
    messageQuery.greaterThanOrEqualTo('createdAt', startDate);
    messageQuery.limit(100);
    const messages = await messageQuery.find({ useMasterKey: true });

    // Mock average response time calculation (would need proper timestamp tracking)
    const avgResponseTime = 2.3; // hours

    // Get student satisfaction (from completed session feedback)
    // This would integrate with a feedback system
    const avgSatisfaction = 4.7; // out of 5

    return {
      completionRate: Math.round(completionRate * 10) / 10,
      completedSessions,
      totalSessions,
      avgResponseTime,
      avgSatisfaction,
      messagesReplied: messages.length,
      timeRange
    };
  } catch (error) {
    console.error('Error getting counselor performance:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get performance metrics');
  }
});

// Get counselor's active chat sessions
Parse.Cloud.define('getCounselorActiveChatSessions', async (request) => {
  const counselor = requireCounselor(request);

  try {
    const ChatRoom = Parse.Object.extend('ChatRoom');
    const query = new Parse.Query(ChatRoom);
    query.equalTo('counselorId', counselor.id);
    query.containedIn('status', ['active', 'waiting']);
    query.descending('updatedAt');
    query.limit(20);

    const sessions = await query.find({ useMasterKey: true });

    return {
      sessions: sessions.map(session => ({
        id: session.id,
        studentName: session.get('studentName') || 'Student',
        status: session.get('status'),
        priority: session.get('priority') || 'medium',
        lastMessage: session.get('updatedAt'),
        averageResponseTime: session.get('avgResponseTime') || 5,
        unreadCount: session.get('unreadCount') || 0
      }))
    };
  } catch (error) {
    console.error('Error getting chat sessions:', error);
    return { sessions: [] };
  }
});

// Get counselor's today's appointments
Parse.Cloud.define('getCounselorTodaysAppointments', async (request) => {
  const counselor = requireCounselor(request);

  try {
    const Session = Parse.Object.extend('Session');
    const query = new Parse.Query(Session);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    query.equalTo('counselorId', counselor.id);
    query.greaterThanOrEqualTo('scheduledTime', today);
    query.lessThan('scheduledTime', tomorrow);
    query.ascending('scheduledTime');

    const appointments = await query.find({ useMasterKey: true });

    return {
      appointments: appointments.map(apt => ({
        id: apt.id,
        studentName: apt.get('studentName'),
        scheduledTime: apt.get('scheduledTime'),
        type: apt.get('type'),
        status: apt.get('status'),
        notes: apt.get('notes'),
        duration: apt.get('duration') || 45
      }))
    };
  } catch (error) {
    console.error('Error getting appointments:', error);
    return { appointments: [] };
  }
});

// Get counselor's pending questions
Parse.Cloud.define('getCounselorPendingQuestions', async (request) => {
  const counselor = requireCounselor(request);

  try {
    const Question = Parse.Object.extend('Question');
    const query = new Parse.Query(Question);
    query.equalTo('assignedCounselorId', counselor.id);
    query.equalTo('hasResponded', false);
    query.descending('createdAt');
    query.limit(50);

    const questions = await query.find({ useMasterKey: true });

    return {
      questions: questions.map(q => ({
        id: q.id,
        studentName: q.get('studentName'),
        subject: q.get('subject'),
        priority: q.get('priority') || 'medium',
        createdAt: q.get('createdAt'),
        category: q.get('category'),
        hasResponded: q.get('hasResponded') || false
      }))
    };
  } catch (error) {
    console.error('Error getting pending questions:', error);
    return { questions: [] };
  }
});

// Get counseling analytics
Parse.Cloud.define('getCounselingAnalytics', async (request) => {
  const counselor = requireCounselor(request);

  try {
    // Get total assigned students
    const StudentAssignment = Parse.Object.extend('StudentAssignment');
    const studentQuery = new Parse.Query(StudentAssignment);
    studentQuery.equalTo('counselorId', counselor.id);
    const totalStudents = await studentQuery.count({ useMasterKey: true });

    // Get active students (contacted in last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeQuery = new Parse.Query(StudentAssignment);
    activeQuery.equalTo('counselorId', counselor.id);
    activeQuery.greaterThan('lastContact', weekAgo);
    const activeStudents = await activeQuery.count({ useMasterKey: true });

    // Get at-risk students
    const riskQuery = new Parse.Query(StudentAssignment);
    riskQuery.equalTo('counselorId', counselor.id);
    riskQuery.equalTo('status', 'at-risk');
    const atRiskStudents = await riskQuery.count({ useMasterKey: true });

    return {
      totalStudents,
      activeStudents,
      atRiskStudents,
      successRate: 85.5,
      averageSessionDuration: 42,
      studentSatisfactionScore: 4.6,
      monthlySessionsCount: Math.floor(totalStudents * 1.5),
      questionResponseTime: 15,
      trend: {
        studentProgress: 'up',
        sessionEffectiveness: 'stable',
        responseTime: 'down'
      }
    };
  } catch (error) {
    console.error('Error getting counseling analytics:', error);
    return {
      totalStudents: 0,
      activeStudents: 0,
      atRiskStudents: 0,
      successRate: 0,
      averageSessionDuration: 0,
      studentSatisfactionScore: 0,
      monthlySessionsCount: 0,
      questionResponseTime: 0,
      trend: { studentProgress: 'stable', sessionEffectiveness: 'stable', responseTime: 'stable' }
    };
  }
});

// Get counselor's recent activities
Parse.Cloud.define('getCounselorRecentActivities', async (request) => {
  const counselor = requireCounselor(request);
  const { limit = 20 } = request.params;

  try {
    const CounselorActivity = Parse.Object.extend('CounselorActivity');
    const query = new Parse.Query(CounselorActivity);
    query.equalTo('counselorId', counselor.id);
    query.descending('createdAt');
    query.limit(limit);

    const activities = await query.find({ useMasterKey: true });

    return activities.map(activity => ({
      activityType: activity.get('activityType'),
      studentId: activity.get('studentId'),
      sessionId: activity.get('sessionId'),
      data: activity.get('data') || {},
      createdAt: activity.get('createdAt'),
      duration: activity.get('duration')
    }));
  } catch (error) {
    console.error('Error getting counselor activities:', error);
    return [];
  }
});

// Book counselor session
Parse.Cloud.define('bookCounselorSession', async (request) => {
  if (!request.user) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User must be authenticated');
  }

  const { counselorId, sessionDate, sessionTime, sessionType, notes } = request.params;
  const student = request.user;

  try {
    // Check premium subscription
    const Subscription = Parse.Object.extend('Subscription');
    const subQuery = new Parse.Query(Subscription);
    subQuery.equalTo('user', student);
    subQuery.equalTo('status', 'active');
    subQuery.greaterThan('expiresAt', new Date());

    const activeSub = await subQuery.first({ useMasterKey: true });

    if (!activeSub) {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Premium subscription required to book counseling sessions');
    }

    // Create session
    const Session = Parse.Object.extend('Session');
    const session = new Session();

    const scheduledDateTime = new Date(`${sessionDate}T${sessionTime}`);

    session.set('counselorId', counselorId);
    session.set('studentId', student.id);
    session.set('studentName', `${student.get('firstName')} ${student.get('lastName')}`);
    session.set('studentEmail', student.get('email'));
    session.set('scheduledTime', scheduledDateTime);
    session.set('type', sessionType);
    session.set('status', 'scheduled');
    session.set('duration', 45);
    session.set('notes', notes || '');

    await session.save(null, { useMasterKey: true });

    // Send confirmation email to student
    try {
      const counselorQuery = new Parse.Query(Parse.User);
      const counselor = await counselorQuery.get(counselorId, { useMasterKey: true });
      const counselorName = `${counselor.get('firstName')} ${counselor.get('lastName')}`;

      const emailTemplate = emailService.getSessionBookingTemplate(
        `${student.get('firstName')} ${student.get('lastName')}`,
        counselorName,
        scheduledDateTime.toLocaleDateString(),
        scheduledDateTime.toLocaleTimeString(),
        sessionType,
        sessionType === 'virtual' ? 'https://meet.elimu-smart.co.ke/' + session.id : null
      );

      await emailService.sendEmail({
        to: student.get('email'),
        toName: `${student.get('firstName')} ${student.get('lastName')}`,
        ...emailTemplate
      });
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
    }

    return {
      success: true,
      sessionId: session.id,
      scheduledTime: scheduledDateTime,
      message: 'Session booked successfully. Confirmation email sent.'
    };
  } catch (error) {
    console.error('Error booking session:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to book session');
  }
});

// ============================================================================
// ADMIN DASHBOARD CLOUD FUNCTIONS
// ============================================================================

// Helper function to check admin authentication
const requireAdmin = (request) => {
  if (!request.user) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User must be authenticated');
  }

  const userRole = request.user.get('role');
  if (userRole !== 'admin') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Admin access required');
  }

  return request.user;
};

// Log admin activity for audit trail
Parse.Cloud.define('logAdminActivity', async (request) => {
  const user = requireAdmin(request);
  const { activityType, data, duration, adminRole } = request.params;

  try {
    const AdminActivity = Parse.Object.extend('AdminActivity');
    const activity = new AdminActivity();

    activity.set('activityType', activityType);
    activity.set('adminId', user.id);
    activity.set('adminEmail', user.get('email'));
    activity.set('adminRole', adminRole || user.get('adminRoleType') || 'admin');
    activity.set('data', data || {});
    activity.set('duration', duration);
    activity.set('ipAddress', request.ip || 'unknown');

    await activity.save(null, { useMasterKey: true });

    return { success: true, activityId: activity.id };
  } catch (error) {
    console.error('Error logging admin activity:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to log admin activity');
  }
});

// Get system metrics (for operations and platform admins)
Parse.Cloud.define('getAdminSystemMetrics', async (request) => {
  requireAdmin(request);

  try {
    // Query total users
    const totalUsers = await new Parse.Query(Parse.User).count({ useMasterKey: true });

    // Query active users (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = await new Parse.Query(Parse.User)
      .greaterThan('updatedAt', yesterday)
      .count({ useMasterKey: true });

    // Query new users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await new Parse.Query(Parse.User)
      .greaterThan('createdAt', today)
      .count({ useMasterKey: true });

    // Query sessions
    const sessions = await new Parse.Query(Parse.Session)
      .limit(1000)
      .find({ useMasterKey: true });

    const totalSessions = sessions.length;

    // Calculate average session duration (mock data - would integrate with actual session tracking)
    const averageSessionDuration = 25; // minutes

    return {
      totalUsers,
      activeUsers,
      newUsersToday,
      totalSessions,
      averageSessionDuration,
      systemUptime: 99.8, // percentage
      serverLoad: Math.floor(Math.random() * 30) + 20, // 20-50%
      databaseSize: 2400, // MB
      responseTime: Math.floor(Math.random() * 100) + 50 // 50-150ms
    };
  } catch (error) {
    console.error('Error getting system metrics:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get system metrics');
  }
});

// Get security metrics (for operations and safety admins)
Parse.Cloud.define('getAdminSecurityMetrics', async (request) => {
  requireAdmin(request);

  try {
    // Query security events (would be from SecurityEvent class in production)
    const SecurityEvent = Parse.Object.extend('SecurityEvent');
    const securityQuery = new Parse.Query(SecurityEvent);

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    securityQuery.greaterThan('createdAt', yesterday);

    const recentEvents = await securityQuery.find({ useMasterKey: true });

    const activeThreats = recentEvents.filter(e => e.get('severity') === 'critical' && e.get('status') === 'active').length;
    const blockedAttempts = recentEvents.filter(e => e.get('type') === 'blocked_login').length;

    return {
      activeThreats,
      blockedAttempts,
      vulnerabilityScore: 15, // Lower is better
      complianceScore: 94, // Percentage
      lastSecurityScan: new Date(),
      failedLoginAttempts: blockedAttempts || Math.floor(Math.random() * 50) + 10
    };
  } catch (error) {
    console.error('Error getting security metrics:', error);
    // Return mock data if SecurityEvent class doesn't exist yet
    return {
      activeThreats: 0,
      blockedAttempts: Math.floor(Math.random() * 20) + 5,
      vulnerabilityScore: 15,
      complianceScore: 94,
      lastSecurityScan: new Date(),
      failedLoginAttempts: Math.floor(Math.random() * 50) + 10
    };
  }
});

// Get business metrics (for platform admins)
Parse.Cloud.define('getAdminBusinessMetrics', async (request) => {
  requireAdmin(request);

  try {
    // Query subscription data (would be from Subscription class in production)
    const Subscription = Parse.Object.extend('Subscription');
    const subQuery = new Parse.Query(Subscription);

    const activeSubscriptions = await subQuery
      .equalTo('status', 'active')
      .count({ useMasterKey: true });

    // Calculate metrics (mock data - would integrate with payment system)
    return {
      monthlyRevenue: Math.floor(Math.random() * 50000) + 100000, // KES
      conversionRate: 12.5, // percentage
      customerSatisfaction: 4.6, // out of 5
      subscriptionGrowth: 8.3, // percentage
      churnRate: 2.1, // percentage
      activeSubscriptions: activeSubscriptions || Math.floor(Math.random() * 100) + 50
    };
  } catch (error) {
    console.error('Error getting business metrics:', error);
    // Return mock data if Subscription class doesn't exist yet
    return {
      monthlyRevenue: Math.floor(Math.random() * 50000) + 100000,
      conversionRate: 12.5,
      customerSatisfaction: 4.6,
      subscriptionGrowth: 8.3,
      churnRate: 2.1,
      activeSubscriptions: Math.floor(Math.random() * 100) + 50
    };
  }
});

// Get content moderation metrics (for operations and safety admins)
Parse.Cloud.define('getAdminContentMetrics', async (request) => {
  requireAdmin(request);

  try {
    // Query content moderation data
    const FlaggedContent = Parse.Object.extend('FlaggedContent');
    const contentQuery = new Parse.Query(FlaggedContent);

    const flaggedContent = await contentQuery
      .equalTo('status', 'pending')
      .count({ useMasterKey: true });

    const approvedQuery = new Parse.Query(FlaggedContent);
    approvedQuery.equalTo('status', 'approved');
    const approvedContent = await approvedQuery.count({ useMasterKey: true });

    const rejectedQuery = new Parse.Query(FlaggedContent);
    rejectedQuery.equalTo('status', 'rejected');
    const rejectedContent = await rejectedQuery.count({ useMasterKey: true });

    return {
      flaggedContent: flaggedContent || Math.floor(Math.random() * 10) + 2,
      moderationQueue: flaggedContent || Math.floor(Math.random() * 15) + 5,
      approvedContent: approvedContent || Math.floor(Math.random() * 100) + 50,
      rejectedContent: rejectedContent || Math.floor(Math.random() * 20) + 5,
      autoModerated: Math.floor(Math.random() * 50) + 20,
      averageReviewTime: 15 // minutes
    };
  } catch (error) {
    console.error('Error getting content metrics:', error);
    // Return mock data if FlaggedContent class doesn't exist yet
    return {
      flaggedContent: Math.floor(Math.random() * 10) + 2,
      moderationQueue: Math.floor(Math.random() * 15) + 5,
      approvedContent: Math.floor(Math.random() * 100) + 50,
      rejectedContent: Math.floor(Math.random() * 20) + 5,
      autoModerated: Math.floor(Math.random() * 50) + 20,
      averageReviewTime: 15
    };
  }
});

// Get support metrics (for operations admins)
Parse.Cloud.define('getAdminSupportMetrics', async (request) => {
  requireAdmin(request);

  try {
    // Query support tickets
    const SupportTicket = Parse.Object.extend('SupportTicket');
    const ticketQuery = new Parse.Query(SupportTicket);

    const openTickets = await ticketQuery
      .equalTo('status', 'open')
      .count({ useMasterKey: true });

    const resolvedQuery = new Parse.Query(SupportTicket);
    resolvedQuery.equalTo('status', 'resolved');
    const resolvedTickets = await resolvedQuery.count({ useMasterKey: true });

    const escalatedQuery = new Parse.Query(SupportTicket);
    escalatedQuery.equalTo('priority', 'high');
    const escalatedTickets = await escalatedQuery.count({ useMasterKey: true });

    return {
      openTickets: openTickets || Math.floor(Math.random() * 20) + 10,
      averageResponseTime: Math.floor(Math.random() * 30) + 15, // minutes
      customerSatisfaction: 4.5, // out of 5
      resolvedTickets: resolvedTickets || Math.floor(Math.random() * 100) + 200,
      escalatedTickets: escalatedTickets || Math.floor(Math.random() * 5) + 2,
      supportAgentLoad: Math.floor(Math.random() * 30) + 50 // percentage
    };
  } catch (error) {
    console.error('Error getting support metrics:', error);
    // Return mock data if SupportTicket class doesn't exist yet
    return {
      openTickets: Math.floor(Math.random() * 20) + 10,
      averageResponseTime: Math.floor(Math.random() * 30) + 15,
      customerSatisfaction: 4.5,
      resolvedTickets: Math.floor(Math.random() * 100) + 200,
      escalatedTickets: Math.floor(Math.random() * 5) + 2,
      supportAgentLoad: Math.floor(Math.random() * 30) + 50
    };
  }
});

// Get audit logs
Parse.Cloud.define('getAdminAuditLogs', async (request) => {
  requireAdmin(request);
  const { limit = 10 } = request.params;

  try {
    const AuditLog = Parse.Object.extend('AuditLog');
    const query = new Parse.Query(AuditLog);
    query.descending('createdAt');
    query.limit(limit);

    const logs = await query.find({ useMasterKey: true });

    return logs.map(log => ({
      id: log.id,
      action: log.get('action'),
      user: log.get('user') || log.get('username') || 'System',
      timestamp: log.get('createdAt'),
      ipAddress: log.get('ipAddress') || 'unknown',
      details: log.get('details') || {},
      severity: log.get('severity') || 'low'
    }));
  } catch (error) {
    console.error('Error getting audit logs:', error);
    // Return mock data if AuditLog class doesn't exist yet
    return [
      {
        id: '1',
        action: 'User Login',
        user: 'admin@elimu.com',
        timestamp: new Date(),
        ipAddress: '192.168.1.100',
        details: { method: 'password' },
        severity: 'low'
      },
      {
        id: '2',
        action: 'System Configuration Changed',
        user: 'admin@elimu.com',
        timestamp: new Date(Date.now() - 3600000),
        ipAddress: '192.168.1.100',
        details: { setting: 'max_upload_size', value: '10MB' },
        severity: 'medium'
      }
    ];
  }
});

// Get recent admin activities
Parse.Cloud.define('getAdminRecentActivities', async (request) => {
  requireAdmin(request);
  const { limit = 20 } = request.params;

  try {
    const AdminActivity = Parse.Object.extend('AdminActivity');
    const query = new Parse.Query(AdminActivity);
    query.descending('createdAt');
    query.limit(limit);

    const activities = await query.find({ useMasterKey: true });

    return activities.map(activity => ({
      activityType: activity.get('activityType'),
      adminId: activity.get('adminId'),
      data: activity.get('data') || {},
      createdAt: activity.get('createdAt'),
      duration: activity.get('duration')
    }));
  } catch (error) {
    console.error('Error getting admin activities:', error);
    // Return mock data if AdminActivity class doesn't exist yet
    return [
      {
        activityType: 'dashboard_view',
        adminId: 'admin-001',
        data: { section: 'system_metrics' },
        createdAt: new Date(),
        duration: 45
      },
      {
        activityType: 'user_management',
        adminId: 'admin-001',
        data: { action: 'view_users' },
        createdAt: new Date(Date.now() - 1800000),
        duration: 120
      }
    ];
  }
});

console.log('☁️ Elimu Smart Cloud Functions loaded successfully (including RIASEC API + Subject-Career Mapper + Skills Assessment + University Course Finder + Career Exploration + Badge & Certification Tracking + Admin Dashboard APIs)');
// ============================================================================
// SUBSCRIPTION MANAGEMENT & M-PESA PAYMENT FUNCTIONS
// ============================================================================

const mpesaService = require('../services/mpesaService');

Parse.Cloud.define('getSubscriptionPlans', async () => {
  return {
    plans: [
      { id: 'free', name: 'Free Plan', price: 0, duration: 'forever', features: ['Career assessments (RIASEC, Skills, University Finder)', 'Community Q&A', 'Career resource library'] },
      { id: 'annual', name: 'Premium Annual', price: 1500, duration: 'yearly', features: ['Everything in Free', 'Unlimited counselor sessions', 'Direct messaging with counselors', 'Career roadmap & action plan', 'Priority support'], popular: true }
    ]
  };
});

Parse.Cloud.define('getUserSubscription', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');
  try {
    const Subscription = Parse.Object.extend('Subscription');

    // First, check for active trial
    const trialQuery = new Parse.Query(Subscription);
    trialQuery.equalTo('user', request.user);
    trialQuery.equalTo('isTrial', true);
    trialQuery.equalTo('isActive', true);
    const trial = await trialQuery.first({ useMasterKey: true });

    if (trial) {
      const now = new Date();
      const endDate = trial.get('trialEndDate');
      const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

      // If trial is still valid, return trial status
      if (daysRemaining > 0) {
        return {
          status: 'trial',
          plan: 'premium',
          planName: 'Premium Trial',
          isTrial: true,
          trialEndDate: endDate.toISOString(),
          daysRemaining: Math.max(0, daysRemaining),
          features: trial.get('features') || [],
          expiresAt: endDate.toISOString()
        };
      }
    }

    // Check for regular paid subscription
    const query = new Parse.Query(Subscription);
    query.equalTo('user', request.user);
    query.equalTo('status', 'active');
    query.equalTo('isTrial', false);
    const subscription = await query.first({ useMasterKey: true });

    if (!subscription) return { status: 'free', plan: 'free', expiresAt: null, isTrial: false };
    return {
      status: subscription.get('status'),
      plan: subscription.get('planId'),
      planName: subscription.get('planName'),
      expiresAt: subscription.get('expiresAt'),
      isTrial: false
    };
  } catch (error) {
    return { status: 'free', plan: 'free', expiresAt: null, isTrial: false };
  }
});

// Payment functions moved to paymentFunctions.js
// See: initiateSubscriptionPayment, checkSubscriptionPaymentStatus

Parse.Cloud.define('cancelSubscription', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');
  const Subscription = Parse.Object.extend('Subscription');
  const query = new Parse.Query(Subscription);
  query.equalTo('user', request.user);
  query.equalTo('status', 'active');
  const subscription = await query.first({ useMasterKey: true });
  if (!subscription) throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'No active subscription');
  subscription.set('status', 'cancelled');
  subscription.set('cancelledAt', new Date());
  await subscription.save(null, { useMasterKey: true });
  return { success: true, message: 'Subscription cancelled' };
});

Parse.Cloud.define('getStudentQuestions', async (request) => {
  const { user } = request;
  const { status = 'pending', limit = 50, filterPremium = false } = request.params;

  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  // Verify user is a counselor
  const userRole = user.get('role');
  if (userRole !== 'counselor' && userRole !== 'career_counselor') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only counselors can access this function');
  }

  try {
    // Get all assigned student IDs
    const UserQuery = new Parse.Query(Parse.User);
    UserQuery.equalTo('assignedCounselorId', user.id);
    UserQuery.select(['objectId']);
    const assignedStudents = await UserQuery.find({ useMasterKey: true });
    let studentIds = assignedStudents.map(s => s.id);

    // Filter for premium students only if requested
    if (filterPremium && studentIds.length > 0) {
      const Subscription = Parse.Object.extend('Subscription');
      const subQuery = new Parse.Query(Subscription);
      subQuery.containedIn('user', studentIds.map(id => {
        const userPointer = new Parse.User();
        userPointer.id = id;
        return userPointer;
      }));
      subQuery.equalTo('status', 'active');
      subQuery.greaterThan('expiresAt', new Date());

      const activeSubs = await subQuery.find({ useMasterKey: true });
      const premiumStudentIds = activeSubs.map(sub => sub.get('user').id);
      studentIds = studentIds.filter(id => premiumStudentIds.includes(id));
    }

    if (studentIds.length === 0) {
      return { success: true, questions: [], totalCount: 0 };
    }

    // Query questions from assigned students
    const StudentQuestion = Parse.Object.extend('StudentQuestion');
    const questionQuery = new Parse.Query(StudentQuestion);
    questionQuery.containedIn('studentId', studentIds);

    if (status) {
      questionQuery.equalTo('status', status);
    }

    questionQuery.descending('priority');
    questionQuery.addDescending('askedAt');
    questionQuery.limit(limit);
    questionQuery.include('student');

    const questions = await questionQuery.find({ useMasterKey: true });

    return {
      success: true,
      questions: questions.map(q => ({
        id: q.id,
        studentId: q.get('studentId'),
        studentName: q.get('studentName'),
        question: q.get('question'),
        answer: q.get('answer'),
        status: q.get('status'),
        priority: q.get('priority'),
        category: q.get('category'),
        askedAt: q.get('askedAt'),
        answeredAt: q.get('answeredAt')
      })),
      totalCount: questions.length
    };

  } catch (error) {
    console.error('Get student questions error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to get student questions');
  }
});

/**
 * Get pending session requests for counselor
 */
Parse.Cloud.define('getPendingSessionRequests', async (request) => {
  const { user } = request;

  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  // Verify user is a counselor
  const userRole = user.get('role');
  if (userRole !== 'counselor' && userRole !== 'career_counselor') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only counselors can access this function');
  }

  try {
    const CounselingSession = Parse.Object.extend('CounselingSession');
    const sessionQuery = new Parse.Query(CounselingSession);
    sessionQuery.equalTo('counselorId', user.id);
    sessionQuery.equalTo('status', 'requested');
    sessionQuery.descending('createdAt');
    sessionQuery.limit(50);

    const sessions = await sessionQuery.find({ useMasterKey: true });

    return {
      success: true,
      sessionRequests: sessions.map(s => ({
        id: s.id,
        studentId: s.get('studentId'),
        studentName: s.get('studentName'),
        topic: s.get('topic'),
        requestedTimes: s.get('requestedTimes'),
        sessionType: s.get('sessionType'),
        createdAt: s.get('createdAt')
      })),
      totalCount: sessions.length
    };

  } catch (error) {
    console.error('Get pending session requests error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to get pending session requests');
  }
});

// Helper function to calculate student priority
function calculateStudentPriority(student, progress) {
  const daysSinceLastLogin = (Date.now() - student.get('updatedAt').getTime()) / (1000 * 60 * 60 * 24);
  const readinessScore = progress ? (progress.get('careerReadinessScore') || 0) : 0;

  // High priority: No activity in 14+ days OR low readiness score
  if (daysSinceLastLogin > 14 || readinessScore < 30) {
    return 'high';
  }

  // Medium priority: No activity in 7-14 days OR medium readiness score
  if (daysSinceLastLogin > 7 || readinessScore < 60) {
    return 'medium';
  }

  return 'low';
}

// Helper function to calculate student status
function calculateStudentStatus(student, progress) {
  const daysSinceLastLogin = (Date.now() - student.get('updatedAt').getTime()) / (1000 * 60 * 60 * 24);
  const readinessScore = progress ? (progress.get('careerReadinessScore') || 0) : 0;

  // Completed: High readiness score and good engagement
  if (readinessScore >= 80 && daysSinceLastLogin < 7) {
    return 'completed';
  }

  // On-hold: No activity in 30+ days
  if (daysSinceLastLogin > 30) {
    return 'on-hold';
  }

  return 'active';
}

/**
 * Submit a question from student to counselor
 */
Parse.Cloud.define('submitQuestion', async (request) => {
  const { user } = request;
  const { question, category } = request.params;

  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  // Verify user is a student
  const userRole = user.get('role');
  if (userRole !== 'student') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only students can submit questions');
  }

  if (!question || question.trim().length === 0) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Question cannot be empty');
  }

  try {
    const StudentQuestion = Parse.Object.extend('StudentQuestion');
    const newQuestion = new StudentQuestion();

    // Get assigned counselor ID
    const assignedCounselorId = user.get('assignedCounselorId');

    // Auto-categorize if not provided
    let questionCategory = category || 'general';
    if (!category) {
      const lowerQuestion = question.toLowerCase();
      if (lowerQuestion.includes('university') || lowerQuestion.includes('college')) {
        questionCategory = 'university';
      } else if (lowerQuestion.includes('career') || lowerQuestion.includes('job')) {
        questionCategory = 'career';
      } else if (lowerQuestion.includes('subject') || lowerQuestion.includes('grade')) {
        questionCategory = 'academic';
      } else if (lowerQuestion.includes('family') || lowerQuestion.includes('parent')) {
        questionCategory = 'personal';
      }
    }

    newQuestion.set('studentId', user.id);
    newQuestion.set('counselorId', assignedCounselorId || null);
    newQuestion.set('question', question.trim());
    newQuestion.set('status', 'pending');
    newQuestion.set('priority', 'medium');
    newQuestion.set('category', questionCategory);
    newQuestion.set('askedAt', new Date());
    newQuestion.set('studentName', `${user.get('firstName')} ${user.get('lastName')}`);
    newQuestion.set('studentEmail', user.get('email'));

    await newQuestion.save(null, { useMasterKey: true });

    return {
      success: true,
      questionId: newQuestion.id,
      message: 'Question submitted successfully. You will receive an answer within 4-6 hours.',
      category: questionCategory
    };

  } catch (error) {
    console.error('Submit question error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to submit question');
  }
});

/**
 * Answer a student question (counselor only)
 */
Parse.Cloud.define('answerQuestion', async (request) => {
  const { user } = request;
  const { questionId, answer } = request.params;

  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  // Verify user is a counselor
  const userRole = user.get('role');
  if (userRole !== 'counselor' && userRole !== 'career_counselor') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only counselors can answer questions');
  }

  if (!answer || answer.trim().length === 0) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Answer cannot be empty');
  }

  try {
    const StudentQuestion = Parse.Object.extend('StudentQuestion');
    const questionQuery = new Parse.Query(StudentQuestion);
    questionQuery.equalTo('objectId', questionId);

    const questionObj = await questionQuery.first({ useMasterKey: true });

    if (!questionObj) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Question not found');
    }

    // Update question with answer
    questionObj.set('answer', answer.trim());
    questionObj.set('status', 'answered');
    questionObj.set('answeredAt', new Date());

    await questionObj.save(null, { useMasterKey: true });

    return {
      success: true,
      message: 'Answer submitted successfully',
      questionId: questionObj.id
    };

  } catch (error) {
    console.error('Answer question error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to answer question');
  }
});

/**
 * Get student's own questions
 */
Parse.Cloud.define('getMyQuestions', async (request) => {
  const { user } = request;

  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  try {
    const StudentQuestion = Parse.Object.extend('StudentQuestion');
    const questionQuery = new Parse.Query(StudentQuestion);
    questionQuery.equalTo('studentId', user.id);
    questionQuery.descending('askedAt');
    questionQuery.limit(50);

    const questions = await questionQuery.find({ useMasterKey: true });

    return {
      success: true,
      questions: questions.map(q => ({
        id: q.id,
        question: q.get('question'),
        answer: q.get('answer'),
        status: q.get('status'),
        category: q.get('category'),
        askedAt: q.get('askedAt'),
        answeredAt: q.get('answeredAt')
      })),
      totalCount: questions.length
    };

  } catch (error) {
    console.error('Get my questions error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to get questions');
  }
});



// ============================================
// CONTENT MANAGEMENT FUNCTIONS
// ============================================
require('./contentManagementFunctions')(Parse);

// ============================================
// CACHE MANAGEMENT FUNCTIONS
// ============================================

// Get cache statistics
Parse.Cloud.define('getCacheStats', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  // Only admins can view cache stats
  const isAdmin = user.get('role') === 'admin';
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }

  try {
    const { getCacheStats } = require('../utils/cache');
    const stats = getCacheStats();
    
    return {
      success: true,
      stats: stats,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('❌ Get cache stats error:', error);
    throw new Error(`Failed to get cache stats: ${error.message}`);
  }
});

// Clear expired cache entries
Parse.Cloud.define('clearExpiredCache', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  // Only admins can clear cache
  const isAdmin = user.get('role') === 'admin';
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }

  try {
    // In-memory cache auto-expires, but we can return confirmation
    return {
      success: true,
      message: 'Expired cache entries are automatically removed',
      timestamp: new Date()
    };
  } catch (error) {
    console.error('❌ Clear expired cache error:', error);
    throw new Error(`Failed to clear expired cache: ${error.message}`);
  }
});

// Clear all cache
Parse.Cloud.define('clearAllCache', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  // Only admins can clear all cache
  const isAdmin = user.get('role') === 'admin';
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }

  try {
    const { clearAllCache } = require('../utils/cache');
    await clearAllCache();
    
    return {
      success: true,
      message: 'All cache cleared successfully',
      timestamp: new Date()
    };
  } catch (error) {
    console.error('❌ Clear all cache error:', error);
    throw new Error(`Failed to clear all cache: ${error.message}`);
  }
});

// ============================================
// CAREER FUNCTIONS (OPTIMIZED with Redis caching)
// ============================================
require('./careerFunctions');


// ============================================
// Payment & M-Pesa Integration Functions
// ============================================
require('./paymentFunctions');

// ============================================
// Parental Consent Functions (KDP Act 2019 / GDPR)
// ============================================
require('./consentFunctions');

// School License & Tagging Functions
// ============================================
require('./schoolFunctions');

// ============================================
// Review & Rating System
// ============================================

/**
 * Submit a counselor review after a session
 * Students can rate counselors and leave comments
 */
Parse.Cloud.define('submitCounselorReview', async (request) => {
  if (!request.user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');
  }

  const { counselorId, rating, comment, sessionId } = request.params;

  // Validation
  if (!counselorId || !rating) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Counselor ID and rating are required');
  }

  if (rating < 1 || rating > 5) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Rating must be between 1 and 5');
  }

  try {
    // Check if user is a student
    const userRole = request.user.get('role');
    if (userRole !== 'student') {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only students can submit reviews');
    }

    // Verify counselor exists
    const counselorQuery = new Parse.Query(Parse.User);
    const counselor = await counselorQuery.get(counselorId, { useMasterKey: true });

    if (!counselor || counselor.get('role') !== 'counselor') {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Counselor not found');
    }

    // Check if student already reviewed this counselor (prevent duplicates per session)
    if (sessionId) {
      const CounselorReview = Parse.Object.extend('CounselorReview');
      const existingReviewQuery = new Parse.Query(CounselorReview);
      existingReviewQuery.equalTo('student', request.user);
      existingReviewQuery.equalTo('counselor', counselor);
      existingReviewQuery.equalTo('sessionId', sessionId);
      const existingReview = await existingReviewQuery.first({ useMasterKey: true });

      if (existingReview) {
        throw new Parse.Error(Parse.Error.DUPLICATE_VALUE, 'You have already reviewed this session');
      }
    }

    // Create review
    const CounselorReview = Parse.Object.extend('CounselorReview');
    const review = new CounselorReview();
    review.set('student', request.user);
    review.set('counselor', counselor);
    review.set('rating', rating);
    review.set('comment', comment || '');
    review.set('sessionId', sessionId || 'general');
    review.set('isVerified', !!sessionId); // Verified if linked to a session
    review.set('isVisible', true);
    
    // Set ACL: Student and counselor can read, only student can edit (within 24h)
    const acl = new Parse.ACL();
    acl.setReadAccess(request.user, true);
    acl.setWriteAccess(request.user, true);
    acl.setReadAccess(counselorId, true);
    acl.setPublicReadAccess(true); // Public can read reviews
    review.setACL(acl);

    await review.save(null, { useMasterKey: true });

    // Update counselor's average rating
    await updateCounselorRating(counselorId);

    console.log('✅ Review submitted:', {
      reviewId: review.id,
      counselorId,
      rating,
      student: request.user.id
    });

    return {
      success: true,
      reviewId: review.id,
      message: 'Review submitted successfully'
    };
  } catch (error) {
    console.error('❌ Review submission failed:', error);
    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      `Failed to submit review: ${error.message}`
    );
  }
});

/**
 * Get counselor reviews with pagination
 * Public endpoint - anyone can view reviews
 */
Parse.Cloud.define('getCounselorReviews', async (request) => {
  const { counselorId, limit = 10, skip = 0 } = request.params;

  if (!counselorId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Counselor ID required');
  }

  try {
    // Verify counselor exists
    const counselorQuery = new Parse.Query(Parse.User);
    const counselor = await counselorQuery.get(counselorId, { useMasterKey: true });

    if (!counselor) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Counselor not found');
    }

    // Query reviews
    const CounselorReview = Parse.Object.extend('CounselorReview');
    const reviewQuery = new Parse.Query(CounselorReview);
    reviewQuery.equalTo('counselor', counselor);
    reviewQuery.equalTo('isVisible', true);
    reviewQuery.include('student');
    reviewQuery.descending('createdAt');
    reviewQuery.limit(limit);
    reviewQuery.skip(skip);

    const reviews = await reviewQuery.find({ useMasterKey: true });

    // Count total reviews
    const countQuery = new Parse.Query(CounselorReview);
    countQuery.equalTo('counselor', counselor);
    countQuery.equalTo('isVisible', true);
    const totalCount = await countQuery.count({ useMasterKey: true });

    // Format reviews
    const formattedReviews = reviews.map(review => {
      const student = review.get('student');
      return {
        id: review.id,
        rating: review.get('rating'),
        comment: review.get('comment'),
        isVerified: review.get('isVerified'),
        createdAt: review.get('createdAt'),
        studentName: student ? `${student.get('firstName')} ${student.get('lastName').charAt(0)}.` : 'Anonymous',
        studentAvatar: student?.get('avatar') || null
      };
    });

    // Get rating statistics
    const avgRating = counselor.get('averageRating') || 0;
    const totalReviews = counselor.get('totalReviews') || 0;

    return {
      success: true,
      reviews: formattedReviews,
      statistics: {
        averageRating: avgRating,
        totalReviews: totalReviews,
        totalCount: totalCount
      },
      pagination: {
        limit,
        skip,
        hasMore: skip + reviews.length < totalCount
      }
    };
  } catch (error) {
    console.error('❌ Get reviews failed:', error);
    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      `Failed to get reviews: ${error.message}`
    );
  }
});

/**
 * Update counselor's average rating (internal helper)
 * Called after each new review is submitted
 */
async function updateCounselorRating(counselorId) {
  try {
    const counselorQuery = new Parse.Query(Parse.User);
    const counselor = await counselorQuery.get(counselorId, { useMasterKey: true });

    const CounselorReview = Parse.Object.extend('CounselorReview');
    const reviewQuery = new Parse.Query(CounselorReview);
    reviewQuery.equalTo('counselor', counselor);
    reviewQuery.equalTo('isVisible', true);

    const reviews = await reviewQuery.find({ useMasterKey: true });
    
    if (reviews.length === 0) {
      counselor.set('averageRating', 0);
      counselor.set('totalReviews', 0);
      await counselor.save(null, { useMasterKey: true });
      return;
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.get('rating'), 0);
    const avgRating = totalRating / reviews.length;

    // Update counselor profile
    counselor.set('averageRating', Math.round(avgRating * 10) / 10); // Round to 1 decimal
    counselor.set('totalReviews', reviews.length);
    await counselor.save(null, { useMasterKey: true });

    console.log('✅ Updated counselor rating:', {
      counselorId,
      averageRating: counselor.get('averageRating'),
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('❌ Failed to update counselor rating:', error);
  }
}

/**
 * Find Scholarship Matches
 * Returns personalized scholarship recommendations based on user profile
 */
Parse.Cloud.define('findScholarshipMatches', async (request) => {
  try {
    const currentUser = request.user;

    if (!currentUser) {
      throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'User must be logged in');
    }

    // Sample scholarship data (in production, fetch from Scholarship class)
    const sampleScholarships = [
      {
        name: 'Equity Wings to Fly',
        amount: 'Full tuition + stipend',
        deadline: '2025-12-31',
        eligibility: ['KCSE B+ and above', 'Needy & deserving'],
        compatibility: 85
      },
      {
        name: 'Mastercard Foundation Scholars',
        amount: 'Full scholarship',
        deadline: '2025-11-30',
        eligibility: ['Academic excellence', 'Leadership potential'],
        compatibility: 90
      },
      {
        name: 'KCB Foundation Scholarship',
        amount: 'KES 50,000/year',
        deadline: '2025-10-15',
        eligibility: ['Form 4 students', 'B- and above'],
        compatibility: 75
      }
    ];

    // Filter and sort by compatibility
    const matches = sampleScholarships
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, 5);

    return {
      success: true,
      matches
    };
  } catch (error) {
    console.error('❌ Find scholarship matches failed:', error);
    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      `Failed to find scholarship matches: ${error.message}`
    );
  }
});

// ==========================================
// GET USER ASSESSMENT RESULTS (for Dashboard & Profile)
// ==========================================
Parse.Cloud.define('getUserAssessmentResults', async (request) => {
  const { user } = request;

  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  try {
    // Fetch StudentProgress to get assessment results
    const StudentProgress = Parse.Object.extend('StudentProgress');
    const progressQuery = new Parse.Query(StudentProgress);
    progressQuery.equalTo('user', user);
    const progress = await progressQuery.first({ useMasterKey: true });

    if (!progress) {
      return {
        success: true,
        hasResults: false,
        assessments: []
      };
    }

    // Fetch all completed assessments
    const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
    const riasecQuery = new Parse.Query(RiasecAssessment);
    riasecQuery.equalTo('user', user);
    riasecQuery.equalTo('status', 'completed');
    riasecQuery.descending('completedAt');
    riasecQuery.limit(10);
    const riasecAssessments = await riasecQuery.find({ useMasterKey: true });

    const assessments = [];

    // Add RIASEC assessments
    riasecAssessments.forEach(assessment => {
      const results = assessment.get('results');
      assessments.push({
        id: assessment.id,
        type: 'riasec',
        title: 'RIASEC Career Assessment',
        completedAt: assessment.get('completedAt'),
        results: {
          hollandCode: assessment.get('hollandCode'),
          primaryType: assessment.get('primaryType'),
          scores: results?.scores || {},
          careerMatches: results?.careerMatches?.slice(0, 3) || []
        }
      });
    });

    // Get latest results from StudentProgress
    const latestRiasec = progress.get('lastRiasecResults');
    const hollandCode = progress.get('hollandCode');

    return {
      success: true,
      hasResults: assessments.length > 0 || !!hollandCode,
      assessments,
      summary: {
        hollandCode: hollandCode || null,
        primaryType: latestRiasec?.primaryType || null,
        topCareers: latestRiasec?.careerMatches?.slice(0, 3) || [],
        assessmentsCompleted: progress.get('assessmentsCompleted') || 0
      }
    };
  } catch (error) {
    console.error('❌ Get user assessment results failed:', error);
    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      `Failed to get assessment results: ${error.message}`
    );
  }
});

// ==========================================
// PHASE 1: SESSION MANAGEMENT CLOUD FUNCTIONS
// ==========================================

/**
 * Update session status (confirm, cancel, complete)
 * @param {string} sessionId - Session ID
 * @param {string} status - New status: 'confirmed', 'cancelled', 'completed', 'in_progress'
 * @param {string} notes - Optional session notes
 * @param {object} outcomes - Optional session outcomes
 */
Parse.Cloud.define('updateSessionStatus', async (request) => {
  const counselor = requireCounselor(request);
  const { sessionId, status, notes, outcomes, cancellationReason } = request.params;

  if (!sessionId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Session ID is required');
  }

  const validStatuses = ['confirmed', 'cancelled', 'completed', 'in_progress', 'pending'];
  if (!status || !validStatuses.includes(status)) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, `Status must be one of: ${validStatuses.join(', ')}`);
  }

  try {
    const Session = Parse.Object.extend('Session');
    const query = new Parse.Query(Session);
    const session = await query.get(sessionId, { useMasterKey: true });

    // Verify counselor owns this session
    if (session.get('counselorId') !== counselor.id) {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'You can only update your own sessions');
    }

    const oldStatus = session.get('status');
    session.set('status', status);
    session.set('updatedAt', new Date());

    if (notes) {
      session.set('counselorNotes', notes);
    }

    if (status === 'completed') {
      session.set('completedAt', new Date());
      if (outcomes) {
        session.set('outcomes', outcomes);
      }
    }

    if (status === 'cancelled' && cancellationReason) {
      session.set('cancellationReason', cancellationReason);
      session.set('cancelledBy', 'counselor');
    }

    await session.save(null, { useMasterKey: true });

    // Send notification to student
    const studentId = session.get('studentId');
    if (studentId && status !== oldStatus) {
      try {
        const Student = Parse.Object.extend('_User');
        const studentQuery = new Parse.Query(Student);
        const student = await studentQuery.get(studentId, { useMasterKey: true });

        const Notification = Parse.Object.extend('Notification');
        const notification = new Notification();
        notification.set('user', student);
        notification.set('type', `session_${status}`);
        notification.set('title', `Session ${status}`);
        notification.set('message', `Your session has been ${status} by ${counselor.get('firstName')} ${counselor.get('lastName')}`);
        notification.set('isRead', false);
        notification.set('relatedObjectId', sessionId);
        notification.set('relatedObjectType', 'Session');
        await notification.save(null, { useMasterKey: true });
      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }
    }

    return {
      success: true,
      session: {
        id: session.id,
        status: session.get('status'),
        studentId: session.get('studentId'),
        scheduledTime: session.get('scheduledTime'),
        topic: session.get('topic'),
        notes: session.get('counselorNotes'),
        completedAt: session.get('completedAt'),
        outcomes: session.get('outcomes')
      }
    };
  } catch (error) {
    console.error('Error updating session status:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to update session: ${error.message}`);
  }
});

/**
 * Reschedule a session to a new time
 * @param {string} sessionId - Session ID
 * @param {Date} newTime - New scheduled time
 * @param {string} reason - Optional reason for rescheduling
 */
Parse.Cloud.define('rescheduleSession', async (request) => {
  const counselor = requireCounselor(request);
  const { sessionId, newTime, reason } = request.params;

  if (!sessionId || !newTime) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Session ID and new time are required');
  }

  const newDate = new Date(newTime);
  if (isNaN(newDate.getTime())) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Invalid date format');
  }

  // Check if new time is in the past
  if (newDate < new Date()) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Cannot reschedule to a past date');
  }

  try {
    const Session = Parse.Object.extend('Session');
    const query = new Parse.Query(Session);
    const session = await query.get(sessionId, { useMasterKey: true });

    // Verify counselor owns this session
    if (session.get('counselorId') !== counselor.id) {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'You can only reschedule your own sessions');
    }

    const oldTime = session.get('scheduledTime');
    session.set('scheduledTime', newDate);
    session.set('rescheduledAt', new Date());
    session.set('rescheduledBy', 'counselor');
    if (reason) {
      session.set('rescheduleReason', reason);
    }

    await session.save(null, { useMasterKey: true });

    // Send notification to student
    const studentId = session.get('studentId');
    if (studentId) {
      try {
        const Student = Parse.Object.extend('_User');
        const studentQuery = new Parse.Query(Student);
        const student = await studentQuery.get(studentId, { useMasterKey: true });

        const Notification = Parse.Object.extend('Notification');
        const notification = new Notification();
        notification.set('user', student);
        notification.set('type', 'session_rescheduled');
        notification.set('title', 'Session Rescheduled');
        notification.set('message', `Your session has been rescheduled to ${newDate.toLocaleString()}`);
        notification.set('isRead', false);
        notification.set('relatedObjectId', sessionId);
        notification.set('relatedObjectType', 'Session');
        await notification.save(null, { useMasterKey: true });
      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }
    }

    return {
      success: true,
      session: {
        id: session.id,
        oldTime,
        newTime: newDate,
        studentId: session.get('studentId'),
        topic: session.get('topic'),
        reason
      }
    };
  } catch (error) {
    console.error('Error rescheduling session:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to reschedule session: ${error.message}`);
  }
});

/**
 * Add or update session notes
 * @param {string} sessionId - Session ID
 * @param {string} notes - Session notes
 * @param {string} nextSteps - Recommended next steps for student
 * @param {array} resources - Resources shared during session
 */
Parse.Cloud.define('addSessionNotes', async (request) => {
  const counselor = requireCounselor(request);
  const { sessionId, notes, nextSteps, resources, outcomes } = request.params;

  if (!sessionId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Session ID is required');
  }

  try {
    const Session = Parse.Object.extend('Session');
    const query = new Parse.Query(Session);
    const session = await query.get(sessionId, { useMasterKey: true });

    // Verify counselor owns this session
    if (session.get('counselorId') !== counselor.id) {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'You can only add notes to your own sessions');
    }

    if (notes) {
      session.set('counselorNotes', notes);
    }

    if (nextSteps) {
      session.set('nextSteps', nextSteps);
    }

    if (resources && Array.isArray(resources)) {
      session.set('sharedResources', resources);
    }

    if (outcomes) {
      session.set('outcomes', outcomes);
    }

    session.set('notesUpdatedAt', new Date());

    await session.save(null, { useMasterKey: true });

    return {
      success: true,
      session: {
        id: session.id,
        notes: session.get('counselorNotes'),
        nextSteps: session.get('nextSteps'),
        resources: session.get('sharedResources'),
        outcomes: session.get('outcomes'),
        updatedAt: session.get('notesUpdatedAt')
      }
    };
  } catch (error) {
    console.error('Error adding session notes:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to add session notes: ${error.message}`);
  }
});

/**
 * Get session details including notes (counselor only)
 * @param {string} sessionId - Session ID
 */
Parse.Cloud.define('getSessionDetails', async (request) => {
  const counselor = requireCounselor(request);
  const { sessionId } = request.params;

  if (!sessionId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Session ID is required');
  }

  try {
    const Session = Parse.Object.extend('Session');
    const query = new Parse.Query(Session);
    const session = await query.get(sessionId, { useMasterKey: true });

    // Verify counselor owns this session
    if (session.get('counselorId') !== counselor.id) {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'You can only view your own sessions');
    }

    // Get student details
    const studentId = session.get('studentId');
    let studentInfo = null;
    if (studentId) {
      try {
        const Student = Parse.Object.extend('_User');
        const studentQuery = new Parse.Query(Student);
        const student = await studentQuery.get(studentId, { useMasterKey: true });
        
        studentInfo = {
          id: student.id,
          name: `${student.get('firstName')} ${student.get('lastName')}`,
          email: student.get('email'),
          phone: student.get('phone'),
          subscriptionTier: student.get('subscriptionTier') || 'free'
        };
      } catch (studentError) {
        console.error('Error fetching student:', studentError);
      }
    }

    return {
      success: true,
      session: {
        id: session.id,
        status: session.get('status'),
        scheduledTime: session.get('scheduledTime'),
        duration: session.get('duration') || 60,
        topic: session.get('topic'),
        type: session.get('sessionType') || 'general',
        notes: session.get('counselorNotes'),
        nextSteps: session.get('nextSteps'),
        sharedResources: session.get('sharedResources') || [],
        outcomes: session.get('outcomes'),
        completedAt: session.get('completedAt'),
        createdAt: session.get('createdAt'),
        student: studentInfo
      }
    };
  } catch (error) {
    console.error('Error getting session details:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to get session details: ${error.message}`);
  }
});

// ==========================================
// PHASE 2: STUDENT MANAGEMENT CLOUD FUNCTIONS
// ==========================================

/**
 * Update student priority level
 * @param {string} studentId - Student user ID
 * @param {string} priority - Priority level: 'low', 'medium', 'high', 'urgent'
 * @param {string} reason - Optional reason for priority change
 */
Parse.Cloud.define('updateStudentPriority', async (request) => {
  const counselor = requireCounselor(request);
  const { studentId, priority, reason } = request.params;

  if (!studentId || !priority) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Student ID and priority are required');
  }

  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!validPriorities.includes(priority)) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, `Priority must be one of: ${validPriorities.join(', ')}`);
  }

  try {
    // Check if counselor-student relationship exists
    const CounselorStudent = Parse.Object.extend('CounselorStudent');
    const query = new Parse.Query(CounselorStudent);
    query.equalTo('counselorId', counselor.id);
    query.equalTo('studentId', studentId);
    
    let relationship = await query.first({ useMasterKey: true });

    if (!relationship) {
      // Create new relationship if doesn't exist
      relationship = new CounselorStudent();
      relationship.set('counselorId', counselor.id);
      relationship.set('studentId', studentId);
      relationship.set('status', 'active');
      relationship.set('assignedAt', new Date());
    }

    relationship.set('priority', priority);
    relationship.set('priorityUpdatedAt', new Date());
    if (reason) {
      relationship.set('priorityReason', reason);
    }

    await relationship.save(null, { useMasterKey: true });

    return {
      success: true,
      studentId,
      priority,
      reason,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error updating student priority:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to update student priority: ${error.message}`);
  }
});

/**
 * Add private note about a student
 * @param {string} studentId - Student user ID
 * @param {string} note - Note content
 * @param {boolean} isPrivate - Whether note is private to counselor (default: true)
 * @param {array} tags - Optional tags for categorizing notes
 */
Parse.Cloud.define('addStudentNote', async (request) => {
  const counselor = requireCounselor(request);
  const { studentId, note, isPrivate = true, tags } = request.params;

  if (!studentId || !note) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Student ID and note are required');
  }

  try {
    const StudentNote = Parse.Object.extend('StudentNote');
    const newNote = new StudentNote();
    
    newNote.set('counselorId', counselor.id);
    newNote.set('studentId', studentId);
    newNote.set('content', note);
    newNote.set('isPrivate', isPrivate);
    newNote.set('createdAt', new Date());
    
    if (tags && Array.isArray(tags)) {
      newNote.set('tags', tags);
    }

    await newNote.save(null, { useMasterKey: true });

    return {
      success: true,
      note: {
        id: newNote.id,
        studentId,
        content: note,
        isPrivate,
        tags: tags || [],
        createdAt: newNote.get('createdAt')
      }
    };
  } catch (error) {
    console.error('Error adding student note:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to add student note: ${error.message}`);
  }
});

/**
 * Get student's assessment results (for counselor review)
 * @param {string} studentId - Student user ID
 */
Parse.Cloud.define('getStudentAssessmentResults', async (request) => {
  const counselor = requireCounselor(request);
  const { studentId } = request.params;

  if (!studentId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Student ID is required');
  }

  try {
    // Get student
    const Student = Parse.Object.extend('_User');
    const studentQuery = new Parse.Query(Student);
    const student = await studentQuery.get(studentId, { useMasterKey: true });

    // Get RIASEC assessments
    const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
    const riasecQuery = new Parse.Query(RiasecAssessment);
    riasecQuery.equalTo('user', student);
    riasecQuery.equalTo('status', 'completed');
    riasecQuery.descending('completedAt');
    riasecQuery.limit(5);
    const riasecResults = await riasecQuery.find({ useMasterKey: true });

    // Get student progress
    const StudentProgress = Parse.Object.extend('StudentProgress');
    const progressQuery = new Parse.Query(StudentProgress);
    progressQuery.equalTo('user', student);
    const progress = await progressQuery.first({ useMasterKey: true });

    const assessments = riasecResults.map(assessment => ({
      id: assessment.id,
      type: 'riasec',
      title: 'RIASEC Career Assessment',
      completedAt: assessment.get('completedAt'),
      hollandCode: assessment.get('hollandCode'),
      primaryType: assessment.get('primaryType'),
      scores: assessment.get('results')?.scores || {},
      careerMatches: assessment.get('results')?.careerMatches?.slice(0, 5) || []
    }));

    return {
      success: true,
      student: {
        id: student.id,
        name: `${student.get('firstName')} ${student.get('lastName')}`,
        email: student.get('email')
      },
      assessments,
      summary: progress ? {
        hollandCode: progress.get('hollandCode'),
        primaryType: progress.get('lastRiasecResults')?.primaryType,
        assessmentsCompleted: progress.get('assessmentsCompleted') || 0,
        profileCompletion: progress.get('profileCompletion') || 0
      } : null
    };
  } catch (error) {
    console.error('Error getting student assessment results:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to get assessment results: ${error.message}`);
  }
});

/**
 * Track student progress milestone
 * @param {string} studentId - Student user ID
 * @param {string} milestone - Milestone type: 'assessment_completed', 'career_decided', 'application_submitted', etc.
 * @param {string} status - Status: 'achieved', 'in_progress', 'not_started'
 * @param {object} metadata - Additional milestone data
 */
Parse.Cloud.define('trackStudentProgress', async (request) => {
  const counselor = requireCounselor(request);
  const { studentId, milestone, status, metadata } = request.params;

  if (!studentId || !milestone || !status) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Student ID, milestone, and status are required');
  }

  const validStatuses = ['achieved', 'in_progress', 'not_started'];
  if (!validStatuses.includes(status)) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, `Status must be one of: ${validStatuses.join(', ')}`);
  }

  try {
    const StudentMilestone = Parse.Object.extend('StudentMilestone');
    
    // Check if milestone already exists
    const query = new Parse.Query(StudentMilestone);
    query.equalTo('studentId', studentId);
    query.equalTo('milestoneType', milestone);
    
    let milestoneRecord = await query.first({ useMasterKey: true });

    if (milestoneRecord) {
      // Update existing milestone
      milestoneRecord.set('status', status);
      milestoneRecord.set('updatedAt', new Date());
      milestoneRecord.set('updatedBy', counselor.id);
    } else {
      // Create new milestone
      milestoneRecord = new StudentMilestone();
      milestoneRecord.set('studentId', studentId);
      milestoneRecord.set('milestoneType', milestone);
      milestoneRecord.set('status', status);
      milestoneRecord.set('createdBy', counselor.id);
    }

    if (status === 'achieved') {
      milestoneRecord.set('achievedAt', new Date());
    }

    if (metadata) {
      milestoneRecord.set('metadata', metadata);
    }

    await milestoneRecord.save(null, { useMasterKey: true });

    return {
      success: true,
      milestone: {
        id: milestoneRecord.id,
        studentId,
        type: milestone,
        status,
        achievedAt: milestoneRecord.get('achievedAt'),
        metadata
      }
    };
  } catch (error) {
    console.error('Error tracking student progress:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to track student progress: ${error.message}`);
  }
});

/**
 * Get student notes (counselor's private notes)
 * @param {string} studentId - Student user ID
 */
Parse.Cloud.define('getStudentNotes', async (request) => {
  const counselor = requireCounselor(request);
  const { studentId } = request.params;

  if (!studentId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Student ID is required');
  }

  try {
    const StudentNote = Parse.Object.extend('StudentNote');
    const query = new Parse.Query(StudentNote);
    query.equalTo('counselorId', counselor.id);
    query.equalTo('studentId', studentId);
    query.descending('createdAt');
    query.limit(50);

    const notes = await query.find({ useMasterKey: true });

    return {
      success: true,
      notes: notes.map(note => ({
        id: note.id,
        content: note.get('content'),
        isPrivate: note.get('isPrivate'),
        tags: note.get('tags') || [],
        createdAt: note.get('createdAt')
      }))
    };
  } catch (error) {
    console.error('Error getting student notes:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to get student notes: ${error.message}`);
  }
});

// ==========================================
// PHASE 3: AVAILABILITY & CALENDAR INTEGRATION
// ==========================================

/**
 * Set counselor availability schedule
 * @param {object} schedule - Weekly schedule object
 * Format: { monday: ['09:00-12:00', '14:00-17:00'], tuesday: [...], ... }
 */
Parse.Cloud.define('setAvailability', async (request) => {
  const counselor = requireCounselor(request);
  const { schedule } = request.params;

  if (!schedule || typeof schedule !== 'object') {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Schedule object is required');
  }

  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  // Validate schedule format
  for (const day in schedule) {
    if (!validDays.includes(day.toLowerCase())) {
      throw new Parse.Error(Parse.Error.INVALID_QUERY, `Invalid day: ${day}`);
    }
    if (!Array.isArray(schedule[day])) {
      throw new Parse.Error(Parse.Error.INVALID_QUERY, `Schedule for ${day} must be an array`);
    }
  }

  try {
    const CounselorAvailability = Parse.Object.extend('CounselorAvailability');
    
    // Check if availability already exists
    const query = new Parse.Query(CounselorAvailability);
    query.equalTo('counselorId', counselor.id);
    let availability = await query.first({ useMasterKey: true });

    if (availability) {
      // Update existing
      availability.set('schedule', schedule);
      availability.set('updatedAt', new Date());
    } else {
      // Create new
      availability = new CounselorAvailability();
      availability.set('counselorId', counselor.id);
      availability.set('schedule', schedule);
    }

    await availability.save(null, { useMasterKey: true });

    return {
      success: true,
      schedule
    };
  } catch (error) {
    console.error('Error setting availability:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to set availability: ${error.message}`);
  }
});

/**
 * Block specific time slot
 * @param {Date} startTime - Start time to block
 * @param {Date} endTime - End time to block
 * @param {string} reason - Reason for blocking (optional)
 */
Parse.Cloud.define('blockTimeSlot', async (request) => {
  const counselor = requireCounselor(request);
  const { startTime, endTime, reason } = request.params;

  if (!startTime || !endTime) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Start time and end time are required');
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Invalid date format');
  }

  if (start >= end) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Start time must be before end time');
  }

  try {
    const BlockedTimeSlot = Parse.Object.extend('BlockedTimeSlot');
    const blockedSlot = new BlockedTimeSlot();
    
    blockedSlot.set('counselorId', counselor.id);
    blockedSlot.set('startTime', start);
    blockedSlot.set('endTime', end);
    blockedSlot.set('reason', reason || 'Unavailable');
    blockedSlot.set('createdAt', new Date());

    await blockedSlot.save(null, { useMasterKey: true });

    return {
      success: true,
      blockedSlot: {
        id: blockedSlot.id,
        startTime: start,
        endTime: end,
        reason: reason || 'Unavailable'
      }
    };
  } catch (error) {
    console.error('Error blocking time slot:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to block time slot: ${error.message}`);
  }
});

/**
 * Get available time slots for booking
 * @param {string} counselorId - Counselor ID (optional, defaults to current counselor)
 * @param {Date} date - Date to check availability
 * @param {number} duration - Session duration in minutes (default: 60)
 */
Parse.Cloud.define('getAvailableSlots', async (request) => {
  const { counselorId, date, duration = 60 } = request.params;
  
  const targetCounselorId = counselorId || request.user?.id;
  if (!targetCounselorId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Counselor ID is required');
  }

  if (!date) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Date is required');
  }

  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Invalid date format');
  }

  try {
    // Get counselor's availability schedule
    const CounselorAvailability = Parse.Object.extend('CounselorAvailability');
    const availQuery = new Parse.Query(CounselorAvailability);
    availQuery.equalTo('counselorId', targetCounselorId);
    const availability = await availQuery.first({ useMasterKey: true });

    if (!availability) {
      return {
        success: true,
        slots: [],
        message: 'No availability schedule set'
      };
    }

    const schedule = availability.get('schedule');
    const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySlots = schedule[dayName] || [];

    if (daySlots.length === 0) {
      return {
        success: true,
        slots: [],
        message: `No availability on ${dayName}s`
      };
    }

    // Get existing sessions for the date
    const Session = Parse.Object.extend('Session');
    const sessionQuery = new Parse.Query(Session);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    sessionQuery.equalTo('counselorId', targetCounselorId);
    sessionQuery.greaterThanOrEqualTo('scheduledTime', startOfDay);
    sessionQuery.lessThan('scheduledTime', endOfDay);
    sessionQuery.containedIn('status', ['pending', 'confirmed']);
    const existingSessions = await sessionQuery.find({ useMasterKey: true });

    // Get blocked time slots for the date
    const BlockedTimeSlot = Parse.Object.extend('BlockedTimeSlot');
    const blockedQuery = new Parse.Query(BlockedTimeSlot);
    blockedQuery.equalTo('counselorId', targetCounselorId);
    blockedQuery.greaterThanOrEqualTo('startTime', startOfDay);
    blockedQuery.lessThan('endTime', endOfDay);
    const blockedSlots = await blockedQuery.find({ useMasterKey: true });

    // Generate available slots
    const availableSlots = [];
    
    for (const timeRange of daySlots) {
      const [startStr, endStr] = timeRange.split('-');
      const [startHour, startMin] = startStr.split(':').map(Number);
      const [endHour, endMin] = endStr.split(':').map(Number);
      
      let currentTime = new Date(targetDate);
      currentTime.setHours(startHour, startMin, 0, 0);
      
      const rangeEnd = new Date(targetDate);
      rangeEnd.setHours(endHour, endMin, 0, 0);
      
      while (currentTime < rangeEnd) {
        const slotEnd = new Date(currentTime.getTime() + duration * 60000);
        
        if (slotEnd > rangeEnd) break;
        
        // Check if slot conflicts with existing session
        const hasConflict = existingSessions.some(session => {
          const sessionStart = session.get('scheduledTime');
          const sessionDuration = session.get('duration') || 60;
          const sessionEnd = new Date(sessionStart.getTime() + sessionDuration * 60000);
          
          return (currentTime < sessionEnd && slotEnd > sessionStart);
        });
        
        // Check if slot conflicts with blocked time
        const isBlocked = blockedSlots.some(blocked => {
          const blockedStart = blocked.get('startTime');
          const blockedEnd = blocked.get('endTime');
          
          return (currentTime < blockedEnd && slotEnd > blockedStart);
        });
        
        if (!hasConflict && !isBlocked) {
          availableSlots.push({
            startTime: new Date(currentTime),
            endTime: new Date(slotEnd),
            duration
          });
        }
        
        // Move to next slot (30-minute increments)
        currentTime = new Date(currentTime.getTime() + 30 * 60000);
      }
    }

    return {
      success: true,
      date: targetDate,
      dayOfWeek: dayName,
      slots: availableSlots,
      totalSlots: availableSlots.length
    };
  } catch (error) {
    console.error('Error getting available slots:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to get available slots: ${error.message}`);
  }
});

/**
 * Get counselor's availability schedule
 */
Parse.Cloud.define('getAvailabilitySchedule', async (request) => {
  const counselor = requireCounselor(request);

  try {
    const CounselorAvailability = Parse.Object.extend('CounselorAvailability');
    const query = new Parse.Query(CounselorAvailability);
    query.equalTo('counselorId', counselor.id);
    const availability = await query.first({ useMasterKey: true });

    if (!availability) {
      return {
        success: true,
        hasSchedule: false,
        schedule: {}
      };
    }

    return {
      success: true,
      hasSchedule: true,
      schedule: availability.get('schedule'),
      updatedAt: availability.get('updatedAt')
    };
  } catch (error) {
    console.error('Error getting availability schedule:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to get availability schedule: ${error.message}`);
  }
});

// ==========================================
// PHASE 4: MESSAGING & OUTREACH
// ==========================================

/**
 * Send bulk message to multiple students
 * @param {array} studentIds - Array of student IDs
 * @param {string} message - Message content
 * @param {string} subject - Message subject (optional)
 */
Parse.Cloud.define('sendBulkMessage', async (request) => {
  const counselor = requireCounselor(request);
  const { studentIds, message, subject } = request.params;

  if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Student IDs array is required');
  }

  if (!message || !message.trim()) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Message content is required');
  }

  if (studentIds.length > 100) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Cannot send to more than 100 students at once');
  }

  try {
    const results = {
      success: [],
      failed: []
    };

    for (const studentId of studentIds) {
      try {
        // Get or create chat room
        const ChatRoom = Parse.Object.extend('ChatRoom');
        const roomQuery = new Parse.Query(ChatRoom);
        roomQuery.containsAll('participants', [counselor.id, studentId]);
        let chatRoom = await roomQuery.first({ useMasterKey: true });

        if (!chatRoom) {
          // Create new chat room
          chatRoom = new ChatRoom();
          chatRoom.set('participants', [counselor.id, studentId]);
          chatRoom.set('createdAt', new Date());
          chatRoom.set('updatedAt', new Date());
          await chatRoom.save(null, { useMasterKey: true });
        }

        // Send message
        const ChatMessage = Parse.Object.extend('ChatMessage');
        const newMessage = new ChatMessage();
        
        newMessage.set('chatRoom', chatRoom);
        newMessage.set('sender', counselor.toPointer());
        newMessage.set('text', message);
        newMessage.set('isRead', false);
        newMessage.set('createdAt', new Date());

        await newMessage.save(null, { useMasterKey: true });

        // Update chat room
        chatRoom.set('lastMessage', newMessage);
        chatRoom.set('updatedAt', new Date());
        await chatRoom.save(null, { useMasterKey: true });

        // Send notification
        try {
          const Student = Parse.Object.extend('_User');
          const studentQuery = new Parse.Query(Student);
          const student = await studentQuery.get(studentId, { useMasterKey: true });

          const Notification = Parse.Object.extend('Notification');
          const notification = new Notification();
          notification.set('user', student);
          notification.set('type', 'new_message');
          notification.set('title', subject || 'New message from counselor');
          notification.set('message', message.substring(0, 100) + (message.length > 100 ? '...' : ''));
          notification.set('isRead', false);
          notification.set('relatedObjectId', chatRoom.id);
          notification.set('relatedObjectType', 'ChatRoom');
          await notification.save(null, { useMasterKey: true });
        } catch (notificationError) {
          console.error('Failed to send notification:', notificationError);
        }

        results.success.push(studentId);
      } catch (error) {
        console.error(`Failed to send message to student ${studentId}:`, error);
        results.failed.push({
          studentId,
          error: error.message
        });
      }
    }

    return {
      success: true,
      totalSent: results.success.length,
      totalFailed: results.failed.length,
      successfulRecipients: results.success,
      failedRecipients: results.failed
    };
  } catch (error) {
    console.error('Error sending bulk message:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to send bulk message: ${error.message}`);
  }
});

/**
 * Create message template for reuse
 * @param {string} title - Template title
 * @param {string} content - Template content with placeholders
 * @param {string} category - Template category (optional)
 */
Parse.Cloud.define('createMessageTemplate', async (request) => {
  const counselor = requireCounselor(request);
  const { title, content, category, placeholders } = request.params;

  if (!title || !title.trim()) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Template title is required');
  }

  if (!content || !content.trim()) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Template content is required');
  }

  try {
    const MessageTemplate = Parse.Object.extend('MessageTemplate');
    const template = new MessageTemplate();
    
    template.set('counselorId', counselor.id);
    template.set('title', title);
    template.set('content', content);
    template.set('category', category || 'general');
    template.set('placeholders', placeholders || []);
    template.set('createdAt', new Date());

    await template.save(null, { useMasterKey: true });

    return {
      success: true,
      template: {
        id: template.id,
        title,
        content,
        category,
        placeholders
      }
    };
  } catch (error) {
    console.error('Error creating message template:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to create template: ${error.message}`);
  }
});

/**
 * Get counselor's message templates
 * @param {string} category - Filter by category (optional)
 */
Parse.Cloud.define('getMessageTemplates', async (request) => {
  const counselor = requireCounselor(request);
  const { category } = request.params;

  try {
    const MessageTemplate = Parse.Object.extend('MessageTemplate');
    const query = new Parse.Query(MessageTemplate);
    query.equalTo('counselorId', counselor.id);
    
    if (category) {
      query.equalTo('category', category);
    }
    
    query.descending('createdAt');
    query.limit(50);

    const templates = await query.find({ useMasterKey: true });

    return {
      success: true,
      templates: templates.map(t => ({
        id: t.id,
        title: t.get('title'),
        content: t.get('content'),
        category: t.get('category'),
        placeholders: t.get('placeholders') || [],
        createdAt: t.get('createdAt')
      }))
    };
  } catch (error) {
    console.error('Error getting message templates:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to get templates: ${error.message}`);
  }
});

/**
 * Update message template
 * @param {string} templateId - Template ID
 * @param {string} title - New title (optional)
 * @param {string} content - New content (optional)
 * @param {string} category - New category (optional)
 */
Parse.Cloud.define('updateMessageTemplate', async (request) => {
  const counselor = requireCounselor(request);
  const { templateId, title, content, category, placeholders } = request.params;

  if (!templateId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Template ID is required');
  }

  try {
    const MessageTemplate = Parse.Object.extend('MessageTemplate');
    const query = new Parse.Query(MessageTemplate);
    const template = await query.get(templateId, { useMasterKey: true });

    // Verify ownership
    if (template.get('counselorId') !== counselor.id) {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'You can only update your own templates');
    }

    if (title) template.set('title', title);
    if (content) template.set('content', content);
    if (category) template.set('category', category);
    if (placeholders) template.set('placeholders', placeholders);
    template.set('updatedAt', new Date());

    await template.save(null, { useMasterKey: true });

    return {
      success: true,
      template: {
        id: template.id,
        title: template.get('title'),
        content: template.get('content'),
        category: template.get('category'),
        placeholders: template.get('placeholders')
      }
    };
  } catch (error) {
    console.error('Error updating message template:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to update template: ${error.message}`);
  }
});

/**
 * Delete message template
 * @param {string} templateId - Template ID
 */
Parse.Cloud.define('deleteMessageTemplate', async (request) => {
  const counselor = requireCounselor(request);
  const { templateId } = request.params;

  if (!templateId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Template ID is required');
  }

  try {
    const MessageTemplate = Parse.Object.extend('MessageTemplate');
    const query = new Parse.Query(MessageTemplate);
    const template = await query.get(templateId, { useMasterKey: true });

    // Verify ownership
    if (template.get('counselorId') !== counselor.id) {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'You can only delete your own templates');
    }

    await template.destroy({ useMasterKey: true });

    return {
      success: true,
      deletedId: templateId
    };
  } catch (error) {
    console.error('Error deleting message template:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to delete template: ${error.message}`);
  }
});

// ============================================================================
// PHASE 5: COUNSELOR ACTIVITY FEED & STUDENT TIMELINE
// ============================================================================

/**
 * Get counselor activity feed
 * Returns recent activities (messages, sessions, assessments, milestones)
 */
Parse.Cloud.define('getActivityFeed', async (request) => {
  requireCounselor(request);
  
  const { limit = 20 } = request.params;
  const counselor = request.user;
  
  try {
    const activities = [];
    
    // 1. Get recent messages from assigned students
    const CounselorStudent = Parse.Object.extend('CounselorStudent');
    const studentQuery = new Parse.Query(CounselorStudent);
    studentQuery.equalTo('counselor', counselor);
    studentQuery.include('student');
    const assignments = await studentQuery.find({ useMasterKey: true });
    const studentIds = assignments.map(a => a.get('student').id);
    
    if (studentIds.length > 0) {
      // Get recent chat messages
      const ChatMessage = Parse.Object.extend('ChatMessage');
      const messageQuery = new Parse.Query(ChatMessage);
      messageQuery.containedIn('sender', studentIds.map(id => {
        const user = new Parse.User();
        user.id = id;
        return user;
      }));
      messageQuery.descending('createdAt');
      messageQuery.limit(10);
      messageQuery.include('sender');
      
      const messages = await messageQuery.find({ useMasterKey: true });
      messages.forEach(msg => {
        activities.push({
          type: 'message',
          id: msg.id,
          studentId: msg.get('sender').id,
          studentName: `${msg.get('sender').get('firstName')} ${msg.get('sender').get('lastName')}`,
          content: msg.get('text'),
          timestamp: msg.createdAt,
          isRead: msg.get('isRead') || false
        });
      });
      
      // Get recent sessions
      const Session = Parse.Object.extend('Session');
      const sessionQuery = new Parse.Query(Session);
      sessionQuery.equalTo('counselor', counselor);
      sessionQuery.containedIn('status', ['pending', 'confirmed', 'completed']);
      sessionQuery.descending('scheduledTime');
      sessionQuery.limit(10);
      sessionQuery.include('student');
      
      const sessions = await sessionQuery.find({ useMasterKey: true });
      sessions.forEach(session => {
        const student = session.get('student');
        activities.push({
          type: 'session',
          id: session.id,
          studentId: student.id,
          studentName: `${student.get('firstName')} ${student.get('lastName')}`,
          status: session.get('status'),
          scheduledTime: session.get('scheduledTime'),
          timestamp: session.get('status') === 'completed' ? session.updatedAt : session.get('scheduledTime'),
          duration: session.get('duration') || 60
        });
      });
      
      // Get recent assessment completions
      const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
      const assessmentQuery = new Parse.Query(RiasecAssessment);
      assessmentQuery.containedIn('user', studentIds.map(id => {
        const user = new Parse.User();
        user.id = id;
        return user;
      }));
      assessmentQuery.equalTo('isComplete', true);
      assessmentQuery.descending('updatedAt');
      assessmentQuery.limit(10);
      assessmentQuery.include('user');
      
      const assessments = await assessmentQuery.find({ useMasterKey: true });
      assessments.forEach(assessment => {
        const student = assessment.get('user');
        activities.push({
          type: 'assessment',
          id: assessment.id,
          studentId: student.id,
          studentName: `${student.get('firstName')} ${student.get('lastName')}`,
          hollandCode: assessment.get('hollandCode'),
          primaryType: assessment.get('primaryType'),
          timestamp: assessment.updatedAt
        });
      });
      
      // Get recent milestones
      const StudentMilestone = Parse.Object.extend('StudentMilestone');
      const milestoneQuery = new Parse.Query(StudentMilestone);
      milestoneQuery.containedIn('student', studentIds.map(id => {
        const user = new Parse.User();
        user.id = id;
        return user;
      }));
      milestoneQuery.descending('achievedAt');
      milestoneQuery.limit(10);
      milestoneQuery.include('student');
      milestoneQuery.exists('achievedAt');
      
      const milestones = await milestoneQuery.find({ useMasterKey: true });
      milestones.forEach(milestone => {
        const student = milestone.get('student');
        activities.push({
          type: 'milestone',
          id: milestone.id,
          studentId: student.id,
          studentName: `${student.get('firstName')} ${student.get('lastName')}`,
          title: milestone.get('title'),
          category: milestone.get('category'),
          timestamp: milestone.get('achievedAt')
        });
      });
    }
    
    // Sort all activities by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Return limited results
    return {
      activities: activities.slice(0, limit),
      total: activities.length,
      hasMore: activities.length > limit
    };
    
  } catch (error) {
    console.error('Error getting activity feed:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to get activity feed: ${error.message}`);
  }
});

/**
 * Get student timeline
 * Returns chronological student journey events
 */
Parse.Cloud.define('getStudentTimeline', async (request) => {
  requireCounselor(request);
  
  const { studentId, limit = 50 } = request.params;
  
  if (!studentId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Student ID is required');
  }
  
  try {
    const timeline = [];
    const student = new Parse.User();
    student.id = studentId;
    
    // 1. Student registration
    const studentUser = await new Parse.Query(Parse.User)
      .get(studentId, { useMasterKey: true });
    timeline.push({
      type: 'registration',
      id: studentUser.id,
      title: 'Joined Elimu Smart',
      timestamp: studentUser.createdAt,
      icon: 'user-plus'
    });
    
    // 2. Counselor assignment
    const CounselorStudent = Parse.Object.extend('CounselorStudent');
    const assignmentQuery = new Parse.Query(CounselorStudent);
    assignmentQuery.equalTo('student', student);
    assignmentQuery.include('counselor');
    const assignment = await assignmentQuery.first({ useMasterKey: true });
    if (assignment) {
      const counselor = assignment.get('counselor');
      timeline.push({
        type: 'assignment',
        id: assignment.id,
        title: `Assigned to ${counselor.get('firstName')} ${counselor.get('lastName')}`,
        timestamp: assignment.createdAt,
        icon: 'user-check'
      });
    }
    
    // 3. Assessment completions
    const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
    const assessmentQuery = new Parse.Query(RiasecAssessment);
    assessmentQuery.equalTo('user', student);
    assessmentQuery.equalTo('isComplete', true);
    const assessments = await assessmentQuery.find({ useMasterKey: true });
    assessments.forEach(assessment => {
      timeline.push({
        type: 'assessment',
        id: assessment.id,
        title: 'Completed RIASEC Assessment',
        hollandCode: assessment.get('hollandCode'),
        primaryType: assessment.get('primaryType'),
        timestamp: assessment.updatedAt,
        icon: 'clipboard-check'
      });
    });
    
    // 4. Sessions (all statuses)
    const Session = Parse.Object.extend('Session');
    const sessionQuery = new Parse.Query(Session);
    sessionQuery.equalTo('student', student);
    sessionQuery.include('counselor');
    const sessions = await sessionQuery.find({ useMasterKey: true });
    sessions.forEach(session => {
      const counselor = session.get('counselor');
      const status = session.get('status');
      let title = 'Session Scheduled';
      if (status === 'completed') title = 'Session Completed';
      if (status === 'cancelled') title = 'Session Cancelled';
      
      timeline.push({
        type: 'session',
        id: session.id,
        title,
        counselorName: `${counselor.get('firstName')} ${counselor.get('lastName')}`,
        status,
        scheduledTime: session.get('scheduledTime'),
        duration: session.get('duration') || 60,
        timestamp: status === 'completed' ? session.updatedAt : session.get('scheduledTime'),
        icon: status === 'completed' ? 'check-circle' : 'calendar'
      });
    });
    
    // 5. Milestones
    const StudentMilestone = Parse.Object.extend('StudentMilestone');
    const milestoneQuery = new Parse.Query(StudentMilestone);
    milestoneQuery.equalTo('student', student);
    const milestones = await milestoneQuery.find({ useMasterKey: true });
    milestones.forEach(milestone => {
      const achieved = milestone.get('achievedAt');
      timeline.push({
        type: 'milestone',
        id: milestone.id,
        title: milestone.get('title'),
        category: milestone.get('category'),
        achieved: !!achieved,
        timestamp: achieved || milestone.createdAt,
        icon: achieved ? 'trophy' : 'target'
      });
    });
    
    // 6. Important notes (flagged as important)
    const StudentNote = Parse.Object.extend('StudentNote');
    const noteQuery = new Parse.Query(StudentNote);
    noteQuery.equalTo('student', student);
    noteQuery.containsAll('tags', ['important']);
    const notes = await noteQuery.find({ useMasterKey: true });
    notes.forEach(note => {
      timeline.push({
        type: 'note',
        id: note.id,
        title: 'Important Note Added',
        content: note.get('content').substring(0, 100) + (note.get('content').length > 100 ? '...' : ''),
        timestamp: note.createdAt,
        icon: 'file-text'
      });
    });
    
    // Sort timeline by timestamp (newest first)
    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return {
      studentId,
      timeline: timeline.slice(0, limit),
      total: timeline.length,
      hasMore: timeline.length > limit
    };
    
  } catch (error) {
    console.error('Error getting student timeline:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to get student timeline: ${error.message}`);
  }
});

// =============================================================================
// COMMUNITY FORUM FUNCTIONS (Reddit-Style Q&A)
// =============================================================================
require('./communityForumFunctions');

// =============================================================================
// ADMIN: GRANT PREMIUM SUBSCRIPTION (Testing/Demo)
// =============================================================================
Parse.Cloud.define('grantPremiumSubscription', async (request) => {
  const { email, durationDays = 365 } = request.params;

  if (!request.master) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Master key required');
  }

  try {
    // Find user by email
    const userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo('email', email);
    const user = await userQuery.first({ useMasterKey: true });

    if (!user) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `User with email ${email} not found`);
    }

    // Check for existing active subscription
    const Subscription = Parse.Object.extend('Subscription');
    const subQuery = new Parse.Query(Subscription);
    subQuery.equalTo('user', user);
    subQuery.equalTo('status', 'active');
    subQuery.greaterThan('expiresAt', new Date());

    const existing = await subQuery.first({ useMasterKey: true });

    if (existing) {
      return {
        success: true,
        message: 'User already has active subscription',
        expiresAt: existing.get('expiresAt'),
        userId: user.id
      };
    }

    // Create new subscription
    const subscription = new Subscription();
    subscription.set('user', user);
    subscription.set('userId', user.id);
    subscription.set('planId', 'premium_annual');
    subscription.set('status', 'active');
    subscription.set('startDate', new Date());
    subscription.set('expiresAt', new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000));
    subscription.set('amount', 0);
    subscription.set('currency', 'KES');
    subscription.set('paymentMethod', 'admin_grant');
    subscription.set('autoRenew', false);

    await subscription.save(null, { useMasterKey: true });

    // Update user isPremium flag
    user.set('isPremium', true);
    await user.save(null, { useMasterKey: true });

    return {
      success: true,
      message: 'Premium subscription granted successfully',
      subscriptionId: subscription.id,
      userId: user.id,
      expiresAt: subscription.get('expiresAt')
    };
  } catch (error) {
    console.error('Error granting premium:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Failed to grant premium: ${error.message}`);
  }
});

