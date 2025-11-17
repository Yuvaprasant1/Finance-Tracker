# Google Cloud Run Deployment Guide

This guide explains how to deploy the Finance Tracker backend application to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account**: Sign up at [cloud.google.com](https://cloud.google.com)
2. **gcloud CLI**: Install from [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
3. **Docker**: Required for building images (or use Cloud Build)
4. **GCP Project**: Create a new project in Google Cloud Console

## Initial Setup

### 1. Install and Configure gcloud CLI

```bash
# Install gcloud CLI (if not already installed)
# macOS: brew install google-cloud-sdk
# Linux: Follow instructions at https://cloud.google.com/sdk/docs/install
# Windows: Download installer from https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

### 2. Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### 3. Set Up Secrets

You need to configure the following secrets in Google Secret Manager:

| Secret Name | Description | How to Create |
|------------|-------------|---------------|
| `GCP_PROJECT_ID` | Your GCP project ID | Set as environment variable or in gcloud config |
| `GCP_REGION` | Deployment region (e.g., `us-central1`) | Set as environment variable |
| `SERVICE_NAME` | Cloud Run service name (e.g., `springboot-api`) | Set as environment variable |
| `GCP_SA_KEY` | Service account JSON key | Create service account and download key |

#### Create Secrets in Secret Manager

**Option 1: Using gcloud CLI**

```bash
# MongoDB URI
echo -n "mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority" | \
  gcloud secrets create mongodb-uri --data-file=- --replication-policy="automatic"

# Firebase Credentials (Base64 encoded)
echo -n "YOUR_BASE64_ENCODED_FIREBASE_CREDENTIALS" | \
  gcloud secrets create firebase-credentials --data-file=- --replication-policy="automatic"

# Google OAuth Client ID
echo -n "YOUR_GOOGLE_OAUTH_CLIENT_ID" | \
  gcloud secrets create google-oauth --data-file=- --replication-policy="automatic"
```

**Option 2: Using Google Cloud Console**

1. Go to [Secret Manager](https://console.cloud.google.com/security/secret-manager)
2. Click "Create Secret"
3. Enter secret name and value
4. Set replication policy to "Automatic"

## Deployment Methods

### Method 1: Using Deployment Scripts (Recommended)

#### Linux/macOS

```bash
# Set environment variables
export GCP_PROJECT_ID=your-project-id
export GCP_REGION=us-central1
export SERVICE_NAME=springboot-api

# Run deployment script
cd backend
chmod +x scripts/deploy-cloudrun.sh
./scripts/deploy-cloudrun.sh
```

#### Windows PowerShell

```powershell
# Set environment variables
$env:GCP_PROJECT_ID="your-project-id"
$env:GCP_REGION="us-central1"
$env:SERVICE_NAME="springboot-api"

# Run deployment script
cd backend
.\scripts\deploy-cloudrun.ps1
```

The script will:
- Enable required APIs
- Create secrets if they don't exist
- Create service account
- Build and push Docker image
- Deploy to Cloud Run

### Method 2: Using gcloud CLI Directly

```bash
# Set variables
export GCP_PROJECT_ID=your-project-id
export GCP_REGION=us-central1
export SERVICE_NAME=springboot-api

# Build and push image
IMAGE="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${SERVICE_NAME}/${SERVICE_NAME}:latest"
gcloud builds submit --tag $IMAGE

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image=$IMAGE \
  --region=$GCP_REGION \
  --platform=managed \
  --allow-unauthenticated \
  --service-account="${SERVICE_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --set-secrets="MONGODB_URI=mongodb-uri:latest,FIREBASE_CREDENTIALS_BASE64=firebase-credentials:latest,WEB_CLIENT_ID=google-oauth:latest" \
  --set-env-vars="SPRING_PROFILES_ACTIVE=prod,SERVER_PORT=8080,PORT=8080" \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=1 \
  --max-instances=10 \
  --timeout=300
```

### Method 3: Using YAML Configuration

```bash
# Substitute variables in YAML
export GCP_PROJECT_ID=your-project-id
export GCP_REGION=us-central1
export SERVICE_NAME=springboot-api

# Replace variables and deploy
sed "s/\${GCP_PROJECT_ID}/$GCP_PROJECT_ID/g; s/\${GCP_REGION}/$GCP_REGION/g; s/\${SERVICE_NAME}/$SERVICE_NAME/g" \
  deploy-cloudrun.yaml > cloudrun-deploy.yaml

gcloud run services replace cloudrun-deploy.yaml --region=$GCP_REGION
```

## Configuration

### Service Account Setup

The deployment script creates a service account automatically. If you need to create it manually:

```bash
# Create service account
gcloud iam service-accounts create $SERVICE_NAME \
  --display-name="Finance Tracker Service Account"

# Grant secret access
gcloud secrets add-iam-policy-binding mongodb-uri \
  --member="serviceAccount:${SERVICE_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding firebase-credentials \
  --member="serviceAccount:${SERVICE_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding google-oauth \
  --member="serviceAccount:${SERVICE_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Resource Configuration

Default resource limits in `deploy-cloudrun.yaml`:
- **CPU**: 1 vCPU (1000m)
- **Memory**: 512Mi
- **Min Instances**: 1 (to avoid cold starts)
- **Max Instances**: 10 (auto-scaling)
- **Timeout**: 300 seconds

To modify, edit `deploy-cloudrun.yaml` or use `--memory`, `--cpu`, `--min-instances`, `--max-instances` flags with `gcloud run deploy`.

### Environment Variables

All environment variables are configured in the YAML file. Sensitive values use Secret Manager.

**Required Secrets:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `FIREBASE_CREDENTIALS_BASE64` - Base64 encoded Firebase service account JSON
- `WEB_CLIENT_ID` - Google OAuth client ID

**Optional Environment Variables:**
- `MONGODB_DATABASE` - Database name (default: `finance_tracker`)
- `MONGODB_MIN_POOL_SIZE` - Connection pool min size (default: `10`)
- `MONGODB_MAX_POOL_SIZE` - Connection pool max size (default: `100`)
- `LOG_LEVEL_ROOT` - Root logging level (default: `WARN`)
- `LOG_LEVEL_APP` - Application logging level (default: `INFO`)

## Post-Deployment

### Get Service URL

```bash
gcloud run services describe $SERVICE_NAME \
  --region=$GCP_REGION \
  --format="value(status.url)"
```

### Test Health Endpoint

```bash
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region=$GCP_REGION \
  --format="value(status.url)")

curl $SERVICE_URL/finance-tracker/actuator/health
```

### View Logs

```bash
# Stream logs
gcloud run services logs read $SERVICE_NAME --region=$GCP_REGION --follow

# View recent logs
gcloud run services logs read $SERVICE_NAME --region=$GCP_REGION --limit=50
```

### Update Service

To update the service after code changes:

```bash
# Rebuild and redeploy
./scripts/deploy-cloudrun.sh
```

Or manually:

```bash
# Build new image
IMAGE="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${SERVICE_NAME}/${SERVICE_NAME}:latest"
gcloud builds submit --tag $IMAGE

# Deploy new revision
gcloud run deploy $SERVICE_NAME --image=$IMAGE --region=$GCP_REGION
```

## Troubleshooting

### Service Won't Start

1. **Check logs:**
   ```bash
   gcloud run services logs read $SERVICE_NAME --region=$GCP_REGION
   ```

2. **Verify secrets are accessible:**
   ```bash
   gcloud secrets versions access latest --secret="mongodb-uri"
   ```

3. **Check service account permissions:**
   ```bash
   gcloud projects get-iam-policy $GCP_PROJECT_ID \
     --flatten="bindings[].members" \
     --filter="bindings.members:serviceAccount:${SERVICE_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com"
   ```

### Health Check Failing

1. **Verify health endpoint is accessible:**
   ```bash
   curl $SERVICE_URL/finance-tracker/actuator/health
   ```

2. **Check startup probe configuration** in `deploy-cloudrun.yaml`

3. **Increase startup delay** if application takes longer to start:
   ```yaml
   startupProbe:
     initialDelaySeconds: 30  # Increase if needed
   ```

### Connection Issues

1. **MongoDB Atlas Network Access:**
   - Add Cloud Run service IPs to MongoDB Atlas whitelist
   - Or allow all IPs: `0.0.0.0/0` (less secure)

2. **Firewall Rules:**
   - Cloud Run services are accessible from the internet by default
   - Check if you have VPC firewall rules blocking traffic

### High Costs

1. **Reduce min instances** to 0 (enables cold starts):
   ```bash
   gcloud run services update $SERVICE_NAME \
     --min-instances=0 \
     --region=$GCP_REGION
   ```

2. **Reduce resource allocation:**
   - Lower CPU/memory if application doesn't need it
   - Set max instances to limit scaling

## Cost Estimation

Cloud Run pricing (as of 2024):
- **CPU**: $0.00002400 per vCPU-second
- **Memory**: $0.00000250 per GiB-second
- **Requests**: $0.40 per million requests
- **Free Tier**: 2 million requests/month, 360,000 GiB-seconds, 180,000 vCPU-seconds

Example monthly cost for moderate traffic:
- 1 instance running 24/7 with 512Mi memory, 1 CPU
- ~$15-30/month (depending on traffic)

## Security Best Practices

1. **Use Secret Manager** for all sensitive values (already configured)
2. **Enable IAM authentication** if you don't need public access:
   ```bash
   gcloud run services update $SERVICE_NAME \
     --no-allow-unauthenticated \
     --region=$GCP_REGION
   ```
3. **Use VPC connector** for private resources (uncomment in YAML)
4. **Enable Cloud Armor** for DDoS protection
5. **Regular security updates** - rebuild images with latest base images

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Artifact Registry Documentation](https://cloud.google.com/artifact-registry/docs)

