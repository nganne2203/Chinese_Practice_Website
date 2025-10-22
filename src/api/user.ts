import type { User, UserApiResponse, UserChangePasswordRequest, UserRequest, UserUpdateProfileRequest, UserUpdateRoleRequest } from "../types/User";
import apiClient from "../utils/apiClient";

const deleteUser = async (id : string) : Promise<void> => {
    try {
        await apiClient.delete(`/api/users/${id}`);
        console.log(`Deleted user with id: ${id}`);
    } catch (error : any) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

const getUserById = async (id : string) : Promise<User> => {
    try {
        const response = await apiClient.get<UserApiResponse>(`/api/users/${id}`);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch user: Invalid response code');
        }
        console.log('Fetched user:', response.data.result);
        return response.data.result[0];
    } catch (error : any) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

const getAllUsers = async () : Promise<User[]> => {
    try {
        const response = await apiClient.get<UserApiResponse>('/api/users');
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch users: Invalid response code');
        }
        console.log('Fetched users:', response.data.result);
        return response.data.result;
    } catch (error : any) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

const getMyInfo = async () : Promise<User> => {
    try {
        const response = await apiClient.get<UserApiResponse>('/api/users/my-info');
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch my info: Invalid response code');
        }
        console.log('Fetched my info:', response.data.result);
        return response.data.result[0];
    } catch (error : any) {
        console.error('Error fetching my info:', error);
        throw error;
    }
}

const createUser = async (field : UserRequest) : Promise<User> => {
    try {
        const response = await apiClient.post<UserApiResponse>('/api/users', field);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to create user: Invalid response code');
        }
        console.log('Created user:', response.data.result);
        return response.data.result[0];
    } catch (error : any) {
        console.error('Error creating user:', error);
        throw error;
    }
}

const updateRoleUser = async (id : string, field : UserUpdateRoleRequest) : Promise<void> => {
    try {
        await apiClient.post(`/api/users/role-update/${id}`, field);
        console.log(`Updated roles for user with id: ${id}`);
    } catch (error : any) {
        console.error('Error updating user roles:', error);
        throw error;
    }
}

const changePassword = async (id: string, field : UserChangePasswordRequest) : Promise<void> => {
    try {
        await apiClient.post(`/api/users/change-password/${id}`, field);
        console.log(`Changed password for user with id: ${id}`);
    } catch (error : any) {
        console.error('Error changing user password:', error);
        throw error;
    }
}

const updateUserProfile = async (id : string, field : UserUpdateProfileRequest) : Promise<void> => {
    try {
        await apiClient.put(`/api/users/${id}`, field);
        console.log(`Updated profile for user with id: ${id}`);
    } catch (error : any) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

export const USER_API = {
    deleteUser,
    getUserById,
    getAllUsers,
    getMyInfo,
    createUser,
    updateRoleUser,
    changePassword,
    updateUserProfile
}