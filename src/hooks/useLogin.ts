import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { FieldType } from '../types/Login';

interface UseLoginReturn {
  loginData: FieldType;
  setLoginData: React.Dispatch<React.SetStateAction<FieldType>>;
  handleLogin: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const useLogin = (): UseLoginReturn => {
  const { login } = useAuth();
  const [loginData, setLoginData] = useState<FieldType>({
    userName: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (): Promise<void> => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await login(loginData);
      
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
      // Success case is handled by the AuthContext
      // The component can listen to auth state changes
    } catch (err) {
      console.error('Login error in hook:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    loginData,
    setLoginData,
    handleLogin,
    loading,
    error,
    clearError
  };
};

export default useLogin;