import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface UserContextType {
  userId: string | null;
  email: string | null;
  idToken: string | null;
  saveUserId: (id: string) => void;
  clearUserId: () => void;
  saveEmail: (email: string) => void;
  clearEmail: () => void;
  saveIdToken: (token: string) => void;
  clearIdToken: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}


export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    loadUserId();
    loadEmail();
    loadIdToken();
  }, []);

  const loadUserId = (): void => {
    try {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } catch (error) {
      console.error('Error loading user ID:', error);
    }
  };

  const loadEmail = (): void => {
    try {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    } catch (error) {
      console.error('Error loading email:', error);
    }
  };

  const loadIdToken = (): void => {
    try {
      const stored = localStorage.getItem('idToken');
      if (stored) {
        setIdToken(stored);
      }
    } catch (error) {
      console.error('Error loading id token:', error);
    }
  };

  const saveUserId = (id: string): void => {
    try {
      localStorage.setItem('userId', id);
      setUserId(id);
    } catch (error) {
      console.error('Error saving user ID:', error);
      throw error;
    }
  };

  const clearUserId = (): void => {
    try {
      localStorage.removeItem('userId');
      setUserId(null);
      // Also clear email and token for consistency
      clearEmail();
      clearIdToken();
    } catch (error) {
      console.error('Error clearing user ID:', error);
    }
  };

  const saveEmail = (value: string): void => {
    try {
      localStorage.setItem('email', value);
      setEmail(value);
    } catch (error) {
      console.error('Error saving email:', error);
      throw error;
    }
  };

  const clearEmail = (): void => {
    try {
      localStorage.removeItem('email');
      setEmail(null);
    } catch (error) {
      console.error('Error clearing email:', error);
    }
  };

  const saveIdToken = (token: string): void => {
    try {
      localStorage.setItem('idToken', token);
      setIdToken(token);
    } catch (error) {
      console.error('Error saving id token:', error);
      throw error;
    }
  };

  const clearIdToken = (): void => {
    try {
      localStorage.removeItem('idToken');
      setIdToken(null);
    } catch (error) {
      console.error('Error clearing id token:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        email,
        idToken,
        saveUserId,
        clearUserId,
        saveEmail,
        clearEmail,
        saveIdToken,
        clearIdToken
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

