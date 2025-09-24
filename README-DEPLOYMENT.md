# 🚀 MINDEF GC CMS API - Azure VM Deployment Guide

## Prerequisites

- Azure VM (Ubuntu 20.04+ or 22.04+)
- SSH access to the VM
- Domain name (optional, can use IP)
- SSL certificate (for production)

## 📋 Deployment Steps

### 1. **Connect to Azure VM**

```bash
ssh azureuser@your-vm-ip-address
```

### 2. **Run Initial Setup Script**

```bash
# Download and run the setup script
wget https://raw.githubusercontent.com/your-repo/MINDEF-GC-CMS-API/main/scripts/setup-azure-vm.sh
chmod +x setup-azure-vm.sh
./setup-azure-vm.sh
```

### 3. **Clone Repository**

```bash
cd /opt
sudo git clone https://github.com/your-org/MINDEF-GC-CMS-API.git mindef-api
sudo chown -R $USER:$USER mindef-api
cd mindef-api
```

### 4. **Configure Environment**

```bash
# Copy production environment template
cp env-production .env

# Edit environment variables
nano .env
```

**Required Environment Variables to Update:**

```env
# Database
DATABASE_PASSWORD=your_secure_database_password
DATABASE_NAME=mindef_cms

# Redis
REDIS_PASSWORD=mindef_redis_2024

# Security (Generate strong secrets)
AUTH_JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars
AUTH_REFRESH_SECRET=your-super-secure-refresh-secret-key-min-32-chars
AUTH_FORGOT_SECRET=your-super-secure-forgot-secret-key-min-32-chars
X_API_KEY=your-super-secure-api-key-min-32-chars

# Domain
FRONTEND_DOMAIN=https://your-domain.com
BACKEND_DOMAIN=https://your-domain.com

# Email (Optional)
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# External APIs (Optional)
AZURE_OCR_ENDPOINT=https://your-azure-ocr-endpoint.cognitiveservices.azure.com
AZURE_OCR_API_KEY=your-azure-ocr-api-key
GEN_AI_API_KEY=your-gen-ai-key
```

### 5. **Install Dependencies**

```bash
npm install
```

### 6. **Build Application**

```bash
npm run build
```

### 7. **Setup Database**

```bash
# Run migrations
npm run migration:run

# Run seeding (optional - for initial data)
npm run seed:run
```

### 8. **Start Application with PM2**

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup (run this command and follow instructions)
pm2 startup
```

### 9. **Configure Nginx Reverse Proxy**

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/mindef-api
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health check endpoint
    location /api/v1/health {
        proxy_pass http://localhost:3000;
        access_log off;
    }

    # API documentation
    location /api/docs {
        proxy_pass http://localhost:3000;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/mindef-api /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 10. **Setup SSL Certificate (Production)**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 11. **Configure Log Rotation**

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/mindef-api
```

**Logrotate Configuration:**

```
/var/log/mindef-api/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 azureuser azureuser
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 12. **Setup Monitoring (Optional)**

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Create system monitoring script
nano /opt/monitor.sh
```

**Monitoring Script:**

```bash
#!/bin/bash
# System monitoring script

echo "=== System Status $(date) ==="
echo "Memory Usage:"
free -h

echo -e "\nDisk Usage:"
df -h

echo -e "\nPM2 Status:"
pm2 status

echo -e "\nService Status:"
systemctl is-active postgresql redis-server nginx
```

```bash
chmod +x /opt/monitor.sh
```

## 🔄 Update Deployment

### Update Application

```bash
cd /opt/mindef-api

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Build application
npm run build

# Run new migrations (if any)
npm run migration:run

# Restart application
pm2 reload ecosystem.config.js --env production
```

### Database Migration Only

```bash
cd /opt/mindef-api
npm run migration:run
pm2 restart mindef-api
```

### Database Seeding Only

```bash
cd /opt/mindef-api
npm run seed:run
```

## 🛠️ Troubleshooting

### Check Application Status

```bash
# PM2 status
pm2 status
pm2 logs mindef-api

# Check services
sudo systemctl status postgresql
sudo systemctl status redis-server
sudo systemctl status nginx

# Check ports
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :5432
sudo netstat -tlnp | grep :6379
```

### View Logs

```bash
# Application logs
pm2 logs mindef-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u postgresql
sudo journalctl -u redis-server
sudo journalctl -u nginx
```

### Database Issues

```bash
# Connect to database
psql -h localhost -U mindef_user -d mindef_cms

# Check database status
sudo systemctl status postgresql
sudo -u postgres pg_lsclusters

# Restart database
sudo systemctl restart postgresql
```

### Application Issues

```bash
# Restart PM2 processes
pm2 restart mindef-api

# Restart all services
pm2 restart all

# Check application health
curl http://localhost:3000/api/v1/health
```

## 🔒 Security Checklist

- [ ] Changed default database passwords
- [ ] Generated strong JWT secrets
- [ ] Updated API keys
- [ ] Configured firewall rules
- [ ] Enabled SSL certificates
- [ ] Set up log rotation
- [ ] Configured security headers
- [ ] Limited SSH access
- [ ] Updated system packages

## 📊 Performance Optimization

### PM2 Configuration

```bash
# Scale application
pm2 scale mindef-api 4

# Monitor performance
pm2 monit
```

### Database Optimization

```sql
-- Connect to database and run
VACUUM ANALYZE;
REINDEX DATABASE mindef_cms;
```

### Nginx Optimization

```nginx
# Add to nginx configuration
client_max_body_size 50M;
client_body_timeout 60s;
client_header_timeout 60s;
keepalive_timeout 65;
gzip on;
gzip_types text/plain application/json application/javascript text/css;
```

## 📞 Support

For deployment issues:

1. Check logs: `pm2 logs mindef-api`
2. Verify services: `sudo systemctl status postgresql redis-server nginx`
3. Test connectivity: `curl http://localhost:3000/api/v1/health`
4. Check firewall: `sudo ufw status`

## 🔄 Backup Strategy

### Database Backup

```bash
# Create backup script
nano /opt/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -h localhost -U mindef_user -d mindef_cms > $BACKUP_DIR/mindef_cms_$DATE.sql
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

```bash
chmod +x /opt/backup-db.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /opt/backup-db.sh
```

---

## ✅ Deployment Complete!

Your MINDEF GC CMS API is now deployed and running on Azure VM. Access it at:

- **API**: `https://your-domain.com/api/v1`
- **Documentation**: `https://your-domain.com/api/docs`
- **Health Check**: `https://your-domain.com/api/v1/health`
