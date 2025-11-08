# Finance Tracker

A full-stack personal expense tracking application built with Spring Boot and React TypeScript.

## Project Structure

```
Finance-Tracker/
├── backend/          # Spring Boot REST API
└── frontend-web/     # React TypeScript Web Application
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
   cd frontend-web
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

## Documentation

- [Backend README](backend/README.md) - Backend API documentation
- [Frontend README](frontend-web/README.md) - Frontend application documentation

## License

This project is for personal/educational use.

