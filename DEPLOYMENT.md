# Finance Tracker - Deployment Guide

Complete deployment guide for Finance Tracker application on Render.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

1. **GitHub Repository**
   - Push your code to a GitHub repository
   - Ensure all files are committed and pushed

2. **Render Account**
   - Sign up at [https://render.com](https://render.com)
   - Connect your GitHub account

3. **MongoDB Atlas**
   - Create a MongoDB Atlas account
   - Create a cluster (Free tier is sufficient for development)
   - Configure network access (see below)
   - Get your connection string

## Backend Deployment

### Step 1: Configure MongoDB Atlas

1. **Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Add `0.0.0.0/0` to allow connections from anywhere (or use Render's IP addresses)
   - Click "Confirm"

2. **Database User:**
   - Go to Database Access
   - Create a database user with read/write permissions
   - Save the username and password

3. **Connection String:**
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&ssl=true`
   - Replace `username`, `password`, and `database` with your values

### Step 2: Deploy Backend

#### Option A: Using Render Blueprint (Recommended)

1. **Create Blueprint:**
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository and branch (usually `main`)
   - Click "Apply"

2. **Render will create services automatically:**
   - Backend service will be created from `render.yaml`
   - Frontend service will be created from `render.yaml`

3. **Configure Backend Environment Variables:**
   - Go to the backend service settings
   - Navigate to "Environment" section
   - Add the following variables:
     ```
     SPRING_PROFILES_ACTIVE=prod
     MONGODB_URI=your-mongodb-connection-string
     MONGODB_DATABASE=finance_tracker
     SERVER_PORT=8080
     ```
   - Click "Save Changes"

4. **Deploy:**
   - Render will automatically build and deploy
   - Monitor the build logs
   - Wait for deployment to complete

#### Option B: Manual Service Creation

1. **Create Web Service:**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

2. **Configure Service:**
   - **Name:** `finance-tracker-backend`
   - **Environment:** Docker
   - **Dockerfile Path:** `./backend/Dockerfile`
   - **Docker Context:** `./backend`
   - **Plan:** Free (or upgrade for production)
   - **Region:** Choose your preferred region

3. **Set Environment Variables:**
   - `SPRING_PROFILES_ACTIVE=prod`
   - `MONGODB_URI=your-mongodb-connection-string` (required)
   - `MONGODB_DATABASE=finance_tracker` (optional)
   - `SERVER_PORT=8080` (optional)

4. **Health Check:**
   - Health Check Path: `/finance-tracker/actuator/health`

5. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Monitor the build logs

### Step 3: Verify Backend Deployment

1. **Check Service Status:**
   - Go to the backend service dashboard
   - Verify service status is "Live"
   - Check health check status

2. **Test API Endpoint:**
   - Visit: `https://your-backend-service-name.onrender.com/finance-tracker/actuator/health`
   - Should return: `{"status":"UP"}`

3. **Note Backend URL:**
   - Save the backend service URL
   - Format: `https://finance-tracker-backend.onrender.com`
   - You'll need this for frontend configuration

## Frontend Deployment

### Step 1: Get Backend URL

- Backend URL: `https://your-backend-service-name.onrender.com`
- API Base URL: `https://your-backend-service-name.onrender.com/finance-tracker/api/v1`

### Step 2: Deploy Frontend

#### Option A: Using Render Blueprint (Recommended)

1. **Frontend service is created automatically** when using Blueprint
2. **Configure Frontend Environment Variables:**
   - Go to the frontend service settings
   - Navigate to "Environment" section
   - Add the following variable:
     ```
     REACT_APP_API_BASE_URL=https://your-backend-service-name.onrender.com/finance-tracker/api/v1
     ```
   - Replace `your-backend-service-name` with your actual backend service name
   - Click "Save Changes"

3. **Configure Redirects (for React Router):**
   - The `_redirects` file in `public/` folder will automatically handle routing
   - If the redirect doesn't work, manually configure in Render dashboard:
     - Go to "Redirects/Rewrites" section
     - Add: Source `/*` → Destination `/index.html` (Action: Rewrite)
   - This ensures all routes (like `/login`, `/dashboard`) serve `index.html`

4. **Deploy:**
   - Render will automatically rebuild and deploy
   - Monitor the build logs
   - Wait for deployment to complete

#### Option B: Manual Static Site Creation

1. **Create Static Site:**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the repository and branch

2. **Configure Service:**
   - **Name:** `finance-tracker-frontend`
   - **Build Command:** `cd frontend-web && npm install && npm run build`
   - **Publish Directory:** `frontend-web/build`
   - **Plan:** Free (or upgrade for production)
   - **Region:** Choose your preferred region (should match backend region)

3. **Set Environment Variables:**
   - `REACT_APP_API_BASE_URL=https://your-backend-service-name.onrender.com/finance-tracker/api/v1`
   - Replace with your actual backend URL

4. **Configure Redirects:**
   - The `_redirects` file in `public/` folder should automatically handle this
   - If redirects don't work automatically, manually configure:
     - Go to "Redirects/Rewrites" section in Render dashboard
     - Add rewrite rule:
       - **Source:** `/*`
       - **Destination:** `/index.html`
       - **Action:** Rewrite
   - This ensures React Router works correctly and fixes 404 errors on page refresh

5. **Deploy:**
   - Click "Create Static Site"
   - Render will build and deploy automatically
   - Monitor the build logs

#### Option C: Docker Deployment (Advanced)

1. **Create Web Service:**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

2. **Configure Service:**
   - **Name:** `finance-tracker-frontend`
   - **Environment:** Docker
   - **Dockerfile Path:** `./frontend-web/Dockerfile`
   - **Docker Context:** `./frontend-web`
   - **Plan:** Free (or upgrade for production)
   - **Region:** Choose your preferred region

3. **Set Environment Variables:**
   - `REACT_APP_API_BASE_URL=https://your-backend-service-name.onrender.com/finance-tracker/api/v1`

4. **Health Check:**
   - Health Check Path: `/health`

5. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Monitor the build logs

### Step 3: Verify Frontend Deployment

1. **Check Service Status:**
   - Go to the frontend service dashboard
   - Verify service status is "Live"
   - Check health check status

2. **Test Frontend:**
   - Visit: `https://your-frontend-service-name.onrender.com`
   - Should load the Finance Tracker application
   - Test login and navigation

## Environment Variables

### Backend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `SPRING_PROFILES_ACTIVE` | Spring profile | `prod` | Yes |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority&ssl=true` | Yes |
| `MONGODB_DATABASE` | Database name | `finance_tracker` | No (defaults to finance_tracker) |
| `SERVER_PORT` | Server port | `8080` | No (defaults to 8080) |

### Frontend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `https://finance-tracker-backend.onrender.com/finance-tracker/api/v1` | Yes |

### Frontend Build Configuration

**Build Command:** `cd frontend-web && npm install && npm run build`

**Publish Directory:** `frontend-web/build`

**Note:** These settings are configured in `render.yaml` for blueprint deployment. For manual deployment, use these values in the Render dashboard.

**Important Notes:**

1. **MongoDB Connection String:**
   - Must use `mongodb+srv://` protocol for MongoDB Atlas
   - Must include `retryWrites=true&w=majority&ssl=true`
   - Full format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&ssl=true`

2. **Environment Variables in Render:**
   - Set environment variables in Render dashboard, not in `render.yaml`
   - Changes to environment variables require a rebuild
   - Frontend environment variables are embedded at build time

3. **Backend URL:**
   - Use HTTPS URLs for production
   - Backend URL format: `https://your-backend-service-name.onrender.com`
   - API base URL format: `https://your-backend-service-name.onrender.com/finance-tracker/api/v1`

## Post-Deployment

### 1. Update CORS Configuration (Optional)

For production, you may want to restrict CORS to your frontend domain only:

1. **Update Backend CORS Configuration:**
   - Edit `backend/src/main/java/com/finance/tracker/config/CorsConfig.java`
   - Replace `allowedOriginPatterns("*")` with your frontend domain
   - Example: `config.addAllowedOriginPattern("https://your-frontend-service-name.onrender.com");`

2. **Redeploy Backend:**
   - Commit and push changes
   - Render will automatically redeploy

### 2. Custom Domain (Optional)

1. **Add Custom Domain:**
   - Go to service settings
   - Navigate to "Custom Domains"
   - Add your domain
   - Configure DNS records as instructed

2. **Update Environment Variables:**
   - Update `REACT_APP_API_BASE_URL` if backend domain changes
   - Rebuild frontend service

### 3. Monitor Application

1. **View Logs:**
   - Go to service dashboard
   - Click "Logs" tab
   - Monitor application logs

2. **Check Metrics:**
   - Go to service dashboard
   - View metrics and performance data

3. **Health Checks:**
   - Monitor health check status
   - Set up alerts if needed

## Troubleshooting

### Frontend 404 Error on Page Refresh

**Problem:** Getting `404 (Not Found)` error when refreshing pages like `/login`, `/dashboard`, etc.

**Solution:**

1. **Configure Redirect in Render Dashboard (Required for Static Sites):**
   - Go to your Render dashboard
   - Select your frontend static site service
   - Go to **Settings** → **Redirects/Rewrites**
   - Click **Add Redirect** or **Add Rewrite**
   - Configure:
     - **Source Path:** `/*`
     - **Destination Path:** `/index.html`
     - **Action:** `Rewrite` (NOT Redirect - this is important!)
   - Click **Save**
   - The service will automatically redeploy

2. **Verify Fix:**
   - After redeployment, test by refreshing any route (e.g., `/login`)
   - The page should load correctly instead of showing 404

**Note:** The `_redirects` file in `public/` folder is included for compatibility with other platforms, but Render requires manual configuration in the dashboard.

For more troubleshooting help, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

### Backend Issues

#### Build Fails

1. **Check Build Logs:**
   - Go to service dashboard
   - Click "Logs" tab
   - Look for error messages

2. **Common Issues:**
   - Missing environment variables
   - MongoDB connection string incorrect
   - Gradle build errors

#### Service Won't Start

1. **Check Environment Variables:**
   - Verify `MONGODB_URI` is set correctly
   - Verify `SPRING_PROFILES_ACTIVE=prod`

2. **Check MongoDB Connection:**
   - Verify MongoDB Atlas network access
   - Verify connection string is correct
   - Test connection from local machine

#### Health Check Fails

1. **Check Health Endpoint:**
   - Visit: `https://your-backend-service-name.onrender.com/finance-tracker/actuator/health`
   - Should return: `{"status":"UP"}`

2. **Check Logs:**
   - Look for error messages in logs
   - Check MongoDB connection issues

### Frontend Issues

#### Build Fails

1. **Check Build Logs:**
   - Go to service dashboard
   - Click "Logs" tab
   - Look for error messages

2. **Common Issues:**
   - Missing `REACT_APP_API_BASE_URL` environment variable
   - npm install errors
   - TypeScript compilation errors

#### Service Won't Start

1. **Check Environment Variables:**
   - Verify `REACT_APP_API_BASE_URL` is set correctly
   - Verify backend URL is accessible

2. **Check Backend Connection:**
   - Verify backend is deployed and running
   - Test backend API endpoint from browser

#### API Calls Fail

1. **Check CORS Configuration:**
   - Verify backend CORS allows frontend domain
   - Check browser console for CORS errors

2. **Check Backend URL:**
   - Verify `REACT_APP_API_BASE_URL` is correct
   - Test backend API endpoint directly

3. **Check Network:**
   - Verify backend is accessible
   - Check firewall settings

### General Issues

#### Services Not Connecting

1. **Check Service URLs:**
   - Verify backend URL is correct
   - Verify frontend `REACT_APP_API_BASE_URL` matches backend URL

2. **Check Region:**
   - Ensure both services are in the same region
   - Different regions may have latency issues

#### Environment Variables Not Working

1. **Check Variable Names:**
   - Frontend variables must start with `REACT_APP_`
   - Verify variable names are correct

2. **Rebuild Service:**
   - Environment variable changes require rebuild
   - Trigger manual deploy after changing variables

## Support

For more information, see:
- [Backend README](backend/README.md)
- [Frontend README](frontend-web/README.md)
- [Render Documentation](https://render.com/docs)

