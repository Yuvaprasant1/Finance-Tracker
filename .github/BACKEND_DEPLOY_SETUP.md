# Backend CI/CD Setup Guide

This document explains how to configure GitHub Actions for automated backend deployment to Google Cloud Run.

## Required GitHub Configuration

### 1. Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following **Secrets** (sensitive data):

| Secret Name | Description | Example |
|------------|-------------|---------|
| `GCP_SA_KEY` | GCP Service Account JSON key for authentication | `{"type":"service_account",...}` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `FIREBASE_CREDENTIALS_BASE64` | Base64 encoded Firebase credentials | Base64 encoded JSON string |

### 2. Repository Variables

Go to your GitHub repository → Settings → Secrets and variables → Actions → Variables tab → New repository variable

Add the following **Variables** (non-sensitive configuration):

| Variable Name | Description | Example | Required |
|--------------|-------------|---------|----------|
| `SERVICE_NAME` | Cloud Run service name | `backend` | Yes |
| `REGION` | GCP region for deployment | `asia-south1` | Yes |
| `REPO` | Artifact Registry repository name | `finance-tracker` | Yes |
| `GCP_PROJECT_ID` | Google Cloud Project ID | `finance-tracker-123456` | Yes |
| `SPRING_PROFILES_ACTIVE` | Spring Boot active profile | `prod` | Yes |
| `MONGODB_DATABASE` | MongoDB database name | `finance_tracker` | Yes |
| `WEB_CLIENT_ID` | Firebase Web Client ID | `123456789-abc.apps.googleusercontent.com` | Yes |

## Getting Configuration Values

### GCP Service Account Key (GCP_SA_KEY)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** → **Service Accounts**
3. Select or create a service account with the following roles:
   - Cloud Run Admin
   - Artifact Registry Writer
   - Service Account User
4. Click on the service account → **Keys** tab
5. Click **Add Key** → **Create new key** → **JSON**
6. Download the JSON file
7. Copy the entire JSON content and paste it as the `GCP_SA_KEY` secret in GitHub

### GCP Project ID (GCP_PROJECT_ID)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Your Project ID is displayed at the top of the page
3. Copy it and set it as the `GCP_PROJECT_ID` variable

### MongoDB Configuration

1. **MONGODB_URI**: Get from your MongoDB Atlas dashboard → Connect → Connection String
2. **MONGODB_DATABASE**: Your database name in MongoDB

### Firebase Configuration

1. **FIREBASE_CREDENTIALS_BASE64**: 
   - Get Firebase Admin SDK credentials from Firebase Console
   - Base64 encode the JSON content
   - Store as secret
2. **WEB_CLIENT_ID**: 
   - Firebase Console → Project Settings → General
   - Find "Web API Key" or OAuth 2.0 Client ID

## Workflow Behavior

The workflow (`deploy.yaml`) will:

- **Trigger:** Automatically on push to `main` branch
- **Steps:**
  1. Checkout code
  2. Authenticate with Google Cloud using service account
  3. Setup gcloud CLI
  4. Authenticate Docker with Artifact Registry
  5. Build Docker image
  6. Push image to Artifact Registry
  7. Deploy to Cloud Run with environment variables

## Environment Variables in Cloud Run

The following environment variables are set in the Cloud Run service:

- `SPRING_PROFILES_ACTIVE` - From GitHub variable
- `MONGODB_URI` - From GitHub secret
- `MONGODB_DATABASE` - From GitHub variable
- `FIREBASE_CREDENTIALS_BASE64` - From GitHub secret
- `WEB_CLIENT_ID` - From GitHub variable

## Troubleshooting

### Authentication Fails

- Verify `GCP_SA_KEY` secret contains valid JSON
- Ensure service account has required IAM roles
- Check that `GCP_PROJECT_ID` variable is correct

### Docker Build/Push Fails

- Verify Artifact Registry repository exists
- Check that service account has "Artifact Registry Writer" role
- Ensure `REPO` variable matches your Artifact Registry repository name

### Cloud Run Deployment Fails

- Verify Cloud Run API is enabled in your GCP project
- Check that service account has "Cloud Run Admin" role
- Ensure `REGION` variable matches a valid GCP region
- Verify `SERVICE_NAME` variable is set correctly

### Application Errors

- Check Cloud Run logs in GCP Console
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is valid
- Check Firebase credentials are properly base64 encoded

## Security Notes

- **Never commit** service account keys or connection strings to the repository
- Use GitHub Secrets for sensitive data (passwords, keys, connection strings)
- Use GitHub Variables for non-sensitive configuration (project IDs, region names)
- Rotate service account keys periodically
- Review IAM permissions regularly

