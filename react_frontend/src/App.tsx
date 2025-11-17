import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';
import { apiService } from './services/api.service';
import Loading from './components/Loading/Loading';
import MenuBar from './components/MenuBar/MenuBar';
import { AuthCard } from './packages/auth';
import Dashboard from './packages/dashboard/Dashboard';
import Transaction from './packages/transaction/Transaction';
import TransactionDetails from './packages/trasnaction-detail/TransactionDetails';
import UserProfile from './packages/user-profile/UserProfile';
import './App.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useUser();
  return userId ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    // Initialize ApiService with loading context
    // This enables automatic loading management via axios interceptors
    apiService.setLoadingContext({
      startLoading,
      stopLoading,
    });
  }, [startLoading, stopLoading]);

  return (
    <Router>
      <div className="App">
        <Loading />
        <Routes>
          <Route path="/login" element={<AuthCard />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MenuBar />
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/transaction"
            element={
              <PrivateRoute>
                <MenuBar />
                <Transaction />
              </PrivateRoute>
            }
          />
          <Route
            path="/expense"
            element={
              <PrivateRoute>
                <MenuBar />
                <TransactionDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <MenuBar />
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
};

export default App;

