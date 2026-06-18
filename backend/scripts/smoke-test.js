#!/usr/bin/env node
/**
 * smoke-test.js — Post-deploy journey health check
 *
 * WHY THIS EXISTS:
 * Migrations can fail silently, leaving the live site with missing classes and
 * broken journeys (RIASEC/Skills returned "Failed to fetch" while the deploy looked
 * fine). This calls the real journey cloud functions over REST and asserts each
 * returns usable data. Run after every deploy — turns a silent data outage into a
 * loud non-zero exit.
 *
 * Usage:
 *   node scripts/smoke-test.js                       # uses .env (prod)
 *   BASE_URL=https://elimu-smart.co.ke/parse node scripts/smoke-test.js
 */

require('dotenv').config();

const APP_ID = process.env.APP_ID || process.env.PARSE_APP_ID || 'elimu-smart-production';
const MASTER_KEY = process.env.MASTER_KEY || process.env.PARSE_MASTER_KEY;
const BASE = process.env.BASE_URL || process.env.SERVER_URL || 'http://localhost:1337/parse';

if (!MASTER_KEY) { console.error('❌ No MASTER_KEY in env.'); process.exit(1); }

async function callFn(name, params = {}) {
  const res = await fetch(`${BASE}/functions/${name}`, {
    method: 'POST',
    headers: {
      'X-Parse-Application-Id': APP_ID,
      'X-Parse-Master-Key': MASTER_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return res.json();
}

// Each check: fn + params + predicate that must hold for the journey to be healthy.
const CHECKS = [
  ['RIASEC questions', 'getRiasecQuestions', {}, r => Array.isArray(r.result) && r.result.length >= 60],
  ['Skills questions', 'getSkillsQuestions', {}, r => Array.isArray(r.result) && r.result.length >= 30],
  ['RIASEC type info', 'getRiasecTypeInfo', {}, r => r.result && Array.isArray(r.result.types) && r.result.types.length === 6],
  ['Career explorer', 'exploreCareers', {}, r => r.result && Array.isArray(r.result.careers) && r.result.careers.length > 0],
  ['Subject mapper', 'getCareersBySubject', { subject: 'Mathematics' }, r => Array.isArray(r.result) && r.result.length > 0],
  ['Community Q&A', 'getAllQuestions', {}, r => r.result && Array.isArray(r.result.questions)],
];

(async () => {
  console.log('🔎 Smoke-testing journeys against', BASE, '\n');
  let failed = 0;
  for (const [label, fn, params, ok] of CHECKS) {
    try {
      const r = await callFn(fn, params);
      const pass = ok(r);
      console.log(`${pass ? '✅' : '❌'} ${label.padEnd(20)} (${fn})${pass ? '' : '  → ' + JSON.stringify(r).slice(0, 120)}`);
      if (!pass) failed++;
    } catch (e) {
      console.log(`❌ ${label.padEnd(20)} (${fn})  → ${e.message}`);
      failed++;
    }
  }
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (failed) {
    console.error(`❌ ${failed}/${CHECKS.length} journey checks FAILED — the live site has broken journeys.`);
    process.exit(1);
  }
  console.log(`✅ All ${CHECKS.length} journey checks passed.`);
})();
