import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface UserContextType {
  userId: string | null;
  phoneNumber: string | null;
  saveUserId: (id: string) => void;
  clearUserId: () => void;
  savePhoneNumber: (phone: string) => void;
  clearPhoneNumber: () => void;
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
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    loadUserId();
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
    } catch (error) {
      console.error('Error clearing user ID:', error);
    }
  };

  const savePhoneNumber = (phone: string): void => {
    // Keep phone number in memory only, not in localStorage
    setPhoneNumber(phone);
  };

  const clearPhoneNumber = (): void => {
    // Clear phone number from memory only
    setPhoneNumber(null);
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        phoneNumber,
        saveUserId,
        clearUserId,
        savePhoneNumber,
        clearPhoneNumber
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

