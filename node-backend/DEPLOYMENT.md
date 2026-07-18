# ShreeNova Tech — Deployment Guide
# Frontend: Vercel | Backend: Render | Database: Aiven MySQL

=============================================================
STEP 1 — AIVEN MySQL (Free Database)
=============================================================

1. Go to: https://aiven.io
2. Sign up (free)
3. Click "Create Service" → MySQL
4. Plan: Free tier
5. Cloud: AWS / Google (any)
6. Service name: shreenovatech-db
7. Click "Create Service"

After creation, note these values:
  Host:     xxxxx.aivencloud.com
  Port:     12345
  User:     avnadmin
  Password: xxxxxxxxxx
  Database: defaultdb

8. Go to "Databases" tab → Create database: shreenovatech_db
9. Download CA Certificate (for SSL)

10. Run schema:
    - Go to "Query Editor" in Aiven dashboard
    - Paste contents of: node-backend/database/schema.sql
    - Click Run

=============================================================
STEP 2 — GITHUB (Push Code)
=============================================================

1. Create GitHub repo: shreenovatech-backend
2. Push ONLY node-backend/ folder:

   cd node-backend
   git init
   git add .
   git commit -m "Initial backend"
   git remote add origin https://github.com/YOUR_USERNAME/shreenovatech-backend.git
   git push -u origin main

   NOTE: Make sure .gitignore has:
   node_modules/
   .env
   uploads/

=============================================================
STEP 3 — RENDER.COM (Free Backend Hosting)
=============================================================

1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo: shreenovatech-backend
5. Settings:
   Name:         shreenovatech-api
   Region:       Singapore (closest to India)
   Branch:       main
   Root Dir:     (leave empty)
   Runtime:      Node
   Build Cmd:    npm install
   Start Cmd:    npm start
   Plan:         Free

6. Add Environment Variables (click "Environment"):

   NODE_ENV        = production
   PORT            = 5000
   DB_HOST         = your-aiven-host.aivencloud.com
   DB_PORT         = 12345 (your aiven port)
   DB_USER         = avnadmin
   DB_PASS         = your-aiven-password
   DB_NAME         = shreenovatech_db
   DB_SSL          = true
   JWT_SECRET      = ShreeNovaTech_JWT_2024_SuperSecret_Key_Min32Chars
   JWT_EXPIRES_IN  = 24h
   BASE_URL        = https://shreenovatech-api.onrender.com
   FRONTEND_URL    = https://shreenovatech.in
   MAX_FILE_SIZE   = 10485760
   SMTP_HOST       = smtp.gmail.com
   SMTP_PORT       = 587
   SMTP_USER       = support@shreenovatech.in
   SMTP_PASS       = your-gmail-app-password
   SMTP_FROM_NAME  = ShreeNova Tech

7. Click "Create Web Service"
8. Wait 3-5 minutes for deployment
9. Your API URL: https://shreenovatech-api.onrender.com/api

=============================================================
STEP 4 — CUSTOM DOMAIN (api.shreenovatech.in)
=============================================================

In Render Dashboard:
1. Go to your service → "Settings" → "Custom Domains"
2. Add: api.shreenovatech.in
3. Copy the CNAME value shown

In your Domain Provider (GoDaddy/Namecheap):
1. Go to DNS Settings
2. Add record:
   Type:  CNAME
   Name:  api
   Value: your-app.onrender.com
   TTL:   Auto

Wait 10-30 minutes for DNS propagation.

=============================================================
STEP 5 — VERCEL (Update Frontend)
=============================================================

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update:
   VITE_API_URL = https://api.shreenovatech.in/api
   (or use Render URL if no custom domain:)
   VITE_API_URL = https://shreenovatech-api.onrender.com/api

3. Redeploy: Vercel Dashboard → Deployments → Redeploy

=============================================================
STEP 6 — TEST
=============================================================

Test these URLs in browser:

Health Check:
  https://api.shreenovatech.in/api

Admin Login:
  https://shreenovatech.in/admin/login
  Email:    admin@shreenovatech.in
  Password: password

  NOTE: Change password immediately after first login!

API Endpoints:
  GET  /api/pricing
  GET  /api/portfolio
  POST /api/contact
  POST /api/bookings

=============================================================
IMPORTANT NOTES
=============================================================

1. Render Free Plan:
   - Sleeps after 15 min inactivity
   - First request takes 30-50 seconds (cold start)
   - To avoid: upgrade to $7/month paid plan

2. File Uploads on Render:
   - Free plan has NO persistent disk
   - Uploaded files will be LOST on redeploy
   - Solution: Use Cloudinary (free) for file storage
   - Or upgrade to Render paid plan with disk

3. Default Admin Password:
   - Email: admin@shreenovatech.in
   - Password: password
   - CHANGE IT IMMEDIATELY after first login!

4. Gmail SMTP Setup:
   - Go to Google Account → Security → 2-Step Verification → ON
   - Then: App Passwords → Generate password for "Mail"
   - Use that 16-char password as SMTP_PASS

=============================================================
FOLDER STRUCTURE SUMMARY
=============================================================

shreenovatech/
├── src/                    ← React Frontend (Vercel)
├── node-backend/           ← Node.js Backend (Render)
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js       ← MySQL connection (SSL ready)
│   │   │   ├── jwt.js
│   │   │   └── multer.js
│   │   ├── controllers/    ← Business logic
│   │   ├── middleware/     ← Auth + helpers
│   │   ├── routes/         ← All API routes
│   │   └── server.js       ← Main entry point
│   ├── database/
│   │   └── schema.sql      ← Run this on Aiven
│   ├── .env.example        ← Copy to .env
│   └── package.json
└── .env                    ← Frontend env vars
