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

## Deployment on Render

### Prerequisites

1. GitHub repository with your code
2. Render account (sign up at https://render.com)
3. MongoDB Atlas database (or other MongoDB instance)

### Deployment Steps

1. **Connect Repository to Render:**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

2. **Configure Service:**
   - **Name:** finance-tracker-backend
   - **Environment:** Docker
   - **Dockerfile Path:** `./backend/Dockerfile`
   - **Docker Context:** `./backend`
   - **Plan:** Free (or upgrade for production)

3. **Set Environment Variables in Render Dashboard:**
   ```
   SPRING_PROFILES_ACTIVE=prod
   MONGODB_URI=your-mongodb-connection-string
   MONGODB_DATABASE=finance_tracker
   SERVER_PORT=8080
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Monitor the build logs

5. **Health Check:**
   - Render automatically checks: `/finance-tracker/actuator/health`
   - Service will be marked healthy when health endpoint returns 200

### Using render.yaml (Blueprint)

Alternatively, use the `render.yaml` file for Infrastructure as Code:

1. **Commit render.yaml to your repository** (already included)
2. **In Render Dashboard:**
   - Go to "New +" → "Blueprint"
   - Connect your repository
   - Render will detect `render.yaml` and create services automatically

### Render Environment Variables

Required environment variables in Render:

| Variable | Description | Example |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Spring profile | `prod` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `MONGODB_DATABASE` | Database name | `finance_tracker` |
| `SERVER_PORT` | Server port (optional, defaults to 8080) | `8080` |

**Note:** Render automatically sets `PORT` environment variable. The application is configured to use `SERVER_PORT` first, then fallback to `PORT`.

### Render Deployment Features

- **Auto-deploy:** Automatically deploys on git push to main branch
- **Health Checks:** Automatic health monitoring
- **Logs:** View application logs in Render dashboard
- **Metrics:** Monitor application performance
- **SSL:** Automatic HTTPS/SSL certificates
- **Custom Domain:** Add your custom domain

### Troubleshooting Render Deployment

1. **Build Fails:**
   - Check Dockerfile path and context
   - Verify all required files are in repository
   - Check build logs in Render dashboard

2. **Application Won't Start:**
   - Verify environment variables are set correctly
   - Check MongoDB connection string
   - Review application logs

3. **Health Check Fails:**
   - Verify actuator endpoints are enabled
   - Check if application is listening on correct port
   - Ensure MongoDB is accessible

## Building for Production

### Create JAR File

```bash
./gradlew bootJar
```

The JAR file will be created at: `build/libs/finance-tracker-1.0.0.jar`

### Run Production JAR

```bash
java -jar build/libs/finance-tracker-1.0.0.jar
```

## Environment Variables Setup

### Required Environment Variables for Production

The production profile **requires** the following environment variables (no hardcoded fallbacks for security):

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | **Yes** | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority` |
| `SPRING_PROFILES_ACTIVE` | **Yes** | Spring profile to activate | `prod` |
| `MONGODB_DATABASE` | No | Database name (defaults to `finance_tracker`) | `finance_tracker` |
| `SERVER_PORT` | No | Server port (defaults to `8080`) | `8080` |

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
