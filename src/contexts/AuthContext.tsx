import React, { createContext, useContext, useEffect, useState } from 'react';
import type { FieldType, User } from '../types/Login';
import { loginUser, logoutUser, getCurrentUser } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: FieldType) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load existing auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkExistingAuth();
  }, []);

  const login = async (credentials: FieldType): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const result = await loginUser(credentials);
      
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      } else {
        setUser(null);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error in context:', error);
      setUser(null);
      return { 
        success: false, 
        error: 'An unexpected error occurred during login' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    try {
      logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = user?.isAuthenticated ?? false;

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};