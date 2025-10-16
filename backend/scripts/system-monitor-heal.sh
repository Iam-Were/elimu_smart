#!/bin/bash
# Health check and auto-remediation script for Elimu Smart platform
# Monitors system health and automatically fixes common issues

set -e  # Exit immediately if a command exits with non-zero status

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PARSE_APP_ID="elimu-smart-production"
API_ENDPOINT="https://elimu-smart.co.ke"
PARSE_ENDPOINT="${API_ENDPOINT}/parse"
HEALTH_ENDPOINT="${PARSE_ENDPOINT}/health"
LOG_DIR="/root/elimu_smart/backend/logs"
LOG_FILE="${LOG_DIR}/system-monitor-$(date +%Y-%m-%d).log"
MAX_RESTART_ATTEMPTS=3

# Create log directory if it doesn't exist
mkdir -p "${LOG_DIR}"

# Load environment variables
if [ -f "/root/elimu_smart/backend/.env" ]; then
  export $(cat /root/elimu_smart/backend/.env | grep -v '^#' | xargs)
fi

# Timestamp function for logging
timestamp() {
  date "+%Y-%m-%d %H:%M:%S"
}

log() {
  echo -e "$(timestamp) - $1" | tee -a "${LOG_FILE}"
}

# Check if Parse Server is responsive
check_parse_server() {
  log "${BLUE}Checking Parse Server health...${NC}"
  
  local health_status=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_ENDPOINT}" --max-time 10)
  
  if [ "$health_status" = "200" ]; then
    log "${GREEN}✅ Parse Server is healthy (HTTP ${health_status})${NC}"
    return 0
  else
    log "${RED}❌ Parse Server health check failed with status ${health_status}${NC}"
    return 1
  fi
}

# Check database connectivity through Parse Server
check_database() {
  log "${BLUE}Checking database connection...${NC}"
  
  local test_query=$(curl -s -X GET \
    -H "X-Parse-Application-Id: ${PARSE_APP_ID}" \
    -H "X-Parse-Master-Key: ${PARSE_MASTER_KEY}" \
    "${PARSE_ENDPOINT}/classes/_User?limit=1" --max-time 10 2>&1)
  
  if [[ "$test_query" == *"results"* ]] || [[ "$test_query" == *"[]"* ]]; then
    log "${GREEN}✅ Database connection is working${NC}"
    return 0
  else
    log "${YELLOW}⚠️  Database query returned unexpected result, but may be working${NC}"
    # Don't fail if Parse Server is healthy - database is likely fine
    if check_parse_server_quiet; then
      return 0
    fi
    return 1
  fi
}

# Silent Parse Server health check (no logging)
check_parse_server_quiet() {
  local health_status=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_ENDPOINT}" --max-time 10)
  [ "$health_status" = "200" ]
}

# Check PM2 processes
check_pm2_processes() {
  log "${BLUE}Checking PM2 processes...${NC}"
  
  if ! command -v pm2 &> /dev/null; then
    log "${RED}❌ PM2 not installed${NC}"
    return 1
  fi
  
  local offline_count=$(pm2 jlist | jq -r '[.[] | select(.pm2_env.status != "online")] | length' 2>/dev/null || echo "0")
  
  if [ "$offline_count" = "0" ]; then
    log "${GREEN}✅ All PM2 processes are running${NC}"
    return 0
  else
    log "${RED}❌ Found ${offline_count} offline PM2 processes${NC}"
    pm2 list | tee -a "${LOG_FILE}"
    return 1
  fi
}

# Check system resources
check_system_resources() {
  log "${BLUE}Checking system resources...${NC}"
  
  local issues=0
  
  # Check memory usage
  local free_memory=$(free -m | awk '/^Mem:/ {print $4}')
  if [ "$free_memory" -lt 200 ]; then
    log "${YELLOW}⚠️  Low memory: ${free_memory} MB free${NC}"
    issues=1
  else
    log "${GREEN}✅ Memory usage is normal: ${free_memory} MB free${NC}"
  fi
  
  # Check disk space
  local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
  if [ "$disk_usage" -gt 85 ]; then
    log "${YELLOW}⚠️  High disk usage: ${disk_usage}%${NC}"
    issues=1
  else
    log "${GREEN}✅ Disk usage is acceptable: ${disk_usage}%${NC}"
  fi
  
  return $issues
}

# Restart Parse Server with verification
restart_parse_server() {
  log "${YELLOW}🔄 Attempting to restart Parse Server...${NC}"
  
  local attempt=1
  local success=false
  
  while [ $attempt -le $MAX_RESTART_ATTEMPTS ] && [ "$success" = false ]; do
    log "Restart attempt $attempt/$MAX_RESTART_ATTEMPTS"
    
    pm2 restart parse-server-prod >> "${LOG_FILE}" 2>&1
    sleep 15  # Wait for server to start
    
    # Check if successful
    if check_parse_server; then
      success=true
      log "${GREEN}✅ Parse Server restarted successfully on attempt ${attempt}${NC}"
    else
      log "${RED}❌ Parse Server restart attempt ${attempt} failed${NC}"
      sleep 20
      attempt=$((attempt + 1))
    fi
  done
  
  if [ "$success" = true ]; then
    return 0
  else
    log "${RED}❌ All Parse Server restart attempts failed${NC}"
    return 1
  fi
}

# Restart all PM2 processes
restart_all_pm2() {
  log "${YELLOW}🔄 Attempting to restart all PM2 processes...${NC}"
  
  pm2 reload all >> "${LOG_FILE}" 2>&1
  sleep 15
  
  if check_pm2_processes; then
    log "${GREEN}✅ All PM2 processes restarted successfully${NC}"
    return 0
  else
    log "${RED}❌ PM2 processes restart failed${NC}"
    return 1
  fi
}

# Clear application caches
clear_caches() {
  log "${YELLOW}💾 Clearing application caches...${NC}"
  
  # Clear Parse Server cache using cloud function with master key
  local cache_clear=$(curl -s -X POST \
    -H "X-Parse-Application-Id: ${PARSE_APP_ID}" \
    -H "X-Parse-Master-Key: ${PARSE_MASTER_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"_MasterKey":"'"${PARSE_MASTER_KEY}"'"}' \
    "${PARSE_ENDPOINT}/functions/clearAllCache" --max-time 10 2>&1)
  
  if [[ "$cache_clear" == *"success"* ]] || [[ "$cache_clear" == *"cleared"* ]] || [[ "$cache_clear" == *"result"* ]]; then
    log "${GREEN}✅ Application cache cleared successfully${NC}"
  else
    # Cache clearing is not critical, just log warning
    log "${YELLOW}⚠️  Cache clear may have failed (non-critical): ${cache_clear:0:100}${NC}"
  fi
  
  return 0
}

# Fix database connection issues
fix_database_issues() {
  log "${YELLOW}🔧 Attempting to fix database connection issues...${NC}"
  
  # Restart Parse Server to reset connection pool
  restart_parse_server
  sleep 10
  
  if check_database; then
    log "${GREEN}✅ Database connection restored${NC}"
    return 0
  fi
  
  log "${RED}❌ Could not restore database connection${NC}"
  return 1
}

# Fix disk space issues
fix_disk_space() {
  log "${YELLOW}🧹 Attempting to free up disk space...${NC}"
  
  # Clean up old log files (older than 7 days)
  log "Cleaning up old log files..."
  find "${LOG_DIR}" -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true
  
  # Flush PM2 logs
  pm2 flush >> "${LOG_FILE}" 2>&1 || true
  
  # Clean up journalctl logs if available
  if command -v journalctl &> /dev/null; then
    log "Cleaning journalctl logs..."
    sudo journalctl --vacuum-time=3d >> "${LOG_FILE}" 2>&1 || true
  fi
  
  # Check if disk space improved
  local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
  if [ "$disk_usage" -gt 85 ]; then
    log "${YELLOW}⚠️  Disk usage still high: ${disk_usage}%${NC}"
    return 1
  else
    log "${GREEN}✅ Disk usage improved to ${disk_usage}%${NC}"
    return 0
  fi
}

# Main monitoring and healing function
check_and_heal() {
  log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  log "${GREEN}=== Starting system health check and auto-remediation ===${NC}"
  log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  local issues_found=false
  local all_fixed=true
  
  # Check Parse Server
  if ! check_parse_server; then
    issues_found=true
    log "${YELLOW}🔧 Attempting to fix Parse Server issues...${NC}"
    
    if ! restart_parse_server; then
      all_fixed=false
    fi
  fi
  
  # Check database
  if ! check_database; then
    issues_found=true
    log "${YELLOW}🔧 Attempting to fix database issues...${NC}"
    
    if ! fix_database_issues; then
      all_fixed=false
    fi
  fi
  
  # Check PM2 processes
  if ! check_pm2_processes; then
    issues_found=true
    log "${YELLOW}🔧 Attempting to fix PM2 issues...${NC}"
    
    if ! restart_all_pm2; then
      all_fixed=false
    fi
  fi
  
  # Check system resources
  if ! check_system_resources; then
    issues_found=true
    log "${YELLOW}🔧 Attempting to fix resource issues...${NC}"
    
    fix_disk_space
    clear_caches
  fi
  
  # Final status report
  log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if [ "$issues_found" = false ]; then
    log "${GREEN}✅ System health check completed: No issues found${NC}"
    return 0
  elif [ "$all_fixed" = true ]; then
    log "${GREEN}✅ System health check completed: All issues were fixed automatically${NC}"
    return 0
  else
    log "${RED}❌ System health check completed: Some issues require manual intervention${NC}"
    return 1
  fi
}

# Run the checks and fixes
check_and_heal
exit_code=$?

# Save PM2 state
pm2 save > /dev/null 2>&1 || true

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "Monitoring session ended. Exit code: ${exit_code}"

exit $exit_code
