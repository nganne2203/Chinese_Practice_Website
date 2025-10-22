import { type UnitApiResponse, type UnitRequest, type UnitResponse } from "../types/Unit";
import apiClient from "../utils/apiClient";

const getUnitById = async (id : string) : Promise<UnitResponse> => {
    try {
        const response = await apiClient.get<UnitApiResponse>(`/api/units/${id}`);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch permissions: Invalid response code');
        }
        console.log('Fetched permissions:', response.data.result);
        return response.data.result[0];
    } catch (error : any) {
        throw new Error("Failed to fetch unit");
    }
}

const getUnits = async (level ?: string) : Promise<UnitResponse[]> => {
    try {
        const response = await apiClient.get<UnitApiResponse>('/api/units?level=' + (level ?? ''));
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch permissions: Invalid response code');
        }
        console.log('Fetched permissions:', response.data.result);
        return response.data.result;
    } catch (error : any) {
        throw new Error("Failed to fetch units");
    }
}

const createUnit = async (field : UnitRequest) : Promise<UnitResponse> => {
    try {
        const response = await apiClient.post<UnitApiResponse>('/api/units', field);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to create unit: Invalid response code');
        }
        console.log('Created unit:', response.data.result);
        return response.data.result[0];
    } catch (error : any) {
        throw new Error("Failed to create unit");
    }
}

const updateUnit = async (id : string, field : UnitRequest) : Promise<UnitResponse> => {
    try {
        const response = await apiClient.put<UnitApiResponse>(`/api/units/${id}`, field);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to update unit: Invalid response code');
        }
        console.log('Updated unit:', response.data.result);
        return response.data.result[0];
    } catch (error : any) {
        if (error.response?.status === 500) throw new Error('Server error occurred');
        if (error.response?.status === 404) throw new Error('Unit not found');
        if (error.response?.status === 400) throw new Error('HSK level does not exist');
        throw new Error("Failed to update unit");
    }
}

const deleteUnit = async (id : string) : Promise<void> => {
    try {
        const response = await apiClient.delete<UnitApiResponse>(`/api/units/${id}`);   
        if (response.data.code !== 1000) {
            throw new Error('Failed to delete unit: Invalid response code');
        }
        console.log('Deleted unit:', id);
    } catch (error : any) {
        console.log('Failed to delete unit:', error);
        if (error.response?.status === 500) throw new Error('Server error occurred');
        throw new Error('Failed to delete unit');
    }
}

export const UNIT_API = {
    getUnitById,
    getUnits,
    createUnit,
    updateUnit,
    deleteUnit
}