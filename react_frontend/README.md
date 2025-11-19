# Finance Tracker - Frontend Web Application

Modern React TypeScript web application for tracking personal expenses. Built with React 18, TypeScript, and React Router.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)
- [Building for Production](#building-for-production)

## Prerequisites

- **Node.js** 14+ and **npm** (or yarn/pnpm)
- Backend API running (see [Backend README](../backend/README.md))
- Firebase project (for production deployment)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `react_frontend` directory with your configuration:

```env
# Backend API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080/finance-tracker/api/v1

# Firebase Configuration (get from Firebase Console)
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

**Note:** The API base URL is configured via environment variables, not hardcoded in the service file.

### 3. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000` in your browser.

## Configuration

### Environment Variables

The application uses environment variables to configure both the backend API URL and Firebase authentication. All environment variables must be prefixed with `REACT_APP_` to be accessible in React applications.

#### Required Environment Variables

**Firebase Configuration:**
- `REACT_APP_FIREBASE_API_KEY` - Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN` - Firebase authentication domain (e.g., `your-project.firebaseapp.com`)
- `REACT_APP_FIREBASE_PROJECT_ID` - Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket (e.g., `your-project.firebasestorage.app`)
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID` - Firebase app ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID (optional, for analytics)

**Backend API Configuration:**
- `REACT_APP_API_BASE_URL` - Backend API base URL (e.g., `http://localhost:8080/finance-tracker/api/v1`)

#### Environment Files

Create a `.env` file in the `react_frontend` directory with the following structure:

```env
# Firebase Configuration
# Get these values from Firebase Console → Project Settings → General → Your apps
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Backend API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080/finance-tracker/api/v1
```

#### Setting Up Environment Variables

1. **For Local Development:**
   - Create a `.env` file in the `react_frontend` directory
   - Add all required Firebase and API configuration variables
   - Get Firebase values from [Firebase Console](https://console.firebase.google.com/) → Project Settings → General → Your apps

2. **For Production:**
   - Set all environment variables in your deployment platform (Render, Vercel, Netlify, etc.)
   - Or create a `.env.production` file before building
   - **Important:** Never commit `.env` files with real credentials to version control

**Important Notes:**
- Environment variables must be prefixed with `REACT_APP_` to be accessible in React applications
- They are embedded at build time, so you need to rebuild if you change them
- The application will throw an error at startup if required Firebase environment variables are missing

## Running the Application

### Development Mode

```bash
npm start
```

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload when you make changes. You may also see lint errors in the console.

### Running Tests

```bash
npm test
```

Launches the test runner in interactive watch mode.

## Project Structure

```
react_frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── DatePicker/        # Date picker component
│   │   ├── Loading/           # Loading spinner component
│   │   ├── Login/             # Login component
│   │   ├── MenuBar/           # Navigation menu bar
│   │   ├── Modal/             # Modal dialog component
│   │   ├── Pagination/        # Pagination component
│   │   └── ui/                # UI utility components
│   ├── context/               # React Context providers
│   │   ├── LoadingContext.tsx # Loading state management
│   │   ├── ThemeContext.tsx   # Theme management
│   │   └── UserContext.tsx    # User state management
│   ├── packages/              # Feature modules
│   │   ├── dashboard/         # Dashboard page
│   │   ├── expense/           # Expense management
│   │   ├── transaction/       # Transaction listing
│   │   └── user-profile/      # User profile management
│   ├── services/              # API services
│   │   └── api.service.ts     # Centralized API client
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # Shared types and interfaces
│   ├── utils/                 # Utility functions
│   │   ├── dateUtils.ts       # Date formatting utilities
│   │   └── formatters.ts      # Number/currency formatters
│   ├── App.tsx                # Main application component
│   ├── App.css                # Global application styles
│   ├── index.tsx              # Application entry point
│   └── index.css              # Global styles
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Features

### 🔐 Authentication
- Phone number-based login system
- User session management with React Context

### 💰 Transaction Management
- **View Transactions** - Paginated list of all transactions
- **Add Transactions** - Create new income or expense entries
- **Edit Transactions** - Update existing transactions
- **Delete Transactions** - Remove transactions with confirmation
- **Filter by Type** - Filter by expense or income
- **Date Filtering** - Filter transactions by date range

### 📊 Dashboard
- **Summary Statistics** - Total income, expenses, and balance
- **Recent Transactions** - Quick view of latest transactions
- **Transaction Count** - Total number of transactions

### 👤 User Profile
- **Profile Management** - Update user name and email
- **Currency Selection** - Choose preferred currency
- **Profile Display** - View current user information

### 🎨 User Interface
- **Responsive Design** - Works on desktop and mobile devices
- **Dark/Light Theme** - Theme switching support
- **Loading States** - Visual feedback during API calls
- **Error Handling** - User-friendly error messages
- **Modal Dialogs** - Confirmation dialogs for actions
- **Pagination** - Efficient data loading and navigation

## Key Components

### API Service (`api.service.ts`)

Centralized HTTP client using Axios. Provides methods for:
- Authentication (login)
- Transaction CRUD operations
- Dashboard data fetching
- User profile management
- Currency management

Automatically handles:
- Loading state management
- Error handling
- Request/response interceptors
- Base URL configuration

### Context Providers

- **UserContext** - Manages authenticated user state
- **LoadingContext** - Global loading state management
- **ThemeContext** - Application theme management

### Feature Modules

Each feature module (`dashboard`, `expense`, `transaction`, `user-profile`) contains:
- Main component (`.tsx`)
- Service file (`.service.ts`) for API calls
- Styles (`.css`)

## Building for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Environment Configuration

The application uses environment variables to configure the backend API URL. Environment variables must be prefixed with `REACT_APP_` to be accessible in the React application.

#### Development Environment

For local development, create a `.env` file (or use `.env.development`):

```env
REACT_APP_API_BASE_URL=http://localhost:8080/finance-tracker/api/v1
```

#### Production Environment

For production builds, set the environment variable before building:

```bash
REACT_APP_API_BASE_URL=https://your-backend-domain.com/finance-tracker/api/v1 npm run build
```

Or create a `.env.production` file:

```env
REACT_APP_API_BASE_URL=https://your-backend-domain.com/finance-tracker/api/v1
```

**Note:** Environment variables are embedded at build time in React applications. You need to rebuild the application if you change environment variables.

## Deployment

This project is configured for automated deployment to **Firebase Hosting** using GitHub Actions.

### CI/CD Flow

1. **Push to main branch** with changes in `react_frontend/` triggers GitHub Actions workflow (`.github/workflows/firebase-deploy.yaml`)
2. **GitHub Actions** installs dependencies and builds the React app
3. **Environment variables** are injected from GitHub Variables
4. **Firebase CLI** deploys the build to Firebase Hosting

### Prerequisites

Before deploying, complete the Firebase setup:

1. **Follow the [Firebase Setup Guide](../.github/FIREBASE_SETUP.md)** for complete setup instructions
2. **Configure GitHub Secrets and Variables** as described in the Firebase Setup Guide

### Quick Setup Summary

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing project
   - Enable Firebase Hosting

2. **Get Firebase Configuration:**
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - Add a web app if not already added
   - Copy Firebase configuration values

3. **Get Firebase Service Account Key:**
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file

4. **Configure GitHub Secrets and Variables:**
   - See [Firebase Setup Guide](../.github/FIREBASE_SETUP.md) for detailed instructions
   - Required secret: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - Required variables: `FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_*`, `REACT_APP_API_BASE_URL`

### Deployment Workflow

#### Automatic Deployment

- Push code to `main` branch with changes in `react_frontend/` directory
- GitHub Actions automatically builds and deploys to Firebase Hosting
- Monitor deployment in GitHub Actions tab

#### Manual Deployment

You can also trigger the workflow manually:
1. Go to GitHub repository → Actions tab
2. Select "Deploy Frontend to Firebase Hosting" workflow
3. Click "Run workflow" → "Run workflow"

### Firebase Hosting Configuration

The deployment uses `firebase.json` for hosting configuration:

- **Public Directory:** `build` (React production build)
- **SPA Routing:** All routes rewrite to `/index.html` for React Router
- **Caching:** Static assets cached for 1 year
- **Headers:** Proper cache-control headers for assets

### Environment Variables

All environment variables are set via GitHub Variables and injected during build:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | `finance-tracker-abc123` | Yes |
| `REACT_APP_FIREBASE_API_KEY` | Firebase API key | `AIzaSyBxIMRdkFJQVm0U54vfZtztQ62TxWCG0bk` | Yes |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `finance-tracker-abc123.firebaseapp.com` | Yes |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID | `finance-tracker-abc123` | Yes |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `finance-tracker-abc123.appspot.com` | Yes |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `1058479237538` | Yes |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID | `1:1058479237538:web:ace1ebbe05721fe74c2afb` | Yes |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID | `G-3MYCLH6EHZ` | No |
| `REACT_APP_API_BASE_URL` | Backend API base URL | `https://your-backend-url.run.app/finance-tracker/api/v1` | Yes |

**Important Notes:**
1. **Backend URL:** Use your Cloud Run backend URL for `REACT_APP_API_BASE_URL`
2. **Build Time:** Environment variables are embedded at build time, so changes require a rebuild
3. **HTTPS:** Firebase Hosting provides HTTPS automatically
4. **CORS:** Ensure your backend CORS configuration allows requests from Firebase Hosting domain

### Manual Deployment using Firebase CLI

For manual deployment without GitHub Actions:

#### Prerequisites

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Authenticate:
   ```bash
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```bash
   cd react_frontend
   firebase init hosting
   ```

#### Build and Deploy

1. **Set Environment Variables:**
   Create a `.env.production` file or set environment variables:
   ```bash
   export REACT_APP_API_BASE_URL=https://your-backend-url.run.app/finance-tracker/api/v1
   export REACT_APP_FIREBASE_API_KEY=your-api-key
   # ... other Firebase variables
   ```

2. **Build the App:**
   ```bash
   npm run build
   ```

3. **Deploy to Firebase:**
   ```bash
   firebase deploy --only hosting
   ```

### Firebase Hosting Features

- **Auto-deploy:** Automatically deploys on git push via GitHub Actions
- **SSL:** Automatic HTTPS/SSL certificates
- **Custom Domain:** Add your custom domain in Firebase Console
- **SPA Routing:** Configured for React Router client-side routing
- **CDN:** Global CDN for fast content delivery
- **Rollback:** Easy rollback to previous versions in Firebase Console

### Viewing Deployment Logs

#### GitHub Actions Logs

- Go to your GitHub repository
- Navigate to **Actions** tab
- Click on the workflow run to see detailed build and deployment logs
- Each step shows verbose output including:
  - npm install progress
  - React build progress
  - Firebase deployment status

#### Firebase Console

- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project
- Navigate to **Hosting** → **Deployments**
- View deployment history and logs

### Troubleshooting Deployment

1. **Build Fails:**
   - Check GitHub Actions logs for npm install errors
   - Verify all environment variables are set correctly
   - Check for missing dependencies in `package.json`

2. **Firebase Authentication Fails:**
   - Verify `FIREBASE_SERVICE_ACCOUNT_KEY` secret contains valid JSON
   - Ensure service account has "Firebase Hosting Admin" role
   - Check that `FIREBASE_PROJECT_ID` variable matches your Firebase project

3. **Deployment Fails:**
   - Check Firebase project ID is correct
   - Verify Firebase Hosting is enabled in your Firebase project
   - Ensure the service account has proper permissions

4. **Environment Variables Missing:**
   - Verify all required variables are set in GitHub Variables
   - Check that variable names match exactly (case-sensitive)
   - Ensure `REACT_APP_` prefix is included for all React environment variables

### Other Deployment Options

The `build` folder contains static files that can be deployed to:
- **Netlify** - Drag and drop the `build` folder or connect Git repository
- **Vercel** - Connect your Git repository
- **AWS S3 + CloudFront** - Upload `build` folder contents to S3 and serve via CloudFront
- **Nginx** - Serve the `build` folder using nginx
- **Apache** - Serve the `build` folder using Apache

**Note:** For other platforms, make sure to set all `REACT_APP_*` environment variables during the build process.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Dependencies

### Core
- **react** ^18.2.0 - UI library
- **react-dom** ^18.2.0 - React DOM renderer
- **react-router-dom** ^6.20.0 - Routing
- **typescript** ^4.9.5 - Type safety

### UI Libraries
- **axios** ^1.6.2 - HTTP client
- **react-datepicker** ^8.8.0 - Date picker component
- **lucide-react** ^0.552.0 - Icon library

### Development
- **@types/react** ^18.2.0 - TypeScript types for React
- **@types/node** ^20.0.0 - TypeScript types for Node.js
- **react-scripts** 5.0.1 - Build tooling

## Troubleshooting

### API Connection Issues

1. Ensure backend API is running (see [Backend README](../backend/README.md))
2. Check API base URL in `api.service.ts`
3. Verify CORS is enabled on backend
4. Check browser console for error messages

### Build Errors

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

### Port Already in Use

Set a different port:
```bash
PORT=3001 npm start
```

## Development Tips

### Adding New Features

1. Create component in `src/components/` or `src/packages/`
2. Add API methods to `api.service.ts` if needed
3. Add types to `src/types/index.ts`
4. Update routing in `App.tsx` if adding new pages

### Styling

- Component-specific styles in `ComponentName.css`
- Global styles in `index.css`
- Use CSS modules or styled-components for scoped styles

### State Management

- Use React Context for global state (user, theme, loading)
- Use local state for component-specific data
- Consider Redux for complex state management if needed

## License

This project is for personal/educational use.
