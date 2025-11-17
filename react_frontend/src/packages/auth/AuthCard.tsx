import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthCard.css';
import { apiService } from '../../services/api.service';
import { useUser } from '../../context/UserContext';
import { firebaseAuth } from '../../services/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const AuthCard: React.FC = () => {
  const navigate = useNavigate();
  const { saveEmail, saveUserId, saveIdToken } = useUser();

  const afterAuth = async (idToken: string, userId: string, userEmail: string) => {
    // Set auth token for Bearer authentication
    apiService.setAuthToken(idToken);
    saveIdToken(idToken);
    saveEmail(userEmail);
    saveUserId(userId); // Store UUID from backend
    navigate('/dashboard');
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const cred = GoogleAuthProvider.credentialFromResult(result);
      const googleIdToken = cred?.idToken;
      
      if (!googleIdToken) {
        alert('Failed to obtain Google ID token.');
        return;
      }
      
      // Get idToken from Firebase before signing out (needed for Bearer auth)
      const idToken = await result.user.getIdToken();
      
      // Call backend SSO endpoint which creates user and returns UUID
      const ssoResponse = await apiService.loginWithGoogleIdToken(googleIdToken);
      
      // Sign out the interim Firebase session
      await firebaseAuth.signOut();
      
      // Store userId (UUID), email, and idToken
      await afterAuth(idToken, ssoResponse.userId, ssoResponse.email);
    } catch (e: unknown) {
      console.error('Google sign-in failed:', e);
      alert('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="auth-split-container">
      {/* Left Panel - Branding */}
      <div className="auth-branding-panel">
        <div className="auth-branding-content">
          <h1 className="auth-branding-title">Finance Tracker</h1>
          <p className="auth-branding-tagline">Manage your finances with ease</p>
          <div className="auth-branding-features">
            <div className="auth-feature-item">
              <span className="auth-feature-icon">💰</span>
              <span>Track income and expenses</span>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon">📊</span>
              <span>Visualize your spending</span>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon">🎯</span>
              <span>Set financial goals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Authentication */}
      <div className="auth-login-panel">
        <div className="auth-login-content">
          <h2 className="auth-login-title">Welcome</h2>
          <p className="auth-login-subtitle">Sign in with your Google account to get started</p>
          
          <button type="button" className="auth-google-btn" onClick={loginWithGoogle}>
            <img 
              className="auth-google-icon" 
              alt="Google" 
              src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path fill='%234285F4' d='M24 9.5c3.54 0 6.71 1.23 9.21 3.61l6.9-6.9C35.9 2.06 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.01 6.22C12.4 14.27 17.74 9.5 24 9.5z'/><path fill='%2334A853' d='M46.5 24c0-1.64-.15-3.21-.44-4.71H24v9.02h12.7c-.55 2.98-2.23 5.51-4.76 7.2l7.32 5.68C43.94 36.78 46.5 30.87 46.5 24z'/><path fill='%23FBBC05' d='M10.57 28.44c-.48-1.45-.75-2.99-.75-4.44s.27-2.99.75-4.44l-8.01-6.22C.91 16.21 0 19.02 0 22c0 2.98.91 5.79 2.56 8.22l8.01-6.22z'/><path fill='%23EA4335' d='M24 48c6.48 0 11.94-2.13 15.92-5.79l-7.32-5.68c-2.02 1.36-4.6 2.17-8.6 2.17-6.26 0-11.6-4.77-13.43-11.22l-8.01 6.22C6.51 42.62 14.62 48 24 48z'/></svg>" 
            />
            <span>Continue with Google</span>
          </button>

          <p className="auth-login-footer">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
