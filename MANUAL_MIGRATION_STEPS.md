# Manual VPS Migration Steps

## Prerequisites
- VPS IP: 145.239.42.121
- Root Password: El1musmart
- Database Password: (choose a strong password)

## Step-by-Step Execution

### Part 1: Initial VPS Setup (Connect via SSH)

```bash
# 1. Connect to VPS
ssh root@145.239.42.121
# Enter password: El1musmart

# 2. Update system
apt update && apt upgrade -y

# 3. Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 4. Install PostgreSQL
apt install -y postgresql postgresql-contrib

# 5. Install Nginx
apt install -y nginx

# 6. Install PM2 globally
npm install -g pm2

# 7. Install Git
apt install -y git

# 8. Verify installations
node --version    # Should show v20.x
npm --version     # Should show 10.x
psql --version    # Should show 17.x
pm2 --version     # Should show latest
```

### Part 2: Create Application User

```bash
# Create user 'elimu'
adduser elimu
# Set password when prompted (use El1musmart or your choice)

# Add to sudo group
usermod -aG sudo elimu

# Create app directory
mkdir -p /home/elimu/elimu_smart
chown -R elimu:elimu /home/elimu/elimu_smart
```

### Part 3: Setup PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL console, run these commands:
CREATE DATABASE elimu_smart_production;
CREATE USER elimu_db_user WITH ENCRYPTED PASSWORD 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON DATABASE elimu_smart_production TO elimu_db_user;
\q
```

### Part 4: Transfer Files from Local Machine

**Open a NEW terminal/PowerShell on your LOCAL machine (don't close SSH):**

```powershell
# Navigate to project directory
cd C:\Users\c\Documents\GitHub\elimu_smart

# 1. Export local database
cd backend
$env:PGPASSWORD = "password"
& "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -U postgres -h localhost -d elimu_smart_dev -F c -f elimu_smart_backup.dump

# 2. Transfer database to VPS using WinSCP or PSCP
# If you have PuTTY installed:
& "C:\Program Files\PuTTY\pscp.exe" elimu_smart_backup.dump root@145.239.42.121:/tmp/

# 3. Transfer backend directory
cd ..
& "C:\Program Files\PuTTY\pscp.exe" -r backend root@145.239.42.121:/home/elimu/elimu_smart/

# 4. Build frontend
cd frontend
npm run build

# 5. Transfer frontend build
& "C:\Program Files\PuTTY\pscp.exe" -r dist root@145.239.42.121:/home/elimu/elimu_smart/frontend/
```

**Alternative if you don't have PuTTY:**
1. Use WinSCP (download from https://winscp.net/)
2. Connect to 145.239.42.121 with root/El1musmart
3. Upload files manually

### Part 5: Import Database (Back in SSH terminal)

```bash
# Import database
sudo -u postgres pg_restore -d elimu_smart_production /tmp/elimu_smart_backup.dump

# Verify import
sudo -u postgres psql -d elimu_smart_production -c "SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';"
```

### Part 6: Configure Backend

```bash
# Create .env file
cat > /home/elimu/elimu_smart/backend/.env << 'EOF'
APP_ID=elimu-smart-production
MASTER_KEY=your-generated-master-key-32-chars-long
SERVER_URL=http://145.239.42.121/parse
PUBLIC_SERVER_URL=http://145.239.42.121/parse

DATABASE_URI=postgres://elimu_db_user:YourStrongPassword123!@localhost:5432/elimu_smart_production

PORT=1337
NODE_ENV=production

SESSION_SECRET=your-generated-session-secret-32-chars

ALLOWED_ORIGINS=http://145.239.42.121,https://elimu-smart.com,https://www.elimu-smart.com
EOF

# Generate secure keys (run these and copy output to .env):
openssl rand -hex 32  # Use for MASTER_KEY
openssl rand -hex 32  # Use for SESSION_SECRET

# Install backend dependencies
cd /home/elimu/elimu_smart/backend
npm install --production

# Test backend manually first
node server-working.js
# If it starts successfully, press Ctrl+C
```

### Part 7: Setup PM2 Process Manager

```bash
# Create PM2 configuration
cat > /home/elimu/elimu_smart/backend/ecosystem.config.js << 'EOF'
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

# Create logs directory
mkdir -p /home/elimu/elimu_smart/backend/logs

# Start Parse Server with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it outputs

# Check status
pm2 status
pm2 logs elimu-parse-server
```

### Part 8: Configure Nginx

```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/elimu-smart << 'EOF'
server {
    listen 80;
    server_name 145.239.42.121 elimu-smart.com www.elimu-smart.com;

    root /home/elimu/elimu_smart/frontend/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /parse {
        proxy_pass http://localhost:1337/parse;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/elimu-smart /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl status nginx
```

### Part 9: Configure Firewall

```bash
# Allow necessary ports
ufw allow 22      # SSH
ufw allow 80      # HTTP
ufw allow 443     # HTTPS

# Enable firewall
ufw --force enable

# Check status
ufw status
```

### Part 10: Setup Automated Backups

```bash
# Create backup script
cat > /home/elimu/backup-database.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/elimu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
PGPASSWORD='YourStrongPassword123!' pg_dump -U elimu_db_user -h localhost -d elimu_smart_production -F c -f $BACKUP_DIR/elimu_smart_$DATE.dump
find $BACKUP_DIR -name "*.dump" -mtime +7 -delete
EOF

# Make executable
chmod +x /home/elimu/backup-database.sh
chown elimu:elimu /home/elimu/backup-database.sh

# Add to crontab (daily at 2 AM)
(crontab -u elimu -l 2>/dev/null; echo "0 2 * * * /home/elimu/backup-database.sh") | crontab -u elimu -

# Verify crontab
crontab -u elimu -l
```

### Part 11: Test Everything

```bash
# 1. Check PM2 status
pm2 status

# 2. Check Parse Server logs
pm2 logs elimu-parse-server --lines 50

# 3. Test Parse Server endpoint
curl http://localhost:1337/parse/health

# 4. Check Nginx status
systemctl status nginx

# 5. Check if port 80 is listening
netstat -tlnp | grep :80

# 6. Test from local machine browser:
# Open: http://145.239.42.121
```

## Verification Checklist

- [ ] PostgreSQL database created and imported
- [ ] Backend environment configured (.env file)
- [ ] Parse Server running (pm2 status shows online)
- [ ] Nginx serving frontend files
- [ ] Can access application at http://145.239.42.121
- [ ] Can login with demo accounts
- [ ] Assessment systems working
- [ ] Dashboard loading correctly

## Troubleshooting Commands

```bash
# View Parse Server logs
pm2 logs elimu-parse-server

# Restart Parse Server
pm2 restart elimu-parse-server

# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Check Nginx access logs
tail -f /var/log/nginx/access.log

# Test Parse Server directly
curl http://localhost:1337/parse/health

# Check if PostgreSQL is running
systemctl status postgresql

# Test database connection
sudo -u postgres psql -d elimu_smart_production -c "SELECT 1;"
```

## Next Steps After Success

1. **Configure Domain DNS**
   - Add A record: @ → 145.239.42.121
   - Add A record: www → 145.239.42.121

2. **Install SSL Certificate** (after DNS propagation)
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d elimu-smart.com -d www.elimu-smart.com
   ```

3. **Monitor Application**
   ```bash
   pm2 monit  # Real-time monitoring
   ```

## Important Notes

- Replace `YourStrongPassword123!` with actual strong password
- Generate unique MASTER_KEY and SESSION_SECRET using `openssl rand -hex 32`
- Keep backup of .env file in secure location
- Monitor logs regularly for any issues
- Test all features thoroughly before announcing deployment

## Support

If you encounter issues:
1. Check Parse Server logs: `pm2 logs elimu-parse-server`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify database connection: Test with psql
4. Check firewall: `ufw status`
5. Verify PM2 startup: `pm2 list`
