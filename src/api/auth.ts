import type { FieldType } from "../types/Login";
import apiClient from "./apiClient";

export const login = async (field: FieldType) => {
    try {
        const response = await apiClient.post('/auth/login', {
            userName: field.userName,
            password: field.password
        });

        const { token } = response.data.result.token;
        console.log('Login response token:', token);
        let profile = null;
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                profile = {
                    userName: payload.sub,
                    expiresAt: payload.exp,
                    role: payload.scope
                };

                console.log('User profile:', profile);

                if (token) localStorage.setItem('accessToken', token);
                if (profile) localStorage.setItem('userProfile', JSON.stringify(profile));

                return {
                    success: true,
                    data: {
                        token,
                        profile
                    }
                };
            } catch (error) {
                console.error('Fetching user profile failed:', error);
            }
        }
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};
