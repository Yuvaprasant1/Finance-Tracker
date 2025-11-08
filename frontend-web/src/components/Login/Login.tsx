import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { validatePhoneNumber, formatPhoneNumber } from '../../utils/formatters';
import { apiService } from '../../services/api.service';
import './Login.css';

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const { savePhoneNumber, saveUserId } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const cleanedPhone = formatPhoneNumber(phoneNumber);
    
    if (!validatePhoneNumber(cleanedPhone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      // Call login API - backend generates UUID and creates user if not exists
      const loginResponse = await apiService.login(cleanedPhone);
      
      // Save phone number and UUID from backend response
      savePhoneNumber(loginResponse.phoneNumber);
      saveUserId(loginResponse.userId);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to login. Please try again.');
    }
  };

  const handlePhoneNumberChange = (text: string): void => {
    setPhoneNumber(formatPhoneNumber(text));
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">Finance Tracker</h1>
        <p className="login-subtitle">Enter your phone number to continue</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <div className="phone-input-wrapper">
              <div className="country-code-selector">
                <span className="country-flag" title="India">🇮🇳</span>
                <span className="country-code">+91</span>
              </div>
              <input
                type="text"
                className="input-field phone-input"
                placeholder="Enter 10-digit phone number"
                value={phoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                maxLength={10}
                autoFocus
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

