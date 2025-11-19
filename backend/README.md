# Finance Tracker - Backend API

Spring Boot REST API for the Finance Tracker application. Built with Java 17, Spring Boot 3.2.0, and MongoDB.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Project Structure](#project-structure)
- [Building for Production](#building-for-production)

## Prerequisites

- **Java 17** or higher
- **MongoDB** (running locally or accessible via connection string)
- **Gradle** (optional - wrapper is included)

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Finance-Tracker/backend
```

### 2. Configure Profiles

The application uses Spring profiles for different environments:

- **dev** (default) - Local development with local MongoDB
- **prod** - Production with MongoDB Atlas

#### Development Profile (Default)

The `application-dev.properties` is configured for local development:
- Uses local MongoDB: `mongodb://localhost:27017/finance_tracker`
- More verbose logging
- DevTools enabled

No configuration needed - it's the default profile.

#### Production Profile

The `application-prod.properties` is configured for production:
- **REQUIRES** MongoDB Atlas connection string via `MONGODB_URI` environment variable
- Production logging levels
- DevTools disabled

**Setup Production Environment Variables:**

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your MongoDB Atlas credentials:
   ```bash
   SPRING_PROFILES_ACTIVE=prod
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   MONGODB_DATABASE=finance_tracker
   ```

3. Load environment variables and run:

   **Linux/Mac:**
   ```bash
   source scripts/setup-env.sh
   ./gradlew bootRun
   ```

   **Windows PowerShell:**
   ```powershell
   .\scripts\setup-env.ps1
   .\gradlew.bat bootRun
   ```

   **Windows CMD:**
   ```cmd
   scripts\setup-env.bat
   gradlew.bat bootRun
   ```

**Alternative: Manual Environment Variable Setup**

```bash
# Linux/Mac
export SPRING_PROFILES_ACTIVE=prod
export MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
export MONGODB_DATABASE=finance_tracker
./gradlew bootRun

# Windows PowerShell
$env:SPRING_PROFILES_ACTIVE="prod"
$env:MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
$env:MONGODB_DATABASE="finance_tracker"
.\gradlew.bat bootRun

# Windows CMD
set SPRING_PROFILES_ACTIVE=prod
set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
set MONGODB_DATABASE=finance_tracker
gradlew.bat bootRun
```

**Security Note:** The `.env` file is excluded from version control. Never commit credentials to the repository.

### 3. Build the Project

Using Gradle wrapper (recommended):
```bash
# Linux/Mac
./gradlew build

# Windows
gradlew.bat build
```

Or using installed Gradle:
```bash
gradle build
```

## Configuration

### Application Properties

#### Common Configuration (`application.properties`)

```properties
# Spring Profile Configuration
spring.profiles.active=${SPRING_PROFILES_ACTIVE:dev}

# Application Properties
spring.application.name=finance-tracker

# Server Configuration
server.port=8080
server.servlet.context-path=/finance-tracker

# Mongock Configuration (Database Migrations)
mongock.migration-scan-package=com.finance.tracker.currency.changelog
```

#### Development Profile (`application-dev.properties`)

```properties
# MongoDB Configuration - Local Development
spring.data.mongodb.uri=mongodb://localhost:27017/finance_tracker
spring.data.mongodb.database=finance_tracker

# Verbose logging for development
logging.level.com.finance.tracker=DEBUG
```

#### Production Profile (`application-prod.properties`)

```properties
# MongoDB Configuration - Production (MongoDB Atlas)
# REQUIRED: Set MONGODB_URI environment variable
spring.data.mongodb.uri=${MONGODB_URI}
spring.data.mongodb.database=${MONGODB_DATABASE:finance_tracker}

# Production logging
logging.level.com.finance.tracker=INFO
```

**Security:** All sensitive values are stored as environment variables. See [Environment Variables Setup](#environment-variables-setup) section below.

### CORS Configuration

CORS is configured in `CorsConfig.java` to allow cross-origin requests. In production, restrict this to your frontend domain.

## Running the Application

### Development Mode

```bash
# Using Gradle wrapper
./gradlew bootRun

# Windows
gradlew.bat bootRun
```

The API will be available at: `http://localhost:8080/finance-tracker`

### Run JAR File

After building, run the generated JAR:

**Development:**
```bash
java -jar build/libs/finance-tracker-1.0.0.jar
```

**Production:**
```bash
# Using command line argument
java -jar build/libs/finance-tracker-1.0.0.jar --spring.profiles.active=prod

# Using environment variable
export SPRING_PROFILES_ACTIVE=prod
java -jar build/libs/finance-tracker-1.0.0.jar

# With MongoDB URI from environment variable
export MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
export SPRING_PROFILES_ACTIVE=prod
java -jar build/libs/finance-tracker-1.0.0.jar
```

## API Endpoints

All endpoints are prefixed with: `http://localhost:8080/finance-tracker/api/v1`

### Authentication

#### Login
- **POST** `/api/v1/auth/login`
- **Request Body:**
  ```json
  {
    "phoneNumber": "1234567890"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "userId": "user-id",
      "phoneNumber": "1234567890"
    }
  }
  ```

### Transactions

#### Get All Transactions
- **GET** `/api/v1/transactions?userId={userId}&page={page}&size={size}`
- **Query Parameters:**
  - `userId` (required) - User identifier
  - `page` (optional, default: 0) - Page number
  - `size` (optional, default: 10) - Page size
- **Response:** Paginated list of transactions

#### Get Transaction by ID
- **GET** `/api/v1/transactions/{id}?userId={userId}`
- **Response:** Single transaction object

#### Create Transaction
- **POST** `/api/v1/transactions`
- **Request Body:**
  ```json
  {
    "userId": "user-id",
    "amount": 100.50,
    "description": "Grocery shopping",
    "category": "Food",
    "transactionType": "EXPENSE",
    "date": "2024-01-15T10:30:00"
  }
  ```
- **Transaction Types:** `EXPENSE`, `INCOME`

#### Update Transaction
- **PUT** `/api/v1/transactions/{id}?userId={userId}`
- **Request Body:** Same as create transaction

#### Delete Transaction
- **DELETE** `/api/v1/transactions/{id}?userId={userId}`
- **Response:** Deleted transaction object

### Dashboard

#### Get Dashboard Summary
- **GET** `/api/v1/dashboard/summary?userId={userId}&page={page}&size={size}`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalIncome": 5000.00,
      "totalExpense": 3000.00,
      "balance": 2000.00,
      "transactionCount": 25,
      "recentTransactions": [...]
    }
  }
  ```

### User Profile

#### Get User Profile
- **GET** `/api/v1/user-profile?userId={userId}`
- **Response:** User profile with currency preferences

#### Update User Profile
- **PUT** `/api/v1/user-profile?userId={userId}`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "currencyCode": "USD"
  }
  ```

### Currencies

#### Get All Currencies
- **GET** `/api/v1/currencies`
- **Response:** List of active currencies

## Database

### MongoDB Collections

- **users** - User accounts and profiles
- **financial_transactions** - All financial transactions
- **currencies** - Available currencies (populated via Mongock migrations)

### Transaction Document Structure

```json
{
  "id": "transaction-id",
  "userId": "user-id",
  "amount": 100.50,
  "description": "Grocery shopping",
  "category": "Food",
  "transactionType": "EXPENSE",
  "date": "2024-01-15T10:30:00",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/finance/tracker/
│   │   │   ├── auth/              # Authentication controllers
│   │   │   ├── common/            # Common DTOs, exceptions, utilities
│   │   │   ├── config/            # Configuration classes (CORS, Mongock)
│   │   │   ├── currency/          # Currency management
│   │   │   ├── dashboard/         # Dashboard services
│   │   │   ├── transaction/       # Transaction management
│   │   │   └── user/              # User and profile management
│   │   └── resources/
│   │       └── application.properties
│   └── test/                      # Test files
├── build.gradle                   # Gradle build configuration
├── settings.gradle                # Gradle settings
└── gradlew                        # Gradle wrapper
```

## Docker Deployment

### Building Docker Image

Build the Docker image:

```bash
cd backend
docker build -t finance-tracker:latest .
```

### Running Docker Container

Run the container locally:

```bash
# Set environment variables
export MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
export SPRING_PROFILES_ACTIVE=prod

# Run container
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e MONGODB_URI="$MONGODB_URI" \
  -e MONGODB_DATABASE=finance_tracker \
  finance-tracker:latest
```

Or use docker-compose (if created):

```bash
docker-compose up
```

### Docker Image Details

- **Base Image:** `eclipse-temurin:17-jre-alpine` (lightweight JRE)
- **Build Tool:** Multi-stage build with Gradle
- **Port:** 8080 (configurable via PORT or SERVER_PORT environment variable)
- **Health Check:** `/finance-tracker/actuator/health`
- **User:** Non-root user for security

## Local Development with Docker Compose

For local development with MongoDB, use the included `docker-compose.yml`:

```bash
cd backend
docker-compose up
```

This will start:
- **MongoDB** on port 27017
- **Backend API** on port 8080

The backend will automatically connect to the MongoDB container. Environment variables are configured in `docker-compose.yml` for development.

To stop:
```bash
docker-compose down
```

To rebuild and restart:
```bash
docker-compose up --build
```

## Building for Production

### Create JAR File

```bash
./gradlew bootJar
```

The JAR file will be created at: `build/libs/app.jar`

### Run Production JAR

```bash
java -jar build/libs/app.jar
```

## Running Locally with Gradle

### Build and Run

```bash
# Build the application
./gradlew build

# Run the application
./gradlew bootRun
```

On Windows:
```bash
gradlew.bat build
gradlew.bat bootRun
```

The application will be available at `http://localhost:8080/finance-tracker`

## Deployment to Google Cloud Run

This project is configured for automated deployment to Google Cloud Run using GitHub Actions.

### CI/CD Flow

1. **Push to main branch** triggers GitHub Actions workflow (`.github/workflows/deploy.yaml`)
2. **GitHub Actions** authenticates with GCP using service account
3. **Docker image** is built using the Dockerfile
4. **Image is pushed** to Artifact Registry
5. **Cloud Run** automatically deploys the new version with environment variables

### Prerequisites

Before deploying, complete the GCP setup:

1. **Follow the [GCP Setup Guide](../GCP_SETUP.md)** for complete setup instructions
2. **Configure GitHub Secrets and Variables** as described in [Backend Deployment Setup](../.github/BACKEND_DEPLOY_SETUP.md)

### Quick Setup Summary

1. **Enable Required APIs:**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   ```

2. **Create Artifact Registry Repository:**
   ```bash
   gcloud artifacts repositories create finance-tracker \
     --repository-format=docker \
     --location=asia-south1 \
     --description="Docker repository for Finance Tracker backend"
   ```

3. **Create Service Account:**
   ```bash
   gcloud iam service-accounts create github-cd \
     --display-name="GitHub Actions CI/CD Service Account"
   ```

4. **Grant Required Permissions:**
   ```bash
   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member="serviceAccount:github-cd@PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   
   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member="serviceAccount:github-cd@PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/artifactregistry.writer"
   ```

5. **Create Service Account Key:**
   ```bash
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-cd@PROJECT_ID.iam.gserviceaccount.com
   ```

6. **Configure GitHub Secrets and Variables:**
   - See [Backend Deployment Setup](../.github/BACKEND_DEPLOY_SETUP.md) for detailed instructions
   - Required secrets: `GCP_SA_KEY`, `MONGODB_URI`, `FIREBASE_CREDENTIALS_BASE64`
   - Required variables: `SERVICE_NAME`, `REGION`, `REPO`, `GCP_PROJECT_ID`, `SPRING_PROFILES_ACTIVE`, `MONGODB_DATABASE`, `WEB_CLIENT_ID`

### Manual Deployment using gcloud CLI

For manual deployment without GitHub Actions:

#### Prerequisites

1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Authenticate:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

#### Build and Deploy

1. **Build Docker image:**
   ```bash
   cd backend
   docker build -f DockerFile -t ${REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${REPO}/${SERVICE_NAME} .
   ```

2. **Authenticate Docker with Artifact Registry:**
   ```bash
   gcloud auth configure-docker ${REGION}-docker.pkg.dev
   ```

3. **Push to Artifact Registry:**
   ```bash
   docker push ${REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${REPO}/${SERVICE_NAME}
   ```

4. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy ${SERVICE_NAME} \
     --image ${REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${REPO}/${SERVICE_NAME} \
     --region ${REGION} \
     --platform managed \
     --allow-unauthenticated \
     --set-env-vars SPRING_PROFILES_ACTIVE=prod \
     --set-env-vars MONGODB_URI=your-mongodb-uri \
     --set-env-vars MONGODB_DATABASE=finance_tracker \
     --set-env-vars FIREBASE_CREDENTIALS_BASE64=your-base64-encoded-credentials \
     --set-env-vars WEB_CLIENT_ID=your-google-client-id
   ```

Replace variables:
- `${REGION}` - Your GCP region (e.g., `asia-south1`)
- `${GCP_PROJECT_ID}` - Your GCP project ID
- `${REPO}` - Artifact Registry repository name (e.g., `finance-tracker`)
- `${SERVICE_NAME}` - Cloud Run service name (e.g., `backend`)

### Cloud Run Configuration

The deployment uses the following configuration (set via GitHub Variables):

- **Service Name:** Configured via `SERVICE_NAME` variable (e.g., `backend`)
- **Region:** Configured via `REGION` variable (e.g., `asia-south1`)
- **Platform:** `managed`
- **Runtime:** Java 17 (via Dockerfile)
- **Port:** 8080
- **Artifact Registry:** `${REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${REPO}/${SERVICE_NAME}`

### Environment Variables in Cloud Run

Set the following environment variables in Cloud Run:

```bash
gcloud run services update finance-service \
  --region asia-south1 \
  --set-env-vars SPRING_PROFILES_ACTIVE=prod \
  --set-env-vars MONGODB_URI=your-mongodb-connection-string \
  --set-env-vars MONGODB_DATABASE=finance_tracker \
  --set-env-vars FIREBASE_CREDENTIALS_BASE64=your-base64-encoded-credentials \
  --set-env-vars WEB_CLIENT_ID=your-google-client-id
```

Or set them during initial deployment:

```bash
gcloud run deploy finance-service \
  --image asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/auto/finance-service:latest \
  --region asia-south1 \
  --platform managed \
  --set-env-vars SPRING_PROFILES_ACTIVE=prod \
  --set-env-vars MONGODB_URI=your-mongodb-uri \
  --set-env-vars MONGODB_DATABASE=finance_tracker \
  --set-env-vars FIREBASE_CREDENTIALS_BASE64=your-base64-encoded-credentials \
  --set-env-vars WEB_CLIENT_ID=your-google-client-id
```

### Viewing Build and Runtime Logs

#### GitHub Actions Build Logs

- Go to your GitHub repository
- Navigate to **Actions** tab
- Click on the workflow run to see detailed build and deployment logs
- Each step shows verbose output including:
  - Docker build progress
  - Image push to Artifact Registry
  - Cloud Run deployment status

#### Runtime Logs (Cloud Run)

View Cloud Run application logs:
```bash
# Stream logs in real-time
gcloud run services logs tail finance-service --region asia-south1

# View recent logs
gcloud run services logs read finance-service --region asia-south1 --limit 100

# View logs with specific format
gcloud run services logs read finance-service \
  --region asia-south1 \
  --limit 50 \
  --format="table(timestamp,severity,textPayload)"
```

Or view in Google Cloud Console:
- Navigate to **Cloud Run** → Select your service → **Logs** tab

#### Debugging Build Issues

If build fails, check:
1. **Docker Build Logs**: Check Dockerfile execution in GitHub Actions logs
2. **Artifact Registry Push**: Verify image push succeeded
3. **Cloud Run Deployment**: Verify service deployment in the "Deploy to Cloud Run" step
4. **Application Startup**: Check Cloud Run logs for runtime errors
5. **Environment Variables**: Verify all required environment variables are set in GitHub Variables/Secrets
6. **Service Account Permissions**: Ensure service account has required IAM roles

### Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/...          # Spring Boot application source
│   │   └── resources/
│   │       └── application.properties
├── build.gradle              # Gradle build configuration (Java 17, Spring Boot)
├── settings.gradle           # Gradle settings
├── Dockerfile                # Multi-stage Docker build (Gradle + JDK)
├── docker-compose.yml        # Docker Compose for local development
└── .dockerignore             # Docker ignore patterns
```

## Environment Variables Setup

### Required Environment Variables for Production

The production profile **requires** the following environment variables (no hardcoded fallbacks for security):

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | **Yes** | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority` |
| `FIREBASE_CREDENTIALS_BASE64` | **Yes** | Base64 encoded Firebase service account JSON | `ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIs...` |
| `WEB_CLIENT_ID` | **Yes** | Google OAuth client ID | `1058479237538-xxx.apps.googleusercontent.com` |
| `SPRING_PROFILES_ACTIVE` | **Yes** | Spring profile to activate | `prod` |

### Optional Environment Variables (with defaults)

| Variable | Default | Description | Example |
|----------|---------|-------------|---------|
| `MONGODB_DATABASE` | `finance_tracker` | Database name | `finance_tracker` |
| `SERVER_PORT` or `PORT` | `8080` | Server port | `8080` |
| `MONGODB_MIN_POOL_SIZE` | `10` | Minimum MongoDB connection pool size | `10` |
| `MONGODB_MAX_POOL_SIZE` | `100` | Maximum MongoDB connection pool size | `100` |
| `MONGODB_CONNECT_TIMEOUT_MS` | `60000` | MongoDB connection timeout (ms) | `60000` |
| `MONGODB_SOCKET_TIMEOUT_MS` | `60000` | MongoDB socket timeout (ms) | `60000` |
| `MONGODB_SERVER_SELECTION_TIMEOUT_MS` | `30000` | MongoDB server selection timeout (ms) | `30000` |
| `MONGODB_MAX_WAIT_TIME_MS` | `30000` | Maximum wait time for connection (ms) | `30000` |
| `MONGODB_MAX_CONNECTION_IDLE_TIME_MS` | `600000` | Maximum idle time for connection (ms) | `600000` |
| `MONGODB_SSL_ENABLED` | `true` | Enable SSL for MongoDB | `true` |
| `LOG_LEVEL_ROOT` | `WARN` | Root logging level | `WARN`, `INFO`, `DEBUG` |
| `LOG_LEVEL_APP` | `INFO` | Application logging level | `INFO`, `DEBUG` |
| `LOG_LEVEL_WEB` | `WARN` | Web layer logging level | `WARN`, `DEBUG` |
| `LOG_LEVEL_MONGODB` | `WARN` | MongoDB logging level | `WARN`, `DEBUG` |
| `MONGOCK_ENABLED` | `true` | Enable Mongock migrations | `true` |
| `DEVTOOLS_ENABLED` | `false` | Enable Spring Boot DevTools | `false` |
| `ACTUATOR_ENDPOINTS` | `health,info,metrics,prometheus` | Comma-separated actuator endpoints | `health,info,metrics` |
| `ACTUATOR_HEALTH_DETAILS` | `when-authorized` | Health endpoint details | `always`, `when-authorized`, `never` |
| `ACTUATOR_PROMETHEUS_ENABLED` | `true` | Enable Prometheus metrics | `true` |

### Development Profile Environment Variables

The development profile supports the same environment variables but with different defaults optimized for local development. All values can be overridden via environment variables.

### Setup Using .env File (Recommended)

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual credentials:**
   ```bash
   SPRING_PROFILES_ACTIVE=prod
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority
   MONGODB_DATABASE=finance_tracker
   ```

3. **Load environment variables:**

   **Linux/Mac:**
   ```bash
   source scripts/setup-env.sh
   ```

   **Windows PowerShell:**
   ```powershell
   .\scripts\setup-env.ps1
   ```

   **Windows CMD:**
   ```cmd
   scripts\setup-env.bat
   ```

### Manual Environment Variable Setup

**Linux/Mac:**
```bash
export SPRING_PROFILES_ACTIVE=prod
export MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
export MONGODB_DATABASE=finance_tracker
```

**Windows PowerShell:**
```powershell
$env:SPRING_PROFILES_ACTIVE="prod"
$env:MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
$env:MONGODB_DATABASE="finance_tracker"
```

**Windows CMD:**
```cmd
set SPRING_PROFILES_ACTIVE=prod
set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
set MONGODB_DATABASE=finance_tracker
```

### Security Best Practices

- ✅ **Never commit `.env` file** to version control (already in `.gitignore`)
- ✅ **Use environment variables** for all sensitive data (no hardcoded credentials)
- ✅ **Rotate credentials** regularly
- ✅ **Use different credentials** for dev/staging/production
- ✅ **Limit database access** to specific IP addresses in MongoDB Atlas
- ✅ **Use MongoDB Atlas network access controls** for additional security
- ✅ **Never share credentials** in code, documentation, or commit messages

## Monitoring and Health Checks

### Spring Boot Actuator

The application includes Spring Boot Actuator for monitoring and health checks.

#### Available Endpoints

**Development:**
- All endpoints are exposed for debugging
- Health details are always shown

**Production:**
- Health: `/actuator/health` - Application health status
- Info: `/actuator/info` - Application information
- Metrics: `/actuator/metrics` - Application metrics
- Prometheus: `/actuator/prometheus` - Prometheus metrics export

#### Access Endpoints

```bash
# Health check
curl http://localhost:8080/finance-tracker/actuator/health

# Metrics
curl http://localhost:8080/finance-tracker/actuator/metrics

# Prometheus metrics (production)
curl http://localhost:8080/finance-tracker/actuator/prometheus
```

#### Security Considerations

- **Development:** All endpoints are exposed for debugging purposes
- **Production:** Only essential endpoints (health, info, metrics, prometheus) are exposed
- Health details are shown only when authorized
- Sensitive endpoints (env, configprops, beans) are excluded by default in production

## Development

### Running Tests

```bash
./gradlew test
```

### Code Style

The project uses Lombok for reducing boilerplate code and follows Spring Boot best practices.

## Troubleshooting

### MongoDB Connection Issues

1. Ensure MongoDB is running:
   ```bash
   mongod
   ```

2. For production: Check that `MONGODB_URI` environment variable is set correctly
   ```bash
   echo $MONGODB_URI  # Linux/Mac
   echo %MONGODB_URI%  # Windows CMD
   $env:MONGODB_URI    # Windows PowerShell
   ```

3. For development: Verify MongoDB is accessible on the configured port (default: 27017)
   ```bash
   mongod
   ```

4. Check that the correct Spring profile is active:
   ```bash
   echo $SPRING_PROFILES_ACTIVE  # Linux/Mac
   ```

### Port Already in Use

Change the server port in `application.properties`:
```properties
server.port=8081
```

### Build Issues

Clean and rebuild:
```bash
./gradlew clean build
```

## License

This project is for personal/educational use.
