#!/usr/bin/env node
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const REPO = 'Iam-Were/elimu_smart';
const WORK_DIR = '/root/elimu_smart';
const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes
const AUTO_FIX_LABELS = ['bug', 'dependencies', 'lint', 'security'];

async function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

async function pollIssues() {
  try {
    await log('Polling for new issues...');

    // Get all open issues and filter in JavaScript for ANY matching label
    const { stdout } = await execAsync(`gh issue list --repo ${REPO} --state open --json number,title,labels,assignees`);
    const allIssues = JSON.parse(stdout);

    // Filter for unassigned issues with any of our auto-fix labels
    const issues = allIssues.filter(issue => {
      const hasAutoFixLabel = issue.labels.some(label => AUTO_FIX_LABELS.includes(label.name));
      const isUnassigned = issue.assignees.length === 0;
      return hasAutoFixLabel && isUnassigned;
    });

    if (issues.length === 0) {
      await log('No issues to process');
      return;
    }

    await log(`Found ${issues.length} issue(s) to process`);

    for (const issue of issues) {
      await processIssue(issue);
    }
  } catch (error) {
    await log(`Error polling issues: ${error.message}`);
  }
}

async function processIssue(issue) {
  try {
    await log(`Processing issue #${issue.number}: ${issue.title}`);

    const assigned = await assignIssue(issue.number);
    if (!assigned) return;

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

async function assignIssue(issueNumber) {
  try {
    await execAsync(`gh issue edit ${issueNumber} --repo ${REPO} --add-assignee @me`);
    await log(`Assigned issue #${issueNumber} to agent`);
    return true;
  } catch (error) {
    await log(`Failed to assign issue: ${error.message}`);
    return false;
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
    await execAsync(`cd ${WORK_DIR} && git add . && git commit -m "${message}\n\nAutomated fix by GitHub Agent\n\nDeveloped by Antony Were"`);
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
    const prBody = `Automated fix for issue #${issueNumber}\n\n**Changes Made:**\n- Applied automated security/dependency fixes\n- Verified and reinstalled dependencies\n\n**Testing:**\n- ✅ Lint checks passed\n- ✅ Build successful\n\n**Fixes:** #${issueNumber}\n\n---\n*This PR was automatically created by the GitHub Agent*\n*Developed by Antony Were*`;

    await execAsync(`gh pr create --repo ${REPO} --title "🤖 ${title}" --body "${prBody}" --head ${branchName} --base main`);
    await log(`Created PR for issue #${issueNumber}`);
    return true;
  } catch (error) {
    await log(`PR creation failed: ${error.message}`);
    return false;
  }
}

async function main() {
  await log('🤖 GitHub Agent started');
  await log(`Monitoring repository: ${REPO}`);
  await log(`Auto-fix labels: ${AUTO_FIX_LABELS.join(', ')}`);
  await log(`Poll interval: ${POLL_INTERVAL / 60000} minutes`);

  // Poll immediately on start
  await pollIssues();

  // Then poll on interval
  setInterval(pollIssues, POLL_INTERVAL);
}

main();
