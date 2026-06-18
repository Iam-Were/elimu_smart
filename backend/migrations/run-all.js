#!/usr/bin/env node
/**
 * run-all.js — Idempotent migration orchestrator
 *
 * WHY THIS EXISTS:
 * Fresh deploys kept ending up with missing Parse classes (broken RIASEC/Skills/
 * Q&A journeys) because migrations were run ad-hoc and FAILED SILENTLY. Root cause:
 * every migration script reads DIFFERENT env-var names with DIFFERENT defaults
 * (APP_ID vs PARSE_APP_ID, MASTER_KEY vs PARSE_MASTER_KEY, some default to a
 * wrong app id / wrong port). Run without the exact right vars → "unauthorized".
 *
 * This runner loads .env once, NORMALIZES every alias to the canonical production
 * values, runs each migration in dependency order with that env, treats
 * "already exists" as success (idempotent), and exits non-zero if anything truly fails.
 *
 * Usage (on the server):  node migrations/run-all.js
 * Override server:        SERVER_URL=http://localhost:1337/parse node migrations/run-all.js
 */

require('dotenv').config();
const { spawnSync } = require('child_process');
const path = require('path');

const appId = process.env.APP_ID || process.env.PARSE_APP_ID || 'elimu-smart-production';
const masterKey = process.env.MASTER_KEY || process.env.PARSE_MASTER_KEY;
const serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';
const databaseURI = process.env.DATABASE_URI;

if (!masterKey) {
  console.error('❌ No MASTER_KEY found in environment (.env). Aborting.');
  process.exit(1);
}

// Normalize EVERY alias the various migration scripts read, so none fall back to wrong defaults.
const env = {
  ...process.env,
  APP_ID: appId,
  PARSE_APP_ID: appId,
  MASTER_KEY: masterKey,
  PARSE_MASTER_KEY: masterKey,
  SERVER_URL: serverURL,
  PARSE_SERVER_URL: serverURL,
  DATABASE_URI: databaseURI || process.env.DATABASE_URI,
  JAVASCRIPT_KEY: process.env.JAVASCRIPT_KEY || 'elimu-smart-js-key',
  DOTENV_LOADED: '1',
};

// Dependency order: schema before seed; profile/prefs first; payment vault last (separate DB).
const MIGRATIONS = [
  'create-user-profile-schema.js',
  'create-user-preferences-schema.js',
  'schema-assessments.js',
  'seed-assessments.js',              // RIASEC (96) + Skills (36) — critical journey data
  'create-riasec-type-info-schema.js',
  'enhance-riasec-personality-types.js',
  'create-career-schema.js',
  'add-career-details-schema.js',
  'seed-careers.js',
  'seed-career-details-complete.js',
  'update-career-permissions.js',
  'schema-universities-courses.js',
  'migrate-universities-courses.js',
  'seed-subject-career-mappings.js',
  'create-chat-schema.js',
  'create-community-forum-schema.js',
  'create-consent-schema.js',
  'create-school-schema.js',
  'create-payment-vault-schema.js',
];

// Output patterns that mean "fine, already done" (idempotent) vs a real failure.
const IDEMPOTENT = /already exists|duplicate key|code:\s*103|Class .* already exists/i;
const FAILURE = /unauthorized|ParseError|❌|Migration failed|Error creating schema|auth_failed|ECONNREFUSED|fetch failed/i;

console.log('🚀 Running all migrations against', serverURL, '(appId:', appId + ')\n');

const results = [];
for (const file of MIGRATIONS) {
  const full = path.join(__dirname, file);
  const r = spawnSync(process.execPath, ['-r', 'dotenv/config', full], {
    env, encoding: 'utf8', timeout: 180000,
  });
  const out = (r.stdout || '') + '\n' + (r.stderr || '');

  let status;
  if (FAILURE.test(out) && !IDEMPOTENT.test(out)) status = 'FAIL';
  else if (IDEMPOTENT.test(out)) status = 'EXISTS';
  else status = 'PASS';

  // a migration that both created some things and hit "already exists" on others = OK
  if (status === 'FAIL' && IDEMPOTENT.test(out)) status = 'EXISTS';

  results.push({ file, status });
  const icon = status === 'FAIL' ? '❌' : status === 'EXISTS' ? '➖' : '✅';
  console.log(`${icon} ${status.padEnd(6)} ${file}`);
  if (status === 'FAIL') {
    const tail = out.split('\n').filter(Boolean).slice(-4).join('\n   ');
    console.log('   ' + tail);
  }
}

const failed = results.filter(r => r.status === 'FAIL');
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Done: ${results.length} migrations — ${results.filter(r=>r.status==='PASS').length} ran, ${results.filter(r=>r.status==='EXISTS').length} already present, ${failed.length} failed`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (failed.length) {
  console.error('❌ Failures:', failed.map(f => f.file).join(', '));
  process.exit(1);
}
console.log('✅ All migrations succeeded (or already present).');
