#!/bin/bash
# Script to fix Nginx SPA routing for React Router
# This ensures all routes return index.html instead of 404

echo "=== Fixing Nginx SPA Routing ==="

# Backup current configuration
sudo cp /etc/nginx/sites-available/elimu-smart /etc/nginx/sites-available/elimu-smart.backup.$(date +%Y%m%d-%H%M%S)

# Update Nginx configuration with SPA fallback
sudo tee /etc/nginx/sites-available/elimu-smart > /dev/null << 'NGINX_CONFIG'
# Elimu Smart Production - Nginx Configuration
server {
    listen 80;
    listen [::]:80;
    server_name elimu-smart.co.ke www.elimu-smart.co.ke;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name elimu-smart.co.ke www.elimu-smart.co.ke;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/elimu-smart.co.ke/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/elimu-smart.co.ke/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Static Files
    root /var/www/elimu-smart;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Parse Server
    location /parse {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Dashboard
    location /dashboard {
        proxy_pass http://localhost:4040;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Deployment webhooks
    location /webhooks/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Authorization $http_authorization;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
    }

    # SPA Fallback - Handle React Router (CRITICAL FIX)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX_CONFIG

# Test configuration
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration valid, reloading Nginx..."
    sudo nginx -s reload
    echo "✅ Nginx reloaded successfully"
    echo ""
    echo "Testing routes..."
    curl -s -o /dev/null -w 'Assessment page: %{http_code}\n' https://elimu-smart.co.ke/assessment
    curl -s -o /dev/null -w 'Dashboard page: %{http_code}\n' https://elimu-smart.co.ke/dashboard
    curl -s -o /dev/null -w 'Guidance page: %{http_code}\n' https://elimu-smart.co.ke/guidance
else
    echo "❌ Configuration test failed, restoring backup..."
    sudo cp /etc/nginx/sites-available/elimu-smart.backup.$(date +%Y%m%d)* /etc/nginx/sites-available/elimu-smart
    sudo nginx -s reload
    exit 1
fi

echo ""
echo "=== Fix Applied Successfully ==="
