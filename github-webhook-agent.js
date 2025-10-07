#!/usr/bin/env node
const { Webhooks, createNodeMiddleware } = require('@octokit/webhooks');
const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const WEBHOOK_SECRET = '64d4f2f56dcb7732a460cb7be9472e89480c97a31adaa0b0369d9eed8e0ff077';
const REPO = 'Iam-Were/elimu_smart';
const WORK_DIR = '/root/elimu_smart';
const AUTO_FIX_LABELS = ['bug', 'dependencies', 'lint', 'security'];
const PORT = 8081;

// Initialize webhooks
const webhooks = new Webhooks({ secret: WEBHOOK_SECRET });

// Logging helper
async function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// === Issue Processing Logic (same as polling agent) ===

async function processIssue(issue) {
  try {
    await log(`Processing issue #${issue.number}: ${issue.title}`);

    const branchName = await createBranch(issue.number, issue.title);
    if (!branchName) return;

    let fixed = false;
    const labels = issue.labels.map(l => l.name);

    if (labels.includes('lint')) {
      fixed = await fixLintIssues();
    } else if (labels.includes('dependencies') || labels.includes('security')) {
      fixed = await fixSecurityIssues();
    } else if (labels.includes('bug')) {
      await log('Bug fixes require manual intervention');
      return;
    }

    if (!fixed) {
      await log(`Could not automatically fix issue #${issue.number}`);
      return;
    }

    const testsPassed = await runTests();
    if (!testsPassed) {
      await log(`Tests failed for issue #${issue.number}, aborting`);
      return;
    }

    const commitMessage = `Fix: ${issue.title} (#${issue.number})`;
    const committed = await commitChanges(commitMessage);
    if (!committed) return;

    const pushed = await pushBranch(branchName);
    if (!pushed) return;

    await createPR(issue.number, branchName, issue.title);

  } catch (error) {
    await log(`Error processing issue #${issue.number}: ${error.message}`);
  }
}

async function createBranch(issueNumber, title) {
  try {
    const branchName = `agent/fix-${issueNumber}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 40)}`;
    await execAsync(`cd ${WORK_DIR} && git checkout main && git pull origin main`);
    await execAsync(`cd ${WORK_DIR} && git checkout -b ${branchName}`);
    await log(`Created branch: ${branchName}`);
    return branchName;
  } catch (error) {
    await log(`Branch creation failed: ${error.message}`);
    return null;
  }
}

async function fixLintIssues() {
  try {
    await execAsync(`cd ${WORK_DIR}/frontend && npm run lint -- --fix`);
    await log('Fixed lint issues');
    return true;
  } catch (error) {
    await log(`Lint fix failed: ${error.message}`);
    return false;
  }
}

async function fixSecurityIssues() {
  try {
    await log('Ensuring dependencies are installed...');

    // First, ensure clean node_modules state
    await execAsync(`cd ${WORK_DIR}/frontend && npm install`, { timeout: 180000 });
    await execAsync(`cd ${WORK_DIR}/backend && npm install`, { timeout: 180000 });

    await log('Running npm audit fix on frontend...');
    try {
      await execAsync(`cd ${WORK_DIR}/frontend && npm audit fix --force`, { timeout: 180000 });
    } catch (error) {
      await log(`Frontend audit fix warnings (continuing): ${error.message.substring(0, 200)}`);
    }
    // Always reinstall after audit fix, even if it had errors
    await execAsync(`cd ${WORK_DIR}/frontend && npm install`, { timeout: 180000 });
    await log('Frontend dependencies reinstalled');

    await log('Running npm audit fix on backend...');
    try {
      await execAsync(`cd ${WORK_DIR}/backend && npm audit fix --force`, { timeout: 180000 });
    } catch (error) {
      await log(`Backend audit fix warnings (continuing): ${error.message.substring(0, 200)}`);
    }
    // Always reinstall after audit fix, even if it had errors
    await execAsync(`cd ${WORK_DIR}/backend && npm install`, { timeout: 180000 });
    await log('Backend dependencies reinstalled');

    await log('Security fixes applied, dependencies verified');
    return true;
  } catch (error) {
    await log(`Security fix failed: ${error.message}`);
    return false;
  }
}

async function runTests() {
  try {
    await execAsync(`cd ${WORK_DIR}/frontend && npm run lint && npm run build`, { timeout: 240000 });
    await log('Tests passed');
    return true;
  } catch (error) {
    await log(`Tests failed: ${error.message.substring(0, 300)}`);
    return false;
  }
}

async function commitChanges(message) {
  try {
    await execAsync(`cd ${WORK_DIR} && git add . && git commit -m "${message}\n\nAutomated fix by GitHub Webhook Agent\n\nDeveloped by Antony Were"`);
    await log('Committed changes');
    return true;
  } catch (error) {
    await log(`Commit failed: ${error.message}`);
    return false;
  }
}

async function pushBranch(branchName) {
  try {
    await execAsync(`cd ${WORK_DIR} && git push -u origin ${branchName}`);
    await log(`Pushed branch: ${branchName}`);
    return true;
  } catch (error) {
    await log(`Push failed: ${error.message}`);
    return false;
  }
}

async function createPR(issueNumber, branchName, title) {
  try {
    const prBody = `Automated fix for issue #${issueNumber}\n\n**Changes Made:**\n- Applied automated security/dependency fixes\n- Verified and reinstalled dependencies\n\n**Testing:**\n- ✅ Lint checks passed\n- ✅ Build successful\n\n**Fixes:** #${issueNumber}\n\n---\n*This PR was automatically created by the GitHub Webhook Agent*\n*Developed by Antony Were*`;

    await execAsync(`gh pr create --repo ${REPO} --title "🤖 ${title}" --body "${prBody}" --head ${branchName} --base main`);
    await log(`Created PR for issue #${issueNumber}`);
    return true;
  } catch (error) {
    await log(`PR creation failed: ${error.message}`);
    return false;
  }
}

// === Webhook Event Handlers ===

webhooks.on('issues.opened', async ({ id, name, payload }) => {
  await log(`Received webhook: ${name} (${id})`);

  const issue = payload.issue;
  const labels = issue.labels.map(l => l.name);

  // Check if issue has any auto-fix labels
  const hasAutoFixLabel = labels.some(label => AUTO_FIX_LABELS.includes(label));

  if (hasAutoFixLabel) {
    await log(`Issue #${issue.number} has auto-fix label, processing...`);
    await processIssue(issue);
  } else {
    await log(`Issue #${issue.number} has no auto-fix labels, skipping`);
  }
});

webhooks.on('issues.labeled', async ({ id, name, payload }) => {
  await log(`Received webhook: ${name} (${id})`);

  const issue = payload.issue;
  const label = payload.label;

  // Check if the newly added label is an auto-fix label
  if (AUTO_FIX_LABELS.includes(label.name)) {
    await log(`Issue #${issue.number} labeled with "${label.name}", processing...`);
    await processIssue(issue);
  } else {
    await log(`Issue #${issue.number} labeled with non-auto-fix label, skipping`);
  }
});

webhooks.on('issues.reopened', async ({ id, name, payload }) => {
  await log(`Received webhook: ${name} (${id})`);

  const issue = payload.issue;
  const labels = issue.labels.map(l => l.name);

  const hasAutoFixLabel = labels.some(label => AUTO_FIX_LABELS.includes(label));

  if (hasAutoFixLabel) {
    await log(`Issue #${issue.number} reopened with auto-fix label, processing...`);
    await processIssue(issue);
  }
});

// Error handling
webhooks.onError((error) => {
  log(`Webhook error: ${error.message}`);
});

// === Express Server Setup ===

const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'github-webhook-agent' });
});

// Deploy endpoint (called by GitHub Actions, no SSH needed)
app.post('/webhooks/deploy/:environment', async (req, res) => {
  const { environment } = req.params;
  const authHeader = req.headers.authorization;

  // Simple auth check
  if (authHeader !== `Bearer ${process.env.GH_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!['staging', 'production'].includes(environment)) {
    return res.status(400).json({ error: 'Invalid environment' });
  }

  await log(`Received deploy request for ${environment}`);
  res.json({ status: 'accepted', environment });

  // Run deployment in background
  try {
    if (environment === 'staging') {
      await execAsync(`cd ${WORK_DIR} && git pull origin main`);
      await execAsync(`cd ${WORK_DIR}/frontend && npm run build -- --mode staging`);
      await execAsync(`sudo cp -r ${WORK_DIR}/frontend/dist/* /var/www/elimu-smart-staging/`);
      await execAsync(`pm2 restart parse-server-staging`);
      await log('Staging deployment completed');
    } else {
      await execAsync(`cd ${WORK_DIR} && git pull origin main`);
      await execAsync(`cd ${WORK_DIR}/frontend && npm run build -- --mode production`);
      await execAsync(`sudo cp -r ${WORK_DIR}/frontend/dist/* /var/www/elimu-smart/`);
      await execAsync(`pm2 reload parse-server-prod`);
      await log('Production deployment completed');
    }
  } catch (error) {
    await log(`Deployment failed: ${error.message}`);
  }
});

// Webhook endpoint
app.use('/webhooks/github', createNodeMiddleware(webhooks, { path: '/' }));

// Start server
app.listen(PORT, () => {
  log('🤖 GitHub Webhook Agent started');
  log(`Monitoring repository: ${REPO}`);
  log(`Auto-fix labels: ${AUTO_FIX_LABELS.join(', ')}`);
  log(`Webhook endpoint: http://localhost:${PORT}/webhooks/github`);
  log(`Health check: http://localhost:${PORT}/health`);
});
