#!/bin/bash
# Quick VPS Deployment Script
# Usage: ./deploy-to-vps.sh [staging|production]

set -e  # Exit on error

ENVIRONMENT=${1:-production}
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Deploying to ${ENVIRONMENT}...${NC}\n"

# Step 1: Pull latest code
echo -e "${YELLOW}📥 Pulling latest code...${NC}"
cd /root/elimu_smart
git pull origin main

# Step 2: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
cd backend && npm install
cd ../frontend && npm install

# Step 3: Run migrations
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
cd /root/elimu_smart/backend

if [ "$ENVIRONMENT" == "production" ]; then
    node migrations/create-user-preferences-schema.js production
    node migrations/schema-assessments.js production
    node migrations/seed-assessments.js production
else
    node migrations/create-user-preferences-schema.js staging
    node migrations/schema-assessments.js staging
    node migrations/seed-assessments.js staging
fi

# Step 4: Build frontend
echo -e "${YELLOW}🏗️  Building frontend...${NC}"
cd /root/elimu_smart/frontend
npm run build -- --mode $ENVIRONMENT

# Step 5: Deploy frontend
echo -e "${YELLOW}📤 Deploying frontend to Nginx...${NC}"
if [ "$ENVIRONMENT" == "production" ]; then
    sudo cp -r dist/* /var/www/elimu-smart/
else
    sudo cp -r dist/* /var/www/elimu-smart-staging/
fi

# Step 6: Restart backend
echo -e "${YELLOW}🔄 Restarting backend services...${NC}"
cd /root/elimu_smart/backend
if [ "$ENVIRONMENT" == "production" ]; then
    pm2 restart parse-server-prod
else
    pm2 restart parse-server-staging
fi

# Step 7: Health checks
echo -e "\n${YELLOW}🏥 Running health checks...${NC}"
sleep 5

if [ "$ENVIRONMENT" == "production" ]; then
    PARSE_HEALTH=$(curl -s https://elimu-smart.co.ke/parse/health)
    FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://elimu-smart.co.ke)
else
    PARSE_HEALTH=$(curl -s https://staging.elimu-smart.co.ke/parse/health)
    FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://staging.elimu-smart.co.ke)
fi

echo "Parse Server: $PARSE_HEALTH"
echo "Frontend Status: $FRONTEND_STATUS"

if [[ "$PARSE_HEALTH" == *"ok"* ]] && [ "$FRONTEND_STATUS" == "200" ]; then
    echo -e "\n${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Site is live and healthy${NC}\n"
else
    echo -e "\n${RED}❌ Health checks failed!${NC}"
    echo -e "${RED}Please check logs: pm2 logs parse-server-${ENVIRONMENT}${NC}\n"
    exit 1
fi

# Show PM2 status
echo -e "${YELLOW}📊 PM2 Status:${NC}"
pm2 status

echo -e "\n${GREEN}🎉 Deployment complete!${NC}"
