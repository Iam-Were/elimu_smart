#!/bin/bash
# VPS File Explorer Script
# Usage: Run this script after SSH-ing into the VPS
# ssh root@145.239.42.121 'bash -s' < vps-explore.sh

echo "=========================================="
echo "VPS File Structure Explorer"
echo "=========================================="
echo ""

echo "📁 Root Directory Structure:"
ls -lah /root/elimu_smart/
echo ""

echo "📁 Backend Files:"
ls -lah /root/elimu_smart/backend/
echo ""

echo "📁 Frontend Build:"
ls -lah /var/www/elimu-smart/ | head -20
echo ""

echo "📊 PM2 Process Status:"
pm2 status
echo ""

echo "📝 Recent PM2 Logs (Last 20 lines):"
pm2 logs parse-server-prod --lines 20 --nostream
echo ""

echo "🔍 Nginx Configuration:"
ls -lah /etc/nginx/sites-available/
echo ""

echo "💾 Database Status:"
sudo systemctl status postgresql | head -10
echo ""

echo "🔥 Redis Status:"
sudo systemctl status redis-server | head -10
echo ""

echo "=========================================="
echo "✅ Exploration Complete"
echo "=========================================="
