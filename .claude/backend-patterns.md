# Backend Implementation Patterns - Elimu Smart

Referenced from CLAUDE.md → "Backend Implementation Patterns"

## Parse Cloud Function Modules (CRITICAL)

```javascript
// ❌ NEVER: Local Parse require in cloud function modules
const Parse = require('parse/node');

// ✅ REQUIRED: Use global Parse from main.js (NO require needed)
Parse.Cloud.define('myFunction', async () => {
  const query = new Parse.Query('MyClass');
  return await query.find({ useMasterKey: true });
});
```

**Why:** Cloud modules are loaded AFTER Parse is globally initialized. Local require creates conflicts.

## Schema Creation Pattern

```javascript
// ✅ Dummy Object Pattern (when Schema API fails with "unauthorized")
Parse.Cloud.define('initializeSchema', async () => {
  const MyClass = Parse.Object.extend('MyClass');
  const dummy = new MyClass();

  dummy.set('field1', 'string');
  dummy.set('field2', 0);
  dummy.set('isDeleted', true); // Hide dummy record

  await dummy.save(null, { useMasterKey: true }); // PostgreSQL auto-creates table
  return { success: true };
});
```

## Chat Authorization (CRITICAL Security)

```javascript
// ✅ REQUIRED: Verify user is participant BEFORE returning messages
Parse.Cloud.define('getChatMessages', async (request) => {
  const { chatRoomId } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  // Get chat room and verify participant
  const chatRoom = await new Parse.Query('ChatRoom').get(chatRoomId, { useMasterKey: true });
  const participants = chatRoom.get('participants') || [];

  if (!participants.includes(user.id)) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Access denied');
  }

  // NOW safe to return messages
  const query = new Parse.Query('ChatMessage');
  query.equalTo('chatRoom', chatRoom);
  return await query.find({ useMasterKey: true });
});

// ✅ Defense-in-depth: Add beforeFind hook
Parse.Cloud.beforeFind('ChatMessage', async (request) => {
  const user = request.user;
  if (!user) throw new Parse.Error(Parse.Error.SESSION_MISSING, 'Auth required');

  const chatRoomId = request.query._where?.chatRoom?.objectId;
  if (chatRoomId) {
    const room = await new Parse.Query('ChatRoom').get(chatRoomId, { useMasterKey: true });
    if (!room.get('participants').includes(user.id)) {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Access denied');
    }
  }
  return request.query;
});
```

**Why Both Layers:** Cloud function protects Parse.Cloud.run() calls, beforeFind hook protects direct client queries.

## Environment Credentials

```bash
# Development:
APP_ID=elimu_smart_app_2024

# Production VPS:
APP_ID=elimu-smart-production  # DIFFERENT!

# Check VPS credentials before debugging:
ssh ubuntu@3.91.52.5 'grep "^APP_ID=" /home/ubuntu/elimu_smart/backend/.env'
```
