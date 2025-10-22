import type { PermissionApiResponse, PermissionRequest, PermissionResponse } from "../types/Permission";
import apiClient from "../utils/apiClient";

const getPermission = async () : Promise<PermissionResponse[]> => {
    try {
        const response = await apiClient.get<PermissionApiResponse>('/api/permissions');

        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch permissions: Invalid response code');
        }
        console.log('Fetched permissions:', response.data.result);
        return response.data.result;
    } catch (error: any) {
        console.log('Failed to fetch permissions:', error);
        throw new Error('Failed to fetch permissions');
    }
}

const createPermission = async (field : PermissionRequest) : Promise<PermissionResponse> => {
    try {
        const response = await apiClient.post<PermissionApiResponse>('/api/permissions', field);

        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to create permission: Invalid response code');
        }
        console.log('Created permission:', response.data.result);
        return response.data.result[0];
    } catch (error: any) {
        console.log('Failed to create permission:', error);
        throw new Error('Failed to create permission');
    }
}

const deletePermission = async (id : string) : Promise<void> => {
    try {
        const response = await apiClient.delete<PermissionApiResponse>(`/api/permissions/${id}`);
        if (response.data.code !== 1000) {
            throw new Error('Failed to delete permission: Invalid response code');
        }   
        console.log('Deleted permission:', id);
    } catch (error : any) {
        console.log('Failed to delete permission:', error);
        if (error.response?.status === 500) throw new Error('Server error occurred');
        throw new Error('Failed to delete permission');
    }
}

export const PERMISSION_API = {
    getPermission,
    createPermission,
    deletePermission
}

