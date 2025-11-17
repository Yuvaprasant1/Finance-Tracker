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

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Endpoint

Update the API base URL in `src/services/api.service.ts` if your backend is running on a different host/port:

```typescript
constructor(baseURL: string = 'http://localhost:8080/finance-tracker/api/v1') {
  // ...
}
```

### 3. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000` in your browser.

## Configuration

### Environment Variables

The application uses environment variables to configure the backend API URL. The API service automatically reads from `REACT_APP_API_BASE_URL` environment variable.

#### Environment Files

The project includes example environment files:
- `.env.example` - Template for environment variables
- `.env.development` - Development environment variables
- `.env.production` - Production environment variables

#### Setting Up Environment Variables

1. **For Local Development:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Or create `.env` manually with:
     ```env
     REACT_APP_API_BASE_URL=http://localhost:8080/finance-tracker/api/v1
     ```

2. **For Production:**
   - Set `REACT_APP_API_BASE_URL` in your deployment platform (Render, Vercel, Netlify, etc.)
   - Or update `.env.production` before building

**Important:** Environment variables must be prefixed with `REACT_APP_` to be accessible in React applications. They are embedded at build time, so you need to rebuild if you change them.

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
frontend-web/
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

### Deployment on Render

#### Prerequisites

1. GitHub repository with your code
2. Render account (sign up at https://render.com)
3. Backend API deployed on Render (see [Backend README](../backend/README.md))

#### Deployment Steps

##### Option 1: Using Render Blueprint (Recommended)

1. **Connect Repository to Render:**
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` and create services automatically

2. **Configure Environment Variables:**
   - After services are created, go to the frontend service settings
   - Navigate to "Environment" section
   - Add the following environment variable:
     ```
     REACT_APP_API_BASE_URL=https://your-backend-service-name.onrender.com/finance-tracker/api/v1
     ```
   - Replace `your-backend-service-name` with your actual backend service name
   - Example: `https://finance-tracker-backend.onrender.com/finance-tracker/api/v1`

3. **Deploy:**
   - Render will automatically build and deploy
   - Monitor the build logs
   - Service will be available at `https://your-frontend-service-name.onrender.com`

##### Option 2: Manual Service Creation

1. **Create Static Site Service:**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the repository and branch

2. **Configure Service:**
   - **Name:** finance-tracker-frontend
   - **Build Command:** `cd frontend-web && npm install && npm run build`
   - **Publish Directory:** `frontend-web/build`
   - **Plan:** Free (or upgrade for production)
   - **Region:** Choose your preferred region (should match backend region)

3. **Set Environment Variables:**
   - In the "Environment" section, add:
     ```
     REACT_APP_API_BASE_URL=https://your-backend-service-name.onrender.com/finance-tracker/api/v1
     ```
   - Replace with your actual backend URL

4. **Configure Redirects (for React Router):**
   - The `_redirects` file in `public/` folder automatically handles routing
   - This file is included in the build and tells Render to serve `index.html` for all routes
   - If redirects don't work, manually configure in Render dashboard:
     - Go to "Redirects/Rewrites" section
     - Add: Source `/*` → Destination `/index.html` (Action: Rewrite)
   - This fixes 404 errors when refreshing pages like `/login` or `/dashboard`

5. **Deploy:**
   - Click "Create Static Site"
   - Render will build and deploy automatically
   - Monitor the build logs

##### Option 3: Docker Deployment (Advanced)

If you prefer Docker deployment with nginx:

1. **Create Web Service:**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

2. **Configure Service:**
   - **Name:** finance-tracker-frontend
   - **Environment:** Docker
   - **Dockerfile Path:** `./frontend-web/Dockerfile`
   - **Docker Context:** `./frontend-web`
   - **Plan:** Free (or upgrade for production)
   - **Region:** Choose your preferred region

3. **Set Environment Variables:**
   - `REACT_APP_API_BASE_URL=https://your-backend-service-name.onrender.com/finance-tracker/api/v1`

4. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy automatically

#### Render Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `https://finance-tracker-backend.onrender.com/finance-tracker/api/v1` | Yes |

**Important Notes:**
1. **Backend URL:** Make sure your backend is deployed and accessible before deploying the frontend
2. **HTTPS:** Use HTTPS URLs for production (Render provides HTTPS automatically)
3. **CORS:** Ensure your backend CORS configuration allows requests from your frontend domain
4. **Build Time:** Environment variables are embedded at build time, so changes require a rebuild

#### Render Deployment Configuration

**Build Settings:**
- **Build Command:** `cd frontend-web && npm install && npm run build`
- **Publish Directory:** `frontend-web/build`
- **Environment Variables:** Set `REACT_APP_API_BASE_URL` in Render dashboard

**Static Site Features:**
- **Auto-deploy:** Automatically deploys on git push to main branch
- **Logs:** View application logs in Render dashboard
- **SSL:** Automatic HTTPS/SSL certificates
- **Custom Domain:** Add your custom domain
- **SPA Routing:** Configured for React Router client-side routing
- **Fast Builds:** Static site deployment is faster than Docker builds

### Other Deployment Options

The `build` folder contains static files that can be deployed to:
- **Netlify** - Drag and drop the `build` folder or connect Git repository
- **Vercel** - Connect your Git repository
- **AWS S3 + CloudFront** - Upload `build` folder contents to S3 and serve via CloudFront
- **Nginx** - Serve the `build` folder using nginx
- **Apache** - Serve the `build` folder using Apache

**Note:** For other platforms, make sure to set the `REACT_APP_API_BASE_URL` environment variable during the build process.

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
