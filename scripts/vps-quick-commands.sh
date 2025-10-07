#!/bin/bash
# Quick VPS Management Commands
# Usage: ./scripts/vps-quick-commands.sh [command]

HOST="elimu-vps"

case "$1" in
  status)
    echo "=== VPS Status ==="
    ssh $HOST "pm2 status && echo '' && df -h / && echo '' && free -h"
    ;;

  logs-prod)
    echo "=== Production Logs (last 50 lines) ==="
    ssh $HOST "pm2 logs parse-server-prod --lines 50 --nostream"
    ;;

  logs-staging)
    echo "=== Staging Logs (last 50 lines) ==="
    ssh $HOST "pm2 logs parse-server-staging --lines 50 --nostream"
    ;;

  restart-staging)
    echo "=== Restarting Staging ==="
    ssh $HOST "pm2 restart parse-server-staging"
    ;;

  restart-prod)
    echo "=== Restarting Production (Graceful) ==="
    ssh $HOST "pm2 reload parse-server-prod"
    ;;

  backup-now)
    echo "=== Creating Database Backup ==="
    ssh $HOST "cd /root/elimu_smart/backend && bash scripts/backup-database.sh"
    ;;

  deploy-staging)
    echo "=== Deploying to Staging ==="
    ssh $HOST "cd /root/elimu_smart && git pull && cd frontend && npm run build -- --mode staging && sudo cp -r dist/* /var/www/elimu-smart-staging/ && pm2 restart parse-server-staging"
    ;;

  deploy-prod)
    echo "=== Deploying to Production ==="
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
      ssh $HOST "cd /root/elimu_smart && git pull && cd frontend && npm run build -- --mode production && sudo cp -r dist/* /var/www/elimu-smart/ && pm2 reload parse-server-prod"
    else
      echo "Deployment cancelled"
    fi
    ;;

  health)
    echo "=== Health Check ==="
    echo "Production API: $(curl -s https://elimu-smart.co.ke/parse/health)"
    echo "Staging API: $(curl -s https://staging.elimu-smart.co.ke/parse/health)"
    ;;

  monitor)
    echo "=== Live Monitoring ==="
    ssh $HOST "pm2 monit"
    ;;

  shell)
    echo "=== Opening SSH Shell ==="
    ssh $HOST
    ;;

  *)
    echo "Usage: $0 {status|logs-prod|logs-staging|restart-staging|restart-prod|backup-now|deploy-staging|deploy-prod|health|monitor|shell}"
    echo ""
    echo "Commands:"
    echo "  status          - Show PM2, disk, and memory status"
    echo "  logs-prod       - View production logs"
    echo "  logs-staging    - View staging logs"
    echo "  restart-staging - Restart staging server"
    echo "  restart-prod    - Graceful restart production"
    echo "  backup-now      - Create database backup"
    echo "  deploy-staging  - Deploy latest to staging"
    echo "  deploy-prod     - Deploy latest to production"
    echo "  health          - Check API health"
    echo "  monitor         - Open PM2 live monitor"
    echo "  shell           - Open SSH shell"
    exit 1
    ;;
esac
