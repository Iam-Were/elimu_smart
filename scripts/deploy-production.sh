#!/bin/bash
# Elimu Smart Production Deployment Script
# Run this after setting up SSH key: ssh-copy-id -i ~/.ssh/elimu_vps.pub root@145.239.42.121

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[1;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Elimu Smart Production Deployment   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if SSH key is set up
echo -e "${YELLOW}🔐 Testing SSH connection...${NC}"
if ssh -o BatchMode=yes -o ConnectTimeout=5 elimusmart-prod exit 2>/dev/null; then
    echo -e "${GREEN}✅ SSH connection successful!${NC}"
else
    echo -e "${RED}❌ SSH key not set up yet!${NC}"
    echo ""
    echo "Please run this command first (password: El1musmart):"
    echo "  ssh-copy-id -i ~/.ssh/elimu_vps.pub root@145.239.42.121"
    echo ""
    exit 1
fi

echo ""
echo -e "${YELLOW}📥 Step 1: Pulling latest code from GitHub...${NC}"
ssh elimusmart-prod "cd /root/elimu_smart && git pull origin main"
echo -e "${GREEN}✅ Code updated${NC}"

echo ""
echo -e "${YELLOW}📦 Step 2: Installing dependencies...${NC}"
ssh elimusmart-prod "cd /root/elimu_smart/frontend && npm install"
ssh elimusmart-prod "cd /root/elimu_smart/backend && npm install"
echo -e "${GREEN}✅ Dependencies installed${NC}"

echo ""
echo -e "${YELLOW}🏗️  Step 3: Building frontend (production mode)...${NC}"
ssh elimusmart-prod "cd /root/elimu_smart/frontend && npm run build -- --mode production"
echo -e "${GREEN}✅ Frontend built${NC}"

echo ""
echo -e "${YELLOW}📤 Step 4: Deploying frontend to Nginx...${NC}"
ssh elimusmart-prod "sudo cp -r /root/elimu_smart/frontend/dist/* /var/www/elimu-smart/"
echo -e "${GREEN}✅ Frontend deployed${NC}"

echo ""
echo -e "${YELLOW}🔄 Step 5: Restarting backend (PM2 graceful reload)...${NC}"
ssh elimusmart-prod "pm2 reload parse-server-prod"
echo -e "${GREEN}✅ Backend restarted${NC}"

echo ""
echo -e "${YELLOW}⏳ Waiting 5 seconds for services to stabilize...${NC}"
sleep 5

echo ""
echo -e "${YELLOW}🏥 Step 6: Running health checks...${NC}"
PARSE_HEALTH=$(ssh elimusmart-prod "curl -s https://elimu-smart.co.ke/parse/health")
FRONTEND_STATUS=$(ssh elimusmart-prod "curl -s -o /dev/null -w '%{http_code}' https://elimu-smart.co.ke")

echo "  Parse Server: $PARSE_HEALTH"
echo "  Frontend HTTP: $FRONTEND_STATUS"

if [[ "$PARSE_HEALTH" == *"ok"* ]] && [ "$FRONTEND_STATUS" == "200" ]; then
    echo -e "${GREEN}✅ All services healthy!${NC}"
else
    echo -e "${RED}⚠️  Warning: Some health checks failed${NC}"
fi

echo ""
echo -e "${YELLOW}📊 PM2 Status:${NC}"
ssh elimusmart-prod "pm2 status"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     🎉 Deployment Completed! 🎉        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 Site: https://elimu-smart.co.ke${NC}"
echo -e "${BLUE}📝 To view logs: ssh elimusmart-prod 'pm2 logs parse-server-prod --lines 50'${NC}"
echo ""
