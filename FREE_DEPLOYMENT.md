# ============================================
#  FREE DEPLOYMENT QUICK START GUIDE
# ============================================
#  DonateMatch - AI Donation Matching System
#  Total Cost: $0/month (Free Tier)
# ============================================

## 🎯 What You Get FREE:

| Service       | Provider      | Free Tier Limits              |
|--------------|---------------|-------------------------------|
| Frontend     | Vercel        | 100GB bandwidth/month         |
| Backend      | Railway       | 500 hours/month ($5 credit)   |
| Database     | MongoDB Atlas | 512MB storage                 |
| Payments     | Razorpay      | No monthly fees (2% per txn)  |

---

## Step 1: Setup MongoDB Atlas (5 minutes)

1. Go to https://cloud.mongodb.com
2. Create FREE account → Create Cluster (M0 Sandbox - FREE)
3. **Database Access** → Add User:
   - Username: `donatematch`
   - Password: Generate secure password (SAVE IT!)
4. **Network Access** → Add IP Address:
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
5. **Connect** → Drivers → Copy connection string:
   ```
   mongodb+srv://donatematch:<password>@cluster0.xxxxx.mongodb.net/donatematch
   ```
   Replace `<password>` with your actual password.

---

## Step 2: Setup Razorpay (5 minutes)

1. Go to https://dashboard.razorpay.com
2. Create account / Login
3. **Settings** → **API Keys** → Generate Key
4. Copy both:
   - Key ID: `rzp_test_xxxxxxxxxxxxx`
   - Key Secret: `xxxxxxxxxxxxxxxxxxxx`

> ⚠️ Use TEST keys for development. Switch to LIVE keys after testing.

---

## Step 3: Deploy Backend to Railway (10 minutes)

1. Go to https://railway.app → Login with GitHub

2. Click **"New Project"** → **"Deploy from GitHub repo"**

3. Select your repository, then configure:
   - **Root Directory:** `server`
   - **Start Command:** `npm start`

4. Go to **Variables** tab and add:
   ```
   MONGODB_URI = your-mongodb-atlas-connection-string
   JWT_SECRET = generate-64-char-random-string
   RAZORPAY_KEY_ID = rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET = your-razorpay-secret
   NODE_ENV = production
   CLIENT_URL = https://your-frontend.vercel.app (add after step 4)
   ```

5. Go to **Settings** → **Generate Domain**
   - Copy URL: `https://your-project.railway.app`

---

## Step 4: Deploy Frontend to Vercel (10 minutes)

1. Go to https://vercel.com → Login with GitHub

2. Click **"New Project"** → Import your repository

3. Configure:
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   ```

4. Add Environment Variables:
   ```
   VITE_API_URL = https://your-railway-backend.railway.app/api
   VITE_RAZORPAY_KEY_ID = rzp_test_xxxxxxxxxxxxx
   ```

5. Click **Deploy** → Get your URL: `https://your-project.vercel.app`

---

## Step 5: Final Configuration (2 minutes)

1. Go back to **Railway** → **Variables**
2. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL = https://your-project.vercel.app
   ```

3. **Test your app!** 🎉

---

## 🔧 Common Issues & Fixes

### "MongoDB connection error"
- Check password has no special chars (or URL encode them)
- Verify IP whitelist includes 0.0.0.0/0

### "CORS error"
- Ensure CLIENT_URL is set correctly in Railway
- Include `https://` in the URL

### "Razorpay not working"
- Using test keys? Make sure VITE_RAZORPAY_KEY_ID matches backend

### "Build failed on Vercel"
- Check Root Directory is set to `client`
- Verify all dependencies are in package.json

---

## 📱 Custom Domain (Optional - $10-15/year)

### Buy Domain:
- Namecheap: https://namecheap.com
- GoDaddy: https://godaddy.com
- Google Domains: https://domains.google

### Connect to Vercel:
1. Vercel → Project → Settings → Domains
2. Add your domain
3. Update DNS records as shown

### Connect to Railway:
1. Railway → Settings → Custom Domain
2. Add your API subdomain (e.g., api.yourdomain.com)
3. Update DNS CNAME record

---

## ✅ Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test login and logout
- [ ] Test donation flow (use Razorpay test card: 4111 1111 1111 1111)
- [ ] Test receipt download
- [ ] Test AI chatbot
- [ ] Test language switching
- [ ] Check mobile responsiveness

---

## 🎉 Congratulations!

Your DonateMatch app is now live and FREE!

Need help? Create an issue on GitHub or contact support.
