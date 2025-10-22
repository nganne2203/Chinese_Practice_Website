import { type HskLevelApiResponse, type HskLevelRequest, type HskLevelResponse } from "../types/HskLevel";
import apiClient from "../utils/apiClient";

const getAllHSKLevels = async () : Promise<HskLevelResponse[]> => {
    try {
        const response = await apiClient.get<HskLevelApiResponse>('/api/hsk-levels');

        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch HSK levels: Invalid response code');
        }
        console.log('Fetched HSK levels:', response.data.result);
        return response.data.result;
    } catch (error: any) {
        console.log('Failed to fetch HSK levels:', error);
        throw new Error('Failed to fetch HSK levels');
    }
}

const getHskLevelById = async (id: string) : Promise<HskLevelResponse> => {
    try {
        const response = await apiClient.get<HskLevelApiResponse>(`/api/hsk-levels/${id}`);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch HSK level: Invalid response code');
        }
        console.log('Fetched HSK level:', response.data.result[0]);
        return response.data.result[0];
    } catch (error: any) {
        console.log('Failed to fetch HSK level:', error);
        throw new Error('Failed to fetch HSK level');
    }
}

const createHskLevel = async (field : HskLevelRequest) : Promise<HskLevelResponse> => {
    try {
        const response = await apiClient.post<HskLevelApiResponse>('/api/hsk-levels', field);

        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to create HSK level: Invalid response code');
        }
        console.log('Created HSK level:', response.data.result[0]);
        return response.data.result[0];
    } catch (error : any) {
        console.log('Failed to create HSK level:', error);
        throw new Error('Failed to create HSK level');
    }
}

const deleteHskLevel = async (id: string) : Promise<void> => {
    try {
        const response = await apiClient.delete<HskLevelApiResponse>(`/api/hsk-levels/${id}`);
        if (response.data.code !== 1000) {
            throw new Error('Failed to delete HSK level: Invalid response code');
        }
        console.log('Deleted HSK level:', id);
    } catch (error : any) {
        console.log('Failed to delete HSK level:', error);
        if (error.response?.status === 400) throw new Error('HSK level not found');

        if (error.response?.status === 500) throw new Error('Server error occurred');

        throw new Error('Failed to delete HSK level');
    }
}

export const HSK_LEVEL_API = {
    getAllHSKLevels,
    getHskLevelById,
    createHskLevel,
    deleteHskLevel
}