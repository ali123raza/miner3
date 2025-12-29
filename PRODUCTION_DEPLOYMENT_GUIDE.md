# 🚀 Production Deployment Guide

## Abhi Tum Kahan Ho

**Current Status:**
```
✅ Development Mode (localhost)
   - Frontend: http://localhost:5173 (Vite)
   - Backend API: http://localhost:8000 (PHP)
   - Database: Local (PostgreSQL/MySQL)
```

**Target:**
```
🎯 Production Mode (Live Server)
   - Frontend: https://yourdomain.com
   - Backend API: https://yourdomain.com/api
   - Database: Production server
```

---

## 🌐 Production Deployment Options

### **Option 1: Single Domain (Recommended)**

Frontend aur Backend **same domain** pe:

```
https://yourdomain.com/
  ├── index.html              ← React app
  ├── assets/                 ← JS, CSS
  ├── manifest.json           ← PWA manifest
  ├── icons/                  ← App icons
  └── api/                    ← PHP backend
      ├── index.php
      ├── controllers/
      └── models/
```

**Configuration:**
- Frontend: `https://yourdomain.com`
- API: `https://yourdomain.com/api`
- APK URL: `https://yourdomain.com`

**Advantages:**
- ✅ No CORS issues
- ✅ Relative paths work
- ✅ Easy to deploy
- ✅ Single SSL certificate

---

### **Option 2: Separate Domains**

Frontend aur Backend **alag domains** pe:

```
Frontend: https://app.yourdomain.com
Backend:  https://api.yourdomain.com
```

**Configuration:**
- Frontend: `https://app.yourdomain.com`
- API: `https://api.yourdomain.com`
- APK URL: `https://app.yourdomain.com`

**Advantages:**
- ✅ Better scalability
- ✅ Separate servers
- ✅ Independent deployments

**Disadvantages:**
- ⚠️ Need CORS configuration
- ⚠️ Two SSL certificates

---

## 📦 Production Build Process

### **Step 1: Set Production API URL**

**Option A: Environment Variable (Recommended)**

Create `.env.production` file:
```bash
VITE_API_URL=https://yourdomain.com/api
```

**Option B: Relative Path (If same domain)**

No configuration needed! Already configured in `env.js`:
```javascript
return webProdUrl || '/api';  // Uses /api by default
```

---

### **Step 2: Build Production Version**

```bash
npm run build
```

**Output:**
```
dist/
  ├── index.html
  ├── assets/
  │   ├── index-abc123.js
  │   └── index-xyz789.css
  ├── manifest.json
  ├── sw.js
  ├── offline.html
  ├── icons/
  └── .well-known/
```

---

### **Step 3: Deploy to Server**

#### **If Using Single Domain:**

Upload all files to server:

```
/public_html/  (or /var/www/html/)
  ├── index.html           ← From dist/
  ├── assets/              ← From dist/
  ├── manifest.json        ← From dist/
  ├── sw.js               ← From dist/
  ├── offline.html        ← From dist/
  ├── icons/              ← From dist/
  ├── .well-known/        ← From dist/
  └── api/                ← Your PHP backend
      ├── index.php
      ├── config/
      ├── controllers/
      └── models/
```

#### **Apache .htaccess (Required):**

Create/update `.htaccess` in root:

```apache
# Enable HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle React Router (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api
RewriteRule . /index.html [L]

# API routes - forward to PHP
RewriteRule ^api/(.*)$ api/index.php [L,QSA]

# Ensure .well-known is accessible
RewriteCond %{REQUEST_URI} ^/.well-known/
RewriteRule ^(.*)$ $1 [L]
```

---

## 🔧 Server Requirements

### **Minimum Requirements:**

- ✅ **HTTPS/SSL Certificate** (Required for TWA)
- ✅ **PHP 7.4+** (Your backend)
- ✅ **Apache/Nginx** (Web server)
- ✅ **PostgreSQL/MySQL** (Database)
- ✅ **Composer** (PHP dependencies)

### **Recommended Hosting:**

**Budget Options:**
- **Hostinger** ($2-5/month) - Good for small apps
- **DigitalOcean** ($4-6/month) - Droplet with full control
- **Linode** ($5/month) - Similar to DigitalOcean

**Premium Options:**
- **Cloudways** ($10+/month) - Managed hosting
- **AWS/Google Cloud** - Scalable

---

## 🚀 Quick Deployment Steps

### **Using cPanel/DirectAdmin (Easiest):**

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload via FTP:**
   - Upload `dist/*` to `public_html/`
   - Upload `api/` to `public_html/api/`

3. **Configure database:**
   - Import database schema
   - Update `api/config/database.php`

4. **Test:**
   ```
   https://yourdomain.com
   ```

---

### **Using VPS (DigitalOcean/Linode):**

**SSH into server:**
```bash
ssh root@your-server-ip
```

**Install required software:**
```bash
# Update system
apt update && apt upgrade -y

# Install Nginx
apt install nginx -y

# Install PHP
apt install php8.1-fpm php8.1-pgsql php8.1-mbstring -y

# Install PostgreSQL
apt install postgresql postgresql-contrib -y

# Install Certbot (SSL)
apt install certbot python3-certbot-nginx -y
```

**Deploy files:**
```bash
# Clone or upload your files
cd /var/www
mkdir yourdomain.com
cd yourdomain.com

# Upload dist/ contents here
# Upload api/ here
```

**Configure Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/yourdomain.com;
    index index.html;

    # SSL certificates (will be configured by certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # React app (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # PHP API
    location /api {
        try_files $uri $uri/ /api/index.php?$query_string;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # .well-known for Digital Asset Links
    location /.well-known {
        allow all;
    }
}
```

**Get SSL certificate:**
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Restart Nginx:**
```bash
systemctl restart nginx
```

---

## 🎯 After Deployment

### **Verify Everything Works:**

```bash
# Check website loads
curl https://yourdomain.com

# Check API works
curl https://yourdomain.com/api/health

# Check manifest
curl https://yourdomain.com/manifest.json

# Check icons
curl https://yourdomain.com/icons/icon-512x512.png

# Check Asset Links
curl https://yourdomain.com/.well-known/assetlinks.json
```

### **Run Verification Script:**

```bash
node verify-deployment.js yourdomain.com
```

Should show:
```
✅ All files are accessible!
```

---

## 📱 Build APK After Deployment

Once website is live:

### **Step 1: Update Config**

Edit `twa-config.json`:
```json
{
  "domain": {
    "url": "yourdomain.com",
    "manifestUrl": "https://yourdomain.com/manifest.json"
  }
}
```

### **Step 2: Build APK**

```bash
node setup-twa.js
```

This will:
1. Verify your live website
2. Download manifest from live URL
3. Build Android APK
4. Create keystore

### **Step 3: Configure Asset Links**

```bash
node configure-asset-links.js
```

Update `assetlinks.json` and redeploy.

### **Step 4: Test APK**

```bash
cd cloudminer-twa
adb install app-release-signed.apk
```

---

## 🔄 Development vs Production

### **Development (Abhi):**
```
Frontend: localhost:5173
Backend:  localhost:8000
Database: Local
API URL:  /api (proxy)
```

### **Production (Target):**
```
Frontend: yourdomain.com
Backend:  yourdomain.com/api
Database: Production server
API URL:  /api (relative) or https://yourdomain.com/api
```

### **APK:**
```
URL: https://yourdomain.com
Mode: Production build loaded from live server
```

---

## 💡 Important Notes

### **1. HTTPS is MANDATORY**

TWA requires HTTPS. No HTTP allowed.

### **2. Same Configuration Works**

Tumhara current code already production-ready hai:
- ✅ `env.js` handles dev vs prod
- ✅ Relative paths work
- ✅ No hardcoded localhost URLs

### **3. Database Connection**

Update `api/config/database.php`:
```php
<?php
// Development
if ($_SERVER['SERVER_NAME'] === 'localhost') {
    $db_host = 'localhost';
    $db_name = 'miner_dev';
} else {
    // Production
    $db_host = 'production-db-host';
    $db_name = 'miner_prod';
}
```

---

## 🎯 Quick Checklist

**Before Building APK:**

- [ ] Website deployed to production
- [ ] HTTPS working (SSL certificate installed)
- [ ] All files accessible:
  - [ ] https://yourdomain.com/
  - [ ] https://yourdomain.com/manifest.json
  - [ ] https://yourdomain.com/icons/icon-512x512.png
  - [ ] https://yourdomain.com/.well-known/assetlinks.json
- [ ] API working: https://yourdomain.com/api
- [ ] Database connected
- [ ] Google OAuth configured for production domain

**Then:**

1. Update `twa-config.json` with production domain
2. Run `node setup-twa.js`
3. Build APK
4. Configure Asset Links
5. Test on device

---

## ❓ Questions?

**Tumhe kya karna hai abhi:**

1. **Domain decide karo** - Kaunsa domain use karoge?
2. **Hosting arrange karo** - Server setup karo
3. **Deploy karo** - Files upload karo
4. **Verify karo** - Check everything works
5. **APK banao** - TWA setup run karo

**Batao:**
- Tumhara domain kya hoga?
- Hosting service konsi use karoge?
- Kya server already hai?

**Main tumhe specific steps bataunga!** 🚀
