import { type RoleApiResponse, type RoleRequest, type RoleResponse } from "../types/Role";
import apiClient from "../utils/apiClient";

const getRoles = async () : Promise<RoleResponse[]> => {
    try {
        const response = await apiClient.get<RoleApiResponse>('/api/roles');

        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch roles: Invalid response code');
        }
        console.log('Fetched roles:', response.data.result);
        return response.data.result;
    } catch (error: any) {
        console.error('Error fetching roles:', error);
        throw error;
    }
}

const createRole = async (field : RoleRequest) : Promise<RoleResponse> => {
    try {
        const response = await apiClient.post<RoleApiResponse>('/api/roles', field);

        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to create role: Invalid response code');
        }
        console.log('Created role:', response.data.result[0]);
        return response.data.result[0];
    } catch (error : any) {
        console.log('Failed to create role:', error);
        throw new Error('Failed to create role');
    }
}

const deleteRole = async (id : string) : Promise<void> => {
    try {
        const response = await apiClient.delete<RoleApiResponse>(`/api/roles/${id}`);

        if (response.data.code !== 1000) {
            throw new Error('Failed to delete role: Invalid response code');
        }
        console.log('Deleted role:', id);
    } catch (error : any) {
        console.error('Error deleting role:', error);
        throw error;
    }
}

export const ROLE_API = {
    getRoles,
    createRole,
    deleteRole
}