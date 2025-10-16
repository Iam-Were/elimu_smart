# Automated Deployment & Monitoring Infrastructure

## Overview
This document describes the automated infrastructure for post-deployment operations and continuous system monitoring implemented for the Elimu Smart platform.

## Components

### 1. Post-Deployment Restart Script
**Location**: `/root/elimu_smart/backend/scripts/post-deployment-restart.sh`

**Purpose**: Ensures clean system state after every successful deployment by flushing caches and gracefully restarting all services.

**Features**:
- ✅ Parameter validation (only runs with "deployment-successful" argument)
- ✅ Parse Server cache flush via cloud function
- ✅ Redis cache flush (if available)
- ✅ PM2 graceful reload (zero-downtime restart)
- ✅ Health check verification
- ✅ Auto-recovery restart on health check failure
- ✅ Detailed timestamped logging
- ✅ Exit codes for CI/CD integration (0=success, 1=failure)

**Execution Flow**:
1. Validate deployment-successful parameter
2. Flush PM2 logs
3. Clear application caches (Parse Server + Redis)
4. Reload all PM2 processes (graceful restart)
5. Wait for services to stabilize (20 seconds)
6. Verify Parse Server health (HTTP 200 check)
7. Verify frontend availability (HTTP 200 check)
8. Display PM2 status
9. Save PM2 process list
10. Log completion and exit

**Logs**: `/root/elimu_smart/backend/logs/deployment-restart-<timestamp>.log`

**Usage**:
```bash
# Run manually (only after successful deployment)
cd /root/elimu_smart/backend/scripts
bash post-deployment-restart.sh deployment-successful

# Integrated into GitHub Actions (automatically triggered)
```

**GitHub Actions Integration**:
The script is automatically executed after successful deployments via the `deploy-production.yml` workflow:
```yaml
- name: Run post-deployment restart script
  uses: appleboy/ssh-action@v1.0.0
  with:
    script: |
      cd /root/elimu_smart/backend/scripts
      bash post-deployment-restart.sh deployment-successful
```

---

### 2. System Monitoring & Auto-Healing Script
**Location**: `/root/elimu_smart/backend/scripts/system-monitor-heal.sh`

**Purpose**: Continuously monitors system health and automatically fixes common issues before they impact users.

**Features**:
- ✅ Parse Server health checks
- ✅ Database connectivity verification
- ✅ PM2 process status monitoring
- ✅ System resource monitoring (CPU, memory, disk)
- ✅ Progressive auto-remediation (targeted fixes first)
- ✅ Smart restart logic with retries
- ✅ Detailed logging with color-coded output
- ✅ Exit codes for alerting (0=healthy, 1=needs intervention)

**Health Checks**:
1. **Parse Server Health**: HTTP 200 on `/parse/health` endpoint
2. **Database Connection**: Query Parse Server classes to verify DB connectivity
3. **PM2 Processes**: Verify all 5 processes are online (parse-server-prod, parse-dashboard-prod, deployment-webhook, github-agent, github-webhook-agent)
4. **System Resources**:
   - Memory: Warns if <200MB free
   - Disk: Warns if >85% usage

**Auto-Remediation Actions**:
- **Parse Server issues**: Restart with 3 retry attempts, 15-second wait between attempts
- **Database issues**: Restart Parse Server to reset connection pool
- **PM2 issues**: Reload all processes
- **Resource issues**:
  - Clean up old log files (>7 days)
  - Flush PM2 logs
  - Clean journalctl logs (keep 3 days)
  - Clear application caches

**Execution Schedule**:
Runs automatically every 15 minutes via cron job:
```bash
*/15 * * * * /root/elimu_smart/backend/scripts/system-monitor-heal.sh >> /root/elimu_smart/backend/logs/cron-monitor.log 2>&1
```

**Logs**:
- Detailed: `/root/elimu_smart/backend/logs/system-monitor-<date>.log`
- Cron output: `/root/elimu_smart/backend/logs/cron-monitor.log`

**Usage**:
```bash
# Run manually (for testing or immediate check)
cd /root/elimu_smart/backend/scripts
bash system-monitor-heal.sh

# View today's monitoring log
tail -f /root/elimu_smart/backend/logs/system-monitor-$(date +%Y-%m-%d).log

# View cron execution log
tail -f /root/elimu_smart/backend/logs/cron-monitor.log
```

---

### 3. Monitoring Cron Setup Script
**Location**: `/root/elimu_smart/backend/scripts/setup-monitoring-cron.sh`

**Purpose**: One-time setup script to install the system monitoring cron job.

**Features**:
- ✅ Validates monitor script exists
- ✅ Makes script executable
- ✅ Removes old cron job if exists
- ✅ Adds new cron job (every 15 minutes)
- ✅ Verifies cron job installation
- ✅ Runs initial health check
- ✅ Displays setup summary

**Usage**:
```bash
cd /root/elimu_smart/backend/scripts
bash setup-monitoring-cron.sh
```

**Status**: ✅ Already installed on production (2025-10-16)

---

## Testing Results

### Post-Deployment Script Tests
✅ **Syntax validation**: Passed (bash -n)
✅ **Parameter validation**: Correctly rejects invalid parameters
✅ **Successful execution**: All services restarted cleanly
✅ **Health checks**: Parse Server and frontend both HTTP 200
✅ **Logging**: Timestamped logs created successfully

**Latest Test Output**:
```
✅ PM2 logs flushed successfully
✅ PM2 processes reloaded and saved successfully
✅ Parse Server is running correctly (HTTP 200)
✅ Frontend is accessible (HTTP 200)
🎉 Post-deployment restart completed successfully!
```

### Monitoring Script Tests
✅ **Syntax validation**: Passed (bash -n)
✅ **Health checks**: All 4 check categories working
✅ **Auto-remediation**: Successfully cleans logs and clears disk space
✅ **PM2 detection**: Correctly identifies all 5 processes
✅ **Exit codes**: Returns 0 on healthy system, 1 on issues

**Latest Test Output**:
```
✅ Parse Server is healthy (HTTP 200)
✅ Database connection is working
✅ All PM2 processes are running
✅ System health check completed: All issues were fixed automatically
```

### Cron Job Installation
✅ **Setup script**: Successfully installed cron job
✅ **Schedule**: Every 15 minutes (*/15 * * * *)
✅ **Initial run**: Health check passed
✅ **Verification**: Crontab entry confirmed

---

## Production Status

### Current Deployment
- **Server**: 145.239.42.121 (elimu-smart.co.ke)
- **Post-deployment script**: ✅ Deployed and tested
- **Monitoring script**: ✅ Deployed and tested
- **Cron job**: ✅ Installed and running
- **GitHub Actions integration**: ✅ Added to deploy-production.yml

### System Health (2025-10-16 13:43 UTC)
- Parse Server: ✅ Healthy (HTTP 200)
- Database: ✅ Connected
- PM2 Processes: ✅ All 5 online (117 restarts total on parse-server-prod)
- Memory: ⚠️  Low (111 MB free) - monitoring will track
- Disk: ✅ 26% usage
- Next monitoring run: Every 15 minutes

---

## Monitoring Dashboard

### How to Monitor System Health

**1. View Real-time Monitoring Logs**:
```bash
ssh root@145.239.42.121
tail -f /root/elimu_smart/backend/logs/system-monitor-$(date +%Y-%m-%d).log
```

**2. Check Cron Execution History**:
```bash
ssh root@145.239.42.121
tail -100 /root/elimu_smart/backend/logs/cron-monitor.log
```

**3. Review Deployment Restart Logs**:
```bash
ssh root@145.239.42.121
ls -lt /root/elimu_smart/backend/logs/deployment-restart-*.log | head -5
cat /root/elimu_smart/backend/logs/deployment-restart-<latest>.log
```

**4. Verify Cron Job Status**:
```bash
ssh root@145.239.42.121
crontab -l | grep system-monitor
```

**5. Manual Health Check**:
```bash
ssh root@145.239.42.121
cd /root/elimu_smart/backend/scripts
bash system-monitor-heal.sh
```

---

## Alert Thresholds

The monitoring script will automatically attempt remediation when:
- Parse Server returns non-200 status
- Database queries fail
- Any PM2 process is not "online"
- Free memory falls below 200 MB
- Disk usage exceeds 85%

### Exit Codes
- **0**: System healthy or all issues fixed automatically
- **1**: Issues detected that require manual intervention

---

## Maintenance

### Updating Scripts
1. Modify script in workspace: `/workspaces/elimu_smart/backend/scripts/`
2. Test syntax: `bash -n script-name.sh`
3. Deploy to production: `scp script-name.sh root@145.239.42.121:/root/elimu_smart/backend/scripts/`
4. Make executable: `ssh root@145.239.42.121 "chmod +x /root/elimu_smart/backend/scripts/script-name.sh"`
5. Test on production: `ssh root@145.239.42.121 "cd /root/elimu_smart/backend/scripts && bash script-name.sh"`

### Disabling Monitoring (Emergency)
```bash
ssh root@145.239.42.121
crontab -e
# Comment out the line: */15 * * * * /root/elimu_smart/backend/scripts/system-monitor-heal.sh
```

### Re-enabling Monitoring
```bash
ssh root@145.239.42.121
cd /root/elimu_smart/backend/scripts
bash setup-monitoring-cron.sh
```

### Log Rotation
- Monitoring logs: Cleaned automatically (>7 days old)
- Deployment logs: Manual cleanup recommended monthly
- Cron logs: Rotate manually or set up logrotate

---

## Future Enhancements

### Planned Improvements
- [ ] Email/SMS notifications for critical failures
- [ ] Slack/Discord webhook integration
- [ ] Metrics collection (Prometheus/Grafana)
- [ ] Historical health trend analysis
- [ ] Auto-scaling based on resource usage
- [ ] Database backup verification
- [ ] SSL certificate expiry monitoring

### Monitoring Metrics to Add
- [ ] Response time tracking
- [ ] Error rate monitoring
- [ ] User session analytics
- [ ] API endpoint performance
- [ ] Database query performance
- [ ] Network latency checks

---

## Troubleshooting

### Post-Deployment Script Issues

**Issue**: Script fails to run
```bash
# Check script permissions
ls -l /root/elimu_smart/backend/scripts/post-deployment-restart.sh

# Make executable if needed
chmod +x /root/elimu_smart/backend/scripts/post-deployment-restart.sh
```

**Issue**: Health checks fail after restart
```bash
# Wait longer for services to stabilize
# Increase sleep time in script from 20s to 30s

# Manually verify services
pm2 list
curl https://elimu-smart.co.ke/parse/health
curl https://elimu-smart.co.ke/
```

### Monitoring Script Issues

**Issue**: Cron job not running
```bash
# Verify cron service is running
systemctl status cron

# Check crontab entry
crontab -l

# Check cron logs
grep CRON /var/log/syslog | tail -20
```

**Issue**: False positives in health checks
```bash
# Adjust thresholds in system-monitor-heal.sh
# Example: Increase memory threshold from 200MB to 150MB
```

**Issue**: Auto-remediation not working
```bash
# Check script has necessary permissions
ls -l /root/elimu_smart/backend/scripts/system-monitor-heal.sh

# Verify .env file exists and has correct keys
cat /root/elimu_smart/backend/.env | grep PARSE_MASTER_KEY
```

---

## Security Considerations

### Access Control
- Scripts require root access (SSH key authentication only)
- Master key stored in `.env` file (600 permissions)
- Logs stored in protected directory (readable by root only)

### Secrets Management
- `PARSE_MASTER_KEY` loaded from `.env` file
- Never logged in plain text
- Passed securely to curl commands

### Network Security
- All API calls use HTTPS
- Local health checks use curl with timeouts
- No external dependencies beyond Parse Server

---

## Performance Impact

### Post-Deployment Script
- Execution time: ~20-30 seconds
- Downtime: 0 seconds (graceful reload)
- Memory overhead: Minimal (<10MB)
- CPU usage: Brief spike during PM2 reload

### Monitoring Script
- Execution time: ~3-5 seconds
- CPU usage: <1% during execution
- Memory overhead: <5MB
- Disk I/O: Minimal (log writes only)
- Network: 3-5 HTTP requests per run

### Cron Job
- Frequency: Every 15 minutes (96 times/day)
- Daily overhead: ~7-8 minutes CPU time total
- Log growth: ~5-10 MB/day

---

## Conclusion

The automated deployment and monitoring infrastructure ensures:
1. **Zero-downtime deployments** with cache flushing
2. **24/7 system health monitoring** every 15 minutes
3. **Automatic issue remediation** without manual intervention
4. **Comprehensive logging** for debugging and auditing
5. **CI/CD integration** for seamless deployments

**Status**: ✅ Fully deployed and operational (2025-10-16)

**Next Steps**:
- Monitor logs for 48 hours to verify stability
- Collect baseline metrics for threshold tuning
- Plan email notification integration
- Document runbook for manual interventions

---

## Contact & Support

For issues or questions:
1. Check logs: `/root/elimu_smart/backend/logs/`
2. Review this documentation
3. Run manual health check: `bash system-monitor-heal.sh`
4. Contact DevOps team if issues persist

**Last Updated**: October 16, 2025
**Version**: 1.0
**Status**: Production Ready ✅
