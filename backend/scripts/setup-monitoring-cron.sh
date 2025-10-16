#!/bin/bash
# Setup monitoring cron job for Elimu Smart platform
# This script installs the system-monitor-heal.sh script to run every 15 minutes

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="/root/elimu_smart/backend/scripts"
MONITOR_SCRIPT="${SCRIPT_DIR}/system-monitor-heal.sh"
CRON_SCHEDULE="*/15 * * * *"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}=== Setting up System Monitoring Cron Job ===${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if monitor script exists
if [ ! -f "$MONITOR_SCRIPT" ]; then
  echo -e "${RED}❌ Monitor script not found at: $MONITOR_SCRIPT${NC}"
  exit 1
fi

# Make script executable
echo -e "${BLUE}Making monitor script executable...${NC}"
chmod +x "$MONITOR_SCRIPT"
echo -e "${GREEN}✅ Script is now executable${NC}"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "$MONITOR_SCRIPT"; then
  echo -e "${YELLOW}⚠️  Cron job already exists. Removing old entry...${NC}"
  crontab -l 2>/dev/null | grep -v "$MONITOR_SCRIPT" | crontab -
fi

# Add new cron job
echo -e "${BLUE}Adding cron job: $CRON_SCHEDULE${NC}"
(crontab -l 2>/dev/null; echo "$CRON_SCHEDULE $MONITOR_SCRIPT >> /root/elimu_smart/backend/logs/cron-monitor.log 2>&1") | crontab -

# Verify cron job was added
if crontab -l 2>/dev/null | grep -q "$MONITOR_SCRIPT"; then
  echo -e "${GREEN}✅ Cron job added successfully!${NC}"
  echo ""
  echo -e "${BLUE}Current crontab:${NC}"
  crontab -l | grep "$MONITOR_SCRIPT"
  echo ""
  echo -e "${GREEN}Monitor will run every 15 minutes${NC}"
  echo -e "${BLUE}Logs will be written to:${NC}"
  echo "  - /root/elimu_smart/backend/logs/system-monitor-<date>.log (detailed)"
  echo "  - /root/elimu_smart/backend/logs/cron-monitor.log (cron output)"
else
  echo -e "${RED}❌ Failed to add cron job${NC}"
  exit 1
fi

# Test the monitor script
echo ""
echo -e "${BLUE}Running initial health check...${NC}"
if $MONITOR_SCRIPT; then
  echo -e "${GREEN}✅ Initial health check passed${NC}"
else
  echo -e "${YELLOW}⚠️  Initial health check found issues (normal if system needs remediation)${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}=== Setup Complete ===${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}System monitoring is now active!${NC}"
echo -e "Next scheduled run: $(date -d '+15 minutes' '+%Y-%m-%d %H:%M')"
echo ""
echo -e "To view cron jobs: ${BLUE}crontab -l${NC}"
echo -e "To remove cron job: ${BLUE}crontab -e${NC} (then delete the line)"
echo -e "To test manually: ${BLUE}$MONITOR_SCRIPT${NC}"

exit 0
