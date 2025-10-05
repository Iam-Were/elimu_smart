#!/bin/bash
# Elimu Smart VPS Automated Setup Script
# For TrueHosts Ubuntu 22.04 LTS
# Run as: bash setup-vps.sh

set -e  # Exit on any error

echo "=========================================="
echo "Elimu Smart VPS Setup - Starting..."
echo "=========================================="

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL 17
echo "📦 Installing PostgreSQL 17..."
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-17 postgresql-contrib-17

# Install Redis
echo "📦 Installing Redis..."
sudo apt install -y redis-server

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Parse Dashboard globally
echo "📦 Installing Parse Dashboard..."
sudo npm install -g parse-dashboard

# Setup PostgreSQL database
echo "🗄️  Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE DATABASE elimu_smart_prod;" || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER elimu WITH PASSWORD 'CHANGE_IN_PRODUCTION';" || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE elimu_smart_prod TO elimu;"
sudo -u postgres psql -c "ALTER DATABASE elimu_smart_prod OWNER TO elimu;"

# Enable Redis on startup
echo "🔧 Configuring Redis..."
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Enable PostgreSQL on startup
echo "🔧 Configuring PostgreSQL..."
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Install project dependencies
echo "📦 Installing npm dependencies..."
cd ~/elimu_smart/backend
npm install --production

# Run database migrations
echo "🗄️  Running database migrations..."
if [ -f "migrations/seed-assessment-data.js" ]; then
    node migrations/seed-assessment-data.js
else
    echo "⚠️  Migration script not found - will run manually later"
fi

# Start Parse Server with PM2
echo "🚀 Starting Parse Server with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -1 | sudo bash  # Auto-start on reboot

# Configure Nginx
echo "🔧 Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/elimu-smart
sudo ln -sf /etc/nginx/sites-available/elimu-smart /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default  # Remove default site
sudo nginx -t && sudo systemctl reload nginx

# Setup SSL with Let's Encrypt (requires domain DNS to be configured)
echo "🔒 Setting up SSL..."
sudo apt install -y certbot python3-certbot-nginx
echo "⚠️  Manual step required: Run this after DNS is configured:"
echo "   sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com -d dashboard.yourdomain.com"

# Setup daily database backups (if Backblaze configured)
echo "💾 Setting up backup cron job..."
if [ -f "scripts/backup-database.sh" ]; then
    chmod +x scripts/backup-database.sh
    (crontab -l 2>/dev/null; echo "0 2 * * * ~/elimu_smart/backend/scripts/backup-database.sh") | crontab -
    echo "✅ Daily backups scheduled at 2 AM"
else
    echo "⚠️  Backup script not found - configure manually"
fi

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS
sudo ufw --force enable

echo "=========================================="
echo "✅ VPS Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Configure .env.production with real credentials"
echo "2. Point DNS to this server's IP"
echo "3. Run: sudo certbot --nginx -d yourdomain.com"
echo "4. Build frontend: cd ../frontend && npm run build"
echo "5. Deploy frontend: sudo cp -r dist/* /var/www/elimu-smart/"
echo ""
echo "Parse Server: http://localhost:1337/parse"
echo "PM2 Status: pm2 status"
echo "PM2 Logs: pm2 logs parse-server"
echo "PM2 Dashboard: https://app.pm2.io (after signup)"
echo ""
