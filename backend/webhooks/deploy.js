/**
 * Deployment Webhook Server
 * Handles GitHub Actions deployment triggers
 */

require('dotenv').config({ path: '../.env' });
const express = require('express');
const { execSync } = require('child_process');
const app = express();

app.use(express.json());

// Middleware to verify GitHub token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.GH_WEBHOOK_TOKEN || process.env.GH_TOKEN;

  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Production deployment endpoint
app.post('/webhooks/deploy/production', verifyToken, async (req, res) => {
  try {
    console.log('🚀 Production deployment triggered');

    // Respond immediately to prevent timeout
    res.json({
      status: 'accepted',
      message: 'Production deployment started',
      timestamp: new Date().toISOString()
    });

    // Run deployment asynchronously
    const commands = [
      'cd /root/elimu_smart',
      'git pull origin main',
      'cd backend && npm install',
      'pm2 restart parse-server-prod',
      'cd ../frontend && npm install --include=dev',
      'NODE_OPTIONS="--max-old-space-size=512" npm run build -- --mode production',
      'sudo cp -r dist/* /var/www/elimu-smart/'
    ].join(' && ');

    execSync(commands, { stdio: 'inherit', env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=512' } });
    console.log('✅ Production deployment completed successfully');
  } catch (error) {
    console.error('Production deployment failed:', error);
  }
});

// Staging deployment endpoint
app.post('/webhooks/deploy/staging', verifyToken, async (req, res) => {
  try {
    console.log('🧪 Staging deployment triggered');

    // Respond immediately to prevent timeout
    res.json({
      status: 'accepted',
      message: 'Staging deployment started',
      timestamp: new Date().toISOString()
    });

    // Run deployment asynchronously
    const commands = [
      'cd /root/elimu_smart',
      'git pull origin main',
      'cd backend && npm install',
      'pm2 restart parse-server-staging',
      'cd ../frontend && npm install --include=dev',
      'NODE_OPTIONS="--max-old-space-size=512" npm run build -- --mode staging',
      'sudo cp -r dist/* /var/www/elimu-smart-staging/'
    ].join(' && ');

    execSync(commands, { stdio: 'inherit', env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=512' } });
    console.log('✅ Staging deployment completed successfully');
  } catch (error) {
    console.error('Staging deployment failed:', error);
  }
});

// Health check
app.get('/webhooks/health', (req, res) => {
  res.json({ status: 'ok', service: 'deployment-webhook' });
});

const PORT = process.env.WEBHOOK_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Deployment webhook server running on port ${PORT}`);
});

module.exports = app;
