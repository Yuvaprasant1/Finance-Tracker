# Firebase CI/CD Setup Guide

This document explains how to configure GitHub Actions for automated Firebase Hosting deployments.

## Required GitHub Configuration

### 1. Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following **Secret**:

- **Name:** `FIREBASE_SERVICE_ACCOUNT_KEY`
- **Value:** The complete JSON content of your Firebase service account key file
  - See detailed instructions in the [Getting Firebase Service Account Key](#getting-firebase-service-account-key) section below
  - The JSON should be pasted as-is (entire content from the downloaded file)
  - Example format:
    ```json
    {
      "type": "service_account",
      "project_id": "your-project-id",
      "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
      ...
    }
    ```

### 2. Repository Variables

Go to your GitHub repository → Settings → Secrets and variables → Actions → Variables tab → New repository variable

Add the following **Variables**:

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | `finance-tracker-abc123` |
| `REACT_APP_FIREBASE_API_KEY` | Firebase API key | `AIzaSyBxIMRdkFJQVm0U54vfZtztQ62TxWCG0bk` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `finance-tracker-abc123.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID (same as above) | `finance-tracker-abc123` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `finance-tracker-abc123.appspot.com` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `1058479237538` |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID | `1:1058479237538:web:ace1ebbe05721fe74c2afb` |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID (optional) | `G-3MYCLH6EHZ` |
| `REACT_APP_API_BASE_URL` | Backend API base URL | `https://your-backend-url.com/finance-tracker/api/v1` |

### 3. Alternative: Environment-Specific Configuration

If you want to use GitHub Environments (for separate staging/production), you can:

1. Go to Settings → Environments → New environment
2. Create a "production" environment
3. Add the same secrets and variables under the environment instead of repository level
4. Update the workflow file to use `environment: production` in the job

## Getting Firebase Configuration Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on the gear icon ⚙️ → Project Settings
4. Scroll down to "Your apps" section
5. If you don't have a web app, click "Add app" → Web (</>) icon
6. Copy the configuration values from the Firebase SDK snippet

## Getting Firebase Service Account Key

### Step-by-Step Instructions

1. **Go to Firebase Console:**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Select your Firebase project

2. **Navigate to Service Accounts:**
   - Click on the gear icon ⚙️ (top left) → **Project Settings**
   - Click on the **Service Accounts** tab

3. **Generate Service Account Key:**
   - Click the **"Generate New Private Key"** button
   - A confirmation dialog will appear - click **"Generate Key"**
   - A JSON file will be automatically downloaded to your computer

4. **Get the JSON Content:**
   - Open the downloaded JSON file (it will have a name like `your-project-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`)
   - The file contains JSON like this:
     ```json
     {
       "type": "service_account",
       "project_id": "your-project-id",
       "private_key_id": "xxxxx",
       "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
       "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
       "client_id": "xxxxx",
       "auth_uri": "https://accounts.google.com/o/oauth2/auth",
       "token_uri": "https://oauth2.googleapis.com/token",
       "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
       "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
     }
     ```
   - **Copy the ENTIRE JSON content** (all lines, including all braces and quotes)

5. **Store in GitHub Secrets:**
   - Go to your GitHub repository
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Click **"New repository secret"**
   - **Name:** `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Secret:** Paste the entire JSON content you copied
   - Click **"Add secret"**

### Important Notes:

- **The entire JSON must be on a single line or properly formatted** when pasting into GitHub
- **Do NOT include the filename** - only the JSON content
- **Keep the JSON file secure** - delete it from your local machine after storing in GitHub
- **The service account needs "Firebase Hosting Admin" role** - this is usually set by default when generating the key

## Workflow Behavior

The workflow (`firebase-deploy.yml`) will:

- **Trigger:** Automatically on push to `main` branch when files in `react_frontend/` change
- **Manual Trigger:** Can also be triggered manually via GitHub Actions UI
- **Steps:**
  1. Checkout code
  2. Setup Node.js 18.x
  3. Install npm dependencies
  4. Create `.env` file from GitHub variables
  5. Build React app for production
  6. Install Firebase CLI
  7. Authenticate with Firebase using service account
  8. Configure Firebase project
  9. Deploy to Firebase Hosting

## Troubleshooting

### Build Fails with Missing Environment Variables

- Ensure all required variables are set in GitHub repository variables
- Check that variable names match exactly (case-sensitive)
- Verify that `REACT_APP_` prefix is included for all React environment variables

### Firebase Authentication Fails

- Verify `FIREBASE_SERVICE_ACCOUNT_KEY` secret contains valid JSON
- Ensure the service account has "Firebase Hosting Admin" role
- Check that `FIREBASE_PROJECT_ID` variable matches your Firebase project

### Deployment Fails

- Check Firebase project ID is correct
- Verify Firebase Hosting is enabled in your Firebase project
- Ensure the service account has proper permissions

## Security Notes

- **Never commit** `.env` files or service account keys to the repository
- Use GitHub Secrets for sensitive data (service account keys)
- Use GitHub Variables for non-sensitive configuration (API keys, project IDs)
- Review and rotate service account keys periodically

