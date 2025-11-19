# Finance Tracker

A full-stack personal expense tracking application built with Spring Boot and React TypeScript.

## Project Structure

```
Finance-Tracker/
├── backend/          # Spring Boot REST API (Deployed to GCP Cloud Run)
├── react_frontend/   # React TypeScript Web Application (Deployed to Firebase Hosting)
└── .github/
    └── workflows/    # GitHub Actions CI/CD workflows
```

## Features

- 🔐 **User Authentication** - Phone number based login system
- 💰 **Transaction Management** - Create, read, update, and delete financial transactions
- 📊 **Dashboard** - View expense summaries and statistics
- 👤 **User Profile** - Manage user details and currency preferences
- 💱 **Multi-Currency Support** - Support for multiple currencies
- 📱 **Responsive Design** - Modern and intuitive user interface

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- MongoDB
- Gradle
- Spring Data MongoDB
- Mongock (Database migrations)

### Frontend
- React 18.2.0
- TypeScript 4.9.5
- React Router DOM
- Axios
- React DatePicker
- Lucide React (Icons)

## Prerequisites

- Java 17 or higher
- Node.js 14+ and npm
- MongoDB (running locally or accessible)
- Gradle (optional, wrapper included)

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure MongoDB connection in `src/main/resources/application.properties`

3. Build and run:
   ```bash
   ./gradlew build
   ./gradlew bootRun
   ```

   On Windows:
   ```bash
   gradlew.bat build
   gradlew.bat bootRun
   ```

4. Backend API will be available at `http://localhost:8080/finance-tracker`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd react_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Frontend will be available at `http://localhost:3000`

## Deployment

This project uses automated CI/CD deployment with GitHub Actions:

- **Backend:** Deployed to **Google Cloud Run** (GCP) via GitHub Actions
- **Frontend:** Deployed to **Firebase Hosting** via GitHub Actions

### Automated Deployment

Both backend and frontend deployments are automated through GitHub Actions workflows:

- **Backend Deployment:** Triggered on push to `main` branch → Builds Docker image → Deploys to Cloud Run
- **Frontend Deployment:** Triggered on push to `main` branch when `react_frontend/` changes → Builds React app → Deploys to Firebase Hosting

### Prerequisites

1. **Google Cloud Platform (GCP) Setup:**
   - GCP project with billing enabled
   - Artifact Registry repository for Docker images
   - Cloud Run API enabled
   - Service account with required permissions
   - See [GCP Setup Guide](GCP_SETUP.md) for detailed instructions

2. **Firebase Setup:**
   - Firebase project created
   - Firebase Hosting enabled
   - Service account key for CI/CD
   - See [Firebase Setup Guide](.github/FIREBASE_SETUP.md) for detailed instructions

3. **GitHub Configuration:**
   - Repository secrets configured (see below)
   - Repository variables configured (see below)

### GitHub Secrets and Variables

#### Backend (GCP) Configuration

**Secrets:**
- `GCP_SA_KEY` - GCP Service Account JSON key
- `MONGODB_URI` - MongoDB connection string
- `FIREBASE_CREDENTIALS_BASE64` - Base64 encoded Firebase credentials

**Variables:**
- `SERVICE_NAME` - Cloud Run service name (e.g., `backend`)
- `REGION` - GCP region (e.g., `asia-south1`)
- `REPO` - Artifact Registry repository name (e.g., `finance-tracker`)
- `GCP_PROJECT_ID` - Google Cloud Project ID
- `SPRING_PROFILES_ACTIVE` - Spring profile (e.g., `prod`)
- `MONGODB_DATABASE` - MongoDB database name
- `WEB_CLIENT_ID` - Firebase Web Client ID

See [Backend Deployment Setup](.github/BACKEND_DEPLOY_SETUP.md) for detailed configuration instructions.

#### Frontend (Firebase) Configuration

**Secrets:**
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase service account JSON key

**Variables:**
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `REACT_APP_FIREBASE_API_KEY` - Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID` - Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID` - Firebase app ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID (optional)
- `REACT_APP_API_BASE_URL` - Backend API base URL

See [Firebase Setup Guide](.github/FIREBASE_SETUP.md) for detailed configuration instructions.

### Deployment Workflow

1. **Initial Setup:**
   - Complete GCP setup (see [GCP_SETUP.md](GCP_SETUP.md))
   - Complete Firebase setup (see [.github/FIREBASE_SETUP.md](.github/FIREBASE_SETUP.md))
   - Configure GitHub secrets and variables

2. **Automatic Deployment:**
   - Push code to `main` branch
   - Backend workflow builds Docker image and deploys to Cloud Run
   - Frontend workflow builds React app and deploys to Firebase Hosting

3. **Manual Deployment:**
   - Backend: Trigger workflow manually from GitHub Actions
   - Frontend: Trigger workflow manually or push changes to `react_frontend/` directory

### Detailed Deployment Guides

- [GCP Setup Guide](GCP_SETUP.md) - Complete GCP and Cloud Run setup instructions
- [Backend Deployment Setup](.github/BACKEND_DEPLOY_SETUP.md) - GitHub Actions configuration for backend
- [Firebase Setup Guide](.github/FIREBASE_SETUP.md) - Firebase Hosting setup and GitHub Actions configuration
- [Backend README](backend/README.md) - Backend API documentation and local development
- [Frontend README](react_frontend/README.md) - Frontend application documentation and local development

### Important Notes

1. **Backend First:** Deploy backend first, then use its Cloud Run URL for frontend `REACT_APP_API_BASE_URL`
2. **Environment Variables:** All sensitive data should be stored in GitHub Secrets, not committed to the repository
3. **MongoDB Atlas:** Configure network access to allow connections from Cloud Run
4. **CORS:** Backend CORS configuration allows requests from Firebase Hosting domain
5. **Build Time:** Frontend environment variables are embedded at build time, so changes require a rebuild

## Documentation

- [Backend README](backend/README.md) - Backend API documentation and GCP deployment guide
- [Frontend README](react_frontend/README.md) - Frontend application documentation and Firebase deployment guide
- [GCP Setup Guide](GCP_SETUP.md) - Complete GCP and Cloud Run setup instructions
- [Backend Deployment Setup](.github/BACKEND_DEPLOY_SETUP.md) - GitHub Actions configuration for backend
- [Firebase Setup Guide](.github/FIREBASE_SETUP.md) - Firebase Hosting setup and GitHub Actions configuration

## License

This project is for personal/educational use.

