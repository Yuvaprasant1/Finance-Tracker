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

## Deployment

### Deploy on Render

This project includes a `render.yaml` blueprint for easy deployment on Render.

#### Prerequisites

1. GitHub repository with your code
2. Render account (sign up at https://render.com)
3. MongoDB Atlas database (or other MongoDB instance)

#### Quick Deployment

1. **Connect Repository to Render:**
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` and create services automatically

2. **Configure Environment Variables:**
   
   **Backend Service:**
   - `SPRING_PROFILES_ACTIVE=prod`
   - `MONGODB_URI=your-mongodb-connection-string` (required)
   - `MONGODB_DATABASE=finance_tracker` (optional)
   - `SERVER_PORT=8080` (optional)

   **Frontend Service:**
   - `REACT_APP_API_BASE_URL=https://your-backend-service-name.onrender.com/finance-tracker/api/v1` (required)
   - Replace `your-backend-service-name` with your actual backend service name
   - **Build Command:** `cd frontend-web && npm install && npm run build`
   - **Publish Directory:** `frontend-web/build`

3. **Deploy:**
   - Render will automatically build and deploy both services
   - Monitor the build logs
   - Services will be available at:
     - Backend: `https://your-backend-service-name.onrender.com`
     - Frontend: `https://your-frontend-service-name.onrender.com`

#### Detailed Deployment Guides

- [Backend Deployment Guide](backend/README.md#deployment-on-render) - Complete backend deployment instructions
- [Frontend Deployment Guide](frontend-web/README.md#deployment-on-render) - Complete frontend deployment instructions

#### Important Notes

1. **MongoDB Atlas:** Configure network access to allow connections from Render (IP: `0.0.0.0/0` or specific Render IPs)
2. **Environment Variables:** Set sensitive variables in Render dashboard, not in `render.yaml`
3. **Backend First:** Deploy backend first, then use its URL for frontend configuration
4. **CORS:** Ensure backend CORS configuration allows requests from frontend domain

## Documentation

- [Backend README](backend/README.md) - Backend API documentation and deployment guide
- [Frontend README](frontend-web/README.md) - Frontend application documentation and deployment guide

## License

This project is for personal/educational use.

