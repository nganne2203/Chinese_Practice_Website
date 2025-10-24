import React, { createContext, useContext, useEffect, useState } from 'react';
import type { LoginRequest } from '../types/Authentication';
import type { User } from '../types/User';
import { AUTH_API } from '../api/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
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

const getCurrentUser = (): User | null => {
    try {
        const userProfile = localStorage.getItem('userProfile');
        const accessToken = localStorage.getItem('accessToken');

        if (userProfile && accessToken) {
            const user = JSON.parse(userProfile);
            return {
                ...user
            };
        }

        return null;
    } catch (error) {
        console.error('Error parsing user profile:', error);
        return null;
    }
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

    const loginConst = async (credentials: LoginRequest): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);
        try {
            const result = await AUTH_API.login(credentials);

            if (result.user) {
                const authenticatedUser: User = {
                    ...result.user
                };
                setUser(authenticatedUser);
                return { success: true };
            } else {
                setUser(null);
                return { success: false, error: 'Invalid login response' };
            }
        } catch (error: any) {
            console.error('Login error in context:', error);
            setUser(null);
            return {
                success: false,
                error: error.message || 'An unexpected error occurred during login'
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setLoading(true);
        try {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userProfile');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = !!user;

    const value: AuthContextType = {
        user,
        loading,
        login: loginConst,
        logout,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};