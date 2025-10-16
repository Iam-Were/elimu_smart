/**
 * Deployment Webhook Server - Production Only
 * Handles GitHub Actions deployment triggers
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const { execSync } = require('child_process');
const app = express();

app.use(express.json());

// Log loaded environment for debugging
console.log('🔐 Webhook server starting with:', {
  hasWebhookToken: !!process.env.GH_WEBHOOK_TOKEN,
  hasGHToken: !!process.env.GH_TOKEN,
  env: process.env.NODE_ENV
});

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
      'cd backend && npm install --omit=dev',
      'pm2 restart parse-server-prod parse-dashboard-prod',
      'echo "✅ Backend deployment completed"'
    ].join(' && ');

    execSync(commands, { stdio: 'inherit', env: { ...process.env } });
    console.log('✅ Production deployment completed successfully');
  } catch (error) {
    console.error('Production deployment failed:', error);
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
