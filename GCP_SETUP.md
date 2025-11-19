# GCP Setup Guide for Finance Tracker Backend

This guide provides step-by-step instructions to set up Google Cloud Platform (GCP) prerequisites for automated CI/CD deployment of the Finance Tracker backend to Cloud Run using GitHub Actions.

## Table of Contents

- [Prerequisites](#prerequisites)
- [GCP Setup Commands](#gcp-setup-commands)
- [GitHub Secrets Configuration](#github-secrets-configuration)
- [Cloud Run Environment Variables](#cloud-run-environment-variables)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have:

1. **Google Cloud Project** with billing enabled
2. **Google Cloud SDK (gcloud CLI)** installed and configured
   - Install: https://cloud.google.com/sdk/docs/install
   - Authenticate: `gcloud auth login`
   - Set project: `gcloud config set project YOUR_PROJECT_ID`
3. **GitHub Repository** with Actions enabled
4. **Required APIs** will be enabled in the setup steps below

## GCP Setup Commands

Run these commands **once** to set up your GCP project for CI/CD deployment.

### 1. Enable Required Services

Enable the necessary GCP APIs:

```bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

**Note:** These services are required for:
- `run.googleapis.com` - Cloud Run service deployment
- `artifactregistry.googleapis.com` - Docker image storage

### 2. Create Artifact Registry Repository

Create a Docker repository in Artifact Registry to store your container images:

```bash
gcloud artifacts repositories create finance-tracker \
  --repository-format=docker \
  --location=asia-south1 \
  --description="Docker repository for Finance Tracker backend"
```

**Parameters:**
- `finance-tracker` - Repository name (matches `REPO` in deploy.yaml)
- `asia-south1` - Region (matches `REGION` in deploy.yaml)
- `docker` - Format for Docker images

**Alternative:** If you prefer a different repository name, update the `REPO` variable in `.github/workflows/deploy.yaml`.

### 3. Create CI/CD Service Account

Create a dedicated service account for GitHub Actions:

```bash
gcloud iam service-accounts create github-cd \
  --display-name="GitHub Actions CI/CD Service Account"
```

**Note:** The service account name `github-cd` is used throughout this guide. If you change it, update all references accordingly.

### 4. Grant Required Permissions

Grant the service account the necessary IAM roles for deployment:

#### Cloud Run Admin (Deploy Services)

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-cd@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"
```

#### Artifact Registry Writer (Push Images)

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-cd@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"
```

**Replace `PROJECT_ID`** with your actual GCP project ID in all commands above.

**Optional:** If you need Cloud Build integration:

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-cd@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.editor"
```

### 5. Download Service Account Key

Generate and download the service account key file:

```bash
gcloud iam service-accounts keys create key.json \
  --iam-account=github-cd@PROJECT_ID.iam.gserviceaccount.com
```

**Security Note:**
- The `key.json` file contains sensitive credentials
- **Never commit this file to version control**
- Keep it secure and delete it after uploading to GitHub Secrets
- The file is already in `.gitignore` for safety

## GitHub Secrets Configuration

Configure GitHub Secrets to allow the workflow to authenticate with GCP.

### Step 1: Access GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Step 2: Add Required Secrets

Add the following secrets:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `GCP_SA_KEY` | Contents of `key.json` file | Full JSON content of the service account key |
| `GCP_PROJECT_ID` | Your GCP project ID | Example: `my-project-123456` |
| `GCP_REGION` | `asia-south1` | (Optional) GCP region for deployment |

#### Adding GCP_SA_KEY

1. Open the `key.json` file you downloaded
2. Copy the **entire JSON content** (including all braces and quotes)
3. Paste it as the secret value for `GCP_SA_KEY`

**Example:**
```json
{
  "type": "service_account",
  "project_id": "my-project-123456",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  ...
}
```

#### Adding GCP_PROJECT_ID

Simply enter your GCP project ID (e.g., `my-project-123456`).

#### Adding GCP_REGION (Optional)

The region is already set in the workflow file, but you can override it with this secret if needed.

### Step 3: Verify Secrets

After adding secrets, verify they are listed in the Secrets page. The values will be masked for security.

### Step 4: Clean Up

After successfully uploading the key to GitHub Secrets:

```bash
# Delete the local key file for security
rm key.json
```

**Important:** The key is now stored securely in GitHub Secrets. You can regenerate it if needed using the same command from step 5.

## Cloud Run Environment Variables

The backend application requires several environment variables to run in production. These should be configured in Cloud Run.

### Required Environment Variables

Set these environment variables in Cloud Run for the application to function:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Yes | Spring profile | `prod` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority` |
| `MONGODB_DATABASE` | No | Database name (default: `finance_tracker`) | `finance_tracker` |
| `FIREBASE_CREDENTIALS_BASE64` | Yes | Base64 encoded Firebase service account JSON | `ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIs...` |
| `WEB_CLIENT_ID` | Yes | Google OAuth client ID | `1058479237538-xxx.apps.googleusercontent.com` |

### Setting Environment Variables

You can set environment variables in two ways:

#### Option 1: Using gcloud CLI (Recommended)

```bash
gcloud run services update backend \
  --region=asia-south1 \
  --set-env-vars SPRING_PROFILES_ACTIVE=prod \
  --set-env-vars MONGODB_URI=your-mongodb-connection-string \
  --set-env-vars MONGODB_DATABASE=finance_tracker \
  --set-env-vars FIREBASE_CREDENTIALS_BASE64=your-base64-encoded-credentials \
  --set-env-vars WEB_CLIENT_ID=your-google-client-id
```

#### Option 2: Using Cloud Console

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click on your `backend` service
3. Click **Edit & Deploy New Revision**
4. Go to **Variables & Secrets** tab
5. Add each environment variable
6. Click **Deploy**

#### Option 3: Update GitHub Actions Workflow

You can also add environment variables directly in the deployment step of `.github/workflows/deploy.yaml`:

```yaml
- name: Deploy to Cloud Run
  run: |
    IMAGE="${REGION}-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/$REPO/$SERVICE_NAME"
    gcloud run deploy $SERVICE_NAME \
      --image $IMAGE \
      --region $REGION \
      --platform managed \
      --allow-unauthenticated \
      --set-env-vars SPRING_PROFILES_ACTIVE=prod \
      --set-env-vars MONGODB_URI=${{ secrets.MONGODB_URI }} \
      --set-env-vars MONGODB_DATABASE=finance_tracker \
      --set-env-vars FIREBASE_CREDENTIALS_BASE64=${{ secrets.FIREBASE_CREDENTIALS_BASE64 }} \
      --set-env-vars WEB_CLIENT_ID=${{ secrets.WEB_CLIENT_ID }}
```

**Note:** If using secrets in the workflow, add them to GitHub Secrets as well.

## Verification

After completing the setup, verify everything is configured correctly:

### 1. Verify Service Account

```bash
gcloud iam service-accounts describe github-cd@PROJECT_ID.iam.gserviceaccount.com
```

### 2. Verify Artifact Registry Repository

```bash
gcloud artifacts repositories list --location=asia-south1
```

You should see `finance-tracker` in the list.

### 3. Verify IAM Permissions

```bash
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:github-cd@PROJECT_ID.iam.gserviceaccount.com"
```

You should see `roles/run.admin` and `roles/artifactregistry.writer` roles.

### 4. Test GitHub Actions Workflow

1. Make a small change to your code
2. Commit and push to the `main` branch
3. Go to **Actions** tab in GitHub
4. Watch the workflow run
5. Check that:
   - Docker image builds successfully
   - Image is pushed to Artifact Registry
   - Cloud Run service is deployed
   - Application starts without errors

### 5. Verify Cloud Run Service

```bash
gcloud run services describe backend --region=asia-south1
```

Check that:
- Service is running
- Environment variables are set correctly
- Health endpoint is accessible

### 6. Test Application Endpoint

```bash
# Get the service URL
SERVICE_URL=$(gcloud run services describe backend --region=asia-south1 --format='value(status.url)')

# Test health endpoint
curl $SERVICE_URL/finance-tracker/actuator/health
```

You should get a JSON response with health status.

## Troubleshooting

### Common Issues and Solutions

#### 1. "Permission Denied" Errors

**Problem:** GitHub Actions fails with permission errors.

**Solutions:**
- Verify service account has correct IAM roles
- Check that `GCP_SA_KEY` secret contains valid JSON
- Ensure project ID in secrets matches your GCP project

#### 2. "Repository Not Found" Error

**Problem:** Docker push fails with repository not found.

**Solutions:**
- Verify Artifact Registry repository exists: `gcloud artifacts repositories list`
- Check repository name matches `REPO` variable in workflow
- Ensure repository is in the correct region (`asia-south1`)

#### 3. "Dockerfile Not Found" Error

**Problem:** Build fails because Dockerfile is not found.

**Solutions:**
- Verify Dockerfile exists in `backend/` directory
- Check workflow builds from correct directory (should be `./backend`)
- Note: The file is named `DockerFile` (capital F) - ensure workflow handles this

#### 4. Cloud Run Deployment Fails

**Problem:** Service deployment succeeds but application fails to start.

**Solutions:**
- Check Cloud Run logs: `gcloud run services logs read backend --region=asia-south1`
- Verify all required environment variables are set
- Check MongoDB connection string is correct
- Ensure Firebase credentials are properly base64 encoded

#### 5. "Service Account Key Invalid" Error

**Problem:** Authentication fails with invalid key.

**Solutions:**
- Regenerate service account key
- Ensure entire JSON is copied to GitHub Secret (no truncation)
- Verify key hasn't been deleted in GCP Console

#### 6. Environment Variables Not Set

**Problem:** Application starts but fails due to missing environment variables.

**Solutions:**
- List current env vars: `gcloud run services describe backend --region=asia-south1`
- Set missing variables using `gcloud run services update` command
- Check application logs for specific missing variable errors

### Getting Help

If you encounter issues not covered here:

1. Check [Cloud Run Documentation](https://cloud.google.com/run/docs)
2. Review [GitHub Actions Logs](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows)
3. Check [Artifact Registry Documentation](https://cloud.google.com/artifact-registry/docs)
4. Review application logs in Cloud Run console

## Next Steps

After completing this setup:

1. **First Deployment:** Push to `main` branch to trigger automatic deployment
2. **Monitor:** Watch the GitHub Actions workflow and Cloud Run logs
3. **Configure Domain:** Set up custom domain if needed
4. **Set Up Monitoring:** Configure Cloud Monitoring and alerting
5. **Review Security:** Ensure environment variables are properly secured

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Artifact Registry Documentation](https://cloud.google.com/artifact-registry/docs)
- [GitHub Actions for GCP](https://github.com/google-github-actions)
- [Backend README](../backend/README.md) - Application-specific documentation

---

**Last Updated:** 2024
**Maintained by:** Finance Tracker Team

