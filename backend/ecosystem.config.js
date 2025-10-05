module.exports = {
  apps: [
    // PRODUCTION Parse Server
    {
      name: 'parse-server-prod',
      script: 'server-working.js',
      instances: 2,  // Cluster mode - 2 instances
      exec_mode: 'cluster',
      cwd: '/root/elimu_smart/backend',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/prod-parse-error.log',
      out_file: './logs/prod-parse-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      autorestart: true,
      watch: false,

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 5000,

      // Cron restart (optional - restart every night at 3 AM)
      cron_restart: '0 3 * * *'
    },

    // STAGING Parse Server
    {
      name: 'parse-server-staging',
      script: 'server-staging.js',  // Uses dedicated staging loader
      instances: 1,  // Single instance for staging
      exec_mode: 'fork',
      cwd: '/root/elimu_smart/backend',
      env: {
        NODE_ENV: 'staging'
      },
      error_file: './logs/staging-parse-error.log',
      out_file: './logs/staging-parse-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '300M',
      autorestart: true,
      watch: false,

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 5000
    },

    // PRODUCTION Parse Dashboard
    {
      name: 'parse-dashboard-prod',
      script: 'node_modules/.bin/parse-dashboard',
      args: '--config parse-dashboard-config.json --allowInsecureHTTP',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/prod-dashboard-error.log',
      out_file: './logs/prod-dashboard-out.log',
      autorestart: true,
      max_restarts: 10
    },

    // STAGING Parse Dashboard (Optional - port 4041)
    {
      name: 'parse-dashboard-staging',
      script: 'node_modules/.bin/parse-dashboard',
      args: '--config parse-dashboard-staging-config.json --allowInsecureHTTP --port 4041',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'staging'
      },
      error_file: './logs/staging-dashboard-error.log',
      out_file: './logs/staging-dashboard-out.log',
      autorestart: true,
      max_restarts: 10
    }
  ]
};
