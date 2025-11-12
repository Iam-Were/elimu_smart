#!/bin/bash

# Elimu Smart PWA Deployment Script
# This script builds and deploys the PWA to production

set -e  # Exit on error

echo "🚀 Elimu Smart PWA Deployment"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from frontend directory${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Pre-deployment checks...${NC}"

# Step 2: Check if icons exist
MISSING_ICONS=0
if [ ! -f "public/pwa-192x192.png" ]; then
    echo -e "${RED}   ❌ Missing: public/pwa-192x192.png${NC}"
    MISSING_ICONS=1
fi
if [ ! -f "public/pwa-512x512.png" ]; then
    echo -e "${RED}   ❌ Missing: public/pwa-512x512.png${NC}"
    MISSING_ICONS=1
fi

if [ $MISSING_ICONS -eq 1 ]; then
    echo -e "${YELLOW}"
    echo "⚠️  PWA icons are missing!"
    echo ""
    echo "To create icons:"
    echo "1. Open: frontend/create-pwa-icons.html in browser"
    echo "2. Download all icons"
    echo "3. Place them in frontend/public/"
    echo ""
    echo "Or use online generator:"
    echo "https://www.pwabuilder.com/imageGenerator"
    echo -e "${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}   ✅ Icons found${NC}"
fi

# Step 3: Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -d "node_modules/vite-plugin-pwa" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Step 4: Run linter
echo -e "${YELLOW}🔍 Running linter...${NC}"
if npm run lint; then
    echo -e "${GREEN}   ✅ Lint passed${NC}"
else
    echo -e "${RED}   ❌ Lint failed${NC}"
    exit 1
fi

# Step 5: Build production bundle
echo -e "${YELLOW}🏗️  Building production bundle...${NC}"
if npm run build; then
    echo -e "${GREEN}   ✅ Build successful${NC}"
else
    echo -e "${RED}   ❌ Build failed${NC}"
    exit 1
fi

# Step 6: Check if service worker was generated
if [ ! -f "dist/sw.js" ]; then
    echo -e "${RED}   ❌ Service worker not generated${NC}"
    exit 1
else
    echo -e "${GREEN}   ✅ Service worker generated${NC}"
fi

# Step 7: Display build info
echo ""
echo -e "${GREEN}✅ Build Complete!${NC}"
echo ""
echo "📊 Build Summary:"
ls -lh dist/sw.js | awk '{print "   Service Worker: " $5}'
ls -lh dist/index.html | awk '{print "   Index HTML: " $5}'
echo "   Total dist size: $(du -sh dist | awk '{print $1}')"
echo ""

# Step 8: Ask for deployment confirmation
echo -e "${YELLOW}📤 Ready to deploy to production${NC}"
echo "   Target: root@145.239.42.121:/var/www/elimu-smart/"
echo ""
read -p "Deploy now? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled. Build files are in dist/${NC}"
    exit 0
fi

# Step 9: Deploy to VPS
echo -e "${YELLOW}🚀 Deploying to production...${NC}"

# Create backup of current production
echo "   Creating backup..."
ssh root@145.239.42.121 "tar -czf /root/elimu_smart_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /var/www elimu-smart 2>/dev/null || true"

# Deploy new build
echo "   Copying files to VPS..."
scp -r dist/* root@145.239.42.121:/var/www/elimu-smart/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ Deployment successful${NC}"
else
    echo -e "${RED}   ❌ Deployment failed${NC}"
    exit 1
fi

# Step 10: Verify deployment
echo ""
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"

# Check if service worker is accessible
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://elimu-smart.co.ke/sw.js)
if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}   ✅ Service worker accessible${NC}"
else
    echo -e "${RED}   ❌ Service worker not accessible (HTTP $HTTP_CODE)${NC}"
fi

# Check if manifest is accessible
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://elimu-smart.co.ke/manifest.webmanifest)
if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}   ✅ Manifest accessible${NC}"
else
    echo -e "${RED}   ❌ Manifest not accessible (HTTP $HTTP_CODE)${NC}"
fi

# Check if main page loads
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://elimu-smart.co.ke/)
if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}   ✅ Main page accessible${NC}"
else
    echo -e "${RED}   ❌ Main page not accessible (HTTP $HTTP_CODE)${NC}"
fi

# Final success message
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "📱 Test your PWA:"
echo "   Desktop: https://elimu-smart.co.ke"
echo "   Android Chrome: Install prompt should appear after 5 seconds"
echo "   iOS Safari: Share → Add to Home Screen"
echo ""
echo "🔍 Verify in DevTools:"
echo "   Application → Manifest (check icons)"
echo "   Application → Service Workers (check registration)"
echo "   Network → Offline (test offline mode)"
echo ""
echo -e "${GREEN}✅ PWA is now live!${NC}"
