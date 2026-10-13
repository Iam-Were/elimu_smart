#!/usr/bin/env node
/**
 * journey-smoke-test.js — end-to-end smoke test of the core journeys as real logged-in users.
 *
 * WHY THIS EXISTS:
 * There is no test suite. smoke-test.js checks journey DATA is present (master key); this one
 * exercises real user sessions, writes (Q&A, chat, file upload) and security regressions.
 * Before upgrading parse-server / the Parse SDK (or deploying), run it against the old and new
 * versions and compare: anything that passed before must still pass.
 *
 * Usage:
 *   node scripts/journey-smoke-test.js                 # uses APP_ID / SERVER_URL from .env
 *   node scripts/journey-smoke-test.js --seed          # first creates the demo users (needs MASTER_KEY; local DBs only)
 *   SERVER_URL=http://localhost:1337/parse node scripts/journey-smoke-test.js
 *
 * Exits non-zero if any check fails.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Parse = require('parse/node');

const appId = process.env.APP_ID;
const serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';
const masterKey = process.env.MASTER_KEY;

if (!appId) {
  console.error('❌ APP_ID not set (.env). Aborting.');
  process.exit(1);
}

Parse.initialize(appId, null, masterKey);
Parse.serverURL = serverURL;

const ACCOUNTS = {
  student: { username: 'student@elimu.com', password: 'student', firstName: 'Alex', lastName: 'Mwangi', role: 'student' },
  counselor: { username: 'counselor@elimu.com', password: 'counselor', firstName: 'Grace', lastName: 'Wanjiku', role: 'counselor' },
  admin: { username: 'mike.platform@elimu.com', password: 'platform2024', firstName: 'Mike', lastName: 'Kamau', role: 'admin', adminRoleType: 'platform_admin' },
};

const results = [];
const userIds = {};

async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`✅ ${name}`);
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
    console.log(`❌ ${name} — ${error.message}`);
  }
}

// Expect a call to be rejected (security regression checks)
// A network failure (server down) is NOT a rejection — it means the server crashed.
async function expectRejected(promise) {
  try {
    await promise;
  } catch (error) {
    if (error.code === Parse.Error.CONNECTION_FAILED || /fetch failed|Unable to connect/.test(error.message)) {
      throw new Error(`server unreachable (crashed?): ${error.message}`);
    }
    return;
  }
  throw new Error('expected rejection but call succeeded');
}

async function seedUsers() {
  if (!masterKey) throw new Error('--seed needs MASTER_KEY');
  for (const account of Object.values(ACCOUNTS)) {
    const existing = await new Parse.Query(Parse.User).equalTo('username', account.username).first({ useMasterKey: true });
    if (existing) continue;
    const user = new Parse.User();
    for (const [key, value] of Object.entries(account)) user.set(key, value);
    user.set('email', account.username);
    user.set('isActive', true);
    await user.signUp(null, { useMasterKey: true });
    await Parse.User.logOut();
  }
  console.log('🌱 Demo users seeded\n');
}

async function loginAs(role) {
  const { username, password } = ACCOUNTS[role];
  const user = await Parse.User.logIn(username, password);
  userIds[role] = user.id;
  return user.getSessionToken();
}

const run = (fn, params, sessionToken) => Parse.Cloud.run(fn, params || {}, sessionToken ? { sessionToken } : {});

async function main() {
  console.log(`🔗 ${serverURL} (appId: ${appId})\n`);
  if (process.argv.includes('--seed')) await seedUsers();

  const tokens = {};
  for (const role of Object.keys(ACCOUNTS)) {
    await check(`login: ${role}`, async () => { tokens[role] = await loginAs(role); });
  }
  const student = tokens.student;
  const counselor = tokens.counselor;
  const admin = tokens.admin;

  // ── Student read paths (assessments, careers, universities, dashboard) ──
  const studentReads = [
    'getRiasecQuestions', 'getSkillsQuestions', 'getCareers', 'getCareerCategories', 'getUniversities',
    'getCourses', 'calculateProfileCompletion', 'getUserPreferences', 'getAllQuestions', 'getMyQuestions',
    'getAvailableCounselors', 'getSubscriptionPlans', 'getChatRooms', 'getMyBookings',
    'getKuccpsTimeline', 'getUserCareerGoals', 'getStudentNextSession',
  ];
  for (const fn of studentReads) await check(`student: ${fn}`, () => run(fn, {}, student));
  await check('student: checkTrialStatus', () => run('checkTrialStatus', { userId: userIds.student }, student));

  // ── Postgres adapter: plain query + count ──
  await check('db: Career query', async () => {
    await new Parse.Query('Career').limit(5).find({ sessionToken: student });
  });

  // ── Community Q&A: student asks, counselor answers ──
  let questionId;
  await check('qa: submitQuestion', async () => {
    const res = await run('submitQuestion', { question: `Smoke test question ${Date.now()}?`, category: 'career' }, student);
    questionId = res?.id || res?.objectId || res?.questionId || res?.question?.id || res?.question?.objectId;
    if (!questionId) throw new Error(`no question id in response: ${JSON.stringify(res).slice(0, 200)}`);
  });
  await check('qa: answerQuestion (counselor)', () => run('answerQuestion', { questionId, answer: 'Smoke test answer.' }, counselor));

  // ── Chat: create room, send, read back ──
  let chatRoomId;
  await check('chat: createChatRoom', async () => {
    const res = await run('createChatRoom', { participantIds: [userIds.student, userIds.counselor], title: 'Smoke test' }, student);
    chatRoomId = res?.id || res?.objectId || res?.chatRoomId || res?.chatRoom?.id || res?.chatRoom?.objectId;
    if (!chatRoomId) throw new Error(`no chat room id in response: ${JSON.stringify(res).slice(0, 200)}`);
  });
  await check('chat: sendMessage', () => run('sendMessage', { chatRoomId, message: 'Smoke test message' }, student));
  await check('chat: getChatMessages', () => run('getChatMessages', { chatRoomId }, student));

  // ── Files: authenticated upload ──
  await check('files: authenticated upload', async () => {
    const file = new Parse.File('smoke.txt', { base64: Buffer.from('smoke test').toString('base64') }, 'text/plain');
    await file.save({ sessionToken: student });
  });

  // ── Counselor + admin dashboards ──
  for (const fn of ['getCounselorDashboardStats', 'getCounselorPendingQuestions', 'getCounselorAssignedStudents']) {
    await check(`counselor: ${fn}`, () => run(fn, {}, counselor));
  }
  for (const fn of ['getAdminSystemMetrics', 'getAdminAuditLogs']) {
    await check(`admin: ${fn}`, () => run(fn, {}, admin));
  }

  // ── Security regressions: must be rejected ──
  await check('security: anonymous getMyBookings rejected', () => expectRejected(run('getMyBookings', {})));
  await check('security: non-participant sendMessage rejected', () => expectRejected(run('sendMessage', { chatRoomId, message: 'x' }, admin)));
  await check('security: anonymous sendMessage rejected', () => expectRejected(run('sendMessage', { chatRoomId, message: 'x' })));

  // Last: a malformed request must be rejected without taking the server down
  await check('security: sendMessage without chatRoomId rejected (server stays up)', async () => {
    await expectRejected(run('sendMessage', { message: 'x' }, student));
    await run('getChatRooms', {}, student);
  });

  const failed = results.filter(r => !r.ok);
  console.log(`\n━━━ ${results.length - failed.length}/${results.length} passed ━━━`);
  if (failed.length) {
    console.log('Failures:');
    for (const f of failed) console.log(`  - ${f.name}: ${f.error}`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Smoke test crashed:', error);
  process.exit(1);
});
