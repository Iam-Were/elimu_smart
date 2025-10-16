#!/bin/bash
# Post-deployment restart script for Elimu Smart platform
# Flushes caches and restarts services after successful deployment
# Only runs when explicitly triggered with "deployment-successful" parameter

set -e  # Exit immediately if a command exits with non-zero status

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if deployment was successful (required parameter)
if [ "$1" != "deployment-successful" ]; then
  echo -e "${RED}Error: This script should only be run after a successful deployment${NC}"
  echo "Usage: $0 deployment-successful"
  exit 1
fi

echo -e "${GREEN}🚀 Starting post-deployment server restart...${NC}"

# Get current timestamp for logging
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_DIR="/root/elimu_smart/backend/logs"
LOG_FILE="${LOG_DIR}/deployment-restart-${TIMESTAMP}.log"

# Create log directory if it doesn't exist
mkdir -p "${LOG_DIR}"

echo "[$TIMESTAMP] Post-deployment restart initiated" | tee -a "$LOG_FILE"

# Load environment variables
if [ -f "/root/elimu_smart/backend/.env" ]; then
  export $(cat /root/elimu_smart/backend/.env | grep -v '^#' | xargs)
fi

# 1. Flush PM2 logs
echo -e "${YELLOW}📋 Flushing PM2 logs...${NC}" | tee -a "$LOG_FILE"
pm2 flush >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to flush PM2 logs${NC}" | tee -a "$LOG_FILE"
else
  echo -e "${GREEN}✅ PM2 logs flushed successfully${NC}" | tee -a "$LOG_FILE"
fi

# 2. Clear cache using Parse Cloud Function (if available)
echo -e "${YELLOW}💾 Clearing application caches...${NC}" | tee -a "$LOG_FILE"

CACHE_CLEAR_RESPONSE=$(curl -s -X POST https://elimu-smart.co.ke/parse/functions/clearAllCache \
  -H "X-Parse-Application-Id: elimu-smart-production" \
  -H "X-Parse-Master-Key: ${PARSE_MASTER_KEY}" \
  -H "Content-Type: application/json" \
  -d '{}' 2>&1)

if [[ "$CACHE_CLEAR_RESPONSE" == *"success"* ]] || [[ "$CACHE_CLEAR_RESPONSE" == *"cleared"* ]]; then
  echo -e "${GREEN}✅ Application cache cleared successfully${NC}" | tee -a "$LOG_FILE"
else
  echo -e "${YELLOW}⚠️  Cache clear response: $CACHE_CLEAR_RESPONSE${NC}" | tee -a "$LOG_FILE"
fi

# 3. Reload all PM2 processes (graceful restart)
echo -e "${YELLOW}🔄 Reloading all PM2 processes...${NC}" | tee -a "$LOG_FILE"
pm2 reload all >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to reload PM2 processes${NC}" | tee -a "$LOG_FILE"
  echo -e "${YELLOW}Attempting regular restart...${NC}" | tee -a "$LOG_FILE"
  pm2 restart all >> "$LOG_FILE" 2>&1
fi

# 4. Save PM2 process list
pm2 save >> "$LOG_FILE" 2>&1
echo -e "${GREEN}✅ PM2 processes reloaded and saved successfully${NC}" | tee -a "$LOG_FILE"

# 5. Wait for services to stabilize
echo -e "${YELLOW}⏳ Waiting for services to stabilize...${NC}" | tee -a "$LOG_FILE"
sleep 10

# 6. Verify Parse Server is running properly
echo -e "${YELLOW}🔍 Verifying Parse Server status...${NC}" | tee -a "$LOG_FILE"

MAX_RETRIES=5
RETRY_COUNT=0
PARSE_HEALTHY=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$PARSE_HEALTHY" = false ]; do
  HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://elimu-smart.co.ke/parse/health)
  
  if [ "$HEALTH_CHECK" = "200" ]; then
    PARSE_HEALTHY=true
    echo -e "${GREEN}✅ Parse Server is running correctly (HTTP $HEALTH_CHECK)${NC}" | tee -a "$LOG_FILE"
  else
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo -e "${YELLOW}⚠️  Parse Server health check returned $HEALTH_CHECK, retrying ($RETRY_COUNT/$MAX_RETRIES)...${NC}" | tee -a "$LOG_FILE"
      sleep 5
    fi
  fi
done

if [ "$PARSE_HEALTHY" = false ]; then
  echo -e "${RED}❌ Parse Server health check failed after $MAX_RETRIES attempts${NC}" | tee -a "$LOG_FILE"
  echo -e "${YELLOW}⚠️  Attempting emergency restart...${NC}" | tee -a "$LOG_FILE"
  
  pm2 restart parse-server-prod >> "$LOG_FILE" 2>&1
  sleep 15
  
  # Final check
  HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://elimu-smart.co.ke/parse/health)
  
  if [ "$HEALTH_CHECK" != "200" ]; then
    echo -e "${RED}❌ Emergency restart failed. Parse Server is not responding correctly${NC}" | tee -a "$LOG_FILE"
    echo -e "${YELLOW}Manual intervention may be required. Check logs with: pm2 logs parse-server-prod${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}✅ Emergency restart successful${NC}" | tee -a "$LOG_FILE"
fi

# 7. Check frontend availability
echo -e "${YELLOW}🔍 Verifying frontend availability...${NC}" | tee -a "$LOG_FILE"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://elimu-smart.co.ke/)

if [ "$FRONTEND_STATUS" = "200" ]; then
  echo -e "${GREEN}✅ Frontend is accessible (HTTP $FRONTEND_STATUS)${NC}" | tee -a "$LOG_FILE"
else
  echo -e "${YELLOW}⚠️  Frontend returned HTTP $FRONTEND_STATUS${NC}" | tee -a "$LOG_FILE"
fi

# 8. Display PM2 status
echo -e "${YELLOW}📊 Current PM2 Status:${NC}" | tee -a "$LOG_FILE"
pm2 list | tee -a "$LOG_FILE"

# 9. Report success
echo "" | tee -a "$LOG_FILE"
echo -e "${GREEN}🎉 Post-deployment restart completed successfully!${NC}" | tee -a "$LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
echo "Timestamp: $(date)" | tee -a "$LOG_FILE"
echo "Log file: $LOG_FILE" | tee -a "$LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"

exit 0
