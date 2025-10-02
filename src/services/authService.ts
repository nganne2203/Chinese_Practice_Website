import * as yup from 'yup';
import type { FieldType, LoginResponse, User } from '../types/Login';
import apiClient from '../api/apiClient';
import { getUserRole, getUsername, isTokenExpired } from '../utils/jwtUtils';

export const AuthSchema = yup.object().shape({
  userName: yup
    .string()
    .required('Username is required'),
  password: yup
    .string()
    .required('Password is required')
});

export async function validateAuth(auth: FieldType) {
    try {
        await AuthSchema.validate(auth, { abortEarly: false });
        return { valid: true, errors: {} };
    } catch (err: unknown) {
        const errors: Record<string, string> = {};
        if (err instanceof yup.ValidationError) {
            if (err.inner && Array.isArray(err.inner)) {
                err.inner.forEach((e: yup.ValidationError) => {
                    if (e.path && !errors[e.path]) {
                        errors[e.path] = e.message;
                    }
                });
            } else if (err.path && err.message) {
                errors[err.path] = err.message;
            }
        }
        console.log('Validation errors:', errors); 
        return { valid: false, errors };
    }
}

export async function loginUser(credentials: FieldType): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
        const validation = await validateAuth(credentials);
        if (!validation.valid) {
            return { 
                success: false, 
                error: Object.values(validation.errors).join(', ') 
            };
        }

        const response = await apiClient.post<LoginResponse>('/auth/login', {
            username: credentials.userName,
            password: credentials.password
        });

        const loginResponse = response.data;

        if (loginResponse.code === 1000 && loginResponse.result.authenticated) {
            const { token } = loginResponse.result;

            if (isTokenExpired(token)) {
                return { 
                    success: false, 
                    error: 'Received expired token' 
                };
            }

            const username = getUsername(token);
            const role = getUserRole(token);

            if (!username || !role) {
                return { 
                    success: false, 
                    error: 'Invalid token payload' 
                };
            }

            const user: User = {
                username,
                role,
                isAuthenticated: true
            };

            localStorage.setItem('accessToken', token);
            localStorage.setItem('userProfile', JSON.stringify(user));

            return { success: true, user };
        } else {
            return { 
                success: false, 
                error: 'Login failed - invalid credentials' 
            };
        }
    } catch (error: any) {
        console.error('Login error:', error);
        
        if (error.response?.status === 401) {
            return { 
                success: false, 
                error: 'Invalid username or password' 
            };
        } else if (error.response?.status === 429) {
            return { 
                success: false, 
                error: 'Too many login attempts. Please try again later.' 
            };
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
            return { 
                success: false, 
                error: 'Network error. Please check your connection.' 
            };
        } else {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed. Please try again.' 
            };
        }
    }
}

export function logoutUser(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userProfile');
}

export function getCurrentUser(): User | null {
    try {
        const userProfile = localStorage.getItem('userProfile');
        const accessToken = localStorage.getItem('accessToken');
        
        if (!userProfile || !accessToken) {
            return null;
        }

        if (isTokenExpired(accessToken)) {
            logoutUser();
            return null;
        }

        return JSON.parse(userProfile) as User;
    } catch (error) {
        console.error('Failed to get current user:', error);
        logoutUser();
        return null;
    }
}
