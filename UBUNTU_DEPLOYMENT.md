# Ubuntu Server Deployment Guide

Complete guide to deploy your KOJI × KOJI Store on Ubuntu Server.

## Prerequisites

- Ubuntu 20.04+ server with SSH access
- Domain name pointing to your server IP (optional but recommended)
- Basic knowledge of Linux commands

---

## Step 1: Server Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js 18+
```bash
# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v18.x or higher
npm --version
```

### 1.3 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 1.4 Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## Step 2: Clone & Build Application

### 2.1 Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/yourusername/kojixkoji-store.git
sudo chown -R $USER:$USER kojixkoji-store
cd kojixkoji-store
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Create Environment File
```bash
nano .env.production
```

Add your environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_PASSWORD=your_secure_admin_password
NODE_ENV=production
```

Save and exit (Ctrl+X, then Y, then Enter)

### 2.4 Build Application
```bash
npm run build
```

---

## Step 3: Configure PM2

### 3.1 Create PM2 Ecosystem File
```bash
nano ecosystem.config.js
```

Add this configuration:
```javascript
module.exports = {
  apps: [{
    name: 'kojixkoji-store',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/kojixkoji-store',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
```

### 3.2 Create Logs Directory
```bash
mkdir -p logs
```

### 3.3 Start Application with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

The last command will show you a command to run with `sudo` - copy and run it.

---

## Step 4: Configure Nginx Reverse Proxy

### 4.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/kojixkoji-store
```

Add this configuration (replace `your-domain.com` with your domain):
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # If no domain, use server IP
    # server_name _;

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
    }
}
```

### 4.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/kojixkoji-store /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

---

## Step 5: Setup SSL with Let's Encrypt (Recommended)

### 5.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts. Certbot will automatically configure Nginx for HTTPS.

### 5.3 Auto-Renewal
Certbot sets up auto-renewal automatically. Test it:
```bash
sudo certbot renew --dry-run
```

---

## Step 6: Firewall Configuration

### 6.1 Configure UFW
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Step 7: Verify Deployment

1. **Check PM2 Status**
   ```bash
   pm2 status
   pm2 logs kojixkoji-store
   ```

2. **Check Nginx Status**
   ```bash
   sudo systemctl status nginx
   ```

3. **Visit Your Site**
   - With domain: `https://your-domain.com`
   - Without domain: `http://your-server-ip`

4. **Test Admin Dashboard**
   - Visit: `https://your-domain.com/admin/login`
   - Login with your `ADMIN_PASSWORD`

---

## Maintenance Commands

### Update Application
```bash
cd /var/www/kojixkoji-store
git pull origin main
npm install
npm run build
pm2 restart kojixkoji-store
```

### View Logs
```bash
pm2 logs kojixkoji-store
# Or
tail -f /var/www/kojixkoji-store/logs/out.log
```

### Restart Application
```bash
pm2 restart kojixkoji-store
```

### Stop Application
```bash
pm2 stop kojixkoji-store
```

### Check Application Status
```bash
pm2 status
pm2 info kojixkoji-store
```

---

## Troubleshooting

### Application Won't Start
1. Check Node.js version: `node --version` (needs 18+)
2. Check environment variables: `cat .env.production`
3. Check logs: `pm2 logs kojixkoji-store`
4. Verify build: `npm run build` (should complete without errors)

### 502 Bad Gateway
- Check if app is running: `pm2 status`
- Check if app is on port 3000: `sudo netstat -tlnp | grep 3000`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### Can't Access Site
- Check firewall: `sudo ufw status`
- Check Nginx: `sudo systemctl status nginx`
- Check DNS (if using domain): `dig your-domain.com`

### Environment Variables Not Working
- Make sure `.env.production` exists
- Restart PM2: `pm2 restart kojixkoji-store`
- Check variables are loaded: `pm2 env kojixkoji-store`

---

## Security Checklist

- ✅ Firewall configured (UFW)
- ✅ SSL certificate installed (HTTPS)
- ✅ Strong `ADMIN_PASSWORD` set
- ✅ Regular system updates: `sudo apt update && sudo apt upgrade`
- ✅ PM2 auto-restart enabled
- ✅ Nginx security headers (optional, add to config)

### Optional: Add Security Headers to Nginx
Add to your Nginx config:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

---

## Backup Strategy

### Database (Supabase)
- Supabase handles backups automatically
- You can export data from Supabase Dashboard if needed

### Application Code
- Already in Git (GitHub)
- PM2 logs are in `/var/www/kojixkoji-store/logs/`

### Environment Variables
- Keep `.env.production` backed up securely
- Never commit to Git!

---

## Performance Optimization

### Enable Gzip in Nginx
Add to your Nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### PM2 Cluster Mode (Optional)
For better performance, you can run multiple instances:
```javascript
// In ecosystem.config.js
instances: 'max',  // Use all CPU cores
exec_mode: 'cluster'
```

---

## Monitoring

### PM2 Monitoring
```bash
pm2 monit  # Real-time monitoring
pm2 list    # List all processes
```

### System Resources
```bash
htop  # Install with: sudo apt install htop
```

---

## Next Steps

1. **Set up monitoring** (optional): Consider UptimeRobot or similar
2. **Configure backups**: Set up automated backups if needed
3. **Set up email** (optional): For order notifications
4. **Monitor logs**: Regularly check PM2 and Nginx logs
5. **Keep updated**: Regularly update dependencies and system packages

---

## Support

- **PM2 Docs**: https://pm2.keymetrics.io/
- **Nginx Docs**: https://nginx.org/en/docs/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Let's Encrypt**: https://letsencrypt.org/docs/

---

✅ Your store is now live on your Ubuntu server!
