module.exports = {
  apps: [{
    name: 'deployment-webhook',
    script: 'deploy.js',
    cwd: '/root/elimu_smart/backend/webhooks',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      WEBHOOK_PORT: 3001
    },
    error_file: '/root/elimu_smart/backend/logs/webhook-error.log',
    out_file: '/root/elimu_smart/backend/logs/webhook-out.log',
    time: true
  }]
};
