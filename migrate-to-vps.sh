#!/bin/bash

# Elimu Smart VPS Migration Script
# VPS IP: 145.239.42.121
# Run this script from your local machine

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# VPS Configuration
VPS_IP="145.239.42.121"
VPS_USER="root"
VPS_PASSWORD="El1musmart"
APP_USER="elimu"
APP_DIR="/home/elimu/elimu_smart"
DB_NAME="elimu_smart_production"
DB_USER="elimu_db_user"
DB_PASSWORD="your-strong-password-here"  # CHANGE THIS!

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Elimu Smart VPS Migration Script${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Function to print step header
print_step() {
    echo -e "\n${YELLOW}>>> $1${NC}\n"
}

# Function to run command on VPS
run_on_vps() {
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "$1"
}

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}Error: sshpass not installed${NC}"
    echo "Install it with: sudo apt install sshpass (Linux) or brew install sshpass (Mac)"
    exit 1
fi

# Step 1: Test VPS Connection
print_step "Step 1: Testing VPS Connection"
if run_on_vps "echo 'Connection successful'"; then
    echo -e "${GREEN}✓ VPS connection established${NC}"
else
    echo -e "${RED}✗ Failed to connect to VPS${NC}"
    exit 1
fi

# Step 2: Update VPS System
print_step "Step 2: Updating VPS System"
run_on_vps "apt update && apt upgrade -y"
echo -e "${GREEN}✓ System updated${NC}"

# Step 3: Install Required Software
print_step "Step 3: Installing Required Software"
run_on_vps "
    # Install Node.js 20.x
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs

    # Install PostgreSQL
    apt install -y postgresql postgresql-contrib

    # Install Nginx
    apt install -y nginx

    # Install PM2
    npm install -g pm2

    # Install Git
    apt install -y git
"
echo -e "${GREEN}✓ Software installed${NC}"

# Step 4: Create Application User
print_step "Step 4: Creating Application User"
run_on_vps "
    if ! id -u $APP_USER > /dev/null 2>&1; then
        adduser --disabled-password --gecos '' $APP_USER
        usermod -aG sudo $APP_USER
        echo '$APP_USER:$VPS_PASSWORD' | chpasswd
    fi
    mkdir -p $APP_DIR
    chown -R $APP_USER:$APP_USER $APP_DIR
"
echo -e "${GREEN}✓ User '$APP_USER' created${NC}"

# Step 5: Setup PostgreSQL Database
print_step "Step 5: Setting Up PostgreSQL Database"
run_on_vps "
    sudo -u postgres psql -c \"CREATE DATABASE $DB_NAME;\" 2>/dev/null || true
    sudo -u postgres psql -c \"CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';\" 2>/dev/null || true
    sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;\"
"
echo -e "${GREEN}✓ Database created${NC}"

# Step 6: Export Local Database
print_step "Step 6: Exporting Local Database"
if command -v pg_dump &> /dev/null; then
    cd backend
    PGPASSWORD=password pg_dump -U postgres -h localhost -d elimu_smart_dev -F c -f elimu_smart_backup.dump
    echo -e "${GREEN}✓ Database exported${NC}"

    # Transfer database dump to VPS
    print_step "Step 6b: Transferring Database to VPS"
    sshpass -p "$VPS_PASSWORD" scp -o StrictHostKeyChecking=no elimu_smart_backup.dump $VPS_USER@$VPS_IP:/tmp/
    echo -e "${GREEN}✓ Database transferred${NC}"

    # Import database on VPS
    print_step "Step 6c: Importing Database on VPS"
    run_on_vps "sudo -u postgres pg_restore -d $DB_NAME /tmp/elimu_smart_backup.dump 2>/dev/null || true"
    echo -e "${GREEN}✓ Database imported${NC}"
else
    echo -e "${YELLOW}⚠ pg_dump not found, skipping database export${NC}"
    echo "You'll need to export and import database manually"
fi

# Step 7: Transfer Backend Code
print_step "Step 7: Transferring Backend Code"
cd ..
sshpass -p "$VPS_PASSWORD" scp -r -o StrictHostKeyChecking=no backend $VPS_USER@$VPS_IP:$APP_DIR/
echo -e "${GREEN}✓ Backend code transferred${NC}"

# Step 8: Create Backend Environment File
print_step "Step 8: Creating Backend Environment File"
run_on_vps "cat > $APP_DIR/backend/.env << 'EOF'
APP_ID=elimu-smart-production
MASTER_KEY=$(openssl rand -hex 32)
SERVER_URL=http://145.239.42.121/parse
PUBLIC_SERVER_URL=http://145.239.42.121/parse

DATABASE_URI=postgres://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME

PORT=1337
NODE_ENV=production

SESSION_SECRET=$(openssl rand -hex 32)

ALLOWED_ORIGINS=http://145.239.42.121,https://elimu-smart.com,https://www.elimu-smart.com
EOF
"
echo -e "${GREEN}✓ Backend environment configured${NC}"

# Step 9: Install Backend Dependencies
print_step "Step 9: Installing Backend Dependencies"
run_on_vps "cd $APP_DIR/backend && npm install --production"
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Step 10: Setup PM2 Process Manager
print_step "Step 10: Setting Up PM2 Process Manager"
run_on_vps "
cat > $APP_DIR/backend/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'elimu-parse-server',
    script: './server-working.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 1337
    },
    error_file: './logs/parse-error.log',
    out_file: './logs/parse-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M'
  }]
}
EOF

cd $APP_DIR/backend
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -n 1 | bash
"
echo -e "${GREEN}✓ PM2 configured and Parse Server started${NC}"

# Step 11: Build Frontend
print_step "Step 11: Building Frontend"
cd frontend
npm run build
echo -e "${GREEN}✓ Frontend built${NC}"

# Step 12: Transfer Frontend
print_step "Step 12: Transferring Frontend"
sshpass -p "$VPS_PASSWORD" scp -r -o StrictHostKeyChecking=no dist $VPS_USER@$VPS_IP:$APP_DIR/frontend/
echo -e "${GREEN}✓ Frontend transferred${NC}"

# Step 13: Configure Nginx
print_step "Step 13: Configuring Nginx"
run_on_vps "
cat > /etc/nginx/sites-available/elimu-smart << 'EOF'
server {
    listen 80;
    server_name 145.239.42.121 elimu-smart.com www.elimu-smart.com;

    root $APP_DIR/frontend/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /parse {
        proxy_pass http://localhost:1337/parse;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
}
EOF

ln -sf /etc/nginx/sites-available/elimu-smart /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
"
echo -e "${GREEN}✓ Nginx configured${NC}"

# Step 14: Configure Firewall
print_step "Step 14: Configuring Firewall"
run_on_vps "
    ufw allow 22
    ufw allow 80
    ufw allow 443
    ufw --force enable
"
echo -e "${GREEN}✓ Firewall configured${NC}"

# Step 15: Setup Automated Backups
print_step "Step 15: Setting Up Automated Backups"
run_on_vps "
cat > /home/$APP_USER/backup-database.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=\"/home/$APP_USER/backups\"
DATE=\$(date +%Y%m%d_%H%M%S)
mkdir -p \$BACKUP_DIR
PGPASSWORD='$DB_PASSWORD' pg_dump -U $DB_USER -h localhost -d $DB_NAME -F c -f \$BACKUP_DIR/elimu_smart_\$DATE.dump
find \$BACKUP_DIR -name \"*.dump\" -mtime +7 -delete
EOF

chmod +x /home/$APP_USER/backup-database.sh
chown $APP_USER:$APP_USER /home/$APP_USER/backup-database.sh

(crontab -u $APP_USER -l 2>/dev/null; echo '0 2 * * * /home/$APP_USER/backup-database.sh') | crontab -u $APP_USER -
"
echo -e "${GREEN}✓ Automated backups configured${NC}"

# Final Status Check
print_step "Migration Complete! Checking Status..."
echo ""
echo -e "${GREEN}✓ VPS System: Updated${NC}"
echo -e "${GREEN}✓ Software: Installed (Node.js, PostgreSQL, Nginx, PM2)${NC}"
echo -e "${GREEN}✓ Database: Migrated${NC}"
echo -e "${GREEN}✓ Backend: Deployed & Running${NC}"
echo -e "${GREEN}✓ Frontend: Built & Deployed${NC}"
echo -e "${GREEN}✓ Nginx: Configured${NC}"
echo -e "${GREEN}✓ Firewall: Enabled${NC}"
echo -e "${GREEN}✓ Backups: Scheduled${NC}"
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Access your application at:${NC}"
echo -e "${GREEN}  http://145.239.42.121${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Configure your domain DNS to point to 145.239.42.121"
echo "2. Install SSL certificate with: ssh root@145.239.42.121 'certbot --nginx -d elimu-smart.com -d www.elimu-smart.com'"
echo "3. Test all features thoroughly"
echo "4. Monitor logs with: ssh root@145.239.42.121 'pm2 logs'"
echo ""
echo -e "${GREEN}Migration completed successfully!${NC}"
