#!/bin/bash
# Google Cloud Run Deployment Script for Finance Tracker Backend
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
#   ./scripts/deploy-cloudrun.sh
# 
# Or with environment variables:
#   GCP_PROJECT_ID=my-project GCP_REGION=us-central1 SERVICE_NAME=springboot-api ./scripts/deploy-cloudrun.sh

set -e  # Exit on error

echo "=========================================="
echo "Google Cloud Run Deployment Script"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get configuration from environment variables or prompt
GCP_PROJECT_ID=${GCP_PROJECT_ID:-}
GCP_REGION=${GCP_REGION:-}
SERVICE_NAME=${SERVICE_NAME:-}

if [ -z "$GCP_PROJECT_ID" ]; then
    read -p "Enter GCP Project ID: " GCP_PROJECT_ID
fi

if [ -z "$GCP_REGION" ]; then
    read -p "Enter GCP Region (e.g., us-central1): " GCP_REGION
fi

if [ -z "$SERVICE_NAME" ]; then
    read -p "Enter Service Name (e.g., springboot-api): " SERVICE_NAME
fi

echo ""
echo -e "${GREEN}Configuration:${NC}"
echo "  Project ID: $GCP_PROJECT_ID"
echo "  Region: $GCP_REGION"
echo "  Service Name: $SERVICE_NAME"
echo ""

# Set the project
echo "Setting GCP project..."
gcloud config set project "$GCP_PROJECT_ID"

# Enable required APIs
echo ""
echo "Enabling required APIs..."
gcloud services enable run.googleapis.com --project="$GCP_PROJECT_ID"
gcloud services enable cloudbuild.googleapis.com --project="$GCP_PROJECT_ID"
gcloud services enable artifactregistry.googleapis.com --project="$GCP_PROJECT_ID"
gcloud services enable secretmanager.googleapis.com --project="$GCP_PROJECT_ID"

# Check if secrets exist, create if not
echo ""
echo "Checking secrets in Secret Manager..."

# MongoDB URI secret
if ! gcloud secrets describe mongodb-uri --project="$GCP_PROJECT_ID" &> /dev/null; then
    echo -e "${YELLOW}Secret 'mongodb-uri' not found. Creating...${NC}"
    echo "Please enter your MongoDB URI:"
    read -s MONGODB_URI
    echo -n "$MONGODB_URI" | gcloud secrets create mongodb-uri \
        --data-file=- \
        --project="$GCP_PROJECT_ID" \
        --replication-policy="automatic"
    echo -e "${GREEN}Secret 'mongodb-uri' created${NC}"
else
    echo -e "${GREEN}Secret 'mongodb-uri' exists${NC}"
fi

# Firebase credentials secret
if ! gcloud secrets describe firebase-credentials --project="$GCP_PROJECT_ID" &> /dev/null; then
    echo -e "${YELLOW}Secret 'firebase-credentials' not found. Creating...${NC}"
    echo "Please enter your Firebase credentials (Base64 encoded):"
    read -s FIREBASE_CREDENTIALS
    echo -n "$FIREBASE_CREDENTIALS" | gcloud secrets create firebase-credentials \
        --data-file=- \
        --project="$GCP_PROJECT_ID" \
        --replication-policy="automatic"
    echo -e "${GREEN}Secret 'firebase-credentials' created${NC}"
else
    echo -e "${GREEN}Secret 'firebase-credentials' exists${NC}"
fi

# Google OAuth client ID secret
if ! gcloud secrets describe google-oauth --project="$GCP_PROJECT_ID" &> /dev/null; then
    echo -e "${YELLOW}Secret 'google-oauth' not found. Creating...${NC}"
    echo "Please enter your Google OAuth Client ID:"
    read -s WEB_CLIENT_ID
    echo -n "$WEB_CLIENT_ID" | gcloud secrets create google-oauth \
        --data-file=- \
        --project="$GCP_PROJECT_ID" \
        --replication-policy="automatic"
    echo -e "${GREEN}Secret 'google-oauth' created${NC}"
else
    echo -e "${GREEN}Secret 'google-oauth' exists${NC}"
fi

# Grant Cloud Run service account access to secrets
echo ""
echo "Granting Cloud Run service account access to secrets..."

# Get or create service account
SERVICE_ACCOUNT="${SERVICE_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com"
if ! gcloud iam service-accounts describe "$SERVICE_ACCOUNT" --project="$GCP_PROJECT_ID" &> /dev/null; then
    echo "Creating service account: $SERVICE_ACCOUNT"
    gcloud iam service-accounts create "$SERVICE_NAME" \
        --display-name="Finance Tracker Service Account" \
        --project="$GCP_PROJECT_ID"
fi

# Grant secret accessor role
gcloud secrets add-iam-policy-binding mongodb-uri \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor" \
    --project="$GCP_PROJECT_ID"

gcloud secrets add-iam-policy-binding firebase-credentials \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor" \
    --project="$GCP_PROJECT_ID"

gcloud secrets add-iam-policy-binding google-oauth \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor" \
    --project="$GCP_PROJECT_ID"

# Build and push Docker image
echo ""
echo "Building Docker image..."
cd "$(dirname "$0")/.." || exit 1

# Create Artifact Registry repository if it doesn't exist
REPO_NAME="${SERVICE_NAME}"
if ! gcloud artifacts repositories describe "$REPO_NAME" --location="$GCP_REGION" --project="$GCP_PROJECT_ID" &> /dev/null; then
    echo "Creating Artifact Registry repository..."
    gcloud artifacts repositories create "$REPO_NAME" \
        --repository-format=docker \
        --location="$GCP_REGION" \
        --description="Finance Tracker Docker images" \
        --project="$GCP_PROJECT_ID"
fi

# Build and push using Cloud Build
IMAGE="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"
echo "Building and pushing image: $IMAGE"

gcloud builds submit --tag "$IMAGE" --project="$GCP_PROJECT_ID"

# Deploy to Cloud Run
echo ""
echo "Deploying to Cloud Run..."

# Substitute variables in the YAML file
sed "s/\${GCP_PROJECT_ID}/$GCP_PROJECT_ID/g; s/\${GCP_REGION}/$GCP_REGION/g; s/\${SERVICE_NAME}/$SERVICE_NAME/g" \
    ../../deploy-cloudrun.yaml > /tmp/cloudrun-deploy.yaml

gcloud run services replace /tmp/cloudrun-deploy.yaml \
    --region="$GCP_REGION" \
    --project="$GCP_PROJECT_ID"

# Or use gcloud run deploy directly
# gcloud run deploy "$SERVICE_NAME" \
#     --image="$IMAGE" \
#     --region="$GCP_REGION" \
#     --platform=managed \
#     --allow-unauthenticated \
#     --service-account="$SERVICE_ACCOUNT" \
#     --set-secrets="MONGODB_URI=mongodb-uri:latest,WEB_CLIENT_ID=google-oauth:latest,FIREBASE_CREDENTIALS_BASE64=firebase-credentials:latest" \
#     --set-env-vars="SPRING_PROFILES_ACTIVE=prod,SERVER_PORT=8080,PORT=8080" \
#     --memory=512Mi \
#     --cpu=1 \
#     --min-instances=1 \
#     --max-instances=10 \
#     --timeout=300 \
#     --project="$GCP_PROJECT_ID"

# Get the service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --region="$GCP_REGION" \
    --project="$GCP_PROJECT_ID" \
    --format="value(status.url)")

echo ""
echo -e "${GREEN}=========================================="
echo "Deployment Successful!"
echo "==========================================${NC}"
echo ""
echo "Service URL: $SERVICE_URL"
echo "Health Check: $SERVICE_URL/finance-tracker/actuator/health"
echo ""
echo "To view logs:"
echo "  gcloud run services logs read $SERVICE_NAME --region=$GCP_REGION"
echo ""
echo "To update the service:"
echo "  ./scripts/deploy-cloudrun.sh"
echo ""

