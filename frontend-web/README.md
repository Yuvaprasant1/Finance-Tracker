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

Create a `.env` file in the `frontend-web` directory for environment-specific configuration:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/finance-tracker/api/v1
```

Update `api.service.ts` to use the environment variable:

```typescript
constructor(baseURL: string = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/finance-tracker/api/v1')
```

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

### Deploy

The `build` folder contains static files that can be deployed to:
- **Netlify** - Drag and drop the `build` folder
- **Vercel** - Connect your Git repository
- **AWS S3** - Upload `build` folder contents
- **Nginx** - Serve the `build` folder
- **Apache** - Serve the `build` folder

### Environment Configuration

For production, set environment variables:

```bash
REACT_APP_API_BASE_URL=https://your-api-domain.com/finance-tracker/api/v1
```

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
