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

### 2. Configure MongoDB

Update the MongoDB connection string in `src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/finance_tracker
spring.data.mongodb.database=finance_tracker
```

For remote MongoDB:
```properties
spring.data.mongodb.uri=mongodb://username:password@host:port/finance_tracker
```

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

The main configuration file is located at `src/main/resources/application.properties`:

```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/finance_tracker
spring.data.mongodb.database=finance_tracker

# Server Configuration
server.port=8080
server.servlet.context-path=/finance-tracker

# Application Properties
spring.application.name=financialTransaction-tracker

# Mongock Configuration (Database Migrations)
mongock.migration-scan-package=com.finance.tracker.currency.changelog
```

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
```bash
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

### Environment Variables

For production, use environment variables or externalized configuration:

```bash
export SPRING_DATA_MONGODB_URI=mongodb://your-mongodb-uri
export SERVER_PORT=8080
```

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

2. Check MongoDB connection string in `application.properties`

3. Verify MongoDB is accessible on the configured port (default: 27017)

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
