# 🚀 Deployment Guide - DonateMatch

Complete guide to deploying the DonateMatch application to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Option 1: Vercel + Railway](#option-1-vercel--railway-recommended)
4. [Option 2: VPS Deployment](#option-2-vps-deployment-digitaloceanaws)
5. [Option 3: Docker](#option-3-docker)
6. [Option 4: Render](#option-4-render)
7. [MongoDB Atlas Setup](#mongodb-atlas-setup)
8. [Razorpay Production Setup](#razorpay-production-setup)
9. [Domain & SSL](#domain--ssl)
10. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before deployment, ensure you have:

- [ ] MongoDB Atlas account with production cluster
- [ ] Razorpay account with production API keys
- [ ] Domain name (optional but recommended)
- [ ] Email service credentials (SMTP or SendGrid)
- [ ] Git repository with code

---

## Environment Setup

### Production Environment Variables

Create these environment variables in your deployment platform:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@production-cluster.mongodb.net/donatematch?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secure-production-secret-key-minimum-32-characters
JWT_EXPIRE=7d

# Razorpay (Production Keys)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Server Configuration
NODE_ENV=production
PORT=5000

# Email (Production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-app-specific-password

# Frontend URL (for CORS)
CLIENT_URL=https://yourdomain.com
```

---

## Option 1: Vercel + Railway (Recommended)

Best for: **Quick deployment, automatic scaling, free tier available**

### Step 1: Deploy Frontend to Vercel

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "New Project" → Import your repository
   - Configure project settings:
     ```
     Framework Preset: Vite
     Root Directory: client
     Build Command: npm run build
     Output Directory: dist
     ```

3. **Add Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   VITE_API_URL=https://your-railway-app.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Your frontend will be live at `https://your-project.vercel.app`

### Step 2: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app) and sign in with GitHub

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Configure:
     ```
     Root Directory: server
     Start Command: npm start
     ```

3. **Add Environment Variables**
   In Railway dashboard → Variables:
   ```
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-jwt-secret
   RAZORPAY_KEY_ID=your-razorpay-key
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   NODE_ENV=production
   CLIENT_URL=https://your-frontend.vercel.app
   ```

4. **Generate Domain**
   - Railway → Settings → Generate Domain
   - Your API will be at `https://your-app.railway.app`

5. **Update Vercel Frontend**
   - Update `VITE_API_URL` in Vercel to point to Railway URL

---

## Option 2: VPS Deployment (DigitalOcean/AWS)

Best for: **Full control, custom configuration, larger scale**

### Step 1: Provision Server

**DigitalOcean:**
- Create Droplet: Ubuntu 22.04, 2GB RAM, 1 vCPU ($12/month)
- Enable backups and monitoring

**AWS EC2:**
- Launch Instance: Ubuntu 22.04, t2.small
- Security Group: Allow ports 22, 80, 443, 5000

### Step 2: Server Setup

SSH into your server:

```bash
ssh root@your-server-ip
```

Update system and install dependencies:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### Step 3: Clone and Setup Application

```bash
# Create app directory
sudo mkdir -p /var/www/donatematch
cd /var/www/donatematch

# Clone repository
git clone https://github.com/yourusername/donation-system.git .

# Install dependencies
npm install
cd server && npm install
cd ../client && npm install

# Build frontend
npm run build
```

### Step 4: Configure Environment

```bash
# Create production environment file
sudo nano /var/www/donatematch/server/.env
```

Add your production environment variables.

### Step 5: Setup PM2 Process Manager

```bash
cd /var/www/donatematch/server

# Start with PM2
pm2 start index.js --name "donatematch-api"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
```

### Step 6: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/donatematch
```

Add configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend - Serve React build
    location / {
        root /var/www/donatematch/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API - Proxy to Node.js
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/donatematch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

---

## Option 3: Docker

Best for: **Containerized deployment, consistent environments**

### Dockerfile (Root Directory)

```dockerfile
# Build stage for frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

# Copy server code
COPY server/ ./

# Copy frontend build
COPY --from=frontend-build /app/client/dist ../client/dist

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "index.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
      - RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
      - NODE_ENV=production
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

### Deploy with Docker

```bash
# Build image
docker build -t donatematch:latest .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## Option 4: Render

Best for: **Easy deployment, free tier, auto-deploys from Git**

### Frontend (Static Site)

1. Go to [render.com](https://render.com) → New → Static Site
2. Connect GitHub repository
3. Configure:
   ```
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

### Backend (Web Service)

1. Render → New → Web Service
2. Connect GitHub repository
3. Configure:
   ```
   Branch: main
   Root Directory: server
   Build Command: npm install
   Start Command: node index.js
   ```
4. Add all environment variables

---

## MongoDB Atlas Setup

### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create Free Tier cluster (M0) or Production cluster (M10+)
3. Choose region closest to your server

### Step 2: Database User

1. Security → Database Access → Add New User
2. Choose "Password" authentication
3. Set strong password
4. Role: "Read and write to any database"

### Step 3: Network Access

1. Security → Network Access → Add IP Address
2. For development: "Allow Access from Anywhere" (0.0.0.0/0)
3. For production: Add specific IP addresses of your servers

### Step 4: Get Connection String

1. Clusters → Connect → Connect your application
2. Copy connection string
3. Replace `<password>` with your database user password
4. Add database name: `donatematch`

Example:
```
mongodb+srv://admin:yourpassword@cluster0.abc123.mongodb.net/donatematch?retryWrites=true&w=majority
```

### Step 5: Create Indexes (Production)

Connect to MongoDB and create indexes:

```javascript
// Connect to mongo shell or use MongoDB Compass

// Users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Charities collection
db.charities.createIndex({ verificationStatus: 1 });
db.charities.createIndex({ causes: 1 });
db.charities.createIndex({ "location.state": 1 });

// Donations collection
db.donations.createIndex({ donor: 1, createdAt: -1 });
db.donations.createIndex({ charity: 1, createdAt: -1 });
db.donations.createIndex({ status: 1 });

// Campaigns collection
db.campaigns.createIndex({ status: 1, featured: -1 });
db.campaigns.createIndex({ charity: 1 });
db.campaigns.createIndex({ endDate: 1 });
```

---

## Razorpay Production Setup

### Step 1: Complete KYC

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Complete business KYC verification
3. Submit required documents:
   - Business PAN
   - GST certificate (if applicable)
   - Bank account details
   - Business address proof

### Step 2: Generate Live Keys

1. Settings → API Keys
2. Generate Live Key ID and Secret
3. Store securely (you can only see Secret once!)

### Step 3: Configure Webhooks

1. Settings → Webhooks → Add New Webhook
2. Webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Events to subscribe:
   - `payment.captured`
   - `payment.failed`
   - `refund.created`
4. Generate and save webhook secret

### Step 4: Update Environment

```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Domain & SSL

### Point Domain to Server

1. In your domain registrar (GoDaddy, Namecheap, etc.):
   - Add A record: `@` → Your Server IP
   - Add A record: `www` → Your Server IP

2. Wait for DNS propagation (5 min - 48 hours)

### SSL Certificate

**For Vercel/Railway/Render:** SSL is automatic ✅

**For VPS:**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

---

## Post-Deployment Checklist

### Security

- [ ] Environment variables are secure (not committed to git)
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] MongoDB IP whitelist configured
- [ ] SSL certificate installed
- [ ] Helmet.js security headers enabled
- [ ] Rate limiting configured
- [ ] CORS configured for production domain

### Performance

- [ ] React build is production optimized
- [ ] MongoDB indexes created
- [ ] Gzip compression enabled
- [ ] Static assets cached
- [ ] PM2 cluster mode enabled (VPS)

### Monitoring

- [ ] Error logging configured (Sentry, LogRocket)
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Database monitoring (MongoDB Atlas)
- [ ] Server metrics (PM2, DigitalOcean Monitoring)

### Testing

- [ ] All API endpoints working
- [ ] Payment flow tested with ₹1 transaction
- [ ] Email sending verified
- [ ] 80G certificate generation works
- [ ] Mobile responsiveness checked
- [ ] All languages display correctly

### Backup

- [ ] MongoDB Atlas backups enabled
- [ ] Code backed up in Git
- [ ] Environment variables documented securely
- [ ] Recovery procedure documented

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Kill existing process: `sudo lsof -i :5000` then `kill -9 PID` |
| MongoDB connection failed | Check IP whitelist and connection string |
| CORS errors | Ensure CLIENT_URL env variable matches frontend domain |
| 502 Bad Gateway | Check if Node.js server is running: `pm2 status` |
| SSL issues | Renew certificate: `sudo certbot renew` |

### Useful Commands

```bash
# Check server status
pm2 status

# View logs
pm2 logs donatematch-api

# Restart application
pm2 restart donatematch-api

# Check Nginx status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## Need Help?

- **MongoDB Atlas:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Razorpay:** [razorpay.com/docs](https://razorpay.com/docs)
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **Railway:** [docs.railway.app](https://docs.railway.app)

---

<div align="center">

**Ready for production! 🚀**

</div>
