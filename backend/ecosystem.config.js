module.exports = {
  apps: [
    {
      name: 'parse-server',
      script: 'server-working.js',
      instances: 2,  // Cluster mode - 2 instances
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/parse-error.log',
      out_file: './logs/parse-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      autorestart: true,
      watch: false,  // Don't watch in production

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 5000,

      // Cron restart (optional - restart every night at 3 AM)
      cron_restart: '0 3 * * *'
    },
    {
      name: 'parse-dashboard',
      script: 'node_modules/.bin/parse-dashboard',
      args: '--config parse-dashboard-config.json --allowInsecureHTTP',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/dashboard-error.log',
      out_file: './logs/dashboard-out.log',
      autorestart: true,
      max_restarts: 10
    }
  ]
};
