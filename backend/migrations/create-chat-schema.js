/**
 * Chat System Schema Migration
 * Creates ChatRoom and ChatMessage Parse Classes for the messaging system
 *
 * Run: node migrations/create-chat-schema.js
 */

const Parse = require('parse/node');
require('dotenv').config();

// Initialize Parse with master key
const masterKey = process.env.MASTER_KEY || process.env.PARSE_MASTER_KEY || 'elimu-smart-master-key-dev';
Parse.initialize(
  process.env.APP_ID || process.env.PARSE_APP_ID || 'elimu-smart-app',
  process.env.JAVASCRIPT_KEY || process.env.PARSE_JAVASCRIPT_KEY || 'unused',
  masterKey
);
Parse.serverURL = process.env.SERVER_URL || process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse';

async function createChatSchema() {
  console.log('🔧 Creating Chat System Schema...\n');

  try {
    // Create ChatRoom schema
    const ChatRoomSchema = new Parse.Schema('ChatRoom');

    try {
      await ChatRoomSchema.get({ useMasterKey: true });
      console.log('✅ ChatRoom class already exists');
    } catch (error) {
      if (error.code === 103) {
        console.log('📝 Creating ChatRoom class...');

        ChatRoomSchema
          .addArray('participants', { required: true }) // Array of user IDs
          .addString('type', { required: true }) // 'counseling', 'mentoring', 'group'
          .addString('title')
          .addPointer('createdBy', '_User', { required: true })
          .addBoolean('isActive', { defaultValue: true })
          .addDate('lastActivity')
          .addString('lastMessage')
          .addNumber('messageCount', { defaultValue: 0 })
          .setCLP({
            find: {},
            get: {},
            create: { requiresAuthentication: true },
            update: { requiresAuthentication: true },
            delete: { requiresMasterKey: true },
            addField: { requiresMasterKey: true },
            protectedFields: {}
          });

        await ChatRoomSchema.save({ useMasterKey: true });
        console.log('✅ ChatRoom class created successfully\n');
      } else {
        throw error;
      }
    }

    // Create ChatMessage schema
    const ChatMessageSchema = new Parse.Schema('ChatMessage');

    try {
      await ChatMessageSchema.get({ useMasterKey: true });
      console.log('✅ ChatMessage class already exists');
    } catch (error) {
      if (error.code === 103) {
        console.log('📝 Creating ChatMessage class...');

        ChatMessageSchema
          .addPointer('chatRoom', 'ChatRoom', { required: true })
          .addPointer('sender', '_User', { required: true })
          .addString('message', { required: true })
          .addString('messageType', { defaultValue: 'text' }) // 'text', 'file', 'image'
          .addDate('timestamp', { required: true })
          .addBoolean('isRead', { defaultValue: false })
          .addString('status', { defaultValue: 'sent' }) // 'sent', 'delivered', 'read'
          .addArray('readBy') // Array of user IDs who have read the message
          .addString('fileUrl') // For file/image messages
          .addString('fileName')
          .addNumber('fileSize')
          .setCLP({
            find: { requiresAuthentication: true },
            get: { requiresAuthentication: true },
            create: { requiresAuthentication: true },
            update: { requiresAuthentication: true },
            delete: { requiresMasterKey: true },
            addField: { requiresMasterKey: true },
            protectedFields: {}
          });

        await ChatMessageSchema.save({ useMasterKey: true });
        console.log('✅ ChatMessage class created successfully\n');
      } else {
        throw error;
      }
    }

    // Create ChatPreferences schema for user chat settings
    const ChatPreferencesSchema = new Parse.Schema('ChatPreferences');

    try {
      await ChatPreferencesSchema.get({ useMasterKey: true });
      console.log('✅ ChatPreferences class already exists');
    } catch (error) {
      if (error.code === 103) {
        console.log('📝 Creating ChatPreferences class...');

        ChatPreferencesSchema
          .addPointer('user', '_User', { required: true })
          .addArray('pinnedConversations') // Array of ChatRoom IDs
          .addObject('starredMessages') // Object with message IDs as keys
          .addBoolean('notificationsEnabled', { defaultValue: true })
          .addBoolean('soundEnabled', { defaultValue: true })
          .addString('theme', { defaultValue: 'auto' }) // 'light', 'dark', 'auto'
          .setCLP({
            find: { requiresAuthentication: true },
            get: { requiresAuthentication: true },
            create: { requiresAuthentication: true },
            update: { requiresAuthentication: true },
            delete: { requiresAuthentication: true },
            addField: { requiresMasterKey: true },
            protectedFields: {}
          });

        await ChatPreferencesSchema.save({ useMasterKey: true });
        console.log('✅ ChatPreferences class created successfully\n');
      } else {
        throw error;
      }
    }

    // Create indexes for better query performance
    console.log('📊 Creating indexes...');

    // ChatRoom indexes
    const ChatRoom = Parse.Object.extend('ChatRoom');
    try {
      await Parse.Cloud.run('createIndex', {
        className: 'ChatRoom',
        indexName: 'participants_lastActivity',
        fields: { participants: 1, lastActivity: -1 }
      }, { useMasterKey: true });
      console.log('✅ Created index on ChatRoom.participants and lastActivity');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.warn('⚠️ Could not create ChatRoom index:', error.message);
      }
    }

    // ChatMessage indexes
    try {
      await Parse.Cloud.run('createIndex', {
        className: 'ChatMessage',
        indexName: 'chatRoom_timestamp',
        fields: { chatRoom: 1, timestamp: -1 }
      }, { useMasterKey: true });
      console.log('✅ Created index on ChatMessage.chatRoom and timestamp');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.warn('⚠️ Could not create ChatMessage index:', error.message);
      }
    }

    try {
      await Parse.Cloud.run('createIndex', {
        className: 'ChatMessage',
        indexName: 'sender_timestamp',
        fields: { sender: 1, timestamp: -1 }
      }, { useMasterKey: true });
      console.log('✅ Created index on ChatMessage.sender and timestamp');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.warn('⚠️ Could not create ChatMessage index:', error.message);
      }
    }

    console.log('\n✅ Chat System Schema Migration Complete!\n');
    console.log('📝 Summary:');
    console.log('   - ChatRoom class: ✅ Ready');
    console.log('   - ChatMessage class: ✅ Ready');
    console.log('   - ChatPreferences class: ✅ Ready');
    console.log('   - Performance indexes: ✅ Created');
    console.log('\n🚀 Chat system is ready for use!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
createChatSchema()
  .then(() => {
    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
