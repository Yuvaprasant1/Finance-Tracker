# Troubleshooting Guide - Finance Tracker

Common issues and solutions for Finance Tracker deployment.

## Frontend Issues

### 404 Error on Page Refresh (React Router)

**Problem:**
- Getting `404 (Not Found)` error when refreshing pages like `/login`, `/dashboard`, etc.
- Error: `GET https://your-site.onrender.com/login 404 (Not Found)`

**Cause:**
- React Router uses client-side routing, but the server doesn't know about these routes
- When you refresh `/login`, the server looks for a file at that path and returns 404

**Solution:**

#### For Render Static Site Deployment:

1. **Option 1: Configure Redirect in Render Dashboard (Recommended)**
   - Go to your Render dashboard
   - Select your frontend static site service
   - Go to **Settings** → **Redirects/Rewrites**
   - Click **Add Redirect**
   - Configure:
     - **Source Path:** `/*`
     - **Destination Path:** `/index.html`
     - **Action:** `Rewrite` (NOT Redirect)
   - Click **Save**
   - Redeploy your service

2. **Option 2: Use _redirects File**
   - The `_redirects` file in `public/` folder should be included in the build
   - Verify it's in your `build` folder after building
   - If Render doesn't automatically use it, use Option 1 above

#### For Docker Deployment:

The nginx configuration already handles this with `try_files $uri $uri/ /index.html;`. If you're using Docker and still getting 404s, verify:
- The Dockerfile is correctly copying nginx.conf
- The nginx.conf has the correct `try_files` directive
- The service is using the Docker deployment (not static site)

#### Verification:

After applying the fix:
1. Deploy/rebuild your frontend
2. Test by refreshing any route (e.g., `/login`, `/dashboard`)
3. The page should load correctly instead of showing 404

### API Connection Issues

**Problem:**
- Frontend can't connect to backend API
- CORS errors in browser console
- Network errors

**Solutions:**

1. **Check Environment Variable:**
   - Verify `REACT_APP_API_BASE_URL` is set correctly in Render dashboard
   - Format: `https://your-backend-service.onrender.com/finance-tracker/api/v1`
   - Rebuild frontend after changing environment variables

2. **Check Backend CORS Configuration:**
   - Verify backend CORS allows your frontend domain
   - Check `CorsConfig.java` in backend
   - Current config allows all origins (`*`), which should work

3. **Check Backend Status:**
   - Verify backend is running and accessible
   - Test backend health endpoint: `https://your-backend.onrender.com/finance-tracker/actuator/health`
   - Check backend logs in Render dashboard

4. **Check Network:**
   - Verify both services are in the same region
   - Check firewall/network settings
   - Verify HTTPS is used (not HTTP)

### Build Failures

**Problem:**
- Frontend build fails on Render
- npm install errors
- TypeScript compilation errors

**Solutions:**

1. **Clear Build Cache:**
   - In Render dashboard, go to service settings
   - Clear build cache
   - Trigger new deployment

2. **Check Node Version:**
   - Verify Node.js version in package.json or Render settings
   - Recommended: Node 18+

3. **Check Build Command:**
   - Verify build command: `cd frontend-web && npm install && npm run build`
   - Check build logs for specific errors

4. **Check Dependencies:**
   - Verify all dependencies are in package.json
   - Run `npm install` locally to test
   - Check for version conflicts

## Backend Issues

### MongoDB Connection Issues

**Problem:**
- Backend can't connect to MongoDB
- Connection timeout errors
- Authentication failed errors

**Solutions:**

1. **Check MongoDB URI:**
   - Verify `MONGODB_URI` environment variable is set correctly
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&ssl=true`
   - Check for special characters in password (URL encode if needed)

2. **Check MongoDB Atlas Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Add IP address: `0.0.0.0/0` (allow all) or specific Render IPs
   - Wait a few minutes for changes to propagate

3. **Check Database User:**
   - Verify database user has read/write permissions
   - Check username and password are correct

4. **Check Connection String:**
   - Verify connection string includes required parameters:
     - `retryWrites=true`
     - `w=majority`
     - `ssl=true`

### Application Won't Start

**Problem:**
- Backend service fails to start
- Health check fails
- Service crashes on startup

**Solutions:**

1. **Check Logs:**
   - View logs in Render dashboard
   - Look for error messages
   - Check for missing environment variables

2. **Check Environment Variables:**
   - Verify `SPRING_PROFILES_ACTIVE=prod`
   - Verify `MONGODB_URI` is set
   - Check all required variables are present

3. **Check Port Configuration:**
   - Verify `SERVER_PORT` or `PORT` environment variable
   - Render sets `PORT` automatically, but check if it matches your config

4. **Check Spring Profile:**
   - Verify production profile is active
   - Check `application-prod.properties` exists
   - Verify MongoDB configuration in production profile

## General Issues

### Services Not Connecting

**Problem:**
- Frontend and backend can't communicate
- Services are deployed but not working together

**Solutions:**

1. **Check Service URLs:**
   - Verify backend URL is correct
   - Verify frontend `REACT_APP_API_BASE_URL` matches backend URL
   - Use HTTPS URLs (not HTTP)

2. **Check Region:**
   - Deploy both services in the same region
   - Different regions may cause latency issues

3. **Check Service Status:**
   - Verify both services are "Live" in Render dashboard
   - Check health check status
   - Verify services are not in "Building" or "Failed" state

### Environment Variables Not Working

**Problem:**
- Environment variables not being read
- Frontend shows wrong API URL
- Backend using wrong configuration

**Solutions:**

1. **Frontend Environment Variables:**
   - Variables must start with `REACT_APP_`
   - Changes require rebuild (not just redeploy)
   - Verify variable is set in Render dashboard
   - Check build logs to verify variable is being used

2. **Backend Environment Variables:**
   - Verify variables are set in Render dashboard
   - Check Spring profile is active
   - Restart service after changing variables
   - Check logs for variable values (be careful with sensitive data)

3. **Rebuild/Redeploy:**
   - Frontend: Rebuild after changing environment variables
   - Backend: Restart service after changing environment variables

## Getting Help

If you're still experiencing issues:

1. **Check Logs:**
   - Frontend: Render dashboard → Logs tab
   - Backend: Render dashboard → Logs tab
   - Browser: Developer console (F12)

2. **Verify Configuration:**
   - Check all environment variables are set
   - Verify service configurations
   - Check network/firewall settings

3. **Test Locally:**
   - Test frontend locally with production API URL
   - Test backend locally with production MongoDB
   - Verify configurations work locally first

4. **Check Documentation:**
   - [Backend README](backend/README.md)
   - [Frontend README](frontend-web/README.md)
   - [Deployment Guide](DEPLOYMENT.md)

