import type { LoginRequest, LoginApiResponse, LoginResponse, RegisterRequest, RegisterApiResponse, RefreshTokenRequest, RefreshTokenApiResponse, IntrospectApiResponse, IntrospectRequest } from "../types/Authentication";
import apiClient from "../utils/apiClient";

const login = async (field: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post<LoginApiResponse>('/api/auth/login', field);

        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Login failed: Invalid response');
        }

        const { accessToken, refreshToken, user } = response.data.result;

        console.log('Login response:', response.data.result);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userProfile', JSON.stringify(user));

        return { accessToken, refreshToken, user };
    } catch (error: any) {
        console.error('Login failed:', error);
        if (error.response?.status === 400) throw new Error('User not found');
        if (error.response?.status === 403) throw new Error('Invalid credentials');
        if (error.response?.status === 500) throw new Error('Server error occurred');
        throw new Error(error.message || 'Login failed');
    }
};


const register = async (field: RegisterRequest): Promise<RegisterApiResponse> => {
    try {
        const response = await apiClient.post<RegisterApiResponse>('/api/auth/register', field);

        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Registration failed: Invalid response code');
        }

        console.log('Registration response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Registration failed:', error);
        switch (error.response?.status) {
            case 400:
                throw new Error('Invalid registration data');
            case 500:
                throw new Error('Server error occurred');
            default:
                throw new Error(error.message || 'Registration failed');
        }
    }
}

const refreshToken = async (field: RefreshTokenRequest): Promise<Omit<LoginResponse, 'user'>> => {
    try {
        const response = await apiClient.post<RefreshTokenApiResponse>('/api/auth/refresh', field);

        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Token refresh failed: Invalid response code');
        }
        console.log('Token refresh response:', response.data);
        return response.data.result;
    } catch (error: any) {
        console.error('Token refresh failed:', error);
        switch (error.response?.status) {
            case 400:
                throw new Error('User not found');
            case 401:
                throw new Error('Invalid refresh token');
            case 500:
                throw new Error('Server error occurred');
            default:
                throw new Error(error.message || 'Token refresh failed');
        }
    }
}

const logout = async (): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    await apiClient.post('/api/auth/logout', {
        accessToken,
        refreshToken
    });

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userProfile');
}

const introspect = async (field: IntrospectRequest): Promise<boolean> => {
    try {
        const response = await apiClient.post<IntrospectApiResponse>('/api/auth/introspect', field);

        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Introspection failed: Invalid response');
        }

        return response.data.result.valid;
    } catch (error) {
        console.error('Introspection failed:', error);
        return false;
    }
}

export const AUTH_API = {
    login,
    register,
    refreshToken,
    logout,
    introspect
}
