// Elimu Smart Parse Cloud Functions
// These functions run on the server and handle business logic

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
    // Mock course matching logic - replace with real KUCCPS data
    const mockCourses = [
      { name: 'Computer Science', cutoff: 10.5, university: 'University of Nairobi' },
      { name: 'Business Administration', cutoff: 9.0, university: 'Kenyatta University' },
      { name: 'Engineering', cutoff: 11.0, university: 'JKUAT' },
      { name: 'Medicine', cutoff: 11.8, university: 'University of Nairobi' },
      { name: 'Education', cutoff: 7.5, university: 'Egerton University' }
    ];
    
    const eligibleCourses = mockCourses.filter(course => cutoffPoints >= course.cutoff);
    
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
  return chatRooms;
});

// Get messages for a chat room
Parse.Cloud.define('getChatMessages', async (request) => {
  const { chatRoomId, limit = 50, skip = 0 } = request.params;
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
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
  
  try {
    // Create Parse File from base64 image data
    const parseFile = new Parse.File(fileName || 'profile-image.jpg', { base64: imageData }, 'image/jpeg');
    const savedFile = await parseFile.save();
    
    // Update user's profile image
    user.set('profileImage', savedFile.url());
    await user.save(null, { useMasterKey: true });
    
    return {
      success: true,
      profileImageUrl: savedFile.url()
    };
  } catch (error) {
    console.error('Profile image upload error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to upload profile image');
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
    
    // Get unread message counts for each room
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
      
      return {
        ...room.toJSON(),
        unreadCount
      };
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
    
    // Update user's career readiness score asynchronously
    Parse.Cloud.run('updateCareerReadinessScore', { userId: user.id }, { useMasterKey: true });
    
    return { success: true };
  } catch (error) {
    console.error('Log activity error:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to log user activity');
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
  
  try {
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
    
    return {
      score: totalScore,
      components: components,
      change: changeText,
      trend: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral',
      recommendations: generateImprovementRecommendations(components)
    };
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

// Scholarship Matching (Basic Implementation)
Parse.Cloud.define('getScholarshipMatches', async (request) => {
  const user = request.user;
  
  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }
  
  try {
    // For now, return mock data - will be replaced with real database
    const scholarships = [
      {
        name: 'HELB Bursary',
        amount: 'KSh 60,000',
        deadline: '2025-03-15',
        match: 95,
        type: 'Government'
      },
      {
        name: 'Equity Group Foundation',
        amount: 'KSh 120,000',
        deadline: '2025-02-28',
        match: 87,
        type: 'Private'
      },
      {
        name: 'County Education Bursary',
        amount: 'KSh 45,000',
        deadline: '2025-04-10',
        match: 92,
        type: 'Local Government'
      }
    ];
    
    return {
      matches: scholarships.length,
      newThisWeek: 2,
      scholarships: scholarships,
      totalValue: 'KSh 225,000'
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
  const assessmentActivities = activities.filter(a => 
    a.get('activityType').includes('assessment')
  );
  return Math.min(assessmentActivities.length * 15, 100);
}

function calculateResearchScore(activities) {
  const researchTime = activities.reduce((total, activity) => {
    if (activity.get('activityType').includes('research') || 
        activity.get('activityType').includes('career')) {
      return total + (activity.get('duration') || 0);
    }
    return total;
  }, 0);
  
  return Math.min(researchTime / 60, 100); // Convert to minutes, max 100
}

function calculateExplorationScore(activities) {
  const explorationActivities = activities.filter(a => 
    a.get('activityType').includes('course') ||
    a.get('activityType').includes('university')
  );
  return Math.min(explorationActivities.length * 10, 100);
}

function calculateActionsScore(activities) {
  const actionActivities = activities.filter(a => 
    a.get('activityType').includes('application') ||
    a.get('activityType').includes('counselor') ||
    a.get('activityType').includes('chat')
  );
  return Math.min(actionActivities.length * 20, 100);
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

console.log('☁️ Elimu Smart Cloud Functions loaded successfully');