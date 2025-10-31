const Parse = require('parse/node');
require('dotenv').config();

Parse.initialize(
  process.env.APP_ID || 'elimu-smart-app',
  null,
  process.env.MASTER_KEY || 'elimu-smart-master-key-dev'
);
Parse.serverURL = 'http://localhost:1337/parse';

async function createChatSchema() {
  console.log('Creating Chat Schema...');
  
  // Create ChatRoom class
  const ChatRoom = Parse.Object.extend('ChatRoom');
  const testRoom = new ChatRoom();
  testRoom.set('test', true);
  await testRoom.save(null, { useMasterKey: true });
  await testRoom.destroy({ useMasterKey: true });
  console.log('✅ ChatRoom class created');
  
  // Create ChatMessage class
  const ChatMessage = Parse.Object.extend('ChatMessage');
  const testMsg = new ChatMessage();
  testMsg.set('test', true);
  await testMsg.save(null, { useMasterKey: true });
  await testMsg.destroy({ useMasterKey: true });
  console.log('✅ ChatMessage class created');
  
  // Create ChatPreferences class
  const ChatPreferences = Parse.Object.extend('ChatPreferences');
  const testPref = new ChatPreferences();
  testPref.set('test', true);
  await testPref.save(null, { useMasterKey: true });
  await testPref.destroy({ useMasterKey: true });
  console.log('✅ ChatPreferences class created');
  
  console.log('\n✅ Chat System Schema Created!');
}

createChatSchema().then(() => process.exit(0)).catch(e => { console.error('Error:', e); process.exit(1); });
