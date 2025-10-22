import { type VocabularyApiResponse, type VocabularyRequest, type VocabularyResponse } from "../types/Vocabulary";
import apiClient from "../utils/apiClient";

const getVocabularyById = async (id : string) : Promise<VocabularyResponse> => {
    try {
        const response = await apiClient.get<VocabularyApiResponse>(`/api/vocabularies/${id}`);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch vocabulary: Invalid response code');
        }
        console.log('Fetched vocabulary:', response.data.result);
        return response.data.result[0];
    } catch (error : any) {
        console.error('Error fetching vocabulary:', error);
        throw error;
    }
}

const getAllVocabularies = async () : Promise<VocabularyResponse[]> => {
    try {
        const response = await apiClient.get<VocabularyApiResponse>('/api/vocabularies/all');
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch vocabularies: Invalid response code');
        }
        console.log('Fetched vocabularies:', response.data.result);
        return response.data.result;
    } catch (error : any) {
        console.error('Error fetching vocabularies:', error);
        throw error;
    }
}

const searchVocabulariesByKeyword = async (keyword : string) : Promise<VocabularyResponse[]> => {
    try {
        const response = await apiClient.get<VocabularyApiResponse>(`/api/vocabularies/search?keyword=${keyword}`);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to search vocabularies: Invalid response code');
        }
        console.log('Searched vocabularies:', response.data.result);
        return response.data.result;
    } catch (error : any) {
        console.error('Error searching vocabularies:', error);
        throw error;
    }
}

const getVocabularyByUnitAndLevel = async (unit : string, level : string) : Promise<VocabularyResponse[]> => {
    try {
        const response = await apiClient.get<VocabularyApiResponse>(`/api/vocabularies?unit=${unit}?level=${level}`);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to fetch vocabularies: Invalid response code');
        }
        console.log('Fetched vocabularies by unit and level:', response.data.result);
        return response.data.result;
    } catch (error : any) {
        console.error('Error fetching vocabularies by unit and level:', error);
        throw error;
    }
}

const createVocabulary = async (field : VocabularyRequest) : Promise<VocabularyResponse> => {
    try {
        const response = await apiClient.post<VocabularyApiResponse>('/api/vocabularies', field);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to create vocabulary: Invalid response code');
        }
        console.log('Created vocabulary:', response.data.result);
        return response.data.result[0];
    } catch (error : any) {
        console.error('Error creating vocabulary:', error);
        throw error;
    }
}

const updateVocabulary = async (id : string, field : VocabularyRequest) : Promise<VocabularyResponse> => {
    try {
        const response = await apiClient.put<VocabularyApiResponse>(`/api/vocabularies/${id}`, field);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error('Failed to update vocabulary: Invalid response code');
        }   
        console.log('Updated vocabulary:', response.data.result);
        return response.data.result[0];
    } catch (error : any) {
        console.error('Error updating vocabulary:', error);
        throw error;
    }
}
const deleteVocabulary = async (id : string) : Promise<void> => {
    try {
        await apiClient.delete(`/api/vocabularies/${id}`);
        console.log('Deleted vocabulary with id:', id);
    } catch (error : any) {
        console.error('Error deleting vocabulary:', error);
        throw error;
    }
}

export const VOCABULARY__API = {
    getVocabularyById,
    getAllVocabularies,
    searchVocabulariesByKeyword,
    getVocabularyByUnitAndLevel,
    createVocabulary,
    updateVocabulary,
    deleteVocabulary
};