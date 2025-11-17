import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { userProfileService } from './user-profile.service';
import { UserProfileDTO, CurrencyDTO } from '../../types';
import { validateEmail } from '../../utils/formatters';
import { User, Mail, DollarSign, MapPin, Save, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const { email: ctxEmail, userId } = useUser();
  const navigate = useNavigate();
  const [loading, setLoadingLocal] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [currency, setCurrency] = useState<string>('INR');
  const [address, setAddress] = useState<string>('');
  const [canEditCurrency, setCanEditCurrency] = useState<boolean>(true);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState<boolean>(false);
  const [currencies, setCurrencies] = useState<CurrencyDTO[]>([]);

  useEffect(() => {
    if (userId) {
      loadUserProfile();
      loadCurrencies();
    }
  }, [userId]);

  const loadCurrencies = async (): Promise<void> => {
    try {
      const currenciesData = await userProfileService.getAllCurrencies();
      setCurrencies(currenciesData);
    } catch (error) {
      console.error('Failed to load currencies:', error);
      // Fallback to default currencies if API fails
      setCurrencies([
        { id: '', code: 'INR', symbol: '₹', name: 'Indian Rupee', isActive: true },
        { id: '', code: 'USD', symbol: '$', name: 'US Dollar', isActive: true },
        { id: '', code: 'EUR', symbol: '€', name: 'Euro', isActive: true },
        { id: '', code: 'GBP', symbol: '£', name: 'British Pound', isActive: true },
        { id: '', code: 'JPY', symbol: '¥', name: 'Japanese Yen', isActive: true },
        { id: '', code: 'AUD', symbol: 'A$', name: 'Australian Dollar', isActive: true },
        { id: '', code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', isActive: true },
        { id: '', code: 'CNY', symbol: '¥', name: 'Chinese Yuan', isActive: true },
      ]);
    }
  };

  const loadUserProfile = async (): Promise<void> => {
    if (!userId) return;

    try {
      setLoadingLocal(true);
      // Loading state is automatically managed by ApiService interceptors with default "Loading..." message
      const profile = await userProfileService.getUserProfile(userId);
      if (profile) {
        setName(profile.name || '');
        setEmail(profile.email || '');
        setCurrency(profile.currency || 'INR');
        setAddress(profile.address || '');
        setCanEditCurrency(profile.canEditCurrency !== false); // Default to true if not set
        
      }
    } catch (error) {
      alert('Failed to load user profile. Please try again.');
    } finally {
      setLoadingLocal(false);
    }
  };

  const validateForm = (): boolean => {
    if (email && !validateEmail(email)) {
      alert('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm() || !userId) return;

    setSaving(true);
    try {
      const profileData = {
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        currency: canEditCurrency ? (currency || 'INR') : undefined, // Only send currency if editable
        address: address.trim() || undefined,
      };

      // Loading state is automatically managed by ApiService interceptors with default "Loading..." message
      const updatedProfile = await userProfileService.updateUserProfile(userId, profileData);
      setCanEditCurrency(updatedProfile.canEditCurrency !== false);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const selectedCurrency = currencies.find(c => c.code === currency) || currencies.find(c => c.code === 'INR') || currencies[0];

  if (!userId) {
    return null;
  }

  if (loading) {
    return (
      <div className="user-profile-container">
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <h1>
          <User size={20} className="header-icon" />
          User Profile
        </h1>
      </div>

      <div className="user-profile-content">
        <form onSubmit={handleSubmit} className="user-profile-form">
          <div className="form-group">
            <label className="form-label">
              <Mail size={18} className="label-icon" />
              Email (from sign-in)
            </label>
            <input
              type="text"
              className="form-input disabled"
              value={ctxEmail || ''}
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <User size={18} className="label-icon" />
              Name
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={18} className="label-icon" />
              Email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <DollarSign size={18} className="label-icon" />
              Currency
              {!canEditCurrency && (
                <span className="currency-disabled-hint" title="Currency cannot be changed after creating expenses">
                  <AlertCircle size={14} />
                </span>
              )}
            </label>
            <div className="currency-selector">
              <button
                type="button"
                className={`currency-button ${!canEditCurrency ? 'disabled' : ''}`}
                onClick={() => canEditCurrency && setShowCurrencyPicker(!showCurrencyPicker)}
                disabled={!canEditCurrency}
                title={!canEditCurrency ? 'Currency cannot be changed after creating expenses' : 'Select currency'}
              >
                <span>
                  {selectedCurrency ? `${selectedCurrency.symbol} ${selectedCurrency.code} - ${selectedCurrency.name}` : 'Select Currency'}
                </span>
                {canEditCurrency && (showCurrencyPicker ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
              </button>
              {showCurrencyPicker && canEditCurrency && (
                <div className="currency-picker">
                  {currencies.filter(c => c.isActive).map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      className={`currency-option ${currency === curr.code ? 'selected' : ''}`}
                      onClick={() => {
                        setCurrency(curr.code);
                        setShowCurrencyPicker(false);
                      }}
                    >
                      {curr.symbol} {curr.code} - {curr.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!canEditCurrency && (
              <p className="currency-disabled-message">
                Currency cannot be changed after creating expenses to maintain data consistency.
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <MapPin size={18} className="label-icon" />
              Address
            </label>
            <textarea
              className="form-input form-textarea"
              placeholder="Enter your address (optional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={saving}
              title={saving ? 'Saving...' : 'Save and Close'}
              aria-label={saving ? 'Saving...' : 'Save and Close'}
            >
              <Save size={20} />
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/dashboard')}
            >
              <X size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

