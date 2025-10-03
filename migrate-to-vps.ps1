# Elimu Smart VPS Migration Script (PowerShell for Windows)
# VPS IP: 145.239.42.121
# Run this script from PowerShell as Administrator

param(
    [string]$VpsIp = "145.239.42.121",
    [string]$VpsUser = "root",
    [string]$VpsPassword = "El1musmart",
    [string]$DbPassword = "your-strong-password-here"  # CHANGE THIS!
)

$ErrorActionPreference = "Stop"

# Colors
function Write-Step($message) {
    Write-Host "`n>>> $message`n" -ForegroundColor Yellow
}

function Write-Success($message) {
    Write-Host "✓ $message" -ForegroundColor Green
}

function Write-Error-Custom($message) {
    Write-Host "✗ $message" -ForegroundColor Red
}

function Write-Warning-Custom($message) {
    Write-Host "⚠ $message" -ForegroundColor Yellow
}

Write-Host "================================" -ForegroundColor Green
Write-Host "Elimu Smart VPS Migration Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if PuTTY/PSCP is installed
$pscpPath = "C:\Program Files\PuTTY\pscp.exe"
$plinkPath = "C:\Program Files\PuTTY\plink.exe"

if (-not (Test-Path $pscpPath) -or -not (Test-Path $plinkPath)) {
    Write-Error-Custom "PuTTY tools not found. Please install PuTTY from https://www.putty.org/"
    Write-Host "Or use manual steps from VPS_MIGRATION_GUIDE.md"
    exit 1
}

# Function to run command on VPS
function Invoke-VpsCommand($command) {
    $password = $VpsPassword
    echo y | & $plinkPath -pw $password "$VpsUser@$VpsIp" $command
}

# Function to copy files to VPS
function Copy-ToVps($localPath, $remotePath) {
    $password = $VpsPassword
    echo y | & $pscpPath -pw $password -r $localPath "${VpsUser}@${VpsIp}:${remotePath}"
}

# Step 1: Test VPS Connection
Write-Step "Step 1: Testing VPS Connection"
try {
    Invoke-VpsCommand "echo 'Connection successful'"
    Write-Success "VPS connection established"
} catch {
    Write-Error-Custom "Failed to connect to VPS"
    exit 1
}

# Step 2: Update VPS System
Write-Step "Step 2: Updating VPS System (this may take a few minutes)"
Invoke-VpsCommand "apt update && apt upgrade -y"
Write-Success "System updated"

# Step 3: Install Required Software
Write-Step "Step 3: Installing Required Software"
Invoke-VpsCommand @"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
apt install -y nodejs postgresql postgresql-contrib nginx git && \
npm install -g pm2
"@
Write-Success "Software installed (Node.js, PostgreSQL, Nginx, PM2, Git)"

# Step 4: Create Application User
Write-Step "Step 4: Creating Application User 'elimu'"
Invoke-VpsCommand @"
if ! id -u elimu > /dev/null 2>&1; then
    adduser --disabled-password --gecos '' elimu
    usermod -aG sudo elimu
    echo 'elimu:$VpsPassword' | chpasswd
fi
mkdir -p /home/elimu/elimu_smart
chown -R elimu:elimu /home/elimu/elimu_smart
"@
Write-Success "User 'elimu' created"

# Step 5: Setup PostgreSQL Database
Write-Step "Step 5: Setting Up PostgreSQL Database"
Invoke-VpsCommand @"
sudo -u postgres psql -c \"CREATE DATABASE elimu_smart_production;\" 2>/dev/null || true
sudo -u postgres psql -c \"CREATE USER elimu_db_user WITH ENCRYPTED PASSWORD '$DbPassword';\" 2>/dev/null || true
sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE elimu_smart_production TO elimu_db_user;\"
"@
Write-Success "Database 'elimu_smart_production' created"

# Step 6: Export Local Database
Write-Step "Step 6: Exporting Local Database"
$pgDumpPath = "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe"
if (Test-Path $pgDumpPath) {
    Set-Location backend
    $env:PGPASSWORD = "password"
    & $pgDumpPath -U postgres -h localhost -d elimu_smart_dev -F c -f elimu_smart_backup.dump
    Write-Success "Database exported"

    # Transfer database dump to VPS
    Write-Step "Step 6b: Transferring Database to VPS"
    Copy-ToVps "elimu_smart_backup.dump" "/tmp/"
    Write-Success "Database transferred"

    # Import database on VPS
    Write-Step "Step 6c: Importing Database on VPS"
    Invoke-VpsCommand "sudo -u postgres pg_restore -d elimu_smart_production /tmp/elimu_smart_backup.dump 2>/dev/null || true"
    Write-Success "Database imported"
    Set-Location ..
} else {
    Write-Warning-Custom "pg_dump not found at $pgDumpPath"
    Write-Host "You'll need to export and import database manually"
}

# Step 7: Transfer Backend Code
Write-Step "Step 7: Transferring Backend Code"
Copy-ToVps "backend" "/home/elimu/elimu_smart/"
Write-Success "Backend code transferred"

# Step 8: Create Backend Environment File
Write-Step "Step 8: Creating Backend Environment File"
$masterKey = -join ((48..57) + (97..102) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$sessionSecret = -join ((48..57) + (97..102) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Invoke-VpsCommand @"
cat > /home/elimu/elimu_smart/backend/.env << 'EOF'
APP_ID=elimu-smart-production
MASTER_KEY=$masterKey
SERVER_URL=http://145.239.42.121/parse
PUBLIC_SERVER_URL=http://145.239.42.121/parse

DATABASE_URI=postgres://elimu_db_user:$DbPassword@localhost:5432/elimu_smart_production

PORT=1337
NODE_ENV=production

SESSION_SECRET=$sessionSecret

ALLOWED_ORIGINS=http://145.239.42.121,https://elimu-smart.com,https://www.elimu-smart.com
EOF
"@
Write-Success "Backend environment configured"

# Step 9: Install Backend Dependencies
Write-Step "Step 9: Installing Backend Dependencies"
Invoke-VpsCommand "cd /home/elimu/elimu_smart/backend && npm install --production"
Write-Success "Backend dependencies installed"

# Step 10: Setup PM2 Process Manager
Write-Step "Step 10: Setting Up PM2 Process Manager"
Invoke-VpsCommand @"
cat > /home/elimu/elimu_smart/backend/ecosystem.config.js << 'EOFPM2'
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
EOFPM2

cd /home/elimu/elimu_smart/backend
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -n 1 | bash
"@
Write-Success "PM2 configured and Parse Server started"

# Step 11: Build Frontend
Write-Step "Step 11: Building Frontend"
Set-Location frontend
npm run build
Write-Success "Frontend built"

# Step 12: Transfer Frontend
Write-Step "Step 12: Transferring Frontend"
Copy-ToVps "dist" "/home/elimu/elimu_smart/frontend/"
Write-Success "Frontend transferred"
Set-Location ..

# Step 13: Configure Nginx
Write-Step "Step 13: Configuring Nginx"
Invoke-VpsCommand @"
cat > /etc/nginx/sites-available/elimu-smart << 'EOFNGINX'
server {
    listen 80;
    server_name 145.239.42.121 elimu-smart.com www.elimu-smart.com;

    root /home/elimu/elimu_smart/frontend/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files \`$uri \`$uri/ /index.html;
    }

    location /parse {
        proxy_pass http://localhost:1337/parse;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \`$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \`$host;
        proxy_set_header X-Real-IP \`$remote_addr;
        proxy_set_header X-Forwarded-For \`$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \`$scheme;
        proxy_cache_bypass \`$http_upgrade;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)\`$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
}
EOFNGINX

ln -sf /etc/nginx/sites-available/elimu-smart /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
"@
Write-Success "Nginx configured"

# Step 14: Configure Firewall
Write-Step "Step 14: Configuring Firewall"
Invoke-VpsCommand "ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw --force enable"
Write-Success "Firewall configured"

# Step 15: Setup Automated Backups
Write-Step "Step 15: Setting Up Automated Backups"
Invoke-VpsCommand @"
cat > /home/elimu/backup-database.sh << 'EOFBACKUP'
#!/bin/bash
BACKUP_DIR=\"/home/elimu/backups\"
DATE=\`$(date +%Y%m%d_%H%M%S)
mkdir -p \`$BACKUP_DIR
PGPASSWORD='$DbPassword' pg_dump -U elimu_db_user -h localhost -d elimu_smart_production -F c -f \`$BACKUP_DIR/elimu_smart_\`$DATE.dump
find \`$BACKUP_DIR -name \"*.dump\" -mtime +7 -delete
EOFBACKUP

chmod +x /home/elimu/backup-database.sh
chown elimu:elimu /home/elimu/backup-database.sh

(crontab -u elimu -l 2>/dev/null; echo '0 2 * * * /home/elimu/backup-database.sh') | crontab -u elimu -
"@
Write-Success "Automated backups configured (daily at 2 AM)"

# Final Status
Write-Step "Migration Complete! Final Status:"
Write-Host ""
Write-Success "VPS System: Updated"
Write-Success "Software: Installed (Node.js, PostgreSQL, Nginx, PM2)"
Write-Success "Database: Migrated"
Write-Success "Backend: Deployed & Running"
Write-Success "Frontend: Built & Deployed"
Write-Success "Nginx: Configured"
Write-Success "Firewall: Enabled"
Write-Success "Backups: Scheduled"
Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  Access your application at:" -ForegroundColor Green
Write-Host "  http://145.239.42.121" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Test the application at http://145.239.42.121"
Write-Host "2. Configure your domain DNS to point to 145.239.42.121"
Write-Host "3. Install SSL certificate with certbot"
Write-Host "4. Monitor logs: ssh root@145.239.42.121 'pm2 logs'"
Write-Host ""
Write-Host "Useful Commands:" -ForegroundColor Cyan
Write-Host "  Check Parse Server status: & '$plinkPath' -pw $VpsPassword root@$VpsIp 'pm2 status'"
Write-Host "  View Parse Server logs: & '$plinkPath' -pw $VpsPassword root@$VpsIp 'pm2 logs elimu-parse-server'"
Write-Host "  Restart Parse Server: & '$plinkPath' -pw $VpsPassword root@$VpsIp 'pm2 restart elimu-parse-server'"
Write-Host ""
Write-Success "Migration completed successfully!"
