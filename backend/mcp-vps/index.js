#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { execSync } from 'child_process';

const VPS = 'root@145.239.42.121';
const SSH_OPTS = '-o StrictHostKeyChecking=no -o ConnectTimeout=10 -o BatchMode=yes';

function ssh(cmd) {
  return execSync(`ssh ${SSH_OPTS} ${VPS} ${JSON.stringify(cmd)}`, {
    timeout: 60000,
    encoding: 'utf-8',
  }).trim();
}

const server = new Server(
  { name: 'elimu-vps', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'vps_health',
      description: 'Full VPS health snapshot: PM2, disk, memory, CPU load, uptime, parse health',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'vps_system',
      description: 'Deep system info: CPU usage per core, top processes, network connections, open ports, kernel, OS version',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'vps_processes',
      description: 'Top running processes by CPU or memory',
      inputSchema: {
        type: 'object',
        properties: {
          sort: {
            type: 'string',
            enum: ['cpu', 'memory'],
            description: 'Sort by cpu or memory (default: cpu)',
          },
          limit: { type: 'number', description: 'Number of processes to show (default: 20)' },
        },
      },
    },
    {
      name: 'vps_disk',
      description: 'Disk usage breakdown: all mounts, largest directories, inode usage',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'vps_network',
      description: 'Network stats: active connections, bandwidth, open ports, firewall rules',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'vps_database',
      description: 'PostgreSQL status: running queries, database sizes, connection count, slow queries',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'vps_logs',
      description: 'Tail Parse Server error or info logs',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['error', 'info', 'cron-monitor', 'backup'],
            description: 'Log type (default: error)',
          },
          lines: { type: 'number', description: 'Lines to return (default: 50)' },
          date: { type: 'string', description: 'Date YYYY-MM-DD (default: today)' },
        },
      },
    },
    {
      name: 'vps_pm2',
      description: 'Full PM2 status with memory, CPU, restart counts for all processes',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'vps_pm2_logs',
      description: 'Get recent PM2 logs for a specific process',
      inputSchema: {
        type: 'object',
        properties: {
          process: { type: 'string', description: 'PM2 process name (e.g. parse-server-prod)' },
          lines: { type: 'number', description: 'Lines to return (default: 50)' },
        },
        required: ['process'],
      },
    },
    {
      name: 'vps_pm2_restart',
      description: 'Restart a PM2 process',
      inputSchema: {
        type: 'object',
        properties: {
          process: { type: 'string', description: 'PM2 process name' },
        },
        required: ['process'],
      },
    },
    {
      name: 'vps_nginx',
      description: 'Nginx status, config test, access logs tail, and active vhosts',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'vps_ssl',
      description: 'SSL certificate status, expiry dates for all domains',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'vps_cron',
      description: 'Show all cron jobs and recent cron monitor log',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'vps_git',
      description: 'Git status, recent commits, and diff from origin on VPS',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'vps_run',
      description: 'Run any shell command on the VPS',
      inputSchema: {
        type: 'object',
        properties: {
          command: { type: 'string', description: 'Shell command to run on VPS' },
        },
        required: ['command'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'vps_health') {
      const result = ssh([
        'echo "=== PM2 STATUS ==="',
        'pm2 status',
        'echo "\\n=== DISK ==="',
        'df -h /',
        'echo "\\n=== MEMORY ==="',
        'free -h',
        'echo "\\n=== LOAD ==="',
        'uptime',
        'echo "\\n=== PARSE HEALTH ==="',
        'curl -s https://elimu-smart.co.ke/parse/health',
        'echo "\\n=== NGINX ==="',
        'systemctl is-active nginx',
        'echo "\\n=== POSTGRES ==="',
        'systemctl is-active postgresql',
      ].join(' && '));
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_system') {
      const result = ssh([
        'echo "=== OS & KERNEL ==="',
        'uname -a',
        'cat /etc/os-release | grep -E "NAME|VERSION"',
        'echo "\\n=== CPU INFO ==="',
        'nproc && cat /proc/cpuinfo | grep "model name" | head -1',
        'echo "\\n=== CPU USAGE ==="',
        'top -bn1 | head -20',
        'echo "\\n=== MEMORY DETAIL ==="',
        'cat /proc/meminfo | head -10',
        'echo "\\n=== SWAP ==="',
        'swapon --show',
        'echo "\\n=== OPEN FILE DESCRIPTORS ==="',
        'sysctl fs.file-nr',
        'echo "\\n=== BOOT TIME ==="',
        'who -b',
      ].join(' && '));
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_processes') {
      const sort = args.sort || 'cpu';
      const limit = args.limit || 20;
      const sortFlag = sort === 'memory' ? '--sort=-%mem' : '--sort=-%cpu';
      const result = ssh(`ps aux ${sortFlag} | head -${limit + 1}`);
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_disk') {
      const result = ssh([
        'echo "=== ALL MOUNTS ==="',
        'df -h',
        'echo "\\n=== INODE USAGE ==="',
        'df -i /',
        'echo "\\n=== LARGEST DIRS (top 15) ==="',
        'du -sh /root/elimu_smart/* 2>/dev/null | sort -rh | head -15',
        'echo "\\n=== LOG SIZE ==="',
        'du -sh /root/elimu_smart/backend/logs/',
        'echo "\\n=== BACKUP SIZE ==="',
        'du -sh ~/elimu_smart_backups/ 2>/dev/null || echo "No backups dir"',
      ].join(' && '));
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_network') {
      const result = ssh([
        'echo "=== ACTIVE CONNECTIONS ==="',
        'ss -tunap | head -30',
        'echo "\\n=== OPEN PORTS ==="',
        'ss -tlnp',
        'echo "\\n=== NETWORK INTERFACES ==="',
        'ip addr show | grep -E "inet |^[0-9]"',
        'echo "\\n=== FIREWALL (ufw) ==="',
        'ufw status 2>/dev/null || iptables -L INPUT --line-numbers 2>/dev/null | head -20',
        'echo "\\n=== DNS ==="',
        'cat /etc/resolv.conf',
      ].join(' && '));
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_database') {
      const result = ssh([
        'echo "=== POSTGRESQL STATUS ==="',
        'systemctl status postgresql --no-pager -l | head -10',
        'echo "\\n=== DATABASE SIZES ==="',
        'sudo -u postgres psql -c "SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database ORDER BY pg_database_size(datname) DESC;" 2>/dev/null',
        'echo "\\n=== ACTIVE CONNECTIONS ==="',
        'sudo -u postgres psql -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;" 2>/dev/null',
        'echo "\\n=== RUNNING QUERIES ==="',
        'sudo -u postgres psql -c "SELECT pid, now()-pg_stat_activity.query_start AS duration, query, state FROM pg_stat_activity WHERE state != \'idle\' ORDER BY duration DESC LIMIT 10;" 2>/dev/null',
        'echo "\\n=== SLOW QUERIES (>1s) ==="',
        'sudo -u postgres psql elimu_smart_production -c "SELECT query, calls, total_exec_time, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 5;" 2>/dev/null || echo "pg_stat_statements not enabled"',
      ].join(' && '));
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_logs') {
      const type = args.type || 'error';
      const lines = args.lines || 50;
      const date = args.date || new Date().toISOString().split('T')[0];

      let logFile;
      if (type === 'cron-monitor') {
        logFile = `/root/elimu_smart/backend/logs/system-monitor-${date}.log`;
      } else if (type === 'backup') {
        logFile = `/root/elimu_smart/backend/logs/backup.log`;
      } else {
        logFile = `/root/elimu_smart/backend/logs/parse-server.${type}.${date}`;
      }

      const result = ssh(`tail -n ${lines} ${logFile} 2>/dev/null || echo "No log file: ${logFile}"`);
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_pm2') {
      const result = ssh('pm2 status && echo "\\n=== MEMORY DETAILS ===" && pm2 list');
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_pm2_logs') {
      const lines = args.lines || 50;
      const result = ssh(`pm2 logs ${args.process} --lines ${lines} --nostream 2>&1 | tail -n ${lines}`);
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_pm2_restart') {
      const result = ssh(`pm2 restart ${args.process} && sleep 2 && pm2 status`);
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_nginx') {
      const result = ssh([
        'echo "=== NGINX STATUS ==="',
        'systemctl status nginx --no-pager -l | head -15',
        'echo "\\n=== CONFIG TEST ==="',
        'nginx -t 2>&1',
        'echo "\\n=== VIRTUAL HOSTS ==="',
        'ls /etc/nginx/sites-enabled/',
        'echo "\\n=== RECENT ACCESS (last 20) ==="',
        'tail -20 /var/log/nginx/access.log 2>/dev/null',
        'echo "\\n=== RECENT ERRORS (last 20) ==="',
        'tail -20 /var/log/nginx/error.log 2>/dev/null',
      ].join(' && '));
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_ssl') {
      const result = ssh('certbot certificates 2>/dev/null');
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_cron') {
      const result = ssh([
        'echo "=== CRON JOBS ==="',
        'crontab -l',
        'echo "\\n=== RECENT CRON MONITOR LOG ==="',
        `tail -30 /root/elimu_smart/backend/logs/system-monitor-$(date +%Y-%m-%d).log 2>/dev/null || echo "No monitor log today"`,
      ].join(' && '));
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_git') {
      const result = ssh([
        'cd /root/elimu_smart',
        'echo "=== GIT STATUS ==="',
        'git status',
        'echo "\\n=== RECENT COMMITS ==="',
        'git log --oneline -10',
        'echo "\\n=== DIFF FROM ORIGIN ==="',
        'git fetch origin -q && git log --oneline HEAD...origin/main',
      ].join(' && '));
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'vps_run') {
      const result = ssh(args.command);
      return { content: [{ type: 'text', text: result }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
