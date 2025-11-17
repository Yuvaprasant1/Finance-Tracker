# Google Cloud Run Deployment Script for Finance Tracker Backend (PowerShell)
# 
# This script automates the deployment of the Spring Boot application to Google Cloud Run
# 
# Prerequisites:
# 1. Install gcloud CLI: https://cloud.google.com/sdk/docs/install
# 2. Authenticate: gcloud auth login
# 3. Set your project: gcloud config set project YOUR_PROJECT_ID
# 4. Enable required APIs (see script output)
# 5. Create secrets in Secret Manager (see script output)
# 
# Usage:
#   .\scripts\deploy-cloudrun.ps1
# 
# Or with environment variables:
#   $env:GCP_PROJECT_ID="my-project"; $env:GCP_REGION="us-central1"; $env:SERVICE_NAME="springboot-api"; .\scripts\deploy-cloudrun.ps1

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Google Cloud Run Deployment Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "Error: gcloud CLI is not installed" -ForegroundColor Red
    Write-Host "Please install it from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Get configuration from environment variables or prompt
$GCP_PROJECT_ID = if ($env:GCP_PROJECT_ID) { $env:GCP_PROJECT_ID } else { Read-Host "Enter GCP Project ID" }
$GCP_REGION = if ($env:GCP_REGION) { $env:GCP_REGION } else { Read-Host "Enter GCP Region (e.g., us-central1)" }
$SERVICE_NAME = if ($env:SERVICE_NAME) { $env:SERVICE_NAME } else { Read-Host "Enter Service Name (e.g., springboot-api)" }

Write-Host ""
Write-Host "Configuration:" -ForegroundColor Green
Write-Host "  Project ID: $GCP_PROJECT_ID"
Write-Host "  Region: $GCP_REGION"
Write-Host "  Service Name: $SERVICE_NAME"
Write-Host ""

# Set the project
Write-Host "Setting GCP project..." -ForegroundColor Yellow
gcloud config set project $GCP_PROJECT_ID

# Enable required APIs
Write-Host ""
Write-Host "Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com --project=$GCP_PROJECT_ID
gcloud services enable cloudbuild.googleapis.com --project=$GCP_PROJECT_ID
gcloud services enable artifactregistry.googleapis.com --project=$GCP_PROJECT_ID
gcloud services enable secretmanager.googleapis.com --project=$GCP_PROJECT_ID

# Check if secrets exist, create if not
Write-Host ""
Write-Host "Checking secrets in Secret Manager..." -ForegroundColor Yellow

# MongoDB URI secret
$mongodbSecret = gcloud secrets describe mongodb-uri --project=$GCP_PROJECT_ID 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Secret 'mongodb-uri' not found. Creating..." -ForegroundColor Yellow
    $MONGODB_URI = Read-Host "Enter your MongoDB URI" -AsSecureString
    $MONGODB_URI_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($MONGODB_URI))
    $MONGODB_URI_PLAIN | gcloud secrets create mongodb-uri `
        --data-file=- `
        --project=$GCP_PROJECT_ID `
        --replication-policy="automatic"
    Write-Host "Secret 'mongodb-uri' created" -ForegroundColor Green
} else {
    Write-Host "Secret 'mongodb-uri' exists" -ForegroundColor Green
}

# Firebase credentials secret
$firebaseSecret = gcloud secrets describe firebase-credentials --project=$GCP_PROJECT_ID 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Secret 'firebase-credentials' not found. Creating..." -ForegroundColor Yellow
    $FIREBASE_CREDENTIALS = Read-Host "Enter your Firebase credentials (Base64 encoded)" -AsSecureString
    $FIREBASE_CREDENTIALS_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($FIREBASE_CREDENTIALS))
    $FIREBASE_CREDENTIALS_PLAIN | gcloud secrets create firebase-credentials `
        --data-file=- `
        --project=$GCP_PROJECT_ID `
        --replication-policy="automatic"
    Write-Host "Secret 'firebase-credentials' created" -ForegroundColor Green
} else {
    Write-Host "Secret 'firebase-credentials' exists" -ForegroundColor Green
}

# Google OAuth client ID secret
$oauthSecret = gcloud secrets describe google-oauth --project=$GCP_PROJECT_ID 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Secret 'google-oauth' not found. Creating..." -ForegroundColor Yellow
    $WEB_CLIENT_ID = Read-Host "Enter your Google OAuth Client ID" -AsSecureString
    $WEB_CLIENT_ID_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($WEB_CLIENT_ID))
    $WEB_CLIENT_ID_PLAIN | gcloud secrets create google-oauth `
        --data-file=- `
        --project=$GCP_PROJECT_ID `
        --replication-policy="automatic"
    Write-Host "Secret 'google-oauth' created" -ForegroundColor Green
} else {
    Write-Host "Secret 'google-oauth' exists" -ForegroundColor Green
}

# Grant Cloud Run service account access to secrets
Write-Host ""
Write-Host "Granting Cloud Run service account access to secrets..." -ForegroundColor Yellow

# Get or create service account
$SERVICE_ACCOUNT = "${SERVICE_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com"
$saCheck = gcloud iam service-accounts describe $SERVICE_ACCOUNT --project=$GCP_PROJECT_ID 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating service account: $SERVICE_ACCOUNT" -ForegroundColor Yellow
    gcloud iam service-accounts create $SERVICE_NAME `
        --display-name="Finance Tracker Service Account" `
        --project=$GCP_PROJECT_ID
}

# Grant secret accessor role
gcloud secrets add-iam-policy-binding mongodb-uri `
    --member="serviceAccount:${SERVICE_ACCOUNT}" `
    --role="roles/secretmanager.secretAccessor" `
    --project=$GCP_PROJECT_ID

gcloud secrets add-iam-policy-binding firebase-credentials `
    --member="serviceAccount:${SERVICE_ACCOUNT}" `
    --role="roles/secretmanager.secretAccessor" `
    --project=$GCP_PROJECT_ID

gcloud secrets add-iam-policy-binding google-oauth `
    --member="serviceAccount:${SERVICE_ACCOUNT}" `
    --role="roles/secretmanager.secretAccessor" `
    --project=$GCP_PROJECT_ID

# Build and push Docker image
Write-Host ""
Write-Host "Building Docker image..." -ForegroundColor Yellow
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptPath "..")

# Create Artifact Registry repository if it doesn't exist
$REPO_NAME = $SERVICE_NAME
$repoCheck = gcloud artifacts repositories describe $REPO_NAME --location=$GCP_REGION --project=$GCP_PROJECT_ID 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating Artifact Registry repository..." -ForegroundColor Yellow
    gcloud artifacts repositories create $REPO_NAME `
        --repository-format=docker `
        --location=$GCP_REGION `
        --description="Finance Tracker Docker images" `
        --project=$GCP_PROJECT_ID
}

# Build and push using Cloud Build
$IMAGE = "${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"
Write-Host "Building and pushing image: $IMAGE" -ForegroundColor Yellow

gcloud builds submit --tag $IMAGE --project=$GCP_PROJECT_ID

# Deploy to Cloud Run using gcloud run deploy
Write-Host ""
Write-Host "Deploying to Cloud Run..." -ForegroundColor Yellow

gcloud run deploy $SERVICE_NAME `
    --image=$IMAGE `
    --region=$GCP_REGION `
    --platform=managed `
    --allow-unauthenticated `
    --service-account=$SERVICE_ACCOUNT `
    --set-secrets="MONGODB_URI=mongodb-uri:latest,WEB_CLIENT_ID=google-oauth:latest,FIREBASE_CREDENTIALS_BASE64=firebase-credentials:latest" `
    --set-env-vars="SPRING_PROFILES_ACTIVE=prod,SERVER_PORT=8080,PORT=8080,MONGODB_DATABASE=finance_tracker" `
    --memory=512Mi `
    --cpu=1 `
    --min-instances=1 `
    --max-instances=10 `
    --timeout=300 `
    --project=$GCP_PROJECT_ID

# Get the service URL
$SERVICE_URL = gcloud run services describe $SERVICE_NAME `
    --region=$GCP_REGION `
    --project=$GCP_PROJECT_ID `
    --format="value(status.url)"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Deployment Successful!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URL: $SERVICE_URL" -ForegroundColor Cyan
Write-Host "Health Check: $SERVICE_URL/finance-tracker/actuator/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Yellow
Write-Host "  gcloud run services logs read $SERVICE_NAME --region=$GCP_REGION"
Write-Host ""
Write-Host "To update the service:" -ForegroundColor Yellow
Write-Host "  .\scripts\deploy-cloudrun.ps1"
Write-Host ""

