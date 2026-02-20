module.exports = {
  apps: [
    // PRODUCTION Parse Server (Cluster Mode with Startup Lock)
    {
      name: 'parse-server-prod',
      script: 'server-cluster.js',  // Uses startup lock wrapper
      instances: 2,  // Cluster mode - 2 instances (now safe!)
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
      max_memory_restart: '350M',
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
      max_restarts: 10,
      max_memory_restart: '150M'
    }
  ]
};
