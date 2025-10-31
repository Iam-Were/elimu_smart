const Parse = require('parse/node');
require('dotenv').config();

Parse.initialize(
  process.env.APP_ID || 'elimu-smart-app',
  null,
  process.env.MASTER_KEY || 'elimu-smart-master-key-dev'
);
Parse.serverURL = 'http://localhost:1337/parse';

async function sendTestMessage() {
  console.log('📤 Testing Message Send: Student → Counselor\n');
  
  // Get student user
  const userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo('email', 'student@elimu.com');
  const student = await userQuery.first({ useMasterKey: true });
  
  if (!student) {
    console.error('❌ Student not found');
    return;
  }
  
  console.log('✅ Student:', student.get('email'), '(ID:', student.id + ')');
  
  // Get the chat room
  const ChatRoom = Parse.Object.extend('ChatRoom');
  const roomQuery = new Parse.Query(ChatRoom);
  roomQuery.equalTo('isActive', true);
  const chatRoom = await roomQuery.first({ useMasterKey: true });
  
  if (!chatRoom) {
    console.error('❌ Chat room not found');
    return;
  }
  
  console.log('✅ Chat room:', chatRoom.id);
  console.log('   Participants:', chatRoom.get('participants'));
  
  // Create message directly
  console.log('\n📝 Sending test message...');
  
  const ChatMessage = Parse.Object.extend('ChatMessage');
  const message = new ChatMessage();
  
  message.set('chatRoom', chatRoom);
  message.set('sender', student);
  message.set('message', 'Hello! This is a test message from the student account. Can you help me with career guidance? 🎓');
  message.set('messageType', 'text');
  message.set('timestamp', new Date());
  message.set('isRead', false);
  message.set('status', 'sent');
  
  await message.save(null, { useMasterKey: true });
  
  console.log('✅ Message sent successfully!');
  console.log('   Message ID:', message.id);
  console.log('   Timestamp:', message.get('timestamp'));
  
  // Update chat room
  chatRoom.set('lastActivity', new Date());
  chatRoom.set('lastMessage', message.get('message'));
  chatRoom.increment('messageCount');
  await chatRoom.save(null, { useMasterKey: true });
  
  console.log('\n📬 Chat Room Updated:');
  console.log('   Last Message:', chatRoom.get('lastMessage'));
  console.log('   Message Count:', chatRoom.get('messageCount'));
  
  // Count total messages
  const msgQuery = new Parse.Query(ChatMessage);
  msgQuery.equalTo('chatRoom', chatRoom);
  const totalMessages = await msgQuery.count({ useMasterKey: true });
  
  console.log('\n📊 Database Status:');
  console.log('   Total Messages in Room:', totalMessages);
  
  console.log('\n✅ TEST PASSED: Message sent successfully!');
  console.log('\n🔗 Next Steps:');
  console.log('   1. Login as counselor: https://elimu-smart.co.ke/login');
  console.log('      Email: counselor@elimu.com / Password: counselor');
  console.log('   2. Go to Inbox: https://elimu-smart.co.ke/inbox');
  console.log('   3. You should see 1 unread message from student');
}

sendTestMessage().then(() => process.exit(0)).catch(e => { console.error('Error:', e); process.exit(1); });
